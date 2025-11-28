# 🚀 Genesis - Start Here

**For AI Assistants**: This is your ONLY entry point. Read this file completely, then execute the steps below.

**Verification**: Use [`AI-EXECUTION-CHECKLIST.md`](AI-EXECUTION-CHECKLIST.md) to verify you've completed all steps.

---

## What You're About to Do

You're in a fresh repository with the `genesis/` directory. Your mission:
1. Create a fully working web application from templates
2. Set up testing, linting, and CI/CD
3. Deploy to GitHub Pages
4. Delete the `genesis/` directory when done
5. Tell the user: "Ready to start coding"

**Time Budget**: 30-60 minutes  
**Success Criteria**: Working app deployed to GitHub Pages, genesis/ deleted, all tests passing

---

## 📚 STEP 0: Study Reference Implementation FIRST (REQUIRED)

**⚠️ STOP!** Before proceeding, you MUST study the reference implementation:

### Required Reading (in order):

1. **[`REFERENCE-IMPLEMENTATIONS.md`](REFERENCE-IMPLEMENTATIONS.md)** - Overview of working examples
2. **Study the live example**: https://github.com/bordenet/product-requirements-assistant
   - **CRITICAL**: Browse the repository on GitHub (files below are in THAT repo, not Genesis)
   - **`docs/index.html`** (lines 9-15) - ⭐ **Tailwind dark mode config** (ALWAYS BROKEN WITHOUT THIS!)
   - **`docs/js/app.js`** (lines 145-165) - ⭐ **Dark mode toggle functions** (loadTheme, toggleTheme)
   - **`js/workflow.js`** - Phase architecture, prompt loading, data flow
   - **`js/app.js`** - Form rendering, phase transitions, UI logic
   - **`prompts/phase1.md`** - Prompt template with variables
   - **`templates/prd-template.md`** - Document structure (in product-requirements-assistant repo)
   - **`tests/workflow.test.js`** - Testing async prompts
   - **`scripts/deploy-web.sh`** - ⭐ **Compact mode deployment** (git output redirection)
   - **`scripts/setup-macos.sh`** - ⭐ **Fast, resumable setup** (smart caching)
3. **[`docs/WORKFLOW-ARCHITECTURE.md`](docs/WORKFLOW-ARCHITECTURE.md)** - Detailed workflow patterns + dark mode fix
4. **[`docs/REQUIREMENTS-TEMPLATE.md`](docs/REQUIREMENTS-TEMPLATE.md)** - What to ask vs. infer
5. **[`docs/WORKFLOW-DECISION-TREE.md`](docs/WORKFLOW-DECISION-TREE.md)** - Decision framework

### What You'll Learn:

- ✅ **Dark mode toggle** (Tailwind `darkMode: 'class'` config) - **CRITICAL!**
- ✅ **loadTheme()** function (prevents flash of wrong theme)
- ✅ **toggleTheme()** function (works with Tailwind class mode)
- ✅ 3-phase workflow pattern (mock, manual, mock)
- ✅ Form-to-prompt pattern for Phase 1
- ✅ Template variable replacement (`{variableName}` syntax)
- ✅ Async prompt loading from markdown files
- ✅ Defensive coding patterns
- ✅ Mock mode vs. manual mode
- ✅ How form fields map to template sections
- ✅ How to structure prompts in separate files
- ✅ How to test async prompt loading
- ✅ **Deployment scripts** (compact mode, quality gates)
- ✅ **Setup scripts** (fast, resumable, smart caching)

### Why This Matters:

**This will answer 90% of your questions BEFORE you ask the user.**

The reference implementation shows you EXACTLY how to:
- **Fix dark mode toggle** (broken in EVERY Genesis project without Tailwind config)
- Structure the workflow phases
- Load prompts from markdown files
- Handle form data and template variables
- Implement mock mode for development
- Write defensive code with proper validation
- Test async functionality
- **Deploy with quality gates** (lint, test, coverage)
- **Create fast setup scripts** (5-10 seconds on subsequent runs)

**DO NOT PROCEED** until you've studied these references. This will save you and the user significant time by avoiding unnecessary questions about patterns that are already solved.

### 🚨 CRITICAL: Dark Mode Fix

**EVERY Genesis project has had broken dark mode.** The fix is simple but MANDATORY:

```html
<!-- In HTML <head> -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
    tailwind.config = {
        darkMode: 'class'  // ← CRITICAL: Without this, toggle won't work!
    }
</script>
```

**Study the reference implementation for the complete pattern!**

