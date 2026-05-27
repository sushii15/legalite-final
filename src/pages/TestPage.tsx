import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TestInterface } from '@/components/TestInterface'
import { Question } from '@/components/QuestionCard'
import { supabase, supabaseAdmin } from '@/lib/supabase'

interface TestPageProps {
  user: any
  userPlan: 'free' | 'paid' | 'premium'
}

export function TestPage({ user, userPlan }: TestPageProps) {
  const { paperId } = useParams<{ paperId: string }>()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [paperIdNum, setPaperIdNum] = useState<number>(0)
  const [attemptId, setAttemptId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [startTime] = useState<number>(Date.now())

  useEffect(() => {
    const loadTest = async () => {
      try {
        if (!paperId) {
          setError('Paper not found')
          return
        }

        // paperId is the AIBE number (20, 19, 18, etc.)
        const aibeNum = parseInt(paperId)

        // Fetch paper from Supabase
        // TODO: TEMP - Using supabaseAdmin until RLS policies are set up on remote database
        const { data: papers, error: paperError } = await supabaseAdmin
          .from('papers')
          .select('id')
          .eq('aibe_id', aibeNum)
          .limit(1)

        if (paperError || !papers || papers.length === 0) {
          setError('Paper not found in database')
          return
        }

        const paperId_num = papers[0].id
        setPaperIdNum(paperId_num)

        // Fetch questions from Supabase
        console.log('Fetching questions for paper_id:', paperId_num)
        // TODO: TEMP - Using supabaseAdmin until RLS policies are set up on remote database
        const { data: questionsData, error: questionsError } = await supabaseAdmin
          .from('questions')
          .select('id,paper_id,question_number,question_text,option_a,option_b,option_c,option_d,correct_option,subject,explanation,bare_act_pages')
          .eq('paper_id', paperId_num)
          .order('question_number', { ascending: true })

        console.log('Questions query result:', { questionsError, questionsDataLength: questionsData?.length, questionsData })

        if (questionsError) {
          console.error('Error fetching questions:', questionsError)
          setError(`Failed to load questions: ${questionsError.message}`)
          return
        }

        if (!questionsData || questionsData.length === 0) {
          console.warn('No questions found for paper_id:', paperId_num)
          setError('No questions found for this paper - RLS policies may be blocking access')
          return
        }

        const paperQuestions = questionsData.map((q, idx) => {
          const { id: _dbId, ...questionWithoutId } = q
          return {
            id: idx,
            ...questionWithoutId,
          } as Question
        })

        setQuestions(paperQuestions)

        // TODO: Create attempt in Supabase
        const mockAttemptId = `attempt-${Date.now()}`
        setAttemptId(mockAttemptId)

        setLoading(false)
      } catch (err) {
        console.error('Error loading test:', err)
        setError('Failed to load test. Please try again.')
        setLoading(false)
      }
    }

    loadTest()
  }, [user, paperId, navigate])

  const handleSubmit = async (answers: Record<number, string | null>, markedForReview: Set<number>) => {
    try {
      // Calculate score and build question performance data
      let correctCount = 0
      const questionPerformance: Array<{
        questionId: number
        subject: string
        selectedOption: string | null
        correctOption: string
        isCorrect: boolean
      }> = []

      for (const [questionId, selectedOption] of Object.entries(answers)) {
        const qId = parseInt(questionId)
        const question = questions.find((q) => q.id === qId)
        if (!question) continue

        const isCorrect = selectedOption !== null && selectedOption !== undefined && selectedOption === question.correct_option
        if (isCorrect) correctCount++

        questionPerformance.push({
          questionId: qId,
          subject: question.subject || 'Other',
          selectedOption: selectedOption || null,
          correctOption: question.correct_option,
          isCorrect
        })
      }

      const score = Math.round((correctCount / questions.length) * 100)
      const durationMinutes = Math.round((Date.now() - startTime) / 60000)

      // Store test session data in sessionStorage for review page
      sessionStorage.setItem(
        `test-${attemptId}`,
        JSON.stringify({
          answers: answers,
          markedForReview: Array.from(markedForReview),
          paperId: paperIdNum,
          aibeNumber: parseInt(paperId!),
          score: score,
          totalQuestions: questions.length,
          completedAt: new Date().toISOString(),
          durationMinutes: durationMinutes,
          questionPerformance: questionPerformance,
        })
      )

      // TODO: In Phase 2+, save to Supabase attempts table with:
      // - user_id
      // - paper_id
      // - completed_at
      // - duration_minutes
      // - score
      // - status: 'completed'

      // TODO: Save answers to Supabase answers table

      // Redirect to review page
      navigate(`/review/${attemptId}`)
    } catch (err) {
      console.error('Error submitting test:', err)
      alert('Failed to submit test. Please try again.')
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <p>Loading test...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    )
  }

  return <TestInterface questions={questions} paperId={parseInt(paperId!)} attemptId={attemptId} onSubmit={handleSubmit} />
}
