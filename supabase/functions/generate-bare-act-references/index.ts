import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface BareActRequest {
  questionId: number
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: string
  subject: string
  explanation?: string
}

interface BareActReference {
  name: string
  section: string
  relevance: string
  explanation: string
}

// Bare act display names
const bareActNames: Record<string, string> = {
  "bharatiya-nyaya-sanhita": "Bharatiya Nyaya Sanhita, 2023",
  "bharatiya-nagarik-suraksha-sanhita": "Bharatiya Nagarik Suraksha Sanhita, 2023",
  "bharatiya-sakshya": "Bharatiya Sakshya Adhiniyam, 2023",
  "ipc": "Indian Penal Code",
  "crpc": "Code of Criminal Procedure, 1973",
  "cpc": "Code of Civil Procedure, 1908",
  "constitution": "Constitution of India",
  "contract-act": "Indian Contract Act, 1872",
  "sale-of-goods-act": "Sale of Goods Act, 1930",
  "evidence-act": "Indian Evidence Act, 1872",
  "hindu-marriage-act": "Hindu Marriage Act, 1955",
  "hindu-succession": "Hindu Succession Act, 1956",
  "hindu-adoption": "Hindu Adoption and Maintenance Act, 1956",
  "limitation-act": "Limitation Act, 1963",
  "negotiable-instruments-act": "Negotiable Instruments Act, 1881",
  "muslim-marriages": "Dissolution of Muslim Marriage Act, 1939",
  "muslim-women": "Muslim Women (Protection of Rights on Divorce) Act, 1986",
}

async function predictBareActsWithGemini(
  questionText: string,
  optionA: string,
  optionB: string,
  optionC: string,
  optionD: string,
  correctOption: string,
  subject: string,
  explanation?: string
): Promise<BareActReference[]> {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY")
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY not configured")
  }

  const prompt = `You are an expert in Indian Law and AIBE (All India Bar Examination) exam preparation.

Analyze this AIBE question and predict the 2-3 most relevant bare acts/laws that would be referenced:

Question: ${questionText}

Options:
A) ${optionA}
B) ${optionB}
C) ${optionC}
D) ${optionD}

Correct Answer: ${correctOption}
Subject: ${subject}
${explanation ? `Explanation: ${explanation}` : ""}

Please provide 2-3 bare acts with specific sections/articles that are most relevant to answering this question correctly.

Format your response as a JSON array with this exact structure (no markdown code blocks, just pure JSON):
[
  {
    "name": "Name of the Act (e.g., 'Bharatiya Nyaya Sanhita, 2023')",
    "section": "Specific Section/Article/Chapter number (e.g., 'Section 142')",
    "relevance": "Why this section is relevant (one sentence)",
    "explanation": "How this section directly relates to the correct answer (2-3 sentences)"
  },
  ...
]

Be precise and reference only actual sections that genuinely apply to this question.`

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": geminiApiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("Gemini API error:", error)
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

  if (!responseText) {
    throw new Error("No response from Gemini")
  }

  // Parse the JSON response
  try {
    const references = JSON.parse(responseText) as BareActReference[]
    return references.slice(0, 3) // Limit to 3 references
  } catch (parseError) {
    console.error("Failed to parse Gemini response:", responseText, parseError)
    // Return a fallback based on subject
    return [
      {
        name: getDefaultBareActForSubject(subject),
        section: "Various Sections",
        relevance: "Core legal principles applicable to this question",
        explanation: "Review the relevant sections of this act to understand the legal framework for answering this question correctly.",
      },
    ]
  }
}

function getDefaultBareActForSubject(subject: string): string {
  const subjectMap: Record<string, string> = {
    "Criminal Law": "Indian Penal Code & Bharatiya Nyaya Sanhita, 2023",
    "Criminal Procedure": "Code of Criminal Procedure, 1973 & Bharatiya Nagarik Suraksha Sanhita, 2023",
    "Evidence": "Indian Evidence Act, 1872 & Bharatiya Sakshya Adhiniyam, 2023",
    "Civil Law": "Code of Civil Procedure, 1908",
    "Contract Law": "Indian Contract Act, 1872",
    "Constitutional Law": "Constitution of India",
    "Property Law": "Hindu Succession Act, 1956",
    "Family Law": "Hindu Marriage Act, 1955",
    "Limitation": "Limitation Act, 1963",
    "Negotiable Instruments": "Negotiable Instruments Act, 1881",
  }
  return subjectMap[subject] || "Indian Law"
}

async function generateDetailedReport(
  questionText: string,
  correctOption: string,
  subject: string,
  bareActReferences: BareActReference[]
): Promise<string> {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY")
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY not configured")
  }

  const bareActContext = bareActReferences
    .map(ref => `${ref.name} - ${ref.section}: ${ref.explanation}`)
    .join("\n\n")

  const prompt = `You are an expert law teacher preparing study materials for AIBE (All India Bar Examination) candidates.

Question: ${questionText}
Correct Answer Option: ${correctOption}
Subject: ${subject}

Relevant Legal Framework:
${bareActContext}

Please provide a comprehensive, detailed study note that:
1. Explains the core legal principle being tested
2. References the specific sections/articles from the bare acts
3. Provides practical examples or real-world applications
4. Explains common misconceptions that might lead to choosing wrong answers
5. Summarizes the key takeaway for exam preparation

Format as a well-structured, educational explanation (3-4 paragraphs) suitable for law students preparing for competitive exams.`

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": geminiApiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1500,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("Gemini API error:", error)
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate detailed report."
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  }

  try {
    const requestData: BareActRequest = await req.json()

    // Generate bare act references using Gemini
    const bareActReferences = await predictBareActsWithGemini(
      requestData.questionText,
      requestData.optionA,
      requestData.optionB,
      requestData.optionC,
      requestData.correctOption,
      requestData.subject,
      requestData.explanation
    )

    // Generate detailed report
    const detailedReport = await generateDetailedReport(
      requestData.questionText,
      requestData.correctOption,
      requestData.subject,
      bareActReferences
    )

    return new Response(
      JSON.stringify({
        bareActReferences,
        detailedReport,
        generatedAt: new Date().toISOString(),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  } catch (error) {
    console.error("Error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }
})
