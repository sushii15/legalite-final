-- CREATE SELECT POLICIES FOR ANON ROLE

-- papers: Everyone can read papers
CREATE POLICY IF NOT EXISTS "Anyone can view papers"
ON papers FOR SELECT
USING (true);

-- questions: Everyone can read questions  
CREATE POLICY IF NOT EXISTS "Anyone can view questions"
ON questions FOR SELECT
USING (true);
