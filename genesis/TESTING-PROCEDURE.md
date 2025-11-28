# Genesis Testing Procedure

**Purpose**: Ensure Genesis templates are complete and functional before declaring production-ready

**When to Run**: Before any major release, after significant changes, or when user feedback suggests issues

---

## Quick Test (5 minutes)

### 1. Run Verification Script

```bash
./genesis/scripts/verify-templates.sh
```

**Expected**: All checks pass (or only warnings for optional files)

**What it checks**:
- All template files are referenced in START-HERE.md
- No broken references in START-HERE.md
- Workflow files exist for badge references
- .nojekyll file creation is documented

### 2. Run End-to-End Test

```bash
./genesis/scripts/test-genesis.sh
```

**Expected**: All critical files present

**What it checks**:
- Simulates AI following START-HERE.md
- Copies all mandatory files
- Verifies 13 critical files exist

---

## Full Test (30 minutes)

### 1. Create Real Test Project

```bash
# Create new directory
mkdir -p /tmp/genesis-full-test
cd /tmp/genesis-full-test

# Copy Genesis
cp -r /path/to/genesis .

# Follow START-HERE.md EXACTLY as written
# (Open START-HERE.md and execute each step)
```

### 2. Replace Template Variables

Replace all `{{VARIABLES}}` with test values:
- `{{PROJECT_NAME}}` → "genesis-test"
- `{{PROJECT_TITLE}}` → "Genesis Test"
- `{{PROJECT_DESCRIPTION}}` → "Test project from Genesis"
- `{{GITHUB_USER}}` → your GitHub username
- `{{GITHUB_REPO}}` → "genesis-test"
- `{{GITHUB_PAGES_URL}}` → "https://USERNAME.github.io/genesis-test/"
- `{{HEADER_EMOJI}}` → "🧪"
- `{{FAVICON_EMOJI}}` → "🧪"
- `{{DEPLOY_FOLDER}}` → "."

### 3. Install Dependencies

```bash
npm install
```

**Expected**: No errors

### 4. Run Linting

```bash
npm run lint
```

**Expected**: No errors (or only errors in template variables not yet replaced)

### 5. Run Tests

```bash
npm test
```

**Expected**: All tests pass

### 6. Check Coverage

```bash
npm run test:coverage
```

**Expected**: Coverage ≥70%

### 7. Verify File Structure

```bash
find . -type f -not -path "*/node_modules/*" -not -path "*/genesis/*" -not -path "*/.git/*" | sort
```

**Expected files**:
- `.eslintrc.json`
- `.gitignore`
- `.github/workflows/ci.yml`
- `.nojekyll`
- `CLAUDE.md`
- `README.md`
- `REVERSE-INTEGRATION-NOTES.md`
- `codecov.yml`
- `css/styles.css`
- `index.html`
- `jest.config.js`
- `jest.setup.js`
- `js/ai-mock.js`
- `js/ai-mock-ui.js`
- `js/app.js`
- `js/storage.js`
- `js/workflow.js`
- `package.json`
- `prompts/phase1.md`
- `prompts/phase2.md`
- `prompts/phase3.md`
- `scripts/deploy-web.sh`
- `scripts/install-hooks.sh`
- `scripts/lib/common.sh`
- `scripts/lib/compact.sh`
- `scripts/setup-macos.sh`
- `templates/document-template.md`
- `tests/ai-mock.test.js`
- `tests/storage.test.js`
- `tests/workflow.test.js`

### 8. Test in Browser

```bash
open index.html
```

**Expected**:
- Page loads without errors
- Dark mode toggle works
- No console errors
- All UI elements visible

### 9. Push to GitHub (Optional)

```bash
git init
git add .
git commit -m "Test project from Genesis"
gh repo create genesis-test --public --source=. --remote=origin --push
```

### 10. Enable GitHub Pages

1. Go to: https://github.com/USERNAME/genesis-test/settings/pages
2. Source: GitHub Actions
3. Save
4. Wait 2 minutes
5. Visit: https://USERNAME.github.io/genesis-test/

**Expected**:
- Site loads correctly
- All features work
- No 404 errors
- Badges show (may be "unknown" until first workflow run)

### 11. Verify CI/CD Workflow

1. Make a small change
2. Push to GitHub
3. Go to Actions tab
4. Verify workflow runs successfully

**Expected**:
- Lint job passes
- Test job passes (if not removed)
- Deploy job passes
- Site updates automatically

---

## Checklist

Use this checklist for full testing:

- [ ] Verification script passes
- [ ] End-to-end test passes
- [ ] Created real test project
- [ ] Replaced all template variables
- [ ] Dependencies installed successfully
- [ ] Linting passes
- [ ] Tests pass
- [ ] Coverage ≥70%
- [ ] All expected files present
- [ ] Page loads in browser
- [ ] Dark mode works
- [ ] No console errors
- [ ] Pushed to GitHub (optional)
- [ ] GitHub Pages enabled (optional)
- [ ] Site loads on GitHub Pages (optional)
- [ ] CI/CD workflow runs successfully (optional)

---

## Common Issues

### Issue: npm install fails

**Cause**: package.json has template variables  
**Fix**: Replace all `{{VARIABLES}}` in package.json

### Issue: Linting fails

**Cause**: Template variables in JS files  
**Fix**: Replace all `{{PROJECT_NAME}}` in JS files

### Issue: Tests fail

**Cause**: Template variables in test files  
**Fix**: Replace all `{{PROJECT_NAME}}` in test files

### Issue: Workflow fails

**Cause**: {{DEPLOY_FOLDER}} not replaced in ci.yml  
**Fix**: Replace with "." or "docs" in .github/workflows/ci.yml

### Issue: Badges show "unknown"

**Cause**: Workflow hasn't run yet  
**Fix**: Push a commit to trigger workflow, or wait for first run

---

## Automation

To automate testing, run:

```bash
# Quick test (5 minutes)
./genesis/scripts/verify-templates.sh && ./genesis/scripts/test-genesis.sh

# Full test requires manual steps (GitHub setup, etc.)
```

---

## Frequency

- **Before major release**: Full test
- **After significant changes**: Full test
- **Weekly**: Quick test
- **After user feedback**: Full test

---

## Success Criteria

Genesis is production-ready when:
- ✅ Verification script passes
- ✅ End-to-end test passes
- ✅ Full test completes without errors
- ✅ Test project deploys to GitHub Pages successfully
- ✅ All badges work
- ✅ CI/CD workflow runs successfully
- ✅ No user-reported issues for 1 week


