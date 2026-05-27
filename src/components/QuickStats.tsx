import '../styles/dashboard.css'

interface QuickStatsProps {
  papersCompleted: number
  totalPapers: number
  averageScore: number
  weakSubjectsCount: number
  weakSubjects: string[]
}

export function QuickStats({
  papersCompleted,
  totalPapers,
  averageScore,
  weakSubjectsCount,
  weakSubjects,
}: QuickStatsProps) {
  const progressPercent = Math.round((papersCompleted / totalPapers) * 100)
  const weakSubjectsList = weakSubjects.slice(0, 3).join(', ')

  return (
    <div className="quick-stats">
      <div className="stat-card">
        <div className="stat-label">Papers Completed</div>
        <div className="stat-value">{papersCompleted}/{totalPapers}</div>
        <div className="stat-meta">{progressPercent}% progress</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Average Score</div>
        <div className="stat-value">{averageScore}%</div>
        <div className="stat-meta">
          {averageScore >= 70 ? 'Improving steadily' : 'Keep practicing'}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Weak Subjects</div>
        <div className="stat-value">{weakSubjectsCount}</div>
        <div className="stat-meta">{weakSubjectsList}</div>
      </div>
    </div>
  )
}
