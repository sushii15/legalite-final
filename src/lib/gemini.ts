import { supabaseAdmin } from './supabase'

interface Question {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: string
  subject: string
  explanation?: string
}

export async function generateExplanationWithGemini(question: Question): Promise<string> {
  try {
    // Get the Supabase URL for the Edge Function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL not configured')
    }

    const functionUrl = `${supabaseUrl}/functions/v1/generate-explanation`

    // Call the Edge Function
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId: question.id,
        questionText: question.question_text,
        optionA: question.option_a,
        optionB: question.option_b,
        optionC: question.option_c,
        optionD: question.option_d,
        correctOption: question.correct_option,
        subject: question.subject,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Gemini API error:', error)
      throw new Error(error.error || 'Failed to generate explanation')
    }

    const data = await response.json()
    return data.explanation
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    throw error
  }
}

// Fallback explanation generator if API fails
export function generateFallbackExplanation(question: Question): string {
  const correctLetter = question.correct_option
  const optionMap: Record<string, string> = {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d,
  }
  const correctOption = optionMap[correctLetter] || correctLetter

  return `The correct answer is ${correctLetter}: "${correctOption}". This answer best aligns with the legal principles established in ${question.subject}. Review the question text and relevant laws to understand the reasoning.`
}

export async function getOrGenerateExplanation(question: Question, forceRegenerate = false): Promise<string> {
  // If explanation exists and we're not forcing regeneration, use it
  if (question.explanation && !forceRegenerate) {
    return question.explanation
  }

  try {
    // Try to generate with Gemini
    const newExplanation = await generateExplanationWithGemini(question)
    return newExplanation
  } catch (error) {
    console.warn('Gemini API failed, using fallback:', error)
    // Fall back to a basic explanation
    return generateFallbackExplanation(question)
  }
}

// Interface for test analysis
interface QuestionPerformance {
  questionId: number
  subject: string
  selectedOption: string | null
  correctOption: string
  isCorrect: boolean
}

interface TestAnalysisInput {
  paperId: number
  score: number
  totalQuestions: number
  durationMinutes: number
  questionPerformance: QuestionPerformance[]
}

export async function generateDetailedTestReport(testData: TestAnalysisInput): Promise<string> {
  try {
    // Get the Supabase URL for the Edge Function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL not configured')
    }

    const functionUrl = `${supabaseUrl}/functions/v1/generate-test-report`

    // Call the Edge Function
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paperId: testData.paperId,
        score: testData.score,
        totalQuestions: testData.totalQuestions,
        durationMinutes: testData.durationMinutes,
        questionPerformance: testData.questionPerformance,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Test Report API error:', response.status, error)
      throw new Error(error.error || `Failed to generate report (${response.status})`)
    }

    const data = await response.json()
    console.log('Test report generated:', data)
    return data.report || 'Report generation returned empty. Please try again.'
  } catch (error) {
    console.error('Error generating test report:', error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    return `Unable to generate report at this time. Please try again later.`
  }
}

// Bare Act References
export interface BareActReference {
  name: string
  section: string
  relevance: string
  explanation: string
}

export interface BareActReferenceResponse {
  bareActReferences: BareActReference[]
  detailedReport: string
  generatedAt: string
}

export async function generateBareActReferences(question: Question): Promise<BareActReferenceResponse> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL not configured')
    }

    const functionUrl = `${supabaseUrl}/functions/v1/generate-bare-act-references`

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId: question.id,
        questionText: question.question_text,
        optionA: question.option_a,
        optionB: question.option_b,
        optionC: question.option_c,
        optionD: question.option_d,
        correctOption: question.correct_option,
        subject: question.subject,
        explanation: question.explanation,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Bare Act References API error:', response.status, error)
      throw new Error(error.error || `Failed to generate references (${response.status})`)
    }

    const data = await response.json()
    return data as BareActReferenceResponse
  } catch (error) {
    console.error('Error generating bare act references:', error)
    throw error
  }
}

// Weak Subjects Analysis
interface SubjectPerformance {
  name: string
  percent: number
  correct: number
  total: number
}

export async function analyzeWeakSubjects(weakSubjects: SubjectPerformance[]): Promise<string> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL not configured')
    }

    const functionUrl = `${supabaseUrl}/functions/v1/analyze-weak-subjects`

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        weakSubjects: weakSubjects,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Weak Subjects Analysis API error:', response.status, error)
      throw new Error(error.error || 'Failed to analyze weak subjects')
    }

    const data = await response.json()
    return data.analysis || 'Unable to generate analysis'
  } catch (error) {
    console.error('Error analyzing weak subjects:', error)
    // Return a fallback message instead of throwing
    return 'Focus on the subjects where you scored lowest. Review the explanations and practice similar questions to improve.'
  }
}
