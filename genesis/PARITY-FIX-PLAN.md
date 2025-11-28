# Genesis Parity Fix Plan

**Date**: 2025-11-22  
**Status**: Ready to Execute  
**Estimated Time**: 4-6 hours

---

## 🎯 **Objective**

Bring Genesis to 95%+ parity with one-pager and product-requirements-assistant by fixing 6 CRITICAL gaps and 6 MEDIUM gaps.

---

## 📊 **Current State**

- **Overall Parity**: 87%
- **CRITICAL Gaps**: 6
- **MEDIUM Gaps**: 6
- **LOW Gaps**: 6

---

## 🚨 **Phase 1: CRITICAL FIXES** (Must Do Now)

### **1. Create check-secrets-template.sh** ⚠️ SECURITY

**Why**: Both derivatives have this. It's a security feature to prevent committing secrets.

**Source**: Use prd-assistant version (simpler, cleaner)

**Location**: `genesis/templates/scripts/check-secrets-template.sh`

**Effort**: 30 minutes

**Template Variables**:
- `{{PROJECT_NAME}}` → Project name in header

---

### **2. Fix jest.config-template.js Thresholds**

**Why**: Current 85% thresholds are unrealistic and will cause failures

**Changes**:
```javascript
// OLD (unrealistic)
coverageThresholds: {
  global: {
    statements: 85,
    branches: 80,
    functions: 85,
    lines: 85
  }
}

// NEW (realistic, matches prd-assistant)
coverageThreshold: {
  global: {
    statements: 60,
    branches: 45,
    functions: 60,
    lines: 60
  }
}
```

**Also Add**:
```javascript
collectCoverageFrom: [
  'js/**/*.js',
  '!js/**/*.test.js',
  '!js/app.js',
  '!js/router.js', // Exclude router (tested via E2E)
  '!js/views.js', // Exclude views (tested via E2E)
  '!js/project-view.js', // Exclude project view (tested via E2E)
  '!**/node_modules/**'
]
```

**Effort**: 15 minutes

---

### **3. Update jest.setup-template.js with Polyfills**

**Why**: Missing modern browser API polyfills that prd-assistant has

**Add**:
1. `crypto.randomUUID` polyfill (using node:crypto)
2. Mock File/Blob/FileReader APIs
3. Mock URL.createObjectURL/revokeObjectURL
4. Enhanced clipboard mock with jest.fn()

**Source**: Copy from prd-assistant jest.setup.js (lines 3-75)

**Effort**: 20 minutes

---

### **4. Fix .eslintrc-template.json**

**Why**: Missing "node": true in env, causing ESLint errors in test files

**Change**:
```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true  // ADD THIS
  }
}
```

**Effort**: 5 minutes

---

### **5. Simplify ci-template.yml**

**Why**: Genesis CI is too complex. Both derivatives use simpler patterns.

**Strategy**: Create TWO templates

**Option A**: `ci-simple-template.yml` (like one-pager)
- Matrix testing (Node 18.x, 20.x, 22.x)
- Combined lint + test in single job
- Pre-commit hooks in CI

**Option B**: `ci-advanced-template.yml` (like prd-assistant)
- Separate lint/test/quality jobs
- npm package caching
- Quality gate summary

**Remove**:
- Automatic deployment (neither derivative does this)
- Shell script standards checking (too opinionated)
- lint-template.yml (not used by derivatives)

**Effort**: 45 minutes

---

### **6. Add deploy-web-template.yml**

**Why**: prd-assistant has manual deployment workflow

**Source**: Copy from prd-assistant .github/workflows/deploy-web.yml

**Location**: `genesis/templates/github/workflows/deploy-web-template.yml`

**Template Variables**:
- `{{GITHUB_USER}}` → GitHub username
- `{{GITHUB_REPO}}` → Repository name
- `{{DEPLOY_FOLDER}}` → Deployment folder (docs/ or root)

**Effort**: 20 minutes

---

## ⚠️ **Phase 2: MEDIUM FIXES** (Should Do Soon)

### **7. Add ui.test-template.js**

**Source**: prd-assistant tests/ui.test.js

**Tests**: showToast, showLoading, hideLoading, copyToClipboard, formatDate, formatBytes

**Effort**: 30 minutes

---

### **8. Add projects.test-template.js**

**Source**: prd-assistant tests/projects.test.js

**Tests**: createProject, getAllProjects, getProject, updatePhase, deleteProject, importProjects

**Effort**: 30 minutes

---

### **9. Add workflow.test-template.js**

**Source**: prd-assistant tests/workflow.test.js

**Tests**: getPrompt, savePrompt, resetPrompt, generatePhase1Prompt, generatePhase2Prompt, generatePhase3Prompt

**Note**: Genesis has workflow.e2e-template.js but not workflow.test-template.js

**Effort**: 30 minutes

---

### **10. Add .editorconfig-template**

**Source**: prd-assistant .editorconfig

**Content**:
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

