import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { getSetting, setSetting, getWorkers, upsertWorker, deleteWorker } from '../repo.js';

export default function Settings() {
  const navigate = useNavigate();
  const [rate, setRate] = useState('75.00');
  const [workers, setWorkers] = useState([]);
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerRate, setNewWorkerRate] = useState('');

  const load = async () => {
    const cents = await getSetting('defaultHourlyRate', 7500);
    setRate((cents / 100).toFixed(2));
    setWorkers(await getWorkers());
  };

  useEffect(() => {
    load();
  }, []);

  const saveRate = async () => {
    await setSetting('defaultHourlyRate', Math.round(Number(rate || 0) * 100));
  };

  const addWorker = async () => {
    if (!newWorkerName.trim()) return;
    await upsertWorker({ name: newWorkerName.trim(), hourlyRate: Math.round(Number(newWorkerRate || 0) * 100) });
    setNewWorkerName('');
    setNewWorkerRate('');
    load();
  };

  const removeWorker = async (id) => {
    if (id === 'me') return;
    await deleteWorker(id);
    load();
  };

  return (
    <Screen title="Settings" onBack={() => navigate('/home')}>
      <div className="group-header">Your Hourly Rate</div>
      <div className="row-actions">
        <input
          className="field-input"
          inputMode="decimal"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          onBlur={saveRate}
        />
      </div>

      <div className="group-header">Workers / Helpers</div>
      <div className="stack">
        {workers.map((w) => (
          <div key={w.id} className="line-item-row">
            <span className="desc">{w.name}</span>
            <span className="cost">
              ${(w.hourlyRate / 100).toFixed(2)}/hr
              {w.id !== 'me' && (
                <button className="skip-link" style={{ display: 'inline', padding: '0 0 0 10px' }} onClick={() => removeWorker(w.id)}>
                  ✕
                </button>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="stack" style={{ marginTop: 12 }}>
        <input className="field-input" placeholder="Worker name" value={newWorkerName} onChange={(e) => setNewWorkerName(e.target.value)} />
        <input
          className="field-input"
          placeholder="Hourly rate"
          inputMode="decimal"
          value={newWorkerRate}
          onChange={(e) => setNewWorkerRate(e.target.value)}
        />
        <button className="big-btn" onClick={addWorker}>
          + Add Worker
        </button>
      </div>

      <div className="hint" style={{ marginTop: 24, textAlign: 'center' }}>
        Everything is stored locally on this device. No account, no cloud, no login.
      </div>
    </Screen>
  );
}
