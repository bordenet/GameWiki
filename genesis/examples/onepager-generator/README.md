# One-Pager Generator

A specialized 2-phase AI workflow for creating concise one-page documents.

**Created from**: Genesis Project Template System  
**Purpose**: Generate professional one-pager documents using AI assistance

---

## What is a One-Pager?

A one-pager is a concise document that:
- Summarizes complex information on a single page
- Communicates key points quickly
- Designed for executive review
- Maximum impact, minimum words

**Typical use cases**:
- Project proposals
- Product pitches
- Executive summaries
- Decision memos

---

## Workflow

### Phase 1: Content Gathering (Claude Sonnet 4.5)
**Input**: Raw information, ideas, data  
**Output**: Structured content outline

**AI organizes**:
- Key messages
- Supporting data
- Logical flow
- Priority ranking

### Phase 2: One-Pager Creation (Gemini 2.5 Pro)
**Input**: Phase 1 outline  
**Output**: Polished one-pager

**AI generates**:
- Compelling headline
- Executive summary
- Key points (3-5 bullets)
- Call to action
- Visual layout suggestions

---

## Features

- ✅ 2-phase streamlined workflow
- ✅ Word count enforcement (≤500 words)
- ✅ Professional formatting
- ✅ Export to Markdown/PDF
- ✅ Dark mode support
- ✅ Offline storage (IndexedDB)

---

## Quick Start

### Option 1: Open Locally
```bash
open index.html
```

### Option 2: Deploy to GitHub Pages
1. Copy to new repository
2. Enable GitHub Pages
3. Visit your site

---

## Usage Example

### 1. Create New One-Pager

Click "New Project" and enter:
- **Title**: "Q4 Marketing Campaign Proposal"
- **Description**: "Propose new social media campaign targeting Gen Z users"

### 2. Phase 1: Content Gathering

Copy the generated prompt to Claude Sonnet 4.5:

```
Help me create a one-pager for: Q4 Marketing Campaign Proposal

Context: Propose new social media campaign targeting Gen Z users

Please organize the following into a structured outline:
- Target audience: Gen Z (18-24)
- Budget: $50K
- Timeline: Q4 2024
- Channels: TikTok, Instagram, YouTube Shorts
- Goal: 1M impressions, 50K engagements

Provide a clear outline with key messages and supporting data.
```

Paste Claude's response and advance to Phase 2.

### 3. Phase 2: One-Pager Creation

Copy the generated prompt to Gemini 2.5 Pro (includes Phase 1 outline).

Paste Gemini's response to get the polished one-pager.

### 4. Export

Click "Export" to download as Markdown or PDF.

---

## Customization

### Change Word Limit

Edit `.env`:
```bash
# Maximum page length (words)
ONEPAGER_MAX_WORDS=500
```

### Change Template

Edit `prompts/onepager-template.md` to customize structure.

### Add Sections

Edit `js/workflow.js` to add custom sections:
```javascript
const SECTIONS = [
  'Executive Summary',
  'Problem Statement',
  'Proposed Solution',
  'Key Benefits',
  'Next Steps'
];
```

---

## Environment Configuration

### Setup

```bash
cp .env.example .env
nano .env
```

### One-Pager Specific Variables

```bash
# One-Pager Template Configuration
ONEPAGER_TEMPLATE_PATH=./prompts/onepager-template.md

# One-Pager Output Format (markdown, pdf)
ONEPAGER_OUTPUT_FORMAT=markdown

# Maximum page length (words)
ONEPAGER_MAX_WORDS=500

# Enforce word limit
ONEPAGER_ENFORCE_LIMIT=true

# Auto-save interval (milliseconds)
ONEPAGER_AUTOSAVE_INTERVAL=30000
```

---

## Best Practices

### 1. Start with Clear Objective
Define what you want the reader to do after reading.

### 2. Use the Pyramid Principle
- Start with conclusion
- Support with key points
- Provide details last

### 3. Be Ruthlessly Concise
- Every word must earn its place
- Remove jargon and fluff
- Use active voice

### 4. Make it Scannable
- Use bullet points
- Bold key phrases
- White space is your friend

### 5. Include a Call to Action
Tell the reader exactly what to do next.

---

## Testing

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

---

## Deployment

### GitHub Pages

1. Push to GitHub
2. Settings → Pages → Source: main → /web
3. Visit: `https://USERNAME.github.io/REPO/`

### Local Server

```bash
python3 -m http.server 8000
# Visit: http://localhost:8000
```

---

## Examples

### Product Pitch
```
Title: "AI-Powered Code Review Tool"
Audience: Engineering VPs
Goal: Secure $2M Series A funding
```

### Project Proposal
```
Title: "Customer Portal Redesign"
Audience: Product Leadership
Goal: Approval for Q1 2025 roadmap
```

### Executive Summary
```
Title: "Q3 Performance Review"
Audience: Board of Directors
Goal: Communicate results and Q4 strategy
```

---

## Related Projects

- **Product Requirements Assistant**: 3-phase PRD workflow
- **COE Generator**: 3-phase error correction workflow
- **Hello World**: Minimal 2-phase example

---

**This is a working, deployable application created from Genesis templates.**

