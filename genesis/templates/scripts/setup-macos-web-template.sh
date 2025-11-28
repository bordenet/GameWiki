#!/usr/bin/env bash
# {{PROJECT_NAME}} - macOS Setup Script
# Optimized for minimal vertical space with running timer
#
# REFERENCE IMPLEMENTATION:
#     https://github.com/bordenet/product-requirements-assistant/blob/main/scripts/setup-macos.sh
#     Study the reference implementation for proper compact mode handling!

set -euo pipefail

# Source compact output library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/compact.sh"

# Parse command line arguments
# shellcheck disable=SC2034
AUTO_YES=false
FORCE_INSTALL=false
while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--verbose)
            export VERBOSE=1
            shift
            ;;
        -y|--yes)
            AUTO_YES=true
            shift
            ;;
        -f|--force)
            FORCE_INSTALL=true
            shift
            ;;
        -h|--help)
            cat << EOF
Usage: $(basename "$0") [OPTIONS]

Setup script for macOS - Installs all dependencies for {{PROJECT_NAME}}

OPTIONS:
  -v, --verbose    Show detailed output (default: compact)
  -y, --yes        Automatically answer yes to prompts
  -f, --force      Force reinstall all dependencies
  -h, --help       Show this help message

EXAMPLES:
  $(basename "$0")              # Fast setup, only install missing items
  $(basename "$0") -v           # Verbose output
  $(basename "$0") -f           # Force reinstall everything
  $(basename "$0") -v -f        # Verbose + force reinstall

PERFORMANCE:
  First run:  ~2-3 minutes (installs everything)
  Subsequent: ~5-10 seconds (checks only, skips installed)

EOF
            exit 0
            ;;
        *)
            echo "Error: Unknown option: $1"
            echo "Run '$(basename "$0") --help' for usage information"
            exit 1
            ;;
    esac
done

# Navigate to project root
cd "$SCRIPT_DIR/.."
PROJECT_ROOT=$(pwd)

print_header "{{PROJECT_NAME}} - macOS Setup"

# Cache file for tracking installed packages
CACHE_DIR="$PROJECT_ROOT/.setup-cache"
mkdir -p "$CACHE_DIR"

# Helper: Check if package is cached
is_cached() {
    local pkg="$1"
    [[ -f "$CACHE_DIR/$pkg" ]] && [[ $FORCE_INSTALL == false ]]
}

# Helper: Mark package as cached
mark_cached() {
    local pkg="$1"
    touch "$CACHE_DIR/$pkg"
}

# Step 1: System dependencies
task_start "Checking system dependencies"

# Check Homebrew
if ! command -v brew &>/dev/null; then
    task_fail "Homebrew not installed"
    echo "Install Homebrew from: https://brew.sh/"
    exit 1
fi
verbose "Homebrew $(brew --version | head -1)"

# Check Node.js
if ! command -v node &>/dev/null; then
    task_start "Installing Node.js"
    if [[ ${VERBOSE:-0} -eq 1 ]]; then
        brew install node
    else
        brew install node >/dev/null 2>&1
    fi
    mark_cached "node"
    task_ok "Node.js installed"
else
    verbose "Node.js $(node --version)"
fi

task_ok "System dependencies ready"

# Step 2: NPM dependencies (smart check)
PACKAGE_HASH=$(md5 -q package.json 2>/dev/null || echo "none")
if [[ $FORCE_INSTALL == true ]] || ! is_cached "npm-deps-$PACKAGE_HASH"; then
    task_start "Installing NPM dependencies"
    if [[ ${VERBOSE:-0} -eq 1 ]]; then
        npm install
    else
        npm install >/dev/null 2>&1
    fi
    mark_cached "npm-deps-$PACKAGE_HASH"
    task_ok "NPM dependencies installed"
else
    task_skip "NPM dependencies"
fi

# Step 3: Quick validation
task_start "Validating setup"
if [[ ${VERBOSE:-0} -eq 1 ]]; then
    npm run lint
else
    npm run lint >/dev/null 2>&1
fi
task_ok "Setup validated"

# Done
echo ""
print_header "✓ Setup complete! $(get_elapsed_time)"
echo ""
echo "Next steps:"
echo "  npm test              # Run tests"
echo "  npm run lint          # Run linter"
echo "  ./scripts/deploy-web.sh  # Deploy to GitHub Pages"
echo ""
echo "Run with -v for verbose output, -f to force reinstall"

