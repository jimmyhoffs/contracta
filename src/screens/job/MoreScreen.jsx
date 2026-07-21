import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Screen from '../../components/Screen.jsx';
import { getJob, getCustomer, upsertCustomer, deleteJob } from '../../repo.js';

export default function MoreScreen() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    getJob(jobId).then((j) => getCustomer(j.customerId)).then(setCustomer);
  }, [jobId]);

  if (!customer) return null;

  const set = (field) => (e) => {
    setCustomer((c) => ({ ...c, [field]: e.target.value }));
    setSaved(false);
  };

  const save = async () => {
    await upsertCustomer(customer);
    setSaved(true);
  };

  const remove = async () => {
    if (!confirm('Delete this job permanently? This cannot be undone.')) return;
    await deleteJob(jobId);
    navigate('/jobs');
  };

  return (
    <Screen title="More">
      <div className="group-header">Customer Info</div>
      <div className="stack">
        <input className="field-input" placeholder="Name" value={customer.name} onChange={set('name')} />
        <input className="field-input" placeholder="Phone" value={customer.phone} onChange={set('phone')} />
        <input className="field-input" placeholder="Email" value={customer.email} onChange={set('email')} />
        <input className="field-input" placeholder="Address" value={customer.address} onChange={set('address')} />
        <button className="big-btn primary" disabled={saved} onClick={save}>
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="group-header">Job</div>
      <button className="big-btn" onClick={() => navigate(`/jobs/${jobId}/timeline`)}>
        🕘 View Timeline
      </button>

      <div className="footer-actions">
        <button className="big-btn" style={{ color: 'var(--red)', borderColor: 'var(--red)' }} onClick={remove}>
          🗑 Delete Job
        </button>
      </div>
    </Screen>
  );
}
