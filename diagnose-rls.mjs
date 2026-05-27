const supabaseUrl = 'https://wnxsinncibklmcxujgwd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1ODc2MjksImV4cCI6MjA5NTE2MzYyOX0.ZsoA_y3sxjzqRDK5gADL9zWYr3dA3z7Cntgd-hnYN0A';

async function diagnoseRLS() {
  try {
    console.log('🔍 Diagnosing RLS issue...\n');

    // Check if we can see the questions with service role (should work)
    console.log('1️⃣ SELECT with SERVICE_ROLE key:');
    const serviceRes = await fetch(`${supabaseUrl}/rest/v1/questions?limit=1`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      }
    });
    const serviceData = await serviceRes.json();
    console.log(`   ✅ Returns ${serviceData.length} rows\n`);

    // Check if anon can see them (currently returns empty)
    console.log('2️⃣ SELECT with ANON key:');
    const anonRes = await fetch(`${supabaseUrl}/rest/v1/questions?limit=1`, {
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      }
    });
    const anonData = await anonRes.json();
    console.log(`   Status: ${anonRes.status}`);
    console.log(`   Returns ${anonData.length || 0} rows\n`);

    // Check if anon can read from papers (which should be readable)
    console.log('3️⃣ SELECT papers with ANON key:');
    const papersRes = await fetch(`${supabaseUrl}/rest/v1/papers?limit=1`, {
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      }
    });
    const papersData = await papersRes.json();
    console.log(`   Status: ${papersRes.status}`);
    console.log(`   Returns ${papersData.length || 0} rows\n`);

    console.log('📊 ANALYSIS:');
    console.log('   - Service role CAN see questions ✅');
    console.log('   - Anon CANNOT see questions ❌');
    console.log('   - Anon can see papers:', papersData.length > 0 ? '✅' : '❌');
    console.log('\n💡 LIKELY CAUSE:');
    console.log('   RLS policy for SELECT on questions table is NOT allowing anon role');
    console.log('   Solution: Need to create/fix the SELECT policy');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

diagnoseRLS();
