# Script Library Templates

## Purpose

This directory contains shared library templates for shell scripts.

## Contents

**`common-template.sh`** - Common functions for all scripts

## Functions Provided

### Logging
- `log_info "message"` - Info message (blue)
- `log_success "message"` - Success message (green)
- `log_warning "message"` - Warning message (yellow)
- `log_error "message"` - Error message (red)
- `log_step "message"` - Step message
- `log_step_done` - Mark step complete

### Timer
- `start_timer` - Start running timer
- `stop_timer` - Stop timer and show elapsed time
- `update_timer` - Update timer display (called automatically)

### Status Updates
- `update_status "message"` - Update current line (inline)
- `complete_status "message" "symbol"` - Complete with symbol (✓, ✗, ⊘)

### Utilities
- `confirm "question"` - Ask yes/no question
- `run_quiet "command"` - Run command quietly
- `retry_command "command" max_attempts` - Retry with exponential backoff
- `check_command "command"` - Check if command exists

### Colors
- `COLOR_RED`, `COLOR_GREEN`, `COLOR_YELLOW`, `COLOR_BLUE`
- `COLOR_RESET`

## Usage

Source the library in your script:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Source common library
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/lib/common.sh"

# Use functions
log_info "Starting process..."
start_timer

if check_command "node"; then
  log_success "Node.js found"
else
  log_error "Node.js not found"
  exit 1
fi

stop_timer
```

## Best Practices

### Do's ✅
- Always source common.sh
- Use logging functions (not echo)
- Start/stop timer in main scripts
- Check command existence before using
- Handle errors gracefully

### Don'ts ❌
- Don't modify common.sh for project-specific logic
- Don't use echo directly (use log_* functions)
- Don't forget to stop timer
- Don't ignore function return values

## Related Documentation

- **Script Templates**: `../../README.md`
- **Shell Script Standards**: `../../../docs/SHELL_SCRIPT_STANDARDS-template.md`
- **Quality Standards**: `../../../../05-QUALITY-STANDARDS.md`

