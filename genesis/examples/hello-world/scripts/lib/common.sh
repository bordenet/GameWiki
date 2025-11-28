#!/usr/bin/env bash
################################################################################
# Common Shell Script Library
################################################################################
# PURPOSE: Reusable functions for all {{PROJECT_NAME}} scripts
# USAGE: source "$(dirname "$0")/lib/common.sh"
################################################################################

# Prevent multiple sourcing
[[ -n "${COMMON_LIB_LOADED:-}" ]] && return 0
readonly COMMON_LIB_LOADED=1

################################################################################
# ANSI Color Codes
################################################################################

if [[ -t 1 ]]; then
    readonly COLOR_RED='\033[0;31m'
    readonly COLOR_GREEN='\033[0;32m'
    readonly COLOR_YELLOW='\033[1;33m'
    readonly COLOR_BLUE='\033[0;34m'
    readonly COLOR_BOLD='\033[1m'
    readonly COLOR_RESET='\033[0m'
    readonly ERASE_LINE='\033[2K'
    readonly SAVE_CURSOR='\033[s'
    readonly RESTORE_CURSOR='\033[u'
else
    readonly COLOR_RED=''
    readonly COLOR_GREEN=''
    readonly COLOR_YELLOW=''
    readonly COLOR_BLUE=''
    readonly COLOR_BOLD=''
    readonly COLOR_RESET=''
    readonly ERASE_LINE=''
    readonly SAVE_CURSOR=''
    readonly RESTORE_CURSOR=''
fi

################################################################################
# Timer Functions
################################################################################

SCRIPT_START_TIME=$(date +%s)
TIMER_PID=""

# Update timer in top-right corner (yellow on black)
update_timer() {
    local start_time="$1"
    while true; do
        local cols
        cols=$(tput cols 2>/dev/null || echo 80)
        local elapsed=$(($(date +%s) - start_time))
        local hours=$((elapsed / 3600))
        local minutes=$(((elapsed % 3600) / 60))
        local seconds=$((elapsed % 60))
        
        local timer_text
        printf -v timer_text "[%02d:%02d:%02d]" "$hours" "$minutes" "$seconds"
        local timer_col=$((cols - ${#timer_text}))

        # Save cursor, move to top-right, print timer (yellow on black), restore cursor
        echo -ne "\033[s\033[1;${timer_col}H\033[33;40m${timer_text}\033[0m\033[u"
        sleep 1
    done
}

start_timer() {
    update_timer "$SCRIPT_START_TIME" &
    TIMER_PID=$!
}

stop_timer() {
    if [[ -n "$TIMER_PID" ]]; then
        kill "$TIMER_PID" 2>/dev/null || true
        wait "$TIMER_PID" 2>/dev/null || true
    fi
}

show_elapsed_time() {
    local elapsed=$(($(date +%s) - SCRIPT_START_TIME))
    local hours=$((elapsed / 3600))
    local minutes=$(((elapsed % 3600) / 60))
    local seconds=$((elapsed % 60))
    printf "\nTotal execution time: %02d:%02d:%02d\n" "$hours" "$minutes" "$seconds"
}

################################################################################
# Logging Functions
################################################################################

VERBOSE=${VERBOSE:-false}

log_info() {
    [[ "$VERBOSE" != "true" ]] && return 0
    echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $*"
}

log_success() {
    echo -e "${COLOR_GREEN}[✓]${COLOR_RESET} $*"
}

log_warning() {
    echo -e "${COLOR_YELLOW}[⚠]${COLOR_RESET} $*" >&2
}

log_error() {
    echo -e "${COLOR_RED}[✗]${COLOR_RESET} $*" >&2
}

log_step() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo ""
        echo -e "${COLOR_BOLD}▶${COLOR_RESET} $*"
        echo ""
    else
        # Compact mode: overwrite current line
        echo -ne "\r\033[2K▶ $*"
    fi
}

log_step_done() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${COLOR_GREEN}[✓]${COLOR_RESET} $*"
    else
        # Compact mode: overwrite with checkmark
        echo -e "\r\033[2K▶ $*\t\t${COLOR_GREEN}[✓]${COLOR_RESET}"
    fi
}

log_header() {
    echo ""
    echo -e "${COLOR_BOLD}========================================${COLOR_RESET}"
    echo -e "${COLOR_BOLD}$*${COLOR_RESET}"
    echo -e "${COLOR_BOLD}========================================${COLOR_RESET}"
    echo ""
}

################################################################################
# Platform Detection
################################################################################

is_macos() {
    [[ "$(uname -s)" == "Darwin" ]]
}

is_linux() {
    [[ "$(uname -s)" == "Linux" ]]
}

is_arm64() {
    [[ "$(uname -m)" == "arm64" ]]
}

################################################################################
# Utility Functions
################################################################################

die() {
    log_error "$*"
    exit 1
}

require_command() {
    local cmd="$1"
    local install_hint="${2:-}"
    
    if ! command -v "$cmd" &> /dev/null; then
        log_error "Required command not found: $cmd"
        [[ -n "$install_hint" ]] && log_info "Install with: $install_hint"
        return 1
    fi
}

ask_yes_no() {
    local prompt="$1"
    local default="${2:-n}"
    
    local yn_prompt
    if [[ "$default" == "y" ]]; then
        yn_prompt="[Y/n]"
    else
        yn_prompt="[y/N]"
    fi
    
    read -r -p "$prompt $yn_prompt " response
    response=${response:-$default}
    
    [[ "$response" =~ ^[Yy] ]]
}

retry_command() {
    local max_attempts=3
    local attempt=1
    local exit_code=0
    
    while [[ $attempt -le $max_attempts ]]; do
        if "$@"; then
            return 0
        else
            exit_code=$?
            log_warning "Attempt $attempt failed, retrying in $((attempt * 2))s..."
            sleep $((attempt * 2))
            ((attempt++))
        fi
    done
    
    log_error "Command failed after $max_attempts attempts"
    return $exit_code
}

run_quiet() {
    if [[ "$VERBOSE" == "true" ]]; then
        "$@"
    else
        "$@" > /dev/null 2>&1
    fi
}

################################################################################
# Cleanup Handler
################################################################################

cleanup() {
    stop_timer
    # Add project-specific cleanup here
}

trap cleanup EXIT

