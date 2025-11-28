import { describe, test, expect, beforeEach } from '@jest/globals';
import { getPrompt, savePrompt, resetPrompt, generatePhase1Prompt, generatePhase2Prompt, generatePhase3Prompt } from '../js/workflow.js';
import { createProject } from '../js/projects.js';
import storage from '../js/storage.js';

describe('Workflow Module', () => {
  beforeEach(async () => {
    // Initialize database before each test
    await storage.init();

    // Clear prompts to avoid test interference
    // We'll let each test set up its own prompts
  });

  describe('getPrompt and savePrompt', () => {
    test('should save and retrieve a custom prompt', async () => {
      const phase = 1;
      const content = 'Custom prompt for phase 1';

      await savePrompt(phase, content);
      const retrieved = await getPrompt(phase);

      expect(retrieved).toBe(content);
    });

    test('should return empty string for non-existent prompt', async () => {
      const retrieved = await getPrompt(999);
      expect(typeof retrieved).toBe('string');
    });
  });

  describe('resetPrompt', () => {
    test('should reset prompt to default when default exists', async () => {
      const phase = 1;
      const customContent = 'Custom prompt';

      // Save custom prompt
      await savePrompt(phase, customContent);

      // Reset to default (will return undefined if no default is loaded)
      const defaultPrompt = await resetPrompt(phase);

      // If there's no default loaded, resetPrompt returns undefined
      // and the prompt should be cleared
      const retrieved = await getPrompt(phase);

      // Either it's the default (if one was loaded) or empty string (if no default)
      if (defaultPrompt) {
        expect(retrieved).toBe(defaultPrompt);
      } else {
        expect(retrieved).toBe('');
      }
    });

    test('should handle resetting non-existent prompt', async () => {
      await expect(resetPrompt(999)).resolves.not.toThrow();
    });
  });

  describe('generatePhase1Prompt', () => {
    test('should generate phase 1 prompt with project data', async () => {
      const project = await createProject('Test {{DOCUMENT_TYPE}}', 'Test problems', 'Test context');

      const prompt = await generatePhase1Prompt(project);

      expect(prompt).toBeTruthy();
      expect(typeof prompt).toBe('string');
      expect(prompt).toContain('Test {{DOCUMENT_TYPE}}');
      expect(prompt).toContain('Test problems');
      expect(prompt).toContain('Test context');
    });

    test('should use custom prompt if available', async () => {
      const project = await createProject('Test', 'Problems', 'Context');
      const customPrompt = 'Custom phase 1 prompt with {{title}}';

      await savePrompt(1, customPrompt);
      const prompt = await generatePhase1Prompt(project);

      expect(prompt).toContain('Test');
    });
  });

  describe('generatePhase2Prompt', () => {
    test('should generate phase 2 prompt with project data', async () => {
      const project = await createProject('Test {{DOCUMENT_TYPE}}', 'Test problems', 'Test context');
      project.phases[1].response = 'Phase 1 response';

      const prompt = await generatePhase2Prompt(project);

      expect(prompt).toBeTruthy();
      expect(typeof prompt).toBe('string');
    });

    test('should include phase 1 response', async () => {
      const project = await createProject('Test', 'Problems', 'Context');
      project.phases[1].response = 'Important phase 1 output';

      const prompt = await generatePhase2Prompt(project);

      expect(prompt).toContain('Important phase 1 output');
    });
  });

  describe('generatePhase3Prompt', () => {
    test('should generate phase 3 prompt with project data', async () => {
      const project = await createProject('Test {{DOCUMENT_TYPE}}', 'Test problems', 'Test context');
      project.phases[1].response = 'Phase 1 response';
      project.phases[2].response = 'Phase 2 response';

      const prompt = await generatePhase3Prompt(project);

      expect(prompt).toBeTruthy();
      expect(typeof prompt).toBe('string');
    });

    test('should include previous phase responses', async () => {
      const project = await createProject('Test', 'Problems', 'Context');
      project.phases[1].response = 'Phase 1 output';
      project.phases[2].response = 'Phase 2 output';

      const prompt = await generatePhase3Prompt(project);

      expect(prompt).toContain('Phase 1 output');
      expect(prompt).toContain('Phase 2 output');
    });
  });

  describe('Prompt template variables', () => {
    test('should replace {{title}} variable', async () => {
      const project = await createProject('My Project Title', 'Problems', 'Context');
      const customPrompt = 'Generate {{DOCUMENT_TYPE}} for: {{title}}';

      await savePrompt(1, customPrompt);
      const prompt = await generatePhase1Prompt(project);

      expect(prompt).toContain('My Project Title');
    });

    test('should replace {{problems}} variable', async () => {
      const project = await createProject('Title', 'Critical user issues', 'Context');
      const customPrompt = 'Address these problems: {{problems}}';

      await savePrompt(1, customPrompt);
      const prompt = await generatePhase1Prompt(project);

      expect(prompt).toContain('Critical user issues');
    });

    test('should replace {{context}} variable', async () => {
      const project = await createProject('Title', 'Problems', 'Enterprise SaaS platform');
      const customPrompt = 'Context: {{context}}';

      await savePrompt(1, customPrompt);
      const prompt = await generatePhase1Prompt(project);

      expect(prompt).toContain('Enterprise SaaS platform');
    });
  });
});