---

## Step 1: Read Mandatory Files (5 minutes)

Read these files IN ORDER. They contain critical information you MUST follow:

1. **[`templates/CLAUDE.md.template`](templates/CLAUDE.md.template)** - Mandatory workflow (lint → test → communicate)
2. **[`05-QUALITY-STANDARDS.md`](05-QUALITY-STANDARDS.md)** - Quality requirements (85% coverage, no hyperbole)
3. **[`integration/CODE_STYLE_STANDARDS.md`](integration/CODE_STYLE_STANDARDS.md)** - ⭐ **Coding standards**
4. **[`integration/SHELL_SCRIPT_STANDARDS.md`](integration/SHELL_SCRIPT_STANDARDS.md)** - ⭐ **Shell script standards**
5. **[`examples/hello-world/README.md`](examples/hello-world/README.md)** - Working example to study

**Critical Rules**:
- ✅ ALWAYS lint after creating code (`npm run lint`)
- ✅ ALWAYS test after creating tests (`npm test`)
- ✅ ALWAYS create `.gitignore` (use `templates/project-structure/gitignore-template`)
- ❌ NEVER include `node_modules/`, `coverage/`, `dist/`, `build/`
- ❌ NEVER use hyperbolic language ("amazing", "production-grade", etc.)

---

## Step 2: Gather Requirements (5 minutes)

**After studying the reference implementation**, ask the user ONLY these essential questions:

```
1. Project name? (e.g., "one-pager")
2. Project title? (e.g., "One-Pager Assistant")
3. One-line description?
4. GitHub username?
5. GitHub repo name?
6. What type of document? (e.g., "One-Pager", "PRD", "Design Doc")
7. Link to document template or example? (if available)
8. Any deviations from standard 3-phase workflow? (default: NO)
```

**DO NOT ASK** - Infer from reference implementation:
- ❌ How many phases? (Default: 3)
- ❌ Should prompts be in files? (YES - always in `prompts/` directory)
- ❌ Should templates be abstracted? (YES - always in `templates/` directory)
- ❌ How should mock mode work? (See product-requirements-assistant)
- ❌ Should Phase 1 have a form? (YES - if document is structured)
- ❌ How should validation work? (See defensive coding patterns in WORKFLOW-ARCHITECTURE.md)

**Default Workflow** (unless user specifies otherwise):

**3-Phase Pattern Explained:**
- **Phase 1: Initial Draft (Mock Mode)** - User fills form → AI generates draft (client-side)
- **Phase 2: Review & Critique (Manual Mode)** - User copies to external AI → gets critique → copies back
- **Phase 3: Final Synthesis (Mock Mode)** - AI combines Phase 1 + Phase 2 → final document (client-side)

**Why 3 phases?**
- Phase 1: Fast iteration with structured inputs
- Phase 2: Different AI perspective for quality improvement
- Phase 3: Best of both worlds synthesis

**File Structure:**
- Prompts in `prompts/phase1.md`, `prompts/phase2.md`, `prompts/phase3.md`
- Document template in `templates/{document-type}-template.md`
- Phase 1 form with fields matching template sections
- Template variables using `{variableName}` syntax (lowercase, camelCase)

**Store these as variables** - you'll use them to replace `{{PROJECT_NAME}}`, `{{GITHUB_USER}}`, etc. in templates.

---

## Step 3: Copy and Customize Templates (15 minutes)

### 3.1 Copy Core Files

