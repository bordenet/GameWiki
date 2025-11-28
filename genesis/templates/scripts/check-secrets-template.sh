#!/usr/bin/env bash
################################################################################
# {{PROJECT_TITLE}} - Secrets Check Hook
################################################################################
# PURPOSE: Prevent secrets and credentials from being committed
#
# Checks for common secret patterns:
# - AWS credentials
# - API keys
# - Passwords
# - Private keys
# - Tokens
################################################################################

set -e

# ANSI color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔐 Checking for secrets in staged files..."

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
    echo "✅ No files staged for commit"
    exit 0
fi

# Secret patterns to check (pattern:description format)
SECRET_PATTERNS=(
    "AWS_SECRET_ACCESS_KEY.*=.*[A-Za-z0-9/+]{40}:AWS Secret Key"
    "AWS_ACCESS_KEY_ID.*=.*AKIA[A-Z0-9]{16}:AWS Access Key"
    "api[_-]?key.*=.*[A-Za-z0-9]{20,}:Generic API Key"
    "password.*=.*[A-Za-z0-9]{8,}:Password"
    "BEGIN.*PRIVATE KEY:Private Key"
    "secret.*=.*[A-Za-z0-9]{20,}:Generic Secret"
    "bearer[[:space:]][A-Za-z0-9._~+/-]+=*:Bearer Token"
)

SECRETS_FOUND=()

# Check each staged file
while IFS= read -r file; do
    # Skip if file doesn't exist
    if [ ! -f "$file" ]; then
        continue
    fi

    # Skip binary files
    if file "$file" | grep -qiE "(executable|binary|Mach-O|ELF)"; then
        continue
    fi

    # Check each pattern
    for pattern_entry in "${SECRET_PATTERNS[@]}"; do
        pattern="${pattern_entry%%:*}"
        description="${pattern_entry##*:}"

        # Search for pattern in file
        if grep -iEq "$pattern" "$file"; then
            # Exclude safe patterns
            if ! grep -iE "$pattern" "$file" | grep -qE "(example|test|mock|dummy|placeholder|<.*>|REPLACE|YOUR_|TODO)"; then
                SECRETS_FOUND+=("$file: $description")
            fi
        fi
    done

done <<< "$STAGED_FILES"

# Check if .env file is being committed
if echo "$STAGED_FILES" | grep -qE "^\.env$"; then
    SECRETS_FOUND+=(".env: Environment file should not be committed")
fi

# Report findings
if [ ${#SECRETS_FOUND[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}❌ ERROR: Potential secrets detected in staged files${NC}"
    echo ""
    echo "The following files may contain secrets:"
    echo ""
    for secret in "${SECRETS_FOUND[@]}"; do
        echo -e "  ${RED}✗${NC} $secret"
    done
    echo ""
    echo "To fix this:"
    echo "  1. Remove secrets from the files"
    echo "  2. Use .env files for local secrets (add to .gitignore)"
    echo "  3. Use environment variables or secret management services"
    echo "  4. If this is a false positive, review and commit with --no-verify"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ No secrets detected${NC}"
exit 0


