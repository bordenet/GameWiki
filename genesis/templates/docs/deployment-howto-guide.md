# Deployment How-To Guide

## Overview

This guide explains how to use the deployment script (`scripts/deploy-web.sh`) to deploy your {{PROJECT_NAME}} application to GitHub Pages.

**⚠️ REFERENCE IMPLEMENTATION**: For the canonical example of proper compact mode deployment, see:
https://github.com/bordenet/product-requirements-assistant/blob/main/scripts/deploy-web.sh

## Prerequisites

Before deploying, ensure:

1. ✅ All tests are passing (`npm test`)
2. ✅ Linting is clean (`npm run lint`)
3. ✅ Coverage meets threshold (`npm run test:coverage`)
4. ✅ Git repository is initialized and connected to GitHub
5. ✅ GitHub Pages is enabled in repository settings

## Quick Start

### Standard Deployment

```bash
./scripts/deploy-web.sh
```

This will:
1. Run linting checks
2. Run all tests
3. Verify test coverage
4. Commit changes (if any)
5. Push to GitHub
6. Verify deployment

### Verbose Mode

For detailed output:

```bash
./scripts/deploy-web.sh --verbose
```

## Script Options

### Available Flags

| Flag | Description | Recommended |
|------|-------------|-------------|
| `--skip-tests` | Skip running tests | ❌ NOT RECOMMENDED |
| `--skip-lint` | Skip linting checks | ❌ NOT RECOMMENDED |
| `-v, --verbose` | Show detailed output | ✅ For debugging |
| `-h, --help` | Display help message | ✅ For reference |

### Examples

```bash
# Standard deployment (recommended)
./scripts/deploy-web.sh

# Verbose mode for debugging
./scripts/deploy-web.sh --verbose

# Emergency deployment (skip tests - NOT RECOMMENDED)
./scripts/deploy-web.sh --skip-tests --skip-lint

# Show help
./scripts/deploy-web.sh --help
```

## Deployment Process

### Step 1: Quality Checks

The script runs these checks automatically:

```bash
# Linting
npm run lint

# Tests
NODE_OPTIONS=--experimental-vm-modules npm test

# Coverage
NODE_OPTIONS=--experimental-vm-modules npm run test:coverage
```

**If any check fails, deployment stops.**

### Step 2: Git Operations

```bash
# Stage all changes
git add .

# Commit with timestamp
git commit -m "Deploy: YYYY-MM-DD HH:MM:SS"

# Push to GitHub
git push origin main
```

### Step 3: Verification

The script:
1. Waits 10 seconds for GitHub to process the push
2. Checks if {{GITHUB_PAGES_URL}} returns HTTP 200
3. Reports deployment status

## Troubleshooting

### Deployment Failed: Linting Errors

**Problem**: `npm run lint` failed

**Solution**:
```bash
# See errors
npm run lint

# Auto-fix (if possible)
npm run lint:fix

# Fix remaining errors manually
# Then re-run deployment
./scripts/deploy-web.sh
```

### Deployment Failed: Tests Failed

**Problem**: `npm test` failed

**Solution**:
```bash
# Run tests to see failures
npm test

# Fix failing tests
# Then re-run deployment
./scripts/deploy-web.sh
```

### Deployment Failed: Coverage Too Low

**Problem**: Test coverage below threshold

**Solution**:
```bash
# Check coverage report
npm run test:coverage

# Add tests for uncovered code
# Then re-run deployment
./scripts/deploy-web.sh
```

### Deployment Failed: Git Push Failed

**Problem**: `git push` failed

**Possible causes**:
1. No remote configured
2. Authentication failed
3. Branch protection rules
4. Merge conflicts

**Solution**:
```bash
# Check remote
git remote -v

# Check branch
git branch

# Pull latest changes
git pull origin main

# Resolve conflicts if any
# Then re-run deployment
./scripts/deploy-web.sh
```

### Site Not Updating

**Problem**: Deployment succeeded but site shows old content

**Causes**:
1. GitHub Pages deployment delay (1-2 minutes)
2. Browser cache
3. CDN cache

**Solution**:
```bash
# Wait 2 minutes, then check deployment status
open https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/deployments

# Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

# Check if site is actually updated
curl -I {{GITHUB_PAGES_URL}}
```

## Best Practices

### 1. Always Run Full Checks

```bash
# ✅ GOOD: Full quality checks
./scripts/deploy-web.sh

# ❌ BAD: Skipping checks
./scripts/deploy-web.sh --skip-tests --skip-lint
```

### 2. Deploy from Clean State

```bash
# Check for uncommitted changes
git status

# Commit or stash changes before deploying
git add .
git commit -m "Prepare for deployment"

# Then deploy
./scripts/deploy-web.sh
```

### 3. Verify After Deployment

```bash
# Check deployment status
open https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/deployments

# Test the live site
open {{GITHUB_PAGES_URL}}

# Verify functionality
# - Test all major features
# - Check console for errors
# - Verify responsive design
```

### 4. Use Verbose Mode for Debugging

```bash
# If deployment fails, re-run with verbose mode
./scripts/deploy-web.sh --verbose
```

## GitHub Pages Configuration

### Enable GitHub Pages

1. Go to repository settings: `https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/settings/pages`
2. Source: **Deploy from a branch**
3. Branch: **main**
4. Folder: **/ (root)**
5. Click **Save**

### Verify Configuration

```bash
# Check if GitHub Pages is enabled
curl -I {{GITHUB_PAGES_URL}}

# Should return: HTTP/2 200
```

## Continuous Integration

The deployment script is designed to work with CI/CD pipelines:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: ./scripts/deploy-web.sh
```

## Summary

**Standard workflow**:
1. Make changes to code
2. Run `./scripts/deploy-web.sh`
3. Script runs quality checks
4. Script pushes to GitHub
5. GitHub Pages updates automatically
6. Verify deployment at {{GITHUB_PAGES_URL}}

**Remember**: The deployment script enforces quality standards. If checks fail, fix the issues before deploying.