```bash
# Copy .gitignore (CRITICAL - do this FIRST)
cp genesis/templates/project-structure/gitignore-template .gitignore

# Copy CLAUDE.md
cp genesis/templates/CLAUDE.md.template CLAUDE.md
# Replace {{PROJECT_NAME}} with actual project name

# Copy README.md
cp genesis/templates/project-structure/README-template.md README.md
# Replace all {{VARIABLES}} with actual values

# Copy REVERSE-INTEGRATION-NOTES.md (CRITICAL - track what Genesis is missing)
cp genesis/templates/project-structure/REVERSE-INTEGRATION-NOTES-template.md REVERSE-INTEGRATION-NOTES.md
# Replace {{PROJECT_NAME}} with actual project name

# Copy package.json
cp genesis/templates/testing/package-template.json package.json
# Replace {{PROJECT_NAME}}, {{PROJECT_DESCRIPTION}}, {{GITHUB_USER}}, {{GITHUB_REPO}}, {{GITHUB_PAGES_URL}}

# Copy ESLint config
cp genesis/templates/project-structure/.eslintrc-template.json .eslintrc.json

# Copy Codecov config
cp genesis/templates/project-structure/codecov-template.yml codecov.yml
# Replace {{PROJECT_NAME}} with actual project name

# Copy test configs
cp genesis/templates/testing/jest.config-template.js jest.config.js
cp genesis/templates/testing/jest.setup-template.js jest.setup.js

# Copy .env.example (RECOMMENDED - documents environment variables)
cp genesis/templates/project-structure/.env.example-template .env.example
# Customize with your project's environment variables (if any)

# Copy CONTRIBUTING.md (RECOMMENDED - for open source projects)
cp genesis/templates/project-structure/CONTRIBUTING-template.md CONTRIBUTING.md
# Replace {{PROJECT_NAME}}, {{GITHUB_USER}}, {{GITHUB_REPO}}

# Copy GitHub Actions workflows (MANDATORY - badges in README.md reference these!)
mkdir -p .github/workflows
cp genesis/templates/github/workflows/ci-template.yml .github/workflows/ci.yml
# Replace template variables in ci.yml:
#   - {{DEPLOY_FOLDER}} → "." (for root deployment) or "docs" (if using docs/ folder)
#   - Remove "# IF {{ENABLE_TESTS}}" and "# END IF {{ENABLE_TESTS}}" comment lines (keep the content between them)
#   - Remove "# IF {{ENABLE_CODECOV}}" and "# END IF {{ENABLE_CODECOV}}" sections if you don't have Codecov token yet
#   - IMPORTANT: If you remove the test job, also remove the coverage job (it depends on test)
#
# CRITICAL: Without this workflow file, the CI/CD badge in README.md will show "unknown"
# See product-requirements-assistant/.github/workflows/ci.yml for reference
```

**📝 IMPORTANT**: The `REVERSE-INTEGRATION-NOTES.md` file is where you'll document:
- Every time you reference product-requirements-assistant or one-pager to solve a problem
- What patterns are missing from Genesis templates
- What bugs Genesis should prevent
- What features future projects will need

**This creates a continuous improvement cycle for Genesis!**

### 3.2 Copy Web App Files

```bash
# Copy HTML
cp genesis/templates/web-app/index-template.html index.html
# Replace {{PROJECT_TITLE}}, {{PROJECT_DESCRIPTION}}, {{HEADER_EMOJI}}, {{FAVICON_EMOJI}}
# Customize navigation dropdown in index.html (lines 43-59):
#   - Update "Related Projects" links to point to your other tools
#   - Or remove the dropdown if you don't have related projects
#   - See one-pager and product-requirements-assistant for examples

# Copy JavaScript
mkdir -p js

# Core application files (MANDATORY)
cp genesis/templates/web-app/js/app-template.js js/app.js
cp genesis/templates/web-app/js/storage-template.js js/storage.js
cp genesis/templates/web-app/js/workflow-template.js js/workflow.js

# Multi-project architecture (MANDATORY - enables project management)
cp genesis/templates/web-app/js/router-template.js js/router.js
cp genesis/templates/web-app/js/views-template.js js/views.js
cp genesis/templates/web-app/js/projects-template.js js/projects.js
cp genesis/templates/web-app/js/project-view-template.js js/project-view.js
cp genesis/templates/web-app/js/ui-template.js js/ui.js

# AI mock and testing (MANDATORY)
cp genesis/templates/web-app/js/ai-mock-template.js js/ai-mock.js
cp genesis/templates/web-app/js/ai-mock-ui-template.js js/ai-mock-ui.js
cp genesis/templates/web-app/js/same-llm-adversarial-template.js js/same-llm-adversarial.js

# Replace {{PROJECT_NAME}}, {{DOCUMENT_TYPE}}, {{HEADER_EMOJI}} in all JS files
# Customize workflow.js:
#   - Update phase names, descriptions, and AI models
#   - Update form fields to match your document structure
#   - See product-requirements-assistant/js/workflow.js for example
# Note: same-llm-adversarial.js automatically detects when Phase 1 and Phase 2 use the same LLM
#   and applies Gemini personality simulation to maintain adversarial tension

# Copy CSS (MANDATORY - index.html references this file)
mkdir -p css
cp genesis/templates/web-app/css/styles-template.css css/styles.css
# Note: Tailwind CSS is loaded via CDN, but custom CSS is needed for additional styling

# Create .nojekyll file (disables Jekyll processing, improves GitHub Pages deployment speed)
touch .nojekyll

# Create data directory (optional - for storing data files if needed)
mkdir -p data

# Copy tests
mkdir -p tests
cp genesis/templates/testing/ai-mock.test-template.js tests/ai-mock.test.js
cp genesis/templates/testing/storage.test-template.js tests/storage.test.js
cp genesis/templates/testing/workflow.e2e-template.js tests/workflow.test.js
cp genesis/templates/testing/same-llm-adversarial.test-template.js tests/same-llm-adversarial.test.js
# Replace {{PROJECT_NAME}}, {{DOCUMENT_TYPE}} in all test files
# Customize tests/workflow.test.js:
#   - Update test cases to match your workflow phases
#   - Update form field tests to match your document structure
#   - See product-requirements-assistant/tests/workflow.test.js for example
# Note: tests/same-llm-adversarial.test.js includes 13 comprehensive test scenarios
#   for same-LLM detection, forget clause handling, and adversarial quality validation
```

