-- Add has_completed_onboarding column to users table
ALTER TABLE users 
ADD COLUMN has_completed_onboarding BOOLEAN DEFAULT FALSE;

-- Update RLS policy to allow users to update their own onboarding status
CREATE POLICY "Users can update their own onboarding status" ON users
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
