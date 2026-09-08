-- Migration 0003: Statements refactor
-- Transforms the schema from turn-based debates to Quora-style statements + counter-statements + free-form message debates.

-- Drop old content tables (children before parents for FK order)
DROP TABLE IF EXISTS debate_tags;
DROP TABLE IF EXISTS turns;
DROP TABLE IF EXISTS challengers;
DROP TABLE IF EXISTS debates;

-- Orphaned polymorphic rows for wiped content
DELETE FROM votes   WHERE voteable_type IN ('debate','turn');
DELETE FROM flags   WHERE flaggable_type IN ('debate','turn');
DELETE FROM mod_actions WHERE flaggable_type IN ('debate','turn');

CREATE TABLE IF NOT EXISTS statements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  moderation_state TEXT NOT NULL DEFAULT 'normal',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS counter_statements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  statement_id INTEGER NOT NULL REFERENCES statements(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  moderation_state TEXT NOT NULL DEFAULT 'normal',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS statement_tags (
  statement_id INTEGER NOT NULL REFERENCES statements(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (statement_id, tag_id)
);

CREATE TABLE IF NOT EXISTS debates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  statement_id INTEGER NOT NULL REFERENCES statements(id) ON DELETE CASCADE,
  counter_statement_id INTEGER NOT NULL REFERENCES counter_statements(id),
  creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  creator_username TEXT NOT NULL,
  opponent_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  closure_requested_by INTEGER,
  closed_reason TEXT,
  closed_at TEXT,
  moderation_state TEXT NOT NULL DEFAULT 'normal',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS debate_tags (
  debate_id INTEGER NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (debate_id, tag_id)
);

CREATE TABLE IF NOT EXISTS debate_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id INTEGER NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  moderation_state TEXT NOT NULL DEFAULT 'normal',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_debate ON debate_messages(debate_id, id);
CREATE INDEX IF NOT EXISTS idx_counter_statement ON counter_statements(statement_id, status);
CREATE INDEX IF NOT EXISTS idx_statement_user ON statements(user_id, id);