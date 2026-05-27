#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = 'https://wnxsinncibklmcxujgwd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('[*] Starting clean database setup...');

    // Step 1: Get or create AIBE 20 paper
    console.log('[*] Checking for AIBE 20 paper...');
    const papersCheck = await supabase
      .from('papers')
      .select('id')
      .eq('aibe_id', 20)
      .limit(1);

    let paperId;

    if (papersCheck.data && papersCheck.data.length > 0) {
      paperId = papersCheck.data[0].id;
      console.log('[+] Found AIBE 20 paper with ID:', paperId);
    } else {
      console.log('[*] Creating AIBE 20 paper...');
      const paperResponse = await supabase
        .from('papers')
        .insert({
          aibe_id: 20,
          title: 'AIBE 20 - Set A',
          question_count: 94,
          is_free: true,
          year: 2024
        })
        .select();

      if (paperResponse.error) throw paperResponse.error;
      paperId = paperResponse.data[0].id;
      console.log('[+] Created AIBE 20 paper with ID:', paperId);
    }

    // Step 2: Delete all existing questions for this paper
    console.log('[*] Cleaning up old questions...');
    const deleteResponse = await supabase
      .from('questions')
      .delete()
      .eq('paper_id', paperId);

    if (deleteResponse.error) {
      console.log('[!] Note: Could not delete old questions (may be empty)');
    } else {
      console.log('[+] Removed old questions');
    }

    // Step 3: Read the fixed questions JSON
    console.log('[*] Reading fixed questions JSON...');
    const questionsPath = path.join(__dirname, '..', 'aibe_20_parsed_fixed.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    console.log(`[+] Loaded ${questionsData.length} questions`);

    // Step 4: Insert questions in batches
    console.log('[*] Inserting questions in batches of 10...');
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
        continue;
      }

      totalInserted += questionsToInsert.length;
      console.log(`OK (${questionsToInsert.length} questions)`);
    }

    // Step 5: Final verification
    console.log('[*] Verifying insertion...');
    const verifyResponse = await supabase
      .from('questions')
      .select('id', { count: 'exact' })
      .eq('paper_id', paperId);

    const finalCount = verifyResponse.count || 0;
    console.log(`[+] Total questions in database: ${finalCount}`);

    console.log(`\n${'='.repeat(60)}`);
    console.log('[+] DATABASE SETUP COMPLETE!');
    console.log(`${'='.repeat(60)}`);
    console.log(`Paper ID: ${paperId}`);
    console.log(`Questions Inserted: ${totalInserted}`);
    console.log(`Total in Database: ${finalCount}`);
    console.log(`\n[+] Ready to test at: http://localhost:5173/test/20`);
    console.log(`\nNote: Questions 19-22 were removed due to missing answer data.`);
    console.log(`      Add them back once you have the correct answers.`);

  } catch (error) {
    console.error('[!] ERROR:', error.message);
    process.exit(1);
  }
}

setupDatabase();
