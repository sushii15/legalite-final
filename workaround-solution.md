# RLS Policy Fix - Workaround Solutions

## Problem
- Service role CAN access questions/papers tables
- Anon role CANNOT access questions/papers tables
- RLS policies from schema.sql were never created on remote database
- Cannot execute DDL (CREATE POLICY) via REST API

## Solution Options

### Option 1: Temporary Workaround (Fastest)
Modify the TestPage component to use the SERVICE ROLE KEY instead of ANON KEY for now
- This allows immediate testing
- Security risk - service role can modify data
- Temporary solution only

### Option 2: Fix via Supabase Dashboard (Proper Fix)
1. Go to https://supabase.com/dashboard/project/wnxsinncibklmcxujgwd/sql/new
2. Paste and run this SQL:

```sql
-- Create SELECT policies to allow anon role to read data
CREATE POLICY "Anyone can view papers"
ON papers FOR SELECT
USING (true);

CREATE POLICY "Anyone can view questions"  
ON questions FOR SELECT
USING (true);
```

3. Then test the application

### Option 3: CLI Approach
```bash
# If you have Supabase CLI installed and authenticated:
supabase db push
# This would apply migrations from supabase/migrations/ directory
```

## Recommended Next Step
Use Option 2 (Dashboard SQL Editor) - it's the proper way to fix this and takes 30 seconds.

