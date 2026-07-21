import { useState } from 'react';
import Screen from '../../components/Screen.jsx';
import { useClipboardMatch, matchEmail } from '../../hooks/useClipboardMatch.js';

export default function StepEmail({ draft, patchCustomer, next, back }) {
  const existing = draft.customer.email;
  const { value: found, checked } = useClipboardMatch(matchEmail);
  const [editing, setEditing] = useState(!!existing);
  const [email, setEmail] = useState(existing);

  const useFound = () => {
    patchCustomer({ email: found });
    next();
  };

  const skip = () => {
    patchCustomer({ email: '' });
    next();
  };

  const submitManual = () => {
    patchCustomer({ email: email.trim() });
    next();
  };

  const showFound = checked && found && !editing && !existing;

  return (
    <Screen title="New Job" onBack={back}>
      <div className="prompt-title">Email</div>

      {showFound && (
        <div className="detected-card">
          <div className="detected-label">I found</div>
          <div className="detected-value">{found}</div>
          <div className="row-actions">
            <button className="pill-btn confirm" onClick={useFound}>
              ✓ Use
            </button>
            <button className="pill-btn" onClick={() => setEditing(true)}>
              ✎ Edit
            </button>
          </div>
        </div>
      )}

      {(!showFound || editing) && (
        <input
          autoFocus
          className="field-input"
          placeholder="john@gmail.com"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      <div className="footer-actions">
        {(!showFound || editing) && (
          <button className="big-btn primary" disabled={!email.trim()} onClick={submitManual}>
            Next
          </button>
        )}
        <button className="skip-link" onClick={skip}>
          Skip
        </button>
      </div>
    </Screen>
  );
}
