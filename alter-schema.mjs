import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wnxsinncibklmcxujgwd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U"
);

async function alterSchema() {
  try {
    console.log("Altering database schema to support withdrawn questions...");
    
    // SQL to drop the check constraint and allow NULL
    const sql = `
      ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_correct_option_check;
      ALTER TABLE questions ALTER COLUMN correct_option DROP NOT NULL;
      ALTER TABLE questions ADD CONSTRAINT questions_correct_option_check 
        CHECK (correct_option IS NULL OR correct_option IN ('A', 'B', 'C', 'D', 'A&C'));
    `;
    
    // Execute using rpc (no-op) - this won't work, need different approach
    // Instead, use the SQL directly through supabase.rpc with a stored procedure
    // Or better: use the raw SQL endpoint if available
    
    console.log("Note: Direct SQL execution not available via JS client.");
    console.log("Attempting workaround: using a stored procedure or raw query...");
    
    // Try using auth admin to run SQL - this might not be available
    const { data, error } = await supabase.rpc('execute_sql', { sql_query: sql });
    
    if (error) {
      console.log("Direct execution failed (expected).");
      console.log("Alternative: Modify questions to use 'withdrawn' for withdrawn Qs");
      console.log("Or: Update schema manually via Supabase dashboard");
      throw error;
    }
    
  } catch (err) {
    console.error("Error:", err.message);
    console.log("\n⚠️ Schema alteration failed. Workaround options:");
    console.log("1. Go to Supabase dashboard > SQL Editor");
    console.log("2. Run this SQL:");
    console.log(`
      ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_correct_option_check;
      ALTER TABLE questions ALTER COLUMN correct_option DROP NOT NULL;
      ALTER TABLE questions ADD CONSTRAINT questions_correct_option_check 
        CHECK (correct_option IS NULL OR correct_option IN ('A', 'B', 'C', 'D', 'A&C'));
    `);
    console.log("3. Then re-run the insert script");
  }
}

alterSchema();
