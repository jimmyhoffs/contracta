import Screen from '../../components/Screen.jsx';
import { CONTACT_METHODS } from '../../constants.js';

export default function StepContactMethod({ draft, patch, next, back }) {
  const pick = (method) => {
    patch({ contactMethod: method });
    next();
  };

  return (
    <Screen title="New Job" onBack={back}>
      <div className="prompt-title">How did this customer contact you?</div>
      <div className="list-grid">
        {CONTACT_METHODS.map((m) => (
          <button
            key={m}
            className={`list-tile${draft.contactMethod === m ? ' selected' : ''}`}
            onClick={() => pick(m)}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="hint" style={{ marginTop: 16 }}>
        This will help later with business statistics — completely local.
      </div>
    </Screen>
  );
}
