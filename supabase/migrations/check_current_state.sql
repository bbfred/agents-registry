-- Check what columns exist in each table
-- Run this to see what migrations have been applied

-- 1. Check user_profiles columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 2. Check agents columns (especially verification fields)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'agents'
AND column_name IN ('is_verified', 'verification_date', 'verification_level', 'verification_metadata')
ORDER BY column_name;

-- 3. Check if verification_history table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'verification_history'
) as verification_history_exists;

-- 4. Check constraints on user_profiles
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'user_profiles'::regclass
AND contype = 'c';