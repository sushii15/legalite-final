const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://opbhyaigaadwizdbugdz.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixRLS() {
  try {
    console.log('Attempting to add RLS policies for questions table...');
    
    // Execute raw SQL to add RLS policy
    const { error } = await supabase.rpc('sql_exec', {
      sql: `
        -- Enable RLS if not already enabled
        ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policy if it exists
        DROP POLICY IF EXISTS "Allow read access" ON public.questions;
        
        -- Create policy to allow SELECT for all authenticated users
        CREATE POLICY "Allow read access" ON public.questions 
        FOR SELECT USING (true);
      `
    });
    
    if (error) {
      console.error('RPC error:', error);
    } else {
      console.log('RLS policies added successfully');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

fixRLS();
