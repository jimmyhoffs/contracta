import { useNavigate } from 'react-router-dom';

const CHECKS = [
  { label: 'Did you get enough photos?', to: 'photos' },
  { label: 'Did you measure the roof?', to: 'measurements' },
  { label: 'Generate estimate now?', to: 'estimate' },
  { label: 'Add materials?', to: 'materials' },
  { label: 'Invoice later?', to: 'invoice' },
];

export default function LeavingSiteModal({ jobId, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Before you go…</div>
        <div className="stack">
          {CHECKS.map((c) => (
            <button
              key={c.to}
              className="big-btn"
              onClick={() => navigate(`/jobs/${jobId}/${c.to}`)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button className="skip-link" onClick={onClose}>
          Done for now
        </button>
      </div>
    </div>
  );
}
