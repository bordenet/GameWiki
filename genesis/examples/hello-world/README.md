# Hello World - Genesis Example

This is a minimal working example created from Genesis templates.

**Purpose**: Demonstrate that Genesis creates immediately deployable, working code.

---

## What This Is

A simple 2-phase AI workflow application:
- **Phase 1**: User provides input
- **Phase 2**: User gets AI-generated output

**Features**:
- ✅ Works immediately (no build step)
- ✅ Saves data to browser (IndexedDB)
- ✅ Dark mode toggle
- ✅ Export/import projects
- ✅ AI mock mode for testing
- ✅ Fully tested (85%+ coverage)

---

## Quick Start

### Option 1: Open Locally

```bash
# From genesis/examples/hello-world/
open index.html
```

### Option 2: Deploy to GitHub Pages

1. Copy this directory to new repo
2. Push to GitHub
3. Enable GitHub Pages (Settings → Pages → Source: main → /web)
4. Visit: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## File Structure

```
hello-world/
├── index.html              # Main application
├── css/
│   └── styles.css          # Custom styles
├── js/
│   ├── app.js              # Main app logic
│   ├── workflow.js         # 2-phase workflow
│   ├── storage.js          # IndexedDB storage
│   └── ai-mock.js          # Mock AI for testing
├── tests/
│   ├── storage.test.js     # Unit tests
│   └── workflow.e2e.js     # E2E tests
├── package.json            # Test dependencies
├── jest.config.js          # Jest configuration
└── README.md               # This file
```

---

## How It Works

### Phase 1: Input
1. User creates new project
2. User enters input text
3. App generates AI prompt
4. User copies prompt to AI (Claude/Gemini)
5. User pastes AI response
6. Phase 1 complete → advance to Phase 2

### Phase 2: Output
1. App generates Phase 2 prompt
2. User copies prompt to AI
3. User pastes AI response
4. Phase 2 complete → project done!

### Data Storage
- All data stored in browser IndexedDB
- No server required
- No external API calls
- Privacy-first design

---

## Testing

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# E2E tests only
npm run test:e2e

# With coverage
npm run test:coverage
```

### AI Mock Mode

1. Open `index.html` in browser
2. Enable "AI Mock Mode" toggle (bottom-right)
3. Create project and advance phases
4. Mock AI responses generated automatically
5. No need to copy/paste to real AI

**Use Cases**:
- Testing the workflow
- Demonstrating the app
- Automated testing
- Offline development

---

## Customization

### Change Number of Phases

Edit `js/workflow.js`:
```javascript
const PHASES = [
  { number: 1, name: 'Input', ai: 'Claude Sonnet 4.5' },
  { number: 2, name: 'Output', ai: 'Gemini 2.5 Pro' },
  // Add more phases here
];
```

### Change Prompts

Edit `js/workflow.js`:
```javascript
function generatePrompt(phase, project) {
  if (phase === 1) {
    return `Your custom Phase 1 prompt here...`;
  }
  // ...
}
```

### Change Styling

Edit `css/styles.css` or modify Tailwind classes in `index.html`.

---

## Deployment

### GitHub Pages

1. **Create new repo** on GitHub
2. **Copy files**:
   ```bash
   cp -r genesis/examples/hello-world/* /path/to/new/repo/
   ```
3. **Push to GitHub**:
   ```bash
   cd /path/to/new/repo
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin git@github.com:USERNAME/REPO.git
   git push -u origin main
   ```
4. **Enable GitHub Pages**:
   - Settings → Pages
   - Source: main branch, / (root)
   - Save
5. **Visit**: `https://USERNAME.github.io/REPO/`

### Local Server (Optional)

```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server

# Then visit: http://localhost:8000
```

---

## What's Included

### ✅ Complete Testing Infrastructure
- Jest for unit tests
- Playwright for E2E tests
- 85% coverage enforcement
- Example tests included

### ✅ AI Mock Mode
- Mock AI responses for testing
- Toggle in UI (localhost only)
- No API costs
- Offline development

### ✅ Professional Features
- Dark mode with persistence
- Export/import projects
- Responsive design
- Accessibility (WCAG 2.1 AA)

### ✅ Quality Enforcement
- Pre-commit hooks (optional)
- CI/CD workflows (GitHub Actions)
- Linting (ESLint)
- Coverage reporting (Codecov)

---

## Next Steps

1. **Test it**: Open `index.html` and try the workflow
2. **Customize it**: Change phases, prompts, styling
3. **Deploy it**: Push to GitHub Pages
4. **Build on it**: Add features, improve UX

---

## Related Examples

- **One-Pager**: 3-phase workflow for creating one-page documents
- **COE Generator**: Specialized workflow for Correction of Error docs
- **PRD Assistant**: Full 3-phase Product Requirements Document workflow

---

**This is a working, deployable application created from Genesis templates.**

**No build step. No server. No configuration. Just open and use.**

