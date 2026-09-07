-- Migration 0002: foreign keys + vote index
PRAGMA foreign_keys = OFF;

-- Clean up any orphan rows before adding FKs
DELETE FROM sessions WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM debates WHERE creator_id NOT IN (SELECT id FROM users);
DELETE FROM challengers WHERE debate_id NOT IN (SELECT id FROM debates) OR user_id NOT IN (SELECT id FROM users);
DELETE FROM turns WHERE debate_id NOT IN (SELECT id FROM debates) OR user_id NOT IN (SELECT id FROM users);
DELETE FROM debate_tags WHERE debate_id NOT IN (SELECT id FROM debates) OR tag_id NOT IN (SELECT id FROM tags);
DELETE FROM votes WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM flags WHERE flagger_id NOT IN (SELECT id FROM users);
DELETE FROM mod_actions WHERE judge_id NOT IN (SELECT id FROM users) OR target_user_id NOT IN (SELECT id FROM users);

-- Rebuild with foreign keys
CREATE TABLE users_new (
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
INSERT INTO users_new SELECT * FROM users;

CREATE TABLE tags_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_by INTEGER REFERENCES users_new(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO tags_new SELECT * FROM tags;

CREATE TABLE sessions_new (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users_new(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO sessions_new SELECT * FROM sessions;

CREATE TABLE debates_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_id INTEGER NOT NULL REFERENCES users_new(id) ON DELETE CASCADE,
  creator_username TEXT NOT NULL,
  opponent_id INTEGER REFERENCES users_new(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  initial_statement TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  max_turns INTEGER NOT NULL DEFAULT 10,
  current_turn INTEGER NOT NULL DEFAULT 0,
  next_speaker INTEGER,
  closure_requested_by INTEGER,
  closed_reason TEXT,
  closed_at TEXT,
  moderation_state TEXT NOT NULL DEFAULT 'normal',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO debates_new SELECT * FROM debates;

CREATE TABLE challengers_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id INTEGER NOT NULL REFERENCES debates_new(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users_new(id) ON DELETE CASCADE,
  position_statement TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX idx_challengers_du ON challengers_new(debate_id, user_id);
INSERT INTO challengers_new SELECT * FROM challengers;

CREATE TABLE turns_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  debate_id INTEGER NOT NULL REFERENCES debates_new(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users_new(id) ON DELETE SET NULL,
  turn_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  moderation_state TEXT NOT NULL DEFAULT 'normal',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX idx_turns_debate ON turns_new(debate_id, turn_number);
INSERT INTO turns_new SELECT * FROM turns;

CREATE TABLE debate_tags_new (
  debate_id INTEGER NOT NULL REFERENCES debates_new(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags_new(id) ON DELETE CASCADE,
  PRIMARY KEY (debate_id, tag_id)
);
INSERT INTO debate_tags_new SELECT * FROM debate_tags;

CREATE TABLE votes_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users_new(id) ON DELETE CASCADE,
  voteable_type TEXT NOT NULL,
  voteable_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX idx_votes_user ON votes_new(user_id, voteable_type, voteable_id);
CREATE INDEX idx_votes_target ON votes_new(voteable_type, voteable_id);
INSERT INTO votes_new SELECT * FROM votes;

CREATE TABLE flags_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flagger_id INTEGER NOT NULL REFERENCES users_new(id) ON DELETE CASCADE,
  flaggable_type TEXT NOT NULL,
  flaggable_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX idx_flags_one_per_user ON flags_new(flagger_id, flaggable_type, flaggable_id);
INSERT INTO flags_new SELECT * FROM flags;

CREATE TABLE mod_actions_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  judge_id INTEGER NOT NULL REFERENCES users_new(id) ON DELETE CASCADE,
  target_user_id INTEGER NOT NULL REFERENCES users_new(id) ON DELETE CASCADE,
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
INSERT INTO mod_actions_new SELECT * FROM mod_actions;

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;
DROP TABLE tags;
ALTER TABLE tags_new RENAME TO tags;
DROP TABLE sessions;
ALTER TABLE sessions_new RENAME TO sessions;
DROP TABLE debates;
ALTER TABLE debates_new RENAME TO debates;
DROP TABLE challengers;
ALTER TABLE challengers_new RENAME TO challengers;
DROP TABLE turns;
ALTER TABLE turns_new RENAME TO turns;
DROP TABLE debate_tags;
ALTER TABLE debate_tags_new RENAME TO debate_tags;
DROP TABLE votes;
ALTER TABLE votes_new RENAME TO votes;
DROP TABLE flags;
ALTER TABLE flags_new RENAME TO flags;
DROP TABLE mod_actions;
ALTER TABLE mod_actions_new RENAME TO mod_actions;

PRAGMA foreign_keys = ON;