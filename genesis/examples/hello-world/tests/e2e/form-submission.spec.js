import { test, expect } from '@playwright/test';

test.describe('Form Submission Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the application with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Hello World/);
    await expect(page.locator('h1')).toContainText('Hello World');
  });

  test('should show Phase 1 form initially', async ({ page }) => {
    const phase1Section = page.locator('#phase1-section');
    await expect(phase1Section).toBeVisible();
    
    const phase2Section = page.locator('#phase2-section');
    await expect(phase2Section).not.toBeVisible();
    
    const phase3Section = page.locator('#phase3-section');
    await expect(phase3Section).not.toBeVisible();
  });

  test('should validate required fields in Phase 1', async ({ page }) => {
    const submitButton = page.locator('#submit-phase1');
    await submitButton.click();
    
    // Check for HTML5 validation
    const promptInput = page.locator('#user-prompt');
    const isValid = await promptInput.evaluate((el) => el.checkValidity());
    expect(isValid).toBe(false);
  });

  test('should submit Phase 1 and transition to Phase 2', async ({ page }) => {
    // Fill Phase 1 form
    await page.fill('#user-prompt', 'Test prompt for Phase 1');
    
    // Submit Phase 1
    await page.click('#submit-phase1');
    
    // Wait for Phase 2 to appear
    await page.waitForSelector('#phase2-section', { state: 'visible' });
    
    // Verify Phase 1 is hidden
    const phase1Section = page.locator('#phase1-section');
    await expect(phase1Section).not.toBeVisible();
    
    // Verify Phase 2 is visible
    const phase2Section = page.locator('#phase2-section');
    await expect(phase2Section).toBeVisible();
    
    // Verify Phase 1 output is displayed
    const phase1Output = page.locator('#phase1-output');
    await expect(phase1Output).toContainText('Test prompt for Phase 1');
  });

  test('should validate required fields in Phase 2', async ({ page }) => {
    // Complete Phase 1
    await page.fill('#user-prompt', 'Test prompt');
    await page.click('#submit-phase1');
    await page.waitForSelector('#phase2-section', { state: 'visible' });
    
    // Try to submit Phase 2 without filling
    const submitButton = page.locator('#submit-phase2');
    await submitButton.click();
    
    // Check for HTML5 validation
    const reviewInput = page.locator('#review-notes');
    const isValid = await reviewInput.evaluate((el) => el.checkValidity());
    expect(isValid).toBe(false);
  });

  test('should complete full workflow from Phase 1 to Phase 3', async ({ page }) => {
    // Phase 1
    await page.fill('#user-prompt', 'Create a hello world function');
    await page.click('#submit-phase1');
    await page.waitForSelector('#phase2-section', { state: 'visible' });
    
    // Phase 2
    await page.fill('#review-notes', 'Looks good, add error handling');
    await page.click('#submit-phase2');
    await page.waitForSelector('#phase3-section', { state: 'visible' });
    
    // Verify Phase 3 is visible
    const phase3Section = page.locator('#phase3-section');
    await expect(phase3Section).toBeVisible();
    
    // Verify Phase 2 output is displayed
    const phase2Output = page.locator('#phase2-output');
    await expect(phase2Output).toContainText('Looks good, add error handling');
    
    // Verify final output is displayed
    const finalOutput = page.locator('#final-output');
    await expect(finalOutput).toBeVisible();
  });

  test('should allow starting over from Phase 3', async ({ page }) => {
    // Complete full workflow
    await page.fill('#user-prompt', 'Test prompt');
    await page.click('#submit-phase1');
    await page.waitForSelector('#phase2-section', { state: 'visible' });
    
    await page.fill('#review-notes', 'Test review');
    await page.click('#submit-phase2');
    await page.waitForSelector('#phase3-section', { state: 'visible' });
    
    // Click start over
    const startOverButton = page.locator('#start-over');
    await startOverButton.click();
    
    // Verify back to Phase 1
    const phase1Section = page.locator('#phase1-section');
    await expect(phase1Section).toBeVisible();
    
    // Verify form is cleared
    const promptInput = page.locator('#user-prompt');
    await expect(promptInput).toHaveValue('');
  });

  test('should preserve data when navigating back', async ({ page }) => {
    // Complete Phase 1
    const testPrompt = 'Test prompt for navigation';
    await page.fill('#user-prompt', testPrompt);
    await page.click('#submit-phase1');
    await page.waitForSelector('#phase2-section', { state: 'visible' });
    
    // Go back to Phase 1
    const backButton = page.locator('#back-to-phase1');
    if (await backButton.isVisible()) {
      await backButton.click();
      
      // Verify data is preserved
      const promptInput = page.locator('#user-prompt');
      await expect(promptInput).toHaveValue(testPrompt);
    }
  });
});

