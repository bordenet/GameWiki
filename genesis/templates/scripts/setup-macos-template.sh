#!/usr/bin/env bash
################################################################################
# Script Name: setup-macos.sh
################################################################################
# PURPOSE: Set up {{PROJECT_NAME}} development environment on macOS
# USAGE: ./scripts/setup-macos.sh [OPTIONS]
# PLATFORM: macOS (Apple Silicon and Intel)
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

# Customize these for your project
readonly REQUIRED_PYTHON_VERSION="{{PYTHON_VERSION}}"
# shellcheck disable=SC2034  # REQUIRED_NODE_VERSION used when Node.js is needed
readonly REQUIRED_NODE_VERSION="{{NODE_VERSION}}"  # Optional

################################################################################
# Global Variables
################################################################################

AUTO_CONFIRM=false
# VERBOSE is exported for use by common.sh functions
export VERBOSE=false

################################################################################
# Functions
################################################################################

show_help() {
    cat << 'EOF'
NAME
    setup-macos.sh - Set up {{PROJECT_NAME}} development environment

SYNOPSIS
    ./scripts/setup-macos.sh [OPTIONS]

DESCRIPTION
    Sets up development environment including:
    - Homebrew package manager
    - Python {{PYTHON_VERSION}}
    - Git and development tools
    - Virtual environment
    - Project dependencies
    - Pre-commit hooks

OPTIONS
    -y, --yes       Auto-confirm all prompts (non-interactive mode)
    -v, --verbose   Show detailed output
    -h, --help      Display this help message

EXAMPLES
    ./scripts/setup-macos.sh        # Interactive setup
    ./scripts/setup-macos.sh -y     # Non-interactive setup
    ./scripts/setup-macos.sh -v -y  # Verbose non-interactive setup

EXIT STATUS
    0   Success
    1   Error during setup

REQUIREMENTS
    - macOS 12.0 or later
    - Internet connection
    - Administrator privileges (for Homebrew installation)

SEE ALSO
    README.md, CONTRIBUTING.md

EOF
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                show_help
                exit 0
                ;;
            -y|--yes)
                AUTO_CONFIRM=true
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

confirm() {
    [[ "$AUTO_CONFIRM" == "true" ]] && return 0
    ask_yes_no "$1" "y"
}

check_system_requirements() {
    log_step "Checking system requirements"
    
    if ! is_macos; then
        die "This script requires macOS"
    fi
    
    local macos_version
    macos_version=$(sw_vers -productVersion)
    log_info "macOS version: $macos_version"
    
    log_step_done "System requirements check passed"
}

install_homebrew() {
    log_step "Checking Homebrew"
    
    if command -v brew &> /dev/null; then
        local brew_version
        brew_version=$(brew --version | head -1)
        log_info "Homebrew already installed: $brew_version"
        
        if confirm "Update Homebrew?"; then
            log_info "Updating Homebrew..."
            run_quiet brew update
            log_step_done "Homebrew updated"
        else
            log_step_done "Homebrew check complete"
        fi
        return 0
    fi
    
    log_info "Homebrew not found"
    if ! confirm "Install Homebrew?"; then
        die "Homebrew is required for this project"
    fi
    
    log_info "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || die "Homebrew installation failed"
    
    # Add Homebrew to PATH
    if is_arm64; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        eval "$(/usr/local/bin/brew shellenv)"
    fi
    
    log_step_done "Homebrew installed"
}

install_python() {
    log_step "Checking Python"
    
    if command -v python3 &> /dev/null; then
        local python_version
        python_version=$(python3 --version | awk '{print $2}')
        log_info "Python already installed: $python_version"
        log_step_done "Python check complete"
        return 0
    fi
    
    log_info "Installing Python ${REQUIRED_PYTHON_VERSION}..."
    run_quiet brew install "python@${REQUIRED_PYTHON_VERSION}" || die "Python installation failed"
    
    log_step_done "Python installed"
}

install_git() {
    log_step "Checking Git"
    
    if command -v git &> /dev/null; then
        local git_version
        git_version=$(git --version | awk '{print $3}')
        log_info "Git already installed: $git_version"
        log_step_done "Git check complete"
        return 0
    fi
    
    log_info "Installing Git..."
    run_quiet brew install git || die "Git installation failed"
    
    log_step_done "Git installed"
}

setup_virtualenv() {
    log_step "Setting up virtual environment"
    
    if [[ -d "venv" ]]; then
        log_info "Virtual environment already exists"
        log_step_done "Virtual environment check complete"
        return 0
    fi
    
    log_info "Creating virtual environment..."
    python3 -m venv venv || die "Failed to create virtual environment"
    
    log_step_done "Virtual environment created"
}

install_dependencies() {
    log_step "Installing project dependencies"
    
    # Activate virtual environment
    # shellcheck source=/dev/null
    source venv/bin/activate || die "Failed to activate virtual environment"
    
    # Upgrade pip
    log_info "Upgrading pip..."
    run_quiet pip install --upgrade pip
    
    # Install dependencies
    if [[ -f "requirements.txt" ]]; then
        log_info "Installing Python dependencies..."
        run_quiet pip install -r requirements.txt || die "Failed to install Python dependencies"
    fi
    
    # Install development dependencies
    if [[ -f "requirements-dev.txt" ]]; then
        log_info "Installing development dependencies..."
        run_quiet pip install -r requirements-dev.txt || die "Failed to install dev dependencies"
    fi
    
    log_step_done "Dependencies installed"
}

setup_pre_commit_hooks() {
    log_step "Setting up pre-commit hooks"
    
    if [[ ! -f ".pre-commit-config.yaml" ]]; then
        log_info "No pre-commit configuration found, skipping"
        log_step_done "Pre-commit hooks skipped"
        return 0
    fi
    
    # Activate virtual environment
    # shellcheck source=/dev/null
    source venv/bin/activate || die "Failed to activate virtual environment"
    
    log_info "Installing pre-commit..."
    run_quiet pip install pre-commit || die "Failed to install pre-commit"
    
    log_info "Installing pre-commit hooks..."
    run_quiet pre-commit install || die "Failed to install pre-commit hooks"
    
    log_step_done "Pre-commit hooks installed"
}

show_summary() {
    log_header "Setup Complete!"
    
    echo "Next steps:"
    echo "  1. Activate virtual environment: source venv/bin/activate"
    echo "  2. Run tests: pytest"
    echo "  3. Start development!"
    echo ""
    
    show_elapsed_time
}

################################################################################
# Main
################################################################################

main() {
    parse_args "$@"
    start_timer
    
    log_header "{{PROJECT_NAME}} Setup"
    
    [[ "$AUTO_CONFIRM" == "true" ]] && log_info "Running in auto-confirm mode"
    
    check_system_requirements
    install_homebrew
    install_python
    install_git
    setup_virtualenv
    install_dependencies
    setup_pre_commit_hooks
    
    stop_timer
    show_summary
}

main "$@"

