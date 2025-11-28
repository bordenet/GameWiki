# GitHub Actions Workflows

## Purpose

This directory contains GitHub Actions workflow templates for automated CI/CD pipelines.

## Contents

### 1. CI Workflow (`ci-template.yml`)

**Purpose**: Continuous Integration - test, build, and deploy

**Triggers**:
- Push to `main` branch
- Pull requests to `main` branch

**Jobs**:

**`test`** - Run tests and generate coverage
- Checkout code
- Setup Node.js (if applicable)
- Setup Python (if applicable)
- Install dependencies
- Run tests
- Generate coverage report
- Upload to Codecov

**`deploy`** - Deploy to GitHub Pages
- Only runs on `main` branch
- Only runs after `test` succeeds
- Deploys `{{DEPLOY_FOLDER}}/` to GitHub Pages

**Configuration**:
```yaml
# Required variables
{{DEPLOY_FOLDER}}  # docs/ or web/
{{NODE_VERSION}}   # 18.x, 20.x, etc.
{{PYTHON_VERSION}} # 3.9, 3.10, 3.11, etc.

# Required secrets
CODECOV_TOKEN      # From codecov.io
```

### 2. Lint Workflow (`lint-template.yml`)

**Purpose**: Code quality enforcement

**Triggers**:
- Push to any branch
- Pull requests to any branch

**Jobs**:

**`shellcheck`** - Validate shell scripts
- Find all `.sh` files
- Run shellcheck
- Fail on any warnings

**`javascript`** - Validate JavaScript
- Find all `.js` files
- Check syntax with `node --check`
- Run ESLint (if configured)

**`html-css`** - Validate HTML/CSS
- Validate HTML5 syntax
- Validate CSS3 syntax

**`standards`** - Enforce standards
- Check for `console.log` statements
- Check for `debugger` statements
- Check for `TODO` comments
- Check for trailing whitespace

## Usage

### Installation

```bash
# Create workflows directory
mkdir -p .github/workflows

# Copy templates
cp genesis/templates/github/workflows/ci-template.yml .github/workflows/ci.yml
cp genesis/templates/github/workflows/lint-template.yml .github/workflows/lint.yml

# Replace variables
# Edit files to replace {{VARIABLES}}

# Commit and push
git add .github/workflows/
git commit -m "Add CI/CD workflows"
git push
```

### Viewing Workflow Runs

1. Go to repository on GitHub
2. Click "Actions" tab
3. View workflow runs and logs

### Debugging Failed Workflows

```bash
# View workflow logs on GitHub
# Click on failed job
# Expand failed step
# Read error message

# Fix locally
# Commit and push
# Workflow runs automatically
```

## Workflow Status Badges

Add to README.md:

```markdown
[![CI/CD](https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/actions/workflows/ci.yml/badge.svg)](https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/actions/workflows/ci.yml)
```

## Configuration

### Enable GitHub Pages

1. Go to repository Settings
2. Click "Pages" in sidebar
3. Source: "GitHub Actions"
4. Save

### Add Codecov Token

1. Go to https://codecov.io/
2. Sign in with GitHub
3. Add repository
4. Copy token
5. Go to repository Settings → Secrets → Actions
6. Add secret: `CODECOV_TOKEN`

### Customize Workflows

Edit workflow files to:
- Add/remove jobs
- Change triggers
- Modify steps
- Add environment variables
- Configure caching

## Best Practices

### Do's ✅
- Keep workflows fast (< 5 minutes)
- Cache dependencies
- Run tests in parallel
- Use matrix builds for multiple versions
- Fail fast on errors

### Don'ts ❌
- Don't commit secrets to workflows
- Don't run workflows on every branch
- Don't make workflows too complex
- Don't ignore workflow failures
- Don't skip tests

## Troubleshooting

### Workflow Not Running

**Check**:
- Workflow file in `.github/workflows/`
- Workflow file is valid YAML
- Triggers are configured correctly
- Repository has Actions enabled

### Workflow Failing

**Common Issues**:
- Missing dependencies
- Incorrect Node.js/Python version
- Missing secrets
- Syntax errors in code
- Tests failing

**Debug**:
1. Read workflow logs
2. Reproduce locally
3. Fix issue
4. Commit and push

### Deployment Not Working

**Check**:
- GitHub Pages enabled
- Source set to "GitHub Actions"
- `{{DEPLOY_FOLDER}}` exists
- `index.html` in deploy folder
- No errors in deploy job

## Performance Optimization

### Caching

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Parallel Jobs

```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18.x, 20.x]
```

### Conditional Steps

```yaml
- name: Deploy
  if: github.ref == 'refs/heads/main'
```

## Related Documentation

- **Quality Enforcement**: `../../../QUALITY_ENFORCEMENT.md`
- **Quality Standards**: `../../../05-QUALITY-STANDARDS.md`
- **GitHub Actions Docs**: https://docs.github.com/en/actions

## Maintenance

When modifying workflow templates:
1. Test in actual repository
2. Verify all jobs succeed
3. Check performance (execution time)
4. Update this README
5. Update `../../../SUMMARY.md`

