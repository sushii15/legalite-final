const supabaseUrl = 'https://wnxsinncibklmcxujgwd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiImV4cCI6MjA5NTE2MzYyOX0.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U';

async function checkRLSPolicies() {
  try {
    console.log('Checking RLS policies and settings on questions table...\n');

    // Query: Get RLS enabled status
    console.log('1️⃣ Is RLS enabled on questions table?');
    const res1 = await fetch(`${supabaseUrl}/rest/v1/rpc/check_rls_enabled`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ table_name: 'questions' })
    });
    console.log(`   Status: ${res1.status}`);
    if (res1.status !== 404) {
      const result = await res1.json();
      console.log(`   Result:`, result);
    } else {
      console.log(`   RPC function not available`);
    }

    // Query: Check policies directly from pg_policies
    console.log('\n2️⃣ Query pg_policies directly:');
    const res2 = await fetch(`${supabaseUrl}/rest/v1/rpc/get_policies_for_table`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ p_table: 'questions' })
    });
    console.log(`   Status: ${res2.status}`);
    if (res2.status !== 404) {
      const result = await res2.json();
      console.log(`   Policies:`, result);
    } else {
      console.log(`   RPC function not available`);
    }

    // Simpler approach: Try to UPDATE with anon key
    console.log('\n3️⃣ Testing if anon key can INSERT (for comparison):');
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1ODc2MjksImV4cCI6MjA5NTE2MzYyOX0.ZsoA_y3sxjzqRDK5gADL9zWYr3dA3z7Cntgd-hnYN0A';
    
    const res3 = await fetch(`${supabaseUrl}/rest/v1/questions?id=eq.1`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subject: 'Test' })
    });
    console.log(`   PATCH Status: ${res3.status}`);
    const result3 = await res3.json();
    console.log(`   PATCH Result:`, result3);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkRLSPolicies();
