-- Fix category_ids to store text slugs instead of UUIDs for simpler tag display

-- Drop the existing column and recreate it as text array
ALTER TABLE agents DROP COLUMN IF EXISTS category_ids;
ALTER TABLE agents ADD COLUMN category_ids TEXT[] DEFAULT '{}';

-- Update the RLS policies if needed (they should still work with text arrays)