import { describe, test, expect, beforeEach } from '@jest/globals';
import { showToast, showLoading, hideLoading, copyToClipboard, formatDate, formatBytes } from '../js/ui.js';

describe('UI Module', () => {
  beforeEach(() => {
    // Set up DOM elements needed for UI functions
    document.body.innerHTML = `
      <div id="toast-container"></div>
      <div id="loading-overlay" class="hidden">
        <div id="loading-text"></div>
      </div>
    `;
  });

  describe('showToast', () => {
    test('should create toast element', () => {
      showToast('Test message', 'info', 100);
      
      const container = document.getElementById('toast-container');
      expect(container.children.length).toBeGreaterThan(0);
    });

    test('should show success toast with correct styling', () => {
      showToast('Success!', 'success', 100);
      
      const container = document.getElementById('toast-container');
      const toast = container.firstChild;
      expect(toast.className).toContain('bg-green-500');
      expect(toast.textContent).toContain('Success!');
    });

    test('should show error toast with correct styling', () => {
      showToast('Error!', 'error', 100);
      
      const container = document.getElementById('toast-container');
      const toast = container.firstChild;
      expect(toast.className).toContain('bg-red-500');
      expect(toast.textContent).toContain('Error!');
    });

    test('should show warning toast with correct styling', () => {
      showToast('Warning!', 'warning', 100);
      
      const container = document.getElementById('toast-container');
      const toast = container.firstChild;
      expect(toast.className).toContain('bg-yellow-500');
      expect(toast.textContent).toContain('Warning!');
    });

    test('should show info toast by default', () => {
      showToast('Info message', undefined, 100);
      
      const container = document.getElementById('toast-container');
      const toast = container.firstChild;
      expect(toast.className).toContain('bg-blue-500');
    });
  });

  describe('showLoading and hideLoading', () => {
    test('should show loading overlay', () => {
      showLoading('Loading data...');
      
      const overlay = document.getElementById('loading-overlay');
      const text = document.getElementById('loading-text');
      
      expect(overlay.classList.contains('hidden')).toBe(false);
      expect(text.textContent).toBe('Loading data...');
    });

    test('should hide loading overlay', () => {
      showLoading('Loading...');
      hideLoading();
      
      const overlay = document.getElementById('loading-overlay');
      expect(overlay.classList.contains('hidden')).toBe(true);
    });

    test('should use default loading text', () => {
      showLoading();
      
      const text = document.getElementById('loading-text');
      expect(text.textContent).toBe('Loading...');
    });
  });

  describe('copyToClipboard', () => {
    test('should copy text to clipboard', async () => {
      const text = 'Test content';
      await copyToClipboard(text);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
    });

    test('should handle clipboard errors gracefully', async () => {
      navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'));
      
      // Should not throw
      await expect(copyToClipboard('test')).resolves.not.toThrow();
    });
  });

  describe('formatDate', () => {
    test('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = formatDate(date);
      
      expect(formatted).toMatch(/Jan 15, 2024/);
    });

    test('should handle timestamp input', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const formatted = formatDate(timestamp);
      
      expect(formatted).toMatch(/Jan 15, 2024/);
    });
  });

  describe('formatBytes', () => {
    test('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(1073741824)).toBe('1 GB');
    });

    test('should handle decimal places', () => {
      expect(formatBytes(1536, 2)).toBe('1.50 KB');
      expect(formatBytes(1536, 0)).toBe('2 KB');
    });

    test('should handle negative values', () => {
      expect(formatBytes(-1024)).toBe('-1 KB');
    });
  });
});