**CRITICAL - Dark Mode**: The index-template.html already includes the Tailwind dark mode config. DO NOT remove it!

### 3.3 Copy Prompts and Templates

```bash
# Create directories
mkdir -p prompts templates

# Copy prompt templates
cp genesis/templates/prompts/phase1-template.md prompts/phase1.md
cp genesis/templates/prompts/phase2-template.md prompts/phase2.md
cp genesis/templates/prompts/phase3-template.md prompts/phase3.md
# Replace {{DOCUMENT_TYPE}}, {{PHASE_1_AI}}, {{PHASE_2_AI}}, {{PHASE_3_AI}}
# Replace {{PROJECT_TITLE}}, {{GITHUB_PAGES_URL}}
# Customize document structure for your needs

# Create document template
# Study product-requirements-assistant/templates/prd-template.md for example
# Create YOUR_PROJECT/templates/{document-type}-template.md with your document structure
#
# IMPORTANT: Use {variableName} syntax (lowercase, camelCase) for template variables
# Example: {title}, {problems}, {context}, {targetAudience}
# These variables will be replaced with form field values in Phase 1
#
# Template structure example:
#   # {title}
#
#   ## Problem Statement
#   {problems}
#
#   ## Context
#   {context}
#
# This is a file YOU create in your new project, not a Genesis template
```

**NOTE**: The prompt templates are CONCRETE EXAMPLES from product-requirements-assistant. Read the customization instructions at the top of each file!

### 3.4 Copy Scripts

**⚠️ CRITICAL**: Study https://github.com/bordenet/product-requirements-assistant/tree/main/scripts FIRST

```bash
# Create scripts directory
mkdir -p scripts/lib

# MANDATORY: Copy setup scripts (ALWAYS REQUIRED)
cp genesis/templates/scripts/setup-macos-web-template.sh scripts/setup-macos.sh
# Replace {{PROJECT_NAME}} with actual project name

# If supporting Linux:
cp genesis/templates/scripts/setup-linux-template.sh scripts/setup-linux.sh
# Replace {{PROJECT_NAME}} with actual project name

# If supporting Windows WSL:
cp genesis/templates/scripts/setup-windows-wsl-template.sh scripts/setup-windows-wsl.sh
# Replace {{PROJECT_NAME}} with actual project name

# Copy deployment script (for web apps)
cp genesis/templates/scripts/deploy-web.sh.template scripts/deploy-web.sh
# Replace {{PROJECT_NAME}}, {{GITHUB_USER}}, {{GITHUB_REPO}}, {{GITHUB_PAGES_URL}}

# Copy library scripts
cp genesis/templates/scripts/lib/common-template.sh scripts/lib/common.sh
cp genesis/templates/scripts/lib/compact.sh scripts/lib/compact.sh

# Copy install-hooks script
cp genesis/templates/scripts/install-hooks-template.sh scripts/install-hooks.sh
# Replace {{PROJECT_NAME}} with actual project name

# Copy pre-commit hook (RECOMMENDED - quality gate enforcement)
mkdir -p .git/hooks
cp genesis/templates/git-hooks/pre-commit-template .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
# Replace {{PROJECT_NAME}} with actual project name
# Note: This hook runs linting before every commit to prevent bad commits
# Alternative: Run ./scripts/install-hooks.sh which does this automatically

# Optional: Copy codecov setup script
cp genesis/templates/scripts/setup-codecov-template.sh scripts/setup-codecov.sh
# Replace {{GITHUB_USER}}, {{GITHUB_REPO}} with actual values

# Make scripts executable
chmod +x scripts/*.sh scripts/lib/*.sh

# Verify setup scripts exist
ls -la scripts/setup-macos.sh
ls -la scripts/install-hooks.sh
```

