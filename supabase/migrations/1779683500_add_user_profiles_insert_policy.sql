-- Add INSERT policy for user_profiles table to allow signup
CREATE POLICY "Users can create their own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);
