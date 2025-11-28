# Git Hooks Templates

## Purpose

This directory contains Git hook templates that enforce quality standards before commits and pushes.

## Contents

### Pre-commit Hook

**`pre-commit-template`** (✅ Complete)

Runs before every commit to enforce quality gates:

**Checks Performed**:
1. **ShellCheck** - All `.sh` files must pass with 0 warnings
2. **ESLint** - All `.js` files must pass linting
3. **Syntax Validation** - JavaScript syntax must be valid
4. **No Debug Code** - No `console.log`, `debugger`, `TODO` in staged files
5. **File Size** - No files > 1MB (prevents accidental large file commits)
6. **Trailing Whitespace** - No trailing whitespace in code files

**Behavior**:
- ✅ Pass: Commit proceeds
- ❌ Fail: Commit blocked with error message
- ⊘ Skip: Use `git commit --no-verify` (not recommended)

## Installation

### Automatic (via setup script)

The `scripts/setup-macos.sh` script automatically installs hooks:

```bash
./scripts/setup-macos.sh
```

### Manual Installation

```bash
# Copy hook to .git/hooks/
cp templates/git-hooks/pre-commit-template .git/hooks/pre-commit

# Make executable
chmod +x .git/hooks/pre-commit

# Test
git commit -m "test" --allow-empty
```

## Usage

### Normal Workflow

```bash
# Make changes
vim file.js

# Stage changes
git add file.js

# Commit (hook runs automatically)
git commit -m "Update file"

# If hook fails, fix issues and retry
```

### Bypass Hook (Emergency Only)

```bash
# Skip pre-commit hook (NOT RECOMMENDED)
git commit --no-verify -m "Emergency fix"
```

**Warning**: Only bypass hooks in true emergencies. Bypassing quality gates leads to technical debt.

## Hook Configuration

### Customize Checks

Edit `.git/hooks/pre-commit` to customize:

```bash
# Disable specific checks
SKIP_SHELLCHECK=false
SKIP_ESLINT=false
SKIP_SYNTAX_CHECK=false
SKIP_DEBUG_CHECK=false

# Adjust thresholds
MAX_FILE_SIZE_MB=1
```

### Add Custom Checks

```bash
# Add to pre-commit hook
echo "Running custom check..."
if ! ./scripts/custom-check.sh; then
  echo "❌ Custom check failed"
  exit 1
fi
```

## Quality Standards

The pre-commit hook enforces these standards:

### Shell Scripts
- ✅ Pass shellcheck with 0 warnings
- ✅ Executable bit set (`chmod +x`)
- ✅ Shebang present (`#!/usr/bin/env bash`)
- ✅ No trailing whitespace

### JavaScript
- ✅ Valid syntax (`node --check`)
- ✅ Pass ESLint (if configured)
- ✅ No `console.log` statements
- ✅ No `debugger` statements
- ✅ No `TODO` comments

### All Files
- ✅ No files > 1MB
- ✅ No trailing whitespace
- ✅ LF line endings (not CRLF)

## Troubleshooting

### Hook Not Running

```bash
# Check if hook exists
ls -la .git/hooks/pre-commit

# Check if executable
chmod +x .git/hooks/pre-commit

# Test manually
.git/hooks/pre-commit
```

### Hook Fails Incorrectly

```bash
# Run checks manually
shellcheck scripts/*.sh
node --check web/js/*.js

# Check for false positives
git diff --cached --name-only
```

### Hook Too Slow

```bash
# Only check staged files (default behavior)
# If still slow, disable expensive checks:
SKIP_ESLINT=true git commit -m "message"
```

## Best Practices

### Do's ✅
- Run hooks on every commit
- Fix issues immediately
- Keep hooks fast (< 5 seconds)
- Test hooks after modifying
- Document custom checks

### Don'ts ❌
- Don't bypass hooks regularly
- Don't commit broken code
- Don't disable all checks
- Don't make hooks too slow
- Don't ignore hook failures

## Related Documentation

- **Quality Standards**: `../../05-QUALITY-STANDARDS.md`
- **Quality Enforcement**: `../../QUALITY_ENFORCEMENT.md`
- **Shell Script Standards**: `../docs/SHELL_SCRIPT_STANDARDS-template.md`

## Maintenance

When modifying hook templates:
1. Test on actual repository
2. Verify all checks work
3. Ensure performance is acceptable
4. Update this README
5. Update installation instructions
6. Update `../../SUMMARY.md`

## Future Enhancements

Planned hook improvements:
- [ ] Pre-push hook (run tests before push)
- [ ] Commit-msg hook (enforce commit message format)
- [ ] Post-commit hook (update documentation)
- [ ] Parallel check execution (faster)

