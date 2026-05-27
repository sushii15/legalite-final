import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

interface ExplanationRequest {
  questionId: number
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: string
  subject: string
}

// Bare act mapping for keyword detection
const keywordMap: Record<string, string> = {
  "bharatiya nyaya sanhita": "Indian Penal Code (2023)",
  "bharatiya nagarik suraksha": "Code of Criminal Procedure (2023)",
  "bharatiya sakshya": "Indian Evidence Act (2023)",
  "indian penal code": "Indian Penal Code",
  "ipc": "Indian Penal Code",
  "criminal procedure": "Code of Criminal Procedure",
  "crpc": "Code of Criminal Procedure",
  "constitution": "Constitution of India",
  "contract act": "Indian Contract Act",
  "contract": "Indian Contract Act",
  "sale of goods": "Sale of Goods Act",
  "evidence": "Indian Evidence Act",
  "hindu marriage": "Hindu Marriage Act",
  "hindu succession": "Hindu Succession Act",
  "hindu adoption": "Hindu Adoption and Maintenance Act",
  "motor vehicles": "Code of Criminal Procedure",
  "limitation": "Limitation Act",
  "negotiable instrument": "Negotiable Instruments Act",
  "muslim marriage": "Dissolution of Muslim Marriage Act",
  "muslim women": "Muslim Women (Protection of Rights on Divorce) Act",
}

function identifyBareAct(text: string): string {
  const textLower = text.toLowerCase()
  for (const [keyword, bareAct] of Object.entries(keywordMap)) {
    if (textLower.includes(keyword)) {
      return bareAct
    }
  }
  return "Indian Law"
}

async function generateExplanationWithGemini(
  questionText: string,
  optionA: string,
  optionB: string,
  optionC: string,
  optionD: string,
  correctOption: string,
  bareActName: string
): Promise<string> {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY")
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY not configured")
  }

  const prompt = `You are an expert in Indian Law for AIBE (All India Bar Examination) exams.

Question: ${questionText}

Options:
A) ${optionA}
B) ${optionB}
C) ${optionC}
D) ${optionD}

Correct Answer: ${correctOption}

Relevant Legal Area: ${bareActName}

Please provide:
1. A clear, concise 2-3 sentence explanation of why the correct answer is ${correctOption}
2. Reference the specific legal principle, section, or article from ${bareActName} if applicable
3. Explain why the other options are incorrect (briefly)

Format your response as a clear, educational explanation suitable for law students.`

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
        maxOutputTokens: 500,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("Gemini API error:", error)
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  return explanation
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
    const requestData: ExplanationRequest = await req.json()

    // Identify relevant bare act from question text
    const bareActName = identifyBareAct(requestData.questionText)

    // Generate explanation using Gemini
    const explanation = await generateExplanationWithGemini(
      requestData.questionText,
      requestData.optionA,
      requestData.optionB,
      requestData.optionC,
      requestData.optionD,
      requestData.correctOption,
      bareActName
    )

    if (!explanation) {
      return new Response(
        JSON.stringify({ error: "Failed to generate explanation" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
    }

    // Optionally update the database with generated explanation
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      const supabase = createClient(supabaseUrl, serviceRoleKey)

      // Update the question with the new explanation
      await supabase
        .from("questions")
        .update({ explanation })
        .eq("id", requestData.questionId)
        .single()
    } catch (dbError) {
      console.warn("Could not update database:", dbError)
      // Continue anyway - we still have the explanation to return
    }

    return new Response(
      JSON.stringify({
        explanation,
        bareActName,
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
