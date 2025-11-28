#!/bin/bash
# Genesis Template Verification Script
# Verifies all template files are referenced in START-HERE.md

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GENESIS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔍 Genesis Template Verification"
echo "================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Find all template files
echo "📁 Finding all template files..."
TEMPLATE_FILES=$(find "$GENESIS_ROOT/templates" -type f \( -name "*-template*" -o -name "*.template" \) | sort)
TEMPLATE_COUNT=$(echo "$TEMPLATE_FILES" | wc -l | tr -d ' ')
echo "   Found $TEMPLATE_COUNT template files"
echo ""

# Check each template file is mentioned in START-HERE.md
echo "📋 Checking START-HERE.md references..."
while IFS= read -r template_file; do
    # Get relative path from genesis root
    rel_path="${template_file#$GENESIS_ROOT/}"
    
    # Get just the filename
    filename=$(basename "$template_file")
    
    # Check if mentioned in START-HERE.md
    if grep -q "$rel_path" "$GENESIS_ROOT/START-HERE.md" 2>/dev/null; then
        echo -e "   ${GREEN}✓${NC} $rel_path"
    else
        # Try just filename
        if grep -q "$filename" "$GENESIS_ROOT/START-HERE.md" 2>/dev/null; then
            echo -e "   ${YELLOW}⚠${NC} $rel_path (mentioned by filename only)"
            ((WARNINGS++))
        else
            echo -e "   ${RED}✗${NC} $rel_path (NOT MENTIONED)"
            ((ERRORS++))
        fi
    fi
done <<< "$TEMPLATE_FILES"

echo ""

# Check for broken references in START-HERE.md
echo "🔗 Checking for broken references in START-HERE.md..."
BROKEN_REFS=0

# Extract all cp commands from START-HERE.md
grep "cp genesis/templates/" "$GENESIS_ROOT/START-HERE.md" | while IFS= read -r line; do
    # Extract the source path
    if [[ $line =~ genesis/templates/([^ ]+) ]]; then
        source_path="${BASH_REMATCH[1]}"
        full_path="$GENESIS_ROOT/templates/$source_path"
        
        if [ ! -f "$full_path" ]; then
            echo -e "   ${RED}✗${NC} Broken reference: $source_path"
            ((BROKEN_REFS++))
        fi
    fi
done

if [ $BROKEN_REFS -eq 0 ]; then
    echo -e "   ${GREEN}✓${NC} No broken references found"
fi

echo ""

# Check workflow file references
echo "🔄 Checking GitHub Actions workflow references..."
if grep -q ".github/workflows/ci.yml" "$GENESIS_ROOT/templates/project-structure/README-template.md"; then
    if [ -f "$GENESIS_ROOT/templates/github/workflows/ci-template.yml" ]; then
        echo -e "   ${GREEN}✓${NC} README badge references ci.yml (template exists)"
    else
        echo -e "   ${RED}✗${NC} README badge references ci.yml (template MISSING)"
        ((ERRORS++))
    fi
else
    echo -e "   ${YELLOW}⚠${NC} No workflow references found in README template"
    ((WARNINGS++))
fi

echo ""

# Check for .nojekyll mention
echo "📄 Checking for .nojekyll file creation..."
if grep -q "\.nojekyll" "$GENESIS_ROOT/START-HERE.md"; then
    echo -e "   ${GREEN}✓${NC} .nojekyll creation mentioned in START-HERE.md"
else
    echo -e "   ${RED}✗${NC} .nojekyll NOT mentioned in START-HERE.md"
    ((ERRORS++))
fi

echo ""

# Summary
echo "================================="
echo "📊 Verification Summary"
echo "================================="
echo "Template files found: $TEMPLATE_COUNT"
echo -e "Errors: ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Passed with warnings${NC}"
    exit 0
else
    echo -e "${RED}❌ Verification failed with $ERRORS errors${NC}"
    exit 1
fi

