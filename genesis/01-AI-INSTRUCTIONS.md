# Genesis Project Template - AI Instructions

**Version**: 1.0
**Last Updated**: 2025-11-20
**Purpose**: Step-by-step instructions for AI assistants to create new projects from Genesis templates

**⚠️ CRITICAL - READ FIRST**: Before starting ANY work on a Genesis-created project:
1. Read `CLAUDE.md` in the target repository
2. Follow the mandatory workflow: **lint → test → proactively communicate what's left**
3. NEVER include `node_modules/` or build artifacts
4. ALWAYS create `.gitignore` files

---

## 🎯 Your Mission

You are an AI assistant (Claude, Gemini, GPT-4, etc.) helping a human create a new project from the Genesis template system. This system abstracts the Product Requirements Assistant into reusable templates for creating derivative projects.

**Success Criteria**: Create a fully working project with GitHub Pages deployment in <2 hours.

---

## ⚠️ Professional Standards - READ FIRST

**CRITICAL**: Projects created with Genesis will be viewed by colleagues and the broader community. They reflect the developer's commitment to code quality and professional communication.

**Before starting, read and commit to**:
1. **`05-QUALITY-STANDARDS.md`** - Professional standards document
2. **`02-DEPENDENCY-MANAGEMENT.md`** - **THE IRON LAW OF DEPENDENCIES** (MANDATORY - Read this NOW)
3. **`templates/docs/SHELL_SCRIPT_STANDARDS-template.md`** - Shell script standards (MANDATORY for all scripts)
4. **85% code coverage** minimum for all logic and branches
5. **Clear, factual language** - No hyperbole, no unsubstantiated claims
6. **Validate all cross-references** - Every link, import, and script reference must work
7. **Test all code paths** - Unit, integration, and end-to-end tests

### 🚨 THE IRON LAW OF DEPENDENCIES

**EVERY dependency MUST be added to `./scripts/setup-*.sh`**

This is **NOT optional**. This is an **ABSOLUTE REQUIREMENT**.

When you add a feature that requires a new dependency:
1. **STOP** - Do not proceed with implementation
2. Update `./scripts/setup-macos.sh` (and `setup-linux.sh` if applicable)
3. Add the dependency installation steps
4. **THEN** proceed with feature implementation
5. Commit setup script AND feature code together

Read `02-DEPENDENCY-MANAGEMENT.md` for complete details.
7. **Professional documentation** - Clear, accurate, helpful

**Writing Standards**:
- ❌ Avoid: "amazing", "revolutionary", "production-grade", "enterprise-ready"
- ✅ Use: Clear, factual statements with specific, measurable claims

**Quality Checklist**:
- [ ] All tests pass
- [ ] Code coverage ≥ 85%
- [ ] All hyperlinks validated
- [ ] Cross-browser tested
- [ ] Accessibility verified
- [ ] Documentation accurate and complete

---

## 📋 Prerequisites

Before starting, ensure:
- [ ] User has a GitHub account
- [ ] User has git installed locally
- [ ] User has decided on project name and description
- [ ] User has decided on workflow type (multi-phase or single-phase)
- [ ] You have read `05-QUALITY-STANDARDS.md`

---

## 🚀 Step-by-Step Process

### Phase 1: Gather Requirements (5-10 minutes)

**Your Task**: Ask the user for all required information.

**Questions to Ask**:

1. **Project Identity**:
   - "What is your project name? (e.g., 'one-pager-assistant')"
   - "What is the project title? (e.g., 'One-Pager Assistant')"
   - "What is a one-line description of your project?"
   - "What is your GitHub username?"
   - "What will the GitHub repository name be?"

2. **Workflow Configuration**:
   - "How many phases will your workflow have? (e.g., 2 for One-Pager, 3 for PRD)"
   - For each phase, ask:
     - "What is the name of phase X? (e.g., 'Initial Draft')"
     - "Which AI model will be used for phase X? (e.g., 'Claude Sonnet 4.5')"
     - "What is the purpose of phase X?"

3. **Architecture Choices**:
   - "Do you need a backend API? (yes/no)" [Default: no]
   - "Do you need desktop clients? (yes/no)" [Default: no]
   - "Do you want code coverage tracking with Codecov? (yes/no)" [Default: yes]
   - "Do you want pre-commit hooks? (yes/no)" [Default: yes]

