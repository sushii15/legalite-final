import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface SubjectPerformance {
  name: string
  percent: number
  correct: number
  total: number
}

interface AnalysisRequest {
  weakSubjects: SubjectPerformance[]
}

async function analyzeWeakSubjectsWithGemini(
  weakSubjects: SubjectPerformance[]
): Promise<string> {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY")
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY not configured")
  }

  // Format weak subjects for the prompt
  const subjectsList = weakSubjects
    .map((s) => `${s.name}: ${s.percent}% (${s.correct}/${s.total} correct)`)
    .join("\n")

  const prompt = `You are an expert AIBE law exam coach. A student has identified the following weak subjects based on their test performance:

WEAK SUBJECTS:
${subjectsList}

Based on these weak areas, provide SPECIFIC, ACTIONABLE recommendations for improvement. Focus on:
1. Why these subjects are important for AIBE
2. Specific topics/concepts within each subject that need focus
3. The most effective study approach for each weak subject
4. Key bare acts and sections to review
5. Types of practice questions that will help

Keep the response concise (2-3 sentences), specific, and directly actionable. Use technical legal terminology appropriate for AIBE preparation.`

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
    console.error("Gemini API error:", response.status, error)
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  return analysis
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
    const requestData: AnalysisRequest = await req.json()

    // Generate analysis using Gemini
    const analysis = await analyzeWeakSubjectsWithGemini(requestData.weakSubjects)

    if (!analysis) {
      return new Response(
        JSON.stringify({ error: "Failed to generate analysis" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
    }

    return new Response(
      JSON.stringify({
        analysis,
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
