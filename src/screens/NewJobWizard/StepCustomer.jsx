import { useEffect, useState } from 'react';
import Screen from '../../components/Screen.jsx';
import { findCustomersByName } from '../../repo.js';

export default function StepCustomer({ draft, patchCustomer, next, back }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const q = draft.customer.name.trim();
    findCustomersByName(q).then(setSuggestions);
  }, [draft.customer.name]);

  const pick = (customer) => {
    patchCustomer({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    });
    next();
  };

  return (
    <Screen title="New Job" onBack={back}>
      <div className="prompt-title">Who is the customer?</div>
      <input
        autoFocus
        className="field-input"
        placeholder="Customer name"
        value={draft.customer.name}
        onChange={(e) => patchCustomer({ id: null, name: e.target.value })}
      />

      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((c) => (
            <button key={c.id} className="suggestion-item" onClick={() => pick(c)}>
              {c.name}
              {c.address && <div className="sub">{c.address}</div>}
            </button>
          ))}
        </div>
      )}

      <div className="footer-actions">
        <button className="big-btn primary" disabled={!draft.customer.name.trim()} onClick={next}>
          Next
        </button>
      </div>
    </Screen>
  );
}