4. **Deployment**:
   - "Where should the web app be deployed from? (docs/ or web/)" [Default: docs/]
   - "Do you want automatic deployment on push to main? (yes/no)" [Default: yes]

**Output**: Create a configuration summary and ask user to confirm.

---

### Phase 2: Validate Configuration (2-5 minutes)

**Your Task**: Verify all information is correct and complete.

**Validation Checks**:
- [ ] Project name is lowercase with hyphens (e.g., 'one-pager-assistant')
- [ ] GitHub username is valid
- [ ] Repository name doesn't conflict with existing repos
- [ ] Phase count is reasonable (1-5)
- [ ] All phase names are defined
- [ ] All AI models are specified
- [ ] Deployment folder is valid (docs/ or web/)

**If validation fails**: Ask user to correct the information.

**If validation passes**: Proceed to Phase 3.

---

### Phase 3: Create Project Structure (10-15 minutes)

**Your Task**: Generate the complete project structure from templates.

**Steps**:

1. **Create root directory**:
   ```bash
   mkdir {{PROJECT_NAME}}
   cd {{PROJECT_NAME}}
   ```

2. **Create directory structure**:
   ```bash
   mkdir -p docs/architecture docs/deployment docs/development
   mkdir -p scripts/lib
   mkdir -p prompts
   mkdir -p inputs outputs
   mkdir -p {{DEPLOY_FOLDER}}/js {{DEPLOY_FOLDER}}/css {{DEPLOY_FOLDER}}/data
   mkdir -p .github/workflows
   ```

3. **Process template files**:
   - Copy each file from `genesis/templates/`
   - Replace all `{{VARIABLES}}` with actual values
   - Remove `-template` suffix from filenames
   - Set correct file permissions (scripts should be executable)

4. **Create .gitignore**:
   - Copy from `genesis/templates/project-structure/gitignore-template`
   - Replace variables
   - Save as `.gitignore`

5. **Create .env.example**:
   - Copy from `genesis/templates/project-structure/.env.example-template`
   - Replace all variables ({{PROJECT_NAME}}, {{GITHUB_USER}}, etc.)
   - Save as `.env.example`
   - **IMPORTANT**: This file IS tracked in git (template for users)
   - **IMPORTANT**: Actual `.env` file is in .gitignore (never commit secrets)
   - Document in README how to set up: `cp .env.example .env`

6. **Create README.md**:
   - Copy from `genesis/templates/project-structure/README-template.md`
   - Replace all variables
   - Update badges with correct URLs
   - Save as `README.md`

6. **Create web app files**:
   - Process all files in `genesis/templates/web-app/`
   - Replace workflow-specific variables
   - Adjust for phase count
   - Save to `{{DEPLOY_FOLDER}}/`

7. **Create prompt templates**:
   - For each phase, create `prompts/phase{{N}}.txt`
   - Use examples from `genesis/examples/one-pager/prompts/` as reference
   - Customize for user's workflow

8. **Create scripts** (CRITICAL - Follow Shell Script Standards):
   - **⚠️ STUDY REFERENCE FIRST**: Review https://github.com/bordenet/product-requirements-assistant/tree/main/scripts
   - Process all files in `genesis/templates/scripts/`
   - **MANDATORY**: All scripts MUST follow `templates/docs/SHELL_SCRIPT_STANDARDS-template.md`
   - **MANDATORY**: Create `scripts/setup-macos.sh` from template (ALWAYS REQUIRED - NO EXCEPTIONS)
   - **MANDATORY**: Create `scripts/setup-linux.sh` if project supports Linux
   - **MANDATORY**: Create `scripts/deploy-web.sh` from template (for web apps)
   - **MANDATORY**: Create `scripts/lib/common.sh` from template (always required)
   - **MANDATORY**: Create `scripts/lib/compact.sh` from template (always required)
   - Make all `.sh` files executable: `chmod +x scripts/*.sh scripts/lib/*.sh`
   - Update dependency lists for user's architecture choices
   - Replace placeholders in `deploy-web.sh`: {{PROJECT_NAME}}, {{GITHUB_USER}}, {{GITHUB_REPO}}, {{GITHUB_PAGES_URL}}
   - **Verify**: All scripts include running timer (yellow on black, top-right corner)
   - **Verify**: All scripts support `-h|--help` with man-page style output
   - **Verify**: All scripts support `-v|--verbose` for detailed output
   - **Verify**: Default mode is compact (minimal vertical space)

