import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { QuickStats } from '@/components/QuickStats'
import { PaperCard } from '@/components/PaperCard'
import { MockTestCard } from '@/components/MockTestCard'
import { useUserTier } from '@/hooks/useUserTier'
import { calculateDaysUntilExam, calculateAverageScore } from '@/lib/calculations'
import { analyzeWeakSubjects } from '@/lib/gemini'
import '../styles/dashboard.css'

interface Paper {
  aibe: number
  progress: number
  attempted: boolean
  date?: string
}

interface Attempt {
  id: string
  paperId: number
  score: number
  totalQuestions: number
  durationMinutes: number
  completedAt: string
}

interface DashboardProps {
  user: any
  userPlan: 'free' | 'paid' | 'premium'
  onUpgradeClick: () => void
}

// Calculate subject performance from actual attempts
function calculateSubjectPerformance(attempts: Attempt[], visibleAibeNums: Set<number>) {
  interface SubjectStats {
    total: number
    correct: number
  }

  const subjectMap = new Map<string, SubjectStats>()

  for (const attempt of attempts) {
    // Only count attempts for visible papers
    if (!visibleAibeNums.has(attempt.paperId)) continue

    // attempt.id is already the full key like "test-attemptId"
    const data = sessionStorage.getItem(attempt.id)
    if (!data) continue

    try {
      const testData = JSON.parse(data)
      const performance = testData.questionPerformance || []

      for (const q of performance) {
        const subject = q.subject || 'Other'
        if (!subjectMap.has(subject)) {
          subjectMap.set(subject, { total: 0, correct: 0 })
        }
        const stats = subjectMap.get(subject)!
        stats.total += 1
        if (q.isCorrect) stats.correct += 1
      }
    } catch (e) {
      console.error('Error parsing attempt data:', e)
    }
  }

  // Calculate percentages and sort
  const subjects = Array.from(subjectMap.entries())
    .map(([name, stats]) => ({
      name,
      percent: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      correct: stats.correct,
      total: stats.total
    }))
    .sort((a, b) => b.percent - a.percent)

  return {
    strong: subjects.slice(0, 3), // Top 3
    weak: subjects.slice(3).reverse(), // All weak subjects (everything below top 3)
    allSubjects: subjects
  }
}

// Read all completed test attempts from sessionStorage
function readAttemptsFromStorage(): Attempt[] {
  const attempts: Attempt[] = []
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (!key || !key.startsWith('test-') || key.startsWith('test-progress-')) continue
    try {
      const data = JSON.parse(sessionStorage.getItem(key)!)
      if (data.aibeNumber && data.completedAt) {
        attempts.push({
          id: key,
          paperId: data.aibeNumber,
          score: data.score || 0,
          totalQuestions: data.totalQuestions || 100,
          durationMinutes: data.durationMinutes || 0,
          completedAt: data.completedAt,
        })
      }
    } catch {}
  }
  return attempts.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
}

