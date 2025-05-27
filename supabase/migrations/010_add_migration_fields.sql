-- Add missing fields needed for the agent migration

-- Add fields to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS demo_available BOOLEAN DEFAULT false;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS concierge_compatible BOOLEAN DEFAULT false;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS deployment_type TEXT CHECK (deployment_type IN ('cloud', 'self_hosted', 'both')) DEFAULT 'cloud';
ALTER TABLE agents ADD COLUMN IF NOT EXISTS technical_requirements TEXT;

-- Provider information (for migrated agents without actual provider accounts)
ALTER TABLE agents ADD COLUMN IF NOT EXISTS provider_name TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS provider_location TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS provider_founded TEXT;

-- Add fields to agent_reviews table for migration
ALTER TABLE agent_reviews ADD COLUMN IF NOT EXISTS reviewer_name TEXT;
ALTER TABLE agent_reviews ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_verification_level ON agents(verification_level);
CREATE INDEX IF NOT EXISTS idx_agents_average_rating ON agents(average_rating);
CREATE INDEX IF NOT EXISTS idx_agents_slug ON agents(slug);

-- Update verification constraint to match new levels
ALTER TABLE agents DROP CONSTRAINT IF EXISTS agents_verification_level_check;
ALTER TABLE agents ADD CONSTRAINT agents_verification_level_check 
  CHECK (verification_level IN ('none', 'basic', 'verified', 'certified', 'advanced_certified'));

-- Add RLS policies for the new fields
DROP POLICY IF EXISTS "Anyone can view approved agents" ON agents;
CREATE POLICY "Anyone can view approved agents" ON agents
  FOR SELECT USING (status = 'approved');