#!/bin/bash

# Drift Brain Initialization Script
# Verifies dependencies, initializes brain.db, ready to use

set -e

BRAIN_PATH=".drift-brain.db"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🧠 Drift Brain Initialization"
echo "================================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install Node.js 18+ first."
    exit 1
fi
echo "✓ Node.js found: $(node --version)"

# Check better-sqlite3
echo ""
echo "Checking dependencies..."
if npm list better-sqlite3 > /dev/null 2>&1 || npm ls -g better-sqlite3 > /dev/null 2>&1; then
    echo "✓ better-sqlite3 installed"
else
    echo "⚠️  better-sqlite3 not installed. Installing..."
    npm install --save-dev better-sqlite3
    if [ $? -eq 0 ]; then
        echo "✓ better-sqlite3 installed"
    else
        echo "❌ Failed to install better-sqlite3"
        echo "Try: npm install --save-dev better-sqlite3"
        exit 1
    fi
fi

# Check if brain already exists
echo ""
if [ -f "$BRAIN_PATH" ]; then
    echo "✓ Brain database found at $BRAIN_PATH"

    # Verify schema is current
    TABLES_COUNT=$(sqlite3 "$BRAIN_PATH" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" 2>/dev/null || echo "0")

    if [ "$TABLES_COUNT" -ge 7 ]; then
        echo "✓ Schema verified (7 tables)"
        echo ""
        echo "Brain is ready! Try:"
        echo "  /brain-search decisions"
        echo "  /ship-feature \"add something\""
        echo "  /drift:status"
        exit 0
    else
        echo "⚠️  Schema outdated. Rebuilding..."
        rm "$BRAIN_PATH"
    fi
fi

# Initialize brain database
echo "Initializing brain database..."
cd "$SCRIPT_DIR"

if node brain-init.js; then
    echo "✓ Brain database created at $BRAIN_PATH"
else
    echo "❌ Failed to initialize brain"
    exit 1
fi

# Verify tables
TABLES_COUNT=$(sqlite3 "$BRAIN_PATH" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" 2>/dev/null || echo "0")

if [ "$TABLES_COUNT" -ge 7 ]; then
    echo "✓ Schema verified ($TABLES_COUNT tables)"

    # Show table names
    echo ""
    echo "Tables created:"
    sqlite3 "$BRAIN_PATH" "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;" | sed 's/^/  - /'

    echo ""
    echo "✅ Brain initialization complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Run: /ship-feature \"add dark mode\""
    echo "  2. Brain will learn from your development"
    echo "  3. Query with: /brain-search decisions"
    echo "  4. View stats: /drift:status"
    exit 0
else
    echo "❌ Schema verification failed"
    exit 1
fi
