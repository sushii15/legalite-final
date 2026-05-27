import { useState, useEffect } from 'react'

interface CompanionModeProps {
  attemptId: string
}

interface AttemptProgress {
  timeElapsed: number // seconds
  questionsCompleted: number
  totalQuestions: number
  score: number
}

export function CompanionMode({ attemptId }: CompanionModeProps) {
  const [progress, setProgress] = useState<AttemptProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [pollCount, setPollCount] = useState(0)

  // Calculate target question based on pace
  const getTargetQuestion = (timeElapsed: number): number => {
    const totalDurationSeconds = 210 * 60 // 210 minutes
    const targetQuestion = Math.round((timeElapsed / totalDurationSeconds) * 100)
    return Math.max(1, Math.min(100, targetQuestion))
  }

  // Determine pace status
  const getPaceStatus = (
    currentQuestion: number,
    targetQuestion: number
  ): { status: string; color: string; emoji: string } => {
    const diff = currentQuestion - targetQuestion
    if (diff > 5) {
      return { status: '⚡ Ahead of pace', color: '#4CAF50', emoji: '✓' }
    } else if (diff < -5) {
      return { status: '⏱️ Behind pace', color: '#f44336', emoji: '⚠️' }
    } else {
      return { status: '✓ On pace', color: '#2196F3', emoji: '→' }
    }
  }

  // Fetch progress from test session data
  const fetchProgress = () => {
    try {
      // Try to get data from localStorage (populated by TestInterface)
      const sessionDataStr = localStorage.getItem(`test-progress-${attemptId}`)

      if (sessionDataStr) {
        const sessionData = JSON.parse(sessionDataStr)
        setProgress({
          timeElapsed: sessionData.timeElapsed || 0,
          questionsCompleted: sessionData.questionsCompleted || 0,
          totalQuestions: sessionData.totalQuestions || 100,
          score: sessionData.score || 0,
        })
        setError('')
        setLoading(false)
      } else {
        // No data yet - test might not have started or data structure is different
        if (pollCount === 0) {
          setLoading(true)
        }
      }
    } catch (err) {
      console.error('Error fetching progress:', err)
      if (pollCount === 0) {
        setError('Unable to connect to test session')
      }
    }
  }

  // Set up polling
  useEffect(() => {
    fetchProgress()
    setPollCount((c) => c + 1)

    const interval = setInterval(() => {
      fetchProgress()
      setPollCount((c) => c + 1)
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [attemptId])

  if (loading && !progress) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Waiting for test session to start...</p>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
          Polling in progress... {pollCount} checks
        </p>
      </div>
    )
  }

  if (error && !progress) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#f44336' }}>
        <p>{error}</p>
      </div>
    )
  }

  if (!progress) {
    return null
  }

  // Calculate metrics
  const timeMinutes = Math.floor(progress.timeElapsed / 60)
  const timeSeconds = progress.timeElapsed % 60
  const timePercentage = (progress.timeElapsed / (210 * 60)) * 100
  const targetQuestion = getTargetQuestion(progress.timeElapsed)
  const currentQuestion = progress.questionsCompleted
  const paceStatus = getPaceStatus(currentQuestion, targetQuestion)
  const questionsPercentage = (progress.questionsCompleted / progress.totalQuestions) * 100

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Time Card */}
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Time Elapsed</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2196F3', fontFamily: 'monospace' }}>
            {String(timeMinutes).padStart(2, '0')}:{String(timeSeconds).padStart(2, '0')}
          </div>
        </div>
        <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              backgroundColor: '#2196F3',
              width: `${Math.min(timePercentage, 100)}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <div style={{ fontSize: '11px', color: '#999', marginTop: '5px', textAlign: 'right' }}>
          {Math.round(timePercentage)}% of 210 minutes
        </div>
      </div>

      {/* Questions Card */}
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Questions Completed</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50' }}>
            {progress.questionsCompleted}/{progress.totalQuestions}
          </div>
        </div>
        <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              backgroundColor: '#4CAF50',
              width: `${questionsPercentage}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <div style={{ fontSize: '11px', color: '#999', marginTop: '5px', textAlign: 'right' }}>
          {Math.round(questionsPercentage)}% complete
        </div>
      </div>

      {/* Pace Card */}
      <div
        style={{
          border: `2px solid ${paceStatus.color}`,
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Pace Status</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: paceStatus.color }}>
            {paceStatus.status}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#999', marginBottom: '5px' }}>Current Position</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2196F3' }}>Q{currentQuestion}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#999', marginBottom: '5px' }}>Target Position</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#999' }}>Q{targetQuestion}</div>
          </div>
        </div>
        {Math.abs(currentQuestion - targetQuestion) > 0 && (
          <div
            style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: paceStatus.color + '15',
              borderRadius: '4px',
              fontSize: '12px',
              color: paceStatus.color,
            }}
          >
            {currentQuestion > targetQuestion
              ? `🚀 You're ${currentQuestion - targetQuestion} questions ahead! Slow down or you'll finish early.`
              : `⏱️ You're ${targetQuestion - currentQuestion} questions behind. Pick up the pace!`}
          </div>
        )}
      </div>

      {/* Score Card */}
      {progress.score > 0 && (
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>Current Score Estimate</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>{progress.score}%</div>
        </div>
      )}

      {/* Info */}
      <div style={{ fontSize: '11px', color: '#999', textAlign: 'center', padding: '10px' }}>
        ↻ Updates every 5 seconds
      </div>
    </div>
  )
}
