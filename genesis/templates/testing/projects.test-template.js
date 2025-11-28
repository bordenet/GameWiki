import { describe, test, expect, beforeEach } from '@jest/globals';
import { createProject, getAllProjects, getProject, updatePhase, deleteProject, importProjects } from '../js/projects.js';
import storage from '../js/storage.js';

describe('Projects Module', () => {
  beforeEach(async () => {
    // Initialize database before each test
    await storage.init();
  });

  describe('createProject', () => {
    test('should create a new project with correct structure', async () => {
      const title = 'Test {{DOCUMENT_TYPE}}';
      const problems = 'Problem statement';
      const context = 'Context information';

      const project = await createProject(title, problems, context);

      expect(project).toBeTruthy();
      expect(project.id).toBeTruthy();
      expect(project.title).toBe(title);
      expect(project.problems).toBe(problems);
      expect(project.context).toBe(context);
      expect(project.phase).toBe(1);
      expect(project.createdAt).toBeTruthy();
      expect(project.updatedAt).toBeTruthy();
      expect(project.phases).toBeTruthy();
      expect(project.phases[1]).toBeTruthy();
      expect(project.phases[2]).toBeTruthy();
      expect(project.phases[3]).toBeTruthy();
    });

    test('should trim whitespace from inputs', async () => {
      const project = await createProject('  Title  ', '  Problems  ', '  Context  ');

      expect(project.title).toBe('Title');
      expect(project.problems).toBe('Problems');
      expect(project.context).toBe('Context');
    });

    test('should initialize all phases as incomplete', async () => {
      const project = await createProject('Test', 'Problems', 'Context');

      expect(project.phases[1].completed).toBe(false);
      expect(project.phases[2].completed).toBe(false);
      expect(project.phases[3].completed).toBe(false);
    });

    test('should save project to storage', async () => {
      const project = await createProject('Test', 'Problems', 'Context');

      const retrieved = await getProject(project.id);
      expect(retrieved).toBeTruthy();
      expect(retrieved.id).toBe(project.id);
    });
  });

  describe('getAllProjects', () => {
    test('should return empty array when no projects exist', async () => {
      const projects = await getAllProjects();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBe(0);
    });

    test('should return all projects', async () => {
      await createProject('Project 1', 'Problems 1', 'Context 1');
      await createProject('Project 2', 'Problems 2', 'Context 2');

      const projects = await getAllProjects();
      expect(projects.length).toBe(2);
    });

    test('should return projects sorted by updatedAt descending', async () => {
      const project1 = await createProject('Project 1', 'Problems 1', 'Context 1');
      await sleep(10);
      const project2 = await createProject('Project 2', 'Problems 2', 'Context 2');

      const projects = await getAllProjects();
      expect(projects[0].id).toBe(project2.id);
      expect(projects[1].id).toBe(project1.id);
    });
  });

  describe('getProject', () => {
    test('should retrieve project by id', async () => {
      const created = await createProject('Test', 'Problems', 'Context');
      const retrieved = await getProject(created.id);

      expect(retrieved).toBeTruthy();
      expect(retrieved.id).toBe(created.id);
      expect(retrieved.title).toBe(created.title);
    });

    test('should return null for non-existent project', async () => {
      const retrieved = await getProject('non-existent-id');
      expect(retrieved).toBeNull();
    });
  });

  describe('updatePhase', () => {
    test('should update phase data', async () => {
      const project = await createProject('Test', 'Problems', 'Context');
      
      await updatePhase(project.id, 1, {
        prompt: 'Test prompt',
        response: 'Test response',
        completed: true
      });

      const updated = await getProject(project.id);
      expect(updated.phases[1].prompt).toBe('Test prompt');
      expect(updated.phases[1].response).toBe('Test response');
      expect(updated.phases[1].completed).toBe(true);
    });

    test('should update project updatedAt timestamp', async () => {
      const project = await createProject('Test', 'Problems', 'Context');
      const originalUpdatedAt = project.updatedAt;

      await sleep(10);
      await updatePhase(project.id, 1, { prompt: 'New prompt' });

      const updated = await getProject(project.id);
      expect(updated.updatedAt).toBeGreaterThan(originalUpdatedAt);
    });
  });

  describe('deleteProject', () => {
    test('should delete project', async () => {
      const project = await createProject('Test', 'Problems', 'Context');
      
      await deleteProject(project.id);

      const retrieved = await getProject(project.id);
      expect(retrieved).toBeNull();
    });

    test('should not throw when deleting non-existent project', async () => {
      await expect(deleteProject('non-existent-id')).resolves.not.toThrow();
    });
  });

  describe('importProjects', () => {
    test('should import projects from JSON', async () => {
      const projectsData = [
        { title: 'Project 1', problems: 'Problems 1', context: 'Context 1', phase: 1, phases: {} },
        { title: 'Project 2', problems: 'Problems 2', context: 'Context 2', phase: 1, phases: {} }
      ];

      await importProjects(JSON.stringify(projectsData));

      const projects = await getAllProjects();
      expect(projects.length).toBe(2);
    });
  });
});

