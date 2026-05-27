import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wnxsinncibklmcxujgwd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U"
);

async function verifyInsertion() {
  try {
    // Get total count
    const { data: allQuestions, error: countError } = await supabase
      .from("questions")
      .select("question_number, subject")
      .order("question_number");

    if (countError) throw countError;

    console.log(`\n✅ Total questions in database: ${allQuestions.length}`);
    
    // Show subject distribution
    const subjectCounts = {};
    allQuestions.forEach(q => {
      subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
    });

    console.log("\n📊 Subject Distribution:");
    Object.entries(subjectCounts).sort((a, b) => b[1] - a[1]).forEach(([subject, count]) => {
      console.log(`  ${subject}: ${count} questions`);
    });

    // Show sample questions
    const { data: samples, error: sampleError } = await supabase
      .from("questions")
      .select("question_number, question_text, correct_option, subject")
      .in("question_number", [1, 50, 100])
      .order("question_number");

    if (sampleError) throw sampleError;

    console.log("\n📋 Sample Questions:");
    samples.forEach(q => {
      console.log(`\n  Q${q.question_number} (${q.subject}):`);
      console.log(`  ${q.question_text.substring(0, 80)}...`);
      console.log(`  Answer: ${q.correct_option}`);
    });

  } catch (error) {
    console.error("Error:", error.message);
  }
}

verifyInsertion();
