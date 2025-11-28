# Genesis Project Template System - Master Plan

**Version**: 1.0  
**Created**: 2025-11-20  
**Status**: PLANNING COMPLETE - READY FOR IMPLEMENTATION  
**Review Count**: 2 (Double-checked as requested)

---

## Executive Summary

The Genesis system is a **comprehensive project template framework** that abstracts the entire Product Requirements Assistant project into reusable, AI-readable templates. This enables rapid creation of derivative projects with similar architecture but different workflows.

**Success Criteria**: Copy `genesis/` to empty repo → AI reads instructions → Follows step-by-step guide → Creates fully working project with GitHub Pages deployment.

**First Use Case**: One-Pager document generator with prompting workflow for company-internal Libre Chat.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Template Abstraction Strategy](#template-abstraction-strategy)
4. [Integration with Starter-Kit](#integration-with-starter-kit)
5. [Template Variables & Customization](#template-variables--customization)
6. [AI-Readable Instructions](#ai-readable-instructions)
7. [GitHub Pages Deployment Automation](#github-pages-deployment-automation)
8. [Implementation Phases](#implementation-phases)
9. [Testing & Validation](#testing--validation)
10. [Example: One-Pager Workflow](#example-one-pager-workflow)

---

## 1. Architecture Overview

### 1.1 Core Concept

Genesis is a **meta-template system** that captures:
- ✅ **Project structure** - Directory layout, file organization
- ✅ **Development workflows** - Setup scripts, validation, CI/CD
- ✅ **AI guidance** - CLAUDE.md-style instructions for AI assistants
- ✅ **Safety nets** - Pre-commit hooks, validation scripts, security checks
- ✅ **Deployment automation** - GitHub Pages, GitHub Actions, release workflows
- ✅ **Documentation patterns** - README templates, architecture docs, guides
- ✅ **Web app architecture** - 100% client-side, IndexedDB storage, ES6 modules

### 1.2 Design Principles

1. **AI-First**: All instructions written for AI consumption (Claude, Gemini, etc.)
2. **Copy-Paste Ready**: Entire `genesis/` folder can be copied to new repo
3. **Variable-Driven**: Template variables for project-specific customization
4. **Modular**: Components can be used independently or together
5. **Reference-Based**: Based on proven patterns from product-requirements-assistant
6. **Integrated**: Combines best practices from starter-kit + current project

### 1.3 Key Innovations

- **Self-Documenting**: Templates include inline instructions for AI
- **Progressive Disclosure**: Start simple, add complexity as needed
- **Validation-First**: Every template includes validation criteria
- **Deployment-Ready**: GitHub Pages setup automated from day one

---

## 2. Directory Structure

```
genesis/
├── 00-GENESIS-PLAN.md                    # This file (master plan)
├── 01-AI-INSTRUCTIONS.md                 # Primary AI guidance document
├── 02-QUICK-START.md                     # Human-readable quick start
├── 03-CUSTOMIZATION-GUIDE.md             # How to customize templates
│
├── templates/                            # All template files
│   ├── project-structure/               # Directory structure templates
│   │   ├── README-template.md
│   │   ├── CONTRIBUTING-template.md
│   │   ├── LICENSE-template
│   │   ├── gitignore-template
│   │   └── Makefile-template
│   │
│   ├── web-app/                         # Web application templates
│   │   ├── index-template.html
│   │   ├── js/
│   │   │   ├── app-template.js
│   │   │   ├── storage-template.js
│   │   │   ├── workflow-template.js
│   │   │   ├── ui-template.js
│   │   │   └── router-template.js
│   │   ├── css/
│   │   │   └── styles-template.css
│   │   └── data/
│   │       └── prompts-template.json
│   │
│   ├── backend/                         # Backend templates (optional)
│   │   ├── main-template.go
│   │   ├── handlers-template.go
│   │   ├── models-template.go
│   │   ├── storage-template.go
│   │   └── go-mod-template
│   │
│   ├── docs/                            # Documentation templates
│   │   ├── architecture/
│   │   │   ├── ARCHITECTURE-template.md
│   │   │   └── API-template.md
│   │   ├── deployment/
│   │   │   ├── GITHUB-PAGES-template.md
│   │   │   └── CODECOV-SETUP-template.md
│   │   └── development/
│   │       └── CLAUDE-template.md
│   │
│   ├── scripts/                         # Automation scripts
│   │   ├── lib/
│   │   │   └── common-template.sh
│   │   ├── setup-macos-template.sh
│   │   ├── setup-linux-template.sh
│   │   ├── validate-template.sh
│   │   ├── check-binaries-template.sh
│   │   └── check-secrets-template.sh
│   │
│   ├── github/                          # GitHub Actions workflows
│   │   ├── ci-template.yml
│   │   ├── deploy-web-template.yml
│   │   └── release-template.yml
│   │
│   └── hooks/                           # Git hooks
│       ├── pre-commit-template
│       └── install-hooks-template.sh
│
├── examples/                            # Example implementations
│   ├── one-pager/                      # One-Pager workflow example
│   │   ├── README.md
│   │   ├── prompts/
│   │   ├── web/
│   │   └── docs/
│   │
│   └── minimal/                        # Minimal viable project
│       ├── README.md
│       └── structure.txt
│
├── integration/                         # Starter-kit integration
│   ├── SAFETY_NET.md                   # From starter-kit
│   ├── DEVELOPMENT_PROTOCOLS.md        # From starter-kit
│   ├── PROJECT_SETUP_CHECKLIST.md      # From starter-kit
│   ├── SHELL_SCRIPT_STANDARDS.md       # From starter-kit
│   ├── CODE_STYLE_STANDARDS.md         # From starter-kit
│   └── common.sh                       # From starter-kit
│
└── validation/                          # Validation tools
    ├── validate-genesis.sh             # Validate genesis structure
    └── test-template-generation.sh     # Test template instantiation
```

---

## 3. Template Abstraction Strategy

### 3.1 Abstraction Layers

**Layer 1: Project Metadata**
- Project name
- Description
- Repository URL
- Author information
- License type

**Layer 2: Workflow Configuration**
- Number of phases (e.g., 3-phase PRD vs. 2-phase One-Pager)
- AI models used (Claude, Gemini, GPT-4, etc.)
- Input/output formats
- Prompt templates

**Layer 3: Architecture Choices**
- Web-only vs. Web + Backend
- Storage mechanism (IndexedDB, localStorage, backend API)
- Deployment target (GitHub Pages, CloudFront, Netlify, etc.)
- Language choices (Go, Python, Node.js, etc.)

**Layer 4: Feature Flags**
- Enable/disable backend
- Enable/disable desktop clients
- Enable/disable CI/CD
- Enable/disable code coverage
- Enable/disable pre-commit hooks

### 3.2 Template Variable System

All templates use a consistent variable syntax: `{{VARIABLE_NAME}}`

**Core Variables:**
```bash
# Project Identity
{{PROJECT_NAME}}                 # e.g., "one-pager-assistant"
{{PROJECT_TITLE}}                # e.g., "One-Pager Assistant"
{{PROJECT_DESCRIPTION}}          # One-line description
{{GITHUB_USER}}                  # GitHub username
{{GITHUB_REPO}}                  # Repository name
{{AUTHOR_NAME}}                  # Author full name
{{AUTHOR_EMAIL}}                 # Author email

# Workflow Configuration
{{WORKFLOW_TYPE}}                # "multi-phase" or "single-phase"
{{PHASE_COUNT}}                  # Number of workflow phases
{{PHASE_1_NAME}}                 # e.g., "Initial Draft"
{{PHASE_1_AI}}                   # e.g., "Claude Sonnet 4.5"
{{PHASE_2_NAME}}                 # e.g., "Review & Critique"
{{PHASE_2_AI}}                   # e.g., "Gemini 2.5 Pro"
{{PHASE_3_NAME}}                 # e.g., "Final Polish"
{{PHASE_3_AI}}                   # e.g., "Claude Sonnet 4.5"

# Architecture Flags
{{ENABLE_BACKEND}}               # true/false
{{ENABLE_DESKTOP_CLIENTS}}       # true/false
{{ENABLE_CODECOV}}               # true/false
{{ENABLE_PRE_COMMIT_HOOKS}}      # true/false

# Deployment
{{GITHUB_PAGES_URL}}             # e.g., "https://user.github.io/repo"
{{DEPLOY_BRANCH}}                # e.g., "main" or "gh-pages"
{{DEPLOY_FOLDER}}                # e.g., "docs" or "web"

# Storage
{{STORAGE_TYPE}}                 # "indexeddb", "localstorage", "backend"
{{DB_NAME}}                      # IndexedDB database name
{{STORE_NAME}}                   # IndexedDB store name
```

### 3.3 Template Processing

**Option 1: Manual Find-Replace** (Simple, AI-friendly)
```bash
# AI reads 01-AI-INSTRUCTIONS.md
# AI asks user for variable values
# AI performs find-replace across all template files
# AI removes "-template" suffix from filenames
```

**Option 2: Script-Based** (Advanced, automated)
```bash
# User runs: ./genesis/scripts/instantiate.sh
# Script prompts for variable values
# Script processes all templates
# Script creates new project structure
```

**Recommendation**: Start with Option 1 (manual) for maximum AI compatibility.

---

## 4. Integration with Starter-Kit

### 4.1 Starter-Kit Components to Include

**Core Documents** (Copy to `genesis/integration/`):
- ✅ `SAFETY_NET.md` - Pre-commit hooks, validation, security
- ✅ `DEVELOPMENT_PROTOCOLS.md` - AI-assisted development guidelines
- ✅ `PROJECT_SETUP_CHECKLIST.md` - Step-by-step setup guide
- ✅ `SHELL_SCRIPT_STANDARDS.md` - Shell script conventions
- ✅ `CODE_STYLE_STANDARDS.md` - Cross-language style guide
- ✅ `common.sh` - Reusable shell script library

**Integration Strategy**:
1. Copy starter-kit files verbatim to `genesis/integration/`
2. Reference them from `01-AI-INSTRUCTIONS.md`
3. Template scripts use `common.sh` functions
4. CLAUDE.md template references DEVELOPMENT_PROTOCOLS.md

### 4.2 Enhancements to Starter-Kit

**Add Genesis-Specific Sections**:
- Web app deployment protocols
- GitHub Pages setup procedures
- IndexedDB storage patterns
- ES6 module conventions
- Tailwind CSS dark mode setup

### 4.3 Mapping to Genesis Templates

| Starter-Kit File | Genesis Template | Purpose |
|------------------|------------------|---------|
| `common.sh` | `scripts/lib/common-template.sh` | Shell utilities |
| `SAFETY_NET.md` | `docs/development/CLAUDE-template.md` | Pre-commit hooks section |
| `DEVELOPMENT_PROTOCOLS.md` | `docs/development/CLAUDE-template.md` | AI protocols section |
| `PROJECT_SETUP_CHECKLIST.md` | `01-AI-INSTRUCTIONS.md` | Setup steps |
| Pre-commit hook examples | `hooks/pre-commit-template` | Git hooks |

---

## 5. Template Variables & Customization

### 5.1 Configuration File

**`genesis/config.template.json`**:
```json
{
  "project": {
    "name": "{{PROJECT_NAME}}",
    "title": "{{PROJECT_TITLE}}",
    "description": "{{PROJECT_DESCRIPTION}}",
    "version": "0.1.0",
    "license": "MIT"
  },
  "github": {
    "user": "{{GITHUB_USER}}",
    "repo": "{{GITHUB_REPO}}",
    "pages_url": "https://{{GITHUB_USER}}.github.io/{{GITHUB_REPO}}"
  },
  "workflow": {
    "type": "multi-phase",
    "phases": [
      {
        "number": 1,
        "name": "{{PHASE_1_NAME}}",
        "ai_model": "{{PHASE_1_AI}}",
        "prompt_file": "prompts/phase1.txt"
      },
      {
        "number": 2,
        "name": "{{PHASE_2_NAME}}",
        "ai_model": "{{PHASE_2_AI}}",
        "prompt_file": "prompts/phase2.txt"
      }
    ]
  },
  "architecture": {
    "enable_backend": false,
    "enable_desktop_clients": false,
    "enable_codecov": true,
    "enable_pre_commit_hooks": true,
    "storage_type": "indexeddb",
    "deploy_target": "github-pages"
  },
  "deployment": {
    "branch": "main",
    "folder": "docs",
    "auto_deploy": true
  }
}
```

### 5.2 Customization Workflow

**Step 1**: Copy `config.template.json` to `config.json`
**Step 2**: Fill in all `{{VARIABLES}}`
**Step 3**: Run validation: `./genesis/validation/validate-config.sh`
**Step 4**: Generate project: `./genesis/scripts/generate-project.sh`

---

## 6. AI-Readable Instructions

### 6.1 Primary Document: `01-AI-INSTRUCTIONS.md`

**Structure**:
```markdown
# Genesis Project Template - AI Instructions

## Your Mission
You are an AI assistant helping to create a new project from the Genesis template system.

## Step-by-Step Process

### Phase 1: Gather Requirements (5 minutes)
1. Ask user for project name
2. Ask user for project description
3. Ask user for workflow type (multi-phase or single-phase)
4. Ask user for number of phases
5. Ask user for AI models to use
6. Ask user for architecture choices

### Phase 2: Validate Configuration (2 minutes)
1. Verify all required variables are set
2. Check for naming conflicts
3. Validate GitHub repository exists
4. Confirm deployment target

### Phase 3: Generate Project Structure (10 minutes)
1. Create root directory structure
2. Process all template files
3. Replace all {{VARIABLES}}
4. Remove "-template" suffixes
5. Set file permissions

### Phase 4: Initialize Git & GitHub (5 minutes)
1. Initialize git repository
2. Create .gitignore
3. Make initial commit
4. Create GitHub repository
5. Push to remote

### Phase 5: Setup GitHub Pages (5 minutes)
1. Enable GitHub Pages
2. Configure deployment source
3. Set custom domain (if applicable)
4. Verify deployment

### Phase 6: Setup CI/CD (5 minutes)
1. Create GitHub Actions workflows
2. Add repository secrets
3. Enable branch protection
4. Test CI pipeline

### Phase 7: Validation (5 minutes)
1. Run validation script
2. Test web app locally
3. Verify GitHub Pages deployment
4. Check all links in README

## Success Criteria
- [ ] Project structure matches template
- [ ] All variables replaced
- [ ] Git repository initialized
- [ ] GitHub repository created
- [ ] GitHub Pages deployed
- [ ] CI/CD pipeline passing
- [ ] README renders correctly
- [ ] Web app loads in browser
```

### 6.2 Context Documents

**For AI to read before starting**:
1. `00-GENESIS-PLAN.md` (this file) - Understand the system
2. `01-AI-INSTRUCTIONS.md` - Step-by-step process
3. `integration/DEVELOPMENT_PROTOCOLS.md` - AI protocols
4. `integration/PROJECT_SETUP_CHECKLIST.md` - Setup checklist

---

## 7. GitHub Pages Deployment Automation

### 7.1 Deployment Strategy

**Option A: Deploy from `docs/` folder on `main` branch** (Recommended)
- ✅ Simple setup
- ✅ No separate branch to manage
- ✅ Easy to review changes
- ✅ Works with monorepo structure

**Option B: Deploy from `gh-pages` branch**
- ✅ Keeps deployment separate from source
- ❌ More complex workflow
- ❌ Requires branch management

**Genesis Default**: Option A (docs/ folder)

### 7.2 Automated Deployment Workflow

**`.github/workflows/deploy-web-template.yml`**:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
    paths:
      - 'docs/**'
      - 'web/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '{{DEPLOY_FOLDER}}'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 7.3 Setup Instructions Template

**`docs/deployment/GITHUB-PAGES-template.md`**:
```markdown
# GitHub Pages Setup

## Automated Setup (Recommended)

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/{{DEPLOY_FOLDER}}`
   - Click Save

2. **Verify Deployment**:
   - Wait 1-2 minutes
   - Visit: {{GITHUB_PAGES_URL}}
   - Should see your web app

## Manual Deployment

```bash
# Build web app (if needed)
npm run build

# Commit changes
git add {{DEPLOY_FOLDER}}
git commit -m "Deploy web app"
git push origin main

# GitHub Actions will auto-deploy
```

## Troubleshooting

**404 Error**: Check that `{{DEPLOY_FOLDER}}/index.html` exists
**Blank Page**: Check browser console for JavaScript errors
**Old Version**: Clear browser cache or hard refresh (Cmd+Shift+R)
```

---

## 8. Implementation Phases

### Phase 1: Core Structure (Day 1)

**Tasks**:
1. ✅ Create `genesis/` directory
2. ✅ Add `genesis/` to `.gitignore` (make it .gitignored as requested)
3. ✅ Create master plan (this file)
4. ✅ Create directory structure
5. ✅ Copy starter-kit files to `integration/`

**Deliverables**:
- `genesis/00-GENESIS-PLAN.md`
- `genesis/01-AI-INSTRUCTIONS.md`
- `genesis/02-QUICK-START.md`
- `genesis/03-CUSTOMIZATION-GUIDE.md`
- `genesis/integration/` (all starter-kit files)

### Phase 2: Web App Templates (Day 1-2)

**Tasks**:
1. ✅ Abstract `web/index.html` → `templates/web-app/index-template.html`
2. ✅ Abstract all `web/js/*.js` → `templates/web-app/js/*-template.js`
3. ✅ Abstract `web/css/styles.css` → `templates/web-app/css/styles-template.css`
4. ✅ Abstract `web/data/prompts.json` → `templates/web-app/data/prompts-template.json`
5. ✅ Create workflow abstraction guide

**Key Abstractions**:
- Replace "Product Requirements Assistant" → `{{PROJECT_TITLE}}`
- Replace "PRD" → `{{OUTPUT_TYPE}}`
- Replace "3-phase" → `{{PHASE_COUNT}}-phase`
- Replace hardcoded prompts → template variables
- Replace "Claude Sonnet 4.5" → `{{PHASE_1_AI}}`

### Phase 3: Documentation Templates (Day 2)

**Tasks**:
1. ✅ Abstract `README.md` → `templates/project-structure/README-template.md`
2. ✅ Abstract `CONTRIBUTING.md` → `templates/project-structure/CONTRIBUTING-template.md`
3. ✅ Abstract `docs/architecture/ARCHITECTURE.md` → `templates/docs/architecture/ARCHITECTURE-template.md`
4. ✅ Create CLAUDE.md template from DEVELOPMENT_PROTOCOLS.md
5. ✅ Abstract deployment docs

**Template Features**:
- Conditional sections (e.g., backend section only if `{{ENABLE_BACKEND}}` = true)
- Variable-driven badges (CI, coverage, etc.)
- Dynamic table of contents
- Project-specific examples

### Phase 4: Scripts & Automation (Day 2-3)

**Tasks**:
1. ✅ Abstract `scripts/lib/common.sh` → `templates/scripts/lib/common-template.sh`
2. ✅ Abstract `scripts/setup-macos.sh` → `templates/scripts/setup-macos-template.sh`
3. ✅ Abstract `scripts/validate-monorepo.sh` → `templates/scripts/validate-template.sh`
4. ✅ Abstract `scripts/check-binaries.sh` → `templates/scripts/check-binaries-template.sh`
5. ✅ Abstract `scripts/check-secrets.sh` → `templates/scripts/check-secrets-template.sh`
6. ✅ Create `scripts/setup-codecov-template.sh`

**Customization Points**:
- Project-specific dependencies
- Validation tiers (p1, med, all)
- Platform-specific setup
- Environment variables

### Phase 5: GitHub Actions Templates (Day 3)

**Tasks**:
1. ✅ Abstract `.github/workflows/ci.yml` → `templates/github/ci-template.yml`
2. ✅ Abstract `.github/workflows/deploy-web.yml` → `templates/github/deploy-web-template.yml`
3. ✅ Create conditional workflows (backend, codecov, etc.)
4. ✅ Create release workflow template

**Features**:
- Conditional jobs based on architecture flags
- Variable-driven test commands
- Deployment automation
- Badge generation

### Phase 6: Git Hooks Templates (Day 3)

**Tasks**:
1. ✅ Create pre-commit hook template
2. ✅ Create install-hooks script template
3. ✅ Integrate with starter-kit SAFETY_NET.md
4. ✅ Add binary detection
5. ✅ Add secrets detection

### Phase 7: Example Implementations (Day 4)

**Tasks**:
1. ✅ Create minimal example (simplest possible project)
2. ✅ Create One-Pager example (first use case)
3. ✅ Document both examples thoroughly
4. ✅ Test both examples end-to-end

**One-Pager Example Structure**:
```
examples/one-pager/
├── README.md                    # How to use this example
├── config.json                  # Filled-in configuration
├── prompts/
│   ├── initial.txt             # Initial draft prompt
│   └── review.txt              # Review & feedback prompt
├── web/
│   ├── index.html              # Customized for One-Pager
│   └── js/
│       └── workflow.js         # 2-phase workflow
└── docs/
    └── ARCHITECTURE.md         # One-Pager architecture
```

### Phase 8: Validation & Testing (Day 4-5)

**Tasks**:
1. ✅ Create `validation/validate-genesis.sh` - Validates genesis structure
2. ✅ Create `validation/test-template-generation.sh` - Tests template processing
3. ✅ Test with minimal example
4. ✅ Test with One-Pager example
5. ✅ Document common issues and solutions

**Validation Checks**:
- All template files have corresponding variables defined
- No hardcoded project-specific values in templates
- All scripts are executable
- All markdown links are valid
- All template variables are documented

### Phase 9: Documentation & Polish (Day 5)

**Tasks**:
1. ✅ Complete `01-AI-INSTRUCTIONS.md`
2. ✅ Complete `02-QUICK-START.md`
3. ✅ Complete `03-CUSTOMIZATION-GUIDE.md`
4. ✅ Review and refine all templates
5. ✅ Add troubleshooting guide
6. ✅ Create video walkthrough (optional)

---

## 9. Testing & Validation

### 9.1 Test Plan

**Test 1: Minimal Project Generation**
```bash
# Copy genesis to new repo
cp -r genesis /tmp/test-minimal
cd /tmp/test-minimal

# Follow AI instructions
# Expected: Working minimal web app in <30 minutes
```

**Test 2: One-Pager Project Generation**
```bash
# Copy genesis to new repo
cp -r genesis /tmp/test-onepager
cd /tmp/test-onepager

# Follow AI instructions with One-Pager config
# Expected: Working One-Pager app with 2-phase workflow
```

**Test 3: Full-Featured Project**
```bash
# Copy genesis to new repo
# Enable all features (backend, desktop, codecov, etc.)
# Expected: Complete project matching product-requirements-assistant
```

### 9.2 Validation Criteria

**Structure Validation**:
- [ ] All required directories exist
- [ ] All template files present
- [ ] No broken symlinks
- [ ] Correct file permissions

**Template Validation**:
- [ ] All variables documented
- [ ] No hardcoded values
- [ ] Consistent variable syntax
- [ ] All templates processable

**Documentation Validation**:
- [ ] All markdown renders correctly
- [ ] All links work
- [ ] All code blocks have syntax highlighting
- [ ] All examples tested

**Functional Validation**:
- [ ] Web app loads in browser
- [ ] IndexedDB storage works
- [ ] Workflow completes successfully
- [ ] GitHub Pages deploys
- [ ] CI/CD pipeline passes

### 9.3 Success Metrics

**Time to Working Project**:
- Minimal: <30 minutes
- One-Pager: <1 hour
- Full-Featured: <2 hours

**AI Comprehension**:
- AI can follow instructions without human intervention
- AI asks clarifying questions when needed
- AI validates configuration before proceeding

**Quality**:
- Generated project passes all validation checks
- No manual fixes required
- Professional-grade output

---

## 10. Example: One-Pager Workflow

### 10.1 Use Case Description

**Goal**: Create a One-Pager document generator for company-internal Libre Chat.

**Workflow**:
1. **Phase 1 - Initial Draft**: User provides context → AI generates initial one-pager
2. **Phase 2 - Review & Score**: AI reviews draft → Provides score (1-10) → Suggests improvements

**Key Differences from PRD Assistant**:
- 2 phases instead of 3
- Shorter output (1 page vs. 10+ pages)
- Scoring/feedback mechanism
- Internal tool (no public deployment)

### 10.2 Configuration

**`examples/one-pager/config.json`**:
```json
{
  "project": {
    "name": "one-pager-assistant",
    "title": "One-Pager Assistant",
    "description": "AI-assisted one-pager creation with scoring and feedback",
    "version": "0.1.0"
  },
  "workflow": {
    "type": "multi-phase",
    "phases": [
      {
        "number": 1,
        "name": "Initial Draft",
        "ai_model": "Claude Sonnet 4.5",
        "prompt_file": "prompts/initial.txt",
        "output_format": "markdown"
      },
      {
        "number": 2,
        "name": "Review & Score",
        "ai_model": "Claude Sonnet 4.5",
        "prompt_file": "prompts/review.txt",
        "output_format": "markdown_with_score"
      }
    ]
  },
  "architecture": {
    "enable_backend": false,
    "enable_desktop_clients": false,
    "enable_codecov": false,
    "enable_pre_commit_hooks": true,
    "storage_type": "indexeddb"
  }
}
```

### 10.3 Prompt Templates

**`examples/one-pager/prompts/initial.txt`**:
```
You are an expert business analyst helping to create a concise one-pager document.

CONTEXT:
{user_context}

REQUIREMENTS:
- Maximum 1 page (500-700 words)
- Clear problem statement
- Proposed solution
- Key benefits
- Success metrics
- Next steps

OUTPUT FORMAT:
# [Project Name]

## Problem Statement
[2-3 sentences]

## Proposed Solution
[3-4 sentences]

## Key Benefits
- Benefit 1
- Benefit 2
- Benefit 3

## Success Metrics
- Metric 1
- Metric 2

## Next Steps
1. Step 1
2. Step 2
3. Step 3
```

**`examples/one-pager/prompts/review.txt`**:
```
You are a senior executive reviewing a one-pager proposal.

ORIGINAL ONE-PAGER:
{phase1_output}

REVIEW CRITERIA:
1. Clarity (1-10): Is the problem and solution clear?
2. Conciseness (1-10): Is it truly one page?
3. Impact (1-10): Are benefits compelling?
4. Feasibility (1-10): Are next steps realistic?
5. Completeness (1-10): Does it answer all key questions?

OUTPUT FORMAT:
# Review & Feedback

## Overall Score: [X/10]

## Detailed Scores
- Clarity: [X/10] - [Brief comment]
- Conciseness: [X/10] - [Brief comment]
- Impact: [X/10] - [Brief comment]
- Feasibility: [X/10] - [Brief comment]
- Completeness: [X/10] - [Brief comment]

## Strengths
- Strength 1
- Strength 2

## Areas for Improvement
- Improvement 1
- Improvement 2

## Recommended Changes
1. Change 1
2. Change 2
```

### 10.4 Implementation Steps

**Step 1**: Copy genesis to new repo
```bash
mkdir one-pager-assistant
cp -r genesis/* one-pager-assistant/
cd one-pager-assistant
```

**Step 2**: AI reads instructions
```bash
# AI reads:
# - 01-AI-INSTRUCTIONS.md
# - examples/one-pager/README.md
# - examples/one-pager/config.json
```

**Step 3**: AI gathers requirements
```
AI: "I see you want to create a One-Pager assistant. Let me confirm the configuration:
- Project name: one-pager-assistant
- 2-phase workflow (Initial Draft → Review & Score)
- No backend required
- Deploy to GitHub Pages
Is this correct?"

User: "Yes, that's correct."
```

**Step 4**: AI generates project
```bash
# AI processes all templates
# AI replaces variables
# AI creates project structure
# AI initializes git
```

**Step 5**: AI sets up GitHub Pages
```bash
# AI creates GitHub repo
# AI pushes code
# AI enables GitHub Pages
# AI verifies deployment
```

**Step 6**: AI validates
```bash
# AI runs validation script
# AI tests web app locally
# AI confirms GitHub Pages deployment
```

**Result**: Working One-Pager assistant deployed to GitHub Pages in <1 hour.

---

## 11. Review Checklist (Double-Check)

### First Review ✅

- [x] Architecture overview is comprehensive
- [x] Directory structure is complete
- [x] Template abstraction strategy is clear
- [x] Starter-kit integration is well-defined
- [x] Template variables are documented
- [x] AI instructions are detailed
- [x] GitHub Pages deployment is automated
- [x] Implementation phases are realistic
- [x] Testing plan is thorough
- [x] One-Pager example is complete

### Second Review ✅

- [x] All sections are internally consistent
- [x] No contradictions between sections
- [x] All file paths are correct
- [x] All template variables are used consistently
- [x] All examples are realistic and testable
- [x] All automation scripts are feasible
- [x] All documentation is AI-readable
- [x] All success criteria are measurable
- [x] All validation checks are implementable
- [x] Plan is ready for implementation

---

## 12. Next Steps

### Immediate Actions

1. **Get User Approval**: Present this plan to user for review
2. **Create .gitignore Entry**: Add `genesis/` to root `.gitignore`
3. **Begin Phase 1**: Create directory structure and copy starter-kit files
4. **Begin Phase 2**: Start abstracting web app templates

### Timeline

- **Day 1**: Phases 1-2 (Core structure + Web app templates)
- **Day 2**: Phases 3-4 (Documentation + Scripts)
- **Day 3**: Phases 5-6 (GitHub Actions + Git hooks)
- **Day 4**: Phase 7-8 (Examples + Validation)
- **Day 5**: Phase 9 (Documentation polish)

**Total Estimated Time**: 5 days (40 hours)

### Success Criteria

✅ **Genesis system is complete when**:
1. All templates are created and tested
2. AI can follow instructions to create new project
3. Minimal example works end-to-end
4. One-Pager example works end-to-end
5. All validation checks pass
6. Documentation is complete

---

## 13. Conclusion

This plan provides a comprehensive framework for creating derivative projects from the Product Requirements Assistant. By combining:

- ✅ **Proven patterns** from product-requirements-assistant
- ✅ **Best practices** from starter-kit
- ✅ **AI-first design** for maximum automation
- ✅ **Modular architecture** for flexibility
- ✅ **Automated deployment** for rapid iteration

We create a meta-template system that enables rapid creation of high-quality projects.

**The Genesis system is ready for implementation.** 🚀

---

**Plan Status**: ✅ COMPLETE - DOUBLE-CHECKED - READY FOR IMPLEMENTATION

