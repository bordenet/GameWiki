// storage.js - IndexedDB storage for projects

const DB_NAME = 'HelloWorldDB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

let db = null;

/**
 * Initialize IndexedDB
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
      const db = event.target.result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('created', 'created', { unique: false });
        objectStore.createIndex('modified', 'modified', { unique: false });
      }
    };
  });
}

/**
 * Save project to IndexedDB
 */
export async function saveProject(project) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    
    project.modified = Date.now();
    const request = objectStore.put(project);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(project);
  });
}

/**
 * Get project by ID
 */
export async function getProject(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * Get all projects
 */
export async function getAllProjects() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const projects = request.result;
      // Sort by modified date (newest first)
      projects.sort((a, b) => b.modified - a.modified);
      resolve(projects);
    };
  });
}

/**
 * Delete project by ID
 */
export async function deleteProject(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Export project as JSON
 */
export function exportProject(project) {
  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.replace(/\s+/g, '-')}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}

/**
 * Import project from JSON
 */
export async function importProject(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const project = JSON.parse(e.target.result);
        
        // Validate project structure
        if (!project.id || !project.name || !project.phases) {
          throw new Error('Invalid project file');
        }
        
        // Generate new ID to avoid conflicts
        project.id = generateId();
        project.created = Date.now();
        project.modified = Date.now();
        
        await saveProject(project);
        resolve(project);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * Generate unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

