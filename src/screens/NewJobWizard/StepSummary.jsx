import { useState } from 'react';
import Screen from '../../components/Screen.jsx';

export default function StepSummary({ draft, onSave, onEdit, onBack }) {
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await onSave();
  };

  return (
    <Screen title="Summary" onBack={onBack}>
      <div className="summary-card">
        <div className="summary-name">{draft.customer.name}</div>
        <div className="summary-sub">{draft.jobType || 'No job type'}</div>

        <div className="summary-row">
          <span className="label">Phone</span>
          <span>{draft.customer.phone || '—'}</span>
        </div>
        <div className="summary-row">
          <span className="label">Email</span>
          <span>{draft.customer.email || '—'}</span>
        </div>
        <div className="summary-row">
          <span className="label">Address</span>
          <span>{draft.customer.address || '—'}</span>
        </div>
        <div className="summary-row">
          <span className="label">Found via</span>
          <span>{draft.contactMethod || '—'}</span>
        </div>
        <div className="summary-row">
          <span className="label">Photos</span>
          <span>{draft.photos.length}</span>
        </div>
        <div className="summary-row">
          <span className="label">Notes</span>
          <span>{draft.notes.trim() ? '✓' : '—'}</span>
        </div>
      </div>

      <div className="footer-actions">
        <button className="big-btn primary" disabled={saving} onClick={save}>
          {saving ? 'Saving…' : 'Save Job'}
        </button>
        <button className="big-btn" onClick={onEdit}>
          Edit Anything
        </button>
      </div>
    </Screen>
  );
}
