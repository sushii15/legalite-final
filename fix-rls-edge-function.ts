// This is a Supabase Edge Function that will fix the RLS policies
// Deploy to: https://supabase.com/dashboard/project/wnxsinncibklmcxujgwd/functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Execute SQL to create RLS policies
    const { error } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE POLICY IF NOT EXISTS "Anyone can view papers"
        ON public.papers FOR SELECT
        USING (true);

        CREATE POLICY IF NOT EXISTS "Anyone can view questions"
        ON public.questions FOR SELECT
        USING (true);
      `,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message, hint: "RPC function may not exist" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "RLS policies created successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
