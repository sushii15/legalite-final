#!/usr/bin/env node
// This script applies the missing RLS INSERT policy for user_profiles table
// Run with: node fix-rls-policy.mjs

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("ERROR: Missing Supabase credentials in .env.local");
  process.exit(1);
}

console.log("🔧 Applying RLS fix for Legalite.ai...\n");

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
  db: { schema: "public" },
});

// The SQL policy we need to create
const insertPolicySql = `
  CREATE POLICY "Users can create their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
`;

async function applyRLSFix() {
  try {
    console.log(
      "📋 Attempting to apply INSERT RLS policy for user_profiles...\n"
    );

    // Try using the SQL function approach - test if exec_sql or similar exists
    // First, try to see if we can query the database directly through Supabase
    const { data: policies, error: policiesError } = await supabase
      .from("information_schema.table_constraints")
      .select("*")
      .eq("table_schema", "public")
      .eq("table_name", "user_profiles")
      .limit(1);

    if (policiesError) {
      console.log("⚠️  Cannot query schema directly.");
      console.log(
        "   The policy needs to be applied via Supabase dashboard or CLI.\n"
      );
      console.log("📝 SQL to apply manually in Supabase SQL Editor:\n");
      console.log("```sql");
      console.log(insertPolicySql);
      console.log("```\n");
      return false;
    }

    // If we got here, we have query access. Try to apply the policy
    // Note: Standard supabase-js client doesn't support direct SQL execution
    // We'll need to inform the user they need to apply it manually

    console.log("✅ Database connection verified.\n");
    console.log(
      "ℹ️  The RLS INSERT policy must be applied via Supabase dashboard.\n"
    );
    console.log("📝 SQL to apply in Supabase SQL Editor:\n");
    console.log("```sql");
    console.log(insertPolicySql);
    console.log("```\n");

    console.log("Steps to apply the fix:");
    console.log(
      "1. Go to Supabase dashboard: https://app.supabase.com/project/" +
        supabaseUrl.split("//")[1].split(".")[0]
    );
    console.log("2. Click SQL Editor");
    console.log("3. Create a new query");
    console.log("4. Paste the SQL above");
    console.log("5. Click Execute\n");

    return true;
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n📝 SQL to apply manually:\n");
    console.log("```sql");
    console.log(insertPolicySql);
    console.log("```\n");
    return false;
  }
}

applyRLSFix().then((success) => {
  if (success) {
    console.log("ℹ️  After applying the SQL, refresh your browser.");
  }
  process.exit(0);
});
