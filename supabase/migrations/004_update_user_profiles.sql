-- Migration: Update user profiles with first/last name and verification levels
-- =====================================================

-- 1. Update user_profiles table
ALTER TABLE user_profiles 
  ADD COLUMN first_name TEXT,
  ADD COLUMN last_name TEXT,
  ADD COLUMN email TEXT, -- Store email separately for easy access
  ADD COLUMN verification_level TEXT DEFAULT 'none' CHECK (verification_level IN ('none', 'email_verified', 'identity_verified', 'business_verified')),
  ADD COLUMN verification_date TIMESTAMP,
  ADD COLUMN verification_metadata JSONB DEFAULT '{}'; -- Store verification details

-- Make full_name a computed column (optional)
ALTER TABLE user_profiles 
  DROP COLUMN full_name;

ALTER TABLE user_profiles 
  ADD COLUMN full_name TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN first_name || ' ' || last_name
      WHEN first_name IS NOT NULL THEN first_name
      WHEN last_name IS NOT NULL THEN last_name
      ELSE NULL
    END
  ) STORED;

-- 2. Update agents table for multi-level verification
ALTER TABLE agents
  ADD COLUMN verification_level TEXT DEFAULT 'none' CHECK (verification_level IN ('none', 'basic', 'verified', 'certified', 'advanced_certified')),
  ADD COLUMN verification_metadata JSONB DEFAULT '{}'; -- Store verification badges, dates, etc.

-- Note: verification_date already exists, so we don't add it

-- Update existing verification column to match new structure
UPDATE agents 
SET verification_level = CASE 
  WHEN is_verified = true THEN 'verified'
  ELSE 'none'
END;

-- Drop old verification columns
ALTER TABLE agents
  DROP COLUMN is_verified;
  -- Keep verification_date as it already exists and is useful

-- 3. Create verification_history table for audit trail
CREATE TABLE verification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT CHECK (entity_type IN ('user', 'agent')) NOT NULL,
  entity_id UUID NOT NULL,
  verification_level TEXT NOT NULL,
  verified_by UUID REFERENCES auth.users(id),
  verification_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_verification_history_entity ON verification_history(entity_type, entity_id);
CREATE INDEX idx_verification_history_date ON verification_history(created_at);

-- 4. Add RLS policies for verification_history
ALTER TABLE verification_history ENABLE ROW LEVEL SECURITY;

-- Only admins can insert verification records (you'll need to create an admin check)
CREATE POLICY "Only admins can create verification records" ON verification_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND user_type = 'admin' -- You might want to add 'admin' to user_type enum
    )
  );

-- Users can view their own verification history
CREATE POLICY "Users can view own verification history" ON verification_history
  FOR SELECT USING (
    (entity_type = 'user' AND entity_id = auth.uid()) OR
    (entity_type = 'agent' AND entity_id IN (
      SELECT id FROM agents WHERE provider_id = auth.uid()
    ))
  );

-- 5. Function to handle email from auth.users
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET email = NEW.email 
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync email
CREATE TRIGGER sync_user_email_trigger
AFTER INSERT OR UPDATE OF email ON auth.users
FOR EACH ROW EXECUTE FUNCTION sync_user_email();

-- 6. Update the user_type check constraint to include admin
ALTER TABLE user_profiles 
  DROP CONSTRAINT user_profiles_user_type_check;

ALTER TABLE user_profiles 
  ADD CONSTRAINT user_profiles_user_type_check 
  CHECK (user_type IN ('user', 'provider', 'admin'));