/**
 * IndexedDB Storage Module
 * Handles all client-side data persistence for {{PROJECT_TITLE}}
 */

const DB_NAME = '{{DB_NAME}}';
const DB_VERSION = 1;
const STORE_NAME = '{{STORE_NAME}}';

class Storage {
    constructor() {
        this.db = null;
    }

    /**
     * Initialize the database
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Projects store
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const projectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    projectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
                    projectStore.createIndex('title', 'title', { unique: false });
                    projectStore.createIndex('phase', 'phase', { unique: false });
                }

                // Prompts store
                if (!db.objectStoreNames.contains('prompts')) {
                    db.createObjectStore('prompts', { keyPath: 'phase' });
                }

                // Settings store
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    /**
     * Get all projects, sorted by last updated
     */
    async getAllProjects() {
        const tx = this.db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const index = store.index('updatedAt');
        
        return new Promise((resolve, reject) => {
            const request = index.openCursor(null, 'prev');
            const projects = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    projects.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(projects);
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get a single project by ID
     */
    async getProject(id) {
        const tx = this.db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Save or update a project
     */
    async saveProject(project) {
        project.updatedAt = new Date().toISOString();
        
        const tx = this.db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        
        return new Promise((resolve, reject) => {
            const request = store.put(project);
            request.onsuccess = () => resolve(project);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete a project
     */
    async deleteProject(id) {
        const tx = this.db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get storage usage info
     */
    async getStorageInfo() {
        if (navigator.storage && navigator.storage.estimate) {
            const estimate = await navigator.storage.estimate();
            return {
                usage: estimate.usage,
                quota: estimate.quota,
                percentage: ((estimate.usage / estimate.quota) * 100).toFixed(2)
            };
        }
        return null;
    }

    /**
     * Export all data as JSON
     */
    async exportAll() {
        const projects = await this.getAllProjects();
        return {
            version: DB_VERSION,
            exportDate: new Date().toISOString(),
            projectCount: projects.length,
            projects: projects
        };
    }

    /**
     * Import data from JSON
     */
    async importAll(data) {
        if (!data.projects || !Array.isArray(data.projects)) {
            throw new Error('Invalid import data');
        }

        const tx = this.db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        for (const project of data.projects) {
            await new Promise((resolve, reject) => {
                const request = store.put(project);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }

        return data.projects.length;
    }
}

// Export singleton instance
export const storage = new Storage();

