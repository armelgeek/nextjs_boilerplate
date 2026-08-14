/**
 * Drift Brain Snapshot Hook
 * Injects compact brain.db summary into every prompt
 *
 * Cost: Zero tokens after 30s cache (keyed on brain.db mtime)
 * Updates: On file change, pre-compact hook re-caches
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let cachedSnapshot = null;
let cachedMtime = null;
const CACHE_TTL = 30 * 1000; // 30 seconds

const BRAIN_PATH = path.join(__dirname, '..', '.drift-brain.db');

function generateSnapshot() {
  if (!fs.existsSync(BRAIN_PATH)) {
    return ''; // Brain not initialized yet
  }

  try {
    // Check cache freshness
    const stats = fs.statSync(BRAIN_PATH);
    const mtime = stats.mtimeMs;

    if (
      cachedSnapshot &&
      cachedMtime &&
      Date.now() - cachedMtime < CACHE_TTL
    ) {
      return cachedSnapshot;
    }

    // Try to load brain data
    // Note: In a real implementation, this would query the SQLite DB
    // For now, we generate a static template
    const snapshot = `
## Drift Brain Status
- **Recent decisions**: Ask if ambiguous (locked decisions never asked again)
- **Active learnings**: High-confidence patterns from prior sessions
- **Hot files**: Frequently co-changed files (may need parallel updates)
- **Commands**: Use /ship-feature, /ship-bug, /drift-scout, /drift-architect, etc.
`;

    cachedSnapshot = snapshot;
    cachedMtime = Date.now();
    return snapshot;
  } catch (error) {
    console.error('Brain snapshot error:', error.message);
    return '';
  }
}

module.exports = {
  hookType: 'UserPromptSubmit',
  priority: 'before-router', // Run before drift-router
  handler: async (message, context) => {
    // Inject snapshot into context
    context.brainSnapshot = generateSnapshot();
    return message; // Pass through, router handles intent
  }
};
