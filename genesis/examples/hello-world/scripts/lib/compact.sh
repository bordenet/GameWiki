#!/usr/bin/env bash
################################################################################
# compact.sh - Compact display utilities for shell scripts
#
# DESCRIPTION
#     Provides functions for compact, minimal-vertical-space output in shell
#     scripts. Uses ANSI escape codes to overwrite lines and create inline
#     status updates.
#
# USAGE
#     source "${SCRIPT_DIR}/lib/compact.sh"
#
# FUNCTIONS
#     compact_start "message"     - Start a compact status line
#     compact_update "message"    - Update the current status line
#     compact_done "message"      - Complete with success (✓)
#     compact_fail "message"      - Complete with failure (✗)
#     compact_skip "message"      - Complete with skip (⊘)
#     compact_newline             - Force a newline (end compact mode)
#
# NOTES
#     - Only works in compact mode (VERBOSE=false)
#     - In verbose mode, functions behave like normal log functions
#     - Uses ANSI escape codes for line manipulation
#
################################################################################

# ANSI escape codes
ERASE_LINE="\033[2K"
# shellcheck disable=SC2034  # May be used by scripts sourcing this library
CURSOR_UP="\033[1A"
# shellcheck disable=SC2034  # May be used by scripts sourcing this library
CURSOR_SAVE="\033[s"
# shellcheck disable=SC2034  # May be used by scripts sourcing this library
CURSOR_RESTORE="\033[u"

# Symbols
SYMBOL_SUCCESS="✓"
SYMBOL_FAIL="✗"
SYMBOL_SKIP="⊘"
SYMBOL_WORKING="▶"

################################################################################
# Compact Display Functions
################################################################################

compact_start() {
    local message="$1"

    if [[ "${VERBOSE:-false}" == "true" ]]; then
        echo ""
        echo -e "${COLOR_BOLD:-}${SYMBOL_WORKING}${COLOR_RESET:-} $message"
    else
        echo -ne "\r\033[2K${SYMBOL_WORKING} $message"
    fi
}

compact_update() {
    local message="$1"

    if [[ "${VERBOSE:-false}" == "true" ]]; then
        echo -e "${COLOR_BLUE:-}[INFO]${COLOR_RESET:-} $message"
    else
        echo -ne "\r\033[2K${SYMBOL_WORKING} $message"
    fi
}

compact_done() {
    local message="$1"

    if [[ "${VERBOSE:-false}" == "true" ]]; then
        echo -e "${COLOR_GREEN:-}[${SYMBOL_SUCCESS}]${COLOR_RESET:-} $message"
    else
        echo -e "\r\033[2K${SYMBOL_WORKING} $message\t\t${COLOR_GREEN:-}[${SYMBOL_SUCCESS}]${COLOR_RESET:-}"
    fi
}

compact_fail() {
    local message="$1"

    if [[ "${VERBOSE:-false}" == "true" ]]; then
        echo -e "${COLOR_RED:-}[${SYMBOL_FAIL}]${COLOR_RESET:-} $message" >&2
    else
        echo -e "\r\033[2K${SYMBOL_WORKING} $message\t\t${COLOR_RED:-}[${SYMBOL_FAIL}]${COLOR_RESET:-}" >&2
    fi
}

compact_skip() {
    local message="$1"

    if [[ "${VERBOSE:-false}" == "true" ]]; then
        echo -e "${COLOR_YELLOW:-}[${SYMBOL_SKIP}]${COLOR_RESET:-} $message"
    else
        echo -e "\r\033[2K${SYMBOL_WORKING} $message\t\t${COLOR_YELLOW:-}[${SYMBOL_SKIP}]${COLOR_RESET:-}"
    fi
}

compact_newline() {
    if [[ "${VERBOSE:-false}" != "true" ]]; then
        echo ""
    fi
}

################################################################################
# Progress Bar (Optional)
################################################################################

compact_progress() {
    local current="$1"
    local total="$2"
    local message="${3:-Processing}"
    
    if [[ "${VERBOSE:-false}" == "true" ]]; then
        echo -e "${COLOR_BLUE:-}[INFO]${COLOR_RESET:-} $message ($current/$total)"
        return
    fi
    
    local percent=$((current * 100 / total))
    local filled=$((percent / 5))
    local empty=$((20 - filled))
    
    local bar=""
    for ((i=0; i<filled; i++)); do bar+="█"; done
    for ((i=0; i<empty; i++)); do bar+="░"; done

    echo -ne "\r\033[2K${SYMBOL_WORKING} $message [$bar] $percent%"

    if [[ "$current" -eq "$total" ]]; then
        echo -e "\r\033[2K${SYMBOL_WORKING} $message [$bar] 100%\t${COLOR_GREEN:-}[${SYMBOL_SUCCESS}]${COLOR_RESET:-}"
    fi
}

################################################################################
# Spinner (Optional)
################################################################################

SPINNER_PID=""
SPINNER_FRAMES=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")

compact_spinner_start() {
    local message="$1"
    
    if [[ "${VERBOSE:-false}" == "true" ]]; then
        echo -e "${COLOR_BLUE:-}[INFO]${COLOR_RESET:-} $message"
        return
    fi
    
    (
        local i=0
        while true; do
            echo -ne "\r\033[2K${SPINNER_FRAMES[$i]} $message"
            i=$(( (i + 1) % ${#SPINNER_FRAMES[@]} ))
            sleep 0.1
        done
    ) &
    SPINNER_PID=$!
}

compact_spinner_stop() {
    if [[ -n "$SPINNER_PID" ]]; then
        kill "$SPINNER_PID" 2>/dev/null || true
        wait "$SPINNER_PID" 2>/dev/null || true
        SPINNER_PID=""
        echo -ne "\r\033[2K"
    fi
}

