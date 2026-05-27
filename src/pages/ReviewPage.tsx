import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabaseAdmin } from '@/lib/supabase'
import { Question } from '@/components/QuestionCard'

interface ReviewPageProps {
  user: any
  userPlan: 'free' | 'paid' | 'premium'
}

interface ReviewQuestion extends Question {
  selectedOption: string | null
  isCorrect: boolean
}

export function ReviewPage({ user, userPlan }: ReviewPageProps) {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<ReviewQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [isMockTest, setIsMockTest] = useState(false)

  useEffect(() => {
    const loadReview = async () => {
      try {
        if (!attemptId) {
          setError('Invalid attempt')
          return
        }

        // Check if this is a mock test or regular paper
        let sessionData = sessionStorage.getItem(`mock-${attemptId}`)
        let isMock = true

        if (!sessionData) {
          sessionData = sessionStorage.getItem(`test-${attemptId}`)
          isMock = false
        }

        if (!sessionData) {
          setError('Test session not found. Please take the test again.')
          return
        }

        const { answers, paperId, mockId } = JSON.parse(sessionData)
        setIsMockTest(isMock)

        // Fetch questions based on test type
        let questionsData, questionsError

        if (isMock) {
          const response = await supabaseAdmin
            .from('mock_test_questions')
            .select('*')
            .eq('mock_test_id', mockId)
            .order('question_number', { ascending: true })
          questionsData = response.data
          questionsError = response.error
        } else {
          const response = await supabaseAdmin
            .from('questions')
            .select('*')
            .eq('paper_id', paperId)
            .order('question_number', { ascending: true })
          questionsData = response.data
          questionsError = response.error
        }

        if (questionsError || !questionsData) {
          setError('Failed to load questions')
          return
        }

        // Build review data with user's answers
        let correctCount = 0
        const reviewQuestions = questionsData.map((q, idx) => {
          const selectedOption = answers[idx] || null
          const isCorrect = selectedOption === q.correct_option
          if (isCorrect) correctCount++

          return {
            id: idx,
            ...q,
            selectedOption,
            isCorrect,
          } as ReviewQuestion
        })

        setQuestions(reviewQuestions)
        setTotalQuestions(reviewQuestions.length)
        setScore(Math.round((correctCount / reviewQuestions.length) * 100))
        setLoading(false)
      } catch (err) {
        console.error('Error loading review:', err)
        setError('Failed to load review. Please try again.')
        setLoading(false)
      }
    }

    loadReview()
  }, [attemptId])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <p>Loading review...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
          <button onClick={() => navigate(isMockTest ? '/dashboard' : '/test/20')} style={{ padding: '10px 20px' }}>
            {isMockTest ? 'Back to Dashboard' : 'Take Test Again'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Test Review</h1>
        <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>{score}%</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Your Score</div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {questions.filter(q => q.isCorrect).length}/{totalQuestions}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Correct Answers</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {questions.map((question, idx) => (
          <ReviewQuestionCard
            key={idx}
            question={question}
            questionNumber={idx + 1}
            canViewBareAct={userPlan !== 'free'}
          />
        ))}
      </div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px' }}>
          Back to Dashboard
        </button>
        {!isMockTest && (
          <button onClick={() => navigate('/test/19')} style={{ padding: '10px 20px', marginLeft: '10px' }}>
            Try Next Paper
          </button>
        )}
      </div>
    </div>
  )
}

import { getOrGenerateExplanation, generateBareActReferences, BareActReference, BareActReferenceResponse } from '@/lib/gemini'

interface ReviewQuestionCardProps {
  question: ReviewQuestion
  questionNumber: number
  canViewBareAct: boolean
}

