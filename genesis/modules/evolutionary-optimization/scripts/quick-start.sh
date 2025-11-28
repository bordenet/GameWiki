#!/bin/bash

# Quick Start for Evolutionary Optimization
# Simplified entry point for new users
#
# Usage: ./quick-start.sh [--help]
#
# This script guides you through setting up and running evolutionary optimization.

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Parse arguments
if [[ "$1" == "--help" ]]; then
  echo "Quick Start for Evolutionary Optimization"
  echo ""
  echo "Usage: ./quick-start.sh"
  echo ""
  echo "This script will:"
  echo "  1. Check if test cases exist (create from template if not)"
  echo "  2. Check if config exists (create from template if not)"
  echo "  3. Run 20-round optimization"
  echo "  4. Display results"
  echo ""
  exit 0
fi

echo -e "${BLUE}🚀 Evolutionary Optimization Quick Start${NC}\n"

# Step 1: Check if test cases exist
if [ ! -f "evolutionary-optimization/test-cases.json" ]; then
  echo -e "${YELLOW}⚠️  No test cases found. Creating from template...${NC}"
  
  if [ -f "evolutionary-optimization/test-cases.example.json" ]; then
    cp evolutionary-optimization/test-cases.example.json evolutionary-optimization/test-cases.json
    echo -e "${GREEN}✅ Created test-cases.json${NC}"
    echo ""
    echo -e "${CYAN}📝 NEXT STEP: Edit evolutionary-optimization/test-cases.json with your project-specific test cases${NC}"
    echo ""
    echo "Example test case structure:"
    echo "  {"
    echo "    \"id\": \"tc1-example\","
    echo "    \"title\": \"Example Test Case\","
    echo "    \"type\": \"Your Project Type\","
    echo "    \"complexity\": \"Simple|Medium|High\","
    echo "    ... (project-specific fields)"
    echo "  }"
    echo ""
    echo "After editing, run this script again to continue."
    exit 0
  else
    echo -e "${YELLOW}⚠️  No template found. Please create evolutionary-optimization/test-cases.json manually.${NC}"
    exit 1
  fi
fi

echo -e "${GREEN}✅ Found test cases: evolutionary-optimization/test-cases.json${NC}"

# Step 2: Check if config exists
if [ ! -f "evolutionary-optimization/config.json" ]; then
  echo -e "${YELLOW}⚠️  No config found. Creating from template...${NC}"
  
  if [ -f "evolutionary-optimization/config.example.json" ]; then
    cp evolutionary-optimization/config.example.json evolutionary-optimization/config.json
    echo -e "${GREEN}✅ Created config.json${NC}"
  else
    echo -e "${YELLOW}⚠️  No template found. Using default config.${NC}"
  fi
fi

echo -e "${GREEN}✅ Found config: evolutionary-optimization/config.json${NC}"
echo ""

# Step 3: Check if tools exist
if [ ! -f "tools/run-simulations.sh" ]; then
  echo -e "${YELLOW}⚠️  Optimization tools not found. Please ensure Genesis setup completed successfully.${NC}"
  exit 1
fi

# Step 4: Run optimization
echo -e "${CYAN}🔄 Running 20-round optimization...${NC}"
echo ""
echo "This will:"
echo "  - Test your prompts against all test cases"
echo "  - Apply mutations to improve quality"
echo "  - Keep improvements, discard regressions"
echo "  - Generate comprehensive report"
echo ""
echo "Expected time: 30-60 minutes"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

# Run the optimization
./tools/run-simulations.sh

echo ""
echo -e "${GREEN}✅ Optimization complete!${NC}"
echo ""
echo -e "${CYAN}📊 Results:${NC}"
echo "  - Report: evolutionary-optimization/results/optimization-report.md"
echo "  - Working files: evolutionary-optimization/working/"
echo ""
echo -e "${CYAN}💡 Next Steps:${NC}"
echo "  1. Review the optimization report"
echo "  2. Check which mutations were kept vs. discarded"
echo "  3. Apply learnings to your prompts"
echo "  4. Run again if needed (diminishing returns after 15-20 rounds)"
echo ""

