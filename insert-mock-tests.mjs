import fs from 'fs';

// These match what's in supabase.ts
const SUPABASE_URL = 'https://wnxsinncibklmcxujgwd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U';

async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Prefer': 'return=representation'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1${endpoint}`, options);
  const text = await response.text();

  if (!response.ok) {
    console.error(`HTTP ${response.status}:`, text);
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

async function insertMockTests() {
  try {
    console.log('Reading mock_questions.json...');
    const mockData = JSON.parse(fs.readFileSync('mock_questions.json', 'utf8'));

    // Group questions by mock number
    const mocksByNumber = {};
    mockData.forEach(q => {
      if (!mocksByNumber[q.mock_number]) {
        mocksByNumber[q.mock_number] = [];
      }
      mocksByNumber[q.mock_number].push(q);
    });

    console.log(`Found ${Object.keys(mocksByNumber).length} mock tests\n`);

    // Create mock_tests records
    console.log('Creating mock test records...');
    const mockTestIds = {};

    for (let mockNum = 1; mockNum <= 10; mockNum++) {
      try {
        const response = await makeRequest('/mock_tests', 'POST', {
          name: `AI Mock Test ${mockNum}`,
          difficulty_level: mockNum <= 3 ? 'easy' : mockNum <= 7 ? 'medium' : 'hard',
          is_available: true
        });

        const id = Array.isArray(response) ? response[0].id : response.id;
        mockTestIds[mockNum] = id;
        console.log(`  ✓ Mock Test ${mockNum} created (ID: ${id})`);
      } catch (err) {
        console.error(`  ✗ Error creating Mock Test ${mockNum}:`, err.message);
        return;
      }
    }

    // Insert questions in batches
    console.log('\nInserting 1000 questions...');
    let insertedCount = 0;
    const batchSize = 100;

    for (let mockNum = 1; mockNum <= 10; mockNum++) {
      const questions = mocksByNumber[mockNum] || [];

      for (let i = 0; i < questions.length; i += batchSize) {
        const batch = questions.slice(i, i + batchSize);
        const formattedBatch = batch.map(q => ({
          mock_test_id: mockTestIds[mockNum],
          question_number: q.question_number,
          question_text: q.question_text,
          option_a: q.option_a.replace(' 3 CORRECT', '').trim(),
          option_b: q.option_b.replace(' 3 CORRECT', '').trim(),
          option_c: q.option_c.replace(' 3 CORRECT', '').trim(),
          option_d: q.option_d.replace(' 3 CORRECT', '').trim(),
          correct_option: q.correct_option,
          subject: q.subject || 'General',
          explanation: q.explanation || '',
          bare_act_pages: {}
        }));

        try {
          await makeRequest('/mock_test_questions', 'POST', formattedBatch);
          insertedCount += batch.length;
          console.log(`  ✓ Inserted ${insertedCount}/1000 questions`);
        } catch (err) {
          console.error(`  ✗ Error inserting batch:`, err.message);
          return;
        }
      }
    }

    console.log('\n✅ All 1000 questions inserted successfully!');

  } catch (err) {
    console.error('Fatal error:', err.message);
  }
}

insertMockTests();
