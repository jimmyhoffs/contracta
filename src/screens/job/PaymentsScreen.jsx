import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Screen from '../../components/Screen.jsx';
import { getPayments, addPayment } from '../../repo.js';
import { formatMoney, formatDay } from '../../utils/time.js';

export default function PaymentsScreen() {
  const { jobId } = useParams();
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const load = () => getPayments(jobId).then(setPayments);

  useEffect(() => {
    load();
  }, [jobId]);

  const add = async () => {
    const cents = Math.round(Number(amount || 0) * 100);
    if (!cents) return;
    await addPayment(jobId, cents, note.trim());
    setAmount('');
    setNote('');
    load();
  };

  const total = payments.reduce((sum, p) => sum + p.amountCents, 0);

  return (
    <Screen title="Payments">
      {payments.length === 0 ? (
        <div className="empty-state">No payments recorded yet.</div>
      ) : (
        <div className="stack" style={{ marginBottom: 20 }}>
          {payments.map((p) => (
            <div key={p.id} className="line-item-row">
              <span className="desc">
                {formatDay(p.createdAt)}
                {p.note ? ` · ${p.note}` : ''}
              </span>
              <span className="cost">{formatMoney(p.amountCents)}</span>
            </div>
          ))}
        </div>
      )}

      {payments.length > 0 && (
        <div className="total-bar">
          <span>Total Received</span>
          <span>{formatMoney(total)}</span>
        </div>
      )}

      <div className="footer-actions">
        <div className="stack">
          <input
            className="field-input"
            placeholder="Amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input className="field-input" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="big-btn primary" onClick={add}>
            + Add Payment
          </button>
        </div>
      </div>
    </Screen>
  );
}
