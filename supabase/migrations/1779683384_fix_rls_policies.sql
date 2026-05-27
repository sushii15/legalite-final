-- Enable RLS on questions table
ALTER TABLE IF EXISTS public.questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "allow_read" ON public.questions;
DROP POLICY IF EXISTS "Allow read access" ON public.questions;

-- Create policy to allow SELECT for all authenticated users and anon users
CREATE POLICY "allow_read_questions" ON public.questions 
  FOR SELECT 
  USING (true);

-- Create policy for papers table as well
ALTER TABLE IF EXISTS public.papers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_read_papers" ON public.papers;
CREATE POLICY "allow_read_papers" ON public.papers 
  FOR SELECT 
  USING (true);