### 3.4.5 Copy Evolutionary Optimization Tools (RECOMMENDED)

**🚀 GAME-CHANGING FEATURE**: Evolutionary prompt optimization delivers measurable +20-30% quality improvements!

```bash
# Copy the entire evolutionary optimization module
cp -r genesis/modules/evolutionary-optimization tools/

# Make scripts executable
chmod +x tools/scripts/*.sh

# Verify structure
ls -la tools/
# Should see: README.md, scorers/, scripts/, templates/

# Read the documentation
cat tools/README.md
```

**What you get:**
- ✅ **Proven Results**: +31.1% quality improvement in 20 rounds (product-requirements-assistant)
- ✅ **Production Code**: Validated in real projects (PRD-assistant, one-pager, COE generator)
- ✅ **Automated Testing**: Run simulations with `tools/scripts/quick-start.sh`
- ✅ **Mutation Library**: Top 5 high-impact mutations deliver 71-73% of total improvement
- ✅ **Smart Optimization**: Diminishing returns analysis shows optimal iteration count (15-20 rounds)

**Project-Type-Specific Scorers:**
- `scorers/prd-scorer.js` - For Product Requirements Documents
- `scorers/one-pager-scorer.js` - For one-page documents
- `scorers/coe-scorer.js` - For Center of Excellence documents
- Create your own scorer if needed (see existing scorers for examples)

**When to use:**
1. After your Phase 1 prompt is working, run evolutionary optimization
2. Use `tools/scripts/quick-start.sh` to start a simulation
3. Compare results with `tools/scripts/compare-projects.sh`
4. Apply top mutations from the mutation library in `modules/evolutionary-optimization/mutations/`

**Quick Start:**
```bash
# After copying tools/, run a quick simulation
cd tools
./scripts/quick-start.sh

# Or run a full 20-round simulation
node run-simulation.js --rounds 20 --project-type prd
```

See `tools/README.md` for complete documentation and usage examples.

### 3.5 Replace Template Variables

**Option 1: Manual (Recommended for first time)**
- Use your editor's find/replace feature
- Search for `{{PROJECT_NAME}}` and replace with actual name
- Repeat for all variables

**Option 2: Automated (Advanced)**
```bash
# macOS/BSD sed (note the '' after -i):
sed -i '' 's/{{PROJECT_NAME}}/one-pager/g' **/*.{js,sh,md,json,html}
sed -i '' 's/{{GITHUB_USER}}/bordenet/g' **/*.{js,sh,md,json,html}

# Linux sed:
sed -i 's/{{PROJECT_NAME}}/one-pager/g' **/*.{js,sh,md,json,html}
sed -i 's/{{GITHUB_USER}}/bordenet/g' **/*.{js,sh,md,json,html}
```

**Variables to replace:**
- `{{PROJECT_NAME}}` → e.g., "one-pager"
- `{{PROJECT_TITLE}}` → e.g., "One-Pager Assistant"
- `{{PROJECT_DESCRIPTION}}` → e.g., "Create professional one-page documents"
- `{{GITHUB_USER}}` → e.g., "bordenet"
- `{{GITHUB_REPO}}` → e.g., "one-pager"
- `{{GITHUB_PAGES_URL}}` → e.g., "https://bordenet.github.io/one-pager/"
- `{{HEADER_EMOJI}}` → e.g., "📄"
- `{{FAVICON_EMOJI}}` → e.g., "📄"
- `{{DOCUMENT_TYPE}}` → e.g., "One-Pager"
- `{{PHASE_1_AI}}` → e.g., "Claude Sonnet 4.5"
- `{{PHASE_2_AI}}` → e.g., "Gemini 2.5 Pro"
- `{{PHASE_3_AI}}` → e.g., "Claude Sonnet 4.5"

**Verification:**
```bash
# Verify all variables replaced:
grep -r "{{" . --exclude-dir=node_modules --exclude-dir=genesis
# Should return NO results
```

### 3.6 Verify All Template Files Copied

**CRITICAL**: Use this checklist to ensure you haven't missed any template files!

