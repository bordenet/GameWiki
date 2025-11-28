# AI Assistant Instructions for Dim Lantern

**CRITICAL**: Read this file FIRST before working on this codebase.

---

## 🎯 Project Overview

**Dim Lantern** is a GM Documentation System for D&D 5E campaigns. It processes session transcripts through a 3-phase AI workflow to generate structured wiki pages for Obsidian.

- **Phase 1: Extract** (Claude Sonnet 4) - Extract locations and plot threads from transcripts
- **Phase 2: Summarize** (Claude Sonnet 4) - Generate Obsidian-compatible wiki pages
- **Phase 3: Refine** (Gemini 2.5 Pro) - Validate accuracy and improve output

---

## 🏗️ Project Structure

```
GameWiki/
├── docs/                    # Web application (GitHub Pages)
│   ├── index.html          # Main application
│   ├── css/styles.css      # D&D-themed styling
│   ├── js/
│   │   ├── app.js          # Main application logic
│   │   ├── storage.js      # IndexedDB storage
│   │   └── workflow.js     # 3-phase workflow engine
│   ├── tests/              # Jest unit tests
│   └── prompts/            # Prompt documentation
├── README.md               # Project overview
├── CLAUDE.md               # This file
└── LICENSE                 # MIT License
```

---

## 📋 Standard Workflow

### When Creating/Modifying Code
1. ✅ Make changes
2. ✅ Run linter: `cd docs && npm run lint`
3. ✅ Run tests: `cd docs && npm test`
4. ✅ Verify all checks pass
5. ✅ **Tell user: what's done, what's left**

### Test Commands
```bash
cd docs

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run linter
npm run lint

# Fix linting errors
npm run lint:fix
```

---

## 🚫 What NOT to Do

### NEVER
- ❌ Commit `node_modules/` or `coverage/`
- ❌ Create files without linting them
- ❌ Create tests without running them
- ❌ Make user ask "what's left?" multiple times
- ❌ Use hyperbolic language ("amazing", "revolutionary")
- ❌ Do more than the user asked

### ALWAYS
- ✅ Lint after creating/modifying code
- ✅ Run tests after creating/modifying tests
- ✅ Proactively communicate what's left
- ✅ Use factual, professional language
- ✅ Ask before committing, pushing, or deploying

---

## 🧪 Testing Standards

- **Coverage target**: 70% minimum
- **Test location**: `docs/tests/`
- **Framework**: Jest with jsdom environment
- **Storage mock**: fake-indexeddb

### Current Tests
- `workflow.test.js` - Session creation, prompts, validation, phases, tags
- `storage.test.js` - IndexedDB operations for sessions, locations, plot threads

---

## 📝 Communication Style

### Status Update Template
```
✅ Completed:
- [Specific action 1]
- [Specific action 2]

✅ Quality Checks:
- Linting: PASSED (0 errors)
- Tests: PASSED (40/40)

✅ What's Left:
- [Specific remaining task 1]
- [Specific remaining task 2]
```

---

## 🔗 Related Projects

- **Genesis**: Template system that created this project
- **Live App**: https://bordenet.github.io/GameWiki/
- **Repository**: https://github.com/bordenet/GameWiki

