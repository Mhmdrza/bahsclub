CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  is_trusted INTEGER NOT NULL DEFAULT 0,
  bio TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'member',
  reputation INTEGER NOT NULL DEFAULT 100,
  rep_locked INTEGER NOT NULL DEFAULT 0,
  blocked_until TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

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

CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  voteable_type TEXT NOT NULL,
  voteable_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id, voteable_type, voteable_id);
CREATE INDEX IF NOT EXISTS idx_votes_target ON votes(voteable_type, voteable_id);

CREATE TABLE IF NOT EXISTS flags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flagger_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flaggable_type TEXT NOT NULL,
  flaggable_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_flags_one_per_user ON flags(flagger_id, flaggable_type, flaggable_id);

CREATE TABLE IF NOT EXISTS mod_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  judge_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flaggable_type TEXT,
  flaggable_id INTEGER,
  user_action TEXT NOT NULL,
  content_action TEXT,
  note TEXT,
  duration_days INTEGER,
  rep_delta INTEGER,
  acknowledged INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

PRAGMA foreign_keys = ON;