import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Screen from '../../components/Screen.jsx';
import { getLineItems, addLineItem, deleteLineItem, logEvent } from '../../repo.js';
import { formatMoney } from '../../utils/time.js';

export default function LineItemsScreen({ kind, title, simple }) {
  const { jobId } = useParams();
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitCost, setUnitCost] = useState('');

  const load = () => getLineItems(jobId, kind).then(setItems);

  useEffect(() => {
    load();
  }, [jobId, kind]);

  const add = async () => {
    if (!description.trim()) return;
    await addLineItem(jobId, kind, {
      description: description.trim(),
      quantity: Number(quantity) || 1,
      unitCost: simple ? 0 : Math.round(Number(unitCost || 0) * 100),
    });
    if (kind === 'estimate') await logEvent(jobId, 'Estimate updated');
    if (kind === 'invoice') await logEvent(jobId, 'Invoice updated');
    if (kind === 'materials') await logEvent(jobId, 'Material list updated');
    setDescription('');
    setQuantity('1');
    setUnitCost('');
    load();
  };

  const remove = async (id) => {
    await deleteLineItem(id);
    load();
  };

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);

  return (
    <Screen title={title}>
      {items.length === 0 ? (
        <div className="empty-state">Nothing added yet.</div>
      ) : (
        <div className="stack" style={{ marginBottom: 20 }}>
          {items.map((i) => (
            <div key={i.id} className="line-item-row" onClick={() => remove(i.id)}>
              <span className="desc">
                {i.quantity} × {i.description}
              </span>
              {!simple && <span className="cost">{formatMoney(i.quantity * i.unitCost)}</span>}
            </div>
          ))}
        </div>
      )}

      {!simple && items.length > 0 && (
        <div className="total-bar">
          <span>Total</span>
          <span>{formatMoney(total)}</span>
        </div>
      )}

      <div className="footer-actions">
        <div className="stack">
          <input
            className="field-input"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="row-actions">
            <input
              className="field-input"
              placeholder="Qty"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {!simple && (
              <input
                className="field-input"
                placeholder="Unit cost"
                inputMode="decimal"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
              />
            )}
          </div>
          <button className="big-btn primary" onClick={add}>
            + Add
          </button>
        </div>
      </div>
    </Screen>
  );
}
