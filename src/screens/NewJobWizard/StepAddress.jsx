import { useState } from 'react';
import Screen from '../../components/Screen.jsx';
import { useClipboardMatch, matchAddress } from '../../hooks/useClipboardMatch.js';

export default function StepAddress({ draft, patchCustomer, next, back }) {
  const existing = draft.customer.address;
  const { value: found, checked } = useClipboardMatch(matchAddress);
  const [editing, setEditing] = useState(!!existing);
  const [address, setAddress] = useState(existing);

  const useFound = () => {
    patchCustomer({ address: found });
    next();
  };

  const skip = () => {
    patchCustomer({ address: '' });
    next();
  };

  const submitManual = () => {
    patchCustomer({ address: address.trim() });
    next();
  };

  const openMaps = (addr) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(addr)}`, '_blank', 'noopener');
  };

  const showFound = checked && found && !editing && !existing;

  return (
    <Screen title="New Job" onBack={back}>
      <div className="prompt-title">Address</div>

      {showFound && (
        <div className="detected-card">
          <div className="detected-label">I found</div>
          <div className="detected-value">{found}</div>
          <div className="row-actions">
            <button className="pill-btn confirm" onClick={useFound}>
              ✓ Use
            </button>
            <button className="pill-btn" onClick={() => openMaps(found)}>
              📍 Maps
            </button>
            <button className="pill-btn" onClick={() => setEditing(true)}>
              ✎ Edit
            </button>
          </div>
        </div>
      )}

      {(!showFound || editing) && (
        <>
          <input
            autoFocus
            className="field-input"
            placeholder="123 Maple Cres, Edmonton"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {address.trim() && (
            <button className="pill-btn" style={{ marginTop: 10 }} onClick={() => openMaps(address)}>
              📍 Open in Maps
            </button>
          )}
        </>
      )}

      <div className="footer-actions">
        {(!showFound || editing) && (
          <button className="big-btn primary" disabled={!address.trim()} onClick={submitManual}>
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
