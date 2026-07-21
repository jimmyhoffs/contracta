import { useEffect, useState } from 'react';
import {
  getActiveSession,
  getSessions,
  getWorkers,
  clockIn,
  clockOut,
} from '../repo.js';
import { formatDuration, formatClock, formatDay, formatMoney } from '../utils/time.js';
import { totalDuration, totalsByWorker, laborCents, sessionDuration } from '../utils/labor.js';
import LeavingSiteModal from './LeavingSiteModal.jsx';

export default function HereCard({ jobId, hourlyRate, onActivity }) {
  const [active, setActive] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [showLeaving, setShowLeaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const refresh = async () => {
    const [a, s, w] = await Promise.all([getActiveSession(jobId), getSessions(jobId), getWorkers()]);
    setActive(a);
    setSessions(s);
    setWorkers(w);
  };

  useEffect(() => {
    refresh();
  }, [jobId]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  const handleHere = async () => {
    await clockIn(jobId, 'me');
    await refresh();
    onActivity?.();
  };

  const handleGone = async () => {
    await clockOut(jobId);
    await refresh();
    onActivity?.();
    setShowLeaving(true);
  };

  const completed = sessions.filter((s) => s.end);
  const lastVisit = completed[completed.length - 1];
  const total = totalDuration(sessions, now);
  const byWorker = totalsByWorker(sessions, workers, now);
  const laborTotal = byWorker.reduce(
    (sum, { worker, ms }) => sum + laborCents(ms, worker.hourlyRate ?? hourlyRate),
    0,
  );

  return (
    <>
      <div className={`here-card ${active ? 'active' : 'idle'}`}>
        {active ? (
          <>
            <button className="here-btn stop" onClick={handleGone}>
              🔴 I'm Gone
            </button>
            <div className="here-stats">
              <div className="here-stat">
                <div className="label">Arrived</div>
                <div className="value">{formatClock(active.start)}</div>
              </div>
              <div className="here-stat">
                <div className="label">Elapsed</div>
                <div className="value timer-live">{formatDuration(now - active.start)}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <button className="here-btn go" onClick={handleHere}>
              🟢 I'm Here
            </button>
            <div className="here-stats">
              <div className="here-stat">
                <div className="label">Last Visit</div>
                <div className="value">
                  {lastVisit ? `${formatDay(lastVisit.start)}` : '—'}
                </div>
                {lastVisit && (
                  <div className="hint" style={{ marginTop: 4 }}>
                    {formatClock(lastVisit.start)} – {formatClock(lastVisit.end)}
                  </div>
                )}
              </div>
              <div className="here-stat">
                <div className="label">Total Time</div>
                <div className="value">{formatDuration(total)}</div>
              </div>
            </div>
          </>
        )}

        {sessions.length > 0 && (
          <button className="skip-link" style={{ marginTop: 12 }} onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Hide visit log ▲' : `View ${sessions.length} visit${sessions.length > 1 ? 's' : ''} ▼`}
          </button>
        )}

        {expanded && (
          <div style={{ marginTop: 8 }}>
            {sessions.map((s, idx) => (
              <div key={s.id} className="visit-row">
                <span>Visit #{idx + 1}</span>
                <span>{formatDuration(sessionDuration(s, now))}</span>
              </div>
            ))}

            {byWorker.length > 1 &&
              byWorker.map(({ worker, ms }) => (
                <div key={worker.id} className="visit-row">
                  <span>{worker.name}</span>
                  <span>{formatDuration(ms)}</span>
                </div>
              ))}

            <div className="total-bar">
              <span>Total</span>
              <span>{formatDuration(total)}</span>
            </div>
            <div className="total-bar">
              <span>Labor Total</span>
              <span>{formatMoney(laborTotal)}</span>
            </div>
          </div>
        )}
      </div>

      {showLeaving && <LeavingSiteModal jobId={jobId} onClose={() => setShowLeaving(false)} />}
    </>
  );
}
