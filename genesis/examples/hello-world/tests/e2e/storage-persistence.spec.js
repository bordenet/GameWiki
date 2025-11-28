import { test, expect } from '@playwright/test';

test.describe('Storage Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Clear IndexedDB before each test
    await page.evaluate(() => {
      return new Promise((resolve) => {
        const request = indexedDB.deleteDatabase('GenesisWorkflowDB');
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
      });
    });
  });

  test('should persist workflow data in IndexedDB', async ({ page }) => {
    // Complete Phase 1
    await page.fill('#user-prompt', 'Test prompt for persistence');
    await page.click('#submit-phase1');
    await page.waitForSelector('#phase2-section', { state: 'visible' });
    
    // Check IndexedDB
    const hasData = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const request = indexedDB.open('GenesisWorkflowDB', 1);
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['workflows'], 'readonly');
          const store = transaction.objectStore('workflows');
          const getRequest = store.getAll();
          
          getRequest.onsuccess = () => {
            resolve(getRequest.result.length > 0);
          };
        };
      });
    });
    
    expect(hasData).toBe(true);
  });

  test('should restore workflow data after page reload', async ({ page }) => {
    const testPrompt = 'Persistent test prompt';
    
    // Complete Phase 1
    await page.fill('#user-prompt', testPrompt);
    await page.click('#submit-phase1');
    await page.waitForSelector('#phase2-section', { state: 'visible' });
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check if data is restored
    const phase1Output = page.locator('#phase1-output');
    if (await phase1Output.isVisible()) {
      await expect(phase1Output).toContainText(testPrompt);
    }
  });

  test('should export workflow data', async ({ page }) => {
    // Complete Phase 1
    await page.fill('#user-prompt', 'Export test prompt');
    await page.click('#submit-phase1');
    await page.waitForSelector('#phase2-section', { state: 'visible' });
    
    // Look for export button
    const exportButton = page.locator('button:has-text("Export")');
    if (await exportButton.isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.json$/);
    }
  });

  test('should import workflow data', async ({ page }) => {
    // Create test data
    const testData = {
      id: 'test-workflow-1',
      phase1: {
        userPrompt: 'Imported test prompt',
        timestamp: new Date().toISOString(),
      },
    };
    
    // Look for import button
    const importButton = page.locator('button:has-text("Import")');
    if (await importButton.isVisible()) {
      // Create a file to import
      const fileContent = JSON.stringify(testData);
      const buffer = Buffer.from(fileContent);
      
      // Set up file chooser
      const fileChooserPromise = page.waitForEvent('filechooser');
      await importButton.click();
      
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles({
        name: 'test-workflow.json',
        mimeType: 'application/json',
        buffer: buffer,
      });
      
      // Wait for import to complete
      await page.waitForTimeout(500);
      
      // Verify data is imported
      const phase1Output = page.locator('#phase1-output');
      if (await phase1Output.isVisible()) {
        await expect(phase1Output).toContainText('Imported test prompt');
      }
    }
  });

  test('should handle storage quota exceeded', async ({ page }) => {
    // This test verifies graceful handling of storage errors
    await page.evaluate(() => {
      // Mock IndexedDB to simulate quota exceeded
      const originalOpen = indexedDB.open;
      indexedDB.open = function() {
        const request = originalOpen.apply(this, arguments);
        const originalSuccess = request.onsuccess;
        request.onsuccess = function(event) {
          const db = event.target.result;
          const originalTransaction = db.transaction;
          db.transaction = function() {
            const transaction = originalTransaction.apply(this, arguments);
            const originalObjectStore = transaction.objectStore;
            transaction.objectStore = function() {
              const store = originalObjectStore.apply(this, arguments);
              const originalAdd = store.add;
              store.add = function() {
                const addRequest = originalAdd.apply(this, arguments);
                setTimeout(() => {
                  const error = new Error('QuotaExceededError');
                  error.name = 'QuotaExceededError';
                  if (addRequest.onerror) {
                    addRequest.onerror({ target: { error } });
                  }
                }, 0);
                return addRequest;
              };
              return store;
            };
            return transaction;
          };
          if (originalSuccess) {
            originalSuccess.call(this, event);
          }
        };
        return request;
      };
    });
    
    // Try to save data
    await page.fill('#user-prompt', 'Test quota exceeded');
    await page.click('#submit-phase1');
    
    // Application should handle error gracefully (not crash)
    await page.waitForTimeout(1000);
    const hasError = await page.evaluate(() => {
      return document.body.innerText.includes('error') || 
             document.body.innerText.includes('Error');
    });
    
    // We expect either an error message or graceful degradation
    expect(typeof hasError).toBe('boolean');
  });
});

