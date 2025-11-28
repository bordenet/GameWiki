import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { initDB, saveProject, getProject, getAllProjects, deleteProject, generateId } from '../js/storage.js';

describe('Storage Module', () => {
  beforeEach(async () => {
    // Initialize database before each test
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

  describe('saveProject and getProject', () => {
    test('should save and retrieve a project', async () => {
      const project = {
        id: generateId(),
        name: 'Test Project',
        description: 'Test Description',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      await saveProject(project);
      const retrieved = await getProject(project.id);

      expect(retrieved).toBeTruthy();
      expect(retrieved.id).toBe(project.id);
      expect(retrieved.name).toBe(project.name);
      expect(retrieved.description).toBe(project.description);
    });

    test('should update modified timestamp on save', async () => {
      const project = {
        id: generateId(),
        name: 'Test Project',
        description: 'Test Description',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      await saveProject(project);
      const originalModified = project.modified;

      // Wait a bit and save again
      await new Promise(resolve => setTimeout(resolve, 10));
      await saveProject(project);
      const updated = await getProject(project.id);

      expect(updated.modified).toBeGreaterThan(originalModified);
    });
  });

  describe('getAllProjects', () => {
    test('should return empty array when no projects exist', async () => {
      const projects = await getAllProjects();
      expect(Array.isArray(projects)).toBe(true);
    });

    test('should return all saved projects', async () => {
      const project1 = {
        id: generateId(),
        name: 'Project 1',
        description: 'Description 1',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      const project2 = {
        id: generateId(),
        name: 'Project 2',
        description: 'Description 2',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      await saveProject(project1);
      await saveProject(project2);

      const projects = await getAllProjects();
      expect(projects.length).toBeGreaterThanOrEqual(2);
    });

    test('should sort projects by modified date (newest first)', async () => {
      const now = Date.now();
      const project1 = {
        id: generateId(),
        name: 'Old Project',
        description: 'Description',
        created: now - 2000,
        modified: now - 2000,
        currentPhase: 1,
        phases: []
      };

      await saveProject(project1);

      // Wait to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 100));

      const project2 = {
        id: generateId(),
        name: 'New Project',
        description: 'Description',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      await saveProject(project2);

      const projects = await getAllProjects();
      const project2Index = projects.findIndex(p => p.id === project2.id);
      const project1Index = projects.findIndex(p => p.id === project1.id);

      expect(project2Index).toBeLessThan(project1Index);
    });
  });

  describe('deleteProject', () => {
    test('should delete a project', async () => {
      const project = {
        id: generateId(),
        name: 'Test Project',
        description: 'Test Description',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      await saveProject(project);
      await deleteProject(project.id);
      const retrieved = await getProject(project.id);

      expect(retrieved).toBeUndefined();
    });

    test('should handle deleting non-existent project', async () => {
      // Should not throw error when deleting non-existent project
      await expect(deleteProject('non-existent-id')).resolves.not.toThrow();
    });
  });

  describe('exportProject', () => {
    test('should export project as JSON blob', async () => {
      const { exportProject } = await import('../js/storage.js');

      const project = {
        id: generateId(),
        name: 'Export Test Project',
        description: 'Test Description',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: [
          { id: 1, name: 'Phase 1', content: 'Content 1' }
        ]
      };

      // Mock document.createElement and URL.createObjectURL
      const mockAnchor = {
        href: '',
        download: '',
        click: jest.fn()
      };

      const originalCreateElement = document.createElement;
      const originalCreateObjectURL = URL.createObjectURL;
      const originalRevokeObjectURL = URL.revokeObjectURL;

      document.createElement = jest.fn(() => mockAnchor);
      URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = jest.fn();

      exportProject(project);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(mockAnchor.download).toBe('Export-Test-Project.json');
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

      // Restore original functions
      document.createElement = originalCreateElement;
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    });

    test('should handle project names with multiple spaces', async () => {
      const { exportProject } = await import('../js/storage.js');

      const project = {
        id: generateId(),
        name: 'My   Test   Project',
        description: 'Test',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      const mockAnchor = {
        href: '',
        download: '',
        click: jest.fn()
      };

      document.createElement = jest.fn(() => mockAnchor);
      URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = jest.fn();

      exportProject(project);

      expect(mockAnchor.download).toBe('My-Test-Project.json');

      // Cleanup
      jest.restoreAllMocks();
    });
  });

  describe('importProject', () => {
    test('should import valid project from JSON file', async () => {
      const { importProject } = await import('../js/storage.js');

      const projectData = {
        id: 'old-id',
        name: 'Imported Project',
        description: 'Imported Description',
        created: Date.now() - 10000,
        modified: Date.now() - 10000,
        currentPhase: 2,
        phases: [
          { id: 1, name: 'Phase 1', content: 'Content 1' },
          { id: 2, name: 'Phase 2', content: 'Content 2' }
        ]
      };

      const jsonString = JSON.stringify(projectData);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const file = new File([blob], 'project.json', { type: 'application/json' });

      const imported = await importProject(file);

      expect(imported).toBeTruthy();
      expect(imported.id).not.toBe('old-id'); // Should generate new ID
      expect(imported.name).toBe('Imported Project');
      expect(imported.description).toBe('Imported Description');
      expect(imported.currentPhase).toBe(2);
      expect(imported.phases).toHaveLength(2);
      expect(imported.created).toBeGreaterThan(projectData.created);
      expect(imported.modified).toBeGreaterThan(projectData.modified);

      // Verify it was saved to database
      const retrieved = await getProject(imported.id);
      expect(retrieved).toBeTruthy();
      expect(retrieved.name).toBe('Imported Project');
    });

    test('should reject invalid JSON', async () => {
      const { importProject } = await import('../js/storage.js');

      const invalidJson = 'not valid json {';
      const blob = new Blob([invalidJson], { type: 'application/json' });
      const file = new File([blob], 'invalid.json', { type: 'application/json' });

      await expect(importProject(file)).rejects.toThrow();
    });

    test('should reject project without required id field', async () => {
      const { importProject } = await import('../js/storage.js');

      const invalidProject = {
        name: 'No ID Project',
        phases: []
      };

      const jsonString = JSON.stringify(invalidProject);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const file = new File([blob], 'project.json', { type: 'application/json' });

      await expect(importProject(file)).rejects.toThrow('Invalid project file');
    });

    test('should reject project without required name field', async () => {
      const { importProject } = await import('../js/storage.js');

      const invalidProject = {
        id: 'test-id',
        phases: []
      };

      const jsonString = JSON.stringify(invalidProject);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const file = new File([blob], 'project.json', { type: 'application/json' });

      await expect(importProject(file)).rejects.toThrow('Invalid project file');
    });

    test('should reject project without required phases field', async () => {
      const { importProject } = await import('../js/storage.js');

      const invalidProject = {
        id: 'test-id',
        name: 'No Phases Project'
      };

      const jsonString = JSON.stringify(invalidProject);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const file = new File([blob], 'project.json', { type: 'application/json' });

      await expect(importProject(file)).rejects.toThrow('Invalid project file');
    });

    test('should handle FileReader error', async () => {
      const { importProject } = await import('../js/storage.js');

      // Create a mock file
      const file = new File(['content'], 'test.json', { type: 'application/json' });

      // Mock FileReader to simulate error
      const originalFileReader = global.FileReader;
      global.FileReader = class {
        readAsText() {
          setTimeout(() => {
            if (this.onerror) {
              this.error = new Error('FileReader error');
              this.onerror();
            }
          }, 0);
        }
      };

      await expect(importProject(file)).rejects.toThrow();

      // Restore
      global.FileReader = originalFileReader;
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty project name in export', async () => {
      const { exportProject } = await import('../js/storage.js');

      const project = {
        id: generateId(),
        name: '',
        description: 'Test',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      const mockAnchor = {
        href: '',
        download: '',
        click: jest.fn()
      };

      document.createElement = jest.fn(() => mockAnchor);
      URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = jest.fn();

      exportProject(project);

      expect(mockAnchor.download).toBe('.json');

      jest.restoreAllMocks();
    });

    test('should handle project with special characters in name', async () => {
      const { exportProject } = await import('../js/storage.js');

      const project = {
        id: generateId(),
        name: 'Test Project With Spaces',
        description: 'Test',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      const mockAnchor = {
        href: '',
        download: '',
        click: jest.fn()
      };

      document.createElement = jest.fn(() => mockAnchor);
      URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = jest.fn();

      exportProject(project);

      expect(mockAnchor.download).toBe('Test-Project-With-Spaces.json');

      jest.restoreAllMocks();
    });

    test('should handle very large project data', async () => {
      const largePhases = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        name: `Phase ${i}`,
        content: 'x'.repeat(500)
      }));

      const project = {
        id: generateId(),
        name: 'Large Project',
        description: 'Test',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: largePhases
      };

      await saveProject(project);
      const retrieved = await getProject(project.id);

      expect(retrieved).toBeTruthy();
      expect(retrieved.phases).toHaveLength(50);
    });

    test('should handle concurrent saves to different projects', async () => {
      const projects = Array.from({ length: 5 }, (_, i) => ({
        id: generateId(),
        name: `Concurrent Project ${i}`,
        description: 'Test',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      }));

      // Save all projects concurrently
      await Promise.all(projects.map(p => saveProject(p)));

      // Verify all were saved
      const allProjects = await getAllProjects();
      projects.forEach(p => {
        const found = allProjects.find(ap => ap.id === p.id);
        expect(found).toBeTruthy();
      });
    });

    test('should handle rapid sequential operations', async () => {
      const project = {
        id: generateId(),
        name: 'Rapid Test',
        description: 'Test',
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      // Rapid save, get, save, get sequence
      await saveProject(project);
      const retrieved1 = await getProject(project.id);
      project.name = 'Updated Name';
      await saveProject(project);
      const retrieved2 = await getProject(project.id);

      expect(retrieved1.name).toBe('Rapid Test');
      expect(retrieved2.name).toBe('Updated Name');
    });

    test('should handle null values in project data', async () => {
      const project = {
        id: generateId(),
        name: 'Null Test',
        description: null,
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      await saveProject(project);
      const retrieved = await getProject(project.id);

      expect(retrieved).toBeTruthy();
      expect(retrieved.description).toBeNull();
    });

    test('should handle undefined values in project data', async () => {
      const project = {
        id: generateId(),
        name: 'Undefined Test',
        description: undefined,
        created: Date.now(),
        modified: Date.now(),
        currentPhase: 1,
        phases: []
      };

      await saveProject(project);
      const retrieved = await getProject(project.id);

      expect(retrieved).toBeTruthy();
      // undefined becomes null in JSON serialization
      expect(retrieved.description).toBeUndefined();
    });
  });
});

