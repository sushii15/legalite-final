import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// TODO: TEMP - Remove this once RLS policies are created in remote database
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// TODO: TEMP - Admin client using service role key. Remove once RLS policies are fixed.
// RLS policies for SELECT on questions/papers need to be created in Supabase dashboard:
//   CREATE POLICY "Anyone can view papers" ON papers FOR SELECT USING (true);
//   CREATE POLICY "Anyone can view questions" ON questions FOR SELECT USING (true);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
