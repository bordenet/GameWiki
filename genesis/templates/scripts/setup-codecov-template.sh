#!/usr/bin/env bash
# {{PROJECT_NAME}} - Codecov Setup Script
# This script helps you set up Codecov integration for code coverage reporting
#
# REFERENCE IMPLEMENTATION:
#     https://github.com/bordenet/product-requirements-assistant/blob/main/scripts/setup-codecov.sh

set -e

REPO_OWNER="{{GITHUB_USER}}"
REPO_NAME="{{GITHUB_REPO}}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Codecov Setup for ${REPO_OWNER}/${REPO_NAME}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo ""
    echo "Install it from: https://cli.github.com/"
    echo ""
    echo "macOS:   brew install gh"
    echo "Linux:   See https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    echo "Windows: See https://github.com/cli/cli#windows"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI"
    echo ""
    echo "Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Check if secret already exists
if gh secret list | grep -q "CODECOV_TOKEN"; then
    echo "⚠️  CODECOV_TOKEN secret already exists"
    echo ""
    read -p "Do you want to update it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping token update"
        exit 0
    fi
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Get Your Codecov Token"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Sign up at: https://about.codecov.io/sign-up/"
echo "2. Authorize with GitHub"
echo "3. Go to: https://app.codecov.io/gh/${REPO_OWNER}/${REPO_NAME}/settings"
echo "4. Copy the 'Repository Upload Token'"
echo ""
echo "Opening Codecov in your browser..."
sleep 2

# Open Codecov settings page
if command -v open &> /dev/null; then
    # macOS
    open "https://app.codecov.io/gh/${REPO_OWNER}/${REPO_NAME}/settings" 2>/dev/null || true
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open "https://app.codecov.io/gh/${REPO_OWNER}/${REPO_NAME}/settings" 2>/dev/null || true
elif command -v start &> /dev/null; then
    # Windows
    start "https://app.codecov.io/gh/${REPO_OWNER}/${REPO_NAME}/settings" 2>/dev/null || true
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Add Token to GitHub Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Paste your Codecov token here: " -r CODECOV_TOKEN
echo ""

if [ -z "$CODECOV_TOKEN" ]; then
    echo "❌ No token provided"
    exit 1
fi

# Validate token format (should be a UUID or similar)
if [[ ! $CODECOV_TOKEN =~ ^[a-zA-Z0-9_-]+$ ]]; then
    echo "⚠️  Token format looks unusual. Are you sure this is correct?"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted"
        exit 1
    fi
fi

# Add secret to GitHub
echo "Adding CODECOV_TOKEN to GitHub secrets..."
if gh secret set CODECOV_TOKEN --body "$CODECOV_TOKEN"; then
    echo "✅ Token added successfully!"
else
    echo "❌ Failed to add token"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Verify Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if secret exists
if gh secret list | grep -q "CODECOV_TOKEN"; then
    echo "✅ CODECOV_TOKEN secret is configured"
else
    echo "❌ CODECOV_TOKEN secret not found"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Codecov Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Commit and push your changes to trigger CI"
echo "2. Check CI logs for 'Upload coverage to Codecov' step"
echo "3. View coverage at: https://app.codecov.io/gh/${REPO_OWNER}/${REPO_NAME}"
echo ""
echo "Note: Make sure codecov.yml is configured in your project root"
echo ""

