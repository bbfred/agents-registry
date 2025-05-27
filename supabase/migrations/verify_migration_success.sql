-- Verify the migration was successful

-- 1. Check all user_profiles columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 2. Check all agents verification columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'agents'
AND column_name LIKE '%verif%'
ORDER BY column_name;

-- 3. Check verification_history table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'verification_history'
ORDER BY ordinal_position;

-- 4. Check if email sync trigger exists
SELECT tgname, tgrelid::regclass, proname
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'sync_user_email_trigger';