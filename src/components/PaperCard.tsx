import '../styles/dashboard.css'

interface PaperCardProps {
  aibe: number
  progress: number
  attempted: boolean
  date?: string
  isLocked?: boolean
  onStart: () => void
  onReview: () => void
  onUpgrade?: () => void
}

export function PaperCard({
  aibe,
  progress,
  attempted,
  date,
  isLocked = false,
  onStart,
  onReview,
  onUpgrade,
}: PaperCardProps) {
  const dashOffset = 282.74 * (1 - progress / 100)
  const metaText = attempted
    ? `100 Questions • 3.5 Hours\nLast attempted: ${date}\n${Math.round(progress)}/100 completed`
    : `100 Questions • 3.5 Hours\nNot started\n0/100 completed`

  return (
    <div className={`paper-card ${isLocked ? 'locked' : ''}`}>
      {isLocked && <div className="lock-icon">🔒</div>}
      {!isLocked && attempted && <div className="your-plan-badge">Your Plan</div>}

      <div className="paper-header">
        <div className="circular-progress">
          <svg viewBox="0 0 100 100">
            <circle className="progress-circle-bg" cx="50" cy="50" r="45" />
            <circle
              className="progress-circle-fill"
              cx="50"
              cy="50"
              r="45"
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>
          <div className="progress-text">
            <div className="progress-percent">{progress}%</div>
            <div className="progress-label-small">{attempted ? 'Progress' : 'Start'}</div>
          </div>
        </div>

        <div className="paper-info">
          <h3 className="paper-name">AIBE {aibe}</h3>
          <p className="paper-meta" style={{ whiteSpace: 'pre-line' }}>
            {metaText}
          </p>
        </div>
      </div>

      {isLocked ? (
        <button className="unlock-button" onClick={onUpgrade}>
          Unlock to {progress === 0 ? 'Start' : 'Continue'} →
        </button>
      ) : (
        <div className="button-group">
          <button className="button-primary" onClick={onStart}>
            {attempted ? 'Continue' : 'Start Test'}
          </button>
          <button className="button-secondary" onClick={onReview} disabled={progress === 0}>
            Review
          </button>
        </div>
      )}
    </div>
  )
}
