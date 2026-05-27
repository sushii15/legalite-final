import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnxsinncibklmcxujgwd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeFVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNjU0NTM4MCwiZXhwIjoxNzMyMTcxMzgwfQ.9VY_6kPYtJ3NTzLmZWD6MzWMpvQUBZw5Vul-L0w1qTI';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixRLS() {
  try {
    console.log('Checking current RLS policies...');
    
    // Check if questions table has RLS enabled
    const { data: rlsStatus, error: statusError } = await supabase.from('questions').select('count').limit(1);
    
    console.log('RLS Check Result:', { rlsStatus, statusError });
    
    // Try to create a policy using RPC (if sql_exec exists)
    console.log('Attempting to create RLS policy...');
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE IF EXISTS public.questions ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "allow_read" ON public.questions;
        CREATE POLICY "allow_read" ON public.questions 
        FOR SELECT USING (true);
      `
    }).catch(e => ({ data: null, error: e }));
    
    if (error && error.message.includes('undefined function')) {
      console.log('exec_sql function does not exist. Trying alternative approach...');
      
      // Alternative: create policies one by one (requires SUPERUSER or OWNER privileges)
      // This might fail due to insufficient privileges
      console.log('Attempting individual policy creation...');
    } else if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success:', data);
    }
  } catch (err) {
    console.error('Exception:', err.message);
  }
}

fixRLS();
