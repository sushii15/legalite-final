import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

const client = new Anthropic();
const supabaseUrl = "https://wnxsinncibklmcxujgwd.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U";
const supabase = createClient(supabaseUrl, serviceRoleKey);

const PAPERS_FOLDER = "./papers"; // User will provide this folder with PDFs

async function extractQuestionsFromPDF(filePath, aibeNumber) {
  try {
    console.log(`    📄 Reading PDF: ${filePath}`);
    const pdfContent = readFileSync(filePath);
    const base64Content = Buffer.from(pdfContent).toString("base64");

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
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
              text: `Extract all questions from this AIBE ${aibeNumber} past paper PDF. For each question, provide:
1. Question number (1-100)
2. Full question text
3. Option A text
4. Option B text
5. Option C text
6. Option D text
7. Subject (Constitutional Law, Criminal Law, Contract Law, Evidence Law, Civil Procedure, Family Law, Labor Law, etc.)

NOTE: Do NOT include correct_option here - we'll match it separately from the answer key.

Format as JSON array:
[
  {
    "question_number": 1,
    "question_text": "...",
    "option_a": "...",
    "option_b": "...",
    "option_c": "...",
    "option_d": "...",
    "subject": "Constitutional Law"
  }
]

Return ONLY valid JSON, no other text.`,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].text;
    const questions = JSON.parse(responseText);
    return questions;
  } catch (error) {
    console.error(`    ❌ Error extracting from PDF: ${error.message}`);
    return [];
  }
}

async function extractAnswersFromKeyPDF(filePath, aibeNumber) {
  try {
    console.log(`  📄 Parsing answer key image...`);
    const fileContent = readFileSync(filePath);
    const base64Content = Buffer.from(fileContent).toString("base64");

    // Determine media type based on file extension
    const ext = filePath.toLowerCase().split(".").pop();
    let mediaType = "application/pdf";
    if (ext === "png") mediaType = "image/png";
    else if (ext === "jpg" || ext === "jpeg") mediaType = "image/jpeg";

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Content,
              },
            },
            {
              type: "text",
              text: `Look at this AIBE ${aibeNumber} answer key image/table. You will see a table with question numbers in one column and their corresponding answers in the next column.

Read the visual table carefully and extract ALL 100 question answers.

Return as JSON object with this structure:
{
  "1": "A",
  "2": "B",
  "3": "C",
  ...
  "100": "D"
}

Important rules:
- Read each question number from the table (1 to 100)
- Read the corresponding answer from the adjacent cell
- For questions marked as "withdrawn" (text or highlighted), use null
- If an answer shows multiple options like "A & C", use only the first letter (A)
- For standard answers, use only a single letter (A, B, C, or D)
- If a cell is empty or unclear, use null
- Return exactly 100 entries (one for each question)

Return ONLY valid JSON, no other text.`,
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].text;
    const answers = JSON.parse(responseText);
    return answers;
  } catch (error) {
    console.error(`  ❌ Error extracting answers: ${error.message}`);
    return null;
  }
}

async function getPaperIdForAIBE(aibeNumber) {
  // One paper per AIBE exam
  const { data: papers, error } = await supabase
    .from("papers")
    .select("id")
    .eq("aibe_id", aibeNumber)
    .limit(1);

  if (error || !papers || papers.length === 0) {
    console.log(`      ⚠️  Creating new paper record for AIBE ${aibeNumber}`);
    const { data: newPaper, error: insertError } = await supabase
      .from("papers")
      .insert([
        {
          aibe_id: aibeNumber,
          title: `AIBE ${aibeNumber}`,
          question_count: 100,
          is_free: aibeNumber === 20,
        },
      ])
      .select();

    if (insertError || !newPaper) {
      console.error(`      ❌ Failed to create paper: ${insertError?.message}`);
      return null;
    }
    return newPaper[0].id;
  }

  return papers[0].id;
}

