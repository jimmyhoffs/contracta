import Screen from '../../components/Screen.jsx';
import { JOB_TYPES } from '../../constants.js';

export default function StepJobType({ draft, patch, next, back }) {
  const pick = (key) => {
    patch({ jobType: key });
    next();
  };

  return (
    <Screen title="New Job" onBack={back}>
      <div className="prompt-title">What type of work?</div>
      <div className="icon-grid">
        {JOB_TYPES.map((t) => (
          <button
            key={t.key}
            className={`icon-tile${draft.jobType === t.key ? ' selected' : ''}`}
            onClick={() => pick(t.key)}
          >
            <span className="emoji">{t.icon}</span>
            {t.key}
          </button>
        ))}
      </div>
    </Screen>
  );
}
