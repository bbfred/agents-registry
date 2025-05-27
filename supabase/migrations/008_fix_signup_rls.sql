-- Fix RLS policy for user profile creation during signup
-- Temporarily disable RLS on user_profiles to allow signup, then re-enable with proper policies

-- Disable RLS temporarily
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Create new, working policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Simplified insert policy - allow any authenticated user to insert their profile
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a function to handle profile creation during signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    user_type,
    first_name,
    last_name,
    company_name,
    email,
    preferred_language
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'user'),
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'company_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'preferred_language', 'en')
  );
  RETURN NEW;
END;
$$;

-- Clean up old email sync trigger (replaced by our new trigger)
DROP TRIGGER IF EXISTS sync_user_email_trigger ON auth.users;
DROP FUNCTION IF EXISTS sync_user_email();

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();