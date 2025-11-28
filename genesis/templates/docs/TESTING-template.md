# Testing Guide

This document describes the testing strategy and requirements for {{PROJECT_TITLE}}.

---

## Testing Philosophy

All code must be tested to ensure reliability and maintainability. We maintain:
- **85% minimum code coverage** for logic and branches
- **Unit tests** for all business logic
- **Integration tests** for component interactions
- **End-to-end tests** for critical user workflows

---

## Running Tests

### All Tests

```bash
npm test
```

### Unit Tests Only

```bash
npm run test:unit
```

### Integration Tests Only

```bash
npm run test:integration
```

### End-to-End Tests

```bash
npm run test:e2e
```

### Coverage Report

```bash
npm run test:coverage
```

Coverage reports are generated in `coverage/` directory.

---

## Test Structure

```
tests/
├── unit/                       # Unit tests
│   ├── storage.test.js         # Storage module tests
│   ├── workflow.test.js        # Workflow engine tests
│   └── ui.test.js              # UI helper tests
├── integration/                # Integration tests
│   ├── workflow-storage.test.js
│   └── ui-workflow.test.js
├── e2e/                        # End-to-end tests
│   ├── create-project.test.js
│   ├── complete-workflow.test.js
│   └── export-import.test.js
└── fixtures/                   # Test data
    ├── mock-projects.json
    └── mock-responses.json
```

---

## Writing Tests

### Unit Test Example

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { Workflow } from '../src/js/workflow.js';

describe('Workflow', () => {
  let workflow;
  let mockProject;

  beforeEach(() => {
    mockProject = {
      id: 'test-1',
      title: 'Test Project',
      phase: 1
    };
    workflow = new Workflow(mockProject);
  });

  it('should initialize with correct phase', () => {
    expect(workflow.currentPhase).toBe(1);
  });

  it('should advance to next phase', () => {
    const result = workflow.advancePhase();
    expect(result).toBe(true);
    expect(workflow.currentPhase).toBe(2);
  });

  it('should not advance beyond final phase', () => {
    workflow.currentPhase = {{PHASE_COUNT}};
    const result = workflow.advancePhase();
    expect(result).toBe(false);
    expect(workflow.currentPhase).toBe({{PHASE_COUNT}});
  });
});
```

### Integration Test Example

```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { storage } from '../src/js/storage.js';
import { Workflow } from '../src/js/workflow.js';

describe('Workflow + Storage Integration', () => {
  beforeEach(async () => {
    await storage.init();
  });

  afterEach(async () => {
    // Clean up test data
    const projects = await storage.getAllProjects();
    for (const project of projects) {
      await storage.deleteProject(project.id);
    }
  });

  it('should save workflow progress to storage', async () => {
    const project = {
      id: 'test-1',
      title: 'Test Project',
      phase: 1
    };

    const workflow = new Workflow(project);
    workflow.savePhaseOutput('Test output');
    
    await storage.saveProject(project);
    
    const retrieved = await storage.getProject('test-1');
    expect(retrieved.phase1_output).toBe('Test output');
  });
});
```

### End-to-End Test Example

```javascript
import { test, expect } from '@playwright/test';

test('complete workflow end-to-end', async ({ page }) => {
  await page.goto('http://localhost:8000');

  // Create new project
  await page.click('button:has-text("New Project")');
  await page.fill('input[name="title"]', 'E2E Test Project');
  await page.fill('textarea[name="description"]', 'Test description');
  await page.click('button:has-text("Create")');

  // Verify project created
  await expect(page.locator('h1')).toContainText('E2E Test Project');

  // Complete Phase 1
  await page.fill('textarea[name="phase1-output"]', 'Phase 1 output');
  await page.click('button:has-text("Next Phase")');

  // Verify Phase 2 loaded
  await expect(page.locator('.phase-indicator')).toContainText('Phase 2');

  // Complete Phase 2
  await page.fill('textarea[name="phase2-output"]', 'Phase 2 output');
  await page.click('button:has-text("Complete")');

  // Verify completion
  await expect(page.locator('.status')).toContainText('Complete');
});
```

---

## AI Mock Mode Testing

<!-- IF {{USES_EXTERNAL_AI}} -->
For testing without API costs, use mock mode:

```bash
export AI_MODE=mock
npm test
```

Mock responses are defined in `tests/fixtures/mock-responses.json`:

```json
{
  "phase1": "Mock response for phase 1...",
  "phase2": "Mock response for phase 2..."
}
```

**Note**: Mock mode is for testing only and does not call real AI models.
<!-- END IF -->

---

## Coverage Requirements

All pull requests must maintain or improve code coverage:

- **Overall coverage**: ≥ 85%
- **Logic coverage**: ≥ 85%
- **Branch coverage**: ≥ 85%

Check coverage before submitting PR:

```bash
npm run test:coverage
```

---

## Continuous Integration

Tests run automatically on:
- Every push to any branch
- Every pull request
- Scheduled daily runs

CI configuration: `.github/workflows/ci.yml`

---

## Troubleshooting

### Tests Failing Locally

1. **Clear test database**:
   ```bash
   rm -rf .test-db
   ```

2. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Check Node version**:
   ```bash
   node --version  # Should be 18+
   ```

### Browser Tests Failing

1. **Install browsers**:
   ```bash
   npx playwright install
   ```

2. **Run in headed mode**:
   ```bash
   npm run test:e2e -- --headed
   ```

### Coverage Not Updating

1. **Clear coverage cache**:
   ```bash
   rm -rf coverage
   ```

2. **Run with clean slate**:
   ```bash
   npm run test:coverage -- --no-cache
   ```

---

## Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests independent** (no shared state)
4. **Mock external dependencies**
5. **Test error cases** (not just happy path)
6. **Keep tests fast** (< 1s per test)
7. **Use fixtures** for test data
8. **Clean up after tests** (no side effects)

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Questions?** See [CONTRIBUTING.md](../CONTRIBUTING.md) or open an issue.

