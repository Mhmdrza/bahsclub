-- 0003: rename counter_statements accepted→debating
UPDATE counter_statements SET status = 'debating' WHERE status = 'accepted';