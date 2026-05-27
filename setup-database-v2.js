#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = 'https://wnxsinncibklmcxujgwd.supabase.co';
const supabaseKey = 'sb_publishable_K4Q4u0zISXLMKqL_a-N3-g_hAM8qdAm';

// Create client with higher privileges by using service role approach
// Since we can't access service role key from environment, we'll use the anon key
// but work around RLS by using the service role key if available
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('[*] Starting database setup...');

    // Step 1: Try to create/verify the paper exists
    console.log('[*] Checking for AIBE 20 paper...');
    const papersCheck = await supabase
      .from('papers')
      .select('id')
      .eq('aibe_id', 20)
      .limit(1);

    let paperId;

    if (papersCheck.data && papersCheck.data.length > 0) {
      paperId = papersCheck.data[0].id;
      console.log('[+] AIBE 20 paper already exists with ID:', paperId);
    } else {
      console.log('[*] AIBE 20 paper not found. Attempting to insert...');

      // Try direct insert - if this fails due to RLS, we'll handle it
      const paperResponse = await supabase
        .from('papers')
        .insert({
          aibe_id: 20,
          title: 'AIBE 20 - Set A',
          question_count: 98,
          is_free: true,
          year: 2024
        })
        .select();

      if (paperResponse.error) {
        console.log('[!] Error inserting paper via standard method:', paperResponse.error.message);
        console.log('[!] This is likely due to RLS policies not allowing INSERT from anon key');
        console.log('[*] You have two options:');
        console.log('');
        console.log('Option 1 (RECOMMENDED): Run the SQL directly in Supabase dashboard');
        console.log('  1. Go to supabase.com and log into your project');
        console.log('  2. Click "SQL Editor" in the left sidebar');
        console.log('  3. Create a new query and paste the contents of: supabase_complete_setup.sql');
        console.log('  4. Then run this script again');
        console.log('');
        console.log('Option 2: Modify the RLS policies to allow INSERT');
        console.log('  This requires adding INSERT policies via Supabase dashboard SQL editor');
        console.log('');
        process.exit(1);
      }

      paperId = paperResponse.data[0].id;
      console.log('[+] AIBE 20 paper inserted with ID:', paperId);
    }

    // Step 2: Read the parsed questions
    console.log('[*] Reading parsed questions JSON...');
    const questionsPath = path.join(__dirname, '..', 'aibe_20_parsed.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    console.log(`[+] Loaded ${questionsData.length} questions`);

    // Step 3: Check how many questions already exist
    console.log('[*] Checking existing questions...');
    const existingCheck = await supabase
      .from('questions')
      .select('id')
      .eq('paper_id', paperId);

    const existingCount = existingCheck.data?.length || 0;
    console.log(`[+] Found ${existingCount} existing questions`);

    if (existingCount >= questionsData.length) {
      console.log(`[+] All ${questionsData.length} questions already in database!`);
      console.log(`\n${'='.repeat(60)}`);
      console.log('[+] DATABASE ALREADY COMPLETE!');
      console.log(`${'='.repeat(60)}`);
    } else {
      // Step 4: Insert questions in batches
      console.log('[*] Inserting questions in batches...');
      const batchSize = 10;
      let totalInserted = 0;

      for (let i = 0; i < questionsData.length; i += batchSize) {
        const batch = questionsData.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(questionsData.length / batchSize);

        process.stdout.write(`[*] Batch ${batchNum}/${totalBatches}... `);

        const questionsToInsert = batch.map(q => ({
          paper_id: paperId,
          question_number: q.question_number,
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_option: q.correct_option,
          subject: q.subject,
          explanation: q.explanation || '',
          bare_act_pages: q.bare_act_pages || {}
        }));

        const response = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (response.error) {
          console.log(`ERROR: ${response.error.message}`);
          if (response.error.message.includes('row-level security')) {
            console.log('[!] RLS policy error - cannot insert via anon key');
            console.log('[*] Please use Option 1 above (run SQL in dashboard)');
            process.exit(1);
          }
          continue;
        }

        totalInserted += questionsToInsert.length;
        console.log(`OK (${questionsToInsert.length} questions)`);
      }

      console.log(`\n[+] Successfully inserted ${totalInserted} questions!`);

      // Step 5: Verify
      console.log('[*] Verifying insertion...');
      const verifyResponse = await supabase
        .from('questions')
        .select('id')
        .eq('paper_id', paperId);

      const finalCount = verifyResponse.data?.length || 0;
      console.log(`[+] Total questions in database: ${finalCount}`);

      if (finalCount === questionsData.length) {
        console.log(`\n${'='.repeat(60)}`);
        console.log('[+] DATABASE SETUP COMPLETE!');
        console.log(`${'='.repeat(60)}`);
        console.log(`Paper ID: ${paperId}`);
        console.log(`Questions Inserted: ${totalInserted}`);
        console.log(`Total in Database: ${finalCount}`);
        console.log(`\n[+] Ready to test at: http://localhost:5173/test/20`);
      } else {
        console.log(`\n[!] Warning: Expected ${questionsData.length} questions but found ${finalCount}`);
      }
    }

  } catch (error) {
    console.error('[!] ERROR:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check internet connection');
    console.log('2. Verify Supabase project is active');
    console.log('3. Ensure the papers and questions tables exist in the database');
    console.log('4. Check that RLS policies allow INSERT operations');
    console.log('5. Or run the SQL setup script via Supabase dashboard');
    process.exit(1);
  }
}

setupDatabase();
