# COE (Correction of Error) Generator

A specialized 3-phase AI workflow for creating Correction of Error documents.

**Created from**: Genesis Project Template System  
**Purpose**: Generate professional COE documents using AI assistance

---

## What is a COE?

A Correction of Error (COE) document is used to:
- Identify and document errors in previous work
- Explain the root cause of the error
- Propose corrective actions
- Prevent similar errors in the future

---

## Workflow

### Phase 1: Error Identification (Claude Sonnet 4.5)
**Input**: Description of the error and context  
**Output**: Structured analysis of the error

**AI analyzes**:
- What went wrong
- When it was discovered
- Impact and severity
- Affected systems/users

### Phase 2: Root Cause Analysis (Gemini 2.5 Pro)
**Input**: Phase 1 analysis  
**Output**: Deep dive into root causes

**AI identifies**:
- Primary root cause
- Contributing factors
- Process gaps
- System weaknesses

### Phase 3: Corrective Actions (Claude Sonnet 4.5)
**Input**: Phases 1 & 2 analysis  
**Output**: Complete COE document

**AI generates**:
- Immediate corrective actions
- Long-term preventive measures
- Process improvements
- Monitoring recommendations

---

## Features

- ✅ 3-phase structured workflow
- ✅ Professional COE template
- ✅ AI-assisted analysis
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

### 1. Create New COE

Click "New Project" and enter:
- **Error Title**: "Production database connection timeout"
- **Description**: "Users experienced 503 errors due to database connection pool exhaustion"

### 2. Phase 1: Error Identification

Copy the generated prompt to Claude Sonnet 4.5:

```
Analyze the following error and provide a structured identification:

Error: Production database connection timeout
Context: Users experienced 503 errors due to database connection pool exhaustion

Please provide:
1. Error summary
2. Discovery timeline
3. Impact assessment
4. Affected components
```

Paste Claude's response and advance to Phase 2.

### 3. Phase 2: Root Cause Analysis

Copy the generated prompt to Gemini 2.5 Pro (includes Phase 1 analysis).

Paste Gemini's response and advance to Phase 3.

### 4. Phase 3: Corrective Actions

Copy the generated prompt to Claude Sonnet 4.5 (includes Phases 1 & 2).

Paste Claude's response to get the complete COE document.

### 5. Export

Click "Export" to download the complete COE as JSON or Markdown.

---

## Customization

### Change COE Template

Edit `prompts/coe-template.md` to customize the COE structure.

### Change AI Models

Edit `js/workflow.js`:
```javascript
const PHASES = [
  { number: 1, name: 'Error Identification', ai: 'Your AI Model' },
  { number: 2, name: 'Root Cause Analysis', ai: 'Your AI Model' },
  { number: 3, name: 'Corrective Actions', ai: 'Your AI Model' }
];
```

### Add Custom Fields

Edit `js/workflow.js` to add project-specific fields:
```javascript
export function createProject(name, description, severity, affectedSystems) {
  return {
    // ... existing fields
    severity: severity,
    affectedSystems: affectedSystems
  };
}
```

---

## Environment Configuration

### Setup

```bash
cp .env.example .env
nano .env
```

### COE-Specific Variables

```bash
# COE Template Configuration
COE_TEMPLATE_PATH=./prompts/coe-template.md

# COE Output Format (markdown, json, pdf)
COE_OUTPUT_FORMAT=markdown

# Severity Levels
COE_SEVERITY_LEVELS=low,medium,high,critical

# Auto-save interval (milliseconds)
COE_AUTOSAVE_INTERVAL=30000
```

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

## Related Projects

- **Product Requirements Assistant**: 3-phase PRD workflow
- **One-Pager Generator**: 2-phase one-page document workflow
- **Hello World**: Minimal 2-phase example

---

## Support

For issues or questions:
1. Check the [Genesis documentation](../../README.md)
2. Review [examples](../)
3. Open an issue on GitHub

---

**This is a working, deployable application created from Genesis templates.**

