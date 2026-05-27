import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function verify() {
  try {
    console.log('🔍 Checking Supabase database...\n')

    // Check papers table
    console.log('📄 Papers in database:')
    const { data: papers, error: papersError } = await supabase
      .from('papers')
      .select('id, aibe_id, title, question_count')
      .order('aibe_id', { ascending: false })

    if (papersError) {
      console.error('❌ Error fetching papers:', papersError.message)
    } else {
      console.log(`Total papers: ${papers.length}`)
      papers.forEach(p => {
        console.log(`  ✓ AIBE ${p.aibe_id}: ${p.question_count} questions (ID: ${p.id})`)
      })
    }

    // Check questions count by paper
    console.log('\n📋 Questions count by paper:')
    const { data: counts, error: countsError } = await supabase
      .from('papers')
      .select(`id, aibe_id, questions(count)`)

    if (countsError) {
      console.error('❌ Error fetching counts:', countsError.message)
    } else {
      let totalQuestions = 0
      counts.forEach(p => {
        const count = p.questions[0]?.count || 0
        totalQuestions += count
        console.log(`  AIBE ${p.aibe_id}: ${count} questions`)
      })
      console.log(`\n✅ Total questions in database: ${totalQuestions}`)
    }

    // Sample questions from each paper
    console.log('\n📖 Sample questions:')
    for (const p of papers.slice(0, 4)) {
      const { data: sampleQ } = await supabase
        .from('questions')
        .select('question_number, question_text, subject')
        .eq('paper_id', p.id)
        .limit(2)

      if (sampleQ && sampleQ.length > 0) {
        console.log(`\n  AIBE ${p.aibe_id}:`)
        sampleQ.forEach(q => {
          const preview = q.question_text.substring(0, 60)
          console.log(`    Q${q.question_number} [${q.subject}]: ${preview}...`)
        })
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

verify()
