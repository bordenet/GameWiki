# AI Execution Checklist

**For AI Assistants**: Use this checklist to verify you've completed all steps from START-HERE.md

---

## ⚠️ BEFORE YOU START (MANDATORY)

**DO NOT PROCEED** until you've completed these prerequisite steps:

- [ ] Read `REFERENCE-IMPLEMENTATIONS.md`
- [ ] Study https://github.com/bordenet/product-requirements-assistant ⭐ **PRIMARY REFERENCE**
  - [ ] **CRITICAL**: Read `docs/index.html` lines 9-15 - Tailwind dark mode config (ALWAYS BROKEN WITHOUT THIS!)
  - [ ] **CRITICAL**: Read `docs/js/app.js` lines 145-165 - Dark mode toggle functions (loadTheme, toggleTheme)
  - [ ] Read `js/workflow.js` - Phase architecture, prompt loading, data flow
  - [ ] Read `js/app.js` - Form rendering, phase transitions, UI logic
  - [ ] Read `prompts/phase1.md` - Prompt template with variables
  - [ ] Read `templates/prd-template.md` - Document structure (in THAT repo, not Genesis)
  - [ ] Read `tests/workflow.test.js` - Testing async prompts
  - [ ] Read `scripts/deploy-web.sh` - Compact mode deployment with quality gates
  - [ ] Read `scripts/setup-macos.sh` - Fast, resumable setup with smart caching
- [ ] Study https://github.com/bordenet/one-pager ⭐ **SECONDARY REFERENCE**
  - [ ] Read `index.html` - Related projects dropdown, UI patterns
  - [ ] Read `GENESIS-DARK-MODE-IMPLEMENTATION.md` - Lessons learned
  - [ ] Read `GENESIS-PROCESS-IMPROVEMENTS.md` - What went wrong and how to fix it
- [ ] Read `docs/WORKFLOW-ARCHITECTURE.md` (includes dark mode implementation guide)
- [ ] Read `docs/REQUIREMENTS-TEMPLATE.md`
- [ ] Read `docs/WORKFLOW-DECISION-TREE.md`
- [ ] Understand the 3-phase workflow pattern (mock, manual, mock)
- [ ] Understand form-to-prompt pattern for Phase 1
- [ ] Understand template variable replacement (`{variableName}` syntax)
- [ ] Understand async prompt loading from markdown files
- [ ] Understand defensive coding patterns
- [ ] Understand mock vs. manual mode
- [ ] **Understand dark mode implementation** (Tailwind config + loadTheme + toggleTheme)
- [ ] **Understand deployment scripts** (compact mode, git output redirection)
- [ ] **Understand setup scripts** (fast, resumable, smart caching)

**Why this matters**: This will answer 90% of your questions BEFORE you ask the user. You'll know:
- ✅ **How to fix dark mode** (CRITICAL - broken in every Genesis project without Tailwind config)
- ✅ How to structure workflow phases (default: 3 phases)
- ✅ How to load prompts from markdown files (always in `prompts/` directory)
- ✅ How to handle form data and template variables
- ✅ How to implement mock mode for development
- ✅ How to write defensive code with proper validation
- ✅ How to test async functionality
- ✅ **How to write deployment scripts** (compact mode, quality gates)
- ✅ **How to write setup scripts** (fast, resumable, smart caching)

**If you skip this step, you will waste time asking questions that are already answered in the reference implementation.**

**📝 IMPORTANT**: Create `REVERSE-INTEGRATION-NOTES.md` in the project root (use template from `genesis/templates/project-structure/REVERSE-INTEGRATION-NOTES-template.md`). Every time you reference the implementations to solve a problem, add a note documenting what Genesis is missing.

---

## Pre-Execution Verification

Before starting, verify these files exist in genesis/:

**Core Documentation**:
- [ ] `START-HERE.md` (your entry point)
- [ ] `templates/CLAUDE.md.template` (mandatory workflow)
- [ ] `05-QUALITY-STANDARDS.md` (quality requirements)
- [ ] `integration/CODE_STYLE_STANDARDS.md` (coding standards)
- [ ] `integration/SHELL_SCRIPT_STANDARDS.md` (shell script standards)

