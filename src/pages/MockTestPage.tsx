import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TestInterface } from '@/components/TestInterface'
import { Question } from '@/components/QuestionCard'
import { supabase, supabaseAdmin } from '@/lib/supabase'

interface MockTestPageProps {
  user: any
  userPlan: 'free' | 'paid' | 'premium'
}

export function MockTestPage({ user, userPlan }: MockTestPageProps) {
  const { mockId } = useParams<{ mockId: string }>()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [mockIdNum, setMockIdNum] = useState<number>(0)
  const [attemptId, setAttemptId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadTest = async () => {
      try {
        if (!mockId) {
          setError('Mock test not found')
          return
        }

        // mockId is the mock test ID number (1, 2, 3, etc.)
        const mockIdNum = parseInt(mockId)

        // Fetch mock test from Supabase
        const { data: mockTests, error: mockError } = await supabaseAdmin
          .from('mock_tests')
          .select('id')
          .eq('id', mockIdNum)
          .limit(1)

        if (mockError || !mockTests || mockTests.length === 0) {
          setError('Mock test not found in database')
          return
        }

        const mockId_num = mockTests[0].id
        setMockIdNum(mockId_num)

        // Fetch questions from Supabase
        console.log('Fetching questions for mock_id:', mockId_num)
        const { data: questionsData, error: questionsError } = await supabaseAdmin
          .from('mock_test_questions')
          .select('id,mock_test_id,question_number,question_text,option_a,option_b,option_c,option_d,correct_option,subject,explanation,bare_act_pages')
          .eq('mock_test_id', mockId_num)
          .order('question_number', { ascending: true })

        console.log('Questions query result:', { questionsError, questionsDataLength: questionsData?.length, questionsData })

        if (questionsError) {
          console.error('Error fetching questions:', questionsError)
          setError(`Failed to load questions: ${questionsError.message}`)
          return
        }

        if (!questionsData || questionsData.length === 0) {
          console.warn('No questions found for mock_id:', mockId_num)
          setError('No questions found for this mock test')
          return
        }

        const mockQuestions = questionsData.map((q, idx) => {
          const { id: _dbId, ...questionWithoutId } = q
          return {
            id: idx,
            ...questionWithoutId,
          } as Question
        })

        setQuestions(mockQuestions)

        // Create attempt ID for this mock test
        const mockAttemptId = `mock-attempt-${Date.now()}`
        setAttemptId(mockAttemptId)

        setLoading(false)
      } catch (err) {
        console.error('Error loading mock test:', err)
        setError('Failed to load mock test. Please try again.')
        setLoading(false)
      }
    }

    loadTest()
  }, [user, mockId, navigate])

  const handleSubmit = async (answers: Record<number, string | null>, markedForReview: Set<number>) => {
    try {
      // Calculate score
      let correctCount = 0
      for (const [questionId, selectedOption] of Object.entries(answers)) {
        if (selectedOption === null || selectedOption === undefined) continue

        const question = questions.find((q) => q.id === parseInt(questionId))
        if (question && selectedOption === question.correct_option) {
          correctCount++
        }
      }

      const score = Math.round((correctCount / questions.length) * 100)

      // Store mock test session data in sessionStorage for review page
      sessionStorage.setItem(
        `mock-${attemptId}`,
        JSON.stringify({
          answers: answers,
          markedForReview: Array.from(markedForReview),
          mockId: mockIdNum,
          score: score,
          totalQuestions: questions.length,
          completedAt: new Date().toISOString(),
        })
      )

      // TODO: In Phase 2+, save to Supabase attempts table with:
      // - user_id
      // - mock_test_id
      // - completed_at
      // - duration_minutes
      // - score
      // - status: 'completed'

      // TODO: Save answers to Supabase answers table

      // Redirect to review page
      navigate(`/mock-review/${attemptId}`)
    } catch (err) {
      console.error('Error submitting mock test:', err)
      alert('Failed to submit mock test. Please try again.')
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <p>Loading mock test...</p>
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

  return <TestInterface questions={questions} paperId={mockIdNum} attemptId={attemptId} onSubmit={handleSubmit} isMockTest={true} />
}
