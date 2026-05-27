import { useEffect, useState } from 'react'

interface TimerProps {
  durationMinutes: number
  onTimeUp?: () => void
}

export function Timer({ durationMinutes, onTimeUp }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!isActive || secondsLeft <= 0) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onTimeUp])

  const hours = Math.floor(secondsLeft / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60

  const isWarning = secondsLeft < 600 // Last 10 minutes

  return (
    <div className={`timer ${isWarning ? 'timer--warning' : ''}`}>
      <div className="timer__display">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </div>
      <div className="timer__label">Time Left</div>
    </div>
  )
}
