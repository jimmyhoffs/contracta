import { getDB, getAll, getByIndex, get, put, del, uid, getSetting, setSetting } from './db';

export async function logEvent(jobId, text) {
  const event = { id: uid(), jobId, timestamp: Date.now(), text };
  await put('timelineEvents', event);
  return event;
}

export async function getTimeline(jobId) {
  const events = await getByIndex('timelineEvents', 'jobId', jobId);
  return events.sort((a, b) => a.timestamp - b.timestamp);
}

// --- Customers -------------------------------------------------------

export async function findCustomersByName(query) {
  const all = await getAll('customers');
  if (!query) return all.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
  const q = query.toLowerCase();
  return all
    .filter((c) => c.name.toLowerCase().includes(q))
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5);
}

export async function upsertCustomer(customer) {
  const existing = customer.id ? await get('customers', customer.id) : null;
  const record = {
    id: customer.id || uid(),
    name: customer.name || '',
    phone: customer.phone || '',
    email: customer.email || '',
    address: customer.address || '',
    updatedAt: Date.now(),
    createdAt: existing?.createdAt || Date.now(),
  };
  await put('customers', record);
  return record;
}

// --- Jobs --------------------------------------------------------------

export async function createJob(draft) {
  const customer = await upsertCustomer(draft.customer);
  const job = {
    id: uid(),
    customerId: customer.id,
    jobType: draft.jobType,
    contactMethod: draft.contactMethod,
    notes: draft.notes || '',
    stage: 'New',
    hourlyRate: await getSetting('defaultHourlyRate', 7500),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await put('jobs', job);
  await logEvent(job.id, 'Job created');
  if (draft.photos?.length) {
    await Promise.all(draft.photos.map((blob) => addPhoto(job.id, blob)));
    await logEvent(job.id, `${draft.photos.length} photo${draft.photos.length > 1 ? 's' : ''} added`);
  }
  if (draft.notes) {
    await logEvent(job.id, 'Job notes added');
  }
  return job;
}

export async function getJob(jobId) {
  return get('jobs', jobId);
}

export async function getCustomer(customerId) {
  return get('customers', customerId);
}

export async function updateJob(jobId, patch) {
  const job = await get('jobs', jobId);
  const updated = { ...job, ...patch, updatedAt: Date.now() };
  await put('jobs', updated);
  return updated;
}

export async function setStage(jobId, stage) {
  await updateJob(jobId, { stage });
  await logEvent(jobId, `Stage changed to ${stage}`);
}

export async function getAllJobsWithCustomers() {
  const jobs = await getAll('jobs');
  const customers = await getAll('customers');
  const byId = Object.fromEntries(customers.map((c) => [c.id, c]));
  return jobs
    .map((job) => ({ ...job, customer: byId[job.customerId] }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function deleteJob(jobId) {
  await del('jobs', jobId);
}

// --- Photos --------------------------------------------------------------

export async function addPhoto(jobId, blob) {
  const photo = { id: uid(), jobId, blob, createdAt: Date.now() };
  await put('photos', photo);
  return photo;
}

export async function getPhotos(jobId) {
  const photos = await getByIndex('photos', 'jobId', jobId);
  return photos.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deletePhoto(photoId) {
  await del('photos', photoId);
}

// --- Documents -------------------------------------------------------------

export async function addDocument(jobId, name, blob) {
  const doc = { id: uid(), jobId, name, blob, createdAt: Date.now() };
  await put('documents', doc);
  return doc;
}

export async function getDocuments(jobId) {
  const docs = await getByIndex('documents', 'jobId', jobId);
  return docs.sort((a, b) => b.createdAt - a.createdAt);
}

// --- Work sessions / time tracking -----------------------------------------

export async function getActiveSession(jobId) {
  const sessions = await getByIndex('workSessions', 'jobId', jobId);
  return sessions.find((s) => !s.end) || null;
}

export async function getSessions(jobId) {
  const sessions = await getByIndex('workSessions', 'jobId', jobId);
  return sessions.sort((a, b) => a.start - b.start);
}

export async function clockIn(jobId, workerId) {
  const active = await getActiveSession(jobId);
  if (active) return active;
  const session = { id: uid(), jobId, workerId: workerId || 'me', start: Date.now(), end: null };
  await put('workSessions', session);
  await logEvent(jobId, 'Arrived on site');
  return session;
}

export async function clockOut(jobId) {
  const active = await getActiveSession(jobId);
  if (!active) return null;
  const updated = { ...active, end: Date.now() };
  await put('workSessions', updated);
  await logEvent(jobId, 'Left site');
  return updated;
}

export async function getWorkers() {
  const workers = await getAll('workers');
  if (workers.length === 0) {
    const me = { id: 'me', name: 'Me', hourlyRate: await getSetting('defaultHourlyRate', 7500) };
    await put('workers', me);
    return [me];
  }
  return workers;
}

export async function upsertWorker(worker) {
  const record = { id: worker.id || uid(), name: worker.name, hourlyRate: worker.hourlyRate };
  await put('workers', record);
  return record;
}

export async function deleteWorker(workerId) {
  await del('workers', workerId);
}

// --- Line items (materials / estimate / invoice) ---------------------------

export async function getLineItems(jobId, kind) {
  const db = await getDB();
  const items = await db.getAllFromIndex('lineItems', 'jobId_kind', [jobId, kind]);
  return items.sort((a, b) => a.createdAt - b.createdAt);
}

export async function addLineItem(jobId, kind, item) {
  const record = {
    id: uid(),
    jobId,
    kind,
    description: item.description || '',
    quantity: item.quantity ?? 1,
    unitCost: item.unitCost ?? 0,
    createdAt: Date.now(),
  };
  await put('lineItems', record);
  return record;
}

export async function deleteLineItem(id) {
  await del('lineItems', id);
}

// --- Payments ---------------------------------------------------------------

export async function getPayments(jobId) {
  const payments = await getByIndex('payments', 'jobId', jobId);
  return payments.sort((a, b) => a.createdAt - b.createdAt);
}

export async function addPayment(jobId, amountCents, note) {
  const payment = { id: uid(), jobId, amountCents, note: note || '', createdAt: Date.now() };
  await put('payments', payment);
  await logEvent(jobId, `Payment received: $${(amountCents / 100).toFixed(2)}`);
  return payment;
}

// --- Settings ---------------------------------------------------------------

export { getSetting, setSetting };
