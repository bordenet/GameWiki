/**
 * Unit Tests for AI Mock Mode
 * 
 * Tests mock AI functionality for testing without API costs.
 */

import { 
  setMockMode, 
  isMockMode, 
  initMockMode,
  getMockResponse,
  callAI,
  addMockResponse,
  mockResponses
} from '../ai-mock.js';

describe('AI Mock Mode', () => {
  beforeEach(() => {
    // Reset mock mode before each test
    setMockMode(false);
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up
    setMockMode(false);
    localStorage.clear();
  });

  describe('setMockMode', () => {
    test('enables mock mode', () => {
      setMockMode(true);
      expect(isMockMode()).toBe(true);
    });

    test('disables mock mode', () => {
      setMockMode(true);
      setMockMode(false);
      expect(isMockMode()).toBe(false);
    });

    test('stores preference in localStorage', () => {
      setMockMode(true);
      expect(localStorage.getItem('aiMockMode')).toBe('true');
      
      setMockMode(false);
      expect(localStorage.getItem('aiMockMode')).toBe('false');
    });
  });

  describe('isMockMode', () => {
    test('returns false by default', () => {
      expect(isMockMode()).toBe(false);
    });

    test('returns true when enabled', () => {
      setMockMode(true);
      expect(isMockMode()).toBe(true);
    });
  });

  describe('initMockMode', () => {
    test('loads preference from localStorage', () => {
      localStorage.setItem('aiMockMode', 'true');
      initMockMode();
      expect(isMockMode()).toBe(true);
    });

    test('defaults to false if no preference stored', () => {
      initMockMode();
      expect(isMockMode()).toBe(false);
    });
  });

  describe('getMockResponse', () => {
    test('returns mock response for phase 1', async () => {
      const response = await getMockResponse(1);
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
      expect(response).toContain('mock');
    });

    test('returns mock response for phase 2', async () => {
      const response = await getMockResponse(2);
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    test('returns mock response for phase 3', async () => {
      const response = await getMockResponse(3);
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    test('simulates network delay', async () => {
      const startTime = Date.now();
      await getMockResponse(1, { delay: 100 });
      const endTime = Date.now();
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });

    test('simulates error when requested', async () => {
      await expect(
        getMockResponse(1, { simulateError: true })
      ).rejects.toThrow();
    });

    test('throws error for invalid phase', async () => {
      await expect(getMockResponse(99)).rejects.toThrow();
    });

    test('respects custom delay', async () => {
      const startTime = Date.now();
      await getMockResponse(1, { delay: 500 });
      const endTime = Date.now();
      expect(endTime - startTime).toBeGreaterThanOrEqual(500);
    });
  });

  describe('callAI', () => {
    test('uses mock response when mock mode enabled', async () => {
      setMockMode(true);
      const response = await callAI('test prompt', 1);
      expect(typeof response).toBe('string');
      expect(response).toContain('mock');
    });

    test('throws error when mock mode disabled', async () => {
      setMockMode(false);
      await expect(
        callAI('test prompt', 1)
      ).rejects.toThrow('Real AI API not implemented');
    });

    test('passes options to getMockResponse', async () => {
      setMockMode(true);
      await expect(
        callAI('test prompt', 1, { simulateError: true })
      ).rejects.toThrow();
    });
  });

  describe('addMockResponse', () => {
    test('adds custom mock response', async () => {
      const customResponse = 'Custom test response';
      addMockResponse(1, customResponse);
      
      // Verify it was added
      expect(mockResponses.phase1.custom).toBe(customResponse);
    });

    test('creates phase object if not exists', () => {
      addMockResponse(99, 'Test response');
      expect(mockResponses.phase99).toBeDefined();
      expect(mockResponses.phase99.custom).toBe('Test response');
    });
  });

  describe('mockResponses', () => {
    test('contains responses for all phases', () => {
      expect(mockResponses.phase1).toBeDefined();
      expect(mockResponses.phase2).toBeDefined();
      expect(mockResponses.phase3).toBeDefined();
    });

    test('each phase has success and error responses', () => {
      expect(mockResponses.phase1.success).toBeDefined();
      expect(mockResponses.phase1.error).toBeDefined();
      expect(mockResponses.phase2.success).toBeDefined();
      expect(mockResponses.phase2.error).toBeDefined();
    });

    test('responses are non-empty strings', () => {
      expect(mockResponses.phase1.success.length).toBeGreaterThan(0);
      expect(mockResponses.phase1.error.length).toBeGreaterThan(0);
    });
  });
});

