import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface TestReportRequest {
  paperId: number
  score: number
  totalQuestions: number
  durationMinutes: number
  questionPerformance: Array<{
    questionId: number
    subject: string
    selectedOption: string | null
    correctOption: string
    isCorrect: boolean
  }>
}

async function generateTestReportWithGemini(
  paperId: number,
  score: number,
  totalQuestions: number,
  durationMinutes: number,
  questionPerformance: Array<{
    questionId: number
    subject: string
    selectedOption: string | null
    correctOption: string
    isCorrect: boolean
  }>
): Promise<string> {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY")
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY not configured")
  }

  // Calculate metrics
  const correctQuestions = questionPerformance.filter(q => q.isCorrect)
  const incorrectQuestions = questionPerformance.filter(q => !q.isCorrect)

  // Calculate subject-wise performance
  const subjectMap = new Map<string, { correct: number; total: number }>()
  for (const q of questionPerformance) {
    if (!subjectMap.has(q.subject)) {
      subjectMap.set(q.subject, { correct: 0, total: 0 })
    }
    const stats = subjectMap.get(q.subject)!
    stats.total += 1
    if (q.isCorrect) stats.correct += 1
  }

  // Build subject breakdown
  const subjectBreakdown = Array.from(subjectMap.entries())
    .map(([subject, stats]) => `${subject}: ${stats.correct}/${stats.total} (${Math.round((stats.correct/stats.total)*100)}%)`)
    .join('\n')

  // Top incorrect questions
  const topIncorrect = incorrectQuestions
    .slice(0, 5)
    .map((q, i) => `${i+1}. ${q.subject}: You answered ${q.selectedOption || 'blank'}, Correct was ${q.correctOption}`)
    .join('\n')

  const prompt = `You are an expert AIBE law exam coach analyzing a student's test performance. Provide a DETAILED, SPECIFIC, and ACTIONABLE report.

TEST PERFORMANCE DATA:
- Paper: AIBE ${paperId}
- Score: ${score}% (${correctQuestions.length}/${totalQuestions} correct)
- Time Taken: ${durationMinutes} minutes (Legal exam = 210 minutes standard)
- Accuracy Rate: ${Math.round((correctQuestions.length / totalQuestions) * 100)}%

SUBJECT-WISE PERFORMANCE BREAKDOWN:
${subjectBreakdown}

TOP 5 QUESTIONS YOU GOT WRONG:
${topIncorrect}

DETAILED ANALYSIS REQUIRED:
1. **Overall Performance Assessment**
   - How is this score performing relative to AIBE standards?
   - Is the time management appropriate?

2. **Subject-Specific Strengths** (areas scoring 70%+)
   - Which subjects show mastery?
   - Why are these subjects stronger?

3. **Subject-Specific Weaknesses** (areas scoring below 60%)
   - Which subjects need urgent attention?
   - What specific topics/concepts within these subjects are weak?
   - Which bare acts need review?

4. **Error Pattern Analysis**
   - Are the wrong answers due to: conceptual gaps, careless mistakes, time pressure, or lack of bare act familiarity?
   - What's the common theme in your mistakes?

5. **Detailed Recommendations** (be VERY SPECIFIC)
   - Top 3 subjects to focus on in next 7 days
   - Specific bare acts/sections to review
   - Types of questions to practice
   - Time management improvements

6. **Day-by-Day Study Plan**
   - Monday-Friday: Which subjects to focus each day?
   - Saturday: Revision day - which concepts to review?
   - Sunday: Practice test - which papers to retake?

7. **Critical Next Steps**
   - Immediate action items (today/tomorrow)
   - Short-term goals (next week)
   - Progress checkpoints

Keep response detailed, specific, and directly actionable. Use technical legal terminology. Focus heavily on WHICH topics need work, not just THAT they need work.`

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
        maxOutputTokens: 2000,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("Gemini API error:", response.status, error)
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const report = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
  return report
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
    const requestData: TestReportRequest = await req.json()

    // Generate report using Gemini
    const report = await generateTestReportWithGemini(
      requestData.paperId,
      requestData.score,
      requestData.totalQuestions,
      requestData.durationMinutes,
      requestData.questionPerformance
    )

    if (!report) {
      return new Response(
        JSON.stringify({ error: "Failed to generate test report" }),
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
        report,
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
