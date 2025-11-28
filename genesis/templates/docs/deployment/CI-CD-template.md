# CI/CD Pipeline

This document describes the continuous integration and deployment pipeline for {{PROJECT_TITLE}}.

---

## Overview

**CI/CD Platform**: GitHub Actions  
**Workflows**: 2 automated workflows  
**Trigger**: Push to `main` branch

---

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Purpose**: Run tests and quality checks on every push

**Triggers**:
- Push to `main` branch
- Pull requests to `main` branch

**Jobs**:

#### Backend Tests (Go)
```yaml
- Checkout code
- Setup Go 1.21
- Install dependencies
- Run tests with coverage
- Upload coverage to Codecov
```

#### Frontend Tests (JavaScript)
```yaml
- Checkout code
- Setup Node.js 18
- Install dependencies
- Run Jest unit tests
- Run Playwright E2E tests
- Upload coverage to Codecov
```

#### Linting
```yaml
- Run golangci-lint (Go)
- Run ESLint (JavaScript)
- Run ShellCheck (shell scripts)
```

**Duration**: ~2-3 minutes

**Success Criteria**:
- All tests pass
- Coverage ≥ 85%
- No linting errors

---

### 2. Deploy Workflow (`.github/workflows/deploy-web.yml`)

**Purpose**: Deploy web app to GitHub Pages

**Triggers**:
- Push to `main` branch
- Changes to `{{DEPLOY_FOLDER}}/` directory

**Jobs**:

```yaml
- Checkout code
- Deploy to GitHub Pages
  - Publish {{DEPLOY_FOLDER}}/ to gh-pages branch
```

**Duration**: ~30 seconds

**Success Criteria**:
- Deployment succeeds
- Site accessible at {{GITHUB_PAGES_URL}}

---

## Configuration

### Required Secrets

Add to repository secrets:
```
Settings → Secrets and variables → Actions → New repository secret
```

#### CODECOV_TOKEN
- **Purpose**: Upload code coverage to Codecov
- **Get Token**: https://codecov.io/gh/{{GITHUB_USER}}/{{GITHUB_REPO}}/settings
- **Required**: Yes (for coverage reporting)

---

## Status Badges

Add to README.md:

```markdown
![CI](https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/workflows/CI/badge.svg)
![Deploy](https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/workflows/Deploy%20Web%20App/badge.svg)
[![codecov](https://codecov.io/gh/{{GITHUB_USER}}/{{GITHUB_REPO}}/branch/main/graph/badge.svg)](https://codecov.io/gh/{{GITHUB_USER}}/{{GITHUB_REPO}})
```

---

## Monitoring

### View Workflow Runs

```
https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/actions
```

### View Logs

1. Click on workflow run
2. Click on job name
3. Expand steps to see detailed logs

### View Coverage

```
https://codecov.io/gh/{{GITHUB_USER}}/{{GITHUB_REPO}}
```

---

## Troubleshooting

### CI Failing

**Check**:
1. View workflow logs
2. Run tests locally: `npm test`
3. Check coverage: `npm run test:coverage`
4. Fix failing tests
5. Push fix

### Deploy Failing

**Check**:
1. View workflow logs
2. Verify `{{DEPLOY_FOLDER}}/index.html` exists
3. Check GitHub Pages settings
4. Verify branch is `main`

### Coverage Not Uploading

**Check**:
1. Verify CODECOV_TOKEN secret exists
2. Check Codecov dashboard for errors
3. Verify coverage files generated
4. Check workflow logs for upload errors

---

## Local Testing

Test CI checks locally before pushing:

### Run Tests
```bash
# Backend
cd backend
go test -v -race -coverprofile=coverage.txt -covermode=atomic ./...

# Frontend
npm test
npm run test:coverage
```

### Run Linters
```bash
# Go
golangci-lint run

# JavaScript
npm run lint

# Shell scripts
shellcheck scripts/*.sh
```

### Run E2E Tests
```bash
npm run test:e2e
```

---

## Best Practices

### 1. Test Before Push
Always run tests locally before pushing:
```bash
npm test && npm run lint
```

### 2. Keep Coverage High
Maintain ≥85% coverage:
```bash
npm run test:coverage
```

### 3. Fix Failing CI Immediately
Don't let CI stay red:
- Investigate failures quickly
- Fix or revert
- Keep `main` branch green

### 4. Review Logs
Check workflow logs even when passing:
- Look for warnings
- Check performance
- Monitor coverage trends

---

## Related Documentation

- [Testing Guide](../TESTING-template.md)
- [Deployment Guide](DEPLOYMENT-template.md)
- [Badge Setup Guide](../../docs/BADGE-SETUP-GUIDE.md)

