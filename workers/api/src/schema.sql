CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  is_trusted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_by INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS debates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_id INTEGER NOT NULL,
  creator_username TEXT NOT NULL,
  opponent_id INTEGER,
  title TEXT NOT NULL,
  initial_statement TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  max_turns INTEGER NOT NULL DEFAULT 10,
  current_turn INTEGER NOT NULL DEFAULT 0,
  next_speaker INTEGER,
  closure_requested_by INTEGER,
  closed_reason TEXT,
  closed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS challengers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  position_statement TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_challengers_du ON challengers(debate_id, user_id);

CREATE TABLE IF NOT EXISTS turns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id INTEGER NOT NULL,
  user_id INTEGER,
  turn_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_turns_debate ON turns(debate_id, turn_number);

CREATE TABLE IF NOT EXISTS debate_tags (
  debate_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (debate_id, tag_id)
);

CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  voteable_type TEXT NOT NULL,
  voteable_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id, voteable_type, voteable_id);