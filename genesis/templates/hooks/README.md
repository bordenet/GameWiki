# Additional Hooks Templates

## Purpose

This directory contains additional hook templates beyond the standard Git hooks. These hooks provide extended functionality for project automation.

## Status

⚠️ **Currently Empty** - Additional hooks are planned for future implementation.

## Planned Contents

### Pre-push Hook

**`pre-push-template`** - Run tests before pushing

**Checks**:
- All tests pass
- Coverage meets threshold (85%)
- No uncommitted changes
- Branch name follows convention

### Commit-msg Hook

**`commit-msg-template`** - Enforce commit message format

**Format**:
```
type(scope): subject

body

footer
```

**Types**: feat, fix, docs, style, refactor, test, chore

### Post-commit Hook

**`post-commit-template`** - Post-commit automation

**Actions**:
- Update documentation
- Generate changelog
- Update version numbers

### Pre-rebase Hook

**`pre-rebase-template`** - Prevent dangerous rebases

**Checks**:
- Not rebasing main branch
- No uncommitted changes
- Confirm interactive rebase

## Use Cases

### Pre-push Hook
- Prevent pushing broken code
- Ensure tests pass
- Verify coverage threshold
- Check branch naming

### Commit-msg Hook
- Enforce conventional commits
- Generate changelogs automatically
- Improve commit history
- Enable semantic versioning

### Post-commit Hook
- Auto-update documentation
- Trigger local builds
- Update timestamps
- Generate reports

## Installation

When implemented, hooks will be installed via:

```bash
# Automatic (via setup script)
./scripts/setup-macos.sh

# Manual
cp genesis/templates/hooks/pre-push-template .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

## Configuration

Hooks will be configurable via `.hooksrc`:

```bash
# .hooksrc
ENABLE_PRE_PUSH=true
ENABLE_COMMIT_MSG=true
ENABLE_POST_COMMIT=false

# Pre-push settings
RUN_TESTS_ON_PUSH=true
COVERAGE_THRESHOLD=85

# Commit message settings
ENFORCE_CONVENTIONAL_COMMITS=true
ALLOWED_TYPES="feat,fix,docs,style,refactor,test,chore"
```

## Future Implementation

### Pre-push Hook Example

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "Running pre-push checks..."

# Run tests
if ! npm test; then
  echo "❌ Tests failed"
  exit 1
fi

# Check coverage
if ! npm run coverage:check; then
  echo "❌ Coverage below threshold"
  exit 1
fi

echo "✅ Pre-push checks passed"
```

### Commit-msg Hook Example

```bash
#!/usr/bin/env bash
set -euo pipefail

commit_msg=$(cat "$1")

# Check format
if ! echo "$commit_msg" | grep -qE '^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+'; then
  echo "❌ Commit message must follow conventional commits format"
  echo "Format: type(scope): subject"
  echo "Example: feat(api): add user authentication"
  exit 1
fi

echo "✅ Commit message format valid"
```

## Best Practices

### Do's ✅
- Keep hooks fast (< 10 seconds)
- Provide clear error messages
- Allow bypassing in emergencies
- Document hook behavior
- Test hooks thoroughly

### Don'ts ❌
- Don't make hooks too slow
- Don't block all commits
- Don't hide errors
- Don't make hooks too complex
- Don't forget to document

## Related Documentation

- **Git Hooks**: `../git-hooks/README.md`
- **Quality Standards**: `../../05-QUALITY-STANDARDS.md`
- **Quality Enforcement**: `../../QUALITY_ENFORCEMENT.md`

## Contributing

To add hook templates:
1. Create hook template file
2. Add configuration options
3. Update this README
4. Add installation to setup script
5. Test thoroughly
6. Document behavior
7. Update `../../SUMMARY.md`

## Timeline

Additional hooks are planned for:
- **Phase 1** (Q1 2026): Pre-push hook
- **Phase 2** (Q2 2026): Commit-msg hook
- **Phase 3** (Q3 2026): Post-commit hook
- **Phase 4** (Q4 2026): Pre-rebase hook

## Questions?

For now, Genesis provides pre-commit hooks. Additional hooks are coming soon.

If you need additional hooks immediately:
1. Create hooks manually in `.git/hooks/`
2. Make executable: `chmod +x .git/hooks/hook-name`
3. Test thoroughly
4. Share your implementation!

