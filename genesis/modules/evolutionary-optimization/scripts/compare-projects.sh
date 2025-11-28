#!/bin/bash

# Cross-Project Quality Comparison
# Compares evolutionary optimization results across Genesis-spawned projects
#
# Usage: ./compare-projects.sh [--verbose]
#
# This script finds all Genesis projects with optimization results and compares their quality scores.

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Parse arguments
VERBOSE=false
if [[ "$1" == "--verbose" ]]; then
  VERBOSE=true
fi

echo -e "${BLUE}🔍 Cross-Project Quality Comparison${NC}\n"

# Find all Genesis projects with evolutionary optimization results
PROJECTS=()
PROJECT_DIRS=()

# Look in parent directory for sibling projects
PARENT_DIR="$(dirname "$(pwd)")"

for dir in "$PARENT_DIR"/*/evolutionary-optimization/results; do
  if [ -d "$dir" ]; then
    project_name=$(basename "$(dirname "$(dirname "$dir")")")
    PROJECTS+=("$project_name")
    PROJECT_DIRS+=("$(dirname "$(dirname "$dir")")")
  fi
done

if [ ${#PROJECTS[@]} -eq 0 ]; then
  echo -e "${YELLOW}⚠️  No projects with optimization results found.${NC}"
  echo ""
  echo "Expected directory structure:"
  echo "  parent-dir/"
  echo "    ├── project-1/evolutionary-optimization/results/"
  echo "    ├── project-2/evolutionary-optimization/results/"
  echo "    └── genesis/"
  echo ""
  exit 0
fi

echo -e "${GREEN}Found ${#PROJECTS[@]} projects with optimization results:${NC}"
echo ""

# Create comparison table
printf "%-35s %-15s %-15s %-15s %-12s\n" "Project" "Baseline" "Optimized" "Improvement" "Rounds"
printf "%-35s %-15s %-15s %-15s %-12s\n" "$(printf '%.0s-' {1..35})" "$(printf '%.0s-' {1..15})" "$(printf '%.0s-' {1..15})" "$(printf '%.0s-' {1..15})" "$(printf '%.0s-' {1..12})"

for i in "${!PROJECTS[@]}"; do
  project="${PROJECTS[$i]}"
  project_dir="${PROJECT_DIRS[$i]}"
  results_file="$project_dir/evolutionary-optimization/results/optimization-report.md"

  if [ -f "$results_file" ]; then
    # Extract scores from report
    baseline=$(grep -oP "Baseline.*?(\d+\.\d+)/5" "$results_file" | grep -oP "\d+\.\d+" | head -1 || echo "N/A")
    optimized=$(grep -oP "Final.*?(\d+\.\d+)/5" "$results_file" | grep -oP "\d+\.\d+" | head -1 || echo "N/A")
    improvement=$(grep -oP "Improvement.*?([+\-]\d+\.\d+%)" "$results_file" | grep -oP "[+\-]\d+\.\d+" | head -1 || echo "N/A")
    rounds=$(grep -oP "Rounds.*?(\d+)" "$results_file" | grep -oP "\d+" | head -1 || echo "N/A")

    # Format for display
    if [ "$baseline" != "N/A" ]; then
      baseline="${baseline}/5.0"
    fi
    if [ "$optimized" != "N/A" ]; then
      optimized="${optimized}/5.0"
    fi
    if [ "$improvement" != "N/A" ]; then
      improvement="${improvement}%"
    fi

    printf "%-35s %-15s %-15s %-15s %-12s\n" "$project" "$baseline" "$optimized" "$improvement" "$rounds"

    if [ "$VERBOSE" = true ]; then
      echo "  📁 Results: $results_file"
    fi
  else
    printf "%-35s %-15s %-15s %-15s %-12s\n" "$project" "N/A" "N/A" "N/A" "N/A"
    if [ "$VERBOSE" = true ]; then
      echo "  ⚠️  No results file found"
    fi
  fi
done

echo ""
echo -e "${GREEN}✅ Comparison complete${NC}"
echo ""

if [ "$VERBOSE" = true ]; then
  echo "💡 Tip: Run optimization in projects without results:"
  echo "   cd <project> && ./tools/run-simulations.sh"
  echo ""
fi

