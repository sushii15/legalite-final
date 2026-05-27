import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wnxsinncibklmcxujgwd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U"
);

async function insertQuestionsFromJSON(jsonFilePath, aibeNumber) {
  try {
    console.log(`\n📖 Reading JSON file: ${jsonFilePath}`);
    const fileContent = readFileSync(jsonFilePath, "utf-8");
    const questions = JSON.parse(fileContent);
    console.log(`✅ Loaded ${questions.length} questions`);

    // Check or create paper record
    console.log(`\n💾 Checking for existing paper record...`);
    const { data: existingPaper } = await supabase
      .from("papers")
      .select("id")
      .eq("aibe_id", aibeNumber)
      .limit(1);

    let paperId;
    if (existingPaper && existingPaper.length > 0) {
      paperId = existingPaper[0].id;
      console.log(`  ℹ️  Paper AIBE ${aibeNumber} already exists (id: ${paperId})`);
      console.log(`  🗑️  Deleting existing questions for clean insertion...`);
      const { error: deleteError } = await supabase
        .from("questions")
        .delete()
        .eq("paper_id", paperId);
      if (deleteError) {
        console.error(`  ⚠️  Error deleting existing questions: ${deleteError.message}`);
      } else {
        console.log(`  ✅ Deleted existing questions`);
      }
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

    console.log(`\n📝 Inserting ${questionsToInsert.length} questions...`);
    const { data: insertedData, error: insertError } = await supabase
      .from("questions")
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      console.error(`  ❌ Error inserting questions: ${insertError.message}`);
      throw insertError;
    }

    console.log(`  ✅ Successfully inserted ${insertedData.length} questions`);
    console.log(`\n✨ AIBE ${aibeNumber} questions successfully inserted!`);
    return true;
  } catch (error) {
    console.error(`❌ Fatal error: ${error.message}`);
    throw error;
  }
}

// Main execution
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: node insert-questions.mjs <jsonFilePath> <aibeNumber>");
  console.log("Example: node insert-questions.mjs ./aibe20_questions.json 20");
  process.exit(1);
}

const jsonFilePath = args[0];
const aibeNumber = parseInt(args[1]);

insertQuestionsFromJSON(jsonFilePath, aibeNumber).catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