9. **Create GitHub Actions workflows** (CRITICAL - Enforces Quality Gates):
   - Process files in `genesis/templates/github/workflows/`
   - **MANDATORY**: Create `ci-template.yml` → `.github/workflows/ci.yml`
   - **MANDATORY**: Create `lint-template.yml` → `.github/workflows/lint.yml`
   - These workflows enforce:
     - ShellCheck with zero warnings
     - JavaScript syntax validation
     - Shell script standards compliance (timer, help, verbose)
     - No TODO/FIXME comments
     - No console.log statements
   - Include only workflows needed (based on architecture flags)
   - Replace all `{{VARIABLES}}` with project values

10. **Create quality enforcement tools**:
    - **MANDATORY**: Create `scripts/validate.sh` from `templates/scripts/validate-template.sh`
    - **MANDATORY**: Create `scripts/validate-genesis-setup.sh` from `templates/scripts/validate-genesis-setup-template.sh`
    - **MANDATORY**: Create `scripts/install-hooks.sh` from `templates/scripts/install-hooks-template.sh`
    - Make executable: `chmod +x scripts/*.sh`
    - These tools enforce quality standards locally before commit

11. **Install git hooks automatically**:
    - **MANDATORY**: After git init, run `./scripts/install-hooks.sh` automatically
    - This installs pre-commit hooks that enforce quality gates
    - Verify hook is installed: `test -x .git/hooks/pre-commit`
    - If installation fails, document in setup output

12. **Create documentation**:
    - Process files in `genesis/templates/docs/`
    - Update architecture docs for user's choices
    - Create CLAUDE.md with project-specific guidance

**Validation**: After creating all files, verify:
- [ ] All template variables have been replaced
- [ ] No files still have `-template` suffix
- [ ] All scripts are executable
- [ ] Directory structure matches plan
- [ ] **MANDATORY**: Run `./scripts/validate-genesis-setup.sh` - must pass with zero errors
- [ ] **MANDATORY**: Run `./scripts/validate.sh` - must pass with zero errors
- [ ] **MANDATORY**: Run `shellcheck scripts/*.sh scripts/lib/*.sh` - must pass with zero warnings
- [ ] **MANDATORY**: Pre-commit hook is installed at `.git/hooks/pre-commit`
- [ ] **MANDATORY**: GitHub Actions workflows exist in `.github/workflows/`
- [ ] Test `scripts/setup-macos.sh` runs without errors
- [ ] Test web app loads in browser (if applicable)
- [ ] **RECOMMENDED**: Review `FIRST-RUN-CHECKLIST.md` and complete all items

---

### Phase 4: Initialize Git & GitHub (5-10 minutes)

**Your Task**: Set up version control and create GitHub repository.

**Steps**:

1. **Initialize git**:
   ```bash
   git init
   ```

2. **Install git hooks** (MANDATORY - Do this BEFORE first commit):
   ```bash
   ./scripts/install-hooks.sh
   ```
   - This installs pre-commit hooks that enforce quality gates
   - Hooks will run automatically on every commit
   - Verify installation: `test -x .git/hooks/pre-commit && echo "✅ Installed"`

3. **Make initial commit**:
   ```bash
   git add .
   git commit -m "Initial commit from Genesis template"
   ```
   - Pre-commit hook should run and pass
   - If hook fails, fix issues before committing

4. **Create GitHub repository**:
   ```bash
   gh repo create {{GITHUB_USER}}/{{PROJECT_NAME}} --public --source=. --remote=origin
   ```

5. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

6. **Verify**:
   - Check that repository exists on GitHub
   - Check that all files are present
   - Check that .gitignore is working (no ignored files committed)

---

### Phase 5: Setup GitHub Pages (5-10 minutes)

**Your Task**: Enable and configure GitHub Pages deployment.

**Steps**:

1. **Enable GitHub Pages via GitHub CLI**:
   ```bash
   gh api repos/{{GITHUB_USER}}/{{GITHUB_NAME}}/pages \
     -X POST \
     -f source[branch]=main \
     -f source[path]=/{{DEPLOY_FOLDER}}
   ```

2. **Wait for initial deployment** (1-2 minutes)

3. **Verify deployment**:
   - Visit: `https://{{GITHUB_USER}}.github.io/{{PROJECT_NAME}}/`
   - Should see the web app loading
   - Check browser console for errors

4. **If deployment fails**:
   - Check GitHub Actions tab for errors
   - Verify `{{DEPLOY_FOLDER}}/index.html` exists
   - Check file permissions
   - Review deployment logs

