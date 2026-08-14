/**
 * Drift Pre-Compact Hook
 * PreCompact: Save brain checkpoint before session compaction
 * Ensures no knowledge is lost when context is compressed
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BRAIN_PATH = path.join(__dirname, '..', '.drift-brain.db');
const CHECKPOINTS_DIR = path.join(__dirname, '..', '.brain-checkpoints');

function saveCheckpoint() {
  try {
    // Ensure checkpoints directory exists
    if (!fs.existsSync(CHECKPOINTS_DIR)) {
      fs.mkdirSync(CHECKPOINTS_DIR, { recursive: true });
    }

    // If brain.db exists, create a backup
    if (fs.existsSync(BRAIN_PATH)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const checkpointPath = path.join(
        CHECKPOINTS_DIR,
        `brain-${timestamp}.db`
      );

      fs.copyFileSync(BRAIN_PATH, checkpointPath);
      console.log(`✓ Drift brain checkpoint saved: ${checkpointPath}`);

      // Keep only last 10 checkpoints
      const files = fs
        .readdirSync(CHECKPOINTS_DIR)
        .filter(f => f.startsWith('brain-'))
        .sort()
        .reverse();

      if (files.length > 10) {
        files.slice(10).forEach(f => {
          fs.unlinkSync(path.join(CHECKPOINTS_DIR, f));
        });
      }
    }
  } catch (error) {
    console.error('Brain checkpoint error:', error.message);
  }
}

module.exports = {
  hookType: 'PreCompact',
  handler: async () => {
    saveCheckpoint();
  }
};
