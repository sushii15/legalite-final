-- Seed initial data for Legalite.ai
-- Run this after schema.sql to populate papers and sample questions

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

-- Insert sample questions for AIBE 20 (10 questions across subjects)
-- In production, this would be 100 questions. These are sample placeholders.
INSERT INTO questions (paper_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, subject, explanation, bare_act_pages) VALUES
(1, 1, 'Which article of the Indian Constitution deals with the right to freedom of religion?', 'Article 25', 'Article 26', 'Article 27', 'Article 28', 'A', 'Constitutional Law', 'Article 25 of the Constitution of India guarantees the right to freedom of religion.', '{"universal": 45, "ebc": 52, "lexis_nexis": 48}'),
(1, 2, 'What is the maximum punishment for theft under the Indian Penal Code?', '7 years imprisonment', '10 years imprisonment', '14 years imprisonment', '20 years imprisonment', 'A', 'Criminal Law', 'Under Section 379 IPC, the maximum punishment for theft is 3 years imprisonment or fine, or both. Section 380 prescribes up to 7 years for house breaking theft.', '{"universal": 156, "ebc": 167, "lexis_nexis": 172}'),
(1, 3, 'Which of the following is not an essential element of a valid contract?', 'Offer and acceptance', 'Consideration', 'Capacity to contract', 'Gratitude of parties', 'D', 'Contract Law', 'A valid contract requires offer, acceptance, consideration, capacity, free consent, and lawful object. Gratitude is not an essential element.', '{"universal": 234, "ebc": 245, "lexis_nexis": 251}'),
(1, 4, 'What is the limitation period for filing a suit for recovery of movable property under the Limitation Act?', '3 years', '6 years', '12 years', '30 years', 'A', 'Civil Procedure Code', 'Article 65 of the Limitation Act prescribes 3 years as the period of limitation for filing a suit for recovery of movable property.', '{"universal": 312, "ebc": 325, "lexis_nexis": 338}'),
(1, 5, 'In what circumstances can a marriage be dissolved by court decree?', 'Adultery alone', 'Cruelty alone', 'Desertion alone', 'Any of the grounds specified in Hindu Marriage Act', 'D', 'Family Law', 'Under the Hindu Marriage Act, 1955, a marriage can be dissolved on various grounds including adultery, cruelty, desertion, and others.', '{"universal": 89, "ebc": 95, "lexis_nexis": 101}'),
(1, 6, 'Which section of the Indian Evidence Act defines "Fact"?', 'Section 2', 'Section 3', 'Section 4', 'Section 5', 'A', 'Evidence Act', 'Section 2(g) of the Indian Evidence Act defines "Fact" as anything stated to be a fact, any material object, or any impression made by one of the human senses.', '{"universal": 401, "ebc": 415, "lexis_nexis": 428}'),
(1, 7, 'What is the primary purpose of the Competition Act, 2002?', 'To promote monopolies', 'To prevent monopolies and promote competition', 'To regulate trade unions', 'To control prices', 'B', 'Commercial Law', 'The Competition Act, 2002 aims to prevent monopolies and promote fair competition in Indian markets.', '{"universal": 512, "ebc": 528, "lexis_nexis": 544}'),
(1, 8, 'Under which article of the Constitution are fundamental duties mentioned?', 'Article 51', 'Article 51A', 'Article 52', 'Article 53', 'B', 'Constitutional Law', 'Article 51A of the Constitution, added by the 42nd Amendment, outlines the fundamental duties of Indian citizens.', '{"universal": 78, "ebc": 84, "lexis_nexis": 90}'),
(1, 9, 'What is the definition of "Tort" in English law?', 'A civil wrong', 'A criminal offense', 'A contract breach', 'A property right', 'A', 'Torts', 'A tort is a civil wrong, distinct from criminal wrongs and breaches of contract, for which the injured party can claim damages.', '{"universal": 267, "ebc": 279, "lexis_nexis": 291}'),
(1, 10, 'Which of the following is a collective work under Copyright Law?', 'Encyclopedia', 'Newspaper', 'Magazine', 'All of the above', 'D', 'Intellectual Property', 'Collective works include encyclopedias, newspapers, and magazines. Under copyright law, these are protected as compilations.', '{"universal": 623, "ebc": 641, "lexis_nexis": 659}')
ON CONFLICT DO NOTHING;

-- Optional: Create test user profiles for manual testing
-- Note: These users will be created via Supabase Auth. This is just for reference.
-- In practice, user_profiles are created automatically via auth triggers.
