#!/usr/bin/env node

/**
 * Git Co-Change Analysis
 * Extract files that frequently change together from git history
 * Populate hot_files table in brain.db
 */

const { execSync } = require('child_process');
const Database = require('better-sqlite3');
const path = require('path');

const BRAIN_PATH = path.join(__dirname, '.drift-brain.db');

class CoChangeAnalyzer {
  constructor() {
    this.db = null;
    this.cochanges = new Map(); // path -> count
  }

  init() {
    if (!this.db) {
      try {
        this.db = new Database(BRAIN_PATH);
      } catch (e) {
        console.error('Brain not initialized. Run init-brain.sh first.');
        process.exit(1);
      }
    }
  }

  /**
   * Get all commits from git log
   */
  getCommits(days = 30) {
    try {
      const since = `${days}.days.ago`;
      const log = execSync(
        `git log --since="${since}" --name-only --pretty=format:"%H"`,
        { encoding: 'utf-8' }
      );

      const commits = [];
      let currentCommit = null;
      const files = [];

      for (const line of log.split('\n')) {
        if (line.match(/^[a-f0-9]{40}$/)) {
          // This is a commit hash
          if (currentCommit) {
            commits.push({ hash: currentCommit, files });
          }
          currentCommit = line;
        } else if (line.trim() && currentCommit) {
          // This is a file path
          files.push(line.trim());
        }
      }

      if (currentCommit && files.length) {
        commits.push({ hash: currentCommit, files });
      }

      return commits;
    } catch (e) {
      console.error('Failed to get git log:', e.message);
      return [];
    }
  }

  /**
   * Analyze co-changes: files that change together
   */
  analyzeCoChanges(commits) {
    const cochanges = new Map(); // "file1,file2" -> count

    for (const commit of commits) {
      if (commit.files.length < 2) continue; // Skip single-file commits

      // Get all pairs of files in this commit
      for (let i = 0; i < commit.files.length; i++) {
        for (let j = i + 1; j < commit.files.length; j++) {
          const f1 = commit.files[i];
          const f2 = commit.files[j];

          // Canonical pair (sorted)
          const pair = [f1, f2].sort().join('||');

          cochanges.set(pair, (cochanges.get(pair) || 0) + 1);
        }
      }
    }

    return cochanges;
  }

  /**
   * Track frequency per file
   */
  trackFileFrequency(commits) {
    const frequency = new Map(); // path -> count

    for (const commit of commits) {
      for (const file of commit.files) {
        frequency.set(file, (frequency.get(file) || 0) + 1);
      }
    }

    return frequency;
  }

  /**
   * Detect domain for file (heuristic)
   */
  detectDomain(filePath) {
    const pathLower = filePath.toLowerCase();

    if (pathLower.includes('schema') || pathLower.includes('migration') || pathLower.includes('db')) {
      return 'database';
    } else if (pathLower.includes('/api/') || pathLower.includes('route.ts') || pathLower.includes('actions.ts')) {
      return 'api';
    } else if (pathLower.includes('auth') || pathLower.includes('session') || pathLower.includes('token')) {
      return 'auth';
    } else if (pathLower.includes('component') || pathLower.includes('page') || pathLower.includes('.tsx')) {
      return 'ui';
    } else if (pathLower.includes('deploy') || pathLower.includes('docker') || pathLower.includes('workflow')) {
      return 'infra';
    } else if (pathLower.includes('content') || pathLower.includes('blog') || pathLower.includes('markdown')) {
      return 'content';
    }

    return 'other';
  }

  /**
   * Save hot files to brain.db
   */
  saveToDatabase(frequency) {
    this.init();

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO hot_files
      (path, change_count, domains, size_bytes)
      VALUES (?, ?, ?, 0)
    `);

    // Sort by frequency, keep top 50
    const sorted = Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50);

    for (const [path, count] of sorted) {
      const domain = this.detectDomain(path);
      console.log(`  ${count}x ${path} (${domain})`);
      stmt.run(path, count, domain);
    }
  }

  /**
   * Run full analysis
   */
  run(days = 30) {
    console.log(`Analyzing git co-changes (last ${days} days)...`);

    const commits = this.getCommits(days);
    console.log(`Found ${commits.length} commits`);

    const frequency = this.trackFileFrequency(commits);
    console.log(`\nTop files changed:`);
    this.saveToDatabase(frequency);

    const cochanges = this.analyzeCoChanges(commits);
    console.log(`\nFrequent co-changes:`);

    const sorted = Array.from(cochanges.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    for (const [pair, count] of sorted) {
      const [f1, f2] = pair.split('||');
      console.log(`  ${count}x together: ${f1} <-> ${f2}`);
    }

    console.log(`\n✓ Hot files saved to brain.db`);
  }
}

// CLI usage
if (require.main === module) {
  const days = parseInt(process.argv[2] || '30');
  const analyzer = new CoChangeAnalyzer();
  analyzer.run(days);
}

module.exports = CoChangeAnalyzer;
