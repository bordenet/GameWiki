#!/usr/bin/env bash
################################################################################
# deploy-web.sh - Deploy hello-world to GitHub Pages
#
# REFERENCE IMPLEMENTATION:
#     https://github.com/bordenet/product-requirements-assistant/blob/main/scripts/deploy-web.sh
#     Study the reference implementation for proper compact mode handling!
#
# SYNOPSIS
#     ./scripts/deploy-web.sh [OPTIONS]
#
# DESCRIPTION
#     Deploys the web application to GitHub Pages with quality checks.
#
#     Steps performed:
#     1. Run linting (npm run lint)
#     2. Run tests (npm test)
#     3. Verify coverage threshold
#     4. Commit and push to GitHub
#     5. Verify GitHub Pages deployment
#     6. Display deployment URL
#
# OPTIONS
#     --skip-tests    Skip running tests (NOT RECOMMENDED)
#     --skip-lint     Skip linting (NOT RECOMMENDED)
#     -v, --verbose   Show detailed output
#     -h, --help      Display this help message
#
# EXAMPLES
#     # Standard deployment
#     ./scripts/deploy-web.sh
#
#     # Verbose mode
#     ./scripts/deploy-web.sh --verbose
#
# EXIT CODES
#     0   Deployment successful
#     1   Deployment failed (linting, tests, or push failed)
#
################################################################################

set -euo pipefail

# Source common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

################################################################################
# Configuration
################################################################################

PROJECT_NAME="hello-world"
GITHUB_USER="bordenet"
GITHUB_REPO="hello-world"
GITHUB_PAGES_URL="https://bordenet.github.io/hello-world/"

SKIP_TESTS=false
SKIP_LINT=false

################################################################################
# Functions
################################################################################

show_help() {
    sed -n '2,/^$/p' "$0" | sed 's/^# \?//'
}

run_lint() {
    log_step "Running linting checks"

    if [[ "$SKIP_LINT" == "true" ]]; then
        log_warning "Skipping linting (--skip-lint flag)"
        return 0
    fi

    # Run lint (show output in verbose mode, hide in compact mode)
    if [[ "${VERBOSE:-false}" == "true" ]]; then
        npm run lint || { log_error "Linting failed"; return 1; }
    else
        npm run lint >/dev/null 2>&1 || { log_error "Linting failed. Run 'npm run lint' to see errors."; log_info "Fix errors with: npm run lint:fix"; return 1; }
    fi

    log_step_done "Linting passed"
}

run_tests() {
    log_step "Running tests"

    if [[ "$SKIP_TESTS" == "true" ]]; then
        log_warning "Skipping tests (--skip-tests flag)"
        return 0
    fi

    # Run tests (show output in verbose mode, hide in compact mode)
    if [[ "${VERBOSE:-false}" == "true" ]]; then
        NODE_OPTIONS=--experimental-vm-modules npm test || { log_error "Tests failed"; return 1; }
    else
        NODE_OPTIONS=--experimental-vm-modules npm test >/dev/null 2>&1 || { log_error "Tests failed. Run 'npm test' to see errors."; return 1; }
    fi

    log_step_done "Tests passed"
}

check_coverage() {
    log_step "Checking test coverage"

    if [[ "$SKIP_TESTS" == "true" ]]; then
        log_warning "Skipping coverage check (tests skipped)"
        return 0
    fi

    # Run coverage (show output in verbose mode, hide in compact mode)
    if [[ "${VERBOSE:-false}" == "true" ]]; then
        NODE_OPTIONS=--experimental-vm-modules npm run test:coverage || { log_error "Coverage check failed"; return 1; }
    else
        NODE_OPTIONS=--experimental-vm-modules npm run test:coverage >/dev/null 2>&1 || { log_error "Coverage check failed"; return 1; }
    fi

    log_step_done "Coverage check passed"
}

deploy_to_github() {
    log_step "Deploying to GitHub"

    # Check if there are changes to commit
    if git diff --quiet && git diff --cached --quiet; then
        log_info "No changes to commit"
    else
        # Stage changes (redirect output in compact mode)
        if [[ "${VERBOSE:-false}" == "true" ]]; then
            git add .
        else
            git add . >/dev/null 2>&1
        fi

        # Commit (redirect output in compact mode)
        local commit_msg
        commit_msg="Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
        if [[ "${VERBOSE:-false}" == "true" ]]; then
            git commit -m "$commit_msg" || true
        else
            git commit -m "$commit_msg" >/dev/null 2>&1 || true
        fi
    fi

    # Push to GitHub (redirect output in compact mode)
    if [[ "${VERBOSE:-false}" == "true" ]]; then
        git push origin main || { log_error "Failed to push to GitHub"; return 1; }
    else
        git push origin main >/dev/null 2>&1 || { log_error "Failed to push to GitHub"; return 1; }
    fi

    log_step_done "Pushed to GitHub"
}

verify_deployment() {
    log_step "Verifying GitHub Pages deployment"
    
    log_info "Waiting for GitHub Pages to update (this may take 1-2 minutes)..."
    sleep 10
    
    # Check if site is accessible
    if curl -s -o /dev/null -w "%{http_code}" "$GITHUB_PAGES_URL" | grep -q "200"; then
        log_step_done "Deployment verified"
    else
        log_warning "Site may still be deploying. Check manually in a few minutes."
    fi
}

################################################################################
# Main
################################################################################

main() {
    log_header "Deploying $PROJECT_NAME to GitHub Pages"
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-lint)
                SKIP_LINT=true
                shift
                ;;
            -v|--verbose)
                export VERBOSE=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # Start timer
    start_timer

    # Run quality checks
    run_lint || exit 1
    run_tests || exit 1
    check_coverage || exit 1

    # Deploy
    deploy_to_github || exit 1
    verify_deployment

    # Success
    stop_timer
    echo ""
    log_success "Deployment complete!"
    echo ""
    echo "  📦 Project: $PROJECT_NAME"
    echo "  🔗 URL: $GITHUB_PAGES_URL"
    echo "  ⏱️  Total time: $(format_duration $SECONDS)"
    echo ""
    log_info "Note: GitHub Pages may take 1-2 minutes to fully update."
    log_info "Check deployment status: https://github.com/$GITHUB_USER/$GITHUB_REPO/deployments"
    echo ""
}

main "$@"

