#!/usr/bin/env bash
#
# PURPOSE:  Set up Dim Lantern development environment on macOS.
# USAGE:    ./scripts/setup-macos.sh [OPTIONS]
# PLATFORM: macOS
# DEPENDENCIES: node (18+), npm
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
readonly REQUIRED_NODE_VERSION=18

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
    setup-macos.sh - Set up Dim Lantern development environment

SYNOPSIS
    ./scripts/setup-macos.sh [OPTIONS]

DESCRIPTION
    Verifies Node.js version, installs dependencies, runs linting and tests.

OPTIONS
    -h, --help       Show this help message and exit
    -v, --verbose    Enable verbose output

EXAMPLES
    ./scripts/setup-macos.sh       # Standard setup
    ./scripts/setup-macos.sh -v    # Setup with verbose output

EXIT STATUS
    0   Success
    1   Failure (missing dependencies or failed checks)

SEE ALSO
    ./scripts/deploy-web.sh - Deploy to GitHub Pages
EOF
    exit 0
}

# -----------------------------------------------------------------------------
# Argument parsing
# -----------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
    case $1 in
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
    log_info "🕯️  Setting up Dim Lantern..."
    log_verbose "Project root: $PROJECT_ROOT"

    # Check for Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js not found. Please install Node.js ${REQUIRED_NODE_VERSION}+ first:"
        echo "   brew install node"
        exit 1
    fi

    local node_version
    node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ "$node_version" -lt "$REQUIRED_NODE_VERSION" ]]; then
        log_error "Node.js ${REQUIRED_NODE_VERSION}+ required. Found: $(node -v)"
        exit 1
    fi

    log_success "Node.js $(node -v)"

    # Install dependencies
    log_info "📦 Installing dependencies..."
    cd "$PROJECT_ROOT/docs"

    if [[ -f "package-lock.json" ]] && [[ -d "node_modules" ]]; then
        # Check if node_modules is up to date
        if [[ "package-lock.json" -nt "node_modules/.package-lock.json" ]] 2>/dev/null; then
            log_verbose "package-lock.json is newer, running npm ci"
            npm ci --silent
        else
            log_verbose "Using cached node_modules"
            echo "   (using cached node_modules)"
        fi
    else
        log_verbose "Fresh install with npm install"
        npm install --silent
    fi

    # Run linting
    log_info "🔍 Running linter..."
    if ! npm run lint --silent; then
        log_warning "Linting issues found. Run 'npm run lint:fix' to auto-fix."
    else
        log_verbose "Linting passed"
    fi

    # Run tests
    log_info "🧪 Running tests..."
    npm test --silent
    log_verbose "Tests passed"

    echo ""
    log_success "Setup complete!"
    echo ""
    echo "To start developing:"
    echo "  cd docs && python3 -m http.server 8000"
    echo "  Open http://localhost:8000"
}

main "$@"
