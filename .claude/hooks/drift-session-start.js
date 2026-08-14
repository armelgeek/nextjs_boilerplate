// drift-session-start.js
// SessionStart hook: Auto-initialize brain.db on new session

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const brainDb = path.join(__dirname, "..", ".drift-brain.db");
const initScript = path.join(__dirname, "..", "brain-init.js");

// Check if brain.db exists
if (!fs.existsSync(brainDb)) {
  console.log("🧠 Initializing Drift Brain...");

  try {
    const result = spawnSync("node", [initScript], {
      cwd: path.dirname(brainDb),
      encoding: "utf-8",
    });

    if (result.status === 0) {
      console.log("✅ Drift Brain ready");
    } else {
      console.error("⚠️  Brain initialization failed, but continuing...");
      console.error(result.stderr);
    }
  } catch (error) {
    console.error("⚠️  Could not initialize brain:", error.message);
  }
} else {
  // Brain exists - quick health check
  try {
    const sqlite3 = require("better-sqlite3");
    const db = new sqlite3(brainDb);
    const count = db.prepare("SELECT COUNT(*) as c FROM sqlite_master WHERE type='table'").get();
    db.close();

    if (count.c >= 7) {
      // Silent success - brain is healthy
      process.exit(0);
    } else {
      console.warn("⚠️  Brain schema incomplete, consider running: sh .claude/init-brain.sh");
    }
  } catch (error) {
    console.warn("⚠️  Brain health check failed:", error.message);
  }
}

process.exit(0);
