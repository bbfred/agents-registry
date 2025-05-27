-- Fix the email sync trigger that might be causing signup issues

-- First, drop the existing trigger if it exists
DROP TRIGGER IF EXISTS sync_user_email_trigger ON auth.users;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS sync_user_email();

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Only try to update if the user profile exists
  -- This prevents errors during signup when the profile doesn't exist yet
  IF EXISTS (SELECT 1 FROM public.user_profiles WHERE id = NEW.id) THEN
    UPDATE public.user_profiles 
    SET email = NEW.email 
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger but only for UPDATE (not INSERT)
-- This way it won't interfere with the signup process
CREATE TRIGGER sync_user_email_trigger
AFTER UPDATE OF email ON auth.users
FOR EACH ROW EXECUTE FUNCTION sync_user_email();

-- Also, let's make sure the user_profiles table allows nulls for email temporarily
-- (in case the trigger runs before we set it)
ALTER TABLE user_profiles ALTER COLUMN email DROP NOT NULL;