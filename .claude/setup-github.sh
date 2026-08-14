#!/bin/bash
# Setup GitHub-Native workflow for Drift
# Enables Discussions + Wiki + Issues, configures tokens

set -e

echo "🚀 Drift GitHub-Native Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Install it: https://cli.github.com"
    exit 1
fi

# Get current repo
REPO=$(gh repo view --json nameWithOwner -q 2>/dev/null || echo "")
if [ -z "$REPO" ]; then
    echo "❌ Not in a GitHub repo. Run this from your Drift directory."
    exit 1
fi

echo "✅ Found repo: $REPO"
echo ""

# Check if authenticated
if ! gh auth status &>/dev/null; then
    echo "🔐 Authenticating with GitHub..."
    gh auth login
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Enabling GitHub Discussions..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Note: GitHub CLI doesn't have built-in Discussions toggle
# User needs to do this manually in settings
echo "📝 Manual step required:"
echo "   1. Go to: https://github.com/$REPO/settings"
echo "   2. Scroll to 'Features' section"
echo "   3. Enable ✅ Discussions"
echo "   4. Click 'Save'"
echo ""
read -p "⏸️  Press Enter when done..."

# Check if Discussions is enabled
echo "✅ Checking if Discussions is enabled..."
if gh api repos/$REPO | grep -q '"discussions":true'; then
    echo "✅ Discussions enabled!"
else
    echo "⚠️  Discussions might not be enabled yet. Check repo settings."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Creating Discussion Categories..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📝 Manual step required:"
echo "   1. Go to: https://github.com/$REPO/discussions"
echo "   2. Click 'New discussion'"
echo "   3. Create these categories:"
echo ""
echo "      Category: Standups"
echo "      Description: Daily standup updates"
echo ""
echo "      Category: PRDs"
echo "      Description: Product requirement documents"
echo ""
echo "      Category: Postmortems"
echo "      Description: Incident analysis and postmortems"
echo ""
echo "      Category: Decisions"
echo "      Description: Architecture and design decisions"
echo ""
read -p "⏸️  Press Enter when done..."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Generating GitHub Token..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get or create PAT
echo "Checking for existing token..."
TOKEN=$(gh auth token 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
    echo "❌ Could not retrieve token. Create one manually:"
    echo "   1. Go to: https://github.com/settings/tokens"
    echo "   2. Click 'Generate new token (classic)'"
    echo "   3. Name: Drift"
    echo "   4. Scopes: repo, discussions, workflow"
    echo "   5. Generate and copy the token"
    echo ""
    read -p "Enter your GitHub token: " TOKEN
fi

if [ -z "$TOKEN" ]; then
    echo "❌ No token provided. Exiting."
    exit 1
fi

echo "✅ Token obtained"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Updating .claude/integrations.env..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Update integrations.env
INTEGRATIONS_FILE=".claude/integrations.env"

if [ -f "$INTEGRATIONS_FILE" ]; then
    # Use sed to replace the placeholders
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|GITHUB_REPO=username/repo|GITHUB_REPO=$REPO|g" "$INTEGRATIONS_FILE"
        sed -i '' "s|GITHUB_TOKEN=.*|GITHUB_TOKEN=$TOKEN|g" "$INTEGRATIONS_FILE"
    else
        # Linux
        sed -i "s|GITHUB_REPO=username/repo|GITHUB_REPO=$REPO|g" "$INTEGRATIONS_FILE"
        sed -i "s|GITHUB_TOKEN=.*|GITHUB_TOKEN=$TOKEN|g" "$INTEGRATIONS_FILE"
    fi

    echo "✅ Updated $INTEGRATIONS_FILE"
else
    echo "❌ $INTEGRATIONS_FILE not found"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  Enabling GitHub Wiki..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📝 Manual step required:"
echo "   1. Go to: https://github.com/$REPO/settings"
echo "   2. Scroll to 'Features' section"
echo "   3. Enable ✅ Wiki"
echo "   4. Click 'Save'"
echo ""
read -p "⏸️  Press Enter when done..."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Your Drift workflow is now GitHub-native:"
echo ""
echo "   📊 Standups     → GitHub Discussions"
echo "   📝 PRDs         → GitHub Wiki"
echo "   📋 Issues       → GitHub Issues"
echo "   💬 Discussions  → GitHub Discussions"
echo ""
echo "Try it:"
echo "   source .claude/integrations.env"
echo "   /standup"
echo ""
echo "That's it! Everything works now. 🚀"
