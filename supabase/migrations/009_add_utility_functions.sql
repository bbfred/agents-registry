-- Utility functions for the API routes

-- Function to increment agent inquiry count
CREATE OR REPLACE FUNCTION increment_inquiry_count(agent_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE agents 
  SET inquiry_count = COALESCE(inquiry_count, 0) + 1,
      updated_at = NOW()
  WHERE id = agent_id;
END;
$$;

-- Function to increment agent view count
CREATE OR REPLACE FUNCTION increment_view_count(agent_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE agents 
  SET view_count = COALESCE(view_count, 0) + 1,
      updated_at = NOW()
  WHERE id = agent_id;
END;
$$;

-- Function to calculate average rating for an agent
CREATE OR REPLACE FUNCTION calculate_agent_rating(agent_id UUID)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_rating DECIMAL;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM agent_reviews 
  WHERE agent_id = agent_id;
  
  -- Update the agent record with the new average
  UPDATE agents 
  SET average_rating = COALESCE(avg_rating, 0),
      updated_at = NOW()
  WHERE id = agent_id;
  
  RETURN COALESCE(avg_rating, 0);
END;
$$;

-- Trigger to automatically update agent rating when reviews are added/updated/deleted
CREATE OR REPLACE FUNCTION update_agent_rating_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Handle INSERT and UPDATE
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM calculate_agent_rating(NEW.agent_id);
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    PERFORM calculate_agent_rating(OLD.agent_id);
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create triggers for automatic rating updates
DROP TRIGGER IF EXISTS agent_rating_trigger ON agent_reviews;
CREATE TRIGGER agent_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON agent_reviews
  FOR EACH ROW EXECUTE FUNCTION update_agent_rating_trigger();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION increment_inquiry_count(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_agent_rating(UUID) TO anon, authenticated;