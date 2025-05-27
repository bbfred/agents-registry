-- Run this in Supabase SQL Editor to verify your setup

-- Check tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check categories were inserted
SELECT COUNT(*) as category_count FROM categories;

-- View categories
SELECT slug, name->>'en' as english_name, icon, display_order 
FROM categories 
ORDER BY display_order;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'agents', 'categories', 'inquiries');

-- Check policies were created
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;