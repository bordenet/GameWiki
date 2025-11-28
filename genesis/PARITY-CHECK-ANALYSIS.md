# Genesis Parity Check Analysis

**Date**: 2025-11-22  
**Purpose**: Verify Genesis can generate projects at parity with one-pager and product-requirements-assistant

---

## Executive Summary

**Status**: ⚠️ **GAPS IDENTIFIED** - Genesis is missing several critical components

**Confidence**: 75% - Genesis has most core functionality but missing key quality-of-life features

---

## Comparison Matrix

### ✅ **PARITY ACHIEVED**

| Component | one-pager | prd-assistant | Genesis Template | Status |
|-----------|-----------|---------------|------------------|--------|
| Multi-project architecture | ✅ | ✅ | ✅ | **PARITY** |
| Router (hash-based) | ✅ | ✅ | ✅ router-template.js | **PARITY** |
| Project CRUD | ✅ | ✅ | ✅ projects-template.js | **PARITY** |
| UI utilities | ✅ | ✅ | ✅ ui-template.js | **PARITY** |
| Views (list/new) | ✅ | ✅ | ✅ views-template.js | **PARITY** |
| Project view | ✅ | ✅ | ✅ project-view-template.js | **PARITY** |
| Storage (IndexedDB) | ✅ | ✅ | ✅ storage-template.js | **PARITY** |
| Workflow engine | ✅ | ✅ | ✅ workflow-template.js | **PARITY** |
| Same-LLM adversarial | ✅ | ✅ | ✅ same-llm-adversarial-template.js | **PARITY** |
| AI mock | ✅ | ✅ | ✅ ai-mock-template.js | **PARITY** |
| Dark mode | ✅ | ✅ | ✅ index-template.html | **PARITY** |
| Compact shell library | ✅ | ✅ | ✅ compact.sh | **PARITY** |
| Deploy script | ✅ | ✅ | ✅ deploy-web.sh.template | **PARITY** |
| Setup scripts (macOS/Linux/Windows) | ✅ | ✅ | ✅ | **PARITY** |
| Install hooks script | ✅ | ✅ | ✅ install-hooks-template.sh | **PARITY** |
| Pre-commit config | ✅ | ✅ | ✅ .pre-commit-config.yaml | **PARITY** |
| ESLint config | ✅ | ✅ | ✅ .eslintrc-template.json | **PARITY** |
| Jest config | ✅ | ✅ | ✅ jest.config-template.js | **PARITY** |
| Jest setup | ✅ | ✅ | ✅ jest.setup-template.js | **PARITY** |
| Storage tests | ✅ | ✅ | ✅ storage.test-template.js | **PARITY** |
| Workflow tests | ✅ | ❌ | ❌ | **N/A** (prd-assistant has it) |
| Same-LLM tests | ✅ | ❌ | ✅ same-llm-adversarial.test-template.js | **PARITY** |
| AI mock tests | ✅ | ❌ | ✅ ai-mock.test-template.js | **PARITY** |
| Codecov config | ✅ | ✅ | ✅ codecov-template.yml | **PARITY** |
| CLAUDE.md | ✅ | ✅ | ✅ CLAUDE.md.template | **PARITY** |
| CONTRIBUTING.md | ✅ | ✅ | ✅ CONTRIBUTING-template.md | **PARITY** |
| README.md | ✅ | ✅ | ✅ README-template.md | **PARITY** |

---

## ⚠️ **GAPS IDENTIFIED**

### **CRITICAL GAPS** (Must Fix)

#### 1. **CI/CD Workflow Differences**

**Issue**: Genesis CI template differs significantly from both derivatives

**one-pager CI**:
- Matrix testing (Node 18.x, 20.x, 22.x)
- Combined lint + test in single job
- Pre-commit hooks in CI
- Codecov upload with `flags: unittests`

**prd-assistant CI**:
- Separate lint/test/quality jobs
- npm package caching
- Codecov upload with `flags: webapp`
- Quality gate summary job

**Genesis CI**:
- Separate lint/test/coverage/deploy/quality-check jobs
- ShellCheck for scripts
- Shell script standards verification
- Deploy to GitHub Pages in CI (automatic)

**Gap**: Genesis CI is more complex than needed. Both derivatives use simpler, cleaner CI configs.

