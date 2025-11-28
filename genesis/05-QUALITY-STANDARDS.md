# Genesis Quality Standards

**Purpose**: Define the professional standards for projects created with Genesis templates.

---

## Philosophy

Projects created with Genesis will be viewed by colleagues, collaborators, and the broader community. They reflect your commitment to code quality and professional communication. This document establishes standards to ensure every Genesis-based project meets the highest professional bar.

---

## Code Quality Standards

### Testing Requirements

**Minimum Coverage**:
- Logic coverage: 85%
- Branch coverage: 85%
- End-to-end tests: All critical paths

**Test Types**:
1. **Unit Tests**: All business logic functions
2. **Integration Tests**: Storage, workflow, UI interactions
3. **End-to-End Tests**: Complete user workflows
4. **Browser Tests**: Cross-browser compatibility (Chrome, Firefox, Safari)

**Example Test Structure**:
```
tests/
├── unit/
│   ├── storage.test.js
│   ├── workflow.test.js
│   └── ui.test.js
├── integration/
│   ├── workflow-integration.test.js
│   └── storage-integration.test.js
└── e2e/
    ├── create-project.test.js
    ├── export-import.test.js
    └── multi-phase-workflow.test.js
```

### Code Review Checklist

Before committing:
- [ ] All tests pass
- [ ] Coverage meets 85% threshold
- [ ] No console.log() statements in production code
- [ ] Error handling on all async operations
- [ ] Input validation on all user inputs
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: ARIA labels present
- [ ] Dark mode tested
- [ ] Mobile responsive tested
- [ ] Cross-browser tested
- [ ] **Shell scripts pass shellcheck with zero warnings**
- [ ] **Shell scripts follow SHELL_SCRIPT_STANDARDS.md**
- [ ] **All scripts include running timer (yellow on black)**
- [ ] **All scripts support `-h|--help` and `-v|--verbose`**

---

## Documentation Standards

### Writing Style

**Avoid**:
- ❌ Hyperbolic language ("amazing", "incredible", "revolutionary")
- ❌ Unsubstantiated claims ("production-grade", "enterprise-ready")
- ❌ Marketing speak ("game-changing", "cutting-edge")
- ❌ Exclamation marks (except in examples)
- ❌ Emojis in technical documentation (use sparingly in user-facing docs)

**Use**:
- ✅ Clear, factual statements
- ✅ Specific, measurable claims
- ✅ Professional tone
- ✅ Active voice
- ✅ Concrete examples

**Example - Before**:
```markdown
This amazing tool will revolutionize your workflow! It's production-grade and enterprise-ready!
```

**Example - After**:
```markdown
This tool provides a structured workflow for document creation with AI assistance.
It includes automated testing, error handling, and export functionality.
```

### Required Documentation

Every project must include:

1. **README.md**:
   - Clear project description
   - Installation instructions
   - Usage examples
   - Architecture overview
   - Contributing guidelines
   - License information

2. **ARCHITECTURE.md**:
   - System design
   - Data flow diagrams
   - Technology choices with rationale
   - Security considerations

3. **CONTRIBUTING.md**:
   - Development setup
   - Testing requirements
   - Code style guidelines
   - Pull request process

4. **CHANGELOG.md**:
   - Version history
   - Breaking changes
   - Migration guides

### Information Architecture

**File Organization**:
```
project-root/
├── README.md                    # Project overview
├── LICENSE                      # License file
├── CHANGELOG.md                 # Version history
├── CONTRIBUTING.md              # Contribution guidelines
│
├── docs/                        # Documentation
│   ├── architecture/
│   │   ├── ARCHITECTURE.md      # System design
│   │   ├── DATA_FLOW.md         # Data flow
│   │   └── SECURITY.md          # Security considerations
│   ├── deployment/
│   │   ├── DEPLOYMENT.md        # Deployment guide
│   │   └── TROUBLESHOOTING.md   # Common issues
│   └── development/
│       ├── DEVELOPMENT.md       # Dev setup
│       ├── TESTING.md           # Testing guide
│       └── DEBUGGING.md         # Debugging guide
│
├── src/                         # Source code
├── tests/                       # Test files
├── scripts/                     # Automation scripts
└── .github/                     # GitHub configuration
    └── workflows/               # CI/CD workflows
```

