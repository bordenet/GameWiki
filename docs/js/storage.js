// storage.js - IndexedDB storage for Dim Lantern GM Documentation System

const DB_NAME = 'DimLanternDB';
const DB_VERSION = 1;
const SESSIONS_STORE = 'sessions';
const LOCATIONS_STORE = 'locations';
const PLOT_THREADS_STORE = 'plotThreads';

let db = null;

/**
 * Initialize IndexedDB with all stores
 */
export async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Sessions store
      if (!database.objectStoreNames.contains(SESSIONS_STORE)) {
        const sessionsStore = database.createObjectStore(SESSIONS_STORE, { keyPath: 'id' });
        sessionsStore.createIndex('date', 'date', { unique: false });
        sessionsStore.createIndex('modified', 'modified', { unique: false });
      }

      // Locations store (wiki pages)
      if (!database.objectStoreNames.contains(LOCATIONS_STORE)) {
        const locationsStore = database.createObjectStore(LOCATIONS_STORE, { keyPath: 'id' });
        locationsStore.createIndex('name', 'name', { unique: false });
        locationsStore.createIndex('type', 'type', { unique: false });
      }

      // Plot threads store
      if (!database.objectStoreNames.contains(PLOT_THREADS_STORE)) {
        const plotStore = database.createObjectStore(PLOT_THREADS_STORE, { keyPath: 'id' });
        plotStore.createIndex('status', 'status', { unique: false });
        plotStore.createIndex('priority', 'priority', { unique: false });
      }
    };
  });
}

/**
 * Generate unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============= SESSIONS =============

export async function saveSession(session) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SESSIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SESSIONS_STORE);
    session.modified = Date.now();
    const request = store.put(session);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(session);
  });
}

export async function getSession(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SESSIONS_STORE], 'readonly');
    const store = transaction.objectStore(SESSIONS_STORE);
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getAllSessions() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SESSIONS_STORE], 'readonly');
    const store = transaction.objectStore(SESSIONS_STORE);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const sessions = request.result;
      sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
      resolve(sessions);
    };
  });
}

export async function deleteSession(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SESSIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SESSIONS_STORE);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// ============= LOCATIONS =============

export async function saveLocation(location) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LOCATIONS_STORE], 'readwrite');
    const store = transaction.objectStore(LOCATIONS_STORE);
    location.modified = Date.now();
    const request = store.put(location);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(location);
  });
}

export async function getLocation(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LOCATIONS_STORE], 'readonly');
    const store = transaction.objectStore(LOCATIONS_STORE);
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getAllLocations() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LOCATIONS_STORE], 'readonly');
    const store = transaction.objectStore(LOCATIONS_STORE);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function deleteLocation(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LOCATIONS_STORE], 'readwrite');
    const store = transaction.objectStore(LOCATIONS_STORE);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function findLocationByName(name) {
  const locations = await getAllLocations();
  return locations.find(loc => loc.name.toLowerCase() === name.toLowerCase());
}

// ============= PLOT THREADS =============

export async function savePlotThread(thread) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PLOT_THREADS_STORE], 'readwrite');
    const store = transaction.objectStore(PLOT_THREADS_STORE);
    thread.modified = Date.now();
    const request = store.put(thread);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(thread);
  });
}

export async function getPlotThread(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PLOT_THREADS_STORE], 'readonly');
    const store = transaction.objectStore(PLOT_THREADS_STORE);
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function getAllPlotThreads() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PLOT_THREADS_STORE], 'readonly');
    const store = transaction.objectStore(PLOT_THREADS_STORE);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function deletePlotThread(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PLOT_THREADS_STORE], 'readwrite');
    const store = transaction.objectStore(PLOT_THREADS_STORE);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function findPlotThreadByName(name) {
  const threads = await getAllPlotThreads();
  return threads.find(t => t.name.toLowerCase() === name.toLowerCase());
}

// ============= EXPORT =============

export function exportSession(session) {
  const json = JSON.stringify(session, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${session.title.replace(/\s+/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

