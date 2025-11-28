# Testing Templates

## Purpose

This directory contains testing templates, configuration, and examples for implementing comprehensive test coverage.

## Contents

### Configuration Files

1. **`jest.config-template.js`** - Jest configuration for JavaScript testing
2. **`package-template.json`** - Package.json with test dependencies
3. **`.bats-template`** - Bats configuration for shell script testing

### Test Templates

4. **`storage.test-template.js`** - Example tests for storage module
5. **`workflow.test-template.js`** - Example tests for workflow module
6. **`ui.test-template.js`** - Example tests for UI module
7. **`setup-macos.bats-template`** - Example tests for setup script

### E2E Testing

8. **`playwright.config-template.js`** - Playwright configuration
9. **`e2e/workflow.spec-template.js`** - E2E workflow test

### Coverage

10. **`.coveragerc-template`** - Coverage configuration
11. **`coverage-check-template.sh`** - Coverage threshold checker

## Testing Strategy

### Unit Tests (70% of tests)
- Test individual functions
- Mock dependencies
- Fast execution (< 1 second per test)
- High coverage (90%+ for utilities)

### Integration Tests (20% of tests)
- Test module interactions
- Use real dependencies where possible
- Medium execution time (1-5 seconds per test)
- Cover critical paths

### E2E Tests (10% of tests)
- Test complete workflows
- Use real browser
- Slower execution (5-30 seconds per test)
- Cover happy paths and critical errors

## Coverage Requirements

**Minimum**: 85% overall coverage

**Breakdown**:
- Statements: 85%
- Branches: 80%
- Functions: 85%
- Lines: 85%

**Exclusions**:
- Test files
- Configuration files
- Mock files
- Generated code

## Test Structure

```
project/
├── web/
│   ├── js/
│   │   ├── storage.js
│   │   └── __tests__/
│   │       └── storage.test.js
│   └── __tests__/
│       └── e2e/
│           └── workflow.spec.js
├── scripts/
│   ├── setup-macos.sh
│   └── __tests__/
│       └── setup-macos.bats
└── package.json
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### E2E Tests Only
```bash
npm run test:e2e
```

### With Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

## Writing Tests

### Unit Test Example

```javascript
// storage.test.js
import { saveProject, getProject } from '../storage.js';

describe('Storage', () => {
  beforeEach(async () => {
    await initDB();
  });

  test('saveProject stores project', async () => {
    const project = { id: '1', name: 'Test' };
    await saveProject(project);
    const retrieved = await getProject('1');
    expect(retrieved).toEqual(project);
  });
});
```

### Shell Script Test Example

```bash
# setup-macos.bats
@test "check_command detects installed commands" {
  run check_command "bash"
  [ "$status" -eq 0 ]
}

@test "check_command fails for missing commands" {
  run check_command "nonexistent_command_xyz"
  [ "$status" -eq 1 ]
}
```

### E2E Test Example

```javascript
// workflow.spec.js
import { test, expect } from '@playwright/test';

test('complete 3-phase workflow', async ({ page }) => {
  await page.goto('http://localhost:8000');
  
  // Create project
  await page.click('button:has-text("New Project")');
  await page.fill('input[name="name"]', 'Test Project');
  await page.click('button:has-text("Create")');
  
  // Complete phase 1
  await page.fill('textarea[name="response"]', 'Phase 1 response');
  await page.click('button:has-text("Next")');
  
  // Verify phase 2 loaded
  await expect(page.locator('h2')).toContainText('Phase 2');
});
```

## Best Practices

### Do's ✅
- Write tests before fixing bugs
- Test edge cases
- Use descriptive test names
- Keep tests independent
- Mock external dependencies
- Test error conditions

### Don'ts ❌
- Don't test implementation details
- Don't write flaky tests
- Don't skip tests
- Don't ignore failing tests
- Don't test third-party code
- Don't make tests too complex

## Related Documentation

- **Testing Guide**: `../docs/TESTING-template.md`
- **Quality Standards**: `../../05-QUALITY-STANDARDS.md`
- **AI Instructions**: `../../01-AI-INSTRUCTIONS.md`

## Maintenance

When adding test templates:
1. Create template file with `-template` suffix
2. Add comprehensive examples
3. Document test patterns
4. Update this README
5. Update `../../SUMMARY.md`

