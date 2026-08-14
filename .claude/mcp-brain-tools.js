/**
 * Drift Brain MCP Tools
 * Real sqlite3 queries for brain.db
 * Export these to Claude Code MCP configuration
 */

const Database = require('better-sqlite3');
const path = require('path');

const BRAIN_PATH = path.join(__dirname, '.drift-brain.db');

class BrainTools {
  constructor() {
    this.db = null;
  }

  init() {
    if (!this.db) {
      this.db = new Database(BRAIN_PATH, { readonly: false });
    }
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * Query decisions by domain, confidence, or locked status
   */
  searchDecisions(filters = {}) {
    this.init();

    const { domain, confidence, locked, limit = 10 } = filters;

    let query = 'SELECT * FROM decisions WHERE 1=1';
    const params = [];

    if (domain) {
      query += ' AND domain = ?';
      params.push(domain);
    }

    if (locked !== undefined) {
      query += ' AND locked = ?';
      params.push(locked ? 1 : 0);
    }

    if (confidence !== undefined) {
      if (typeof confidence === 'object') {
        if (confidence.min !== undefined) {
          query += ' AND confidence >= ?';
          params.push(confidence.min);
        }
        if (confidence.max !== undefined) {
          query += ' AND confidence <= ?';
          params.push(confidence.max);
        }
      } else {
        query += ' AND confidence >= ?';
        params.push(confidence);
      }
    }

    query += ' ORDER BY confidence DESC, created_at DESC LIMIT ?';
    params.push(limit);

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Query learnings by domain, confidence, or pattern
   */
  searchLearnings(filters = {}) {
    this.init();

    const { domain, confidence, pattern, limit = 10 } = filters;

    let query = 'SELECT * FROM learnings WHERE 1=1';
    const params = [];

    if (domain) {
      query += " AND domains LIKE ?";
      params.push(`%${domain}%`);
    }

    if (pattern) {
      query += ' AND pattern LIKE ?';
      params.push(`%${pattern}%`);
    }

    if (confidence !== undefined) {
      if (typeof confidence === 'object') {
        if (confidence.min !== undefined) {
          query += ' AND confidence >= ?';
          params.push(confidence.min);
        }
        if (confidence.max !== undefined) {
          query += ' AND confidence <= ?';
          params.push(confidence.max);
        }
      } else {
        query += ' AND confidence >= ?';
        params.push(confidence);
      }
    }

    query += ' ORDER BY confidence DESC, use_count DESC LIMIT ?';
    params.push(limit);

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Get hot files (most frequently changed)
   */
  getHotFiles(limit = 10) {
    this.init();

    const query = `
      SELECT * FROM hot_files
      ORDER BY change_count DESC
      LIMIT ?
    `;

    const stmt = this.db.prepare(query);
    return stmt.all(limit);
  }

  /**
   * Get model performance per agent:domain:model
   */
  getModelPerformance(filters = {}) {
    this.init();

    const { agent, domain, model, limit = 50 } = filters;

    let query = 'SELECT * FROM model_performance WHERE 1=1';
    const params = [];

    if (agent) {
      query += ' AND agent = ?';
      params.push(agent);
    }

    if (domain) {
      query += ' AND domain = ?';
      params.push(domain);
    }

    if (model) {
      query += ' AND model = ?';
      params.push(model);
    }

    query += ' ORDER BY confidence DESC LIMIT ?';
    params.push(limit);

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  /**
   * Record task execution result (success/failure)
   */
  recordTask(taskData) {
    this.init();

    const {
      name,
      files,
      verify_command,
      commit_sha,
      tokens_used,
      duration_seconds,
      status = 'completed'
    } = taskData;

    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const stmt = this.db.prepare(`
      INSERT INTO tasks
      (id, name, files, verify_command, commit_sha, tokens_used, duration_seconds, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, files, verify_command, commit_sha, tokens_used, duration_seconds, status);
    return id;
  }

  /**
   * Record decision to brain
   */
  recordDecision(decisionData) {
    this.init();

    const {
      question,
      answer,
      domain,
      confidence = 0.8,
      locked = false
    } = decisionData;

    const id = `dec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO decisions
      (id, question, answer, domain, confidence, locked)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, question, answer, domain, confidence, locked ? 1 : 0);
    return id;
  }

  /**
   * Record learning (error->fix pattern)
   */
  recordLearning(learningData) {
    this.init();

    const {
      pattern,
      problem,
      solution,
      domains,
      confidence = 0.5
    } = learningData;

    const id = `learn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO learnings
      (id, pattern, problem, solution, domains, confidence)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, pattern, problem, solution, domains, confidence);
    return id;
  }

  /**
   * Record model performance
   */
  recordModelPerformance(agent, domain, model, success) {
    this.init();

    // Get or create record
    const existing = this.db.prepare(
      'SELECT * FROM model_performance WHERE agent = ? AND domain = ? AND model = ?'
    ).get(agent, domain, model);

    const id = existing?.id || `perf_${agent}_${domain}_${model}`;

    if (existing) {
      const newSuccess = existing.success_count + (success ? 1 : 0);
      const newFail = existing.failure_count + (success ? 0 : 1);

      this.db.prepare(
        'UPDATE model_performance SET success_count = ?, failure_count = ? WHERE id = ?'
      ).run(newSuccess, newFail, id);
    } else {
      this.db.prepare(`
        INSERT INTO model_performance
        (id, agent, domain, model, success_count, failure_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        id,
        agent,
        domain,
        model,
        success ? 1 : 0,
        success ? 0 : 1
      );
    }

    return id;
  }

  /**
   * Get brain statistics
   */
  getStats() {
    this.init();

    const decisions = this.db.prepare('SELECT COUNT(*) as count FROM decisions').get();
    const learnings = this.db.prepare('SELECT COUNT(*) as count FROM learnings').get();
    const tasks = this.db.prepare('SELECT COUNT(*) as count FROM tasks').get();
    const hotFiles = this.db.prepare('SELECT COUNT(*) as count FROM hot_files').get();

    const dbFile = require('fs').statSync(BRAIN_PATH);
    const dbSize = (dbFile.size / 1024).toFixed(2); // KB

    return {
      decisions: decisions.count,
      learnings: learnings.count,
      tasks: tasks.count,
      hot_files: hotFiles.count,
      db_size_kb: dbSize,
      db_path: BRAIN_PATH
    };
  }
}

module.exports = BrainTools;

// Export as MCP tools
const tools = [
  {
    name: 'brain_search_decisions',
    description: 'Search Drift Brain decisions by domain, confidence, or locked status',
    inputSchema: {
      type: 'object',
      properties: {
        domain: { type: 'string', description: 'Filter by domain: ui, api, database, auth, infra, content' },
        confidence: { type: 'number', description: 'Minimum confidence threshold (0-1)' },
        locked: { type: 'boolean', description: 'Only locked decisions (never ask again)' },
        limit: { type: 'number', default: 10, description: 'Max results' }
      }
    }
  },
  {
    name: 'brain_search_learnings',
    description: 'Search Drift Brain learnings (error->fix patterns)',
    inputSchema: {
      type: 'object',
      properties: {
        domain: { type: 'string', description: 'Filter by domain' },
        pattern: { type: 'string', description: 'Search pattern ID or name' },
        confidence: { type: 'number', description: 'Minimum confidence threshold' },
        limit: { type: 'number', default: 10 }
      }
    }
  },
  {
    name: 'brain_hot_files',
    description: 'Get most frequently changed files',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', default: 10, description: 'Max results' }
      }
    }
  },
  {
    name: 'brain_model_performance',
    description: 'Get model success rates per agent:domain:model',
    inputSchema: {
      type: 'object',
      properties: {
        agent: { type: 'string', description: 'Agent name: scout, architect, builder, critic, scribe' },
        domain: { type: 'string', description: 'Domain: ui, api, database, auth, infra' },
        model: { type: 'string', description: 'Model: haiku, sonnet, opus' }
      }
    }
  },
  {
    name: 'brain_record_decision',
    description: 'Record decision to brain.db (locked)',
    inputSchema: {
      type: 'object',
      required: ['question', 'answer', 'domain'],
      properties: {
        question: { type: 'string', description: 'Question that was answered' },
        answer: { type: 'string', description: 'Decision made' },
        domain: { type: 'string', enum: ['ui', 'api', 'database', 'auth', 'infra', 'content'] },
        confidence: { type: 'number', default: 0.8, description: 'Confidence (0-1)' }
      }
    }
  },
  {
    name: 'brain_record_learning',
    description: 'Record error->fix pattern to brain.db',
    inputSchema: {
      type: 'object',
      required: ['pattern', 'problem', 'solution'],
      properties: {
        pattern: { type: 'string', description: 'Pattern name (e.g., "webhook-timeout")' },
        problem: { type: 'string', description: 'What broke' },
        solution: { type: 'string', description: 'What fixed it' },
        domains: { type: 'string', description: 'Domains (CSV: database,api)' },
        confidence: { type: 'number', default: 0.5, description: 'Confidence (0-1)' }
      }
    }
  },
  {
    name: 'brain_stats',
    description: 'Get Drift Brain statistics and health',
    inputSchema: { type: 'object', properties: {} }
  }
];

module.exports.tools = tools;
