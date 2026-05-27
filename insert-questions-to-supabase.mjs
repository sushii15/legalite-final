import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
let SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

// Fall back to anon key if service key not available
if (!SUPABASE_KEY) {
  SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
  console.log('⚠️  Using anon key - ensure RLS policies allow inserts')
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Papers to insert
const papers = [
  { aibe_id: 7, title: 'AIBE 7', question_count: 100, is_free: false },
  { aibe_id: 6, title: 'AIBE 6', question_count: 100, is_free: false },
  { aibe_id: 5, title: 'AIBE 5', question_count: 100, is_free: false },
  { aibe_id: 4, title: 'AIBE 4', question_count: 90, is_free: false },
  { aibe_id: 12, title: 'AIBE 12', question_count: 100, is_free: false },
  { aibe_id: 11, title: 'AIBE 11', question_count: 100, is_free: false },
  { aibe_id: 10, title: 'AIBE 10', question_count: 100, is_free: false },
  { aibe_id: 9, title: 'AIBE 9', question_count: 100, is_free: false },
  { aibe_id: 8, title: 'AIBE 8', question_count: 100, is_free: false }
]

// JSON files with questions
const jsonFiles = [
  { aibe_id: 7, file: './aibe7_all_100_questions_final.json' },
  { aibe_id: 6, file: './aibe6_all_100_questions_final.json' },
  { aibe_id: 5, file: './aibe5_all_100_questions_final.json' },
  { aibe_id: 4, file: './aibe4_all_100_questions_final.json' },
  { aibe_id: 12, file: './aibe12_all_100_questions.json' },
  { aibe_id: 11, file: './aibe11_all_100_questions.json' },
  { aibe_id: 10, file: './aibe10_all_100_questions.json' },
  { aibe_id: 9, file: './aibe9_all_100_questions.json' },
  { aibe_id: 8, file: './aibe8_all_100_questions.json' }
]

async function insertData() {
  try {
    console.log('🔄 Starting insertion...\n')

    // Insert papers
    console.log('📄 Creating papers...')
    const paperMap = {}

    for (const paper of papers) {
      const { data, error } = await supabase
        .from('papers')
        .insert([paper])
        .select('id')
        .single()

      if (error) {
        console.log(`⚠️  Paper AIBE ${paper.aibe_id} might already exist`)
        // Try to fetch existing paper
        const { data: existing } = await supabase
          .from('papers')
          .select('id')
          .eq('aibe_id', paper.aibe_id)
          .single()

        if (existing) {
          paperMap[paper.aibe_id] = existing.id
          console.log(`✅ Found AIBE ${paper.aibe_id} (ID: ${existing.id})`)
        }
      } else {
        paperMap[paper.aibe_id] = data.id
        console.log(`✅ Created AIBE ${paper.aibe_id} (ID: ${data.id})`)
      }
    }

    console.log('\n📋 Inserting questions...')

    // Insert questions for each paper
    let totalInserted = 0
    for (const jsonFile of jsonFiles) {
      const questions = JSON.parse(readFileSync(jsonFile.file, 'utf-8'))
      const paperId = paperMap[jsonFile.aibe_id]

      if (!paperId) {
        console.log(`❌ No paper ID for AIBE ${jsonFile.aibe_id}`)
        continue
      }

      // Prepare questions for insertion
      const questionsToInsert = questions.map(q => ({
        paper_id: paperId,
        question_number: q.question_number,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option,
        subject: q.subject,
        explanation: q.explanation || 'No explanation',
        bare_act_pages: {} // Will be populated later
      }))

      // Insert in batches of 10 to avoid hitting rate limits
      for (let i = 0; i < questionsToInsert.length; i += 10) {
        const batch = questionsToInsert.slice(i, i + 10)
        const { error } = await supabase
          .from('questions')
          .insert(batch)

        if (error) {
          console.log(`❌ Error inserting batch for AIBE ${jsonFile.aibe_id}: ${error.message}`)
        } else {
          totalInserted += batch.length
          console.log(`✅ Inserted batch (${batch.length} questions) for AIBE ${jsonFile.aibe_id}`)
        }
      }
    }

    console.log(`\n✅ Insertion complete! Total questions inserted: ${totalInserted}`)
  } catch (error) {
    console.error('❌ Insertion failed:', error.message)
    process.exit(1)
  }
}

insertData()
