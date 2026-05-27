const supabaseUrl = 'https://wnxsinncibklmcxujgwd.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1ODc2MjksImV4cCI6MjA5NTE2MzYyOX0.ZsoA_y3sxjzqRDK5gADL9zWYr3dA3z7Cntgd-hnYN0A';

async function testQuery() {
  try {
    // Test 1: Check all questions
    console.log('Test 1: Fetching ALL questions (no filter)...');
    const res1 = await fetch(`${supabaseUrl}/rest/v1/questions`, {
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      }
    });
    const allQuestions = await res1.json();
    console.log(`Status: ${res1.status}, Count: ${allQuestions.length || 0}`);
    if (allQuestions.length > 0) {
      console.log(`Sample: Q${allQuestions[0].question_number} - "${allQuestions[0].question_text.substring(0, 50)}..."\n`);
    }

    // Test 2: Check questions for paper_id=1
    console.log('Test 2: Fetching questions for paper_id=1...');
    const res2 = await fetch(`${supabaseUrl}/rest/v1/questions?paper_id=eq.1`, {
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      }
    });
    const paperQuestions = await res2.json();
    console.log(`Status: ${res2.status}, Count: ${paperQuestions.length || 0}`);
    if (paperQuestions.length > 0) {
      console.log(`Sample: Q${paperQuestions[0].question_number} - "${paperQuestions[0].question_text.substring(0, 50)}..."\n`);
    }

    // Test 3: Check papers table
    console.log('Test 3: Fetching papers...');
    const res3 = await fetch(`${supabaseUrl}/rest/v1/papers`, {
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      }
    });
    const papers = await res3.json();
    console.log(`Status: ${res3.status}, Papers found: ${papers.length || 0}`);
    if (papers.length > 0) {
      console.log(`Papers: ${papers.map(p => `${p.aibe_id}(id:${p.id})`).join(', ')}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testQuery();
