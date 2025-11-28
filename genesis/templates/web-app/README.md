# Web Application Templates

## Purpose

This directory contains all web application templates for creating browser-based, client-side applications with zero build step deployment.

## Architecture

All web apps generated from these templates follow this architecture:
- **100% client-side** - No server required
- **Zero build step** - No webpack, no bundlers, just HTML/CSS/JS
- **ES6 modules** - Modern JavaScript with import/export
- **Tailwind CSS** - Via CDN for styling
- **IndexedDB** - Client-side storage (50MB-10GB capacity)
- **GitHub Pages** - Static site hosting

## Contents

### Core Files

1. **`index-template.html`** (✅ Complete)
   - Main HTML entry point
   - Tailwind CSS via CDN
   - Dark mode support
   - Responsive layout
   - Accessibility features (ARIA labels, semantic HTML)

### JavaScript Modules (`js/`)

2. **`js/storage-template.js`** (✅ Complete)
   - IndexedDB wrapper
   - Project CRUD operations
   - Export/import functionality
   - Error handling

3. **`js/workflow-template.js`** (✅ Complete)
   - Multi-phase workflow engine
   - State management
   - Phase progression logic
   - UI updates

4. **`js/ui-template.js`** (✅ Complete)
   - UI component rendering
   - Event handlers
   - Modal dialogs
   - Toast notifications

5. **`js/app-template.js`** (✅ Complete)
   - Application initialization
   - Router setup
   - Global state management

### Stylesheets (`css/`)

6. **`css/custom-template.css`** (✅ Complete)
   - Custom styles beyond Tailwind
   - Dark mode variables
   - Animation definitions
   - Print styles

### Data (`data/`)

7. **`data/prompts-template.js`** (✅ Complete)
   - Prompt templates for each phase
   - Variable substitution
   - Example prompts

## Template Variables

All templates use these variables:

### Project Identity
- `{{PROJECT_NAME}}` - Lowercase project name
- `{{PROJECT_TITLE}}` - Display title
- `{{PROJECT_DESCRIPTION}}` - One-line description
- `{{HEADER_EMOJI}}` - Header emoji
- `{{FAVICON_EMOJI}}` - Favicon emoji

### Workflow Configuration
- `{{PHASE_COUNT}}` - Number of phases (1-5)
- `{{PHASE_N_NAME}}` - Name of phase N
- `{{PHASE_N_AI}}` - AI model for phase N
- `{{PHASE_N_PROMPT}}` - Prompt template for phase N

### Features
- `{{ENABLE_EXPORT}}` - Enable export functionality
- `{{ENABLE_IMPORT}}` - Enable import functionality
- `{{ENABLE_DARK_MODE}}` - Enable dark mode toggle
- `{{ENABLE_ANALYTICS}}` - Enable analytics (privacy-respecting)

## Usage

### For AI Assistants

1. Copy all files from this directory to project's `{{DEPLOY_FOLDER}}/`
2. Replace all `{{VARIABLES}}` with actual values
3. Remove `-template` suffix from filenames
4. Customize as needed for specific workflow
5. Test in browser before deployment

### For Manual Use

1. Copy template files to your project
2. Search and replace all variables
3. Rename files (remove `-template`)
4. Test locally: `python3 -m http.server 8000`
5. Deploy to GitHub Pages

## Quality Standards

All web app templates must meet these standards:

### Accessibility
- ✅ Semantic HTML5 elements
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Color contrast ratios meet WCAG AA
- ✅ Focus indicators visible

### Performance
- ✅ Minimal external dependencies
- ✅ Lazy loading where appropriate
- ✅ Efficient DOM updates
- ✅ IndexedDB for large data
- ✅ No blocking scripts

### Browser Compatibility
- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Security
- ✅ No inline scripts (CSP compatible)
- ✅ Input sanitization
- ✅ XSS prevention
- ✅ No eval() or Function()
- ✅ HTTPS only (GitHub Pages)

### Code Quality
- ✅ ESLint compliant
- ✅ No console.log in production
- ✅ Proper error handling
- ✅ JSDoc comments
- ✅ Consistent code style

## Testing

All JavaScript modules should have corresponding tests:
- `storage-template.js` → `storage.test.js`
- `workflow-template.js` → `workflow.test.js`
- `ui-template.js` → `ui.test.js`

See `../../05-QUALITY-STANDARDS.md` for testing requirements (85% coverage minimum).

## Dark Mode

All templates support dark mode via:
1. CSS `prefers-color-scheme` media query (automatic)
2. Manual toggle stored in localStorage
3. Smooth transitions between modes

## IndexedDB Schema

Default schema for projects:
```javascript
{
  id: string,           // UUID
  name: string,         // Project name
  created: timestamp,   // Creation date
  modified: timestamp,  // Last modified
  phases: [             // Phase data
    {
      number: int,
      name: string,
      prompt: string,
      response: string,
      completed: boolean
    }
  ],
  metadata: object      // Custom metadata
}
```

## Related Documentation

- **Quality Standards**: `../../05-QUALITY-STANDARDS.md`
- **AI Instructions**: `../../01-AI-INSTRUCTIONS.md`
- **Testing Guide**: `../docs/TESTING-template.md`
- **Templates Index**: `../README.md`

## Maintenance

When modifying web app templates:
1. Test in all supported browsers
2. Verify accessibility with axe DevTools
3. Check mobile responsiveness
4. Validate HTML/CSS/JS
5. Update tests
6. Update this README
7. Update `../../SUMMARY.md`

