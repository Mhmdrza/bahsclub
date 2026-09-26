-- 0004: full alignment of the debate-native vocabulary.
--   statements            -> challenges
--   counter_statements    -> challenge_responses
--   statement_tags        -> challenge_tags
--   *.statement_id        -> *.challenge_id
--   debates.counter_statement_id -> debates.counter_response_id
--   voteable/flaggable type values: 'statement' -> 'challenge', 'counter_statement' -> 'challenge_response'

ALTER TABLE statements RENAME TO challenges;
ALTER TABLE counter_statements RENAME TO challenge_responses;
ALTER TABLE statement_tags RENAME TO challenge_tags;

ALTER TABLE challenge_responses RENAME COLUMN statement_id TO challenge_id;
ALTER TABLE challenge_tags RENAME COLUMN statement_id TO challenge_id;
ALTER TABLE debates RENAME COLUMN statement_id TO challenge_id;
ALTER TABLE debates RENAME COLUMN counter_statement_id TO counter_response_id;

DROP INDEX IF EXISTS idx_counter_statement;
DROP INDEX IF EXISTS idx_statement_user;
CREATE INDEX IF NOT EXISTS idx_challenge_response ON challenge_responses(challenge_id, status);
CREATE INDEX IF NOT EXISTS idx_challenge_user ON challenges(user_id, id);

UPDATE votes SET voteable_type = 'challenge' WHERE voteable_type = 'statement';
UPDATE votes SET voteable_type = 'challenge_response' WHERE voteable_type = 'counter_statement';

UPDATE notifications SET reference_type = 'challenge' WHERE reference_type = 'statement';
UPDATE notifications SET type = 'new_response' WHERE type = 'new_counter';

UPDATE flags SET flaggable_type = 'challenge' WHERE flaggable_type = 'statement';
UPDATE flags SET flaggable_type = 'challenge_response' WHERE flaggable_type = 'counter_statement';

UPDATE mod_actions SET flaggable_type = 'challenge' WHERE flaggable_type = 'statement';
UPDATE mod_actions SET flaggable_type = 'challenge_response' WHERE flaggable_type = 'counter_statement';
