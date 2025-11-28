#!/usr/bin/env bash

################################################################################
# Genesis Validation Script
################################################################################
# PURPOSE: Validate that the Genesis template system is complete and correct
# USAGE: ./validate-genesis.sh
################################################################################

set -euo pipefail

# Colors
readonly COLOR_RED='\033[0;31m'
readonly COLOR_GREEN='\033[0;32m'
# shellcheck disable=SC2034  # COLOR_YELLOW reserved for future use
readonly COLOR_YELLOW='\033[1;33m'
readonly COLOR_BLUE='\033[0;34m'
readonly COLOR_RESET='\033[0m'

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0

# Logging functions
log_info() {
    echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $*"
}

log_success() {
    echo -e "${COLOR_GREEN}[✓]${COLOR_RESET} $*"
    ((CHECKS_PASSED++))
}

log_error() {
    echo -e "${COLOR_RED}[✗]${COLOR_RESET} $*"
    ((CHECKS_FAILED++))
}

log_header() {
    echo ""
    echo -e "${COLOR_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
    echo -e "${COLOR_BLUE}$*${COLOR_RESET}"
    echo -e "${COLOR_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
    echo ""
}

# Check if file exists
check_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        log_success "$description: $file"
    else
        log_error "$description: $file (MISSING)"
    fi
}

# Check if directory exists
check_dir() {
    local dir="$1"
    local description="$2"
    
    if [ -d "$dir" ]; then
        log_success "$description: $dir"
    else
        log_error "$description: $dir (MISSING)"
    fi
}

# Main validation
main() {
    log_header "Genesis Template System Validation"
    
    # Check core documentation
    log_info "Checking core documentation..."
    check_file "00-GENESIS-PLAN.md" "Master plan"
    check_file "01-AI-INSTRUCTIONS.md" "AI instructions"
    check_file "02-QUICK-START.md" "Quick start guide"
    check_file "03-CUSTOMIZATION-GUIDE.md" "Customization guide"
    
    # Check integration directory
    log_info "Checking starter-kit integration..."
    check_dir "integration" "Integration directory"
    check_file "integration/README.md" "Integration README"
    check_file "integration/common.sh" "Common shell library"
    check_file "integration/SAFETY_NET.md" "Safety net guide"
    check_file "integration/DEVELOPMENT_PROTOCOLS.md" "Development protocols"
    check_file "integration/PROJECT_SETUP_CHECKLIST.md" "Setup checklist"
    
    # Check template directories
    log_info "Checking template directories..."
    check_dir "templates" "Templates directory"
    check_dir "templates/project-structure" "Project structure templates"
    check_dir "templates/web-app" "Web app templates"
    check_dir "templates/docs" "Documentation templates"
    check_dir "templates/scripts" "Script templates"
    check_dir "templates/github" "GitHub Actions templates"
    
    # Check template files
    log_info "Checking template files..."
    check_file "templates/project-structure/README-template.md" "README template"
    check_file "templates/project-structure/gitignore-template" "Gitignore template"
    
    # Check examples
    log_info "Checking examples..."
    check_dir "examples" "Examples directory"
    check_dir "examples/one-pager" "One-Pager example"
    check_dir "examples/minimal" "Minimal example"
    check_file "examples/one-pager/README.md" "One-Pager README"
    check_file "examples/one-pager/prompts/phase1.txt" "One-Pager phase 1 prompt"
    check_file "examples/one-pager/prompts/phase2.txt" "One-Pager phase 2 prompt"
    check_file "examples/minimal/README.md" "Minimal README"
    
    # Check validation directory
    log_info "Checking validation tools..."
    check_dir "validation" "Validation directory"
    check_file "validation/validate-genesis.sh" "Genesis validation script"
    
    # Summary
    log_header "Validation Summary"
    echo -e "${COLOR_GREEN}Checks passed: $CHECKS_PASSED${COLOR_RESET}"
    echo -e "${COLOR_RED}Checks failed: $CHECKS_FAILED${COLOR_RESET}"
    echo ""
    
    if [ $CHECKS_FAILED -eq 0 ]; then
        echo -e "${COLOR_GREEN}✅ Genesis template system is valid!${COLOR_RESET}"
        exit 0
    else
        echo -e "${COLOR_RED}❌ Genesis template system has issues. Please fix the missing files/directories.${COLOR_RESET}"
        exit 1
    fi
}

# Run from genesis directory
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Run validation
main