function ReviewQuestionCard({ question, questionNumber, canViewBareAct }: ReviewQuestionCardProps) {
  const [explanation, setExplanation] = useState(question.explanation || '')
  const [generatingExplanation, setGeneratingExplanation] = useState(false)
  const [explanationError, setExplanationError] = useState<string>('')
  const [bareActReferences, setBareActReferences] = useState<BareActReference[]>([])
  const [detailedReport, setDetailedReport] = useState<string>('')
  const [generatingBareAct, setGeneratingBareAct] = useState(false)
  const [bareActError, setBareActError] = useState<string>('')
  const [showDetailedReport, setShowDetailedReport] = useState(false)

  const getOptionLabel = (key: string) => {
    const labelMap = { option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D' }
    return labelMap[key as keyof typeof labelMap] || ''
  }

  const getOptionText = (key: string) => {
    return question[key as keyof typeof question] as string
  }

  const handleGenerateExplanation = async () => {
    setGeneratingExplanation(true)
    setExplanationError('')
    try {
      const newExplanation = await getOrGenerateExplanation(question as any, true)
      setExplanation(newExplanation)
    } catch (error) {
      setExplanationError('Failed to generate explanation. Please try again.')
      console.error('Error generating explanation:', error)
    } finally {
      setGeneratingExplanation(false)
    }
  }

  const handleGenerateBareActReferences = async () => {
    setGeneratingBareAct(true)
    setBareActError('')
    try {
      const response = await generateBareActReferences(question as any)
      setBareActReferences(response.bareActReferences)
      setDetailedReport(response.detailedReport)
    } catch (error) {
      setBareActError('Failed to generate bare act references. Please try again.')
      console.error('Error generating bare act references:', error)
    } finally {
      setGeneratingBareAct(false)
    }
  }

  const options = ['option_a', 'option_b', 'option_c', 'option_d']

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: question.selectedOption
          ? (question.isCorrect ? '#f0f8f0' : '#f8f0f0')
          : '#FFF3E0',
      }}
    >
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>
          Question {questionNumber} <span style={{ color: '#999', fontSize: '12px' }}>({question.subject})</span>
        </h3>
        <p style={{ fontSize: '14px', marginBottom: '15px' }}>{question.question_text}</p>
      </div>

      <div style={{ marginBottom: '15px' }}>
        {question.selectedOption === null && (
          <div
            style={{
              padding: '12px',
              marginBottom: '12px',
              borderRadius: '4px',
              backgroundColor: '#FFF3E0',
              border: '1px solid #FF9800',
              color: '#E65100',
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            ⚠️ Question not answered
          </div>
        )}
        {options.map((optionKey) => {
          const label = getOptionLabel(optionKey)
          const text = getOptionText(optionKey)
          const isSelected = question.selectedOption === label
          const isCorrectAnswer = question.correct_option === label

          return (
            <div
              key={optionKey}
              style={{
                padding: '10px',
                marginBottom: '8px',
                borderRadius: '4px',
                backgroundColor: isCorrectAnswer
                  ? '#e8f5e9'
                  : isSelected && !isCorrectAnswer
                    ? '#ffebee'
                    : 'white',
                border: `1px solid ${
                  isCorrectAnswer ? '#4CAF50' : isSelected && !isCorrectAnswer ? '#f44336' : '#ddd'
                }`,
              }}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: isCorrectAnswer ? '#4CAF50' : isSelected && !isCorrectAnswer ? '#f44336' : '#666',
                  }}
                >
                  {label}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>{text}</p>
                  {isCorrectAnswer && (
                    <span style={{ fontSize: '12px', color: '#4CAF50', fontWeight: 'bold' }}>✓ Correct</span>
                  )}
                  {isSelected && !isCorrectAnswer && (
                    <span style={{ fontSize: '12px', color: '#f44336', fontWeight: 'bold' }}>✗ Your answer</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <div style={{ fontSize: '13px', marginBottom: '10px' }}>
          <strong>Explanation:</strong> {explanation || 'No explanation available'}
        </div>

        {!question.isCorrect && !explanation && (
          <button
            onClick={handleGenerateExplanation}
            disabled={generatingExplanation}
            style={{
              marginTop: '10px',
              padding: '8px 12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: generatingExplanation ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              opacity: generatingExplanation ? 0.6 : 1,
            }}
          >
            {generatingExplanation ? 'Generating...' : 'Generate AI Explanation'}
          </button>
        )}

        {generatingExplanation && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            ⏳ Generating explanation with AI...
          </div>
        )}

        {explanationError && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#f44336' }}>
            ❌ {explanationError}
            <button
              onClick={handleGenerateExplanation}
              style={{
                marginLeft: '10px',
                padding: '4px 8px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {canViewBareAct ? (
          <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            <strong>📖 Bare Act References:</strong>
            {bareActReferences.length > 0 ? (
              <div style={{ marginTop: '10px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
                {bareActReferences.map((ref, idx) => (
                  <div key={idx} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: idx < bareActReferences.length - 1 ? '1px solid #eee' : 'none' }}>
                    <div style={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '4px' }}>
                      📚 {ref.name} — {ref.section}
                    </div>
                    <div style={{ marginBottom: '4px', color: '#555' }}>
                      <strong>Relevance:</strong> {ref.relevance}
                    </div>
                    <div style={{ color: '#666', lineHeight: '1.5' }}>
                      {ref.explanation}
                    </div>
                  </div>
                ))}
                {detailedReport && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #ddd' }}>
                    <button
                      onClick={() => setShowDetailedReport(!showDetailedReport)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#4CAF50',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: 0,
                        textDecoration: 'underline',
                      }}
                    >
                      {showDetailedReport ? '▼ Hide Detailed Analysis' : '▶ Show Detailed Analysis'}
                    </button>
                    {showDetailedReport && (
                      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', lineHeight: '1.6', color: '#555' }}>
                        {detailedReport}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleGenerateBareActReferences}
                disabled={generatingBareAct}
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: generatingBareAct ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  opacity: generatingBareAct ? 0.6 : 1,
                }}
              >
                {generatingBareAct ? '⏳ Generating References...' : '📖 Generate Bare Act References'}
              </button>
            )}
            {bareActError && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#f44336' }}>
                ❌ {bareActError}
                <button
                  onClick={handleGenerateBareActReferences}
                  style={{
                    marginLeft: '10px',
                    padding: '4px 8px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
