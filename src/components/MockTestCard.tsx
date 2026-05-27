import '../styles/dashboard.css'

interface MockTestCardProps {
  mockNumber: number
  progress: number
  onStart: () => void
  onReview: () => void
}

export function MockTestCard({ mockNumber, progress, onStart, onReview }: MockTestCardProps) {
  const dashOffset = 282.74 * (1 - progress / 100)

  return (
    <div className="paper-card">
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
            <div className="progress-label-small">Progress</div>
          </div>
        </div>

        <div className="paper-info">
          <h3 className="paper-name">Mock Test {mockNumber}</h3>
          <p className="paper-meta" style={{ whiteSpace: 'pre-line' }}>
            100 Questions • 3.5 Hours
            Adaptive • Custom topics
            {progress}/100 completed
          </p>
        </div>
      </div>

      <div className="button-group">
        <button className="button-primary" onClick={onStart}>
          {progress > 0 ? 'Continue' : 'Start Test'}
        </button>
        <button className="button-secondary" onClick={onReview} disabled={progress === 0}>
          Review
        </button>
      </div>
    </div>
  )
}
