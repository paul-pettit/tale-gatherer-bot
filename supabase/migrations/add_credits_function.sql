
CREATE OR REPLACE FUNCTION add_credits(p_user_id UUID, p_credits INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET purchased_story_credits = COALESCE(purchased_story_credits, 0) + p_credits
  WHERE id = p_user_id;
END;
$$;
