#!/usr/bin/env bash
# Setup script for Dim Lantern (macOS)
# Usage: ./scripts/setup-macos.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🕯️  Setting up Dim Lantern..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first:"
    echo "   brew install node"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Found: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
cd "$PROJECT_ROOT/docs"

if [ -f "package-lock.json" ] && [ -d "node_modules" ]; then
    # Check if node_modules is up to date
    if [ "package-lock.json" -nt "node_modules/.package-lock.json" ] 2>/dev/null; then
        npm ci --silent
    else
        echo "   (using cached node_modules)"
    fi
else
    npm install --silent
fi

# Run linting
echo "🔍 Running linter..."
npm run lint --silent || {
    echo "⚠️  Linting issues found. Run 'npm run lint:fix' to auto-fix."
}

# Run tests
echo "🧪 Running tests..."
npm test --silent

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start developing:"
echo "  cd docs && python3 -m http.server 8000"
echo "  Open http://localhost:8000"