---

### Phase 6: Setup CI/CD (5-10 minutes)

**Your Task**: Configure continuous integration and deployment.

**Steps**:

1. **Add repository secrets** (if Codecov enabled):
   ```bash
   # User must provide Codecov token
   gh secret set CODECOV_TOKEN --body "{{CODECOV_TOKEN}}"
   ```

2. **Trigger first CI run**:
   ```bash
   git commit --allow-empty -m "Trigger CI"
   git push
   ```

3. **Monitor CI pipeline**:
   - Check GitHub Actions tab
   - Verify all jobs pass
   - Check coverage upload (if enabled)

4. **Enable branch protection** (optional but recommended):
   ```bash
   gh api repos/{{GITHUB_USER}}/{{PROJECT_NAME}}/branches/main/protection \
     -X PUT \
     -f required_status_checks[strict]=true \
     -f required_status_checks[contexts][]=CI
   ```

---

### Phase 7: Final Validation (5-10 minutes)

**Your Task**: Verify everything works end-to-end.

**Validation Checklist**:
- [ ] Web app loads at GitHub Pages URL
- [ ] Can create a new project in the web app
- [ ] Can complete workflow (all phases)
- [ ] Data persists in IndexedDB
- [ ] Export/import works
- [ ] Dark mode toggle works
- [ ] All links in README work
- [ ] CI pipeline is green
- [ ] No console errors in browser

**If any check fails**: Debug and fix before declaring success.

---

## 🧪 AI Integration Testing (If Applicable)

**CRITICAL FEATURE**: If the project integrates with external LLMs (OpenAI, Anthropic, etc.), implement mock responses for testing.

**Purpose**:
- Enable end-to-end testing without API costs
- Ensure consistent test results
- Allow offline development
- Validate error handling

**Implementation Steps**:

1. **Create mock configuration**:
   ```javascript
   // config.js
   export const AI_CONFIG = {
     mode: process.env.AI_MODE || 'live', // 'live' or 'mock'
     mockResponses: {
       phase1: 'Mock response for phase 1 testing...',
       phase2: 'Mock response for phase 2 testing...'
     }
   };
   ```

2. **Implement mock client**:
   ```javascript
   // ai-client.js
   export async function callAI(prompt, phase) {
     if (AI_CONFIG.mode === 'mock') {
       console.log('[MOCK MODE] Returning mock response for', phase);
       return AI_CONFIG.mockResponses[phase];
     }

     // Real API call
     return await fetch(API_ENDPOINT, { ... });
   }
   ```

3. **Document clearly**:
   - Add section to README explaining mock mode
   - Mark as "FOR TESTING ONLY" in documentation
   - Provide instructions to enable/disable
   - Explain limitations

4. **Test both modes**:
   - Verify mock mode works end-to-end
   - Verify live mode works (if API key available)
   - Verify mode switching works correctly

**Documentation Template**:
```markdown
## Testing Mode

For testing without API costs, enable mock mode:

```bash
export AI_MODE=mock
```

This returns predefined responses for each workflow phase. **This is for testing only** and does not call real AI models.

To use real AI models, set `AI_MODE=live` or leave unset.
```

---

## 🔄 Ongoing Development - MANDATORY RULES

**CRITICAL**: After the initial project is created, these rules apply to ALL future development.

### Rule 1: The Iron Law of Dependencies

**EVERY time you add a dependency, you MUST update `./scripts/setup-*.sh`**

#### Workflow for Adding Dependencies:

1. **User asks for a feature** (e.g., "Add PDF export")
2. **You identify dependency needed** (e.g., `jspdf` npm package)
3. **STOP - Do not implement yet**
4. **Tell user**: "This requires the jspdf package. I will add it to package.json and update scripts/setup-macos.sh."
5. **Update package file**: Add to `package.json` (or `requirements.txt`, etc.)
6. **Update setup script**: Add installation to `scripts/setup-macos.sh`
7. **Show both changes to user**
8. **THEN implement the feature**
9. **Commit package file AND setup script together**

#### Example Dialogue:

```
User: "Add support for exporting to PDF"

AI: "PDF export requires the jspdf library. I will:
     1. Add jspdf to package.json
     2. Update scripts/setup-macos.sh to install it
     3. Implement the PDF export feature"

AI: [Shows package.json changes]
AI: [Shows setup-macos.sh changes]
AI: "Setup script updated. New developers can run
     ./scripts/setup-macos.sh to get all dependencies."

AI: [Implements PDF export feature]
```