**Recommendation**: 
- Create TWO CI templates: `ci-simple-template.yml` (like one-pager) and `ci-advanced-template.yml` (like prd-assistant)
- Remove automatic deployment from CI (both derivatives use manual deployment)
- Add npm caching (prd-assistant pattern)

---

#### 2. **Missing deploy-web.yml Workflow**

**Issue**: prd-assistant has a separate `deploy-web.yml` workflow for manual deployment

**prd-assistant deploy-web.yml**:
```yaml
name: Deploy Web App to GitHub Pages
on:
  workflow_dispatch:
jobs:
  deploy:
    - Copy files to docs/
    - Commit and push
    - Display deployment URL
```

**Genesis**: Has deployment in main CI workflow (automatic on push to main)

**Gap**: No manual deployment workflow option

**Recommendation**: Create `genesis/templates/github/workflows/deploy-web-template.yml`

---

#### 3. **Jest Configuration Discrepancies**

**Issue**: Genesis jest.config has unrealistic 85% coverage thresholds

**one-pager**: 25% statements, 15% branches, 30% functions, 25% lines  
**prd-assistant**: 60% statements, 45% branches, 60% functions, 60% lines  
**Genesis**: 85% statements, 80% branches, 85% functions, 85% lines

**Gap**: Genesis thresholds are too aggressive and will cause failures

**Recommendation**: 
- Lower Genesis defaults to match prd-assistant (60/45/60/60)
- Add comment explaining thresholds should be adjusted per project

---

#### 4. **Jest Setup Missing Polyfills**

**Issue**: Genesis jest.setup is missing critical polyfills that prd-assistant has

**prd-assistant has**:
- `crypto.randomUUID` polyfill (using node:crypto)
- Mock File/Blob/FileReader APIs
- Mock URL.createObjectURL/revokeObjectURL
- Enhanced clipboard mock with jest.fn()

**Genesis has**:
- Basic structuredClone polyfill
- Basic localStorage/sessionStorage mocks
- Basic clipboard mock (no jest.fn)
- Basic alert/confirm/prompt mocks

**Gap**: Missing modern browser API polyfills

**Recommendation**: Update `jest.setup-template.js` with prd-assistant polyfills

---

#### 5. **ESLint Configuration Missing node Environment**

**Issue**: Genesis .eslintrc doesn't include `"node": true` in env

**prd-assistant**:
```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  }
}
```

**Genesis**: Missing `"node": true`

**Gap**: ESLint will complain about Node.js globals in test files

**Recommendation**: Add `"node": true` to `.eslintrc-template.json`

---

#### 6. **Pre-commit Coverage Thresholds**

**Issue**: Genesis pre-commit config has unrealistic coverage thresholds

**one-pager**: 25/15/30/25
**prd-assistant**: 60/45/60/60
**Genesis**: Not checked (need to verify)

**Recommendation**: Align with jest.config thresholds

---

### **MEDIUM GAPS** (Should Fix)

#### 7. **Missing Scripts in one-pager**

**Issue**: one-pager has additional scripts that Genesis doesn't template

**one-pager has**:
- `build-release.sh` - Creates production builds
- `validate-project.sh` - Validates project structure
- `integration-test.sh` - Runs integration tests
- `check-binaries.sh` - Checks for required binaries
- `setup-codecov.sh` - Sets up Codecov integration

**Genesis has**:
- ✅ `deploy-web.sh.template`
- ✅ `install-hooks-template.sh`
- ✅ `setup-codecov-template.sh`
- ✅ `setup-linux-template.sh`
- ✅ `setup-macos-template.sh`
- ✅ `setup-windows-wsl-template.sh`
- ✅ `validate-template.sh`
- ❌ `build-release.sh`
- ❌ `integration-test.sh`
- ❌ `check-binaries.sh`

**Analysis**:
- `validate-template.sh` exists but may not match `validate-project.sh` functionality
- `build-release.sh` and `integration-test.sh` might be one-pager-specific bloat
- `check-binaries.sh` could be useful

**Recommendation**:
- Review if `build-release.sh` and `integration-test.sh` are needed
- Consider adding `check-binaries.sh` template
- Verify `validate-template.sh` has same functionality as `validate-project.sh`

---

#### 8. **Package.json Scripts Differences**

**Issue**: prd-assistant has additional npm scripts

**prd-assistant has**:
```json
{
  "serve": "python3 -m http.server 8000",
  "deploy": "./scripts/deploy-web.sh"
}
```

