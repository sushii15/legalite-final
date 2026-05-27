interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="progress-bar">
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${percentage}%` }} />
      </div>
      <div className="progress-bar__label">
        {current} of {total} questions answered
      </div>
    </div>
  )
}
