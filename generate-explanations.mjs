import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

const GEMINI_API_KEY = "AIzaSyC38btKI9i_hZfD9VsmVONorbuZ-d173Bs";
const BARE_ACTS_FOLDER = "./bare acts";

const supabaseUrl = "https://wnxsinncibklmcxujgwd.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueHNpbm5jaWJrbG1jeHVqZ3dkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU4NzYyOSwiZXhwIjoyMDk1MTYzNjI5fQ.lnSv2BIDuR_1kCBQTPtf9S4nlOOON-W4_qi9tXWkn-U";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const supabase = createClient(supabaseUrl, serviceRoleKey);

// Map of bare act file names to display names
const bareActMap = {
  "constitution-of-india": "Constitution of India",
  "ipc-bare-act": "Indian Penal Code",
  
  "crpc-bare-act-1973": "Code of Criminal Procedure 1973",
  "contract-act": "Indian Contract Act",
  "sale-of-goods-act": "Sale of Goods Act",
  "evidence-act": "Indian Evidence Act",
  "limitation-act": "Limitation Act",
  "hindu-marriage-act": "Hindu Marriage Act",
  "hindu-adoption-and-maintenance-act": "Hindu Adoption and Maintenance Act",
  "tpa": "Law of Torts",
  "negotiable-instruments-act-1881": "Negotiable Instruments Act",
  "dissolution-of-muslim-marriage-act": "Dissolution of Muslim Marriage Act",
  "muslim-marriages-registration-act-1981": "Muslim Marriages (Registrations) Act",
  "muslim-women-protection-of-rights-on-divorce-act-1986": "Muslim Women (Protection of Rights on Divorce) Act",
  "the-bharatiya-sakshya-adhiniyam-2023": "Bharatiya Sakshya Adhiniyam (Indian Evidence Code 2023)",
  "the-bharatiya-nyaya-sanhita-2023": "Bharatiya Nyaya Sanhita (Indian Penal Code 2023)",
  "bharatiya-nagarik-suraksha-sanhita-2023": "Bharatiya Nagarik Suraksha Sanhita (Code of Criminal Procedure 2023)",
  "the-hindu-succession-act1956": "Hindu Succession Act"
};

// Text-to-bare-act mapping based on keywords in questions
const keywordMap = {
  "bharatiya nyaya sanhita": "the-bharatiya-nyaya-sanhita-2023",
  "bharatiya nagarik suraksha": "bharatiya-nagarik-suraksha-sanhita-2023",
  "bharatiya sakshya": "the-bharatiya-sakshya-adhiniyam-2023",
  "indian penal code": "ipc-bare-act",
  "ipc": "ipc-bare-act",
  "criminal procedure": "crpc-bare-act-1973",
  "crpc": "crpc-bare-act-1973",
  "constitution of india": "constitution-of-india",
  "constitution": "constitution-of-india",
  "contract act": "contract-act",
  "sale of goods": "sale-of-goods-act",
  "evidence act": "evidence-act",
  "hindu marriage": "hindu-marriage-act",
  "hindu succession": "the-hindu-succession-act1956",
  "hindu adoption": "hindu-adoption-and-maintenance-act",
  "motor vehicles": "crpc-bare-act-1973",
  "limitation": "limitation-act",
  "negotiable instrument": "negotiable-instruments-act-1881",
  "muslim marriage": "muslim-marriages-registration-act-1981",
  "dissolution of muslim marriage": "dissolution-of-muslim-marriage-act",
  "muslim women": "muslim-women-protection-of-rights-on-divorce-act-1986",
};

async function extractPdfContent(filePath) {
  try {
    console.log(`  📄 Reading PDF...`);
    const pdfContent = readFileSync(filePath);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const response = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: Buffer.from(pdfContent).toString("base64"),
        },
      },
      {
        text: "Provide key sections and articles with their full text. Format clearly with section numbers and content.",
      },
    ]);

    return response.response.text();
  } catch (error) {
    console.error(`  ❌ Error extracting PDF: ${error.message}`);
    return null;
  }
}

async function generateExplanationForQuestion(question, bareActName, bareActContent) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert in Indian Law for AIBE exams.

Question: ${question.question_text}
A) ${question.option_a}
B) ${question.option_b}
C) ${question.option_c}
D) ${question.option_d}

