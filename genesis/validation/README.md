# Genesis Validation

## Purpose

This directory contains validation scripts and reports for ensuring Genesis quality and correctness.

## Contents

### Validation Scripts

1. **`validate-genesis.sh`** (✅ Complete)
   - Comprehensive Genesis validation
   - Checks all templates for correctness
   - Validates documentation
   - Runs linting on all code
   - Generates validation report

### Validation Reports

2. **`../LINTING_VALIDATION_REPORT.md`** (✅ Complete)
   - Shell script linting results
   - JavaScript validation results
   - HTML/CSS validation results
   - Professional standards compliance

3. **`../ASSESSMENT.md`** (✅ Complete)
   - Quality assessment
   - Grading rubric
   - Critical/major/minor issues
   - Improvement recommendations

4. **`../IMPROVEMENT-PLAN.md`** (✅ Complete)
   - Step-by-step improvement plan
   - 9 phases to reach A+ grade
   - Effort estimates
   - Success criteria

## Validation Checks

The validation script performs these checks:

### 1. File Structure
- ✅ All required directories exist
- ✅ All required files exist
- ✅ File naming conventions followed
- ✅ No unexpected files

### 2. Documentation
- ✅ All directories have README.md
- ✅ All hyperlinks work
- ✅ All cross-references valid
- ✅ No hyperbolic language
- ✅ Professional tone

### 3. Code Quality
- ✅ Shell scripts pass shellcheck (0 warnings)
- ✅ JavaScript passes syntax validation
- ✅ HTML validates
- ✅ CSS validates
- ✅ No console.log statements
- ✅ Proper error handling

### 4. Template Variables
- ✅ All variables use `{{VARIABLE}}` format
- ✅ No undefined variables
- ✅ Variables documented
- ✅ Consistent variable names

### 5. Standards Compliance
- ✅ Shell scripts have timer, help, verbose
- ✅ Scripts use common.sh library
- ✅ Documentation follows standards
- ✅ Accessibility features present

## Usage

### Run Full Validation

```bash
cd genesis/validation
./validate-genesis.sh
```

### Run Specific Checks

```bash
# Check shell scripts only
./validate-genesis.sh --shell

# Check documentation only
./validate-genesis.sh --docs

# Check templates only
./validate-genesis.sh --templates

# Verbose output
./validate-genesis.sh -v
```

### Generate Report

```bash
./validate-genesis.sh --report > validation-report.md
```

## Validation Criteria

### Pass Criteria
- All shell scripts: 0 shellcheck warnings
- All JavaScript: 0 syntax errors
- All HTML: Valid HTML5
- All CSS: Valid CSS3
- All links: Resolve correctly
- All directories: Have README.md
- No hyperbolic language found
- All required files present

### Fail Criteria
- Any shellcheck warnings
- Any JavaScript syntax errors
- Any broken links
- Any missing README.md files
- Any hyperbolic language
- Any missing required files

## Continuous Validation

Validation should be run:
- ✅ Before committing changes
- ✅ In CI/CD pipeline
- ✅ Before creating releases
- ✅ After adding new templates
- ✅ After modifying documentation

## Automated Checks

The following checks are automated in CI/CD:

### Pre-commit Hook
```bash
# Runs on every commit
- Shellcheck on modified .sh files
- ESLint on modified .js files
- Link validation on modified .md files
```

### GitHub Actions
```bash
# Runs on every push
- Full validation suite
- Generate validation report
- Fail build if validation fails
```

## Validation Report Format

Reports include:

### Summary
- Total files checked
- Pass/fail status
- Critical issues count
- Warnings count

### Details
- File-by-file results
- Specific errors/warnings
- Line numbers for issues
- Suggested fixes

### Recommendations
- Priority fixes
- Optional improvements
- Best practices

## Related Documentation

- **Quality Standards**: `../05-QUALITY-STANDARDS.md`
- **Assessment**: `../ASSESSMENT.md`
- **Improvement Plan**: `../IMPROVEMENT-PLAN.md`
- **Linting Report**: `../LINTING_VALIDATION_REPORT.md`

## Maintenance

When adding new validation checks:
1. Add check to `validate-genesis.sh`
2. Document check in this README
3. Add to CI/CD pipeline
4. Test check thoroughly
5. Update validation report format
6. Update `../SUMMARY.md`

## Future Enhancements

Planned validation improvements:
- [ ] Automated link checking
- [ ] Template variable validation
- [ ] Cross-reference validation
- [ ] Accessibility testing
- [ ] Performance testing
- [ ] Security scanning

