# JavaScript Module Templates

## Purpose

This directory contains JavaScript ES6 module templates for web applications.

## Contents

1. **`storage-template.js`** - IndexedDB wrapper for data persistence
2. **`workflow-template.js`** - Multi-phase workflow engine
3. **`ui-template.js`** - UI components and rendering
4. **`app-template.js`** - Application initialization and routing

## Module Overview

### storage-template.js

**Purpose**: Client-side data persistence using IndexedDB

**Exports**:
- `initDB()` - Initialize database
- `saveProject(project)` - Save project
- `getProject(id)` - Get project by ID
- `getAllProjects()` - Get all projects
- `deleteProject(id)` - Delete project
- `exportProject(id)` - Export as JSON
- `importProject(json)` - Import from JSON

**Usage**:
```javascript
import { initDB, saveProject, getAllProjects } from './storage.js';

await initDB();
const projects = await getAllProjects();
```

### workflow-template.js

**Purpose**: Multi-phase workflow state management

**Exports**:
- `createWorkflow(phaseCount)` - Create new workflow
- `getCurrentPhase(workflow)` - Get current phase
- `completePhase(workflow, phaseNumber, response)` - Mark phase complete
- `canProceed(workflow, phaseNumber)` - Check if can proceed
- `getProgress(workflow)` - Get completion percentage

**Usage**:
```javascript
import { createWorkflow, completePhase } from './workflow.js';

const workflow = createWorkflow(3);
completePhase(workflow, 1, aiResponse);
```

### ui-template.js

**Purpose**: UI component rendering and event handling

**Exports**:
- `renderProjectList(projects)` - Render project list
- `renderPhase(phase)` - Render phase UI
- `showModal(title, content)` - Show modal dialog
- `showToast(message, type)` - Show toast notification
- `updateProgress(percentage)` - Update progress bar

**Usage**:
```javascript
import { renderProjectList, showToast } from './ui.js';

renderProjectList(projects);
showToast('Project saved!', 'success');
```

### app-template.js

**Purpose**: Application initialization and global state

**Exports**:
- `init()` - Initialize application
- `setState(key, value)` - Update global state
- `getState(key)` - Get global state
- `navigate(route)` - Navigate to route

**Usage**:
```javascript
import { init } from './app.js';

document.addEventListener('DOMContentLoaded', init);
```

## Code Standards

All JavaScript modules must follow these standards:

### ES6 Modules
- ✅ Use `import`/`export` syntax
- ✅ No CommonJS (`require`)
- ✅ Named exports preferred
- ✅ One module per file

### Error Handling
- ✅ Try-catch for async operations
- ✅ Meaningful error messages
- ✅ Log errors to console (dev only)
- ✅ Show user-friendly messages

### Async/Await
- ✅ Use async/await (not callbacks)
- ✅ Handle promise rejections
- ✅ No unhandled promise rejections

### Code Style
- ✅ 2-space indentation
- ✅ Single quotes for strings
- ✅ Semicolons required
- ✅ camelCase for variables/functions
- ✅ PascalCase for classes

### Documentation
- ✅ JSDoc comments for functions
- ✅ Describe parameters and return values
- ✅ Include usage examples

## Testing

Each module should have corresponding tests:

- `storage-template.js` → `storage.test.js`
- `workflow-template.js` → `workflow.test.js`
- `ui-template.js` → `ui.test.js`
- `app-template.js` → `app.test.js`

See `../../../05-QUALITY-STANDARDS.md` for testing requirements.

## Related Documentation

- **Web App Templates**: `../../README.md`
- **Quality Standards**: `../../../../05-QUALITY-STANDARDS.md`
- **Testing Guide**: `../../../docs/TESTING-template.md`

