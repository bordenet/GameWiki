#!/bin/bash

# Run Evolutionary Optimization Simulations
# Executes 20-round and 40-round simulations to validate methodology

set -e

VERBOSE=false
SHOW_HELP=false

# Color codes
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -v|--verbose)
      VERBOSE=true
      shift
      ;;
    -h|--help)
      SHOW_HELP=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      SHOW_HELP=true
      shift
      ;;
  esac
done

# Help documentation
if [ "$SHOW_HELP" = true ]; then
  cat << 'EOF'
NAME
    run-simulations.sh - Execute evolutionary optimization simulations

SYNOPSIS
    ./tools/run-simulations.sh [OPTIONS]

DESCRIPTION
    Runs both 20-round and 40-round evolutionary optimization simulations
    to validate the methodology and measure diminishing returns.

OPTIONS
    -v, --verbose
        Enable verbose output showing detailed progress

    -h, --help
        Display this help message and exit

EXAMPLES
    # Run both simulations (minimal output)
    ./tools/run-simulations.sh

    # Run with verbose output
    ./tools/run-simulations.sh --verbose

WORKFLOW
    1. Set up clean working directory
    2. Run 20-round simulation with 5 proven mutations
    3. Capture results and generate report
    4. Reset working directory
    5. Run 40-round simulation (20 rounds + 20 extended)
    6. Capture results and generate report
    7. Generate comparative analysis

OUTPUT
    Results saved to:
    - evolutionary-optimization/simulation-results/20-round-report.md
    - evolutionary-optimization/simulation-results/40-round-report.md
    - evolutionary-optimization/simulation-results/comparative-analysis.md

SEE ALSO
    tools/README.md - Complete documentation
    tools/evolutionary-optimizer.js - Main optimizer

EOF
  exit 0
fi

# Timer in top right corner
start_time=$(date +%s)
show_timer() {
  if [ "$VERBOSE" = false ]; then
    elapsed=$(($(date +%s) - start_time))
    mins=$((elapsed / 60))
    secs=$((elapsed % 60))
    tput sc
    tput cup 0 $(($(tput cols) - 15))
    echo -ne "${YELLOW}\033[40m ⏱  ${mins}m ${secs}s ${NC}"
    tput rc
  fi
}

trap show_timer EXIT

log() {
  if [ "$VERBOSE" = true ]; then
    echo -e "${BLUE}[$(date +%H:%M:%S)]${NC} $1"
  fi
}

success() {
  echo -e "${GREEN}✅${NC} $1"
}

error() {
  echo -e "${RED}❌${NC} $1"
  exit 1
}

info() {
  echo -e "${CYAN}ℹ️${NC}  $1"
}

# Main execution
echo -e "${GREEN}🧬 Evolutionary Optimization Simulations${NC}\n"

# Create simulation results directory
RESULTS_DIR="evolutionary-optimization/simulation-results"
mkdir -p "$RESULTS_DIR"

# Step 1: Prepare for 20-round simulation
info "Preparing 20-round simulation..."
log "Creating clean working directory..."

rm -rf evolutionary-optimization/working
mkdir -p evolutionary-optimization/working
cp prompts/*.md evolutionary-optimization/working/

# Create 20-round config
cat > evolutionary-optimization/config-20round.json << 'EOF'
{
  "baselineDir": "prompts",
  "workingDir": "evolutionary-optimization/working",
  "resultsDir": "evolutionary-optimization/results-20round",
  "testCasesFile": "evolutionary-optimization/test-cases.json",
  "maxRounds": 20,
  "minImprovement": 0.01,
  "scoringCriteria": [
    "comprehensiveness",
    "clarity",
    "structure",
    "consistency",
    "engineeringReady"
  ]
}
EOF

success "20-round config created"

# Step 2: Run 20-round simulation
echo ""
info "Running 20-round simulation..."
echo ""

if [ "$VERBOSE" = true ]; then
  node tools/run-simulation.js evolutionary-optimization/config-20round.json 20
else
  node tools/run-simulation.js evolutionary-optimization/config-20round.json 20 2>&1 | grep -E "^(🚀|✅|❌|📊|🧬|⚠️|📄|Round)"
fi

# Copy results
cp evolutionary-optimization/results-20round/optimization-report.md "$RESULTS_DIR/20-round-report.md" 2>/dev/null || true
success "20-round simulation complete"

# Step 3: Prepare for 40-round simulation
echo ""
info "Preparing 40-round simulation..."

rm -rf evolutionary-optimization/working
mkdir -p evolutionary-optimization/working
cp prompts/*.md evolutionary-optimization/working/

# Create 40-round config
cat > evolutionary-optimization/config-40round.json << 'EOF'
{
  "baselineDir": "prompts",
  "workingDir": "evolutionary-optimization/working",
  "resultsDir": "evolutionary-optimization/results-40round",
  "testCasesFile": "evolutionary-optimization/test-cases.json",
  "maxRounds": 40,
  "minImprovement": 0.001,
  "scoringCriteria": [
    "comprehensiveness",
    "clarity",
    "structure",
    "consistency",
    "engineeringReady"
  ]
}
EOF

success "40-round config created"

# Step 4: Run 40-round simulation
echo ""
info "Running 40-round simulation (this may take longer)..."
echo ""

if [ "$VERBOSE" = true ]; then
  node tools/run-simulation.js evolutionary-optimization/config-40round.json 40
else
  node tools/run-simulation.js evolutionary-optimization/config-40round.json 40 2>&1 | grep -E "^(🚀|✅|❌|📊|🧬|⚠️|📄|Round)"
fi

# Copy results
cp evolutionary-optimization/results-40round/optimization-report.md "$RESULTS_DIR/40-round-report.md" 2>/dev/null || true
success "40-round simulation complete"

# Step 5: Generate comparative analysis
echo ""
info "Generating comparative analysis..."

node tools/generate-comparison.js "$RESULTS_DIR" 2>/dev/null || echo "Comparison generation skipped (tool not yet implemented)"

# Summary
echo ""
echo -e "${GREEN}✅ Simulations Complete!${NC}"
echo ""
echo "Results:"
echo "  📄 20-round: $RESULTS_DIR/20-round-report.md"
echo "  📄 40-round: $RESULTS_DIR/40-round-report.md"
echo "  📄 Analysis: $RESULTS_DIR/comparative-analysis.md"
echo ""

show_timer

