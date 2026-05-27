export function calculateProgressPercent(completedQuestions: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0
  return Math.round((completedQuestions / totalQuestions) * 100)
}

export function calculateDaysUntilExam(examDate: string): number {
  const exam = new Date(examDate)
  const today = new Date()
  const timeDiff = exam.getTime() - today.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return Math.max(0, daysDiff)
}

export function calculateAverageScore(scores: number[]): number {
  if (scores.length === 0) return 0
  const sum = scores.reduce((acc, score) => acc + score, 0)
  return Math.round(sum / scores.length)
}

export function formatAttemptDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  return `${hours}h ${mins}m`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
