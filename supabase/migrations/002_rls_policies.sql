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