**Core Files** (MANDATORY):
- [ ] `.gitignore` (from `project-structure/gitignore-template`)
- [ ] `CLAUDE.md` (from `templates/CLAUDE.md.template`)
- [ ] `README.md` (from `project-structure/README-template.md`)
- [ ] `REVERSE-INTEGRATION-NOTES.md` (from `project-structure/REVERSE-INTEGRATION-NOTES-template.md`)
- [ ] `package.json` (from `testing/package-template.json`)
- [ ] `.eslintrc.json` (from `project-structure/.eslintrc-template.json`)
- [ ] `codecov.yml` (from `project-structure/codecov-template.yml`)
- [ ] `jest.config.js` (from `testing/jest.config-template.js`)
- [ ] `jest.setup.js` (from `testing/jest.setup-template.js`)

**Core Files** (RECOMMENDED):
- [ ] `.env.example` (from `project-structure/.env.example-template`)
- [ ] `CONTRIBUTING.md` (from `project-structure/CONTRIBUTING-template.md`)

**GitHub Actions** (MANDATORY - badges in README.md reference these!):
- [ ] `.github/workflows/ci.yml` (from `github/workflows/ci-template.yml`)

**Web App Files** (MANDATORY):
- [ ] `index.html` (from `web-app/index-template.html`)
- [ ] `js/app.js` (from `web-app/js/app-template.js`)
- [ ] `js/storage.js` (from `web-app/js/storage-template.js`)
- [ ] `js/workflow.js` (from `web-app/js/workflow-template.js`)
- [ ] `js/router.js` (from `web-app/js/router-template.js`)
- [ ] `js/views.js` (from `web-app/js/views-template.js`)
- [ ] `js/projects.js` (from `web-app/js/projects-template.js`)
- [ ] `js/project-view.js` (from `web-app/js/project-view-template.js`)
- [ ] `js/ui.js` (from `web-app/js/ui-template.js`)
- [ ] `js/ai-mock.js` (from `web-app/js/ai-mock-template.js`)
- [ ] `js/ai-mock-ui.js` (from `web-app/js/ai-mock-ui-template.js`)
- [ ] `js/same-llm-adversarial.js` (from `web-app/js/same-llm-adversarial-template.js`)
- [ ] `css/styles.css` (from `web-app/css/styles-template.css`)
- [ ] `.nojekyll` (created with `touch .nojekyll` - disables Jekyll processing)

**Test Files** (MANDATORY):
- [ ] `tests/ai-mock.test.js` (from `testing/ai-mock.test-template.js`)
- [ ] `tests/storage.test.js` (from `testing/storage.test-template.js`)
- [ ] `tests/workflow.test.js` (from `testing/workflow.e2e-template.js`)
- [ ] `tests/same-llm-adversarial.test.js` (from `testing/same-llm-adversarial.test-template.js`)

**Prompts and Templates** (MANDATORY):
- [ ] `prompts/phase1.md` (from `prompts/phase1-template.md`)
- [ ] `prompts/phase2.md` (from `prompts/phase2-template.md`)
- [ ] `prompts/phase3.md` (from `prompts/phase3-template.md`)
- [ ] `templates/{document-type}-template.md` (YOU create this in your new project)

**Scripts** (MANDATORY):
- [ ] `scripts/setup-macos.sh` (from `scripts/setup-macos-web-template.sh`)
- [ ] `scripts/deploy-web.sh` (from `scripts/deploy-web.sh.template`)
- [ ] `scripts/lib/common.sh` (from `scripts/lib/common-template.sh`)
- [ ] `scripts/lib/compact.sh` (from `scripts/lib/compact.sh`)
- [ ] `scripts/install-hooks.sh` (from `scripts/install-hooks-template.sh`)

**Git Hooks** (RECOMMENDED):
- [ ] `.git/hooks/pre-commit` (from `git-hooks/pre-commit-template`)

**Evolutionary Optimization Tools** (RECOMMENDED - 🚀 GAME-CHANGING):
- [ ] `tools/` directory (copied from `modules/evolutionary-optimization/`)
- [ ] `tools/README.md` - Documentation and quick start
- [ ] `tools/scorers/` - Project-type-specific scoring functions
- [ ] `tools/scripts/` - Automation scripts (quick-start.sh, compare-projects.sh)
- [ ] `tools/templates/` - Mutation library and project-type configs
- [ ] Made scripts executable: `chmod +x tools/scripts/*.sh`

**Scripts** (OPTIONAL):
- [ ] `scripts/setup-linux.sh` (from `scripts/setup-linux-template.sh`)
- [ ] `scripts/setup-windows-wsl.sh` (from `scripts/setup-windows-wsl-template.sh`)
- [ ] `scripts/setup-codecov.sh` (from `scripts/setup-codecov-template.sh`)

