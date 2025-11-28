import { describe, test, expect, beforeEach } from '@jest/globals';
import { initMockMode, setMockMode, isMockMode, getMockResponse, addMockResponse } from '../js/ai-mock.js';

describe('AI Mock Module', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset mock mode
    setMockMode(false);
  });

  describe('initMockMode', () => {
    test('should initialize with false by default', () => {
      const result = initMockMode();
      expect(result).toBe(false);
    });

    test('should read from localStorage if set', () => {
      localStorage.setItem('aiMockMode', 'true');
      const result = initMockMode();
      expect(result).toBe(true);
    });

    test('should show toggle on localhost', () => {
      // Mock localhost
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true
      });

      // Create mock DOM elements
      const mockToggle = document.createElement('div');
      mockToggle.id = 'aiMockToggle';
      mockToggle.classList.add('hidden');
      document.body.appendChild(mockToggle);

      const mockCheckbox = document.createElement('input');
      mockCheckbox.id = 'mockModeCheckbox';
      mockCheckbox.type = 'checkbox';
      document.body.appendChild(mockCheckbox);

      localStorage.setItem('aiMockMode', 'true');
      const result = initMockMode();

      expect(result).toBe(true);
      expect(mockToggle.classList.contains('hidden')).toBe(false);
      expect(mockCheckbox.checked).toBe(true);

      // Cleanup
      document.body.removeChild(mockToggle);
      document.body.removeChild(mockCheckbox);
    });

    test('should handle missing toggle element on localhost', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true
      });

      // No toggle element in DOM
      const result = initMockMode();
      expect(result).toBe(false);
    });

    test('should handle missing checkbox element on localhost', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true
      });

      const mockToggle = document.createElement('div');
      mockToggle.id = 'aiMockToggle';
      mockToggle.classList.add('hidden');
      document.body.appendChild(mockToggle);

      // No checkbox element
      const result = initMockMode();
      expect(result).toBe(false);

      // Cleanup
      document.body.removeChild(mockToggle);
    });

    test('should not show toggle on non-localhost', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true
      });

      const mockToggle = document.createElement('div');
      mockToggle.id = 'aiMockToggle';
      mockToggle.classList.add('hidden');
      document.body.appendChild(mockToggle);

      const result = initMockMode();

      expect(mockToggle.classList.contains('hidden')).toBe(true);

      // Cleanup
      document.body.removeChild(mockToggle);
    });

    test('should recognize 127.0.0.1 as localhost', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: '127.0.0.1' },
        writable: true
      });

      const mockToggle = document.createElement('div');
      mockToggle.id = 'aiMockToggle';
      mockToggle.classList.add('hidden');
      document.body.appendChild(mockToggle);

      const mockCheckbox = document.createElement('input');
      mockCheckbox.id = 'mockModeCheckbox';
      mockCheckbox.type = 'checkbox';
      document.body.appendChild(mockCheckbox);

      const result = initMockMode();

      expect(mockToggle.classList.contains('hidden')).toBe(false);

      // Cleanup
      document.body.removeChild(mockToggle);
      document.body.removeChild(mockCheckbox);
    });

    test('should recognize empty hostname as localhost', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: '' },
        writable: true
      });

      const mockToggle = document.createElement('div');
      mockToggle.id = 'aiMockToggle';
      mockToggle.classList.add('hidden');
      document.body.appendChild(mockToggle);

      const mockCheckbox = document.createElement('input');
      mockCheckbox.id = 'mockModeCheckbox';
      mockCheckbox.type = 'checkbox';
      document.body.appendChild(mockCheckbox);

      const result = initMockMode();

      expect(mockToggle.classList.contains('hidden')).toBe(false);

      // Cleanup
      document.body.removeChild(mockToggle);
      document.body.removeChild(mockCheckbox);
    });
  });

  describe('setMockMode', () => {
    test('should enable mock mode', () => {
      setMockMode(true);
      expect(isMockMode()).toBe(true);
    });

    test('should disable mock mode', () => {
      setMockMode(true);
      setMockMode(false);
      expect(isMockMode()).toBe(false);
    });

    test('should persist to localStorage', () => {
      setMockMode(true);
      expect(localStorage.getItem('aiMockMode')).toBe('true');
    });

    test('should update checkbox when present', () => {
      const mockCheckbox = document.createElement('input');
      mockCheckbox.id = 'mockModeCheckbox';
      mockCheckbox.type = 'checkbox';
      mockCheckbox.checked = false;
      document.body.appendChild(mockCheckbox);

      setMockMode(true);

      expect(mockCheckbox.checked).toBe(true);

      setMockMode(false);

      expect(mockCheckbox.checked).toBe(false);

      // Cleanup
      document.body.removeChild(mockCheckbox);
    });

    test('should handle missing checkbox gracefully', () => {
      // No checkbox in DOM
      expect(() => setMockMode(true)).not.toThrow();
      expect(isMockMode()).toBe(true);
    });

    test('should return the enabled state', () => {
      const result1 = setMockMode(true);
      expect(result1).toBe(true);

      const result2 = setMockMode(false);
      expect(result2).toBe(false);
    });
  });

  describe('isMockMode', () => {
    test('should return false by default', () => {
      expect(isMockMode()).toBe(false);
    });

    test('should return true when enabled', () => {
      setMockMode(true);
      expect(isMockMode()).toBe(true);
    });
  });

  describe('getMockResponse', () => {
    test('should return mock response for phase 1', async () => {
      const response = await getMockResponse(1);
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    test('should return mock response for phase 2', async () => {
      const response = await getMockResponse(2);
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    test('should return default message for unknown phase', async () => {
      const response = await getMockResponse(999);
      expect(response).toContain('not available');
    });

    test('should simulate network delay', async () => {
      const start = Date.now();
      await getMockResponse(1);
      const elapsed = Date.now() - start;

      // Allow 10ms tolerance for timing variations in CI environments
      expect(elapsed).toBeGreaterThanOrEqual(490);
    });
  });

  describe('addMockResponse', () => {
    test('should add custom mock response', async () => {
      const customResponse = 'Custom test response';
      addMockResponse(3, customResponse);
      
      const response = await getMockResponse(3);
      expect(response).toBe(customResponse);
    });

    test('should override existing mock response', async () => {
      const customResponse = 'Override response';
      addMockResponse(1, customResponse);
      
      const response = await getMockResponse(1);
      expect(response).toBe(customResponse);
    });
  });
});

