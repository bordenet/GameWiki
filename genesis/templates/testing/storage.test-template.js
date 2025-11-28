/**
 * Unit Tests for Storage Module
 * 
 * Tests IndexedDB operations for project persistence.
 */

import { 
  initDB, 
  saveProject, 
  getProject, 
  getAllProjects, 
  deleteProject,
  exportProject,
  importProject 
} from '../storage.js';

describe('Storage Module', () => {
  beforeEach(async () => {
    // Initialize database before each test
    await initDB();
  });

  afterEach(async () => {
    // Clean up database after each test
    const projects = await getAllProjects();
    for (const project of projects) {
      await deleteProject(project.id);
    }
  });

  describe('initDB', () => {
    test('initializes database successfully', async () => {
      const result = await initDB();
      expect(result).toBe(true);
    });

    test('handles multiple initialization calls', async () => {
      await initDB();
      const result = await initDB();
      expect(result).toBe(true);
    });
  });

  describe('saveProject', () => {
    test('saves new project', async () => {
      const project = {
        id: 'test-1',
        name: 'Test Project',
        created: Date.now(),
        modified: Date.now(),
        phases: []
      };

      const result = await saveProject(project);
      expect(result).toBe(true);

      const retrieved = await getProject('test-1');
      expect(retrieved).toEqual(project);
    });

    test('updates existing project', async () => {
      const project = {
        id: 'test-2',
        name: 'Original Name',
        created: Date.now(),
        modified: Date.now(),
        phases: []
      };

      await saveProject(project);

      project.name = 'Updated Name';
      project.modified = Date.now();
      await saveProject(project);

      const retrieved = await getProject('test-2');
      expect(retrieved.name).toBe('Updated Name');
    });

    test('handles invalid project data', async () => {
      await expect(saveProject(null)).rejects.toThrow();
      await expect(saveProject({})).rejects.toThrow();
    });
  });

  describe('getProject', () => {
    test('retrieves existing project', async () => {
      const project = {
        id: 'test-3',
        name: 'Test Project',
        created: Date.now(),
        modified: Date.now(),
        phases: []
      };

      await saveProject(project);
      const retrieved = await getProject('test-3');
      expect(retrieved).toEqual(project);
    });

    test('returns null for non-existent project', async () => {
      const retrieved = await getProject('non-existent');
      expect(retrieved).toBeNull();
    });

    test('handles invalid ID', async () => {
      await expect(getProject(null)).rejects.toThrow();
      await expect(getProject('')).rejects.toThrow();
    });
  });

  describe('getAllProjects', () => {
    test('returns empty array when no projects', async () => {
      const projects = await getAllProjects();
      expect(projects).toEqual([]);
    });

    test('returns all projects', async () => {
      const project1 = {
        id: 'test-4',
        name: 'Project 1',
        created: Date.now(),
        modified: Date.now(),
        phases: []
      };

      const project2 = {
        id: 'test-5',
        name: 'Project 2',
        created: Date.now(),
        modified: Date.now(),
        phases: []
      };

      await saveProject(project1);
      await saveProject(project2);

      const projects = await getAllProjects();
      expect(projects).toHaveLength(2);
      expect(projects.map(p => p.id)).toContain('test-4');
      expect(projects.map(p => p.id)).toContain('test-5');
    });

    test('returns projects sorted by modified date', async () => {
      const project1 = {
        id: 'test-6',
        name: 'Older Project',
        created: Date.now() - 2000,
        modified: Date.now() - 2000,
        phases: []
      };

      const project2 = {
        id: 'test-7',
        name: 'Newer Project',
        created: Date.now(),
        modified: Date.now(),
        phases: []
      };

      await saveProject(project1);
      await saveProject(project2);

      const projects = await getAllProjects();
      expect(projects[0].id).toBe('test-7'); // Newer first
      expect(projects[1].id).toBe('test-6');
    });
  });

  describe('deleteProject', () => {
    test('deletes existing project', async () => {
      const project = {
        id: 'test-8',
        name: 'Test Project',
        created: Date.now(),
        modified: Date.now(),
        phases: []
      };

      await saveProject(project);
      const result = await deleteProject('test-8');
      expect(result).toBe(true);

      const retrieved = await getProject('test-8');
      expect(retrieved).toBeNull();
    });

    test('handles deleting non-existent project', async () => {
      const result = await deleteProject('non-existent');
      expect(result).toBe(false);
    });

    test('handles invalid ID', async () => {
      await expect(deleteProject(null)).rejects.toThrow();
      await expect(deleteProject('')).rejects.toThrow();
    });
  });

  describe('exportProject', () => {
    test('exports project as JSON', async () => {
      const project = {
        id: 'test-9',
        name: 'Export Test',
        created: Date.now(),
        modified: Date.now(),
        phases: [
          { number: 1, name: 'Phase 1', completed: true }
        ]
      };

      await saveProject(project);
      const exported = await exportProject('test-9');
      
      expect(typeof exported).toBe('string');
      const parsed = JSON.parse(exported);
      expect(parsed).toEqual(project);
    });

    test('handles non-existent project', async () => {
      await expect(exportProject('non-existent')).rejects.toThrow();
    });
  });

  describe('importProject', () => {
    test('imports project from JSON', async () => {
      const project = {
        id: 'test-10',
        name: 'Import Test',
        created: Date.now(),
        modified: Date.now(),
        phases: []
      };

      const json = JSON.stringify(project);
      const result = await importProject(json);
      expect(result).toBe(true);

      const retrieved = await getProject('test-10');
      expect(retrieved).toEqual(project);
    });

    test('handles invalid JSON', async () => {
      await expect(importProject('invalid json')).rejects.toThrow();
    });

    test('handles missing required fields', async () => {
      const invalidProject = { name: 'No ID' };
      const json = JSON.stringify(invalidProject);
      await expect(importProject(json)).rejects.toThrow();
    });
  });
});

