#!/usr/bin/env node

/**
 * Drift Brain Initialization
 * Creates/verifies .drift-brain.db on first use
 */

const fs = require('fs');
const path = require('path');

// Import Database (use better-sqlite3 if available, fallback to simple file-based)
let Database;
try {
  Database = require('better-sqlite3');
} catch (e) {
  console.warn('better-sqlite3 not found. Using fallback mode.');
  console.warn('Install: npm install --save-dev better-sqlite3');
  process.exit(0);
}

const BRAIN_PATH = path.join(__dirname, '.drift-brain.db');
const SCHEMA_PATH = path.join(__dirname, 'brain-init.sql');

function initializeBrain() {
  try {
    // Check if brain already exists
    const exists = fs.existsSync(BRAIN_PATH);

    if (exists) {
      // Verify schema is up-to-date
      const db = new Database(BRAIN_PATH);
      const tables = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table'"
      ).all();

      const hasAllTables = [
        'decisions', 'learnings', 'hot_files', 'model_performance',
        'tasks', 'seeds', 'conventions'
      ].every(table =>
        tables.some(t => t.name === table)
      );

      db.close();

      if (!hasAllTables) {
        console.log('Drift Brain: Schema outdated, rebuilding...');
        fs.unlinkSync(BRAIN_PATH);
        createBrain();
      } else {
        console.log('Drift Brain: Ready');
      }
      return;
    }

    createBrain();
  } catch (error) {
    console.error('Drift Brain initialization failed:', error.message);
    process.exit(1);
  }
}

function createBrain() {
  try {
    const db = new Database(BRAIN_PATH);
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');

    // Split by ; and execute each statement
    schema.split(';').forEach(stmt => {
      stmt = stmt.trim();
      if (stmt.length > 0) {
        db.exec(stmt);
      }
    });

    db.close();
    console.log(`Drift Brain: Created at ${BRAIN_PATH}`);
  } catch (error) {
    console.error('Failed to create Drift Brain:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initializeBrain();
}

module.exports = { initializeBrain, BRAIN_PATH };
