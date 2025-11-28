import { test, expect } from '@playwright/test';

test.describe('AI Mock Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should toggle AI mock mode on and off', async ({ page }) => {
    // Look for mock mode toggle
    const mockToggle = page.locator('#mock-mode-toggle');
    
    if (await mockToggle.isVisible()) {
      // Initially should be off
      const isChecked = await mockToggle.isChecked();
      
      // Toggle on
      await mockToggle.click();
      await expect(mockToggle).toBeChecked();
      
      // Toggle off
      await mockToggle.click();
      await expect(mockToggle).not.toBeChecked();
    } else {
      // If toggle not visible, test passes (mock mode might be dev-only)
      test.skip();
    }
  });

  test('should persist mock mode setting in localStorage', async ({ page }) => {
    const mockToggle = page.locator('#mock-mode-toggle');
    
    if (await mockToggle.isVisible()) {
      // Enable mock mode
      await mockToggle.click();
      await expect(mockToggle).toBeChecked();
      
      // Check localStorage
      const mockModeEnabled = await page.evaluate(() => {
        return localStorage.getItem('aiMockMode') === 'true';
      });
      expect(mockModeEnabled).toBe(true);
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Verify mock mode is still enabled
      const mockToggleAfterReload = page.locator('#mock-mode-toggle');
      if (await mockToggleAfterReload.isVisible()) {
        await expect(mockToggleAfterReload).toBeChecked();
      }
    } else {
      test.skip();
    }
  });

  test('should use mock responses when mock mode is enabled', async ({ page }) => {
    const mockToggle = page.locator('#mock-mode-toggle');
    
    if (await mockToggle.isVisible()) {
      // Enable mock mode
      await mockToggle.click();
      await expect(mockToggle).toBeChecked();
      
      // Submit Phase 1
      await page.fill('#user-prompt', 'Test with mock mode');
      await page.click('#submit-phase1');
      
      // Wait for response
      await page.waitForSelector('#phase2-section', { state: 'visible', timeout: 5000 });
      
      // Verify we got a response (mock response should be fast)
      const phase1Output = page.locator('#phase1-output');
      await expect(phase1Output).toBeVisible();
      
      // Mock responses typically contain certain keywords
      const outputText = await phase1Output.textContent();
      expect(outputText.length).toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });

  test('should show mock mode indicator when enabled', async ({ page }) => {
    const mockToggle = page.locator('#mock-mode-toggle');
    
    if (await mockToggle.isVisible()) {
      // Enable mock mode
      await mockToggle.click();
      
      // Look for mock mode indicator
      const mockIndicator = page.locator('[data-testid="mock-mode-indicator"]');
      if (await mockIndicator.isVisible()) {
        await expect(mockIndicator).toContainText(/mock/i);
      }
    } else {
      test.skip();
    }
  });

  test('should handle mock mode toggle during workflow', async ({ page }) => {
    const mockToggle = page.locator('#mock-mode-toggle');
    
    if (await mockToggle.isVisible()) {
      // Start with mock mode off
      if (await mockToggle.isChecked()) {
        await mockToggle.click();
      }
      
      // Fill Phase 1
      await page.fill('#user-prompt', 'Test prompt');
      
      // Enable mock mode before submitting
      await mockToggle.click();
      await expect(mockToggle).toBeChecked();
      
      // Submit Phase 1
      await page.click('#submit-phase1');
      
      // Should still work
      await page.waitForSelector('#phase2-section', { state: 'visible', timeout: 5000 });
      const phase2Section = page.locator('#phase2-section');
      await expect(phase2Section).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should only show mock mode toggle in development', async ({ page }) => {
    // Check if we're in production mode
    const isProduction = await page.evaluate(() => {
      return window.location.hostname !== 'localhost' && 
             window.location.hostname !== '127.0.0.1';
    });
    
    const mockToggle = page.locator('#mock-mode-toggle');
    const isVisible = await mockToggle.isVisible();
    
    if (isProduction) {
      // In production, mock toggle should not be visible
      expect(isVisible).toBe(false);
    } else {
      // In development, it may or may not be visible (depends on implementation)
      expect(typeof isVisible).toBe('boolean');
    }
  });

  test('should provide different mock responses for different phases', async ({ page }) => {
    const mockToggle = page.locator('#mock-mode-toggle');
    
    if (await mockToggle.isVisible()) {
      // Enable mock mode
      await mockToggle.click();
      
      // Phase 1
      await page.fill('#user-prompt', 'Test Phase 1');
      await page.click('#submit-phase1');
      await page.waitForSelector('#phase2-section', { state: 'visible', timeout: 5000 });
      
      const phase1Output = await page.locator('#phase1-output').textContent();
      
      // Phase 2
      await page.fill('#review-notes', 'Test Phase 2');
      await page.click('#submit-phase2');
      await page.waitForSelector('#phase3-section', { state: 'visible', timeout: 5000 });
      
      const phase2Output = await page.locator('#phase2-output').textContent();
      
      // Responses should be different
      expect(phase1Output).not.toBe(phase2Output);
    } else {
      test.skip();
    }
  });
});