Correct Answer: ${question.correct_option}

Relevant excerpts from ${bareActName}:
${bareActContent.substring(0, 3000)}

Provide:
1. A clear, direct 2-3 sentence explanation using actual provisions from the law
2. Estimated page numbers if identifiable (optional)

Format:
EXPLANATION: [explanation text]
PAGES: universal:X ebc:X lexis_nexis:X`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    return parseExplanationResponse(text);
  } catch (error) {
    console.error(`  ❌ Error generating explanation: ${error.message}`);
    return { explanation: "", pages: {} };
  }
}

function parseExplanationResponse(response) {
  const explanationMatch = response.match(/EXPLANATION:\s*(.+?)(?=PAGES:|$)/s);
  const pagesMatch = response.match(/PAGES:\s*(.+?)$/);

  let explanation = explanationMatch ? explanationMatch[1].trim() : "";
  let pages = {};

  if (pagesMatch) {
    const pagesStr = pagesMatch[1];
    const universalMatch = pagesStr.match(/universal:\s*(\d+)/i);
    const ebcMatch = pagesStr.match(/ebc:\s*(\d+)/i);
    const lexisNexisMatch = pagesStr.match(/lexis_nexis:\s*(\d+)/i);

    if (universalMatch) pages.universal = parseInt(universalMatch[1]);
    if (ebcMatch) pages.ebc = parseInt(ebcMatch[1]);
    if (lexisNexisMatch) pages.lexis_nexis = parseInt(lexisNexisMatch[1]);
  }

  return { explanation, pages };
}

function findBareActFromQuestionText(questionText) {
  const textLower = questionText.toLowerCase();

  for (const [keyword, bareActFile] of Object.entries(keywordMap)) {
    if (textLower.includes(keyword)) {
      return bareActFile;
    }
  }

  return null;
}

async function processQuestions() {
  try {
    console.log("🚀 Starting bare act explanation generation...\n");

    // Fetch all questions from Supabase
    const { data: questions, error: fetchError } = await supabase
      .from("questions")
      .select("*")
      .order("question_number", { ascending: true });

    if (fetchError || !questions) {
      console.error("Error fetching questions:", fetchError);
      return;
    }

    console.log(`📚 Found ${questions.length} questions to process\n`);

    let processedCount = 0;
    let skippedCount = 0;

    // Process each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      console.log(`\n[${i + 1}/${questions.length}] Q${question.question_number}`);

      // Find bare act from question text
      const bareActFile = findBareActFromQuestionText(question.question_text);

      if (!bareActFile) {
        console.log(`⚠️  Could not determine bare act from question text`);
        skippedCount++;
        continue;
      }

      const bareActPath = join(BARE_ACTS_FOLDER, `${bareActFile}.pdf`);
      const bareActName = bareActMap[bareActFile] || bareActFile;
      console.log(`📖 Using: ${bareActName}`);

      // Extract content from bare act
      const bareActContent = await extractPdfContent(bareActPath);

      if (!bareActContent) {
        console.log(`❌ Could not extract content`);
        skippedCount++;
        continue;
      }

      // Generate explanation
      const { explanation, pages } = await generateExplanationForQuestion(
        question,
        bareActName,
        bareActContent
      );

      if (!explanation) {
        console.log(`❌ Could not generate explanation`);
        skippedCount++;
        continue;
      }

      // Update in Supabase
      const updateData = {
        explanation: explanation,
      };

      if (Object.keys(pages).length > 0) {
        updateData.bare_act_pages = pages;
      }

      const { error: updateError } = await supabase
        .from("questions")
        .update(updateData)
        .eq("id", question.id);

      if (updateError) {
        console.error(`❌ Update error:`, updateError);
        skippedCount++;
      } else {
        console.log(`✅ Updated with explanation`);
        console.log(`   "${explanation.substring(0, 100)}..."`);
        if (Object.keys(pages).length > 0) {
          console.log(`   Pages: ${JSON.stringify(pages)}`);
        }
        processedCount++;
      }

      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 65000));
    }

    console.log(`\n✨ Generation complete!`);
    console.log(`   Processed: ${processedCount}/${questions.length}`);
    console.log(`   Skipped: ${skippedCount}/${questions.length}`);
  } catch (error) {
    console.error("Fatal error:", error);
  }
}

processQuestions().catch(console.error);
