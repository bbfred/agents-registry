-- Fix the ambiguous column reference in the rating function

-- Drop the trigger first to avoid dependency issues
DROP TRIGGER IF EXISTS agent_rating_trigger ON agent_reviews;

-- Drop and recreate the functions with proper parameter naming
DROP FUNCTION IF EXISTS calculate_agent_rating(UUID);
DROP FUNCTION IF EXISTS increment_inquiry_count(UUID);
DROP FUNCTION IF EXISTS increment_view_count(UUID);

-- Recreate with fixed parameter names
CREATE OR REPLACE FUNCTION calculate_agent_rating(input_agent_id UUID)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_rating DECIMAL;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM agent_reviews 
  WHERE agent_reviews.agent_id = input_agent_id; -- Use qualified column name and different parameter name
  
  -- Update the agent record with the new average
  UPDATE agents 
  SET average_rating = COALESCE(avg_rating, 0),
      updated_at = NOW()
  WHERE agents.id = input_agent_id; -- Use qualified column name
  
  RETURN COALESCE(avg_rating, 0);
END;
$$;

-- Update the trigger function to use the new parameter name
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

-- Also fix the increment functions to avoid similar issues
CREATE OR REPLACE FUNCTION increment_inquiry_count(input_agent_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE agents 
  SET inquiry_count = COALESCE(inquiry_count, 0) + 1,
      updated_at = NOW()
  WHERE agents.id = input_agent_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_view_count(input_agent_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE agents 
  SET view_count = COALESCE(view_count, 0) + 1,
      updated_at = NOW()
  WHERE agents.id = input_agent_id;
END;
$$;

-- Recreate the trigger with the updated function
CREATE TRIGGER agent_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON agent_reviews
  FOR EACH ROW EXECUTE FUNCTION update_agent_rating_trigger();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION increment_inquiry_count(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_agent_rating(UUID) TO anon, authenticated;