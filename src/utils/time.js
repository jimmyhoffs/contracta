export function formatDuration(ms) {
  if (!ms || ms < 0) ms = 0;
  const totalMinutes = Math.round(ms / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

export function formatClock(dateLike) {
  const d = new Date(dateLike);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function formatDay(dateLike) {
  const d = new Date(dateLike);
  return d.toLocaleDateString([], { month: 'long', day: 'numeric' });
}

export function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
