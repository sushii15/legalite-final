import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  console.error("VITE_SUPABASE_URL:", supabaseUrl);
  console.error("SUPABASE_SERVICE_KEY:", supabaseServiceKey ? "set" : "missing");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

async function applyMigrations() {
  console.log("Applying RLS policy migrations...\n");

  // Migration 1: Add the missing INSERT policy for user_profiles
  const insertPolicySql = `
    CREATE POLICY "Users can create their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);
  `;

  try {
    console.log("Applying: Users can create their own profile policy...");
    const { error } = await supabase.rpc("exec_sql", {
      sql: insertPolicySql,
    });

    if (error) {
      // The policy might already exist, which would cause an error
      if (error.message && error.message.includes("already exists")) {
        console.log("✓ Policy already exists - no action needed");
      } else {
        console.error("✗ Error applying policy:", error.message);
      }
    } else {
      console.log("✓ Successfully applied INSERT policy");
    }
  } catch (err) {
    console.error("✗ Error:", err.message);
    console.log("\nNote: The rpc 'exec_sql' function may not exist.");
    console.log("You may need to apply the SQL manually via the Supabase dashboard.");
    console.log("\nSQL to apply:");
    console.log(insertPolicySql);
  }
}

applyMigrations();
