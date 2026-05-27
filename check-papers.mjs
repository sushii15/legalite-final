import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function checkPapers() {
  console.log('📊 Checking papers table...\n')

  const { data, error } = await supabase
    .from('papers')
    .select('*')

  if (error) {
    console.error('❌ Error fetching papers:', error.message)

    // Try without select to see if it's a column issue
    console.log('\n🔍 Trying basic fetch without select()...')
    const { data: data2, error: error2 } = await supabase
      .from('papers')
      .select()

    if (error2) {
      console.error('❌ Also failed:', error2.message)
    } else {
      console.log('✅ Found papers:')
      console.log(JSON.stringify(data2, null, 2))
    }
  } else {
    console.log('✅ Found papers:')
    console.log(JSON.stringify(data, null, 2))
  }
}

checkPapers()