**Location**: `genesis/templates/project-structure/.editorconfig-template`

**Effort**: 10 minutes

---

### **11. Verify package-template.json**

**Check**:
- ✅ Has `serve` script (already present)
- ❓ Has `deploy` script?

**Add if missing**:
```json
{
  "scripts": {
    "deploy": "./scripts/deploy-web.sh"
  }
}
```

**Effort**: 5 minutes

---

### **12. Remove lint-template.yml**

**Why**: Neither derivative uses separate lint workflow

**Action**: Delete `genesis/templates/github/workflows/lint-template.yml`

**Update**: Remove references in documentation

**Effort**: 5 minutes

---

## 📝 **Phase 3: LOW PRIORITY** (Nice to Have)

### **13. Add .claude/settings.local.json-template**

**Source**: prd-assistant .claude/settings.local.json

**Purpose**: Claude Desktop integration

**Location**: `genesis/templates/project-structure/.claude/settings.local.json-template`

**Effort**: 15 minutes

---

### **14. Add LICENSE-template**

**Source**: prd-assistant LICENSE (MIT)

**Location**: `genesis/templates/project-structure/LICENSE-template`

**Effort**: 5 minutes

---

### **15. Add RELEASES-template.md**

**Source**: prd-assistant RELEASES.md

**Location**: `genesis/templates/project-structure/RELEASES-template.md`

**Effort**: 10 minutes

---

### **16-18. Review one-pager Extra Scripts**

**Scripts to Review**:
- `build-release.sh` - Creates production builds
- `integration-test.sh` - Runs integration tests
- `check-binaries.sh` - Checks for required binaries

**Decision**: Determine if these are useful or bloat

**Effort**: 30 minutes (review + decision)

---

## 📋 **Execution Checklist**

### **Phase 1: CRITICAL** (2-3 hours)

- [ ] 1. Create check-secrets-template.sh (30 min)
- [ ] 2. Fix jest.config thresholds (15 min)
- [ ] 3. Update jest.setup polyfills (20 min)
- [ ] 4. Fix .eslintrc node env (5 min)
- [ ] 5. Simplify CI templates (45 min)
- [ ] 6. Add deploy-web-template.yml (20 min)

**Total**: ~2 hours 15 minutes

---

### **Phase 2: MEDIUM** (1-2 hours)

- [ ] 7. Add ui.test-template.js (30 min)
- [ ] 8. Add projects.test-template.js (30 min)
- [ ] 9. Add workflow.test-template.js (30 min)
- [ ] 10. Add .editorconfig-template (10 min)
- [ ] 11. Verify package-template.json (5 min)
- [ ] 12. Remove lint-template.yml (5 min)

**Total**: ~1 hour 50 minutes

---

### **Phase 3: LOW** (1 hour)

- [ ] 13. Add .claude template (15 min)
- [ ] 14. Add LICENSE template (5 min)
- [ ] 15. Add RELEASES template (10 min)
- [ ] 16-18. Review extra scripts (30 min)

**Total**: ~1 hour

---

## 🎯 **Success Criteria**

After completing Phase 1 + Phase 2:

- ✅ Genesis can generate projects with same security as derivatives (check-secrets.sh)
- ✅ Genesis projects have realistic test coverage thresholds
- ✅ Genesis projects have modern browser API polyfills
- ✅ Genesis projects have clean, simple CI/CD
- ✅ Genesis projects have comprehensive test coverage
- ✅ Genesis projects have consistent code formatting (.editorconfig)

**Target Parity**: 95%+

---

## 🚀 **Next Steps**

1. **Review this plan** - Confirm approach
2. **Execute Phase 1** - Fix CRITICAL gaps (2-3 hours)
3. **Test** - Spawn a test project and verify
4. **Execute Phase 2** - Fix MEDIUM gaps (1-2 hours)
5. **Test again** - Verify all fixes work
6. **Execute Phase 3** - Add nice-to-haves (optional)

---

## 📝 **Notes**

### **Template Variable Conventions**

All templates should use these variables:
- `{{PROJECT_NAME}}` - Project name (e.g., "one-pager")
- `{{PROJECT_TITLE}}` - Human-readable title (e.g., "One-Pager")
- `{{PROJECT_DESCRIPTION}}` - Project description
- `{{GITHUB_USER}}` - GitHub username
- `{{GITHUB_REPO}}` - Repository name
- `{{GITHUB_PAGES_URL}}` - GitHub Pages URL
- `{{DEPLOY_FOLDER}}` - Deployment folder (docs/ or root)
- `{{DOCUMENT_TYPE}}` - Document type (PRD, one-pager, etc.)

### **Testing Strategy**

After each phase:
1. Run Genesis validator: `./genesis-validator/bin/genesis-validator`
2. Spawn a test project
3. Run all quality checks in spawned project
4. Verify CI passes
5. Verify deployment works

---

## ✅ **Approval**

Ready to proceed? Confirm and I'll start with Phase 1.


