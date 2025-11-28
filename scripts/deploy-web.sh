#!/usr/bin/env bash
# Deploy script for Dim Lantern
# Usage: ./scripts/deploy-web.sh [--skip-tests]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKIP_TESTS=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --help|-h)
            echo "Usage: ./scripts/deploy-web.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --skip-tests  Skip running tests (emergency only)"
            echo "  --help, -h    Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "🕯️  Deploying Dim Lantern..."

cd "$PROJECT_ROOT/docs"

# Run linting
echo "🔍 Running linter..."
npm run lint || {
    echo "❌ Linting failed. Fix errors before deploying."
    exit 1
}

# Run tests (unless skipped)
if [ "$SKIP_TESTS" = false ]; then
    echo "🧪 Running tests..."
    npm test || {
        echo "❌ Tests failed. Fix tests before deploying."
        exit 1
    }
else
    echo "⚠️  Skipping tests (--skip-tests flag)"
fi

# Check for uncommitted changes
cd "$PROJECT_ROOT"
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Staging changes..."
    git add -A
    
    echo "💾 Committing..."
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    git commit -m "Deploy: $TIMESTAMP"
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push

echo ""
echo "✅ Deployment complete!"
echo "🌐 Live at: https://bordenet.github.io/GameWiki/"