// Build papers list with real progress from sessionStorage
function buildPapersFromStorage(): Paper[] {
  const attempts = readAttemptsFromStorage()
  // For each AIBE paper, find the most recent attempt
  const latestByAibe = new Map<number, Attempt>()
  for (const attempt of attempts) {
    if (!latestByAibe.has(attempt.paperId)) {
      latestByAibe.set(attempt.paperId, attempt)
    }
  }

  return Array.from({ length: 16 }, (_, i) => {
    const aibe = 20 - i
    const latest = latestByAibe.get(aibe)
    return {
      aibe,
      progress: latest ? Math.round((latest.score / latest.totalQuestions) * 100) : 0,
      attempted: !!latest,
      date: latest
        ? new Date(latest.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : undefined,
    }
  })
}

export function DashboardPage({ user, userPlan, onUpgradeClick }: DashboardProps) {
  const navigate = useNavigate()
  const { paperLimit, mockTestLimit } = useUserTier(userPlan)

  const [papers, setPapers] = useState<Paper[]>(buildPapersFromStorage)
  const [attempts, setAttempts] = useState<Attempt[]>(readAttemptsFromStorage)
  const [weakSubjectsAnalysis, setWeakSubjectsAnalysis] = useState<string>('')
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)

  // Check if free tier promotion is active
  const today = new Date()
  const promotionEnd = new Date('2026-05-30')
  const isPromotionActive = today < promotionEnd && userPlan === 'free'

  // Filter papers by tier
  const visiblePapers = papers.slice(0, paperLimit)

  // Calculate dashboard stats — only from papers visible to this tier
  const visibleAibeNums = new Set(visiblePapers.map(p => p.aibe))
  const visibleAttempts = attempts.filter(a => visibleAibeNums.has(a.paperId))
  const papersCompleted = visiblePapers.filter(p => p.attempted).length
  const averageScore = visibleAttempts.length > 0
    ? calculateAverageScore(visibleAttempts.map((a) => (a.score / a.totalQuestions) * 100))
    : 0

  // Calculate real subject performance from actual attempts
  const subjectPerformance = calculateSubjectPerformance(attempts, visibleAibeNums)
  const weakSubjectsCount = subjectPerformance.weak.length
  const weakSubjectsList = subjectPerformance.weak.map((s) => s.name)

  // Refresh from sessionStorage whenever the dashboard becomes visible
  const refresh = useCallback(() => {
    setPapers(buildPapersFromStorage())
    setAttempts(readAttemptsFromStorage())
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [refresh])

  // Generate weak subjects analysis via Gemini API
  useEffect(() => {
    const generateAnalysis = async () => {
      // Only generate if we have weak subjects and haven't already cached the analysis
      if (subjectPerformance.weak.length > 0) {
        const cacheKey = `weak-analysis-${JSON.stringify(subjectPerformance.weak.map(s => s.name).sort())}`
        const cached = sessionStorage.getItem(cacheKey)

        if (cached) {
          setWeakSubjectsAnalysis(cached)
        } else {
          setLoadingAnalysis(true)
          try {
            const analysis = await analyzeWeakSubjects(subjectPerformance.weak)
            setWeakSubjectsAnalysis(analysis)
            sessionStorage.setItem(cacheKey, analysis)
          } catch (error) {
            console.error('Error generating weak subjects analysis:', error)
            setWeakSubjectsAnalysis('Focus on the subjects where you scored lowest. Review the explanations and practice similar questions to improve.')
          } finally {
            setLoadingAnalysis(false)
          }
        }
      }
    }

    generateAnalysis()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weakSubjectsCount, weakSubjectsList.join(',')])

  // Calculate days until exam
  const daysUntilExam = user?.exam_date
    ? calculateDaysUntilExam(user.exam_date)
    : calculateDaysUntilExam('2026-06-07')

  const userName = user?.user_metadata?.full_name || 'Learner'

  const handlePaperStart = (aibe: number) => {
    navigate(`/test/${aibe}`)
  }

  const handlePaperReview = (aibe: number) => {
    navigate(`/review/${aibe}`)
  }

  const handleMockStart = (mockNumber: number) => {
    navigate(`/mock/${mockNumber}`)
  }

  const handleMockReview = (mockNumber: number) => {
    navigate(`/mock-review/${mockNumber}`)
  }

  return (
    <main>
      {/* PROMOTION BANNER */}
      {isPromotionActive && (
        <div style={{
          background: 'linear-gradient(135deg, var(--dark-tan) 0%, rgba(139, 115, 85, 0.9) 100%)',
          padding: '20px 32px',
          textAlign: 'center',
          borderBottom: '2px solid var(--accent)',
          marginBottom: '40px',
          animation: 'fadeIn 0.5s ease-in'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '8px' }}>LIMITED TIME OFFER</div>
            <h3 style={{ fontSize: '18px', color: 'var(--ink)', margin: '0 0 8px 0', fontWeight: 600 }}>
              Free access to all 20 papers & 10 mock tests
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-2)', margin: '0' }}>
              Free only until <strong>May 30, 2026</strong> — then reverts to standard free plan
            </p>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="hero">
        <div className="eyebrow">Dashboard</div>
        <h1>Welcome back, {userName}</h1>
        <p className="hero-subtext">
          AIBE 21 is in {daysUntilExam} days. You've completed {papersCompleted}/{paperLimit} papers.
        </p>

        {/* QUICK STATS */}
        <QuickStats
          papersCompleted={papersCompleted}
          totalPapers={paperLimit}
          averageScore={averageScore}
          weakSubjectsCount={weakSubjectsCount}
          weakSubjects={weakSubjectsList}
        />
      </section>

      {/* PRACTICE PAPERS SECTION */}
      <section className="practice-papers">
        <h2 className="section-title">Practice Papers</h2>
        <p className="section-subtitle">Real AIBE exams from past years. Start where you left off.</p>

        <div className="papers-grid">
          {visiblePapers.map((paper) => (
            <PaperCard
              key={paper.aibe}
              aibe={paper.aibe}
              progress={paper.progress}
              attempted={paper.attempted}
              date={paper.date}
              isLocked={false}
              onStart={() => handlePaperStart(paper.aibe)}
              onReview={() => handlePaperReview(paper.aibe)}
              onUpgrade={onUpgradeClick}
            />
          ))}
        </div>
      </section>

      {/* AI MOCK TESTS SECTION */}
      <section className="practice-papers">
        <h2 className="section-title">AI Mock Tests</h2>
        <p className="section-subtitle">AI-generated custom tests tailored to your weak areas.</p>

        {mockTestLimit > 0 ? (
          <div className="papers-grid">
            {Array.from({ length: mockTestLimit }, (_, i) => i + 1).map((mockNumber) => {
              // Get actual progress from sessionStorage if mock has been attempted
              const mockKey = `mock-${mockNumber}`
              const mockData = sessionStorage.getItem(mockKey)
              let progress = 0
              if (mockData) {
                try {
                  const parsed = JSON.parse(mockData)
                  if (parsed.score && parsed.totalQuestions) {
                    progress = Math.round((parsed.score / parsed.totalQuestions) * 100)
                  }
                } catch (e) {
                  progress = 0
                }
              }
              return (
                <MockTestCard
                  key={mockNumber}
                  mockNumber={mockNumber}
                  progress={progress}
                  onStart={() => handleMockStart(mockNumber)}
                  onReview={() => handleMockReview(mockNumber)}
                />
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon"></div>
            <p className="empty-state-text">AI Mock Tests are available with a paid plan.</p>
          </div>
        )}
      </section>

      {/* PAST ATTEMPTS SECTION */}
      <section className="past-attempts">
        <h2 className="section-title">Recent Attempts</h2>
        <p className="section-subtitle">Your test history and performance.</p>

        {attempts.length > 0 ? (
          <div className="attempts-container">
            {attempts.slice(0, 5).map((attempt) => (
              <div key={attempt.id} className="attempt-card">
                <div className="attempt-paper-name">AIBE {attempt.paperId}</div>
                <div className="attempt-date">
                  {new Date(attempt.completedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="attempt-score">
                  {attempt.score}/{attempt.totalQuestions}
                </div>
                <div className="attempt-time">
                  {Math.floor(attempt.durationMinutes / 60)}h {attempt.durationMinutes % 60}m
                </div>
                <button
                  className="attempt-button"
                  onClick={() => handlePaperReview(attempt.paperId)}
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon"></div>
            <p className="empty-state-text">No attempts yet. Start your first practice paper!</p>
          </div>
        )}
      </section>

      {/* PROGRESS SECTION */}
      <section className="progress-section">
        <h2 className="section-title">Your Progress</h2>

        <div className="progress-grid">
          {/* Strong Subjects */}
          <div className="progress-card">
            <h3>Strong Subjects</h3>
            <div className="subject-list">
              {subjectPerformance.strong.length > 0 ? (
                subjectPerformance.strong.map((subject) => (
                  <div key={subject.name} className="subject-item">
                    <span className="subject-name">{subject.name}</span>
                    <span className="subject-percent">{subject.percent}%</span>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--ink-2)', fontSize: '14px' }}>Take a test to see your strong subjects</p>
              )}
            </div>
          </div>

          {/* Weak Subjects */}
          <div className="progress-card">
            <h3>Weak Subjects</h3>
            <div className="subject-list">
              {subjectPerformance.weak.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {subjectPerformance.weak.map((subject) => (
                    <div key={subject.name} style={{ borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="subject-name">{subject.name}</span>
                        <span className="subject-percent">{subject.percent}%</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{subject.correct}/{subject.total} correct</span>
                        <span style={{ color: '#c62828', fontWeight: 600 }}>Focus here →</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '12px', background: 'rgba(198, 40, 40, 0.05)', borderRadius: '8px', borderLeft: '3px solid #c62828' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>Recommendation</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-2)' }}>
                      {loadingAnalysis ? 'Generating personalized analysis...' : weakSubjectsAnalysis}
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--ink-2)', fontSize: '14px' }}>Take a test to see your weak subjects</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
