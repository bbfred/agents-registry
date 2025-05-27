-- =====================================================
-- COMPLETE SUPABASE SETUP FOR SWISS AI AGENTS REGISTRY
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- 1. INITIAL SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles with type distinction
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT CHECK (user_type IN ('user', 'provider')) NOT NULL,
  full_name TEXT,
  company_name TEXT, -- For providers
  phone TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table (database-driven)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL, -- {"en": "Customer Service", "de": "Kundenservice", ...}
  description JSONB,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  
  -- Arrays for multi-select
  category_ids UUID[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}', -- ['en', 'de', 'fr', 'it']
  
  -- Pricing
  pricing_model TEXT CHECK (pricing_model IN ('free', 'freemium', 'paid', 'enterprise', 'custom')),
  starting_price TEXT,
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  
  -- Status for approval workflow
  status TEXT CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'suspended')) DEFAULT 'draft',
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  
  -- Basic metadata
  website_url TEXT,
  documentation_url TEXT,
  api_documentation_url TEXT,
  support_email TEXT,
  support_url TEXT,
  
  -- Features and capabilities (JSONB for flexibility)
  features JSONB DEFAULT '[]', -- Array of feature strings
  use_cases JSONB DEFAULT '[]', -- Array of use case strings
  integrations JSONB DEFAULT '[]', -- Array of integration strings
  
  -- Stats (will be updated via triggers/functions)
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent submissions (for approval workflow)
CREATE TABLE agent_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES auth.users(id),
  submission_type TEXT CHECK (submission_type IN ('create', 'update')),
  previous_data JSONB, -- Store previous state for updates
  new_data JSONB, -- Store submitted changes
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewer_id UUID REFERENCES auth.users(id),
  review_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

-- Inquiries table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  inquiry_type TEXT CHECK (inquiry_type IN ('general', 'demo', 'integration', 'support')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('new', 'read', 'responded', 'closed')) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agent reviews (for future use)
CREATE TABLE agent_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review TEXT,
  is_verified_customer BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_provider ON agents(provider_id);
CREATE INDEX idx_agents_categories ON agents USING GIN(category_ids);
CREATE INDEX idx_agents_languages ON agents USING GIN(languages);
CREATE INDEX idx_agents_pricing ON agents(pricing_model);
CREATE INDEX idx_agents_verified ON agents(is_verified);
CREATE INDEX idx_inquiries_agent ON inquiries(agent_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_reviews_agent ON agent_reviews(agent_id);
CREATE INDEX idx_reviews_user ON agent_reviews(user_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_reviews_updated_at BEFORE UPDATE ON agent_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_reviews ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Agents policies
CREATE POLICY "Anyone can view approved agents" ON agents
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Providers can view own agents" ON agents
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Providers can create agents" ON agents
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update own draft agents" ON agents
  FOR UPDATE USING (
    auth.uid() = provider_id AND 
    status IN ('draft', 'rejected')
  );

-- Agent submissions policies
CREATE POLICY "Providers can view own submissions" ON agent_submissions
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Providers can create submissions" ON agent_submissions
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

-- Inquiries policies
CREATE POLICY "Anyone can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Providers can view inquiries for their agents" ON inquiries
  FOR SELECT USING (
    agent_id IN (
      SELECT id FROM agents WHERE provider_id = auth.uid()
    )
  );

-- Agent reviews policies
CREATE POLICY "Anyone can view reviews" ON agent_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON agent_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON agent_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON agent_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- 3. SEED CATEGORIES DATA
-- =====================================================

-- Insert initial categories
INSERT INTO categories (slug, name, icon, display_order) VALUES
  ('customer-service', '{"en": "Customer Service", "de": "Kundenservice", "fr": "Service Client", "it": "Servizio Clienti"}', 'Headphones', 1),
  ('legal', '{"en": "Legal", "de": "Rechtlich", "fr": "Juridique", "it": "Legale"}', 'Scale', 2),
  ('technical-support', '{"en": "Technical Support", "de": "Technischer Support", "fr": "Support Technique", "it": "Supporto Tecnico"}', 'Wrench', 3),
  ('translation', '{"en": "Translation", "de": "Übersetzung", "fr": "Traduction", "it": "Traduzione"}', 'Languages', 4),
  ('data-analysis', '{"en": "Data Analysis", "de": "Datenanalyse", "fr": "Analyse de Données", "it": "Analisi Dati"}', 'ChartBar', 5),
  ('content-creation', '{"en": "Content Creation", "de": "Content-Erstellung", "fr": "Création de Contenu", "it": "Creazione Contenuti"}', 'PenTool', 6),
  ('education', '{"en": "Education", "de": "Bildung", "fr": "Éducation", "it": "Educazione"}', 'GraduationCap', 7),
  ('healthcare', '{"en": "Healthcare", "de": "Gesundheitswesen", "fr": "Santé", "it": "Sanità"}', 'Heart', 8),
  ('finance', '{"en": "Finance", "de": "Finanzen", "fr": "Finance", "it": "Finanza"}', 'DollarSign', 9),
  ('marketing', '{"en": "Marketing", "de": "Marketing", "fr": "Marketing", "it": "Marketing"}', 'Megaphone', 10),
  ('sales', '{"en": "Sales", "de": "Vertrieb", "fr": "Ventes", "it": "Vendite"}', 'ShoppingCart', 11),
  ('hr', '{"en": "Human Resources", "de": "Personalwesen", "fr": "Ressources Humaines", "it": "Risorse Umane"}', 'Users', 12),
  ('project-management', '{"en": "Project Management", "de": "Projektmanagement", "fr": "Gestion de Projet", "it": "Gestione Progetti"}', 'Briefcase', 13),
  ('research', '{"en": "Research", "de": "Forschung", "fr": "Recherche", "it": "Ricerca"}', 'Search', 14),
  ('automation', '{"en": "Automation", "de": "Automatisierung", "fr": "Automatisation", "it": "Automazione"}', 'Zap', 15)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Enable Email/Password auth in Supabase Dashboard
-- 2. Enable Google OAuth (optional)
-- 3. Add your Supabase URL and Anon Key to .env.local