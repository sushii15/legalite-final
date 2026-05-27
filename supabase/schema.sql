-- Legalite.ai Database Schema
-- Run this SQL in Supabase SQL Editor to create the database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'paid', 'premium')),
  exam_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PAPERS TABLE
CREATE TABLE IF NOT EXISTS papers (
  id SERIAL PRIMARY KEY,
  aibe_id INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  question_count INTEGER DEFAULT 100,
  is_free BOOLEAN DEFAULT FALSE,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  paper_id INTEGER NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  subject TEXT NOT NULL,
  explanation TEXT,
  bare_act_pages JSONB, -- {"universal": 142, "ebc": 156, "lexis_nexis": 161}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(paper_id, question_number)
);

-- ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  paper_id INTEGER NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  score INTEGER,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ANSWERS TABLE
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_option TEXT CHECK (selected_option IN ('A', 'B', 'C', 'D', NULL)),
  is_correct BOOLEAN,
  time_spent_seconds INTEGER DEFAULT 0,
  marked_for_review BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX idx_attempts_user_id ON attempts(user_id);
CREATE INDEX idx_attempts_paper_id ON attempts(paper_id);
CREATE INDEX idx_answers_attempt_id ON answers(attempt_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_questions_paper_id ON questions(paper_id);
CREATE INDEX idx_questions_subject ON questions(subject);

-- ROW LEVEL SECURITY POLICIES

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- user_profiles: Users can only see their own profile, create their own, and update their own
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);

-- papers: Everyone can read papers (no RLS needed, but keeping for consistency)
CREATE POLICY "Anyone can view papers"
ON papers FOR SELECT
USING (true);

-- questions: Everyone can read questions (will be gated by tier in app logic)
CREATE POLICY "Anyone can view questions"
ON questions FOR SELECT
USING (true);

-- attempts: Users can only see their own attempts
CREATE POLICY "Users can view own attempts"
ON attempts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create attempts"
ON attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attempts"
ON attempts FOR UPDATE
USING (auth.uid() = user_id);

-- answers: Users can only see their own answers
CREATE POLICY "Users can view own answers"
ON answers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM attempts
    WHERE attempts.id = answers.attempt_id
    AND attempts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create answers"
ON answers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM attempts
    WHERE attempts.id = answers.attempt_id
    AND attempts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own answers"
ON answers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM attempts
    WHERE attempts.id = answers.attempt_id
    AND attempts.user_id = auth.uid()
  )
);

-- Trigger to update user_profiles.updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE
ON user_profiles FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
