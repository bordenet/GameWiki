#!/usr/bin/env bash
################################################################################
# {{PROJECT_NAME}} - Validate Genesis Setup
#
# PURPOSE: Verify that Genesis template setup was completed correctly
#   - Checks that all template variables were replaced
#   - Verifies required files exist
#   - Validates git hooks are installed
#   - Ensures no critical configuration was removed
#
# USAGE:
#   ./scripts/validate-genesis-setup.sh
#   ./scripts/validate-genesis-setup.sh -v    # Verbose output
#
# EXIT CODES:
#   0 - All validations passed
#   1 - One or more validations failed
#
# REFERENCE IMPLEMENTATION:
#   https://github.com/bordenet/genesis
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0

# Verbose mode
VERBOSE=false
if [[ "$1" == "-v" ]] || [[ "$1" == "--verbose" ]]; then
    VERBOSE=true
fi

log_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
    ((ERRORS++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
    ((WARNINGS++))
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_info() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo "ℹ️  $1"
    fi
}

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Validating Genesis Setup for {{PROJECT_NAME}}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check 1: Template variables replaced
echo "Checking for unreplaced template variables..."
TEMPLATE_VARS=$(grep -r "{{" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=htmlcov --exclude="*.log" 2>/dev/null || true)
if [[ -n "$TEMPLATE_VARS" ]]; then
    log_error "Found unreplaced template variables:"
    echo "$TEMPLATE_VARS"
else
    log_success "All template variables replaced"
fi

# Check 2: Required files exist
echo ""
echo "Checking required files..."
REQUIRED_FILES=(
    "package.json"
    "README.md"
    ".gitignore"
    ".env.example"
    "jest.config.js"
    "jest.setup.js"
    ".github/workflows/tests.yml"
    "scripts/install-hooks.sh"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        log_info "Found: $file"
    else
        log_error "Missing required file: $file"
    fi
done

# Check 3: Git hooks installed
echo ""
echo "Checking git hooks..."
if [[ -f ".git/hooks/pre-commit" ]]; then
    if [[ -x ".git/hooks/pre-commit" ]]; then
        log_success "Pre-commit hook installed and executable"
    else
        log_warning "Pre-commit hook exists but is not executable"
        echo "  Fix: chmod +x .git/hooks/pre-commit"
    fi
else
    log_warning "Pre-commit hook not installed"
    echo "  Fix: ./scripts/install-hooks.sh"
fi

# Check 4: Scripts are executable
echo ""
echo "Checking script permissions..."
if [[ -d "scripts" ]]; then
    NON_EXECUTABLE=$(find scripts -name "*.sh" ! -perm -111 2>/dev/null || true)
    if [[ -n "$NON_EXECUTABLE" ]]; then
        log_warning "Found non-executable scripts:"
        echo "$NON_EXECUTABLE"
        echo "  Fix: chmod +x scripts/*.sh scripts/lib/*.sh"
    else
        log_success "All scripts are executable"
    fi
fi

# Check 5: Dependencies installed
echo ""
echo "Checking dependencies..."
if [[ -d "node_modules" ]]; then
    log_success "node_modules directory exists"
else
    log_warning "node_modules not found"
    echo "  Fix: npm install"
fi

# Check 6: Critical configuration not removed
echo ""
echo "Checking critical configuration..."
CRITICAL_CONFIG=(
    "jest.config.js:coverageThreshold"
    "package.json:scripts"
    ".github/workflows/tests.yml:coverage"
)

for config in "${CRITICAL_CONFIG[@]}"; do
    file="${config%%:*}"
    pattern="${config##*:}"
    if [[ -f "$file" ]]; then
        if grep -q "$pattern" "$file"; then
            log_info "Found $pattern in $file"
        else
            log_error "Missing critical config: $pattern in $file"
        fi
    fi
done

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ $ERRORS -eq 0 ]] && [[ $WARNINGS -eq 0 ]]; then
    echo -e "${GREEN}✅ All validations passed!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
elif [[ $ERRORS -eq 0 ]]; then
    echo -e "${YELLOW}⚠️  Validation completed with $WARNINGS warning(s)${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 0
else
    echo -e "${RED}❌ Validation failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    exit 1
fi

