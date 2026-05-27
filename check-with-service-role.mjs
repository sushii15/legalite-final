const supabaseUrl = 'https://wnxsinncibklmcxujgwd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U';

async function checkWithServiceRole() {
  try {
    console.log('Checking with SERVICE ROLE key (bypasses RLS)...\n');

    // Check all questions
    console.log('1️⃣ All questions:');
    const res1 = await fetch(`${supabaseUrl}/rest/v1/questions`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      }
    });
    const allQuestions = await res1.json();
    console.log(`   Status: ${res1.status}, Count: ${allQuestions.length || 0}`);

    // Check questions for paper_id=1
    console.log('2️⃣ Questions for paper_id=1:');
    const res2 = await fetch(`${supabaseUrl}/rest/v1/questions?paper_id=eq.1`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      }
    });
    const paperQuestions = await res2.json();
    console.log(`   Status: ${res2.status}, Count: ${paperQuestions.length || 0}`);
    if (paperQuestions.length > 0) {
      console.log(`   Sample Q1: "${paperQuestions[0].question_text.substring(0, 60)}..."`);
    }

    // Check papers
    console.log('3️⃣ Papers:');
    const res3 = await fetch(`${supabaseUrl}/rest/v1/papers`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      }
    });
    const papers = await res3.json();
    console.log(`   Status: ${res3.status}, Count: ${papers.length || 0}`);
    if (papers.length > 0) {
      const aibe20 = papers.find(p => p.aibe_id === 20);
      console.log(`   AIBE 20: ${aibe20 ? `id=${aibe20.id}` : 'NOT FOUND'}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkWithServiceRole();
