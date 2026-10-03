-- بحث‌کلاب — club schema.
-- Model: users publish "ideas" (اندیشه). Others reply or raise a structured
-- challenge (چالش); a challenge can escalate into a two-sided async debate.
-- Users follow each other one-way; the home feed blends follows + discovery.

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

CREATE TABLE IF NOT EXISTS follows (
  follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (follower_id, followee_id)
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- An idea: a thought its author is willing to stand behind.
-- title, reasoning (content), confidence and tags are required.
-- sources / falsifier are prompted but may be empty.
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

-- Full revision history: every edit appends a row. The first row is v1.
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

-- A response is either a free reply or a structured challenge.
-- A challenge can be accepted by the idea's author and become a debate.
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

CREATE TABLE IF NOT EXISTS judge_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  topics TEXT NOT NULL,
  experience TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  reference_type TEXT NOT NULL,
  reference_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_notif_dedup ON notifications(user_id, reference_type, reference_id, type);

CREATE TABLE IF NOT EXISTS invites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  inviter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  used_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_invites_inviter ON invites(inviter_id);
CREATE INDEX IF NOT EXISTS idx_invites_code ON invites(code);
CREATE INDEX IF NOT EXISTS idx_invites_email ON invites(invited_email);

CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);

PRAGMA foreign_keys = ON;
