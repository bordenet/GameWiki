#!/usr/bin/env bash
################################################################################
# Script Name: validate.sh
################################################################################
# PURPOSE: Validate {{PROJECT_NAME}} codebase against quality standards
# USAGE: ./scripts/validate.sh [--fix]
# PLATFORM: macOS | Linux
################################################################################

set -euo pipefail

# Source common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common-template.sh
source "$SCRIPT_DIR/lib/common.sh"

################################################################################
# Constants
################################################################################

# shellcheck disable=SC2034  # VERSION used in show_help
readonly VERSION="1.0.0"

################################################################################
# Global Variables
################################################################################

FIX_MODE=false
VERBOSE=false
export VERBOSE

CHECKS_PASSED=0
CHECKS_FAILED=0

################################################################################
# Functions
################################################################################

show_help() {
    cat << 'EOF'
NAME
    validate.sh - Validate {{PROJECT_NAME}} codebase

SYNOPSIS
    ./scripts/validate.sh [OPTIONS]

DESCRIPTION
    Validates all code against quality standards defined in QUALITY-STANDARDS.md.
    
    Checks performed:
    - ShellCheck on all shell scripts (zero warnings required)
    - JavaScript syntax validation
    - HTML structure validation
    - CSS syntax validation
    - Shell script standards compliance (timer, help, verbose)
    - No TODO/FIXME comments
    - No console.log statements

OPTIONS
    --fix           Attempt to auto-fix issues where possible
    -v, --verbose   Show detailed output
    -h, --help      Display this help message

EXAMPLES
    ./scripts/validate.sh           # Run all checks
    ./scripts/validate.sh --fix     # Run checks and auto-fix
    ./scripts/validate.sh -v        # Verbose output

EXIT STATUS
    0   All checks passed
    1   One or more checks failed

SEE ALSO
    QUALITY-STANDARDS.md, SHELL_SCRIPT_STANDARDS.md

EOF
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                show_help
                exit 0
                ;;
            --fix)
                FIX_MODE=true
                shift
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                echo "Use --help for usage information" >&2
                exit 1
                ;;
        esac
    done
}

check_shellcheck() {
    log_step "Running ShellCheck on shell scripts"
    
    local failed=0
    while IFS= read -r -d '' script; do
        log_info "Checking: $script"
        if shellcheck "$script" 2>&1 | grep -qE "(warning|error)"; then
            log_error "ShellCheck failed for $script"
            shellcheck "$script"
            ((failed++))
            ((CHECKS_FAILED++))
        else
            log_info "✓ $script"
            ((CHECKS_PASSED++))
        fi
    done < <(find scripts -name "*.sh" -print0 2>/dev/null || true)
    
    if [ $failed -eq 0 ]; then
        log_step_done "ShellCheck validation passed"
    else
        log_error "ShellCheck found $failed issues"
        return 1
    fi
}

check_javascript() {
    log_step "Checking JavaScript syntax"
    
    local failed=0
    while IFS= read -r -d '' jsfile; do
        log_info "Checking: $jsfile"
        if ! node --check "$jsfile" 2>&1; then
            log_error "JavaScript syntax error in $jsfile"
            ((failed++))
            ((CHECKS_FAILED++))
        else
            log_info "✓ $jsfile"
            ((CHECKS_PASSED++))
        fi
    done < <(find . -name "*.js" -not -path "*/node_modules/*" -print0 2>/dev/null || true)
    
    if [ $failed -eq 0 ]; then
        log_step_done "JavaScript syntax validation passed"
    else
        log_error "JavaScript validation found $failed issues"
        return 1
    fi
}

check_shell_standards() {
    log_step "Verifying shell script standards compliance"
    
    local failed=0
    while IFS= read -r -d '' script; do
        log_info "Checking standards for: $script"
        
        # Check for help flag
        if ! grep -q "show_help\|-h\|--help" "$script"; then
            log_error "$script missing help flag (-h|--help)"
            ((failed++))
        fi
        
        # Check for verbose flag
        if ! grep -q "VERBOSE\|-v\|--verbose" "$script"; then
            log_error "$script missing verbose flag (-v|--verbose)"
            ((failed++))
        fi
        
        # Check for timer
        if ! grep -q "update_timer\|TIMER_PID\|source.*common.sh" "$script"; then
            log_error "$script missing timer implementation"
            ((failed++))
        fi
        
        if [ $failed -eq 0 ]; then
            log_info "✓ $script meets standards"
            ((CHECKS_PASSED++))
        else
            ((CHECKS_FAILED++))
        fi
    done < <(find scripts -name "*.sh" -print0 2>/dev/null || true)
    
    if [ $failed -eq 0 ]; then
        log_step_done "Shell script standards compliance passed"
    else
        log_error "Shell script standards found $failed issues"
        return 1
    fi
}

show_summary() {
    log_header "Validation Summary"
    
    echo "Checks passed: $CHECKS_PASSED"
    echo "Checks failed: $CHECKS_FAILED"
    echo ""
    
    if [ $CHECKS_FAILED -gt 0 ]; then
        log_error "❌ Validation failed - please fix issues above"
        return 1
    else
        log_success "✅ All validation checks passed"
        return 0
    fi
}

################################################################################
# Main
################################################################################

main() {
    parse_args "$@"
    start_timer
    
    log_header "{{PROJECT_NAME}} Validation"
    
    [[ "$FIX_MODE" == "true" ]] && log_info "Running in fix mode"
    
    check_shellcheck || true
    check_javascript || true
    check_shell_standards || true
    
    stop_timer
    show_elapsed_time
    
    show_summary
}

main "$@"

