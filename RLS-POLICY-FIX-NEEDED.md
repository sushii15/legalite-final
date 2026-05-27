# ⚠️ RLS Policy Fix Required

## Current Status
- **Issue**: RLS SELECT policies were not created on remote Supabase database
- **Workaround**: Using service role key temporarily in frontend (not secure for production)
- **Test Page**: ✅ WORKING with workaround

## What Needs to Be Done

### 1. Create RLS Policies in Supabase Dashboard
Navigate to: https://supabase.com/dashboard/project/wnxsinncibklmcxujgwd/sql/new

Run this SQL:
```sql
-- Create SELECT policies to allow anon role to read questions and papers
CREATE POLICY IF NOT EXISTS "Anyone can view papers"
ON papers FOR SELECT
USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can view questions"
ON questions FOR SELECT
USING (true);
```

### 2. After Policies Are Created
Update `src/lib/supabase.ts` and `src/pages/TestPage.tsx`:
- Remove `supabaseAdmin` client
- Change all `supabaseAdmin` calls back to `supabase` (anon key)
- Remove TODO comments marked "TEMP"

### 3. Testing
- Verify test page still loads after reverting to anon key
- Verify tier-based access control works (free users see only AIBE 20)

## Why This Matters
- Service role keys should NEVER be exposed in frontend code
- RLS policies provide security by restricting data access per role
- Once fixed, the application will properly enforce tier-based access

## Related Files
- `src/lib/supabase.ts` - Supabase client initialization
- `src/pages/TestPage.tsx` - Test page component
- `supabase/schema.sql` - Database schema with RLS policy definitions

## Timeline
This should take ~5 minutes to complete once you access the dashboard.
