# AIBE Papers Extraction Agent

## Overview
This agent extracts questions from AIBE past paper PDFs and automatically inserts them into Supabase with correct answers matched from answer key images (.png or .jpg). Since all sets of the same AIBE exam contain identical questions in different orders, you only need to provide one PDF per exam.

## How It Works

### 1. File Structure Discovery
The script expects the following folder layout:
```
papers/
├── AIBE 20.pdf                  (question paper - PDF format)
├── AIBE 20 answers.png          (answer key table - PNG/JPG image)
├── AIBE 19.pdf
├── AIBE 19 answers.jpg          (supports .jpg and .jpeg too)
├── AIBE 18.pdf
├── AIBE 18 answers.png
└── ... (more exams)
```

**Note:** 
- Question papers must be **PDF files**
- Answer keys must be **image files** (.png, .jpg, or .jpeg)
- All sets (A, B, C, D) of an AIBE exam contain the same 100 questions in different orders. You only need one question PDF per exam.

### 2. Question Extraction
For each exam PDF:
1. Claude Vision reads the PDF
2. Extracts all 100 questions with:
   - Question number
   - Full question text
   - Options A, B, C, D
   - Subject category
3. Returns structured JSON array

### 3. Answer Key Parsing
The answer key PDF is parsed to extract answers in this format:
```json
{
  "1": "A",
  "2": "B",
  "3": "C",
  ...
  "100": "D"
}
```

### 4. Database Updates
For each exam:
1. Creates a new paper record (e.g., "AIBE 20")
2. Inserts 100 questions with matched correct answers
3. Updates `papers` table with:
   - `aibe_id` — AIBE number (20, 19, etc.)
   - `title` — "AIBE 20"
   - `question_count` — 100
   - `is_free` — true for AIBE 20, false for others

## Running the Script

### Prerequisites
```bash
npm install @anthropic-ai/sdk
```

### Create Papers Folder
Create a `papers` folder in the legalite-final directory and place your AIBE PDF files there with the naming format shown above.

### Command
```bash
node extract-papers.mjs
```

### Expected Output
```
🚀 Starting AIBE past papers extraction...

📚 Found 3 question PDFs and 3 answer keys

📖 Extracting answer key for AIBE 20...
  ✅ Successfully extracted 100 answers

📚 Processing AIBE 20
  📄 Extracting questions from: AIBE 20.pdf
    ⚠️  Creating new paper record for AIBE 20
    ✅ Inserted 100 questions

📚 Processing AIBE 19
  📄 Extracting questions from: AIBE 19.pdf
    ✅ Inserted 100 questions

📚 Processing AIBE 18
  📄 Extracting questions from: AIBE 18.pdf
    ✅ Inserted 100 questions

✨ Papers extraction complete!
   Processed: 3 exams
```

## File Naming Requirements

- **Question Papers:** Must be **.pdf** files and contain "AIBE" and a number (e.g., "AIBE 20.pdf")
- **Answer Keys:** Must be **.png**, **.jpg**, or **.jpeg** image files and contain "AIBE", a number, AND "answer" (e.g., "AIBE 20 answers.png")

Examples of valid names:
- ✅ `AIBE 20.pdf` + `AIBE 20 answers.png`
- ✅ `AIBE-19.pdf` + `AIBE-19-answer-key.jpg`
- ✅ `AIBE_18_past_paper.pdf` + `AIBE_18_answers.jpeg`

**Important:** Question files = PDF, Answer keys = Image files (.png/.jpg/.jpeg)

## Rate Limiting
- **Between exams:** 2-second delay
- Claude API has generous rate limits; adjust if needed

## Database Schema

The `papers` table should include:
```sql
CREATE TABLE papers (
  id BIGINT PRIMARY KEY,
  aibe_id INTEGER,
  title VARCHAR(255),
  question_count INTEGER,
  is_free BOOLEAN,
  created_at TIMESTAMP
);
```

**Note:** The `set_variant` column is not needed for this simplified structure (all questions from one exam, regardless of which "set" was provided).

## Troubleshooting

### "No PDF files found"
- Check that PDFs are in the `papers/` folder
- Verify file names contain "AIBE" (e.g., "AIBE 20.pdf")

### "couldn't determine AIBE number"
- File name should contain AIBE number in format "AIBE 20" or "AIBE-20"
- Rename file if needed
- Example: ✅ `AIBE 20.pdf` | ❌ `past_paper.pdf`

### "Error extracting answers"
- Verify answer key image has clear answer table (Q1: A, Q2: B, etc.)
- Answer key image should be for the same AIBE exam as the question PDF
- Ensure the image file is a clear PNG/JPG (not blurry or rotated)
- Answer key must be an image file (.png, .jpg, or .jpeg), not a PDF
- Claude can usually handle various answer table formats, but verify the image is readable

### "Error inserting questions"
- Ensure Supabase credentials are correct
- Check that `papers` and `questions` tables exist
- Verify questions table has columns: `paper_id`, `question_number`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `subject`

## Next Steps

1. **Organize Papers:** Place your AIBE materials in the `papers/` folder:
   - **Question papers:** One PDF per exam (e.g., `AIBE 20.pdf`)
   - **Answer keys:** One image file per exam (e.g., `AIBE 20 answers.png` or `AIBE 20 answers.jpg`)

2. **Run Agent:** Execute `node extract-papers.mjs`

3. **Verify Data:** Check Supabase to confirm:
   - New paper records created for each exam
   - 100 questions per exam inserted
   - Correct answers matched properly

4. **Generate Explanations:** Once papers are in database, run `generate-explanations.mjs` (Phase 3)

---
**Updated:** 2026-05-25
**API:** Anthropic Claude 3.5 Sonnet (Vision)
**Database:** Supabase PostgreSQL
**Structure:** One PDF per AIBE exam (no set variants needed)
