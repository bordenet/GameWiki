# 🕯️ Dim Lantern GM Documentation System

[![CI](https://github.com/bordenet/GameWiki/actions/workflows/deploy.yml/badge.svg)](https://github.com/bordenet/GameWiki/actions/workflows/deploy.yml)
[![Node.js 18+](https://img.shields.io/badge/node-18+-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Dependabot](https://img.shields.io/badge/Dependabot-enabled-025E8C?logo=dependabot)](https://github.com/bordenet/GameWiki/security/dependabot)
[![Linting: ESLint](https://img.shields.io/badge/linting-ESLint-4B32C3)](https://eslint.org/)
[![Testing: Jest](https://img.shields.io/badge/testing-Jest-C21325)](https://jestjs.io/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/bordenet/GameWiki/graphs/commit-activity)
[![GitHub issues](https://img.shields.io/github/issues/bordenet/GameWiki.svg)](https://github.com/bordenet/GameWiki/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/bordenet/GameWiki.svg)](https://github.com/bordenet/GameWiki/pulls)

> *Made for a dear friend, Aaron Smith* 🎲

An AI-assisted workflow for transforming D&D 5E session transcripts into a structured, searchable wiki.

**🌐 Try it now: [https://bordenet.github.io/GameWiki/](https://bordenet.github.io/GameWiki/)**

---

## What is This?

The Dim Lantern D&D 5E campaign has generated hundreds of hours of session transcripts. This tool transforms that chronological, unstructured data into a **structured wiki** with:

- **Location Compendium** - Detailed entries for every location
- **Plot Thread Tracker** - Active storylines with cross-references
- **Session Summaries** - Searchable session archives with tags

**Goal**: Reduce GM prep time from 4 hours to 1 hour per session.

---

## 🤖 For AI Assistants

**READ THIS FIRST**: Before working on this codebase:

- ✅ ALWAYS run tests after modifying code (`cd docs && npm test`)
- ✅ ALWAYS check the GitHub Actions build status after pushing
- ❌ NEVER include `node_modules/`, `coverage/`, or build artifacts in commits

---

## Quick Start

### Use the Web App (Recommended)

**🌐 [Launch Web App](https://bordenet.github.io/GameWiki/)**

- ✅ No download required
- ✅ Works on any device
- ✅ 100% client-side - all data stored in your browser
- ✅ Privacy-first - no server, no tracking
- ✅ Export sessions as Obsidian-compatible Markdown

### Run Locally

```bash
# Clone repository
git clone https://github.com/bordenet/GameWiki.git
cd GameWiki/docs

# Install dependencies
npm install

# Open index.html in your browser
open index.html
```

---

## How It Works

### 3-Phase AI Workflow

**Phase 1: Extract (Claude Sonnet 4)**
- Paste your session transcript
- AI extracts all locations and plot threads
- Identifies key NPCs, events, and connections

**Phase 2: Summarize (Claude Sonnet 4)**
- Generates Obsidian-compatible wiki pages
- Creates `[[wiki links]]` between related entries
- Produces structured location and plot thread entries

**Phase 3: Refine (Gemini 2.5 Pro)**
- Cross-validates for accuracy
- Improves clarity and consistency
- Ensures proper cross-referencing

### Why Two Different AI Models?

The differences between Claude and Gemini's perspectives create better documentation than either could produce alone. Claude excels at structured extraction; Gemini excels at validation and refinement.

---

## Features

- **🔍 Tag-Based Search** - Filter sessions by tags (e.g., `dungeon`, `boss-fight`, `roleplay`)
- **📊 Progress Tracking** - Visual progress bars for each session's workflow
- **📁 Obsidian Export** - Export wiki content as Markdown files
- **🌙 Dark Mode** - D&D-themed dark UI with gold accents
- **💾 Local Storage** - All data stored in IndexedDB (no server required)
- **🏷️ Session Tags** - Organize sessions with comma-separated tags

---

## Development

### Setup

```bash
cd docs
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Project Structure

```
GameWiki/
├── docs/                    # Web application (GitHub Pages source)
│   ├── index.html          # Main application
│   ├── css/styles.css      # D&D-themed styling
│   ├── js/
│   │   ├── app.js          # Main app logic
│   │   ├── workflow.js     # 3-phase workflow engine
│   │   └── storage.js      # IndexedDB storage
│   ├── prompts/            # Prompt documentation
│   └── tests/              # Jest unit tests
├── scripts/                 # Setup and deployment scripts
│   ├── setup-macos.sh      # macOS development setup
│   └── deploy-web.sh       # GitHub Pages deployment
└── .github/workflows/       # CI/CD pipeline
```

---

## Roadmap

Based on the [Dim Lantern GM Documentation System One-Pager](docs/prompts/README.md):

| Phase | Target Date | Status |
|-------|-------------|--------|
| **Phase 1**: Core Framework | Dec 6, 2024 | ✅ Complete |
| **Phase 2**: Location Population | Dec 13, 2024 | ✅ Complete |
| **Phase 3**: Plot Thread Integration | Dec 20, 2024 | ✅ Complete |

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Related

- [Genesis](https://github.com/bordenet/genesis) - Project template system used to create this app
- [One-Pager](https://github.com/bordenet/one-pager) - Similar 3-phase AI workflow for documents

---

**Created with [Genesis](https://github.com/bordenet/genesis) project templates**
