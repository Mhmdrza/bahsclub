-- 0005: replace the challenge concept with ideas + responses + follows.
-- Dev-stage pivot: old challenge/debate data is dropped (wipe & reseed approved).
--   challenges           -> ideas (title, reasoning, confidence, sources, falsifier, open_to_response)
--   challenge_responses  -> idea_responses (kind: reply | challenge)
--   challenge_tags       -> idea_tags
--   debates.challenge_id -> debates.idea_id ; counter_response_id -> response_id
--   new: follows, idea_versions
--   voteable/flaggable types: 'challenge' -> 'idea', 'challenge_response' -> 'idea_response'

PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS debate_messages;
DROP TABLE IF EXISTS debate_tags;
DROP TABLE IF EXISTS debates;
DROP TABLE IF EXISTS challenge_responses;
DROP TABLE IF EXISTS challenge_tags;
DROP TABLE IF EXISTS challenges;

CREATE TABLE IF NOT EXISTS follows (
  follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (follower_id, followee_id)
);

CREATE TABLE IF NOT EXISTS ideas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  title TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  confidence INTEGER NOT NULL DEFAULT 50,
  sources TEXT NOT NULL DEFAULT '',
  falsifier TEXT NOT NULL DEFAULT '',
  open_to_response INTEGER NOT NULL DEFAULT 1,
  moderation_state TEXT NOT NULL DEFAULT 'normal',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS idea_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  title TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  confidence INTEGER NOT NULL,
  sources TEXT NOT NULL DEFAULT '',
  falsifier TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS idea_tags (
  idea_id INTEGER NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (idea_id, tag_id)
);

CREATE TABLE IF NOT EXISTS idea_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'reply',
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  moderation_state TEXT NOT NULL DEFAULT 'normal',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS debates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea_id INTEGER NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  response_id INTEGER NOT NULL REFERENCES idea_responses(id),
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
CREATE INDEX IF NOT EXISTS idx_idea_response ON idea_responses(idea_id, status);
CREATE INDEX IF NOT EXISTS idx_idea_user ON ideas(user_id, id);
CREATE INDEX IF NOT EXISTS idx_idea_feed ON ideas(moderation_state, id);
CREATE INDEX IF NOT EXISTS idx_follows_followee ON follows(followee_id);
CREATE INDEX IF NOT EXISTS idx_idea_versions ON idea_versions(idea_id, version);

PRAGMA foreign_keys = ON;