**Template Files** (CRITICAL - these are what you'll copy):
- [ ] `templates/project-structure/gitignore-template`
- [ ] `templates/project-structure/README-template.md`
- [ ] `templates/project-structure/REVERSE-INTEGRATION-NOTES-template.md`
- [ ] `templates/project-structure/.eslintrc-template.json`
- [ ] `templates/project-structure/codecov-template.yml`
- [ ] `templates/project-structure/.env.example-template` (RECOMMENDED)
- [ ] `templates/project-structure/CONTRIBUTING-template.md` (RECOMMENDED)
- [ ] `templates/testing/package-template.json`
- [ ] `templates/testing/jest.config-template.js`
- [ ] `templates/testing/jest.setup-template.js`
- [ ] `templates/web-app/index-template.html`
- [ ] `templates/web-app/js/app-template.js`
- [ ] `templates/web-app/js/workflow-template.js`
- [ ] `templates/web-app/js/storage-template.js`
- [ ] `templates/web-app/js/ai-mock-template.js`
- [ ] `templates/web-app/js/ai-mock-ui-template.js`
- [ ] `templates/web-app/js/same-llm-adversarial-template.js`
- [ ] `templates/testing/ai-mock.test-template.js`
- [ ] `templates/testing/storage.test-template.js`
- [ ] `templates/testing/workflow.e2e-template.js`
- [ ] `templates/testing/same-llm-adversarial.test-template.js`
- [ ] `templates/prompts/phase1-template.md`
- [ ] `templates/prompts/phase2-template.md`
- [ ] `templates/prompts/phase3-template.md`
- [ ] `templates/scripts/setup-macos-web-template.sh`
- [ ] `templates/scripts/setup-linux-template.sh`
- [ ] `templates/scripts/setup-windows-wsl-template.sh`
- [ ] `templates/scripts/deploy-web.sh.template`
- [ ] `templates/scripts/install-hooks-template.sh`
- [ ] `templates/scripts/setup-codecov-template.sh`
- [ ] `templates/scripts/lib/common-template.sh`
- [ ] `templates/scripts/lib/compact.sh`
- [ ] `templates/git-hooks/pre-commit-template` (RECOMMENDED)

**Examples** (for REFERENCE ONLY - do NOT copy from here):
- [ ] `examples/hello-world/README.md` (study this, don't copy)

**If ANY template file is missing, STOP and tell the user Genesis is incomplete.**

---

## Step 1: Read Mandatory Files ✅

- [ ] Read `templates/CLAUDE.md.template` completely
- [ ] Read `05-QUALITY-STANDARDS.md` completely
- [ ] Read `integration/CODE_STYLE_STANDARDS.md` completely
- [ ] Read `integration/SHELL_SCRIPT_STANDARDS.md` completely
- [ ] Read `examples/hello-world/README.md` (for reference, not copying)
- [ ] Understand: ALWAYS lint, ALWAYS test, ALWAYS communicate what's left
- [ ] Understand: NEVER include node_modules/, coverage/, dist/, build/
- [ ] Understand: NEVER use hyperbolic language
- [ ] Understand: Check coding standards FIRST before creating code

---

## Step 2: Gather Requirements ✅

**Ask ONLY these essential questions** (after studying reference implementation):

- [ ] Asked user for project name
- [ ] Asked user for project title
- [ ] Asked user for one-line description
- [ ] Asked user for GitHub username
- [ ] Asked user for GitHub repo name
- [ ] Asked user for document type (e.g., "One-Pager", "PRD", "Design Doc")
- [ ] Asked user for link to document template or example (if available)
- [ ] Asked user if they want deviations from standard 3-phase workflow (default: NO)
- [ ] Stored all answers as variables for template replacement

**Did NOT ask** (inferred from reference implementation):
- [ ] Did NOT ask "How many phases?" (Default: 3)
- [ ] Did NOT ask "Should prompts be in files?" (YES - always in `prompts/`)
- [ ] Did NOT ask "Should templates be abstracted?" (YES - always in `templates/`)
- [ ] Did NOT ask "How should mock mode work?" (See product-requirements-assistant)
- [ ] Did NOT ask "Should Phase 1 have a form?" (YES - if structured doc)
- [ ] Did NOT ask "How should validation work?" (See defensive coding patterns)

---

## Step 3: Copy and Customize Templates ✅

### 3.1 Core Files
- [ ] Copied `.gitignore` from `templates/project-structure/gitignore-template`
- [ ] Copied `CLAUDE.md` from `templates/CLAUDE.md.template`
- [ ] Replaced `{{PROJECT_NAME}}` in CLAUDE.md
- [ ] Copied `README.md` from `templates/project-structure/README-template.md`
- [ ] Replaced ALL `{{VARIABLES}}` in README.md
- [ ] Copied `REVERSE-INTEGRATION-NOTES.md` from `templates/project-structure/REVERSE-INTEGRATION-NOTES-template.md`
- [ ] Copied `package.json` from `templates/testing/package-template.json`
- [ ] Replaced variables in package.json
- [ ] Copied `.eslintrc.json` from `templates/project-structure/.eslintrc-template.json`
- [ ] Copied `codecov.yml` from `templates/project-structure/codecov-template.yml`
- [ ] Copied `jest.config.js` from `templates/testing/jest.config-template.js`
- [ ] Copied `jest.setup.js` from `templates/testing/jest.setup-template.js`
- [ ] Copied `.env.example` from `templates/project-structure/.env.example-template` (RECOMMENDED)
- [ ] Customized .env.example with project's environment variables
- [ ] Copied `CONTRIBUTING.md` from `templates/project-structure/CONTRIBUTING-template.md` (RECOMMENDED)
- [ ] Replaced `{{PROJECT_NAME}}`, `{{GITHUB_USER}}`, `{{GITHUB_REPO}}` in CONTRIBUTING.md
- [ ] Created `.github/workflows/` directory
- [ ] Copied `.github/workflows/ci.yml` from `templates/github/workflows/ci-template.yml`
- [ ] Replaced `{{DEPLOY_FOLDER}}` in ci.yml (usually "." for root or "docs" for docs folder)
- [ ] Removed "# IF {{ENABLE_TESTS}}" and "# END IF" comment lines (kept content between them)
- [ ] Removed "# IF {{ENABLE_CODECOV}}" sections if not using Codecov yet (or kept if using Codecov)

### 3.2 Web App Files
- [ ] Copied `index.html` from `templates/web-app/index-template.html`
- [ ] Replaced `{{PROJECT_TITLE}}`, `{{PROJECT_DESCRIPTION}}`, `{{HEADER_EMOJI}}`, `{{FAVICON_EMOJI}}`
- [ ] Customized navigation dropdown in index.html (lines 43-59) - updated Related Projects links
- [ ] Created `js/` directory
- [ ] Copied `js/app.js` from `templates/web-app/js/app-template.js`
- [ ] Copied `js/workflow.js` from `templates/web-app/js/workflow-template.js`
- [ ] Copied `js/storage.js` from `templates/web-app/js/storage-template.js`
- [ ] Copied `js/router.js` from `templates/web-app/js/router-template.js` (multi-project routing)
- [ ] Copied `js/views.js` from `templates/web-app/js/views-template.js` (project list and form views)
- [ ] Copied `js/projects.js` from `templates/web-app/js/projects-template.js` (project CRUD operations)
- [ ] Copied `js/project-view.js` from `templates/web-app/js/project-view-template.js` (individual project view)
- [ ] Copied `js/ui.js` from `templates/web-app/js/ui-template.js` (UI utilities: toasts, modals, loading)
- [ ] Copied `js/ai-mock.js` from `templates/web-app/js/ai-mock-template.js`
- [ ] Copied `js/ai-mock-ui.js` from `templates/web-app/js/ai-mock-ui-template.js`
- [ ] Copied `js/same-llm-adversarial.js` from `templates/web-app/js/same-llm-adversarial-template.js`
- [ ] Replaced `{{PROJECT_NAME}}`, `{{DOCUMENT_TYPE}}`, `{{HEADER_EMOJI}}` in all JS files
- [ ] Customized workflow.js - updated phase names, descriptions, AI models, and form fields
- [ ] Verified same-llm-adversarial.js configuration for corporate deployments
- [ ] Created `css/` directory
- [ ] Copied `css/styles.css` from `templates/web-app/css/styles-template.css` (MANDATORY - index.html references this)
- [ ] Created `.nojekyll` file (disables Jekyll processing, improves GitHub Pages deployment speed)
- [ ] Created `data/` directory (optional - for data files if needed)
- [ ] Created `tests/` directory
- [ ] Copied `tests/ai-mock.test.js` from `templates/testing/ai-mock.test-template.js`
- [ ] Copied `tests/storage.test.js` from `templates/testing/storage.test-template.js`
- [ ] Copied `tests/workflow.test.js` from `templates/testing/workflow.e2e-template.js`
- [ ] Copied `tests/same-llm-adversarial.test.js` from `templates/testing/same-llm-adversarial.test-template.js`
- [ ] Replaced `{{PROJECT_NAME}}`, `{{DOCUMENT_TYPE}}` in all test files
- [ ] Customized tests/workflow.test.js - updated test cases to match workflow phases and form fields
- [ ] Verified tests/same-llm-adversarial.test.js includes all 13 test scenarios

### 3.3 Prompts and Templates
- [ ] Created `prompts/` directory
- [ ] Created `templates/` directory
- [ ] Copied `prompts/phase1.md` from `templates/prompts/phase1-template.md`
- [ ] Copied `prompts/phase2.md` from `templates/prompts/phase2-template.md`
- [ ] Copied `prompts/phase3.md` from `templates/prompts/phase3-template.md`
- [ ] Replaced `{{DOCUMENT_TYPE}}`, `{{PHASE_1_AI}}`, `{{PHASE_2_AI}}`, `{{PHASE_3_AI}}`
- [ ] Replaced `{{PROJECT_TITLE}}`, `{{GITHUB_PAGES_URL}}`
- [ ] Read customization instructions at top of each prompt file
- [ ] Created YOUR_PROJECT/`templates/{document-type}-template.md` based on your document type
- [ ] Used {variableName} syntax (lowercase, camelCase) for template variables
- [ ] Verified template variables match form fields in workflow.js
- [ ] Studied product-requirements-assistant/templates/prd-template.md for example structure (external repo)

### 3.4 Scripts
- [ ] **⚠️ STUDIED REFERENCE**: Reviewed https://github.com/bordenet/product-requirements-assistant/tree/main/scripts
- [ ] Created `scripts/` directory
- [ ] Created `scripts/lib/` directory
- [ ] **MANDATORY**: Copied `setup-macos.sh` from `templates/scripts/setup-macos-web-template.sh`
- [ ] Replaced `{{PROJECT_NAME}}` in setup-macos.sh
- [ ] Copied `setup-linux.sh` from `templates/scripts/setup-linux-template.sh` (if supporting Linux)
- [ ] Replaced `{{PROJECT_NAME}}` in setup-linux.sh
- [ ] Copied `setup-windows-wsl.sh` from `templates/scripts/setup-windows-wsl-template.sh` (if supporting Windows)
- [ ] Replaced `{{PROJECT_NAME}}` in setup-windows-wsl.sh
- [ ] Copied `deploy-web.sh` from `templates/scripts/deploy-web.sh.template`
- [ ] Replaced `{{PROJECT_NAME}}`, `{{GITHUB_USER}}`, `{{GITHUB_REPO}}`, `{{GITHUB_PAGES_URL}}` in deploy-web.sh
- [ ] Copied `lib/common.sh` from `templates/scripts/lib/common-template.sh`
- [ ] Copied `lib/compact.sh` from `templates/scripts/lib/compact.sh` (library file, no templating needed)
- [ ] Copied `install-hooks.sh` from `templates/scripts/install-hooks-template.sh`
- [ ] Replaced `{{PROJECT_NAME}}` in install-hooks.sh
- [ ] Copied pre-commit hook from `templates/git-hooks/pre-commit-template` to `.git/hooks/pre-commit` (RECOMMENDED)
- [ ] Made pre-commit hook executable: `chmod +x .git/hooks/pre-commit`
- [ ] Replaced `{{PROJECT_NAME}}` in pre-commit hook
- [ ] Copied `setup-codecov.sh` from `templates/scripts/setup-codecov-template.sh` (optional)
- [ ] Replaced `{{GITHUB_USER}}`, `{{GITHUB_REPO}}` in setup-codecov.sh
- [ ] Made all scripts executable: `chmod +x scripts/*.sh scripts/lib/*.sh`
- [ ] Verified setup-macos.sh exists and is executable
- [ ] Verified install-hooks.sh exists and is executable

### 3.4.5 Evolutionary Optimization Tools (RECOMMENDED)
**🚀 GAME-CHANGING FEATURE**: Evolutionary prompt optimization delivers +20-30% quality improvements through iterative testing and mutation.

- [ ] Copied evolutionary optimization module: `cp -r genesis/modules/evolutionary-optimization tools/`
- [ ] Verified tools/ directory structure:
  - [ ] `tools/README.md` - Documentation and quick start guide
  - [ ] `tools/scorers/` - Project-type-specific scoring functions
  - [ ] `tools/scripts/` - Automation scripts (quick-start.sh, compare-projects.sh)
  - [ ] `tools/templates/` - Mutation library and project-type configs
- [ ] Made scripts executable: `chmod +x tools/scripts/*.sh`
- [ ] Read `tools/README.md` for usage instructions
- [ ] Verified scorer exists for your project type (prd-scorer.js, one-pager-scorer.js, or coe-scorer.js)
- [ ] If no scorer exists for your project type, created custom scorer based on existing examples

**Why this matters:**
- ✅ Proven +31.1% quality improvement in 20 rounds (product-requirements-assistant)
- ✅ Production-validated code from real projects
- ✅ Automated testing and comparison
- ✅ Mutation library with top 5 high-impact mutations
- ✅ Diminishing returns analysis (optimal: 15-20 rounds)

**When to use:**
- After Phase 1 prompt is working, run evolutionary optimization to improve it
- Use `tools/scripts/quick-start.sh` to start a simulation
- Compare results with `tools/scripts/compare-projects.sh`
- Apply top mutations from the mutation library in `modules/evolutionary-optimization/mutations/`
- Use top 5 mutations for 71-73% of total improvement

### 3.5 Variable Replacement
- [ ] Replaced `{{PROJECT_NAME}}` everywhere
- [ ] Replaced `{{PROJECT_TITLE}}` everywhere
- [ ] Replaced `{{PROJECT_DESCRIPTION}}` everywhere
- [ ] Replaced `{{GITHUB_USER}}` everywhere
- [ ] Replaced `{{GITHUB_REPO}}` everywhere
- [ ] Replaced `{{GITHUB_PAGES_URL}}` everywhere
- [ ] Replaced `{{HEADER_EMOJI}}` everywhere
- [ ] Replaced `{{FAVICON_EMOJI}}` everywhere
- [ ] Replaced `{{DOCUMENT_TYPE}}` everywhere
- [ ] Replaced `{{PHASE_1_AI}}`, `{{PHASE_2_AI}}`, `{{PHASE_3_AI}}` everywhere
- [ ] Verified NO unreplaced variables: `grep -r "{{" . --exclude-dir=node_modules --exclude-dir=genesis`

### 3.6 Verify All Template Files Copied
- [ ] Used checklist in START-HERE.md Step 3.6
- [ ] Verified all MANDATORY core files copied (9 files)
- [ ] Verified all RECOMMENDED core files copied (2 files: .env.example, CONTRIBUTING.md)
- [ ] Verified all MANDATORY web app files copied (6 files)
- [ ] Verified all MANDATORY test files copied (3 files)
- [ ] Verified all MANDATORY prompts/templates copied (4 files)
- [ ] Verified all MANDATORY scripts copied (5 files)
- [ ] Verified RECOMMENDED git hooks copied (1 file: pre-commit)
- [ ] Verified OPTIONAL scripts copied (if needed)
- [ ] Ran verification command: `find . -type f ! -path './node_modules/*' ! -path './genesis/*' ! -path './.git/*' | wc -l`
- [ ] Verified at least 30 files exist

### 3.7 Optional Files (Advanced)
- [ ] Reviewed START-HERE.md Section 3.7 for optional files
- [ ] Decided if validation script is needed (RECOMMENDED)
  - [ ] If YES: Copied `templates/scripts/validate-genesis-setup-template.sh`
  - [ ] If YES: Made script executable with `chmod +x`
- [ ] Decided if manual deployment workflow is needed
  - [ ] If YES: Copied `templates/github/workflows/deploy-web-template.yml`
- [ ] Decided if security check script is needed (RECOMMENDED)
  - [ ] If YES: Copied `templates/scripts/check-secrets-template.sh`
- [ ] Decided if additional test files are needed
  - [ ] If YES: Copied `templates/testing/ui.test-template.js`
  - [ ] If YES: Copied `templates/testing/projects.test-template.js`
  - [ ] If YES: Copied `templates/testing/workflow.test-template.js`
- [ ] Decided if EditorConfig is needed
  - [ ] If YES: Copied `templates/project-structure/.editorconfig-template`
- [ ] Decided if Claude Desktop integration is needed
  - [ ] If YES: Copied `templates/project-structure/.claude/settings.local.json-template`
- [ ] Decided if LICENSE file is needed
  - [ ] If YES: Copied `templates/project-structure/LICENSE-template`
- [ ] Decided if RELEASES.md is needed
  - [ ] If YES: Copied `templates/project-structure/RELEASES-template.md`
- [ ] Decided if non-web setup script is needed (only for backend/CLI projects)
  - [ ] If YES: Copied `templates/scripts/setup-macos-template.sh`
- [ ] Decided if validation script is needed (optional project structure validation)
  - [ ] If YES: Copied `templates/scripts/validate-template.sh`
- [ ] Decided if Playwright E2E testing is needed (usually NO - Jest is sufficient)
  - [ ] If YES: Copied `templates/testing/playwright.config-template.js`
- [ ] Decided if comprehensive documentation is needed (only for large/complex projects)
  - [ ] If YES: Copied `templates/docs/architecture/ARCHITECTURE-template.md`
  - [ ] If YES: Copied `templates/docs/deployment/DEPLOYMENT-template.md`
  - [ ] If YES: Copied `templates/docs/deployment/CI-CD-template.md`
  - [ ] If YES: Copied `templates/docs/deployment/GITHUB-PAGES-template.md`
  - [ ] If YES: Copied `templates/docs/development/DEVELOPMENT-template.md`
  - [ ] If YES: Copied `templates/docs/TESTING-template.md`
  - [ ] If YES: Copied `templates/docs/SHELL_SCRIPT_STANDARDS-template.md`

---

## Step 4: Install and Test ✅

- [ ] Ran `npm install`
- [ ] Ran `./scripts/install-hooks.sh` (CRITICAL - installs pre-commit hooks)
- [ ] Verified pre-commit hook installed in `.git/hooks/pre-commit`
- [ ] Ran `npm run lint`
- [ ] Fixed any linting errors (or ran `npm run lint:fix`)
- [ ] Verified 0 linting errors
- [ ] Ran `NODE_OPTIONS=--experimental-vm-modules npm test`
- [ ] Verified ALL tests passing
- [ ] Ran `NODE_OPTIONS=--experimental-vm-modules npm run test:coverage`
- [ ] Verified coverage ≥70% (or ≥85% for production)
- [ ] Fixed any failing tests BEFORE proceeding
- [ ] (Optional) Ran `./scripts/setup-codecov.sh` if setting up code coverage reporting

---

## Step 5: Set Up GitHub ✅

- [ ] Ran `git init` (if needed)
- [ ] Ran `git add .`
- [ ] Ran `git commit -m "Initial commit from Genesis template"`
- [ ] User created GitHub repo (or used `gh repo create`)
- [ ] Ran `git remote add origin git@github.com:USER/REPO.git`
- [ ] Ran `git branch -M main`
- [ ] Ran `git push -u origin main`
- [ ] Verified push succeeded

---

## Step 6: Enable GitHub Pages ✅

- [ ] Told user to go to repo settings → Pages
- [ ] Told user to select: Source = Deploy from branch
- [ ] Told user to select: Branch = main, Folder = / (root)
- [ ] Told user to click Save
- [ ] Told user to wait 1-2 minutes
- [ ] Told user the URL: `https://USER.github.io/REPO/`

---

## Step 7: Delete Genesis ✅

- [ ] Ran `rm -rf genesis/`
- [ ] Ran `git add .`
- [ ] Ran `git commit -m "Remove genesis template directory"`
- [ ] Ran `git push`
- [ ] Verified genesis/ is gone from repo

---

## Step 8: Test Deployment Script ✅

- [ ] Verified `scripts/deploy-web.sh` exists and is executable
- [ ] Ran `./scripts/deploy-web.sh --help` to verify help works
- [ ] Tested deployment script: `./scripts/deploy-web.sh`
- [ ] Verified script runs linting
- [ ] Verified script runs tests
- [ ] Verified script checks coverage
- [ ] Verified script pushes to GitHub
- [ ] Verified script displays deployment URL

---

## Step 9: Final Verification ✅

- [ ] App works at `https://USER.github.io/REPO/`
- [ ] All tests passing (`npm test`)
- [ ] Linting clean (`npm run lint`)
- [ ] Coverage ≥70% (`npm run test:coverage`)
- [ ] Deployment script works (`./scripts/deploy-web.sh`)
- [ ] No `node_modules/` in git (`git ls-files | grep node_modules` returns nothing)
- [ ] No `coverage/` in git (`git ls-files | grep coverage` returns nothing)
- [ ] `genesis/` directory deleted and removed from git

---

## Step 10: Tell User ✅

- [ ] Told user: "✅ Completed: [specific actions]"
- [ ] Told user: "✅ Quality Checks: [linting, tests, coverage results]"
- [ ] Told user: "✅ Deployed: [GitHub Pages URL]"
- [ ] Told user: "✅ Deployment Script: Use `./scripts/deploy-web.sh` for future deployments"
- [ ] Told user: "✅ What's Left: NOTHING - Ready to start coding!"
- [ ] Did NOT use hyperbolic language
- [ ] Was specific with numbers (X/X tests, Y% coverage)

---

## Step 11: Review Reverse-Integration Notes ✅

**CRITICAL**: Before finishing, review what you learned during this implementation.

- [ ] Check `REVERSE-INTEGRATION-NOTES.md` - Did you create any notes?
- [ ] Count how many times you referenced product-requirements-assistant or one-pager
- [ ] For each reference, ask: "Should this be in Genesis templates?"
- [ ] If you referenced the same thing multiple times, Genesis is definitely missing it
- [ ] Tell user: "📝 Created [N] reverse-integration notes for Genesis improvements"
- [ ] Tell user: "🔄 Recommend sharing REVERSE-INTEGRATION-NOTES.md with Genesis maintainer"

**Questions to ask yourself**:
- ✅ Did dark mode work immediately, or did you have to fix it? (If fixed: Genesis gap!)
- ✅ Did you copy code from reference implementations? (If yes: Should be in templates!)
- ✅ Did you ask questions that were answered in reference implementations? (If yes: Better docs needed!)
- ✅ Did you encounter bugs that Genesis should prevent? (If yes: Add validation!)
- ✅ Did you implement features that future projects will need? (If yes: Add to templates!)

**Example summary to give user**:
```
📝 Reverse-Integration Summary:
- Created 3 notes in REVERSE-INTEGRATION-NOTES.md
- Referenced product-requirements-assistant 5 times (dark mode, workflow, deployment)
- Referenced one-pager 2 times (UI patterns)
- Recommendations for Genesis:
  1. CRITICAL: Add [specific pattern] to templates
  2. HIGH: Update [specific doc] with [specific guidance]
  3. MEDIUM: Add [specific validation] to prevent [specific bug]
```

---

## Final Self-Check

- [ ] I read START-HERE.md completely before starting
- [ ] I studied BOTH reference implementations before implementing
- [ ] I followed ALL steps in order
- [ ] I did NOT skip linting or testing
- [ ] I did NOT include build artifacts
- [ ] I proactively communicated what's left
- [ ] I created REVERSE-INTEGRATION-NOTES.md and documented what Genesis is missing
- [ ] I can confidently say: "Ready to start coding"

**If ALL boxes are checked, you successfully executed Genesis. Well done!**

---

## 🔄 Continuous Improvement Cycle

**Remember**: Genesis gets better with every project!

1. ✅ You built a project from Genesis
2. ✅ You referenced implementations when stuck
3. ✅ You documented what you learned
4. 🔄 **Next**: Share notes with Genesis maintainer
5. 🔄 **Result**: Next project is easier

**This is how Genesis evolves from good to great.**

