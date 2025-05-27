-- Safe migration that checks if columns exist before adding them
-- =====================================================

-- Helper function to check if column exists
CREATE OR REPLACE FUNCTION column_exists(tbl_name text, col_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = tbl_name 
    AND column_name = col_name
  );
END;
$$ LANGUAGE plpgsql;

-- 1. Update user_profiles table (only add if not exists)
DO $$ 
BEGIN
  IF NOT column_exists('user_profiles', 'first_name') THEN
    ALTER TABLE user_profiles ADD COLUMN first_name TEXT;
  END IF;
  
  IF NOT column_exists('user_profiles', 'last_name') THEN
    ALTER TABLE user_profiles ADD COLUMN last_name TEXT;
  END IF;
  
  IF NOT column_exists('user_profiles', 'email') THEN
    ALTER TABLE user_profiles ADD COLUMN email TEXT;
  END IF;
  
  IF NOT column_exists('user_profiles', 'verification_level') THEN
    ALTER TABLE user_profiles ADD COLUMN verification_level TEXT DEFAULT 'none' 
      CHECK (verification_level IN ('none', 'email_verified', 'identity_verified', 'business_verified'));
  END IF;
  
  IF NOT column_exists('user_profiles', 'verification_date') THEN
    ALTER TABLE user_profiles ADD COLUMN verification_date TIMESTAMP;
  END IF;
  
  IF NOT column_exists('user_profiles', 'verification_metadata') THEN
    ALTER TABLE user_profiles ADD COLUMN verification_metadata JSONB DEFAULT '{}';
  END IF;
END $$;

-- Handle full_name (check if it exists as regular column first)
DO $$ 
BEGIN
  IF column_exists('user_profiles', 'full_name') AND 
     NOT EXISTS (
       SELECT 1 FROM information_schema.columns 
       WHERE table_name = 'user_profiles' 
       AND column_name = 'full_name' 
       AND is_generated = 'ALWAYS'
     ) THEN
    ALTER TABLE user_profiles DROP COLUMN full_name;
    ALTER TABLE user_profiles ADD COLUMN full_name TEXT GENERATED ALWAYS AS (
      CASE 
        WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN first_name || ' ' || last_name
        WHEN first_name IS NOT NULL THEN first_name
        WHEN last_name IS NOT NULL THEN last_name
        ELSE NULL
      END
    ) STORED;
  END IF;
END $$;

-- 2. Update agents table
DO $$ 
BEGIN
  IF NOT column_exists('agents', 'verification_level') THEN
    ALTER TABLE agents ADD COLUMN verification_level TEXT DEFAULT 'none' 
      CHECK (verification_level IN ('none', 'basic', 'verified', 'certified', 'advanced_certified'));
  END IF;
  
  IF NOT column_exists('agents', 'verification_metadata') THEN
    ALTER TABLE agents ADD COLUMN verification_metadata JSONB DEFAULT '{}';
  END IF;
  
  -- Update existing verification data if is_verified exists
  IF column_exists('agents', 'is_verified') THEN
    UPDATE agents 
    SET verification_level = CASE 
      WHEN is_verified = true THEN 'verified'
      ELSE 'none'
    END
    WHERE verification_level IS NULL;
    
    ALTER TABLE agents DROP COLUMN is_verified;
  END IF;
END $$;

-- 3. Create verification_history table if not exists
CREATE TABLE IF NOT EXISTS verification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT CHECK (entity_type IN ('user', 'agent')) NOT NULL,
  entity_id UUID NOT NULL,
  verification_level TEXT NOT NULL,
  verified_by UUID REFERENCES auth.users(id),
  verification_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes if not exist
CREATE INDEX IF NOT EXISTS idx_verification_history_entity ON verification_history(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_verification_history_date ON verification_history(created_at);

-- 4. Enable RLS if not enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'verification_history' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE verification_history ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist (to recreate them)
DROP POLICY IF EXISTS "Only admins can create verification records" ON verification_history;
DROP POLICY IF EXISTS "Users can view own verification history" ON verification_history;

-- Create policies
CREATE POLICY "Only admins can create verification records" ON verification_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND user_type = 'admin'
    )
  );

CREATE POLICY "Users can view own verification history" ON verification_history
  FOR SELECT USING (
    (entity_type = 'user' AND entity_id = auth.uid()) OR
    (entity_type = 'agent' AND entity_id IN (
      SELECT id FROM agents WHERE provider_id = auth.uid()
    ))
  );

-- 5. Email sync function
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET email = NEW.email 
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS sync_user_email_trigger ON auth.users;
CREATE TRIGGER sync_user_email_trigger
AFTER INSERT OR UPDATE OF email ON auth.users
FOR EACH ROW EXECUTE FUNCTION sync_user_email();

-- 6. Update user_type constraint
DO $$ 
BEGIN
  -- Check if admin is already in the constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_profiles_user_type_check' 
    AND pg_get_constraintdef(oid) LIKE '%admin%'
  ) THEN
    ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_type_check;
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_type_check 
      CHECK (user_type IN ('user', 'provider', 'admin'));
  END IF;
END $$;

-- Clean up helper function
DROP FUNCTION IF EXISTS column_exists(text, text);