**Cross-Reference Validation**:
- All internal links must be valid
- All script references must use correct paths
- All imports must resolve correctly
- All documentation must be up-to-date

---

## README Badge Standards

### Required Badges

```markdown
[![CI/CD](https://github.com/{user}/{repo}/actions/workflows/ci.yml/badge.svg)](https://github.com/{user}/{repo}/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/{user}/{repo}/branch/main/graph/badge.svg?token={token})](https://codecov.io/gh/{user}/{repo})
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
```

### Language-Specific Badges

**JavaScript/Node.js**:
```markdown
[![Node Version](https://img.shields.io/badge/Node-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
```

**Python**:
```markdown
[![Python Version](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
```

**Go**:
```markdown
[![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)](https://go.dev/)
```

### Optional Badges

```markdown
[![Release](https://img.shields.io/github/v/release/{user}/{repo})](https://github.com/{user}/{repo}/releases/latest)
[![Issues](https://img.shields.io/github/issues/{user}/{repo})](https://github.com/{user}/{repo}/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
```

---

## Testing Standards

### AI Integration Testing

**Critical Feature**: Mock AI responses for testing

When integrating with external LLMs (OpenAI, Anthropic, etc.), provide mock responses for testing:

**Purpose**:
- Enable end-to-end testing without API costs
- Ensure consistent test results
- Allow offline development
- Validate error handling

**Implementation**:
```javascript
// config.js
export const AI_CONFIG = {
  mode: process.env.AI_MODE || 'live', // 'live' or 'mock'
  mockResponses: {
    phase1: 'Mock response for phase 1...',
    phase2: 'Mock response for phase 2...'
  }
};

// ai-client.js
export async function callAI(prompt, phase) {
  if (AI_CONFIG.mode === 'mock') {
    return AI_CONFIG.mockResponses[phase];
  }
  
  // Real API call
  return await fetch(API_ENDPOINT, { ... });
}
```

**Documentation**:
- Clearly mark mock mode as for testing only
- Document how to enable/disable mock mode
- Provide example mock responses
- Explain limitations of mock mode

---

## Shell Script Standards

**MANDATORY**: All shell scripts must follow `templates/docs/SHELL_SCRIPT_STANDARDS-template.md`.

### Required Features

Every shell script **MUST** include:

1. **Running Timer** (yellow text on black background, top-right corner)
   - Format: `[HH:MM:SS]`
   - Updates at least every second
   - Visible throughout script execution

2. **Help System** (`-h | --help`)
   - Man-page style format
   - Includes NAME, SYNOPSIS, DESCRIPTION, OPTIONS, EXAMPLES
   - Exits with status code 0

3. **Verbose Mode** (`-v | --verbose`)
   - Shows INFO-level logs
   - Default mode is compact (minimal vertical space)

4. **Compact Display**
   - Uses ANSI escape codes to overwrite lines
   - Minimal vertical terminal usage (< 10 lines for typical scripts)
   - Clear progress indicators

5. **Error Handling**
   - `set -euo pipefail` at script start
   - Cleanup handlers with `trap`
   - Actionable error messages

6. **ShellCheck Compliance**
   - Zero warnings before commit
   - Platform compatibility (macOS/Linux)

### Required Scripts

Every project **MUST** include these scripts:

#### 1. Setup Script (`scripts/setup-macos.sh`)
- Installs ALL project dependencies
- Creates virtual environments
- Configures pre-commit hooks
- Supports `-y` flag for non-interactive mode
- Supports `-v` flag for verbose output

