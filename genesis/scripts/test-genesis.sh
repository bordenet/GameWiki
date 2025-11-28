#!/bin/bash
# Genesis End-to-End Test Script
# Creates a test project from Genesis templates to verify everything works

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GENESIS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEST_DIR="/tmp/genesis-test-$$"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Genesis End-to-End Test${NC}"
echo "================================="
echo ""
echo "Test directory: $TEST_DIR"
echo ""

# Create test directory
echo "📁 Creating test directory..."
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

# Copy genesis directory
echo "📋 Copying Genesis templates..."
cp -r "$GENESIS_ROOT" genesis/

# Simulate AI following START-HERE.md
echo ""
echo -e "${BLUE}🤖 Simulating AI execution of START-HERE.md...${NC}"
echo ""

# Step 3.1: Copy Core Files
echo "Step 3.1: Copying core files..."
cp genesis/templates/project-structure/gitignore-template .gitignore
cp genesis/templates/CLAUDE.md.template CLAUDE.md
cp genesis/templates/project-structure/README-template.md README.md
cp genesis/templates/project-structure/REVERSE-INTEGRATION-NOTES-template.md REVERSE-INTEGRATION-NOTES.md
cp genesis/templates/testing/package-template.json package.json
cp genesis/templates/project-structure/.eslintrc-template.json .eslintrc.json
cp genesis/templates/project-structure/codecov-template.yml codecov.yml
cp genesis/templates/testing/jest.config-template.js jest.config.js
cp genesis/templates/testing/jest.setup-template.js jest.setup.js

# Copy GitHub Actions workflows
mkdir -p .github/workflows
cp genesis/templates/github/workflows/ci-template.yml .github/workflows/ci.yml

echo -e "${GREEN}✓${NC} Core files copied"

# Step 3.2: Copy Web App Files
echo "Step 3.2: Copying web app files..."
cp genesis/templates/web-app/index-template.html index.html

mkdir -p js
cp genesis/templates/web-app/js/app-template.js js/app.js
cp genesis/templates/web-app/js/workflow-template.js js/workflow.js
cp genesis/templates/web-app/js/storage-template.js js/storage.js
cp genesis/templates/web-app/js/ai-mock-template.js js/ai-mock.js
cp genesis/templates/web-app/js/ai-mock-ui-template.js js/ai-mock-ui.js
cp genesis/templates/web-app/js/same-llm-adversarial-template.js js/same-llm-adversarial.js

mkdir -p css
cp genesis/templates/web-app/css/styles-template.css css/styles.css

touch .nojekyll

mkdir -p data

mkdir -p tests
cp genesis/templates/testing/ai-mock.test-template.js tests/ai-mock.test.js
cp genesis/templates/testing/storage.test-template.js tests/storage.test.js
cp genesis/templates/testing/workflow.e2e-template.js tests/workflow.test.js
cp genesis/templates/testing/same-llm-adversarial.test-template.js tests/same-llm-adversarial.test.js

echo -e "${GREEN}✓${NC} Web app files copied"

# Step 3.3: Copy Prompts and Templates
echo "Step 3.3: Copying prompts and templates..."
mkdir -p prompts
cp genesis/templates/prompts/phase1-template.md prompts/phase1.md
cp genesis/templates/prompts/phase2-template.md prompts/phase2.md
cp genesis/templates/prompts/phase3-template.md prompts/phase3.md

mkdir -p templates
echo "# Document Template" > templates/document-template.md

echo -e "${GREEN}✓${NC} Prompts and templates copied"

# Step 3.4: Copy Scripts
echo "Step 3.4: Copying scripts..."
mkdir -p scripts/lib
cp genesis/templates/scripts/setup-macos-web-template.sh scripts/setup-macos.sh
cp genesis/templates/scripts/deploy-web.sh.template scripts/deploy-web.sh
cp genesis/templates/scripts/lib/common-template.sh scripts/lib/common.sh
cp genesis/templates/scripts/lib/compact.sh scripts/lib/compact.sh
cp genesis/templates/scripts/install-hooks-template.sh scripts/install-hooks.sh

chmod +x scripts/*.sh scripts/lib/*.sh

echo -e "${GREEN}✓${NC} Scripts copied"

# Verification
echo ""
echo -e "${BLUE}🔍 Verifying critical files...${NC}"

CRITICAL_FILES=(
    ".gitignore"
    "CLAUDE.md"
    "README.md"
    "package.json"
    ".eslintrc.json"
    ".github/workflows/ci.yml"
    "index.html"
    "js/app.js"
    "css/styles.css"
    ".nojekyll"
    "tests/ai-mock.test.js"
    "prompts/phase1.md"
    "scripts/deploy-web.sh"
)

MISSING=0
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file"
    else
        echo -e "   ${RED}✗${NC} $file (MISSING)"
        ((MISSING++))
    fi
done

echo ""
echo "================================="
echo "📊 Test Summary"
echo "================================="
echo "Test directory: $TEST_DIR"
echo "Critical files checked: ${#CRITICAL_FILES[@]}"
echo -e "Missing files: ${RED}$MISSING${NC}"
echo ""

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✅ All critical files present!${NC}"
    echo ""
    echo "To inspect the test project:"
    echo "  cd $TEST_DIR"
    echo ""
    echo "To clean up:"
    echo "  rm -rf $TEST_DIR"
    exit 0
else
    echo -e "${RED}❌ Test failed - $MISSING files missing${NC}"
    exit 1
fi

