# Badge Setup Guide

This guide explains how to set up all badges in your project README.

---

## 🎯 Overview

Badges provide at-a-glance status information about your project:
- **CI/CD Status**: Build and deployment status
- **Code Coverage**: Test coverage percentage
- **Language**: Primary programming language
- **License**: Project license
- **Version**: Current version

---

## 📋 Badge Checklist

- [ ] CI/CD workflow badge
- [ ] Code coverage badge (Codecov)
- [ ] Language badge
- [ ] License badge
- [ ] Version badge (optional)

---

## 🔧 Setup Instructions

### 1. CI/CD Workflow Badge

**Badge Code**:
```markdown
![CI](https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/workflows/CI/badge.svg)
```

**Setup**:
1. Ensure `.github/workflows/ci.yml` exists
2. Workflow name in YAML must match badge (e.g., `name: CI`)
3. Badge updates automatically on each workflow run

**Verification**:
- Push a commit
- Check Actions tab: `https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/actions`
- Badge should show "passing" or "failing"

---

### 2. Code Coverage Badge (Codecov)

**Badge Code**:
```markdown
[![codecov](https://codecov.io/gh/{{GITHUB_USER}}/{{GITHUB_REPO}}/branch/main/graph/badge.svg)](https://codecov.io/gh/{{GITHUB_USER}}/{{GITHUB_REPO}})
```

**Setup**:

1. **Get Codecov Token**:
   - Go to: `https://codecov.io/gh/{{GITHUB_USER}}/{{GITHUB_REPO}}/settings`
   - Sign in with GitHub
   - Copy the upload token

2. **Add to GitHub Secrets**:
   - Go to: `https://github.com/{{GITHUB_USER}}/{{GITHUB_REPO}}/settings/secrets/actions`
   - Click "New repository secret"
   - Name: `CODECOV_TOKEN`
   - Value: Paste your token
   - Click "Add secret"

3. **Add to .env** (for local testing):
   ```bash
   cp .env.example .env
   # Edit .env and add:
   CODECOV_TOKEN=your_token_here
   ```

4. **Verify CI/CD Integration**:
   - Check `.github/workflows/ci.yml` has Codecov upload step
   - Push a commit
   - Check Codecov dashboard: `https://codecov.io/gh/{{GITHUB_USER}}/{{GITHUB_REPO}}`

**Troubleshooting**:
- Badge shows "unknown": Token not configured or no coverage uploaded yet
- Badge shows "error": Check CI/CD logs for upload errors
- Coverage not updating: Verify tests are running and generating coverage

---

### 3. Language Badge

**Badge Code**:
```markdown
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
```

**Common Languages**:

**JavaScript**:
```markdown
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
```

**Python**:
```markdown
![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python)
```

**Go**:
```markdown
![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)
```

**TypeScript**:
```markdown
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)
```

**Rust**:
```markdown
![Rust](https://img.shields.io/badge/Rust-1.70+-orange?logo=rust)
```

**Setup**:
1. Identify primary language
2. Copy appropriate badge code
3. Update version number to match your requirements
4. Paste into README

---

### 4. License Badge

**Badge Code**:
```markdown
![License](https://img.shields.io/badge/License-MIT-green)
```

**Common Licenses**:

**MIT**:
```markdown
![License](https://img.shields.io/badge/License-MIT-green)
```

**Apache 2.0**:
```markdown
![License](https://img.shields.io/badge/License-Apache%202.0-blue)
```

**GPL v3**:
```markdown
![License](https://img.shields.io/badge/License-GPLv3-blue)
```

**Setup**:
1. Ensure LICENSE file exists in repository root
2. Copy badge code matching your license
3. Paste into README

---

### 5. Version Badge (Optional)

**Badge Code**:
```markdown
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
```

**Setup**:
1. Decide on versioning scheme (e.g., Semantic Versioning)
2. Update badge when releasing new versions
3. Consider using GitHub Releases for version management

---

## 🎨 Badge Customization

### Colors

Common colors:
- `green`: Success, passing, stable
- `blue`: Information, version
- `yellow`: Warning, in progress
- `red`: Error, failing
- `orange`: Attention needed

### Logos

Add logos with `?logo=` parameter:
```markdown
![Badge](https://img.shields.io/badge/Text-Value-color?logo=github)
```

Common logos: `github`, `javascript`, `python`, `go`, `rust`, `docker`, `kubernetes`

Full list: https://simpleicons.org/

---

## ✅ Verification Checklist

After setup, verify:

- [ ] All badges display correctly (not showing "error" or "unknown")
- [ ] Badges link to correct destinations
- [ ] CI badge updates on new commits
- [ ] Coverage badge shows accurate percentage
- [ ] Language badge matches primary language
- [ ] License badge matches LICENSE file
- [ ] All badges are aligned properly in README

---

## 🔗 Resources

- **Shields.io**: https://shields.io/ (badge generator)
- **Codecov**: https://codecov.io/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Simple Icons**: https://simpleicons.org/ (logo library)

---

## 📝 Example README Badge Section

```markdown
# Project Name

![CI](https://github.com/username/repo/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![License](https://img.shields.io/badge/License-MIT-green)

Your project description here...
```

