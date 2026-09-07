ALTER TABLE users ADD COLUMN bio TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'member';
ALTER TABLE users ADD COLUMN reputation INTEGER NOT NULL DEFAULT 100;
ALTER TABLE users ADD COLUMN rep_locked INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN blocked_until TEXT;

ALTER TABLE debates ADD COLUMN moderation_state TEXT NOT NULL DEFAULT 'normal';

ALTER TABLE turns ADD COLUMN moderation_state TEXT NOT NULL DEFAULT 'normal';

CREATE TABLE IF NOT EXISTS flags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flagger_id INTEGER NOT NULL,
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
  judge_id INTEGER NOT NULL,
  target_user_id INTEGER NOT NULL,
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

UPDATE users SET reputation = 100
  + (SELECT COUNT(*) FROM votes v JOIN turns t ON v.voteable_type='turn' AND v.voteable_id=t.id WHERE t.user_id=users.id AND v.user_id!=users.id)
  + (SELECT COUNT(*) FROM votes v JOIN debates d ON v.voteable_type='debate' AND v.voteable_id=d.id WHERE d.creator_id=users.id AND v.user_id!=users.id);