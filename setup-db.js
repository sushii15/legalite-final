import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://wnxsinncibklmcxujgwd.supabase.co'
const supabaseKey = 'sb_publishable_K4Q4u0zISXLMKqL_a-N3-g_hAM8qdAm'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('Reading schema.sql...')
    const schema = fs.readFileSync('./supabase/schema.sql', 'utf8')
    
    console.log('Reading seed.sql...')
    const seed = fs.readFileSync('./supabase/seed.sql', 'utf8')
    
    console.log('Executing schema...')
    const { error: schemaError } = await supabase.rpc('sql', { query: schema })
    if (schemaError) {
      console.error('Schema error:', schemaError)
      return
    }
    console.log('✓ Schema created successfully')
    
    console.log('Executing seed data...')
    const { error: seedError } = await supabase.rpc('sql', { query: seed })
    if (seedError) {
      console.error('Seed error:', seedError)
      return
    }
    console.log('✓ Seed data loaded successfully')
    
    console.log('\n✅ Database setup complete!')
  } catch (error) {
    console.error('Error:', error.message)
  }
}

setupDatabase()
