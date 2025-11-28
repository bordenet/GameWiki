# Script Templates

## Purpose

This directory contains shell script templates for project setup, validation, and utilities. All scripts follow the design patterns defined in `../docs/SHELL_SCRIPT_STANDARDS-template.md`.

## Contents

### Core Scripts

1. **`setup-macos-template.sh`** (✅ Complete)
   - macOS development environment setup
   - Dependency installation (Homebrew, Python, Node.js, etc.)
   - Virtual environment creation
   - Pre-commit hooks installation
   - Auto-confirm mode (`-y|--yes`)
   - Verbose mode (`-v|--verbose`)
   - Running timer display
   - Man-page style help

2. **`validate-template.sh`** (✅ Complete)
   - Project validation script
   - Linting checks (shellcheck, eslint, etc.)
   - Test execution
   - Coverage verification
   - Quality gate enforcement
   - Running timer display
   - Verbose mode

### Library (`lib/`)

3. **`lib/common-template.sh`** (✅ Complete)
   - Shared functions for all scripts
   - Logging utilities
   - Color definitions
   - Timer functions
   - Status update functions
   - Error handling
   - Retry logic

## Shell Script Standards

All scripts MUST follow these mandatory requirements:

### 1. Running Timer (MANDATORY)
- Display in top-right corner: `[HH:MM:SS]`
- Yellow text on black background
- Updates every second
- Uses ANSI escape sequences

### 2. Help Flag (MANDATORY)
- `-h|--help` flag
- Man-page style format:
  - NAME
  - SYNOPSIS
  - DESCRIPTION
  - OPTIONS
  - EXAMPLES
  - EXIT STATUS

### 3. Verbose Mode (MANDATORY)
- `-v|--verbose` flag
- Default: minimal output (< 10 lines)
- Verbose: detailed step-by-step output

### 4. Compact Display (MANDATORY)
- Default mode uses minimal vertical space
- Inline status updates with `\r`
- Symbols: ✓ (success), ✗ (error), ⊘ (skipped), ↻ (retry)

### 5. Error Handling (MANDATORY)
- `set -euo pipefail` at top
- Trap ERR for cleanup
- Meaningful error messages
- Non-zero exit codes on failure

## Template Variables

Scripts use these variables:

### Project Identity
- `{{PROJECT_NAME}}` - Project name
- `{{PROJECT_TITLE}}` - Display title

### Dependencies
- `{{PYTHON_VERSION}}` - Required Python version
- `{{NODE_VERSION}}` - Required Node.js version
- `{{REQUIRED_TOOLS}}` - List of required tools

### Paths
- `{{VENV_PATH}}` - Virtual environment path
- `{{SCRIPTS_DIR}}` - Scripts directory path

## Usage

### For AI Assistants

When creating a new project:
1. Copy `setup-macos-template.sh` → `scripts/setup-macos.sh`
2. Copy `validate-template.sh` → `scripts/validate.sh`
3. Copy `lib/common-template.sh` → `scripts/lib/common.sh`
4. Replace all `{{VARIABLES}}` with actual values
5. Make scripts executable: `chmod +x scripts/*.sh`
6. Test scripts before committing

### For Manual Use

1. Copy template files to your project's `scripts/` directory
2. Remove `-template` suffix
3. Replace variables with actual values
4. Make executable: `chmod +x scripts/*.sh`
5. Test: `./scripts/setup-macos.sh --help`

## Quality Standards

All scripts must pass these checks:

### ShellCheck (MANDATORY)
```bash
shellcheck scripts/*.sh
# Must return: 0 errors, 0 warnings
```

### Bash Version
- Minimum: bash 3.2 (macOS default)
- Recommended: bash 4.0+

### Portability
- macOS (primary target)
- Linux (should work)
- Windows WSL (should work)

### Testing
- Test on clean macOS installation
- Test with and without dependencies installed
- Test all flags (`-h`, `-v`, `-y`)
- Test error conditions
- Test interrupt handling (Ctrl+C)

## Common Functions

The `lib/common-template.sh` provides these functions:

### Logging
- `log_info "message"` - Info message
- `log_success "message"` - Success message (green)
- `log_warning "message"` - Warning message (yellow)
- `log_error "message"` - Error message (red)
- `log_step "message"` - Step message (blue)
- `log_step_done` - Mark step complete

### Timer
- `start_timer` - Start running timer
- `stop_timer` - Stop timer
- `update_timer` - Update timer display (called automatically)

### Status Updates
- `update_status "message"` - Update current line
- `complete_status "message" "symbol"` - Complete with symbol

### Utilities
- `confirm "question"` - Ask yes/no question
- `run_quiet "command"` - Run command quietly
- `retry_command "command" max_attempts` - Retry with backoff
- `check_command "command"` - Check if command exists

## Examples

### Basic Script Structure
```bash
#!/usr/bin/env bash
set -euo pipefail

# Source common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/lib/common.sh"

# Parse arguments
VERBOSE=false
while [[ $# -gt 0 ]]; do
  case $1 in
    -v|--verbose) VERBOSE=true; shift ;;
    -h|--help) show_help; exit 0 ;;
    *) log_error "Unknown option: $1"; exit 1 ;;
  esac
done

# Start timer
start_timer

# Main logic
log_step "Doing something..."
# ... do work ...
log_step_done

# Stop timer
stop_timer
```

## Related Documentation

- **Shell Script Standards**: `../docs/SHELL_SCRIPT_STANDARDS-template.md`
- **Quality Standards**: `../../05-QUALITY-STANDARDS.md`
- **AI Instructions**: `../../01-AI-INSTRUCTIONS.md`

## Maintenance

When modifying script templates:
1. Test on clean macOS installation
2. Run shellcheck (must pass with 0 warnings)
3. Test all flags and options
4. Update help text
5. Update this README
6. Update `../../SUMMARY.md`

