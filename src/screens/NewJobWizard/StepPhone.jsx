import { useState } from 'react';
import Screen from '../../components/Screen.jsx';
import { useClipboardMatch, matchPhone } from '../../hooks/useClipboardMatch.js';

export default function StepPhone({ draft, patchCustomer, next, back }) {
  const existing = draft.customer.phone;
  const { value: found, checked } = useClipboardMatch(matchPhone);
  const [editing, setEditing] = useState(!!existing);
  const [phone, setPhone] = useState(existing);

  const useFound = () => {
    patchCustomer({ phone: found });
    next();
  };

  const skip = () => {
    patchCustomer({ phone: '' });
    next();
  };

  const submitManual = () => {
    patchCustomer({ phone: phone.trim() });
    next();
  };

  const showFound = checked && found && !editing && !existing;

  return (
    <Screen title="New Job" onBack={back}>
      <div className="prompt-title">Phone Number</div>

      {showFound && (
        <div className="detected-card">
          <div className="detected-label">I found this on your clipboard</div>
          <div className="detected-value">{found}</div>
          <div className="row-actions">
            <button className="pill-btn confirm" onClick={useFound}>
              ✓ Use Clipboard
            </button>
            <button className="pill-btn" onClick={() => setEditing(true)}>
              ✎ Enter Different
            </button>
          </div>
        </div>
      )}

      {(!showFound || editing) && (
        <input
          autoFocus
          className="field-input"
          placeholder="780-555-1234"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      )}

      <div className="footer-actions">
        {(!showFound || editing) && (
          <button className="big-btn primary" disabled={!phone.trim()} onClick={submitManual}>
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
