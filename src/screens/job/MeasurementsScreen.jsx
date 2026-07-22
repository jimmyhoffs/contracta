import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getJob, getCustomer, updateJob, addPhoto, logEvent } from '../../repo.js';

function dataUrlToBlob(dataUrl) {
  const [meta, b64] = dataUrl.split(',');
  const mime = meta.match(/:(.*?);/)[1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function summaryText(summary) {
  const areaLabel = summary.unit === 'ft' ? 'sq ft' : `${summary.unit}²`;
  const parts = [`${Math.round(summary.areaTotal)} ${areaLabel}`];
  if (summary.unit === 'ft' && summary.squares) parts.push(`${summary.squares.toFixed(2)} squares`);
  if (summary.pitch && summary.pitch !== 'Flat') parts.push(`pitch ${summary.pitch}`);
  parts.push(`${summary.areaCount} section${summary.areaCount === 1 ? '' : 's'}`);
  if (summary.lineCount) parts.push(`${summary.lineCount} line${summary.lineCount === 1 ? '' : 's'}`);
  return parts.join(' · ');
}

export default function MeasurementsScreen() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [job, setJob] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    getJob(jobId).then(async (j) => {
      setJob(j);
      if (j) setCustomer(await getCustomer(j.customerId));
    });
  }, [jobId]);

  const handleIframeLoad = useCallback(() => {
    if (!customer) return;
    const jobName = [customer.name, customer.address].filter(Boolean).join(' — ');
    iframeRef.current?.contentWindow?.postMessage({ type: 'roof-measure:init', jobName }, '*');
  }, [customer]);

  useEffect(() => {
    async function onMessage(e) {
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data?.type !== 'roof-measure:save') return;

      const blob = dataUrlToBlob(e.data.dataUrl);
      await addPhoto(jobId, blob);
      const text = summaryText(e.data.summary);
      await updateJob(jobId, { measurements: text });
      await logEvent(jobId, `Measurements completed: ${text}`);
      setJob((j) => ({ ...j, measurements: text }));
      setSavedMsg('Saved to job photos ✓');
      setTimeout(() => setSavedMsg(''), 4000);
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [jobId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="screen-header" style={{ padding: '12px 16px 8px', marginBottom: 0 }}>
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Back">
          ←
        </button>
        <div className="screen-title">Measurements</div>
      </div>

      {(job?.measurements || savedMsg) && (
        <div style={{ padding: '0 16px 8px', fontSize: 13, color: savedMsg ? 'var(--green)' : 'var(--text-dim)' }}>
          {savedMsg || `Last saved: ${job.measurements}`}
        </div>
      )}

      <iframe
        ref={iframeRef}
        title="Roof Measure"
        src="/tools/roof-measure.html"
        onLoad={handleIframeLoad}
        style={{ flex: 1, border: 'none', width: '100%' }}
      />
    </div>
  );
}
