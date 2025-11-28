import { describe, test, expect } from '@jest/globals';
import {
  createProject,
  generatePrompt,
  validatePhase,
  advancePhase,
  isProjectComplete,
  getCurrentPhase,
  updatePhaseResponse,
  getProgress,
  PHASES
} from '../js/workflow.js';

describe('Workflow Module', () => {
  describe('createProject', () => {
    test('should create a new project with correct structure', () => {
      const project = createProject('Test Project', 'Test Description');

      expect(project).toBeTruthy();
      expect(project.id).toBeTruthy();
      expect(project.name).toBe('Test Project');
      expect(project.description).toBe('Test Description');
      expect(project.currentPhase).toBe(1);
      expect(project.phases).toHaveLength(PHASES.length);
    });

    test('should initialize all phases as incomplete', () => {
      const project = createProject('Test', 'Description');

      project.phases.forEach(phase => {
        expect(phase.completed).toBe(false);
        expect(phase.prompt).toBe('');
        expect(phase.response).toBe('');
      });
    });
  });

  describe('generatePrompt', () => {
    test('should generate prompt for phase 1', () => {
      const project = createProject('Test Project', 'Test Description');
      const prompt = generatePrompt(project);

      expect(prompt).toContain('Phase 1');
      expect(prompt).toContain('Test Project');
      expect(prompt).toContain('Test Description');
    });

    test('should generate prompt for phase 2 with phase 1 response', () => {
      const project = createProject('Test Project', 'Test Description');
      project.phases[0].response = 'Phase 1 response';
      project.phases[0].completed = true;
      project.currentPhase = 2;

      const prompt = generatePrompt(project);

      expect(prompt).toContain('Phase 2');
      expect(prompt).toContain('Phase 1 response');
    });
  });

  describe('validatePhase', () => {
    test('should fail validation when response is empty', () => {
      const project = createProject('Test', 'Description');
      const result = validatePhase(project);

      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should pass validation when response is provided', () => {
      const project = createProject('Test', 'Description');
      project.phases[0].response = 'Some response';

      const result = validatePhase(project);

      expect(result.valid).toBe(true);
    });
  });

  describe('advancePhase', () => {
    test('should mark current phase as completed', () => {
      const project = createProject('Test', 'Description');
      project.phases[0].response = 'Response';

      advancePhase(project);

      expect(project.phases[0].completed).toBe(true);
    });

    test('should advance to next phase', () => {
      const project = createProject('Test', 'Description');
      project.phases[0].response = 'Response';

      advancePhase(project);

      expect(project.currentPhase).toBe(2);
    });

    test('should not advance beyond last phase', () => {
      const project = createProject('Test', 'Description');
      project.currentPhase = PHASES.length;
      project.phases[PHASES.length - 1].response = 'Response';

      advancePhase(project);

      expect(project.currentPhase).toBe(PHASES.length);
    });
  });

  describe('isProjectComplete', () => {
    test('should return false for new project', () => {
      const project = createProject('Test', 'Description');

      expect(isProjectComplete(project)).toBe(false);
    });

    test('should return true when all phases are completed', () => {
      const project = createProject('Test', 'Description');
      project.phases.forEach(phase => {
        phase.completed = true;
      });

      expect(isProjectComplete(project)).toBe(true);
    });
  });

  describe('getCurrentPhase', () => {
    test('should return current phase object', () => {
      const project = createProject('Test', 'Description');
      const currentPhase = getCurrentPhase(project);

      expect(currentPhase).toBeTruthy();
      expect(currentPhase.number).toBe(1);
    });
  });

  describe('updatePhaseResponse', () => {
    test('should update current phase response', () => {
      const project = createProject('Test', 'Description');
      updatePhaseResponse(project, 'New response');

      expect(project.phases[0].response).toBe('New response');
    });
  });

  describe('getProgress', () => {
    test('should return 0% for new project', () => {
      const project = createProject('Test', 'Description');

      expect(getProgress(project)).toBe(0);
    });

    test('should return 50% when half phases are complete', () => {
      const project = createProject('Test', 'Description');
      project.phases[0].completed = true;

      expect(getProgress(project)).toBe(50);
    });

    test('should return 100% when all phases are complete', () => {
      const project = createProject('Test', 'Description');
      project.phases.forEach(phase => {
        phase.completed = true;
      });

      expect(getProgress(project)).toBe(100);
    });
  });
});

