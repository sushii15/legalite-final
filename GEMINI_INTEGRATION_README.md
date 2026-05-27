# Gemini API Bare Acts Integration

## Overview
This integration extracts content from bare acts PDF files using Google's Gemini API and generates AI-powered explanations for AIBE exam questions.

## Files
- `generate-explanations.mjs` - Main script to process questions and generate explanations
- `GEMINI_INTEGRATION_README.md` - This file

## How It Works

### 1. Question-to-Bare-Act Mapping
The script analyzes each question's text to determine which bare act is relevant using keyword matching:
- "bharatiya nyaya sanhita" → Indian Penal Code 2023
- "bharatiya sakshya" → Indian Evidence Code 2023
- "motor vehicles" → Code of Criminal Procedure
- "constitution" → Constitution of India
- And 15+ other mappings

### 2. PDF Content Extraction
For each question:
1. Identifies the relevant bare act PDF
2. Loads the PDF file
3. Sends it to Gemini API for content extraction
4. Returns structured legal text

### 3. Explanation Generation
Using the extracted legal text:
1. Passes the question, options, and legal text to Gemini
2. Generates a clear 2-3 sentence explanation based on actual provisions
3. Estimates page numbers for Universal, EBC, and LexisNexis editions
4. Returns structured data: `{ explanation, pages }`

### 4. Database Update
Updates Supabase questions table with:
- `explanation` - AI-generated explanation
- `bare_act_pages` - JSON object with page numbers

## Running the Script

### Prerequisites
```bash
npm install @google/generative-ai
```

### Command
```bash
node generate-explanations.mjs
```

### Output
```
🚀 Starting bare act explanation generation...
📚 Found 94 questions to process

[1/94] Q1
📖 Using: Indian Penal Code
  📄 Reading PDF...
✅ Updated with explanation
   "Under Section 380 IPC, house breaking theft is punishable..."
   Pages: {"universal":156,"ebc":167,"lexis_nexis":172}
```

## API Quota Limits

### Gemini Free Tier
- **Requests per minute**: 15
- **Requests per day**: 1,500
- **Input tokens per minute**: 1,000,000

### To Upgrade
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a billing-enabled API key
3. Update `GEMINI_API_KEY` in the script

## Bare Acts Included

The script supports these legal documents in the `./bare acts/` folder:

1. Constitution of India
2. Indian Penal Code (IPC) / Bharatiya Nyaya Sanhita (2023)
3. Code of Criminal Procedure / Bharatiya Nagarik Suraksha Sanhita (2023)
4. Indian Contract Act
5. Sale of Goods Act
6. Indian Evidence Act / Bharatiya Sakshya Adhiniyam (2023)
7. Limitation Act
8. Hindu Marriage Act
9. Hindu Adoption and Maintenance Act
10. Hindu Succession Act
11. Law of Torts (TPA)
12. Negotiable Instruments Act
13. Dissolution of Muslim Marriage Act
14. Muslim Marriages (Registrations) Act
15. Muslim Women (Protection of Rights on Divorce) Act

## Features

✅ Intelligent bare act detection from question text
✅ PDF extraction using Gemini Vision
✅ Legal explanation generation
✅ Page number extraction
✅ Supabase database updates
✅ Error handling and retry logic
✅ Rate limit management (2s delay between questions)

## Next Steps

1. **Upgrade API Key**: Get a paid Gemini API key for higher quotas
2. **Verify Page Numbers**: Cross-check extracted page numbers with actual PDFs
3. **Review Explanations**: QA the generated explanations for accuracy
4. **Bulk Process**: Run on all questions in the database
5. **Monitor Usage**: Track token usage and adjust batch sizes if needed

## Troubleshooting

### "Quota exceeded" Error
- Wait 1 hour for free tier quota to reset
- OR upgrade to a paid API key

### "PDF not found" Error
- Check bare acts folder exists: `./bare acts/`
- Verify PDF filename matches the script mapping
- Check file extensions are `.pdf`

### "Could not determine bare act" Warning
- Question text doesn't match any keyword mapping
- Add new keyword mapping to `keywordMap` object
- Or manually update the question's `subject` field in Supabase

## Example Output in Database

```json
{
  "id": 1,
  "question_text": "Which article of the Indian Constitution deals with the right to freedom of religion?",
  "explanation": "Article 25 of the Constitution of India guarantees the right to freedom of religion. This is the primary constitutional provision protecting religious freedom for all citizens, distinct from Articles 26-28 which address specific aspects of this right.",
  "bare_act_pages": {
    "universal": 45,
    "ebc": 52,
    "lexis_nexis": 48
  }
}
```

---
**Created**: 2026-05-25
**API**: Google Generative AI (Gemini)
**Database**: Supabase PostgreSQL
