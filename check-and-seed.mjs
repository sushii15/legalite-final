const supabaseUrl = 'https://wnxsinncibklmcxujgwd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1ODc2MjksImV4cCI6MjA5NTE2MzYyOX0.ZsoA_y3sxjzqRDK5gADL9zWYr3dA3z7Cntgd-hnYN0A';

const questionsData = [
  { paper_id: 1, question_number: 1, question_text: 'Which article of the Indian Constitution deals with the right to freedom of religion?', option_a: 'Article 25', option_b: 'Article 26', option_c: 'Article 27', option_d: 'Article 28', correct_option: 'A', subject: 'Constitutional Law', explanation: 'Article 25 of the Constitution of India guarantees the right to freedom of religion.', bare_act_pages: { universal: 45, ebc: 52, lexis_nexis: 48 } },
  { paper_id: 1, question_number: 2, question_text: 'What is the maximum punishment for theft under the Indian Penal Code?', option_a: '7 years imprisonment', option_b: '10 years imprisonment', option_c: '14 years imprisonment', option_d: '20 years imprisonment', correct_option: 'A', subject: 'Criminal Law', explanation: 'Under Section 380 IPC, house breaking theft is punishable with up to 7 years imprisonment.', bare_act_pages: { universal: 156, ebc: 167, lexis_nexis: 172 } },
  { paper_id: 1, question_number: 3, question_text: 'Which of the following is not an essential element of a valid contract?', option_a: 'Offer and acceptance', option_b: 'Consideration', option_c: 'Capacity to contract', option_d: 'Gratitude of parties', correct_option: 'D', subject: 'Contract Law', explanation: 'A valid contract requires offer, acceptance, consideration, capacity, free consent, and lawful object.', bare_act_pages: { universal: 234, ebc: 245, lexis_nexis: 251 } },
  { paper_id: 1, question_number: 4, question_text: 'What is the limitation period for filing a suit for recovery of movable property?', option_a: '3 years', option_b: '6 years', option_c: '12 years', option_d: '30 years', correct_option: 'A', subject: 'Civil Procedure Code', explanation: 'Article 65 of the Limitation Act prescribes 3 years for filing a suit for recovery of movable property.', bare_act_pages: { universal: 312, ebc: 325, lexis_nexis: 338 } },
  { paper_id: 1, question_number: 5, question_text: 'In what circumstances can a marriage be dissolved by court decree?', option_a: 'Adultery alone', option_b: 'Cruelty alone', option_c: 'Desertion alone', option_d: 'Any of the grounds specified in Hindu Marriage Act', correct_option: 'D', subject: 'Family Law', explanation: 'Under the Hindu Marriage Act, 1955, a marriage can be dissolved on various grounds.', bare_act_pages: { universal: 89, ebc: 95, lexis_nexis: 101 } },
  { paper_id: 1, question_number: 6, question_text: 'Which section of the Indian Evidence Act defines "Fact"?', option_a: 'Section 2', option_b: 'Section 3', option_c: 'Section 4', option_d: 'Section 5', correct_option: 'A', subject: 'Evidence Act', explanation: 'Section 2(g) of the Indian Evidence Act defines "Fact".', bare_act_pages: { universal: 401, ebc: 415, lexis_nexis: 428 } },
  { paper_id: 1, question_number: 7, question_text: 'What is the primary purpose of the Competition Act, 2002?', option_a: 'To promote monopolies', option_b: 'To prevent monopolies and promote competition', option_c: 'To regulate trade unions', option_d: 'To control prices', correct_option: 'B', subject: 'Commercial Law', explanation: 'The Competition Act, 2002 aims to prevent monopolies and promote fair competition.', bare_act_pages: { universal: 512, ebc: 528, lexis_nexis: 544 } },
  { paper_id: 1, question_number: 8, question_text: 'Under which article of the Constitution are fundamental duties mentioned?', option_a: 'Article 51', option_b: 'Article 51A', option_c: 'Article 52', option_d: 'Article 53', correct_option: 'B', subject: 'Constitutional Law', explanation: 'Article 51A outlines the fundamental duties of Indian citizens.', bare_act_pages: { universal: 78, ebc: 84, lexis_nexis: 90 } },
  { paper_id: 1, question_number: 9, question_text: 'What is the definition of "Tort" in English law?', option_a: 'A civil wrong', option_b: 'A criminal offense', option_c: 'A contract breach', option_d: 'A property right', correct_option: 'A', subject: 'Torts', explanation: 'A tort is a civil wrong, distinct from criminal wrongs and breaches of contract.', bare_act_pages: { universal: 267, ebc: 279, lexis_nexis: 291 } },
  { paper_id: 1, question_number: 10, question_text: 'Which of the following is a collective work under Copyright Law?', option_a: 'Encyclopedia', option_b: 'Newspaper', option_c: 'Magazine', option_d: 'All of the above', correct_option: 'D', subject: 'Intellectual Property', explanation: 'Collective works include encyclopedias, newspapers, and magazines.', bare_act_pages: { universal: 623, ebc: 641, lexis_nexis: 659 } },
];

async function checkAndSeed() {
  try {
    console.log('Checking if questions exist for AIBE 20...\n');

    const checkRes = await fetch(`${supabaseUrl}/rest/v1/questions?paper_id=eq.1&limit=1`, {
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      }
    });
    const existingQuestions = await checkRes.json();

    if (existingQuestions.length > 0) {
      console.log(`✅ Questions already exist! Found ${existingQuestions.length} question(s).`);
      console.log(`   Sample: Q1 - "${existingQuestions[0].question_text.substring(0, 60)}..."\n`);
    } else {
      console.log('No questions found. Inserting sample questions...\n');

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/questions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(questionsData)
      });

      if (insertRes.status !== 201) {
        const err = await insertRes.json();
        console.log('Insert failed:', err.message);
        return;
      }
      console.log(`✅ Inserted ${questionsData.length} sample questions for AIBE 20\n`);
    }

    // Final verification
    console.log('Final verification:');
    const papersCheckRes = await fetch(`${supabaseUrl}/rest/v1/papers?limit=1`, {
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      }
    });
    const papers = await papersCheckRes.json();
    console.log(`${papers.length > 0 ? '✅ Papers table: ✓' : '❌ Papers table: ✗'}`);

    const questionsCheckRes = await fetch(`${supabaseUrl}/rest/v1/questions?paper_id=eq.1&limit=1`, {
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      }
    });
    const questions = await questionsCheckRes.json();
    console.log(`${questions.length > 0 ? `✅ Questions table: ✓ (${questions.length}+ questions)` : '❌ Questions table: ✗'}\n`);

    if (papers.length > 0 && questions.length > 0) {
      console.log('🎉 Database is ready! Refresh http://localhost:5173/test/20 to load the test page.');
    }

  } catch (error) {
    console.error('Exception:', error.message);
  }
}

checkAndSeed();