**Verification Command**:
```bash
# Count files (should have at least 30 files):
find . -type f ! -path './node_modules/*' ! -path './genesis/*' ! -path './.git/*' | wc -l

# Count template files in genesis (for reference):
find genesis/templates -name "*-template*" -type f | wc -l

# Verify you copied the most important files:
ls -1 index.html CLAUDE.md README.md package.json .eslintrc.json codecov.yml \
   js/app.js js/workflow.js css/styles.css \
   tests/ai-mock.test.js tests/storage.test.js tests/workflow.test.js \
   prompts/phase1.md prompts/phase2.md prompts/phase3.md \
   scripts/setup-macos.sh scripts/deploy-web.sh scripts/install-hooks.sh \
   2>/dev/null | wc -l
# Should show 19 (all critical files present)
```

### 3.7 Optional Files (Advanced)

**These files are OPTIONAL and can be added if needed:**

#### Manual Deployment Workflow
```bash
# If you want manual deployment workflow (alternative to automatic deployment):
cp genesis/templates/github/workflows/deploy-web-template.yml .github/workflows/deploy-web.yml
# Replace {{DEPLOY_FOLDER}} with 'docs' or '.'
# Replace {{GITHUB_PAGES_URL}} with your GitHub Pages URL
```

#### Validation Script
```bash
# RECOMMENDED: Validate Genesis setup after initial configuration
cp genesis/templates/scripts/validate-genesis-setup-template.sh scripts/validate-genesis-setup.sh
chmod +x scripts/validate-genesis-setup.sh
# Run after completing setup to verify all template variables are replaced
```

#### Security Check Script
```bash
# RECOMMENDED: Prevent committing secrets to repository
cp genesis/templates/scripts/check-secrets-template.sh scripts/check-secrets.sh
chmod +x scripts/check-secrets.sh
# Replace {{PROJECT_TITLE}} with your project title
# Add to .git/hooks/pre-commit to run automatically
```

#### Additional Test Files
```bash
# If you want comprehensive test coverage:
cp genesis/templates/testing/ui.test-template.js tests/ui.test.js
cp genesis/templates/testing/projects.test-template.js tests/projects.test.js
cp genesis/templates/testing/workflow.test-template.js tests/workflow.test.js
```

#### EditorConfig
```bash
# For consistent code formatting across editors:
cp genesis/templates/project-structure/.editorconfig-template .editorconfig
```

#### Claude Desktop Integration
```bash
# For Claude Desktop permissions:
mkdir -p .claude
cp genesis/templates/project-structure/.claude/settings.local.json-template .claude/settings.local.json
```

#### License File
```bash
# Add MIT license:
cp genesis/templates/project-structure/LICENSE-template LICENSE
# Replace {{YEAR}} with current year
# Replace {{AUTHOR_NAME}} with your name
```

#### Release History
```bash
# Track releases:
cp genesis/templates/project-structure/RELEASES-template.md RELEASES.md
# Replace {{PROJECT_TITLE}} with your project title
# Replace {{RELEASE_DATE}} with release date
```

#### Non-Web macOS Setup Script
```bash
# If you're building a backend/CLI project (not a web app):
cp genesis/templates/scripts/setup-macos-template.sh scripts/setup-macos.sh
# Note: For web apps, use setup-macos-WEB-template.sh (already referenced above)
```

#### Validation Script
```bash
# If you want a validation script to check project structure:
cp genesis/templates/scripts/validate-template.sh scripts/validate.sh
chmod +x scripts/validate.sh
# Replace {{PROJECT_NAME}} with actual project name
```

#### Playwright E2E Testing
```bash
# If you want browser-based E2E testing (in addition to Jest):
cp genesis/templates/testing/playwright.config-template.js playwright.config.js
npm install -D @playwright/test
# Note: Most projects use Jest; Playwright is for advanced E2E testing
```

#### Documentation Templates
```bash
# If you want comprehensive documentation:
mkdir -p docs/architecture docs/deployment docs/development

# Architecture documentation
cp genesis/templates/docs/architecture/ARCHITECTURE-template.md docs/architecture/ARCHITECTURE.md

# Deployment documentation
cp genesis/templates/docs/deployment/DEPLOYMENT-template.md docs/deployment/DEPLOYMENT.md
cp genesis/templates/docs/deployment/CI-CD-template.md docs/deployment/CI-CD.md
cp genesis/templates/docs/deployment/GITHUB-PAGES-template.md docs/deployment/GITHUB-PAGES.md

# Development documentation
cp genesis/templates/docs/development/DEVELOPMENT-template.md docs/development/DEVELOPMENT.md

# Testing documentation
cp genesis/templates/docs/TESTING-template.md docs/TESTING.md

# Shell script standards
cp genesis/templates/docs/SHELL_SCRIPT_STANDARDS-template.md docs/SHELL_SCRIPT_STANDARDS.md

# Replace {{PROJECT_NAME}}, {{GITHUB_USER}}, {{GITHUB_REPO}} in all docs
# Note: Most projects don't need this level of documentation
```

