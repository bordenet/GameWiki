#!/usr/bin/env bash
#
# PURPOSE:  Deploy Dim Lantern web app to GitHub Pages with quality gates.
# USAGE:    ./scripts/deploy-web.sh [OPTIONS]
# PLATFORM: macOS, Linux
# DEPENDENCIES: node, npm, git
#
# Last Updated: 2024-11-28
# Style Guide:  https://github.com/bordenet/scripts/blob/main/STYLE_GUIDE.md

set -euo pipefail

# Resolve symlinks to get actual script location
SCRIPT_PATH="${BASH_SOURCE[0]}"
while [ -L "$SCRIPT_PATH" ]; do
    SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
    SCRIPT_PATH="$(readlink "$SCRIPT_PATH")"
    [[ "$SCRIPT_PATH" != /* ]] && SCRIPT_PATH="$SCRIPT_DIR/$SCRIPT_PATH"
done
SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"
readonly SCRIPT_DIR

PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
readonly PROJECT_ROOT

SKIP_TESTS=false
VERBOSE=false

# -----------------------------------------------------------------------------
# Logging helpers
# -----------------------------------------------------------------------------
log_info()    { echo "ℹ️  $*"; }
log_success() { echo "✅ $*"; }
log_warning() { echo "⚠️  $*"; }
log_error()   { echo "❌ $*" >&2; }
log_verbose() { [[ "$VERBOSE" == "true" ]] && echo "   $*" || true; }

# -----------------------------------------------------------------------------
# Help
# -----------------------------------------------------------------------------
show_help() {
    cat << EOF
NAME
    deploy-web.sh - Deploy Dim Lantern to GitHub Pages

SYNOPSIS
    ./scripts/deploy-web.sh [OPTIONS]

DESCRIPTION
    Runs linting and tests, then commits and pushes to GitHub for deployment.

OPTIONS
    -h, --help       Show this help message and exit
    -v, --verbose    Enable verbose output
    --skip-tests     Skip running tests (emergency only)

EXAMPLES
    ./scripts/deploy-web.sh              # Full deploy with all checks
    ./scripts/deploy-web.sh -v           # Deploy with verbose output
    ./scripts/deploy-web.sh --skip-tests # Skip tests (not recommended)

EXIT STATUS
    0   Success
    1   Failure (linting, tests, or git operations failed)

SEE ALSO
    ./scripts/setup-macos.sh - Development environment setup
EOF
    exit 0
}

# -----------------------------------------------------------------------------
# Argument parsing
# -----------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            show_help
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Use --help for usage information."
            exit 1
            ;;
    esac
done

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
main() {
    log_info "🕯️  Deploying Dim Lantern..."
    log_verbose "Project root: $PROJECT_ROOT"

    cd "$PROJECT_ROOT/docs"

    # Run linting
    log_info "🔍 Running linter..."
    if ! npm run lint; then
        log_error "Linting failed. Fix errors before deploying."
        exit 1
    fi
    log_verbose "Linting passed"

    # Run tests (unless skipped)
    if [[ "$SKIP_TESTS" == "false" ]]; then
        log_info "🧪 Running tests..."
        if ! npm test; then
            log_error "Tests failed. Fix tests before deploying."
            exit 1
        fi
        log_verbose "Tests passed"
    else
        log_warning "Skipping tests (--skip-tests flag)"
    fi

    # Check for uncommitted changes
    cd "$PROJECT_ROOT"
    if [[ -n "$(git status --porcelain)" ]]; then
        log_info "📝 Staging changes..."
        git add -A
        log_verbose "Changes staged"

        log_info "💾 Committing..."
        local timestamp
        timestamp=$(date +"%Y-%m-%d %H:%M:%S")
        git commit -m "Deploy: $timestamp"
        log_verbose "Committed at $timestamp"
    else
        log_verbose "No uncommitted changes"
    fi

    # Push to GitHub
    log_info "🚀 Pushing to GitHub..."
    git push
    log_verbose "Pushed to origin"

    echo ""
    log_success "Deployment complete!"
    echo "🌐 Live at: https://bordenet.github.io/GameWiki/"
}

main "$@"
