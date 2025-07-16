-- Create a function to delete user account
-- This should be run in Supabase SQL Editor to enable account deletion

CREATE OR REPLACE FUNCTION delete_user_account(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete user profile data
  DELETE FROM profiles WHERE id = user_id;
  
  -- Delete the user from auth.users
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;

-- Create RLS policy to ensure users can only delete their own account
CREATE POLICY "Users can delete own account" ON auth.users
  FOR DELETE USING (auth.uid() = id);
