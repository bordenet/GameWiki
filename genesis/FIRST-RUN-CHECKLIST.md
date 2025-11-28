# Genesis First Run Checklist

**Purpose**: Ensure your new Genesis-based project is properly configured and ready for development.

**When to use**: Run this checklist immediately after creating a new project from Genesis templates.

---

## ✅ Pre-Flight Checks

### 1. Template Variables Replaced
- [ ] Search for `{{` in all files - should return zero results
- [ ] Check README.md has your actual project name (not `{{PROJECT_NAME}}`)
- [ ] Check package.json has your actual project name
- [ ] Check all workflow files in `.github/workflows/` have correct repo URLs

**How to verify**:
```bash
# Should return nothing
grep -r "{{" . --exclude-dir=node_modules --exclude-dir=.git
```

---

### 2. Git Hooks Installed
- [ ] Pre-commit hook exists at `.git/hooks/pre-commit`
- [ ] Pre-commit hook is executable
- [ ] Hook runs linting before commits

**How to verify**:
```bash
# Should show the pre-commit hook
ls -la .git/hooks/pre-commit

# Should be executable (shows 'x' in permissions)
test -x .git/hooks/pre-commit && echo "✅ Executable" || echo "❌ Not executable"
```

**How to fix**:
```bash
./scripts/install-hooks.sh
```

---

### 3. Dependencies Installed
- [ ] `node_modules/` directory exists
- [ ] All npm packages installed successfully
- [ ] No security vulnerabilities in dependencies

**How to verify**:
```bash
npm install
npm audit
```

---

### 4. Tests Pass
- [ ] All tests run successfully
- [ ] Code coverage meets threshold (70%+)
- [ ] No failing tests

**How to verify**:
```bash
npm test
```

---

### 5. Linting Passes
- [ ] ESLint runs without errors
- [ ] No console.log statements in production code
- [ ] Code follows style guidelines

**How to verify**:
```bash
npm run lint
```

---

### 6. Scripts Are Executable
- [ ] All `.sh` files in `scripts/` are executable
- [ ] Scripts run without errors
- [ ] Scripts show help with `-h` flag

**How to verify**:
```bash
# Check permissions
ls -la scripts/*.sh

# Make executable if needed
chmod +x scripts/*.sh scripts/lib/*.sh

# Test help output
./scripts/setup-macos.sh -h
```

---

### 7. GitHub Actions Configured
- [ ] `.github/workflows/` directory exists
- [ ] CI workflow file exists
- [ ] Workflow files have correct repository references

**How to verify**:
```bash
ls -la .github/workflows/
cat .github/workflows/tests.yml | grep -E "github.com|repository"
```

---

### 8. Documentation Complete
- [ ] README.md is complete and accurate
- [ ] CLAUDE.md exists with project-specific guidance
- [ ] All links in documentation work

**How to verify**:
```bash
# Check for broken links (requires npm package)
npm run validate:links  # if available
```

---

### 9. Environment Configuration
- [ ] `.env.example` exists
- [ ] `.env` file created from `.env.example`
- [ ] `.env` is in `.gitignore`
- [ ] All required environment variables documented

**How to verify**:
```bash
# Should exist
test -f .env.example && echo "✅ .env.example exists"

# Should NOT be tracked
git check-ignore .env && echo "✅ .env is ignored" || echo "❌ .env will be committed!"
```

**How to fix**:
```bash
cp .env.example .env
```

---

### 10. Web App Loads
- [ ] Web app opens in browser
- [ ] No console errors
- [ ] All features work as expected
- [ ] Dark mode toggle works

**How to verify**:
```bash
# Open in browser (macOS)
open docs/index.html

# Or use a local server
npx http-server docs/
```

---

## 🚨 Common Issues

### Issue: Template variables still present
**Symptom**: Files contain `{{PROJECT_NAME}}` or similar
**Fix**: Re-run template processing or manually replace variables

### Issue: Pre-commit hook not running
**Symptom**: Commits succeed even with linting errors
**Fix**: Run `./scripts/install-hooks.sh`

### Issue: Tests fail on first run
**Symptom**: `npm test` shows failures
**Fix**: Check that all dependencies are installed: `npm install`

### Issue: Scripts not executable
**Symptom**: `./scripts/setup-macos.sh` shows "Permission denied"
**Fix**: `chmod +x scripts/*.sh scripts/lib/*.sh`

---

## ✅ Success Criteria

Your project is ready when:
- ✅ All checklist items above are complete
- ✅ `npm test` passes with 70%+ coverage
- ✅ `npm run lint` passes with zero errors
- ✅ Pre-commit hook blocks commits with linting errors
- ✅ Web app loads without console errors
- ✅ All documentation links work

---

## 📝 Next Steps

After completing this checklist:

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Initial commit from Genesis"
   ```

2. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

3. **Enable GitHub Pages** (if applicable):
   - Go to repo Settings → Pages
   - Source: Deploy from branch
   - Branch: `main`, Folder: `/docs`

4. **Start development**:
   - Read `CLAUDE.md` for AI assistant guidance
   - Review `02-QUICK-START.md` for development workflow
   - Check `05-QUALITY-STANDARDS.md` for quality requirements

