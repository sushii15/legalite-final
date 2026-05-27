# Quick Database Setup - Copy & Paste Instructions

## Step 1: Go to SQL Editor
1. Open: https://app.supabase.com/
2. Select project **legalite**
3. Click **SQL Editor** (left sidebar)

## Step 2: Create Tables & Policies (Part 1)

Click **+ New Query** and paste this:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
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
  bare_act_pages JSONB,
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

-- INDEXES
CREATE INDEX idx_attempts_user_id ON attempts(user_id);
CREATE INDEX idx_attempts_paper_id ON attempts(paper_id);
CREATE INDEX idx_answers_attempt_id ON answers(attempt_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_questions_paper_id ON questions(paper_id);
CREATE INDEX idx_questions_subject ON questions(subject);
```

Click **Run** ✓

## Step 3: Enable RLS & Policies (Part 2)

Click **+ New Query** and paste this:

```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view papers" ON papers FOR SELECT USING (true);
CREATE POLICY "Anyone can view questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Users can view own attempts" ON attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create attempts" ON attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attempts" ON attempts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own answers" ON answers FOR SELECT USING (EXISTS (SELECT 1 FROM attempts WHERE attempts.id = answers.attempt_id AND attempts.user_id = auth.uid()));
CREATE POLICY "Users can create answers" ON answers FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM attempts WHERE attempts.id = answers.attempt_id AND attempts.user_id = auth.uid()));
CREATE POLICY "Users can update own answers" ON answers FOR UPDATE USING (EXISTS (SELECT 1 FROM attempts WHERE attempts.id = answers.attempt_id AND attempts.user_id = auth.uid()));

-- Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ language 'plpgsql';
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

Click **Run** ✓

## Step 4: Add Sample Data (Part 3)

Click **+ New Query** and paste this:

```sql
-- Insert papers (AIBE 20 to AIBE 5)
INSERT INTO papers (aibe_id, title, question_count, is_free, year) VALUES
(20, 'AIBE 20', 100, true, 2024),
(19, 'AIBE 19', 100, false, 2023),
(18, 'AIBE 18', 100, false, 2023),
(17, 'AIBE 17', 100, false, 2022),
(16, 'AIBE 16', 100, false, 2022),
(15, 'AIBE 15', 100, false, 2021),
(14, 'AIBE 14', 100, false, 2021),
(13, 'AIBE 13', 100, false, 2020),
(12, 'AIBE 12', 100, false, 2020),
(11, 'AIBE 11', 100, false, 2019),
(10, 'AIBE 10', 100, false, 2019),
(9, 'AIBE 9', 100, false, 2018),
(8, 'AIBE 8', 100, false, 2018),
(7, 'AIBE 7', 100, false, 2017),
(6, 'AIBE 6', 100, false, 2017),
(5, 'AIBE 5', 100, false, 2016)
ON CONFLICT DO NOTHING;

-- Insert sample questions for AIBE 20
INSERT INTO questions (paper_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, subject, explanation, bare_act_pages) VALUES
(1, 1, 'Which article of the Indian Constitution deals with the right to freedom of religion?', 'Article 25', 'Article 26', 'Article 27', 'Article 28', 'A', 'Constitutional Law', 'Article 25 of the Constitution of India guarantees the right to freedom of religion.', '{"universal": 45, "ebc": 52, "lexis_nexis": 48}'),
(1, 2, 'What is the maximum punishment for theft under the Indian Penal Code?', '7 years imprisonment', '10 years imprisonment', '14 years imprisonment', '20 years imprisonment', 'A', 'Criminal Law', 'Under Section 379 IPC, the maximum punishment for theft is 3 years imprisonment or fine, or both.', '{"universal": 156, "ebc": 167, "lexis_nexis": 172}'),
(1, 3, 'Which of the following is not an essential element of a valid contract?', 'Offer and acceptance', 'Consideration', 'Capacity to contract', 'Gratitude of parties', 'D', 'Contract Law', 'A valid contract requires offer, acceptance, consideration, capacity, free consent, and lawful object.', '{"universal": 234, "ebc": 245, "lexis_nexis": 251}'),
(1, 4, 'What is the limitation period for filing a suit for recovery of movable property?', '3 years', '6 years', '12 years', '30 years', 'A', 'Civil Procedure Code', 'Article 65 of the Limitation Act prescribes 3 years as the period for recovery of movable property.', '{"universal": 312, "ebc": 325, "lexis_nexis": 338}'),
(1, 5, 'In what circumstances can a marriage be dissolved by court decree?', 'Adultery alone', 'Cruelty alone', 'Desertion alone', 'Any of the grounds specified in Hindu Marriage Act', 'D', 'Family Law', 'Under the Hindu Marriage Act, 1955, marriage can be dissolved on various grounds including adultery, cruelty, desertion.', '{"universal": 89, "ebc": 95, "lexis_nexis": 101}'),
(1, 6, 'Which section of the Indian Evidence Act defines "Fact"?', 'Section 2', 'Section 3', 'Section 4', 'Section 5', 'A', 'Evidence Act', 'Section 2(g) of the Indian Evidence Act defines "Fact" as anything stated to be a fact or material object.', '{"universal": 401, "ebc": 415, "lexis_nexis": 428}'),
(1, 7, 'What is the primary purpose of the Competition Act, 2002?', 'To promote monopolies', 'To prevent monopolies and promote competition', 'To regulate trade unions', 'To control prices', 'B', 'Commercial Law', 'The Competition Act, 2002 aims to prevent monopolies and promote fair competition in Indian markets.', '{"universal": 512, "ebc": 528, "lexis_nexis": 544}'),
(1, 8, 'Under which article of the Constitution are fundamental duties mentioned?', 'Article 51', 'Article 51A', 'Article 52', 'Article 53', 'B', 'Constitutional Law', 'Article 51A of the Constitution, added by the 42nd Amendment, outlines fundamental duties of Indian citizens.', '{"universal": 78, "ebc": 84, "lexis_nexis": 90}'),
(1, 9, 'What is the definition of "Tort" in English law?', 'A civil wrong', 'A criminal offense', 'A contract breach', 'A property right', 'A', 'Torts', 'A tort is a civil wrong, distinct from criminal wrongs and contract breaches, for which injured parties can claim damages.', '{"universal": 267, "ebc": 279, "lexis_nexis": 291}'),
(1, 10, 'Which of the following is a collective work under Copyright Law?', 'Encyclopedia', 'Newspaper', 'Magazine', 'All of the above', 'D', 'Intellectual Property', 'Collective works include encyclopedias, newspapers, and magazines which are protected as compilations under copyright law.', '{"universal": 623, "ebc": 641, "lexis_nexis": 659}')
ON CONFLICT DO NOTHING;
```

Click **Run** ✓

## Done! ✅

Your database is now set up with:
- ✓ 16 AIBE papers (AIBE 20-5)
- ✓ 10 sample questions for AIBE 20
- ✓ User profiles, attempts, answers tables
- ✓ Row-Level Security policies
- ✓ Indexes for performance

Now start the app:
```bash
npm install
npm run dev
```

The app should connect automatically using `.env.local` credentials.
