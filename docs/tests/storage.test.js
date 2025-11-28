import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { 
  initDB, 
  saveSession, 
  getSession, 
  getAllSessions, 
  deleteSession, 
  exportSession,
  saveLocation,
  getAllLocations,
  savePlotThread,
  getAllPlotThreads,
  generateId 
} from '../js/storage.js';

describe('Storage Module', () => {
  beforeEach(async () => {
    await initDB();
  });

  describe('generateId', () => {
    test('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    test('should generate IDs with correct format', () => {
      const id = generateId();
      expect(id).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });

  describe('Session CRUD operations', () => {
    test('should save and retrieve a session', async () => {
      const session = {
        id: generateId(),
        title: 'Session 47',
        date: '2024-12-15',
        transcript: 'The party entered the tavern.',
        tags: ['combat'],
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      await saveSession(session);
      const retrieved = await getSession(session.id);

      expect(retrieved).toBeTruthy();
      expect(retrieved.id).toBe(session.id);
      expect(retrieved.title).toBe('Session 47');
      expect(retrieved.transcript).toBe('The party entered the tavern.');
    });

    test('should update modified timestamp on save', async () => {
      const session = {
        id: generateId(),
        title: 'Test Session',
        date: '2024-01-01',
        transcript: 'Test',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      await saveSession(session);
      const originalModified = session.modified;

      await new Promise(resolve => setTimeout(resolve, 10));
      await saveSession(session);
      const updated = await getSession(session.id);

      expect(updated.modified).toBeGreaterThan(originalModified);
    });

    test('should get all sessions sorted by date', async () => {
      const session1 = {
        id: generateId(),
        title: 'Old Session',
        date: '2024-01-01',
        transcript: 'Old',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      const session2 = {
        id: generateId(),
        title: 'New Session',
        date: '2024-12-15',
        transcript: 'New',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      await saveSession(session1);
      await saveSession(session2);

      const sessions = await getAllSessions();
      expect(sessions.length).toBeGreaterThanOrEqual(2);
      
      // Should be sorted by date, newest first
      const newIndex = sessions.findIndex(s => s.id === session2.id);
      const oldIndex = sessions.findIndex(s => s.id === session1.id);
      expect(newIndex).toBeLessThan(oldIndex);
    });

    test('should delete a session', async () => {
      const session = {
        id: generateId(),
        title: 'To Delete',
        date: '2024-01-01',
        transcript: 'Delete me',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      await saveSession(session);
      await deleteSession(session.id);
      const retrieved = await getSession(session.id);

      expect(retrieved).toBeUndefined();
    });
  });

  describe('Location operations', () => {
    test('should save and retrieve locations', async () => {
      const location = {
        id: generateId(),
        name: 'The Rusty Dragon',
        type: 'Tavern',
        events: ['Party met the innkeeper'],
        modified: Date.now()
      };

      await saveLocation(location);
      const locations = await getAllLocations();

      expect(locations.length).toBeGreaterThanOrEqual(1);
      const found = locations.find(l => l.id === location.id);
      expect(found).toBeTruthy();
      expect(found.name).toBe('The Rusty Dragon');
    });
  });

  describe('Plot Thread operations', () => {
    test('should save and retrieve plot threads', async () => {
      const thread = {
        id: generateId(),
        name: 'The Missing Artifact',
        status: 'Active',
        description: 'A powerful artifact has gone missing',
        modified: Date.now()
      };

      await savePlotThread(thread);
      const threads = await getAllPlotThreads();

      expect(threads.length).toBeGreaterThanOrEqual(1);
      const found = threads.find(t => t.id === thread.id);
      expect(found).toBeTruthy();
      expect(found.name).toBe('The Missing Artifact');
    });
  });
});

