#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://wnxsinncibklmcxujgwd.supabase.co';
const supabaseKey = 'sb_publishable_K4Q4u0zISXLMKqL_a-N3-g_hAM8qdAm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('[*] Starting database setup...');

    // Step 1: Create papers table if it doesn't exist
    console.log('[*] Creating papers table...');
    const papersCheck = await supabase
      .from('papers')
      .select('id')
      .limit(1);

    if (papersCheck.error) {
      console.log('[!] Papers table does not exist, will attempt to create via RPC or manual setup');
    } else {
      console.log('[+] Papers table exists');
    }

    // Step 2: Try to insert AIBE 20 paper
    console.log('[*] Inserting AIBE 20 paper...');
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
      console.log('[!] Error inserting paper:', paperResponse.error.message);
      throw paperResponse.error;
    }

    const paperId = paperResponse.data[0].id;
    console.log('[+] AIBE 20 paper inserted with ID:', paperId);

    // Step 3: Read the parsed questions
    console.log('[*] Reading parsed questions JSON...');
    const questionsPath = path.join(path.dirname(import.meta.url.replace('file://', '')), '..', 'Downloads', 'aibe_20_parsed.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    console.log(`[+] Loaded ${questionsData.length} questions`);

    // Step 4: Insert questions in batches
    console.log('[*] Inserting questions in batches...');
    const batchSize = 10;
    let totalInserted = 0;

    for (let i = 0; i < questionsData.length; i += batchSize) {
      const batch = questionsData.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(questionsData.length / batchSize);

      console.log(`[*] Batch ${batchNum}/${totalBatches}...`, { end: ' ' });

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

  } catch (error) {
    console.error('[!] ERROR:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check internet connection');
    console.log('2. Verify Supabase project is active');
    console.log('3. Ensure the papers and questions tables exist in the database');
    console.log('4. Check that RLS policies allow INSERT operations');
    process.exit(1);
  }
}

setupDatabase();
