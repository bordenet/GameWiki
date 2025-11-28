# Environment Configuration Guide

This guide explains the environment configuration pattern used in Genesis and all derivative projects.

---

## The .env Pattern

### Files

**`.env.example`** (tracked in git)
- Template file with placeholder values
- Committed to repository
- Shows all available configuration options
- Includes comments explaining each variable

**`.env`** (gitignored)
- Actual configuration with real values
- NEVER committed to git
- Created by copying `.env.example`
- Contains secrets and local settings

---

## Setup Process

### 1. Copy Template

```bash
cp .env.example .env
```

### 2. Edit Values

```bash
# macOS/Linux
nano .env

# Windows
notepad .env
```

### 3. Fill in Real Values

Replace placeholders with actual values:

```bash
# Before (in .env.example)
CODECOV_TOKEN=your_codecov_token_here

# After (in .env)
CODECOV_TOKEN=abc123-def456-ghi789
```

---

## Standard Variables

### Code Coverage

```bash
# Codecov upload token for code coverage reporting
# Get your token from: https://codecov.io/gh/USERNAME/REPO/settings
# Add this token to GitHub Secrets as CODECOV_TOKEN for CI/CD
CODECOV_TOKEN=your_codecov_token_here
```

**How to get**:
1. Go to https://codecov.io
2. Sign in with GitHub
3. Select your repository
4. Go to Settings → General
5. Copy the upload token

**Where to use**:
- Local testing: Add to `.env`
- CI/CD: Add to GitHub Secrets

### Backend Configuration (if applicable)

```bash
# Backend server port
BACKEND_PORT=8080

# Backend server host
BACKEND_HOST=localhost
```

### Frontend Configuration (if applicable)

```bash
# Frontend server port
FRONTEND_PORT=8501

# Frontend server host
FRONTEND_HOST=localhost

# Backend API URL (used by frontend)
API_BASE_URL=http://localhost:8080
```

### Storage Configuration

```bash
# Directory for project outputs (JSON files)
OUTPUTS_DIR=./outputs

# Directory for input documents
INPUTS_DIR=./inputs

# Directory for prompt templates
PROMPTS_DIR=./prompts
```

### Logging Configuration

```bash
# Log level: DEBUG, INFO, WARN, ERROR
LOG_LEVEL=INFO

# Log file location
LOG_FILE=./backend/server.log
```

### Development Configuration

```bash
# Enable debug mode (more verbose logging)
DEBUG=false

# Enable CORS (required for frontend-backend communication)
ENABLE_CORS=true
```

### Testing Configuration

```bash
# Test data directory
TEST_DATA_DIR=./backend/testdata

# Enable test mode
TEST_MODE=false

# Enable mock AI for automated testing
MOCK_AI_ENABLED=false
```

---

## Project-Specific Variables

### Product Requirements Assistant

```bash
# AI Model Configuration (for documentation purposes)
# This application uses copy/paste workflow with:
# - Claude Sonnet 4.5 (Phase 1 and Phase 3)
# - Gemini 2.5 Pro (Phase 2)
# No API keys required - manual copy/paste workflow
```

### COE (Correction of Error) Generator

```bash
# COE Template Configuration
COE_TEMPLATE_PATH=./prompts/coe-template.md

# COE Output Format
COE_OUTPUT_FORMAT=markdown
```

### One-Pager Generator

```bash
# One-Pager Template Configuration
ONEPAGER_TEMPLATE_PATH=./prompts/onepager-template.md

# One-Pager Output Format
ONEPAGER_OUTPUT_FORMAT=markdown

# Maximum page length (words)
ONEPAGER_MAX_WORDS=500
```

---

## Security Best Practices

### 1. Never Commit .env

Ensure `.env` is in `.gitignore`:

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 2. Use Placeholders in .env.example

```bash
# ✅ Good
CODECOV_TOKEN=your_codecov_token_here
API_KEY=your_api_key_here

# ❌ Bad (real values)
CODECOV_TOKEN=abc123-real-token
API_KEY=sk-real-api-key
```

### 3. Document Where to Get Values

```bash
# ✅ Good
# Get your token from: https://codecov.io/gh/USERNAME/REPO/settings
CODECOV_TOKEN=your_codecov_token_here

# ❌ Bad (no documentation)
CODECOV_TOKEN=your_codecov_token_here
```

### 4. Use GitHub Secrets for CI/CD

Don't put secrets in workflow files:

```yaml
# ✅ Good
- name: Upload coverage
  env:
    CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}

# ❌ Bad (hardcoded secret)
- name: Upload coverage
  env:
    CODECOV_TOKEN: abc123-real-token
```

---

## Troubleshooting

### .env Not Loading

**Check**:
1. File is named exactly `.env` (not `.env.txt`)
2. File is in project root directory
3. Application is configured to load `.env`

### Variables Not Working

**Check**:
1. No spaces around `=`: `KEY=value` not `KEY = value`
2. No quotes needed: `KEY=value` not `KEY="value"`
3. Comments use `#`: `# This is a comment`

### Secrets Exposed

**If you accidentally commit secrets**:

1. **Revoke the secret immediately**
2. **Remove from git history**:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push** (if safe):
   ```bash
   git push origin --force --all
   ```
4. **Generate new secret**

---

## Related Documentation

- [Development Guide](../templates/docs/development/DEVELOPMENT-template.md)
- [Deployment Guide](../templates/docs/deployment/DEPLOYMENT-template.md)
- [Security Best Practices](SECURITY-template.md)

