# {{PROJECT_TITLE}} - Architecture

## Overview

{{PROJECT_TITLE}} is a {{PHASE_COUNT}}-phase AI-assisted workflow application for {{PROJECT_DESCRIPTION}}.

**Architecture**: 100% client-side web application with zero build step deployment.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User's Browser                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   UI Layer   │  │   Workflow   │  │   Storage    │      │
│  │   (app.js)   │  │  (workflow.  │  │  (storage.   │      │
│  │              │  │     js)      │  │     js)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │   IndexedDB     │                        │
│                   │  (50MB-10GB)    │                        │
│                   └─────────────────┘                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. UI Layer (`web/js/app.js`)

**Responsibilities**:
- Render user interface
- Handle user interactions
- Display workflow state
- Manage dark mode
- Show notifications

**Key Functions**:
- `initApp()` - Initialize application
- `renderProjectList()` - Display projects
- `renderWorkflow()` - Display current phase
- `handleUserInput()` - Process user actions

### 2. Workflow Engine (`web/js/workflow.js`)

**Responsibilities**:
- Manage {{PHASE_COUNT}}-phase workflow
- Track phase completion
- Validate phase transitions
- Generate prompts for each phase

**Key Functions**:
- `createProject()` - Initialize new project
- `advancePhase()` - Move to next phase
- `validatePhase()` - Check phase completion
- `generatePrompt()` - Create AI prompts

**Workflow States**:
1. **Phase 1**: {{PHASE_1_NAME}} ({{PHASE_1_AI}})
2. **Phase 2**: {{PHASE_2_NAME}} ({{PHASE_2_AI}})
<!-- IF {{PHASE_COUNT}} >= 3 -->
3. **Phase 3**: {{PHASE_3_NAME}} ({{PHASE_3_AI}})
<!-- END IF -->

### 3. Storage Layer (`web/js/storage.js`)

**Responsibilities**:
- Persist projects to IndexedDB
- Handle import/export
- Manage data migrations
- Provide data access API

**Key Functions**:
- `initDB()` - Initialize database
- `saveProject()` - Persist project
- `getProject()` - Retrieve project
- `getAllProjects()` - List all projects
- `deleteProject()` - Remove project
- `exportProject()` - Export as JSON
- `importProject()` - Import from JSON

**Database Schema**:
```javascript
{
  id: string,              // Unique project ID
  name: string,            // Project name
  description: string,     // Project description
  created: timestamp,      // Creation time
  modified: timestamp,     // Last modified time
  currentPhase: number,    // Current phase (1-{{PHASE_COUNT}})
  phases: [                // Phase data
    {
      number: number,      // Phase number
      name: string,        // Phase name
      prompt: string,      // Generated prompt
      response: string,    // AI response
      completed: boolean   // Completion status
    }
  ]
}
```

<!-- IF {{HAS_AI_MOCK}} -->
### 4. AI Mock Mode (`web/js/ai-mock.js`)

**Responsibilities**:
- Provide mock AI responses for testing
- Enable offline development
- Support automated testing
- Reduce API costs during development

**Key Functions**:
- `setMockMode()` - Enable/disable mock mode
- `getMockResponse()` - Get mock AI response
- `callAI()` - Call AI (mock or real)

**Usage**: Development and testing only. Hidden in production.
<!-- END IF -->

---

## Data Flow

### Project Creation

```
User Input → createProject() → saveProject() → IndexedDB
                                    ↓
                            renderProjectList()
```

### Phase Completion

```
User Input → validatePhase() → advancePhase() → saveProject()
                                      ↓
                              generatePrompt() → Display to User
```

### Export/Import

```
Export: getProject() → JSON.stringify() → Download
Import: File Upload → JSON.parse() → importProject() → IndexedDB
```

---

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Tailwind CSS via CDN
- **JavaScript**: ES6+ modules
- **IndexedDB**: Client-side storage

### Deployment
- **GitHub Pages**: Static site hosting
- **CDN**: Tailwind CSS, no build step required

### Testing
- **Jest**: Unit testing
- **Playwright**: E2E testing
- **Coverage**: 85% minimum

---

## Design Principles

### 1. Zero Build Step
- No npm build required
- No webpack/vite/rollup
- Direct ES6 module imports
- CDN for dependencies

### 2. Privacy First
- 100% client-side processing
- No server communication
- No analytics or tracking
- Data stays in browser

### 3. Progressive Enhancement
- Works without JavaScript (basic HTML)
- Enhanced with JavaScript
- Responsive design
- Accessible (WCAG 2.1 AA)

### 4. Offline Capable
- All assets cached
- IndexedDB for persistence
- Works without internet (after first load)

---

## Security Considerations

### Data Storage
- IndexedDB is origin-scoped
- Data isolated per domain
- No cross-origin access
- User controls all data

### Content Security
- No inline scripts
- No eval() usage
- Strict CSP headers (production)
- HTTPS enforced (production)

### Privacy
- No external API calls (except AI copy/paste)
- No telemetry
- No cookies
- No tracking

---

## Performance

### Metrics
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Bundle Size**: < 100KB (excluding Tailwind CDN)
- **IndexedDB Operations**: < 50ms

### Optimization
- Lazy loading for large projects
- Debounced auto-save
- Efficient DOM updates
- Minimal dependencies

---

## Browser Compatibility

### Supported Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Required Features
- ES6 modules
- IndexedDB
- CSS Grid
- Flexbox
- LocalStorage

---

## Future Enhancements

Potential improvements (not currently implemented):
- Service Worker for offline support
- Web Share API for sharing projects
- File System Access API for direct file save
- WebRTC for peer-to-peer project sharing
- Progressive Web App (PWA) manifest

---

## Related Documentation

- [Deployment Guide](../deployment/DEPLOYMENT-template.md)
- [Development Guide](../development/DEVELOPMENT-template.md)
- [Testing Guide](../TESTING-template.md)
- [API Documentation](../API-template.md)

