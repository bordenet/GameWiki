# Dim Lantern GM Documentation System

Turn D&D session transcripts into searchable wiki pages. Three phases: extract, summarize, refine.

> *Made for Aaron Smith* 🎲

**Try it**: [bordenet.github.io/GameWiki](https://bordenet.github.io/GameWiki/)

[![CI](https://github.com/bordenet/GameWiki/actions/workflows/deploy.yml/badge.svg)](https://github.com/bordenet/GameWiki/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What It Does

The Dim Lantern D&D 5E campaign has hundreds of hours of session transcripts. This tool turns that into:

- **Location Compendium** — Entries for every location mentioned
- **Plot Thread Tracker** — Active storylines with cross-references
- **Session Summaries** — Searchable archives with tags

Goal: Cut GM prep from 4 hours to 1 hour per session.

---

## Quick Start

### Web App

Open the [demo](https://bordenet.github.io/GameWiki/). Data stays in your browser (IndexedDB). Export to Obsidian-compatible Markdown.

### Local

```bash
git clone https://github.com/bordenet/GameWiki.git
cd GameWiki/docs
npm install
open index.html
```

---

## How the Phases Work

**Phase 1: Extract (Claude)** — Paste your transcript. Claude pulls out locations, plot threads, NPCs, and events.

**Phase 2: Summarize (Claude)** — Generates wiki pages with `[[wiki links]]` between entries.

**Phase 3: Refine (Gemini)** — Cross-validates for accuracy, fixes inconsistencies, improves cross-references.

Two models catch different things. Claude extracts structure; Gemini validates it.

---

## Features

- **Tag search** — Filter sessions by tags (`dungeon`, `boss-fight`, `roleplay`)
- **Progress bars** — Track workflow completion per session
- **Obsidian export** — Download as Markdown files
- **Dark mode** — D&D-themed UI
- **Browser storage** — No server, no account

---

## Development

```bash
cd docs
npm install
npm test              # Run tests
npm run test:coverage # With coverage
```

### Project Structure

```
GameWiki/
├── docs/                    # Web app (GitHub Pages source)
│   ├── index.html
│   ├── css/styles.css
│   ├── js/
│   │   ├── app.js
│   │   ├── workflow.js
│   │   └── storage.js
│   ├── prompts/
│   └── tests/
├── scripts/
└── .github/workflows/
```

---

## For AI Assistants

Before modifying this codebase:
- Run tests after changes (`cd docs && npm test`)
- Check CI after pushing
- Don't commit `node_modules/` or `coverage/`

---

## License

MIT — see [LICENSE](LICENSE)

---

Built with [Genesis](https://github.com/bordenet/genesis). Related: [One-Pager](https://github.com/bordenet/one-pager)
