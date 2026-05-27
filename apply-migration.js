const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wnxsinncibklmcxujgwd.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U';

const supabase = createClient(supabaseUrl, serviceKey);

const sql = `
CREATE POLICY "Users can create their own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);
`;

async function applyMigration() {
  try {
    console.log('Applying migration...');
    const { error } = await supabase.rpc('apply_migration', {
      sql: sql
    }).catch(async () => {
      // If RPC doesn't exist, try direct query execution
      console.log('RPC not available, trying direct execution via admin client...');

      // Use the admin client to execute raw SQL
      const result = await supabase
        .from('_supabase_migrations')
        .select('*')
        .single()
        .catch(() => null);

      // Since we can't run raw SQL directly through the client,
      // we'll need to use the REST API with a custom request
      const response = await fetch(
        supabaseUrl + '/rest/v1/rpc/apply_migration',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey
          },
          body: JSON.stringify({ sql })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return { error: null };
    });

    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }

    console.log('Migration applied successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error applying migration:', error.message);
    process.exit(1);
  }
}

applyMigration();
