# Genesis Troubleshooting Guide

Common issues when creating projects from Genesis templates and how to fix them.

---

## Table of Contents

1. [Template Variables Not Replaced](#template-variables-not-replaced)
2. [Badges Show "Unknown"](#badges-show-unknown)
3. [GitHub Actions Workflow Fails](#github-actions-workflow-fails)
4. [npm install Fails](#npm-install-fails)
5. [Linting Errors](#linting-errors)
6. [Tests Fail](#tests-fail)
7. [Dark Mode Doesn't Work](#dark-mode-doesnt-work)
8. [GitHub Pages 404 Error](#github-pages-404-error)
9. [Missing Files](#missing-files)
10. [Deployment Script Fails](#deployment-script-fails)

---

## Template Variables Not Replaced

### Symptoms
- Files contain `{{PROJECT_NAME}}` or other `{{VARIABLES}}`
- npm commands fail with syntax errors
- Linting shows errors in template syntax

### Cause
Forgot to replace template variables with actual values

### Solution

1. **Find all unreplaced variables**:
   ```bash
   grep -r "{{" . --exclude-dir=node_modules --exclude-dir=genesis
   ```

2. **Replace each variable**:
   - `{{PROJECT_NAME}}` → your project name (e.g., "my-app")
   - `{{PROJECT_TITLE}}` → your project title (e.g., "My App")
   - `{{PROJECT_DESCRIPTION}}` → your description
   - `{{GITHUB_USER}}` → your GitHub username
   - `{{GITHUB_REPO}}` → your repository name
   - `{{GITHUB_PAGES_URL}}` → https://USERNAME.github.io/REPO/
   - `{{HEADER_EMOJI}}` → emoji for header (e.g., "🚀")
   - `{{FAVICON_EMOJI}}` → emoji for favicon (e.g., "🚀")
   - `{{DEPLOY_FOLDER}}` → "." for root or "docs" for docs folder

3. **Verify all replaced**:
   ```bash
   grep -r "{{" . --exclude-dir=node_modules --exclude-dir=genesis
   # Should return NO results
   ```

---

## Badges Show "Unknown"

### Symptoms
- README badges show "unknown" or "no status"
- Clicking badge shows 404 error

### Cause
GitHub Actions workflow hasn't run yet, or workflow file is missing

### Solution

1. **Verify workflow file exists**:
   ```bash
   ls -la .github/workflows/ci.yml
   ```

2. **If missing, copy from template**:
   ```bash
   mkdir -p .github/workflows
   cp genesis/templates/github/workflows/ci-template.yml .github/workflows/ci.yml
   ```

3. **Replace {{DEPLOY_FOLDER}} in ci.yml**:
   ```bash
   # Change line 105: path: '{{DEPLOY_FOLDER}}'
   # To: path: '.'  (for root deployment)
   ```

4. **Push to GitHub to trigger workflow**:
   ```bash
   git add .github/workflows/ci.yml
   git commit -m "Add CI/CD workflow"
   git push
   ```

5. **Wait 2-3 minutes** for workflow to run

6. **Check Actions tab**: https://github.com/USERNAME/REPO/actions

---

## GitHub Actions Workflow Fails

### Symptoms
- Workflow shows red X in Actions tab
- Deployment doesn't happen automatically

### Common Causes & Solutions

#### Cause 1: GitHub Pages not configured correctly

**Solution**:
1. Go to: https://github.com/USERNAME/REPO/settings/pages
2. Source: **GitHub Actions** (NOT "Deploy from a branch")
3. Save

#### Cause 2: {{DEPLOY_FOLDER}} not replaced

**Solution**:
```bash
# Edit .github/workflows/ci.yml
# Line 105: path: '{{DEPLOY_FOLDER}}'
# Change to: path: '.'
```

#### Cause 3: Test job removed but coverage job still references it

**Solution**:
```bash
# Edit .github/workflows/ci.yml
# If you removed the test job (lines 32-56), also remove the coverage job (lines 58-85)
```

#### Cause 4: Missing CODECOV_TOKEN secret

**Solution**:
- Either remove the coverage job from ci.yml
- Or add CODECOV_TOKEN to repository secrets

---

## npm install Fails

### Symptoms
- `npm install` shows errors
- Dependencies don't install

### Cause
Template variables in package.json not replaced

### Solution

1. **Check package.json**:
   ```bash
   grep "{{" package.json
   ```

2. **Replace all variables**:
   - `{{PROJECT_NAME}}` → "my-app"
   - `{{PROJECT_DESCRIPTION}}` → "My app description"
   - `{{GITHUB_USER}}` → your username
   - `{{GITHUB_REPO}}` → your repo name
   - `{{GITHUB_PAGES_URL}}` → https://USERNAME.github.io/REPO/

3. **Try again**:
   ```bash
   npm install
   ```

---

## Linting Errors

### Symptoms
- `npm run lint` shows errors
- Pre-commit hook blocks commits

### Common Causes & Solutions

#### Cause 1: Template variables in JS files

**Solution**:
```bash
# Find all {{VARIABLES}} in JS files
grep -r "{{PROJECT_NAME}}" js/ tests/

# Replace with actual project name
```

#### Cause 2: Syntax errors in customized code

**Solution**:
```bash
# Run linter with auto-fix
npm run lint -- --fix

# Check remaining errors
npm run lint
```

---

## Tests Fail

### Symptoms
- `npm test` shows failures
- Coverage below threshold

### Common Causes & Solutions

#### Cause 1: Template variables in test files

**Solution**:
```bash
grep "{{PROJECT_NAME}}" tests/
# Replace all occurrences with actual project name
```

#### Cause 2: Tests not customized for your workflow

**Solution**:
```bash
# Edit tests/workflow.test.js
# Update test cases to match your actual workflow phases and form fields
```

#### Cause 3: Missing test dependencies

**Solution**:
```bash
npm install
```

---

## Dark Mode Doesn't Work

### Symptoms
- Dark mode toggle button doesn't change theme
- Theme stuck in light or dark mode

### Cause
Missing Tailwind dark mode configuration

### Solution

1. **Check index.html** (lines 10-18):
   ```html
   <script>
       tailwind.config = {
           darkMode: 'class'
       }
   </script>
   ```

2. **If missing, add after Tailwind CDN**:
   ```html
   <script src="https://cdn.tailwindcss.com"></script>
   <script>
       tailwind.config = {
           darkMode: 'class'
       }
   </script>
   ```

---

## GitHub Pages 404 Error

### Symptoms
- Site shows 404 Not Found
- https://USERNAME.github.io/REPO/ doesn't load

### Common Causes & Solutions

#### Cause 1: GitHub Pages not enabled

**Solution**:
1. Go to: https://github.com/USERNAME/REPO/settings/pages
2. Source: GitHub Actions
3. Save
4. Wait 2 minutes

#### Cause 2: index.html not in root

**Solution**:
```bash
ls -la index.html
# Should exist in root directory
```

#### Cause 3: Workflow hasn't run yet

**Solution**:
1. Go to: https://github.com/USERNAME/REPO/actions
2. Check if workflow ran successfully
3. If not, push a commit to trigger it

---

## Missing Files

### Symptoms
- Reference errors in console
- 404 errors for CSS/JS files
- Features don't work

### Solution

Run verification:
```bash
# Check critical files
ls -la .gitignore CLAUDE.md README.md package.json .eslintrc.json
ls -la .github/workflows/ci.yml
ls -la index.html css/styles.css .nojekyll
ls -la js/app.js js/workflow.js js/storage.js
ls -la tests/ai-mock.test.js prompts/phase1.md
ls -la scripts/deploy-web.sh scripts/install-hooks.sh
```

If any missing, copy from Genesis templates:
```bash
cp genesis/templates/PATH/TO/FILE-template DESTINATION
```

---

## Deployment Script Fails

### Symptoms
- `./scripts/deploy-web.sh` shows errors
- Deployment doesn't complete

### Common Causes & Solutions

#### Cause 1: Script not executable

**Solution**:
```bash
chmod +x scripts/*.sh scripts/lib/*.sh
```

#### Cause 2: Template variables not replaced

**Solution**:
```bash
grep "{{" scripts/deploy-web.sh
# Replace all variables with actual values
```

#### Cause 3: Linting or tests failing

**Solution**:
```bash
# Fix linting errors
npm run lint -- --fix

# Fix test failures
npm test

# Then try deployment again
./scripts/deploy-web.sh
```

---

## Still Having Issues?

1. **Check Genesis documentation**:
   - `genesis/START-HERE.md`
   - `genesis/AI-EXECUTION-CHECKLIST.md`
   - `genesis/TESTING-PROCEDURE.md`

2. **Compare with reference implementations**:
   - [one-pager](https://github.com/bordenet/one-pager)
   - [product-requirements-assistant](https://github.com/bordenet/product-requirements-assistant)

3. **Run verification scripts**:
   ```bash
   ./genesis/scripts/verify-templates.sh
   ./genesis/scripts/test-genesis.sh
   ```

4. **Create an issue**: Document the problem with steps to reproduce


