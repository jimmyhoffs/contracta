import { STAGES } from '../constants.js';

export default function StageTracker({ stage, onChange }) {
  const currentIdx = STAGES.indexOf(stage);

  return (
    <div className="stage-track">
      {STAGES.map((s, idx) => {
        const cls = idx === currentIdx ? 'current' : idx < currentIdx ? 'done' : '';
        return (
          <button key={s} className={`stage-item ${cls}`} onClick={() => onChange(s)}>
            <span className="stage-dot" />
            <span className="label">{s}</span>
          </button>
        );
      })}
    </div>
  );
}
