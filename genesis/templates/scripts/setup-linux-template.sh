#!/usr/bin/env bash
# {{PROJECT_NAME}} - Linux Setup Script
# Optimized for minimal vertical space with running timer
#
# REFERENCE IMPLEMENTATION:
#     https://github.com/bordenet/product-requirements-assistant/blob/main/scripts/setup-linux.sh
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

Setup script for Linux (Ubuntu/Debian) - Installs all dependencies for {{PROJECT_NAME}}

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

print_header "{{PROJECT_NAME}} - Linux Setup"

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

# Update apt cache only if needed (once per day)
if [[ $FORCE_INSTALL == true ]] || ! is_cached "apt-updated-$(date +%Y%m%d)"; then
    verbose "Updating package list..."
    sudo apt-get update -qq 2>&1 | verbose
    mark_cached "apt-updated-$(date +%Y%m%d)"
fi

# Check Node.js
if ! command -v node &>/dev/null; then
    task_start "Installing Node.js"
    verbose "Installing Node.js via NodeSource..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - 2>&1 | verbose
    sudo apt-get install -y nodejs 2>&1 | verbose
    task_complete "Node.js installed"
else
    verbose "Node.js $(node --version)"
fi

# Check npm
if ! command -v npm &>/dev/null; then
    task_fail "npm not found (should be installed with Node.js)"
    exit 1
fi
verbose "npm $(npm --version)"

task_complete "System dependencies ready"

# Step 2: Node.js dependencies
task_start "Installing Node.js dependencies"

if [[ $FORCE_INSTALL == true ]] || ! is_cached "npm-install"; then
    verbose "Running npm install..."
    npm install 2>&1 | verbose
    mark_cached "npm-install"
    task_complete "Node.js dependencies installed"
else
    verbose "Node.js dependencies already installed (use -f to reinstall)"
    task_complete "Node.js dependencies ready"
fi

# Step 3: Verify installation
task_start "Verifying installation"

# Check for required commands
MISSING_COMMANDS=()
for cmd in node npm npx; do
    if ! command -v "$cmd" &>/dev/null; then
        MISSING_COMMANDS+=("$cmd")
    fi
done

if [ ${#MISSING_COMMANDS[@]} -gt 0 ]; then
    task_fail "Missing commands: ${MISSING_COMMANDS[*]}"
    exit 1
fi

task_complete "All dependencies verified"

# Final summary
print_footer "Setup complete! 🎉"
echo ""
echo "Next steps:"
echo "  1. Run tests:       npm test"
echo "  2. Run linter:      npm run lint"
echo "  3. Start coding!    Edit index.html and js/*.js"
echo ""

