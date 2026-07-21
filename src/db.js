import { openDB } from 'idb';

const DB_NAME = 'contractoor';
const DB_VERSION = 1;

let dbPromise;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const customers = db.createObjectStore('customers', { keyPath: 'id' });
        customers.createIndex('name', 'name');

        db.createObjectStore('jobs', { keyPath: 'id' });

        const photos = db.createObjectStore('photos', { keyPath: 'id' });
        photos.createIndex('jobId', 'jobId');

        const documents = db.createObjectStore('documents', { keyPath: 'id' });
        documents.createIndex('jobId', 'jobId');

        const sessions = db.createObjectStore('workSessions', { keyPath: 'id' });
        sessions.createIndex('jobId', 'jobId');

        const events = db.createObjectStore('timelineEvents', { keyPath: 'id' });
        events.createIndex('jobId', 'jobId');

        const lineItems = db.createObjectStore('lineItems', { keyPath: 'id' });
        lineItems.createIndex('jobId_kind', ['jobId', 'kind']);

        const payments = db.createObjectStore('payments', { keyPath: 'id' });
        payments.createIndex('jobId', 'jobId');

        db.createObjectStore('workers', { keyPath: 'id' });

        db.createObjectStore('settings', { keyPath: 'key' });
      },
    });
  }
  return dbPromise;
}

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function getAll(store) {
  return (await getDB()).getAll(store);
}

export async function getByIndex(store, index, value) {
  return (await getDB()).getAllFromIndex(store, index, value);
}

export async function get(store, id) {
  return (await getDB()).get(store, id);
}

export async function put(store, value) {
  await (await getDB()).put(store, value);
  return value;
}

export async function del(store, id) {
  await (await getDB()).delete(store, id);
}

export async function getSetting(key, fallback) {
  const row = await get('settings', key);
  return row ? row.value : fallback;
}

export async function setSetting(key, value) {
  await put('settings', { key, value });
}
