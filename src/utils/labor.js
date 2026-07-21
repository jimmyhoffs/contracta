export function sessionDuration(session, now = Date.now()) {
  const end = session.end ?? now;
  return Math.max(0, end - session.start);
}

export function totalDuration(sessions, now = Date.now()) {
  return sessions.reduce((sum, s) => sum + sessionDuration(s, now), 0);
}

export function totalsByWorker(sessions, workers, now = Date.now()) {
  const byId = Object.fromEntries(workers.map((w) => [w.id, w]));
  const totals = {};
  for (const s of sessions) {
    totals[s.workerId] = (totals[s.workerId] || 0) + sessionDuration(s, now);
  }
  return Object.entries(totals).map(([workerId, ms]) => ({
    worker: byId[workerId] || { id: workerId, name: 'Unknown', hourlyRate: 0 },
    ms,
  }));
}

export function laborCents(ms, hourlyRateCents) {
  return Math.round((ms / 3600000) * hourlyRateCents);
}
