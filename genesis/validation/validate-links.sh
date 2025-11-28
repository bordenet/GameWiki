#!/usr/bin/env bash
#
# Link Validation Script
# Validates all hyperlinks and cross-references in Genesis documentation
#
# Usage:
#   ./validate-links.sh
#   ./validate-links.sh --verbose
#   ./validate-links.sh --fix

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL_LINKS=0
VALID_LINKS=0
INVALID_LINKS=0
TOTAL_FILES=0
TOTAL_REFS=0
VALID_REFS=0
INVALID_REFS=0

# Options
VERBOSE=false
FIX=false

# Parse arguments
for arg in "$@"; do
  case $arg in
    -v|--verbose)
      VERBOSE=true
      shift
      ;;
    --fix)
      FIX=true
      shift
      ;;
  esac
done

echo "🔍 Genesis Link Validation"
echo "=========================="
echo ""

# Find all markdown files
MARKDOWN_FILES=$(find genesis -name "*.md" -type f)

echo "📄 Scanning markdown files..."
echo ""

# Validate internal links
echo "🔗 Validating internal links..."
echo ""

for file in $MARKDOWN_FILES; do
  ((TOTAL_FILES++))
  
  if [ "$VERBOSE" = true ]; then
    echo "  Checking: $file"
  fi
  
  # Extract markdown links: [text](path)
  LINKS=$(grep -oE '\[([^\]]+)\]\(([^)]+)\)' "$file" || true)
  
  if [ -n "$LINKS" ]; then
    while IFS= read -r link; do
      # Extract URL from [text](url)
      URL=$(echo "$link" | sed -E 's/.*\(([^)]+)\).*/\1/')
      
      # Skip external URLs (http://, https://, mailto:)
      if [[ "$URL" =~ ^https?:// ]] || [[ "$URL" =~ ^mailto: ]]; then
        continue
      fi
      
      # Skip anchors only (#section)
      if [[ "$URL" =~ ^# ]]; then
        continue
      fi
      
      ((TOTAL_LINKS++))
      
      # Resolve relative path
      DIR=$(dirname "$file")
      if [[ "$URL" =~ ^/ ]]; then
        # Absolute path from repo root
        TARGET="$URL"
      else
        # Relative path
        TARGET="$DIR/$URL"
      fi
      
      # Remove anchor if present
      TARGET_FILE=$(echo "$TARGET" | sed 's/#.*//')
      
      # Check if file exists
      if [ -f "$TARGET_FILE" ] || [ -d "$TARGET_FILE" ]; then
        ((VALID_LINKS++))
        if [ "$VERBOSE" = true ]; then
          echo -e "    ${GREEN}✓${NC} $URL"
        fi
      else
        ((INVALID_LINKS++))
        echo -e "  ${RED}✗${NC} Invalid link in $file:"
        echo "    Link: $URL"
        echo "    Resolved to: $TARGET_FILE"
        echo "    File does not exist"
        echo ""
      fi
    done <<< "$LINKS"
  fi
done

echo ""
echo "📦 Validating file references..."
echo ""

# Validate script references in shell scripts
SHELL_SCRIPTS=$(find genesis -name "*.sh" -type f)

for file in $SHELL_SCRIPTS; do
  if [ "$VERBOSE" = true ]; then
    echo "  Checking: $file"
  fi
  
  # Extract source/. commands (skip comments)
  SOURCES=$(grep -E '^\s*(source|\.)\s+' "$file" | grep -v '^\s*#' || true)
  
  if [ -n "$SOURCES" ]; then
    while IFS= read -r source_line; do
      # Extract file path (remove source/., remove quotes, get first token)
      REF=$(echo "$source_line" | sed 's/^[[:space:]]*source[[:space:]]*//' | sed 's/^[[:space:]]*\.[[:space:]]*//' | tr -d '"' | tr -d "'" | awk '{print $1}')

      # Skip variables
      if [[ "$REF" =~ \$ ]]; then
        continue
      fi

      # Skip runtime-generated paths
      if [[ "$REF" =~ ^venv/ ]] || [[ "$REF" =~ ^node_modules/ ]] || [[ "$REF" =~ ^\.venv/ ]]; then
        continue
      fi

      ((TOTAL_REFS++))

      # Resolve relative path
      DIR=$(dirname "$file")
      if [[ "$REF" =~ ^/ ]]; then
        TARGET="$REF"
      else
        TARGET="$DIR/$REF"
      fi

      # For template files, also check for -template suffix
      TARGET_TEMPLATE="${TARGET}-template.sh"
      if [[ "$TARGET" =~ \.sh$ ]]; then
        TARGET_TEMPLATE="${TARGET%.sh}-template.sh"
      fi

      # Check if file exists (or template version exists)
      if [ -f "$TARGET" ] || [ -f "$TARGET_TEMPLATE" ]; then
        ((VALID_REFS++))
        if [ "$VERBOSE" = true ]; then
          echo -e "    ${GREEN}✓${NC} $REF"
        fi
      else
        ((INVALID_REFS++))
        echo -e "  ${RED}✗${NC} Invalid reference in $file:"
        echo "    Reference: $REF"
        echo "    Resolved to: $TARGET"
        echo "    File does not exist"
        echo ""
      fi
    done <<< "$SOURCES"
  fi
done

echo ""
echo "📊 Validation Summary"
echo "===================="
echo ""
echo "Files scanned: $TOTAL_FILES"
echo ""
echo "Internal Links:"
echo "  Total: $TOTAL_LINKS"
echo -e "  Valid: ${GREEN}$VALID_LINKS${NC}"
if [ $INVALID_LINKS -gt 0 ]; then
  echo -e "  Invalid: ${RED}$INVALID_LINKS${NC}"
else
  echo -e "  Invalid: ${GREEN}$INVALID_LINKS${NC}"
fi
echo ""
echo "File References:"
echo "  Total: $TOTAL_REFS"
echo -e "  Valid: ${GREEN}$VALID_REFS${NC}"
if [ $INVALID_REFS -gt 0 ]; then
  echo -e "  Invalid: ${RED}$INVALID_REFS${NC}"
else
  echo -e "  Invalid: ${GREEN}$INVALID_REFS${NC}"
fi
echo ""

# Exit code
if [ $INVALID_LINKS -gt 0 ] || [ $INVALID_REFS -gt 0 ]; then
  echo -e "${RED}❌ Validation FAILED${NC}"
  echo ""
  echo "Fix invalid links and references, then run again."
  exit 1
else
  echo -e "${GREEN}✅ Validation PASSED${NC}"
  echo ""
  echo "All links and references are valid!"
  exit 0
fi

