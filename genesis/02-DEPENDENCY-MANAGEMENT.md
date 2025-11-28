# Dependency Management - MANDATORY RULES

**CRITICAL**: Read this document before adding ANY dependency to a Genesis-based project.

---

## 🚨 THE IRON LAW OF DEPENDENCIES

### **EVERY dependency MUST be added to `./scripts/setup-*.sh`**

This is **NOT optional**. This is **NOT a suggestion**. This is an **ABSOLUTE REQUIREMENT**.

---

## What is a Dependency?

A dependency is **ANYTHING** required for the project to function that is not included in the repository:

### System Dependencies
- ✅ Homebrew packages (e.g., `git`, `node`, `python`)
- ✅ System libraries (e.g., `libpq`, `imagemagick`)
- ✅ Command-line tools (e.g., `jq`, `curl`, `shellcheck`)
- ✅ Database servers (e.g., PostgreSQL, Redis)
- ✅ Runtime environments (e.g., Python 3.11, Node.js 20)

### Language Dependencies
- ✅ Python packages (e.g., `requests`, `flask`, `pytest`)
- ✅ Node.js packages (e.g., `express`, `react`, `jest`)
- ✅ Ruby gems (e.g., `rails`, `rspec`)
- ✅ Go modules (e.g., `github.com/gin-gonic/gin`)
- ✅ Rust crates (e.g., `serde`, `tokio`)

### Development Dependencies
- ✅ Linters (e.g., `eslint`, `pylint`, `rubocop`)
- ✅ Formatters (e.g., `prettier`, `black`, `rustfmt`)
- ✅ Testing frameworks (e.g., `jest`, `pytest`, `rspec`)
- ✅ Build tools (e.g., `webpack`, `vite`, `cargo`)
- ✅ Pre-commit hooks (e.g., `pre-commit` framework)

### External Services (Development)
- ✅ API keys for development (documented in setup script)
- ✅ Local service configuration (e.g., Docker containers)
- ✅ Environment variable setup

---

## The Workflow - MANDATORY

### When Adding a New Dependency

**EVERY TIME** you add a dependency, you **MUST** follow this workflow:

```
1. Identify the need for a dependency
2. Add it to the appropriate package file (package.json, requirements.txt, etc.)
3. ⚠️  IMMEDIATELY update ./scripts/setup-macos.sh (or setup-linux.sh)
4. Test the setup script on a clean system (or clean virtual environment)
5. Commit BOTH the package file AND the setup script together
```

### Example: Adding a Python Dependency

```bash
# 1. Add to requirements.txt
echo "requests==2.31.0" >> requirements.txt

# 2. IMMEDIATELY update setup-macos.sh
# Add to the install_dependencies() function:
#   pip install -r requirements.txt

# 3. Test the setup script
./scripts/setup-macos.sh -y

# 4. Commit both files together
git add requirements.txt scripts/setup-macos.sh
git commit -m "Add requests dependency"
```

### Example: Adding a Node.js Dependency

```bash
# 1. Add to package.json
npm install --save express

# 2. IMMEDIATELY update setup-macos.sh
# Verify install_dependencies() includes:
#   npm ci

# 3. Test the setup script
./scripts/setup-macos.sh -y

# 4. Commit both files together
git add package.json package-lock.json scripts/setup-macos.sh
git commit -m "Add express dependency"
```

### Example: Adding a System Dependency

```bash
# 1. Identify system dependency (e.g., PostgreSQL)

# 2. IMMEDIATELY update setup-macos.sh
# Add to install_system_dependencies() function:
#   brew install postgresql@15

# 3. Test the setup script
./scripts/setup-macos.sh -y

# 4. Commit the setup script
git add scripts/setup-macos.sh
git commit -m "Add PostgreSQL system dependency"
```

---

## Why This Matters

### Without This Rule:
- ❌ New team members cannot set up the project
- ❌ CI/CD pipelines break mysteriously
- ❌ "Works on my machine" syndrome
- ❌ Hours wasted debugging missing dependencies
- ❌ Project becomes unmaintainable

### With This Rule:
- ✅ New team members run ONE command: `./scripts/setup-macos.sh`
- ✅ CI/CD pipelines are reproducible
- ✅ Everyone has identical development environments
- ✅ Zero time wasted on dependency issues
- ✅ Project remains maintainable

---

## AI Assistant Instructions

### When User Asks to Add a Feature

**BEFORE** implementing the feature, ask yourself:
1. Does this feature require a new dependency?
2. If YES → **STOP**
3. Identify ALL dependencies needed
4. Update `./scripts/setup-*.sh` FIRST
5. Then implement the feature
6. Test the setup script
7. Commit setup script AND feature code together

### When You Realize a Dependency is Needed

**IMMEDIATELY**:
1. Tell the user: "This requires dependency X. I will add it to setup-macos.sh."
2. Update `./scripts/setup-*.sh`
3. Show the user the changes
4. Proceed with implementation

### Example Dialogue

```
User: "Add support for PDF generation"

AI: "PDF generation requires the `reportlab` Python library. 
     I will add this to requirements.txt and update 
     scripts/setup-macos.sh to install it."

AI: [Updates requirements.txt]
AI: [Updates scripts/setup-macos.sh]
AI: [Shows both changes]
AI: "Setup script updated. New users can now run 
     ./scripts/setup-macos.sh to get all dependencies 
     including reportlab."

AI: [Proceeds with PDF generation implementation]
```

---

## Verification Checklist

Before committing ANY code that uses a new dependency:

- [ ] Dependency added to package file (package.json, requirements.txt, etc.)
- [ ] **`./scripts/setup-macos.sh` updated with installation steps**
- [ ] **`./scripts/setup-linux.sh` updated (if project supports Linux)**
- [ ] Setup script tested on clean environment
- [ ] Setup script passes shellcheck
- [ ] README.md updated with new dependency (if user-facing)
- [ ] Both package file AND setup script committed together

---

## Common Mistakes - DO NOT DO THIS

### ❌ WRONG: Add dependency, forget setup script
```bash
npm install express
git add package.json package-lock.json
git commit -m "Add express"
# ❌ setup-macos.sh not updated!
```

### ❌ WRONG: Manual installation instructions in README
```markdown
## Setup
1. Install Node.js 20
2. Install PostgreSQL
3. Run `npm install`
```
**Problem**: Requires manual steps. Use setup script instead!

### ❌ WRONG: Assume dependency is already installed
```python
import requests  # ❌ Not in requirements.txt or setup script!
```

### ✅ CORRECT: Add dependency everywhere
```bash
# 1. Add to requirements.txt
echo "requests==2.31.0" >> requirements.txt

# 2. Update setup-macos.sh
# (Add pip install -r requirements.txt to install_dependencies())

# 3. Commit together
git add requirements.txt scripts/setup-macos.sh
git commit -m "Add requests dependency"
```

---

## Summary

### THE RULE (Memorize This)

**EVERY dependency MUST be in `./scripts/setup-*.sh`**

No exceptions. No excuses. No "I'll add it later."

### The Test

Can a new developer run this command and have a working environment?
```bash
./scripts/setup-macos.sh -y
```

If the answer is NO, you have violated the Iron Law of Dependencies.

---

**Last Updated**: 2025-11-20  
**Status**: MANDATORY FOR ALL GENESIS PROJECTS