**When to use optional files**:
- **Separate lint workflow**: Only if you want linting to run independently from CI
- **Non-web setup script**: Only for backend/CLI projects (not web apps)
- **Validation script**: Only if you want automated project structure validation
- **Playwright**: Only if you need browser-based E2E tests (Jest is usually sufficient)
- **Documentation templates**: Only for large/complex projects that need extensive docs

---

## Step 4: Install and Test (10 minutes)

```bash
# Install dependencies
npm install

# Install Git hooks (CRITICAL - quality gates)
./scripts/install-hooks.sh
# This installs pre-commit hooks that run linting before every commit

# Lint
npm run lint
# Fix any errors with: npm run lint:fix

# Test
NODE_OPTIONS=--experimental-vm-modules npm test

# Coverage
NODE_OPTIONS=--experimental-vm-modules npm run test:coverage
# Verify ≥70% coverage (or ≥85% for production apps)
```

**If tests fail**: Fix them before proceeding. Do NOT skip this step.

**Optional: Set up Codecov**
```bash
# If you want code coverage reporting:
./scripts/setup-codecov.sh
# This will guide you through setting up Codecov integration
```

---

## Step 5: Set Up GitHub (5 minutes)

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit from Genesis template"

# Create GitHub repo (user does this manually or via gh CLI)
# Then:
git remote add origin git@github.com:{{GITHUB_USER}}/{{GITHUB_REPO}}.git
git branch -M main
git push -u origin main
```

---

## Step 6: Enable GitHub Pages (2 minutes)

Tell user:
```
1. Go to: https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/settings/pages

2. Source: GitHub Actions
   (This allows the CI/CD workflow to deploy automatically)

3. Save

4. Wait 1-2 minutes for first deployment

5. Visit: https://{{GITHUB_USER}}.github.io/{{GITHUB_REPO}}/

NOTE: The .github/workflows/ci.yml workflow will automatically deploy to GitHub Pages
on every push to main. You can also deploy manually using ./scripts/deploy-web.sh
```

---

## Step 7: Test Deployment Script (3 minutes)

```bash
# Test deployment script
./scripts/deploy-web.sh --help
# Verify help displays correctly

# Run deployment
./scripts/deploy-web.sh
# This will:
# 1. Run linting
# 2. Run tests
# 3. Check coverage
# 4. Commit and push
# 5. Verify deployment
```

**Note**: For future deployments, always use `./scripts/deploy-web.sh` instead of manual git commands.

---

## Step 8: Delete Genesis (1 minute)

```bash
# Remove genesis directory
rm -rf genesis/

# Commit
git add .
git commit -m "Remove genesis template directory"
git push
```

---

## Step 9: Final Verification (2 minutes)

Verify:
- ✅ App works at `https://{{GITHUB_USER}}.github.io/{{GITHUB_REPO}}/`
- ✅ All tests passing (`npm test`)
- ✅ Linting clean (`npm run lint`)
- ✅ Coverage ≥70% (`npm run test:coverage`)
- ✅ Deployment script works (`./scripts/deploy-web.sh`)
- ✅ No `node_modules/` or `coverage/` in git
- ✅ `genesis/` directory deleted

---

## Step 10: Tell User

```
✅ Completed:
- Created {{PROJECT_TITLE}} from Genesis template
- Linting: PASSED (0 errors)
- Tests: PASSED (X/X tests)
- Coverage: X% (exceeds threshold)
- Deployed: https://{{GITHUB_USER}}.github.io/{{GITHUB_REPO}}/
- Deployment script: Use `./scripts/deploy-web.sh` for future deployments
- Genesis directory: DELETED

✅ What's Left:
- NOTHING - Ready to start coding!
- You can now customize the app for your specific use case
- All quality infrastructure is in place (tests, linting, CI/CD)
```

---

**That's it!** You've successfully bootstrapped a new project from Genesis. The user can now start coding with full confidence that quality standards are enforced.