#### 2. Deployment Script (`scripts/deploy-web.sh`) - For Web Apps
- Runs linting checks (`npm run lint`)
- Runs all tests (`npm test`)
- Verifies test coverage threshold
- Commits and pushes to GitHub
- Verifies GitHub Pages deployment
- Supports `--skip-tests` and `--skip-lint` flags (NOT RECOMMENDED)
- Supports `-v` flag for verbose output
- Displays deployment URL and status

**Reference Implementations**:
- [bu.sh](https://github.com/bordenet/scripts/blob/main/bu.sh) - Complete example
- [setup-macos.sh](https://github.com/bordenet/bloginator/blob/main/scripts/setup-macos.sh) - Setup script example
- `templates/scripts/deploy-web.sh.template` - Deployment script template

### Common Library

Use `scripts/lib/common.sh` for shared functionality:
- Timer functions
- Logging functions (log_info, log_success, log_error, etc.)
- Platform detection (is_macos, is_linux, is_arm64)
- Utility functions (retry_command, ask_yes_no, etc.)

---

## Logging Standards

### Structured Logging

Use structured logging for all significant events:

```javascript
// Good
logger.info('Project created', {
  projectId: project.id,
  phase: 1,
  timestamp: new Date().toISOString()
});

// Bad
console.log('Project created!');
```

### Log Levels

- **ERROR**: Unrecoverable errors
- **WARN**: Recoverable errors, deprecated features
- **INFO**: Significant events (project created, phase completed)
- **DEBUG**: Detailed diagnostic information

### What to Log

**Do log**:
- User actions (create, update, delete)
- State transitions (phase changes)
- Errors with context
- Performance metrics

**Don't log**:
- Sensitive data (API keys, user content)
- Excessive debug information in production
- Stack traces to user-facing logs

---

## Security Standards

### Input Validation

All user inputs must be validated:

```javascript
function validateProjectTitle(title) {
  if (!title || typeof title !== 'string') {
    throw new Error('Title must be a non-empty string');
  }
  
  if (title.length > 200) {
    throw new Error('Title must be 200 characters or less');
  }
  
  return title.trim();
}
```

### Data Sanitization

Sanitize all user content before display:

```javascript
import DOMPurify from 'dompurify';

function renderUserContent(content) {
  return DOMPurify.sanitize(content);
}
```

### Storage Security

- Never store API keys in IndexedDB
- Use environment variables for secrets
- Validate all data before storage
- Implement data size limits

---

## Accessibility Standards

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order must be logical
- Focus indicators must be visible

### Screen Readers

- All images must have alt text
- All form inputs must have labels
- ARIA labels for dynamic content

### Color Contrast

- Text must meet WCAG AA standards (4.5:1 ratio)
- Interactive elements must be distinguishable
- Don't rely on color alone for information

---

## Performance Standards

### Metrics

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

### Optimization

- Minimize JavaScript bundle size
- Use CDN for external libraries
- Lazy load non-critical resources
- Implement proper caching headers

---

## Version Control Standards

### Commit Messages

Format: `<type>: <description>`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Test changes
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

Example:
```
feat: Add export to PDF functionality
fix: Resolve dark mode toggle issue
docs: Update deployment guide
test: Add integration tests for workflow
```

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature branches
- `fix/*`: Bug fix branches

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests pass (unit, integration, e2e)
- [ ] Code coverage ≥ 85%
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] No TODO comments in code
- [ ] All hyperlinks validated
- [ ] Cross-browser tested
- [ ] Mobile responsive verified
- [ ] Accessibility audit passed
- [ ] Performance metrics met
- [ ] Security audit completed
- [ ] Error handling verified
- [ ] Logging implemented
- [ ] README badges updated
- [ ] **Shell scripts tested on target platform**
- [ ] **`scripts/setup-macos.sh` (or equivalent) works end-to-end**
- [ ] **All scripts display timer correctly**

---

**These standards ensure every Genesis project reflects professional excellence.**

