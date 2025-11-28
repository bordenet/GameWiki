# {{PROJECT_TITLE}} - Development Guide

This guide covers local development setup and workflows.

---

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}.git
cd {{GITHUB_REPO}}
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env and fill in your values
nano .env
```

### 3. Run Setup Script
```bash
# macOS
./scripts/setup-macos.sh

# Linux
./scripts/setup-linux.sh

# Windows (WSL)
./scripts/setup-windows-wsl.sh

# Windows (PowerShell)
.\scripts\setup-windows.ps1
```

### 4. Open in Browser
```bash
# macOS
open {{DEPLOY_FOLDER}}/index.html

# Linux
xdg-open {{DEPLOY_FOLDER}}/index.html

# Windows
start {{DEPLOY_FOLDER}}/index.html
```

**That's it!** No build step required.

---

## Development Workflow

### File Structure
```
{{GITHUB_REPO}}/
├── {{DEPLOY_FOLDER}}/          # Web application
│   ├── index.html              # Main HTML
│   ├── css/                    # Styles
│   ├── js/                     # JavaScript modules
│   │   ├── app.js              # Main app
│   │   ├── workflow.js         # Workflow engine
│   │   ├── storage.js          # IndexedDB storage
│   │   └── ai-mock.js          # AI mock mode (testing)
│   └── assets/                 # Images, icons
├── prompts/                    # AI prompt templates
├── scripts/                    # Setup and utility scripts
├── tests/                      # Test files
└── .github/workflows/          # CI/CD workflows
```

### Making Changes

1. **Edit files** in `{{DEPLOY_FOLDER}}/`
2. **Refresh browser** (no build step!)
3. **Test changes** manually
4. **Run tests**: `npm test`
5. **Commit**: `git commit -am "description"`
6. **Push**: `git push origin main`

---

## Testing

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run E2E Tests Only
```bash
npm run test:e2e
```

### Run with Coverage
```bash
npm run test:coverage
```

### Watch Mode (Auto-rerun)
```bash
npm run test:watch
```

### AI Mock Mode

Enable mock AI responses for testing:

1. Open `{{DEPLOY_FOLDER}}/index.html` in browser
2. Look for "AI Mock Mode" toggle (bottom-right, localhost only)
3. Enable toggle
4. Test workflow without real AI calls

**Benefits**:
- No API costs
- Faster testing
- Consistent responses
- Offline development

---

## Code Quality

### Linting

```bash
# JavaScript
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Pre-commit Hooks

Automatically run on `git commit`:
- Linting
- Tests
- Coverage check

**Install**:
```bash
./scripts/install-hooks.sh
```

**Skip** (emergency only):
```bash
git commit --no-verify
```

---

## Debugging

### Browser DevTools

1. Open DevTools: `F12` or `Cmd+Option+I`
2. **Console**: View logs and errors
3. **Network**: Monitor requests
4. **Application**: Inspect IndexedDB
5. **Sources**: Debug JavaScript

### Common Issues

#### IndexedDB Not Working
```javascript
// Check in Console
indexedDB.databases()
```

#### Module Not Loading
```javascript
// Check in Console → Network tab
// Look for 404 errors on .js files
```

#### Dark Mode Not Persisting
```javascript
// Check localStorage
localStorage.getItem('darkMode')
```

---

## Project Structure

### HTML (`{{DEPLOY_FOLDER}}/index.html`)
- Semantic HTML5
- Tailwind CSS via CDN
- ES6 module imports

### JavaScript Modules

#### `app.js` - Main Application
```javascript
import { initDB } from './storage.js';
import { createProject } from './workflow.js';

// Initialize app
async function initApp() {
  await initDB();
  renderUI();
}
```

#### `workflow.js` - Workflow Engine
```javascript
export function createProject(name, description) {
  // Create new project
}

export function advancePhase(projectId) {
  // Move to next phase
}
```

#### `storage.js` - Data Persistence
```javascript
export async function initDB() {
  // Initialize IndexedDB
}

export async function saveProject(project) {
  // Save to IndexedDB
}
```

---

## Adding New Features

### 1. Plan the Feature
- Define requirements
- Design data model
- Plan UI changes

### 2. Write Tests First (TDD)
```javascript
// tests/new-feature.test.js
describe('New Feature', () => {
  test('should do something', () => {
    expect(newFeature()).toBe(expected);
  });
});
```

### 3. Implement Feature
```javascript
// {{DEPLOY_FOLDER}}/js/new-feature.js
export function newFeature() {
  // Implementation
}
```

### 4. Update UI
```html
<!-- {{DEPLOY_FOLDER}}/index.html -->
<button onclick="newFeature()">New Feature</button>
```

### 5. Test Manually
- Open in browser
- Test all scenarios
- Check console for errors

### 6. Run Automated Tests
```bash
npm test
npm run test:coverage
```

### 7. Update Documentation
- Update README.md
- Add to CHANGELOG.md
- Update relevant docs

---

## Performance Optimization

### Lazy Loading
```javascript
// Load large modules only when needed
const module = await import('./large-module.js');
```

### Debouncing
```javascript
// Debounce auto-save
let saveTimeout;
function autoSave(project) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveProject(project);
  }, 1000);
}
```

### IndexedDB Optimization
```javascript
// Use indexes for faster queries
objectStore.createIndex('created', 'created', { unique: false });
```

---

## Related Documentation

- [Testing Guide](../TESTING-template.md)
- [Architecture](../architecture/ARCHITECTURE-template.md)
- [API Documentation](../API-template.md)
- [Contributing Guide](../../CONTRIBUTING-template.md)

