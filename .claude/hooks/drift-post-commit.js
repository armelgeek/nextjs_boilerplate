// drift-post-commit.js
// Triggered after successful git commit
// Invokes drift-guide to validate commit against current task plan

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const brainDb = path.join(__dirname, "..", ".drift-brain.db");

// Skip if:
// - brain.db doesn't exist yet (initial commit)
// - not in a /ship workflow (no current task)
// - in a non-feature branch
if (!fs.existsSync(brainDb)) {
  process.exit(0);
}

// Get current branch
const branch = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
  encoding: "utf-8",
}).stdout.trim();

// Only run on feature/fix/chore branches
if (!["main", "develop"].includes(branch) && !branch.startsWith("feature/") && !branch.startsWith("fix/") && !branch.startsWith("chore/")) {
  process.exit(0);
}

// Get latest commit
const latestCommit = spawnSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf-8",
}).stdout.trim();

const commitMessage = spawnSync("git", ["log", "-1", "--format=%B", latestCommit], {
  encoding: "utf-8",
}).stdout.trim();

// Skip if commit message contains [skip-guide]
if (commitMessage.includes("[skip-guide]")) {
  process.exit(0);
}

// Get changed files in this commit
const changedFiles = spawnSync("git", ["diff-tree", "--no-commit-id", "--name-only", "-r", latestCommit], {
  encoding: "utf-8",
}).stdout.trim().split("\n").filter(Boolean);

// Get current task from brain.db (most recent task in progress)
// This is a simplified check - real implementation would query brain.db
const currentTask = process.env.DRIFT_CURRENT_TASK || "";

if (!currentTask && changedFiles.length > 0) {
  // If no explicit task context, we're in dev mode - just log
  console.log(`[drift-guide] Post-commit validation (dev mode)`);
  console.log(`  Commit: ${latestCommit.slice(0, 7)}`);
  console.log(`  Files changed: ${changedFiles.length}`);
  console.log(`  Note: Set DRIFT_CURRENT_TASK=task_id to enable plan validation`);
  process.exit(0);
}

// Log for manual review (full implementation would call drift-guide agent)
console.log(`[drift-guide] Validating against task: ${currentTask}`);
console.log(`  Commit: ${commitMessage.split("\n")[0]}`);
console.log(`  Files: ${changedFiles.join(", ")}`);
console.log(`  Action: Run 'drift-guide --validate' for detailed feedback`);

process.exit(0);
