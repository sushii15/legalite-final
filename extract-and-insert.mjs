import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  "https://wnxsinncibklmcxujgwd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U"
);

async function extractPaperWithExplanations(filePath, aibeNumber) {
  try {
    console.log(`\n📖 Reading AIBE ${aibeNumber} PDF...`);
    const pdfContent = readFileSync(filePath);
    const base64Content = Buffer.from(pdfContent).toString("base64");
    console.log(`✅ Read ${pdfContent.length} bytes`);

    console.log(`🤖 Extracting questions with Claude Vision...`);
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64Content,
              },
            },
            {
              type: "text",
              text: `Extract ALL 100 questions from this AIBE ${aibeNumber} past paper PDF. For each question, provide:
1. Question number (1-100)
2. Full question text
3. Option A text
4. Option B text
5. Option C text
6. Option D text
7. Correct answer (A, B, C, or D)
8. Explanation/solution text
9. Subject category (Constitutional Law, Criminal Law, Contract Law, Evidence Law, Civil Procedure, Family Law, Labor Law, Tort Law, Administrative Law, etc.)

Format as JSON array:
[
  {
    "question_number": 1,
    "question_text": "...",
    "option_a": "...",
    "option_b": "...",
    "option_c": "...",
    "option_d": "...",
    "correct_option": "A",
    "explanation": "...",
    "subject": "Constitutional Law"
  }
]

IMPORTANT:
- Return ONLY valid JSON, no other text
- Include the full explanation/solution for each question
- Ensure exactly 100 questions are extracted
- Correct option must be A, B, C, or D`,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].text;
    const questions = JSON.parse(responseText);

    if (questions.length !== 100) {
      console.warn(`⚠️  Expected 100 questions, got ${questions.length}`);
    }

    return questions;
  } catch (error) {
    console.error(`❌ Error extracting PDF: ${error.message}`);
    throw error;
  }
}

async function insertPaper(aibeNumber, questions) {
  try {
    console.log(`\n💾 Inserting into Supabase...`);

    // Check if paper already exists
    const { data: existingPaper } = await supabase
      .from("papers")
      .select("id")
      .eq("aibe_id", aibeNumber)
      .limit(1);

    let paperId;
    if (existingPaper && existingPaper.length > 0) {
      paperId = existingPaper[0].id;
      console.log(`  ℹ️  Paper AIBE ${aibeNumber} already exists (id: ${paperId})`);
    } else {
      console.log(`  ➕ Creating new paper record for AIBE ${aibeNumber}`);
      const { data: newPaper, error: paperError } = await supabase
        .from("papers")
        .insert([
          {
            aibe_id: aibeNumber,
            title: `AIBE ${aibeNumber}`,
            question_count: questions.length,
            is_free: aibeNumber === 20,
          },
        ])
        .select();

      if (paperError) {
        console.error(`  ❌ Error creating paper: ${paperError.message}`);
        throw paperError;
      }
      paperId = newPaper[0].id;
      console.log(`  ✅ Created paper record (id: ${paperId})`);
    }

    // Prepare questions for insertion
    const questionsToInsert = questions.map((q) => ({
      paper_id: paperId,
      question_number: q.question_number,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option,
      explanation: q.explanation || null,
      subject: q.subject,
    }));

    console.log(`  📝 Inserting ${questionsToInsert.length} questions...`);
    const { data: insertedData, error: insertError } = await supabase
      .from("questions")
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      console.error(`  ❌ Error inserting questions: ${insertError.message}`);
      throw insertError;
    }

    console.log(`  ✅ Successfully inserted ${insertedData.length} questions`);
    return true;
  } catch (error) {
    console.error(`❌ Error in insertion: ${error.message}`);
    throw error;
  }
}

async function processPaper(filePath, aibeNumber) {
  console.log(`\n🚀 Processing AIBE ${aibeNumber} paper...`);

  const questions = await extractPaperWithExplanations(filePath, aibeNumber);

  if (questions.length === 0) {
    console.log(`❌ No questions extracted`);
    return false;
  }

  await insertPaper(aibeNumber, questions);
  console.log(`\n✨ AIBE ${aibeNumber} paper successfully processed!`);
  return true;
}

// Main execution
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: ANTHROPIC_API_KEY=your_key node extract-and-insert.mjs <filePath> <aibeNumber>");
  console.log("Example: ANTHROPIC_API_KEY=sk-ant-... node extract-and-insert.mjs \"../aibe 20.pdf\" 20");
  process.exit(1);
}

const filePath = args[0];
const aibeNumber = parseInt(args[1]);

processPaper(filePath, aibeNumber).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
