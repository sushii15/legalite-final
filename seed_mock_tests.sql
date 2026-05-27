-- Drop existing tables
DROP TABLE IF EXISTS mock_test_questions CASCADE;
DROP TABLE IF EXISTS mock_tests CASCADE;

-- Create mock_tests table
CREATE TABLE mock_tests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP DEFAULT now(),
  is_available BOOLEAN DEFAULT true
);

-- Create mock_test_questions table
CREATE TABLE mock_test_questions (
  id SERIAL PRIMARY KEY,
  mock_test_id INTEGER REFERENCES mock_tests(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT CHECK (correct_option IN ('A', 'B', 'C', 'D')) NOT NULL,
  subject TEXT,
  explanation TEXT,
  bare_act_pages JSONB,
  UNIQUE(mock_test_id, question_number)
);

-- Enable RLS
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view mock_tests" ON mock_tests FOR SELECT USING (true);
CREATE POLICY "Anyone can view mock_test_questions" ON mock_test_questions FOR SELECT USING (true);

-- Insert mock tests

INSERT INTO mock_tests (name, difficulty_level) VALUES ('Mock Test 1', 'easy');
INSERT INTO mock_tests (name, difficulty_level) VALUES ('Mock Test 2', 'medium');
INSERT INTO mock_tests (name, difficulty_level) VALUES ('Mock Test 3', 'hard');
INSERT INTO mock_tests (name, difficulty_level) VALUES ('Mock Test 4', 'easy');
INSERT INTO mock_tests (name, difficulty_level) VALUES ('Mock Test 5', 'medium');
INSERT INTO mock_tests (name, difficulty_level) VALUES ('Mock Test 6', 'hard');
INSERT INTO mock_tests (name, difficulty_level) VALUES ('Mock Test 7', 'easy');
INSERT INTO mock_tests (name, difficulty_level) VALUES ('Mock Test 8', 'medium');
INSERT INTO mock_tests (name, difficulty_level) VALUES ('Mock Test 9', 'hard');
INSERT INTO mock_tests (name, difficulty_level) VALUES ('Mock Test 10', 'easy');

-- Insert questions (this will be auto-generated)