async function processPapers() {
  try {
    console.log("🚀 Starting AIBE past papers extraction...\n");

    try {
      readdirSync(PAPERS_FOLDER);
    } catch (e) {
      console.error(`❌ Papers folder not found: ${PAPERS_FOLDER}`);
      console.log("📝 Please create a 'papers' folder and add PDF files");
      return;
    }

    const allFiles = readdirSync(PAPERS_FOLDER);
    const pdfFiles = allFiles.filter((f) => f.toLowerCase().endsWith(".pdf"));
    const imageFiles = allFiles.filter((f) =>
      f.toLowerCase().endsWith(".png") || f.toLowerCase().endsWith(".jpg") || f.toLowerCase().endsWith(".jpeg")
    );

    if (pdfFiles.length === 0) {
      console.log("❌ No PDF files found in papers folder");
      return;
    }

    // Separate answer key images from question PDFs
    const answerKeyFile = imageFiles.find((f) => f.toLowerCase().includes("answer"));
    const questionPDFs = pdfFiles.filter((f) => !f.toLowerCase().includes("answer"));

    console.log(`📚 Found ${questionPDFs.length} question PDFs and ${answerKeyFile ? 1 : 0} answer key image\n`);

    // Build mapping of AIBE numbers to question PDF files
    const papersByAIBE = {};
    for (const pdfFile of questionPDFs) {
      const aibeMatch = pdfFile.match(/AIBE\s+(\d+)/i);

      if (!aibeMatch) {
        console.log(`⚠️  Skipping ${pdfFile} - couldn't determine AIBE number`);
        continue;
      }

      const aibeNumber = parseInt(aibeMatch[1]);
      if (!papersByAIBE[aibeNumber]) {
        papersByAIBE[aibeNumber] = pdfFile;
      } else {
        console.log(`⚠️  Multiple PDFs for AIBE ${aibeNumber}, using first one`);
      }
    }

    // Extract answer key if it exists
    let answerKey = null;
    if (answerKeyFile) {
      const answerKeyPath = join(PAPERS_FOLDER, answerKeyFile);
      const aibeMatch = answerKeyFile.match(/AIBE\s+(\d+)/i);
      const aibeNumber = aibeMatch ? parseInt(aibeMatch[1]) : null;

      if (aibeNumber) {
        console.log(`\n📖 Extracting answer key for AIBE ${aibeNumber}...`);
        answerKey = await extractAnswersFromKeyPDF(answerKeyPath, aibeNumber);
        if (answerKey) {
          console.log(`  ✅ Successfully extracted ${Object.keys(answerKey).length} answers`);
        }
      }
      console.log("");
    }

    // Process each AIBE exam
    const aibeNumbers = Object.keys(papersByAIBE).sort((a, b) => parseInt(b) - parseInt(a));
    let processedCount = 0;

    for (const aibeNumStr of aibeNumbers) {
      const aibeNumber = parseInt(aibeNumStr);
      const pdfFile = papersByAIBE[aibeNumber];
      const filePath = join(PAPERS_FOLDER, pdfFile);

      console.log(`\n📚 Processing AIBE ${aibeNumber}`);
      console.log(`  📄 Extracting questions from: ${pdfFile}`);
      const questions = await extractQuestionsFromPDF(filePath, aibeNumber);

      if (questions.length === 0) {
        console.log(`    ❌ No questions extracted`);
        continue;
      }

      const paperId = await getPaperIdForAIBE(aibeNumber);
      if (!paperId) {
        console.log(`    ❌ Could not get/create paper record`);
        continue;
      }

      // Match correct answers from the answer key
      const questionsToInsert = questions.map((q) => ({
        paper_id: paperId,
        question_number: q.question_number,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: answerKey ? answerKey[q.question_number] || null : null,
        subject: q.subject,
      }));

      const { error: insertError, data: insertedData } = await supabase
        .from("questions")
        .insert(questionsToInsert)
        .select();

      if (insertError) {
        console.error(`    ❌ Error inserting questions: ${insertError.message}`);
      } else {
        console.log(`    ✅ Inserted ${insertedData.length} questions`);
        processedCount++;
      }

      // Delay between exams to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log(`\n✨ Papers extraction complete!`);
    console.log(`   Processed: ${processedCount} exams`);
  } catch (error) {
    console.error("Fatal error:", error);
  }
}

processPapers().catch(console.error);