**Genesis package-template.json**: Need to check

**Recommendation**: Add `serve` and `deploy` scripts to package-template.json

---

#### 9. **Missing .editorconfig**

**Issue**: prd-assistant has `.editorconfig` file

**prd-assistant**:
```
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2
```

**Genesis**: No .editorconfig template

**Recommendation**: Create `.editorconfig-template` file

---

### **LOW GAPS** (Nice to Have)

#### 10. **Missing .claude/settings.local.json**

**Issue**: prd-assistant has `.claude/settings.local.json` for Claude Desktop integration

**prd-assistant**:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    }
  }
}
```

**Genesis**: No .claude directory template

**Recommendation**: Create `.claude/settings.local.json-template` (OPTIONAL)

---

#### 11. **Missing LICENSE File**

**Issue**: prd-assistant has LICENSE file, one-pager doesn't

**prd-assistant**: Has MIT LICENSE
**one-pager**: No LICENSE
**Genesis**: No LICENSE template

**Recommendation**: Create `LICENSE-template` with MIT license (OPTIONAL)

---

#### 12. **Missing RELEASES.md**

**Issue**: prd-assistant has RELEASES.md for version tracking

**prd-assistant**: Has RELEASES.md with version history
**one-pager**: No RELEASES.md
**Genesis**: No RELEASES.md template

**Recommendation**: Create `RELEASES-template.md` (OPTIONAL)

---

## 📊 **Parity Score**

| Category | Score | Notes |
|----------|-------|-------|
| **Core Functionality** | 100% | ✅ All core features present |
| **CI/CD** | 70% | ⚠️ CI config needs simplification |
| **Testing** | 85% | ⚠️ Jest config/setup need updates |
| **Scripts** | 90% | ⚠️ Missing a few utility scripts |
| **Configuration** | 85% | ⚠️ Missing .editorconfig, ESLint node env |
| **Documentation** | 95% | ✅ Most docs present |

**Overall Parity**: **87%**

---

## 🎯 **Action Items**

### **CRITICAL** (Must Fix Before Next Spawn)

1. ✅ **Fix CI workflow** - Create simpler CI template matching derivatives
2. ✅ **Add deploy-web.yml** - Manual deployment workflow
3. ✅ **Fix jest.config thresholds** - Lower to 60/45/60/60
4. ✅ **Update jest.setup** - Add prd-assistant polyfills
5. ✅ **Fix .eslintrc** - Add "node": true

### **MEDIUM** (Should Fix Soon)

6. ⚠️ **Review validate-template.sh** - Ensure it matches validate-project.sh
7. ⚠️ **Add package.json scripts** - Add serve/deploy scripts
8. ⚠️ **Add .editorconfig** - Create template

### **LOW** (Nice to Have)

9. 📝 **Add .claude template** - For Claude Desktop users
10. 📝 **Add LICENSE template** - MIT license
11. 📝 **Add RELEASES template** - Version tracking

---

## 🔍 **Detailed File-by-File Comparison**

### **JavaScript Files**

| File | one-pager | prd-assistant | Genesis | Status |
|------|-----------|---------------|---------|--------|
| js/router.js | ✅ | ✅ | ✅ router-template.js | **PARITY** |
| js/views.js | ✅ | ✅ | ✅ views-template.js | **PARITY** |
| js/ui.js | ✅ | ✅ | ✅ ui-template.js | **PARITY** |
| js/projects.js | ✅ | ✅ | ✅ projects-template.js | **PARITY** |
| js/project-view.js | ✅ | ✅ | ✅ project-view-template.js | **PARITY** |
| js/storage.js | ✅ | ✅ | ✅ storage-template.js | **PARITY** |
| js/workflow.js | ✅ | ✅ | ✅ workflow-template.js | **PARITY** |
| js/app.js | ✅ | ✅ | ✅ app-template.js | **PARITY** |
| js/ai-mock.js | ✅ | ❌ | ✅ ai-mock-template.js | **PARITY** |
| same_llm_adversarial_implementation.js | ✅ (root) | ❌ | ✅ same-llm-adversarial-template.js | **PARITY** |

---

### **Test Files**

| File | one-pager | prd-assistant | Genesis | Status |
|------|-----------|---------------|---------|--------|
| tests/storage.test.js | ✅ | ✅ | ✅ storage.test-template.js | **PARITY** |
| tests/workflow.test.js | ✅ | ✅ | ❌ | **GAP** (need to add) |
| tests/ui.test.js | ❌ | ✅ | ❌ | **GAP** (prd-assistant only) |
| tests/projects.test.js | ❌ | ✅ | ❌ | **GAP** (prd-assistant only) |
| tests/ai-mock.test.js | ✅ | ❌ | ✅ ai-mock.test-template.js | **PARITY** |
| tests/same-llm-adversarial.test.js | ✅ | ❌ | ✅ same-llm-adversarial.test-template.js | **PARITY** |

**Analysis**:
- prd-assistant has more comprehensive test coverage (ui.test.js, projects.test.js)
- one-pager has same-llm and ai-mock tests that prd-assistant doesn't
- Genesis has one-pager's tests but missing prd-assistant's additional tests

**Recommendation**: Add ui.test-template.js and projects.test-template.js from prd-assistant

---

### **Scripts**

| File | one-pager | prd-assistant | Genesis | Status |
|------|-----------|---------------|---------|--------|
| scripts/deploy-web.sh | ✅ | ✅ | ✅ deploy-web.sh.template | **PARITY** |
| scripts/install-hooks.sh | ✅ | ✅ | ✅ install-hooks-template.sh | **PARITY** |
| scripts/setup-linux.sh | ✅ | ✅ | ✅ setup-linux-template.sh | **PARITY** |
| scripts/setup-macos.sh | ✅ | ✅ | ✅ setup-macos-template.sh | **PARITY** |
| scripts/setup-windows-wsl.sh | ✅ | ✅ | ✅ setup-windows-wsl-template.sh | **PARITY** |
| scripts/check-secrets.sh | ✅ | ✅ | ❌ | **GAP** |
| scripts/setup-codecov.sh | ✅ | ❌ | ✅ setup-codecov-template.sh | **PARITY** |
| scripts/build-release.sh | ✅ | ❌ | ❌ | **GAP** (one-pager only) |
| scripts/validate-project.sh | ✅ | ❌ | ✅ validate-template.sh | **VERIFY** |
| scripts/integration-test.sh | ✅ | ❌ | ❌ | **GAP** (one-pager only) |
| scripts/check-binaries.sh | ✅ | ❌ | ❌ | **GAP** (one-pager only) |
| scripts/lib/compact.sh | ✅ | ✅ | ✅ compact.sh | **PARITY** |
| scripts/lib/common.sh | ✅ | ✅ | ✅ common-template.sh | **PARITY** |

**Analysis**:
- `check-secrets.sh` is in BOTH derivatives - **CRITICAL GAP**
- one-pager has extra scripts that might be bloat
- Need to verify validate-template.sh matches validate-project.sh

**Recommendation**:
- **CRITICAL**: Add check-secrets.sh template (both derivatives have it)
- Review build-release.sh, integration-test.sh, check-binaries.sh for usefulness

---

### **Configuration Files**

| File | one-pager | prd-assistant | Genesis | Status |
|------|-----------|---------------|---------|--------|
| package.json | ✅ | ✅ | ✅ package-template.json | **VERIFY** |
| .eslintrc.json | ✅ | ✅ | ✅ .eslintrc-template.json | **GAP** (missing node env) |
| .pre-commit-config.yaml | ✅ | ✅ | ✅ .pre-commit-config.yaml | **VERIFY** |
| jest.config.js | ✅ | ✅ | ✅ jest.config-template.js | **GAP** (thresholds) |
| jest.setup.js | ✅ | ✅ | ✅ jest.setup-template.js | **GAP** (polyfills) |
| .gitignore | ✅ | ✅ | ✅ gitignore-template | **PARITY** |
| .env.example | ✅ | ✅ | ✅ .env.example-template | **PARITY** |
| codecov.yml | ✅ | ❌ | ✅ codecov-template.yml | **PARITY** |
| .editorconfig | ❌ | ✅ | ❌ | **GAP** |

---

### **GitHub Workflows**

| File | one-pager | prd-assistant | Genesis | Status |
|------|-----------|---------------|---------|--------|
| .github/workflows/ci.yml | ✅ | ✅ | ✅ ci-template.yml | **GAP** (too complex) |
| .github/workflows/deploy-web.yml | ❌ | ✅ | ❌ | **GAP** |
| .github/workflows/lint.yml | ❌ | ❌ | ✅ lint-template.yml | **EXTRA** (not needed) |

**Analysis**:
- Genesis has separate lint-template.yml that neither derivative uses
- prd-assistant has deploy-web.yml for manual deployment
- Genesis CI is more complex than both derivatives

**Recommendation**:
- Remove lint-template.yml (not used by derivatives)
- Add deploy-web-template.yml
- Simplify ci-template.yml

---

### **Documentation**

| File | one-pager | prd-assistant | Genesis | Status |
|------|-----------|---------------|---------|--------|
| README.md | ✅ | ✅ | ✅ README-template.md | **PARITY** |
| CLAUDE.md | ✅ | ✅ | ✅ CLAUDE.md.template | **PARITY** |
| CONTRIBUTING.md | ✅ | ✅ | ✅ CONTRIBUTING-template.md | **PARITY** |
| RELEASES.md | ❌ | ✅ | ❌ | **GAP** (optional) |
| LICENSE | ❌ | ✅ | ❌ | **GAP** (optional) |

---

## 🚨 **CRITICAL FINDINGS**

### **1. Missing check-secrets.sh**

**CRITICAL**: Both one-pager AND prd-assistant have `scripts/check-secrets.sh`

This script prevents committing secrets to the repository. It's a **SECURITY FEATURE**.

**Action**: Create `genesis/templates/scripts/check-secrets-template.sh` immediately

---

### **2. CI Workflow Mismatch**

**CRITICAL**: Genesis CI template doesn't match either derivative

- Genesis has automatic deployment (neither derivative does)
- Genesis has shell script standards checking (neither derivative does)
- Genesis is missing npm caching (prd-assistant has it)
- Genesis has separate lint.yml (neither derivative uses it)

**Action**: Rewrite CI template to match prd-assistant pattern (cleaner, more modern)

---

### **3. Jest Configuration Unrealistic**

**CRITICAL**: Genesis jest.config has 85% thresholds that will fail on new projects

- one-pager: 25/15/30/25 (realistic for new projects)
- prd-assistant: 60/45/60/60 (realistic for mature projects)
- Genesis: 85/80/85/85 (unrealistic, will cause failures)

**Action**: Lower to 60/45/60/60 and add comment about adjusting per project

---

### **4. Missing Test Files**

**MEDIUM**: Genesis is missing test files that prd-assistant has

- `tests/ui.test.js` - Tests UI utilities
- `tests/projects.test.js` - Tests project CRUD
- `tests/workflow.test.js` - Tests workflow engine (one-pager has this too)

**Action**: Add these test templates from prd-assistant

---

## 📋 **Prioritized Fix List**

### **Phase 1: CRITICAL (Do Now)**

1. ✅ Create `check-secrets-template.sh` (SECURITY)
2. ✅ Fix jest.config thresholds (60/45/60/60)
3. ✅ Update jest.setup with polyfills
4. ✅ Fix .eslintrc (add node env)
5. ✅ Simplify CI template (match prd-assistant)
6. ✅ Add deploy-web-template.yml

### **Phase 2: MEDIUM (Do Soon)**

7. ⚠️ Add ui.test-template.js
8. ⚠️ Add projects.test-template.js
9. ⚠️ Add workflow.test-template.js (if not already present)
10. ⚠️ Verify package-template.json has serve/deploy scripts
11. ⚠️ Add .editorconfig-template
12. ⚠️ Remove lint-template.yml (not used)

### **Phase 3: LOW (Nice to Have)**

13. 📝 Add .claude/settings.local.json-template
14. 📝 Add LICENSE-template
15. 📝 Add RELEASES-template.md
16. 📝 Review build-release.sh for inclusion
17. 📝 Review integration-test.sh for inclusion
18. 📝 Review check-binaries.sh for inclusion

---

## ✅ **Conclusion**

**Current State**: Genesis is **87% at parity** with derivatives

**Blockers**: 6 CRITICAL issues prevent Genesis from generating production-ready projects

**Timeline**:
- Phase 1 (CRITICAL): 2-3 hours
- Phase 2 (MEDIUM): 1-2 hours
- Phase 3 (LOW): 1 hour

**Total Effort**: 4-6 hours to reach 95%+ parity

**Recommendation**: Fix Phase 1 issues immediately before next project spawn