#### What Counts as a Dependency:

- ✅ npm/pip/gem packages
- ✅ System packages (Homebrew, apt, etc.)
- ✅ Command-line tools
- ✅ Database servers
- ✅ Runtime environments
- ✅ Development tools (linters, formatters)
- ✅ **ANYTHING not in the repository that the project needs**

#### Verification:

Before committing code that uses a new dependency:
- [ ] Dependency added to package file
- [ ] **`./scripts/setup-macos.sh` updated**
- [ ] **`./scripts/setup-linux.sh` updated (if project supports Linux)**
- [ ] Setup script tested
- [ ] Both files committed together

**Read `02-DEPENDENCY-MANAGEMENT.md` for complete details.**

### Rule 2: Quality Gates Always Apply

Every commit must pass:
- [ ] ShellCheck (zero warnings)
- [ ] JavaScript syntax validation
- [ ] Shell script standards (timer, help, verbose)
- [ ] No TODO/FIXME comments
- [ ] No console.log statements
- [ ] Pre-commit hook passes
- [ ] CI/CD pipeline passes

### Rule 3: Test Before Committing

- [ ] Run `./scripts/validate.sh` - must pass
- [ ] Run `shellcheck scripts/*.sh scripts/lib/*.sh` - must pass
- [ ] Test the feature works
- [ ] Test setup script on clean environment (if dependencies changed)

---

## ✅ Success Criteria

Project is complete when:
1. ✅ All files created from templates
2. ✅ All variables replaced
3. ✅ Git repository initialized
4. ✅ GitHub repository created and pushed
5. ✅ GitHub Pages deployed and accessible
6. ✅ CI/CD pipeline passing
7. ✅ Web app fully functional
8. ✅ All validation checks pass
9. ✅ Code coverage ≥ 85% (if applicable)
10. ✅ All hyperlinks validated
11. ✅ Professional documentation standards met
12. ✅ AI mock mode implemented (if using external LLMs)
13. ✅ **Shell scripts follow standards** (timer, help, verbose mode)
14. ✅ **`scripts/setup-macos.sh` created and tested**
15. ✅ **`scripts/deploy-web.sh` created and tested** (for web apps)
16. ✅ **All scripts pass shellcheck with zero warnings**

---

## 📚 Reference Documents

Read these before starting:
1. `00-GENESIS-PLAN.md` - Understand the system architecture
2. `05-QUALITY-STANDARDS.md` - Professional quality standards (MANDATORY)
3. `templates/docs/SHELL_SCRIPT_STANDARDS-template.md` - Shell script standards (MANDATORY)
4. `integration/DEVELOPMENT_PROTOCOLS.md` - AI development protocols
5. `integration/PROJECT_SETUP_CHECKLIST.md` - Detailed setup steps
6. `examples/one-pager/README.md` - Example implementation

**Shell Script References**:
- ⭐ **[product-requirements-assistant/scripts/](https://github.com/bordenet/product-requirements-assistant/tree/main/scripts)** - PRIMARY REFERENCE for all scripts
  - [deploy-web.sh](https://github.com/bordenet/product-requirements-assistant/blob/main/scripts/deploy-web.sh) - Deployment script with proper compact mode
  - [setup-macos.sh](https://github.com/bordenet/product-requirements-assistant/blob/main/scripts/setup-macos.sh) - macOS setup script
  - [setup-linux.sh](https://github.com/bordenet/product-requirements-assistant/blob/main/scripts/setup-linux.sh) - Linux setup script
  - [setup-windows-wsl.sh](https://github.com/bordenet/product-requirements-assistant/blob/main/scripts/setup-windows-wsl.sh) - Windows WSL setup script
- [bu.sh](https://github.com/bordenet/scripts/blob/main/bu.sh) - Reference implementation for shell script standards

---

## 🆘 Troubleshooting

**Problem**: Template variables not replaced  
**Solution**: Search for `{{` in all files, replace manually

**Problem**: GitHub Pages shows 404  
**Solution**: Check Settings → Pages, verify source is correct

**Problem**: CI pipeline fails  
**Solution**: Check `.github/workflows/` files, verify syntax

**Problem**: Web app blank page  
**Solution**: Check browser console, verify all JS files loaded

---

**Ready to begin? Start with Phase 1: Gather Requirements!** 🚀

