import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnxsinncibklmcxujgwd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const res = await supabase
    .from('questions')
    .select('question_number, correct_option')
    .eq('paper_id', 1)
    .order('question_number');
  
  console.log('Current questions in database:');
  res.data.forEach(q => {
    console.log(`Q${q.question_number}: ${q.correct_option}`);
  });
}

check();
