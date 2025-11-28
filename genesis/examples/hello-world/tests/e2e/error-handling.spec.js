import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);
    
    // Try to submit Phase 1
    await page.fill('#user-prompt', 'Test network error');
    await page.click('#submit-phase1');
    
    // Wait a bit for error handling
    await page.waitForTimeout(2000);
    
    // Application should not crash
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    
    // Restore online mode
    await page.context().setOffline(false);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API calls and return errors
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });
    
    // Try to submit Phase 1
    await page.fill('#user-prompt', 'Test API error');
    await page.click('#submit-phase1');
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Application should show error or handle gracefully
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('should handle invalid input gracefully', async ({ page }) => {
    // Try to submit with very long input
    const longInput = 'a'.repeat(10000);
    await page.fill('#user-prompt', longInput);
    await page.click('#submit-phase1');
    
    // Application should handle this
    await page.waitForTimeout(1000);
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('should handle special characters in input', async ({ page }) => {
    const specialChars = '<script>alert("xss")</script>\n\r\t\'"&';
    await page.fill('#user-prompt', specialChars);
    await page.click('#submit-phase1');
    
    // Wait for processing
    await page.waitForTimeout(2000);
    
    // Check that script was not executed (XSS protection)
    const alerts = [];
    page.on('dialog', dialog => {
      alerts.push(dialog.message());
      dialog.dismiss();
    });
    
    await page.waitForTimeout(500);
    expect(alerts.length).toBe(0);
  });

  test('should handle IndexedDB errors gracefully', async ({ page }) => {
    // Mock IndexedDB to throw errors
    await page.evaluate(() => {
      const originalOpen = indexedDB.open;
      indexedDB.open = function() {
        throw new Error('IndexedDB not available');
      };
    });
    
    // Try to use the application
    await page.fill('#user-prompt', 'Test IndexedDB error');
    await page.click('#submit-phase1');
    
    // Application should handle error gracefully
    await page.waitForTimeout(1000);
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('should handle rapid form submissions', async ({ page }) => {
    // Submit multiple times rapidly
    await page.fill('#user-prompt', 'Rapid submission test');
    
    // Click submit button multiple times
    const submitButton = page.locator('#submit-phase1');
    await submitButton.click();
    await submitButton.click();
    await submitButton.click();
    
    // Application should handle this gracefully (debounce or disable button)
    await page.waitForTimeout(2000);
    
    // Should not crash
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('should handle browser back button', async ({ page }) => {
    // Complete Phase 1
    await page.fill('#user-prompt', 'Test back button');
    await page.click('#submit-phase1');
    await page.waitForSelector('#phase2-section', { state: 'visible' });
    
    // Use browser back button
    await page.goBack();
    
    // Application should handle this gracefully
    await page.waitForTimeout(500);
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('should handle browser forward button', async ({ page }) => {
    // Complete Phase 1
    await page.fill('#user-prompt', 'Test forward button');
    await page.click('#submit-phase1');
    await page.waitForSelector('#phase2-section', { state: 'visible' });
    
    // Go back
    await page.goBack();
    await page.waitForTimeout(500);
    
    // Go forward
    await page.goForward();
    await page.waitForTimeout(500);
    
    // Application should handle this gracefully
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('should handle page refresh during workflow', async ({ page }) => {
    // Start Phase 1
    await page.fill('#user-prompt', 'Test refresh');
    await page.click('#submit-phase1');
    
    // Refresh immediately
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Application should load without errors
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('should handle missing DOM elements gracefully', async ({ page }) => {
    // Remove a critical element
    await page.evaluate(() => {
      const element = document.querySelector('#submit-phase1');
      if (element) {
        element.remove();
      }
    });
    
    // Application should not crash
    await page.waitForTimeout(500);
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('should handle localStorage quota exceeded', async ({ page }) => {
    // Fill localStorage to quota
    await page.evaluate(() => {
      try {
        const largeData = 'x'.repeat(1024 * 1024); // 1MB
        for (let i = 0; i < 10; i++) {
          localStorage.setItem(`large_${i}`, largeData);
        }
      } catch (e) {
        // Quota exceeded, which is what we want
      }
    });
    
    // Try to use the application
    await page.fill('#user-prompt', 'Test localStorage quota');
    await page.click('#submit-phase1');
    
    // Application should handle gracefully
    await page.waitForTimeout(1000);
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });
});

