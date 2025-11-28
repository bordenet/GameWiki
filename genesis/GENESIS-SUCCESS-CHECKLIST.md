# Genesis Success Checklist

**Purpose**: Ensure AI assistants create high-quality projects from Genesis templates.

**Audience**: AI assistants (Claude, GPT-4, etc.) creating new projects from Genesis.

---

## 🎯 Success Criteria

A Genesis-based project is successful when:
- ✅ All tests pass with 70%+ coverage
- ✅ All linting passes with zero errors
- ✅ Pre-commit hooks are installed and working
- ✅ GitHub Actions CI/CD passes
- ✅ Web app loads without console errors
- ✅ All documentation is accurate and complete
- ✅ No template variables remain (`{{...}}`)

---

## ✅ Phase-by-Phase Checklist

### Phase 1: Requirements Gathering
- [ ] Asked all required questions from `01-AI-INSTRUCTIONS.md`
- [ ] Validated project name format (lowercase-with-hyphens)
- [ ] Confirmed GitHub username and repository name
- [ ] Documented all phase names and AI models
- [ ] Got user confirmation on configuration

### Phase 2: Project Structure
- [ ] Created all required directories
- [ ] Processed all template files
- [ ] Replaced ALL `{{VARIABLES}}` with actual values
- [ ] Removed `-template` suffix from all filenames
- [ ] Made all `.sh` files executable (`chmod +x`)
- [ ] Created `.gitignore` with correct patterns
- [ ] Created `.env.example` (tracked) and documented `.env` setup

### Phase 3: Quality Tools
- [ ] Created `scripts/validate-genesis-setup.sh` from template
- [ ] Created `scripts/validate.sh` from template
- [ ] Created `scripts/install-hooks.sh` from template
- [ ] Created `.github/workflows/tests.yml` from template
- [ ] Created `.github/workflows/lint.yml` if applicable
- [ ] All scripts follow Shell Script Standards (timer, help, verbose)

### Phase 4: Git Setup
- [ ] Ran `git init`
- [ ] Ran `./scripts/install-hooks.sh` BEFORE first commit
- [ ] Verified hook installed: `test -x .git/hooks/pre-commit`
- [ ] Made initial commit (pre-commit hook should run)
- [ ] Created GitHub repository
- [ ] Pushed to GitHub

### Phase 5: Testing & Validation
- [ ] Ran `./scripts/validate-genesis-setup.sh` - passed
- [ ] Ran `npm install` - no errors
- [ ] Ran `npm test` - all tests pass
- [ ] Ran `npm run lint` - zero errors
- [ ] Checked code coverage ≥ 70%
- [ ] Opened web app in browser - no console errors
- [ ] Tested dark mode toggle
- [ ] Verified all features work

### Phase 6: CI/CD
- [ ] GitHub Actions workflow exists
- [ ] First push triggered CI/CD
- [ ] CI/CD pipeline passed
- [ ] Coverage report uploaded (if Codecov enabled)

### Phase 7: Documentation
- [ ] README.md is complete and accurate
- [ ] CLAUDE.md exists with project-specific guidance
- [ ] All links in documentation work
- [ ] No broken cross-references
- [ ] FIRST-RUN-CHECKLIST.md is available for users

---

## 🚨 Common Pitfalls to Avoid

### 1. Template Variables Not Replaced
**Problem**: Files still contain `{{PROJECT_NAME}}` or similar
**Prevention**: Run `grep -r "{{" . --exclude-dir=node_modules --exclude-dir=.git` before committing
**Fix**: Manually replace all remaining variables

### 2. Pre-commit Hooks Not Installed
**Problem**: Commits succeed even with linting errors
**Prevention**: Run `./scripts/install-hooks.sh` immediately after `git init`
**Fix**: Run the install script and verify with `test -x .git/hooks/pre-commit`

### 3. Scripts Not Executable
**Problem**: `./scripts/setup-macos.sh` shows "Permission denied"
**Prevention**: Run `chmod +x scripts/*.sh scripts/lib/*.sh` after creating scripts
**Fix**: Same as prevention

### 4. Missing Dependencies in Setup Script
**Problem**: Features work locally but fail for others
**Prevention**: Follow THE IRON LAW - add ALL dependencies to `scripts/setup-*.sh`
**Fix**: Update setup scripts with missing dependencies

### 5. Low Test Coverage
**Problem**: Coverage below 70% threshold
**Prevention**: Write tests as you create features
**Fix**: Add tests for uncovered code paths

### 6. Console Errors in Web App
**Problem**: Browser console shows errors when app loads
**Prevention**: Test in browser before committing
**Fix**: Debug and fix all console errors

### 7. Broken Links in Documentation
**Problem**: README links to non-existent files
**Prevention**: Validate all links before committing
**Fix**: Update or remove broken links

### 8. .env File Committed
**Problem**: Secrets accidentally committed to git
**Prevention**: Ensure `.env` is in `.gitignore` BEFORE creating it
**Fix**: Remove from git history, rotate secrets

---

## 📊 Quality Metrics

Track these metrics for every Genesis project:

| Metric | Target | How to Check |
|--------|--------|--------------|
| Test Coverage | ≥ 70% | `npm test -- --coverage` |
| Linting Errors | 0 | `npm run lint` |
| Console Errors | 0 | Open app in browser, check console |
| Broken Links | 0 | Manual review or link checker |
| Template Variables | 0 | `grep -r "{{" .` |
| CI/CD Status | ✅ Pass | Check GitHub Actions |

---

## 🎓 Learning from Past Projects

### What Works Well
- Following `01-AI-INSTRUCTIONS.md` step-by-step
- Installing hooks BEFORE first commit
- Testing in browser frequently during development
- Writing tests alongside features
- Using reference implementations as examples

### What Causes Problems
- Skipping validation steps
- Not testing in browser until the end
- Forgetting to make scripts executable
- Not following Shell Script Standards
- Removing critical configuration (coverage thresholds, etc.)

---

## ✅ Final Verification

Before declaring the project complete:

1. **Run all validation scripts**:
   ```bash
   ./scripts/validate-genesis-setup.sh
   ./scripts/validate.sh
   npm test
   npm run lint
   ```

2. **Test in browser**:
   - Open `docs/index.html` (or appropriate file)
   - Check console for errors
   - Test all features
   - Test dark mode

3. **Verify GitHub setup**:
   - Repository exists and is public
   - GitHub Actions ran and passed
   - README displays correctly
   - GitHub Pages is enabled (if applicable)

4. **Review with user**:
   - Show them the working app
   - Walk through key features
   - Explain how to make changes
   - Point them to `FIRST-RUN-CHECKLIST.md`

---

## 📝 Handoff to User

When complete, tell the user:

1. **What was created**: Brief overview of the project
2. **How to access it**: URL for GitHub Pages (if applicable)
3. **Next steps**: Point to `FIRST-RUN-CHECKLIST.md` and `CLAUDE.md`
4. **How to get help**: Reference documentation and troubleshooting guides

**Template message**:
```
✅ Your project is ready!

📦 Repository: https://github.com/{user}/{repo}
🌐 Live App: https://{user}.github.io/{repo}/
📋 Next Steps: Review FIRST-RUN-CHECKLIST.md
🤖 AI Guidance: See CLAUDE.md for working with AI assistants

All tests pass (X% coverage), linting is clean, and CI/CD is configured.
```

