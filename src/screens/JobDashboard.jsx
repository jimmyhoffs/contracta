import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import StageTracker from '../components/StageTracker.jsx';
import HereCard from '../components/HereCard.jsx';
import { getJob, getCustomer, setStage } from '../repo.js';
import { openExternal } from '../utils/openExternal.js';

const FEATURES = [
  { key: 'photos', emoji: '📷', label: 'Photos' },
  { key: 'measurements', emoji: '📐', label: 'Measurements' },
  { key: 'estimate', emoji: '🧮', label: 'Estimate' },
  { key: 'invoice', emoji: '🧾', label: 'Invoice' },
  { key: 'materials', emoji: '📋', label: 'Materials' },
  { key: 'notes', emoji: '📝', label: 'Notes' },
  { key: 'payments', emoji: '💲', label: 'Payments' },
  { key: 'documents', emoji: '📎', label: 'Documents' },
  { key: 'contact', emoji: '☎', label: 'Contact' },
  { key: 'navigate', emoji: '🗺', label: 'Navigate' },
  { key: 'more', emoji: '⋮', label: 'More' },
];

export default function JobDashboard() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [customer, setCustomer] = useState(null);

  const load = useCallback(async () => {
    const j = await getJob(jobId);
    if (!j) return;
    setJob(j);
    setCustomer(await getCustomer(j.customerId));
  }, [jobId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!job || !customer) {
    return (
      <Screen title="Job" onBack={() => navigate('/jobs')}>
        <div className="empty-state">Loading…</div>
      </Screen>
    );
  }

  const handleStage = async (stage) => {
    await setStage(jobId, stage);
    setJob((j) => ({ ...j, stage }));
  };

  const handleFeature = (key) => {
    if (key === 'contact') {
      if (customer.phone) openExternal(`tel:${customer.phone}`);
      else alert('No phone number on file.');
      return;
    }
    if (key === 'navigate') {
      if (customer.address) {
        openExternal(`https://maps.google.com/?q=${encodeURIComponent(customer.address)}`);
      } else {
        alert('No address on file.');
      }
      return;
    }
    navigate(`/jobs/${jobId}/${key}`);
  };

  return (
    <Screen title={customer.name} onBack={() => navigate('/jobs')}>
      <div className="job-header">
        <div className="summary-sub">{job.jobType}</div>
      </div>

      <StageTracker stage={job.stage} onChange={handleStage} />

      <HereCard jobId={jobId} hourlyRate={job.hourlyRate} onActivity={load} />

      <button className="big-btn subtle" onClick={() => navigate(`/jobs/${jobId}/timeline`)}>
        🕘 View Timeline
      </button>

      <div className="feature-grid">
        {FEATURES.map((f) => (
          <button key={f.key} className="feature-tile" onClick={() => handleFeature(f.key)}>
            <span className="emoji">{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>
    </Screen>
  );
}
