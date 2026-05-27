import { useState, useEffect } from 'react'
import { Timer } from './Timer'
import { ProgressBar } from './ProgressBar'
import { QuestionCard, type Question } from './QuestionCard'

interface TestInterfaceProps {
  questions: Question[]
  paperId: number
  attemptId: string
  onSubmit: (answers: Record<number, string | null>, markedForReview: Set<number>) => void
  isMockTest?: boolean
}

export function TestInterface({ questions, paperId, attemptId, onSubmit, isMockTest = false }: TestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | null>>({})
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set())
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [startTime] = useState(Date.now()) // Track when test started

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = Object.values(answers).filter((a) => a !== null && a !== undefined).length

  // Update companion mode progress periodically
  useEffect(() => {
    const updateProgress = () => {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
      const correctCount = Object.entries(answers).filter(
        ([idx, selected]) =>
          selected === questions[parseInt(idx)]?.correct_option
      ).length

      const progressData = {
        timeElapsed,
        questionsCompleted: answeredCount,
        totalQuestions: questions.length,
        score: questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0,
        lastUpdated: Date.now(),
      }

      try {
        localStorage.setItem(`test-progress-${attemptId}`, JSON.stringify(progressData))
      } catch (e) {
        console.warn('Could not update progress in localStorage:', e)
      }
    }

    // Update immediately and then every second
    updateProgress()
    const interval = setInterval(updateProgress, 1000)

    return () => clearInterval(interval)
  }, [answers, answeredCount, startTime, attemptId, questions])

  const handleOptionSelect = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }))
  }

  const handleMarkForReview = (marked: boolean) => {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev)
      if (marked) {
        newSet.add(currentQuestion.id)
      } else {
        newSet.delete(currentQuestion.id)
      }
      return newSet
    })
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmit = async () => {
    onSubmit(answers, markedForReview)
    setShowSubmitConfirm(false)
  }

  const handleTimeUp = () => {
    // Auto-submit when time is up
    onSubmit(answers, markedForReview)
  }

  return (
    <div className="test-interface" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="test-interface__header">
        <Timer durationMinutes={210} onTimeUp={handleTimeUp} />
        <div className="test-interface__paper-info">
          {isMockTest ? `AI Mock Test ${paperId}` : `AIBE ${paperId}`}
        </div>
      </div>

      <div className="test-interface__content" style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div className="test-interface__main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ProgressBar current={answeredCount} total={questions.length} />

          <div className="test-interface__question-wrapper" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <QuestionCard
              question={currentQuestion}
              selectedOption={answers[currentQuestion.id] || null}
              markedForReview={markedForReview.has(currentQuestion.id)}
              onOptionSelect={handleOptionSelect}
              onMarkForReview={handleMarkForReview}
            />
          </div>

          <div className="test-interface__navigation" style={{ position: 'sticky', bottom: 0, background: 'var(--bg)', paddingTop: '16px', paddingBottom: '16px', borderTop: '1px solid var(--line)' }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn btn--outline"
            >
              ← Previous
            </button>

            <div className="test-interface__question-counter">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>

            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className="btn btn--outline"
            >
              Next →
            </button>
          </div>

          <button onClick={() => setShowSubmitConfirm(true)} className="btn btn--primary" style={{ position: 'sticky', bottom: 0 }}>
            Submit Test
          </button>
        </div>

        <div className="test-interface__sidebar">
          <div className="test-interface__sidebar-header">Questions</div>
          <div className="test-interface__question-grid">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== null && answers[q.id] !== undefined
              const isMarked = markedForReview.has(q.id)
              const isCurrent = idx === currentQuestionIndex
              const isUnanswered = !isAnswered && !isCurrent

              return (
                <button
                  key={q.id}
                  onClick={() => handleJumpToQuestion(idx)}
                  className={`test-interface__question-btn ${isCurrent ? 'test-interface__question-btn--active' : ''} ${
                    isAnswered ? 'test-interface__question-btn--answered' : ''
                  } ${isUnanswered ? 'test-interface__question-btn--unanswered' : ''} ${isMarked ? 'test-interface__question-btn--marked' : ''}`}
                  title={`Q${q.question_number}${isMarked ? ' (marked for review)' : ''}`}
                >
                  {q.question_number}
                </button>
              )
            })}
          </div>

          <div className="test-interface__legend">
            <div className="test-interface__legend-item">
              <span className="test-interface__legend-dot test-interface__legend-dot--current" />
              <span>Current</span>
            </div>
            <div className="test-interface__legend-item">
              <span className="test-interface__legend-dot test-interface__legend-dot--unanswered" />
              <span>Unanswered</span>
            </div>
            <div className="test-interface__legend-item">
              <span className="test-interface__legend-dot test-interface__legend-dot--answered" />
              <span>Answered</span>
            </div>
            <div className="test-interface__legend-item">
              <span className="test-interface__legend-dot test-interface__legend-dot--marked" />
              <span>Marked</span>
            </div>
          </div>
        </div>
      </div>

      {showSubmitConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal__title">Submit Test?</h3>
            <p className="modal__text">
              You have answered {answeredCount} out of {questions.length} questions. Are you sure you want to submit?
            </p>
            <div className="modal__actions">
              <button onClick={() => setShowSubmitConfirm(false)} className="btn btn--outline">
                Continue Test
              </button>
              <button onClick={handleSubmit} className="btn btn--primary">
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
