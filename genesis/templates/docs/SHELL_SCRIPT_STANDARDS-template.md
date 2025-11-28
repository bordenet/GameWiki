# Shell Script Standards

**Version**: 1.0  
**Target**: All shell scripts in {{PROJECT_NAME}}  
**Reference Implementation**: [bu.sh](https://github.com/bordenet/scripts/blob/main/bu.sh)

---

## Overview

All shell scripts in this project must follow professional standards for maintainability, testability, and user experience.

**Reference Script**: See [bu.sh](https://github.com/bordenet/scripts/blob/main/bu.sh) for a complete working example of all standards in practice.

---

## Mandatory Requirements

### 1. Display Standards

**CRITICAL**: Scripts must minimize vertical terminal space and provide clear progress feedback.

#### Running Timer (MANDATORY)

Every script **MUST** display a running wall clock timer in the top-right corner:

- **Format**: `[HH:MM:SS]` (e.g., `[00:02:15]`)
- **Location**: Top-right corner of terminal
- **Color**: Yellow text on black background (`\033[33;40m`)
- **Update frequency**: At least every second

**Implementation**:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Timer variables
SCRIPT_START_TIME=$(date +%s)
TIMER_PID=""

# Update timer in top-right corner
update_timer() {
    local start_time="$1"
    while true; do
        local cols=$(tput cols 2>/dev/null || echo 80)
        local elapsed=$(($(date +%s) - start_time))
        local hours=$((elapsed / 3600))
        local minutes=$(((elapsed % 3600) / 60))
        local seconds=$((elapsed % 60))
        
        local timer_text
        printf -v timer_text "[%02d:%02d:%02d]" "$hours" "$minutes" "$seconds"
        local timer_col=$((cols - ${#timer_text}))
        
        # Save cursor, move to top-right, print timer, restore cursor
        echo -ne "\033[s\033[1;${timer_col}H\033[33;40m${timer_text}\033[0m\033[u"
        sleep 1
    done
}

start_timer() {
    update_timer "$SCRIPT_START_TIME" &
    TIMER_PID=$!
}

stop_timer() {
    [[ -n "$TIMER_PID" ]] && kill "$TIMER_PID" 2>/dev/null || true
    wait "$TIMER_PID" 2>/dev/null || true
}

trap stop_timer EXIT
start_timer
```

#### Compact Display (MANDATORY)

Scripts must support two display modes:

**Default (Compact) Mode**:
- Minimal vertical space (< 10 lines for typical scripts)
- Use ANSI escape codes to overwrite lines
- Show only current phase and status

```bash
▶ Checking system requirements     [✓]
▶ Installing dependencies          [✓]
▶ Running tests                    [✓]
```

**Verbose Mode (`-v | --verbose`)**:
- Show all INFO-level logs
- Display detailed progress
- Scroll down terminal normally

```bash
[INFO] Checking system requirements
[INFO] macOS version: 14.1
[✓] System requirements check passed
[INFO] Installing dependencies
[INFO] Found package.json
[✓] Dependencies installed
```

**Implementation**:

```bash
VERBOSE=false

log_step() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo ""; echo "▶ $1"; echo ""
    else
        echo -ne "\r\033[K▶ $1"  # Overwrite current line
    fi
}

log_step_done() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo "[✓] $1"
    else
        echo -e "\r\033[K▶ $1\t\t[✓]"  # Overwrite with checkmark
    fi
}

log_info_verbose() {
    [[ "$VERBOSE" != "true" ]] && return 0
    echo "[INFO] $*"
}
```

#### ANSI Escape Codes Reference

```bash
# Cursor movement
\033[${N}A          # Move up N lines
\033[${N}B          # Move down N lines
\033[${row};${col}H # Move to position

# Cursor save/restore
\033[s              # Save cursor position
\033[u              # Restore cursor position

# Line clearing
\033[K              # Clear from cursor to end of line
\033[2K             # Clear entire line
\r                  # Carriage return (move to start of line)

# Colors
\033[33;40m         # Yellow text on black background
\033[0m             # Reset all attributes
```

### 2. Help System (MANDATORY)

Every script **MUST** implement `-h | --help` with man-page style output.

**Requirements**:
- Support both `-h` and `--help`
- Exit with status code 0
- Follow man-page format
- Include examples

**Template**:

```bash
show_help() {
    cat << 'EOF'
NAME
    {{SCRIPT_NAME}} - Brief description

SYNOPSIS
    {{SCRIPT_NAME}} [OPTIONS] <ARGUMENTS>

DESCRIPTION
    Detailed description of what the script does.

OPTIONS
    -h, --help      Display this help message
    -v, --verbose   Show detailed output
    -y, --yes       Auto-confirm all prompts

EXAMPLES
    {{SCRIPT_NAME}}                 # Interactive mode
    {{SCRIPT_NAME}} -v              # Verbose output
    {{SCRIPT_NAME}} -y -v           # Non-interactive verbose

EXIT STATUS
    0   Success
    1   Error

SEE ALSO
    Related documentation or scripts

EOF
}

# Argument parsing
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help) show_help; exit 0 ;;
        -v|--verbose) VERBOSE=true; shift ;;
        *) echo "Unknown option: $1. Use --help for usage." >&2; exit 1 ;;
    esac
done
```

### 3. Setup Scripts (MANDATORY)

Every project **MUST** include `./scripts/setup-macos.sh` (and `setup-linux.sh` if applicable).

**Purpose**: Install ALL project dependencies with a single command.

**Reference**: [setup-macos.sh](https://github.com/bordenet/bloginator/blob/main/scripts/setup-macos.sh)

**Requirements**:
- Install system dependencies (Homebrew, Python, Node, etc.)
- Create virtual environments
- Install project dependencies
- Configure pre-commit hooks
- Verify installation
- Support `-y` flag for non-interactive mode
- Support `-v` flag for verbose output

**Template structure**:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Source common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/common.sh"

main() {
    parse_args "$@"
    start_timer
    
    check_system_requirements
    install_homebrew
    install_python
    install_node  # If needed
    setup_virtualenv
    install_dependencies
    setup_pre_commit_hooks
    
    stop_timer
    show_summary
}

main "$@"
```

---

## Code Quality Standards

### Strict Error Handling

```bash
#!/usr/bin/env bash
set -euo pipefail  # MANDATORY

# Explanation:
# -e: Exit on error
# -u: Exit on undefined variable
# -o pipefail: Exit if any command in pipeline fails
```

### ShellCheck Compliance

All scripts **MUST** pass `shellcheck` with zero warnings:

```bash
# Lint before committing
shellcheck script-name.sh

# Lint all scripts
find scripts -name "*.sh" -exec shellcheck {} +
```

### Input Validation

Always validate and sanitize user input:

```bash
validate_email() {
    local email="$1"
    if [[ ! "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        log_error "Invalid email format: $email"
        return 1
    fi
    # Sanitize dangerous characters
    email="${email//[;<>\`\$\(\)]/}"
    echo "$email"
}
```

---

## File Structure

### Standard Script Template

```bash
#!/usr/bin/env bash
################################################################################
# Script Name: {{SCRIPT_NAME}}
################################################################################
# PURPOSE: Brief description
# USAGE: ./{{SCRIPT_NAME}} [OPTIONS]
# PLATFORM: macOS | Linux | Cross-platform
################################################################################

set -euo pipefail

# Source common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/common.sh"

################################################################################
# Constants
################################################################################

readonly VERSION="1.0.0"

################################################################################
# Functions
################################################################################

show_help() {
    # ... (see Help System section)
}

################################################################################
# Main
################################################################################

main() {
    parse_args "$@"
    start_timer
    
    # Main logic here
    
    stop_timer
}

main "$@"
```

---

## Testing Requirements

Before committing any script:

- [ ] Passes `shellcheck` with zero warnings
- [ ] Passes `bash -n` syntax check
- [ ] Tested with valid inputs
- [ ] Tested with invalid/edge case inputs
- [ ] Tested on target platform (macOS/Linux)
- [ ] Timer displays correctly
- [ ] Help output is complete and accurate
- [ ] Verbose and non-verbose modes work
- [ ] Cleanup handlers work (no temp files left)

---

## Platform Compatibility

### macOS vs Linux

macOS uses BSD tools, not GNU tools. Handle differences:

```bash
# sed: BSD requires backup extension for -i
if [[ "$(uname -s)" == "Darwin" ]]; then
    sed -i '' 's/old/new/' "$file"  # macOS
else
    sed -i 's/old/new/' "$file"     # Linux
fi

# Homebrew paths
if [[ "$(uname -m)" == "arm64" ]]; then
    BREW_PREFIX="/opt/homebrew"  # Apple Silicon
else
    BREW_PREFIX="/usr/local"     # Intel
fi
```

---

## Common Patterns

### Retry Logic

```bash
retry_command() {
    local max_attempts=3
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if "$@"; then
            return 0
        else
            log_warning "Attempt $attempt failed, retrying..."
            sleep $((attempt * 2))  # Exponential backoff
            ((attempt++))
        fi
    done
    
    log_error "Command failed after $max_attempts attempts"
    return 1
}
```

### Cleanup Handlers

```bash
cleanup() {
    stop_timer
    rm -rf "$TEMP_DIR"
    # Restore state
}
trap cleanup EXIT
```

---

## Reference Implementation

**Complete working example**: [bu.sh](https://github.com/bordenet/scripts/blob/main/bu.sh)

This script demonstrates:
- Running timer in top-right corner
- Compact vs verbose display modes
- Man-page style help
- Comprehensive error handling
- Platform compatibility
- Progress indicators
- Cleanup handlers

Study this script as the gold standard for all shell scripts in this project.

---

## Enforcement

Scripts that do not meet these standards will be rejected in code review.

**Zero exceptions.**

