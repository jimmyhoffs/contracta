import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Screen from '../../components/Screen.jsx';
import { getJob, updateJob, logEvent } from '../../repo.js';

export default function MeasurementsScreen() {
  const { jobId } = useParams();
  const [measurements, setMeasurements] = useState('');
  const [saved, setSaved] = useState(true);
  const [hadValue, setHadValue] = useState(false);

  useEffect(() => {
    getJob(jobId).then((j) => {
      setMeasurements(j?.measurements || '');
      setHadValue(!!j?.measurements);
    });
  }, [jobId]);

  const save = async () => {
    await updateJob(jobId, { measurements });
    if (measurements.trim() && !hadValue) {
      await logEvent(jobId, 'Measurements completed');
      setHadValue(true);
    }
    setSaved(true);
  };

  return (
    <Screen title="Measurements">
      <div className="hint">Roof sections, dimensions, squares, pitch — whatever you need to remember.</div>
      <textarea
        className="field-input"
        placeholder="South slope: 22' x 40'. Pitch 6/12. 5 squares."
        value={measurements}
        onChange={(e) => {
          setMeasurements(e.target.value);
          setSaved(false);
        }}
      />
      <div className="footer-actions">
        <button className="big-btn primary" disabled={saved} onClick={save}>
          {saved ? 'Saved' : 'Save Measurements'}
        </button>
      </div>
    </Screen>
  );
}
