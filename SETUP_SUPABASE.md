# Supabase Setup Guide

## Prerequisites
- Supabase account created (you have this ✓)
- Project ID: `wnxsinncibklmcxujgwd`
- Project URL: `https://wnxsinncibklmcxujgwd.supabase.co`
- Anon Key: Already in `.env.local`

## Step-by-Step Setup

### 1. Create Database Schema
1. Go to https://supabase.com and log in
2. Open your project **legalite**
3. Click **SQL Editor** in the left sidebar
4. Click **+ New Query**
5. Copy the entire contents of `supabase/schema.sql`
6. Paste it into the editor
7. Click **Run**

Expected: All tables created, RLS policies enabled, triggers created.

### 2. Seed Initial Data
1. In **SQL Editor**, click **+ New Query** again
2. Copy the entire contents of `supabase/seed.sql`
3. Paste it into the editor
4. Click **Run**

Expected: 16 papers inserted (AIBE 20 to AIBE 5), 10 sample questions added to AIBE 20.

### 3. Enable Google OAuth (Optional for Phase 1)
1. Go to **Authentication** → **Providers**
2. Click **Google**
3. Enable it
4. You'll need Google OAuth credentials:
   - Go to https://console.cloud.google.com
   - Create a new project called "Legalite"
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application)
   - Add redirect URI: `https://wnxsinncibklmcxujgwd.supabase.co/auth/v1/callback`
   - Copy **Client ID** and **Client Secret** to Supabase

### 4. Test Connection from App
1. In terminal, run:
   ```bash
   cd C:\Users\sasha\Downloads\legalite-final
   npm install
   npm run dev
   ```

2. App should open at `http://localhost:5173`
3. You should see:
   - Navbar rendering
   - Footer rendering
   - Routes accessible

### 5. Create Test User
1. You can test signup manually or use Supabase dashboard:
   - Go to **Authentication** → **Users**
   - Click **Add user**
   - Email: `test@legalite.ai`
   - Password: `TestPassword123!`

2. In app, go to `/signup` and create an account
3. After signup, check **Authentication** → **Users** to verify

### 6. Verify Database Connection
1. After signing up, go to Supabase dashboard
2. Click **Table Editor**
3. Click **user_profiles** table
4. You should see your user profile row with:
   - `id` (UUID from auth)
   - `email` (your email)
   - `plan: 'free'` (default)
   - `created_at` timestamp

## Troubleshooting

### "VITE_SUPABASE_URL is not defined"
- Verify `.env.local` exists and has correct values
- Restart the dev server after creating `.env.local`

### RLS policy error when logging in
- Check that RLS policies were created (run schema.sql again)
- Ensure `auth.uid()` is set correctly after login

### Questions table empty
- Run seed.sql from SQL Editor in Supabase dashboard
- Verify paper row was created first

### Google OAuth not working
- Ensure Google credentials are configured in Supabase
- Check redirect URI matches your domain
- Use email signup for testing if OAuth is optional

## Next Steps
Once setup is complete:
1. Test the dashboard at `/dashboard` (redirects after login)
2. Verify tier-based paper visibility (free user sees only AIBE 20)
3. Proceed with Phase 2: Test Taking Interface

## Files Reference
- `.env.local` — Environment variables (Supabase credentials)
- `supabase/schema.sql` — Database schema with RLS policies
- `supabase/seed.sql` — Initial data (papers, sample questions)
- `src/lib/supabase.ts` — Supabase client configuration
- `src/lib/auth.ts` — Authentication utilities

## Important Notes
- **Do NOT commit `.env.local` to git** — add to `.gitignore` (already done)
- **Anon Key is public** — only use it for client-side access, never secrets on frontend
- **RLS policies enforce security** — users can only see their own data
- **Supabase free tier includes**: 500MB DB, unlimited auth users, 2GB file storage
