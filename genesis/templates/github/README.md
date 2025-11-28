# GitHub Templates

## Purpose

This directory contains GitHub-specific templates including workflows, issue templates, and repository configuration files.

## Contents

### Workflows (`workflows/`)

GitHub Actions workflow templates for CI/CD automation.

See `workflows/README.md` for detailed documentation.

## Directory Structure

```
github/
├── README.md (this file)
└── workflows/
    ├── README.md
    ├── ci-template.yml
    └── lint-template.yml
```

## Usage

### For AI Assistants

When creating a new project:

1. Create `.github/` directory in project root
2. Copy `workflows/` directory to `.github/workflows/`
3. Replace all `{{VARIABLES}}` with actual values
4. Remove `-template` suffix from filenames
5. Commit and push to trigger workflows

### For Manual Use

```bash
# Create GitHub directory
mkdir -p .github/workflows

# Copy workflow templates
cp genesis/templates/github/workflows/*-template.yml .github/workflows/

# Rename files
cd .github/workflows
for f in *-template.yml; do mv "$f" "${f%-template.yml}.yml"; done

# Edit files to replace variables
# Commit and push
```

## GitHub Actions

All projects created from Genesis should have these workflows:

### 1. CI Workflow (`ci.yml`)
- Runs on every push and pull request
- Executes tests
- Generates coverage reports
- Uploads to Codecov
- Deploys to GitHub Pages (on main branch)

### 2. Lint Workflow (`lint.yml`)
- Runs on every push and pull request
- Checks shell scripts (shellcheck)
- Checks JavaScript (eslint/syntax)
- Checks HTML/CSS validation
- Enforces code quality standards

## Secrets Configuration

Some workflows require GitHub secrets:

### Required Secrets

**`CODECOV_TOKEN`** (if using Codecov)
- Get from: https://codecov.io/
- Add to: Repository Settings → Secrets → Actions
- Used by: CI workflow for coverage upload

### Optional Secrets

**`PERSONAL_ACCESS_TOKEN`** (for advanced workflows)
- Get from: GitHub Settings → Developer settings → Personal access tokens
- Add to: Repository Settings → Secrets → Actions
- Used by: Workflows that need elevated permissions

## Branch Protection

Recommended branch protection rules for `main`:

```yaml
Require pull request reviews: true
Require status checks to pass: true
  - ci
  - lint
Require branches to be up to date: true
Require linear history: false
Include administrators: false
```

## Related Documentation

- **Workflows**: `workflows/README.md`
- **Quality Enforcement**: `../../QUALITY_ENFORCEMENT.md`
- **CI/CD Guide**: `../docs/deployment/CI-CD-template.md` (future)

## Maintenance

When modifying GitHub templates:
1. Test in actual repository
2. Verify workflows run successfully
3. Check workflow logs for errors
4. Update this README
5. Update `../../SUMMARY.md`

