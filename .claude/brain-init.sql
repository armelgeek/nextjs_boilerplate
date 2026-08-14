-- Drift Brain: SQLite Knowledge Graph
-- Auto-created on first use, persists across sessions

CREATE TABLE IF NOT EXISTS decisions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  domain TEXT NOT NULL,  -- ui, api, database, auth, infra, content
  confidence REAL DEFAULT 0.5,  -- 0.0-1.0
  locked INTEGER DEFAULT 0,  -- 1 = never ask again
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learnings (
  id TEXT PRIMARY KEY,
  pattern TEXT NOT NULL,  -- short ID for the pattern
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  domains TEXT,  -- CSV: ui,api,database
  confidence REAL DEFAULT 0.5,  -- 0.0-1.0
  last_used TEXT,
  use_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  auto_prune_after INTEGER DEFAULT 2592000  -- 30 days in seconds
);

CREATE TABLE IF NOT EXISTS hot_files (
  path TEXT PRIMARY KEY,
  change_count INTEGER DEFAULT 1,
  last_changed TEXT DEFAULT CURRENT_TIMESTAMP,
  domains TEXT,  -- CSV: ui,api
  size_bytes INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS model_performance (
  id TEXT PRIMARY KEY,
  agent TEXT NOT NULL,  -- scout, architect, builder, critic, scribe
  domain TEXT NOT NULL,  -- ui, api, database, auth, infra
  model TEXT NOT NULL,  -- haiku, sonnet, opus
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  last_used TEXT,
  confidence REAL GENERATED ALWAYS AS (CASE WHEN (success_count + failure_count) = 0 THEN 0.5 ELSE success_count * 1.0 / (success_count + failure_count) END) STORED
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  files TEXT NOT NULL,  -- CSV paths
  verify_command TEXT,
  commit_sha TEXT,
  tokens_used INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'completed'  -- completed, failed, deferred
);

CREATE TABLE IF NOT EXISTS seeds (
  id TEXT PRIMARY KEY,
  idea TEXT NOT NULL,
  source_task TEXT,
  domain TEXT,
  priority TEXT DEFAULT 'someday',  -- now, next, later, someday
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conventions (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,  -- JSON string
  scope TEXT DEFAULT 'project',  -- project-wide
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indices for common queries
CREATE INDEX IF NOT EXISTS idx_decisions_domain ON decisions(domain);
CREATE INDEX IF NOT EXISTS idx_decisions_locked ON decisions(locked);
CREATE INDEX IF NOT EXISTS idx_learnings_domains ON learnings(domains);
CREATE INDEX IF NOT EXISTS idx_learnings_confidence ON learnings(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_model_perf_agent_domain ON model_performance(agent, domain);
CREATE INDEX IF NOT EXISTS idx_hot_files_change_count ON hot_files(change_count DESC);
