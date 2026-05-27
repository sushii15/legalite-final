import { useState, useEffect } from 'react'

export interface Question {
  id: number
  question_number: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: string
  subject: string
  explanation?: string
  bare_act_pages?: Record<string, number>
}

interface QuestionCardProps {
  question: Question
  selectedOption: string | null
  markedForReview: boolean
  onOptionSelect: (option: string) => void
  onMarkForReview: (marked: boolean) => void
}

export function QuestionCard({
  question,
  selectedOption,
  markedForReview,
  onOptionSelect,
  onMarkForReview,
}: QuestionCardProps) {
  const [localMarked, setLocalMarked] = useState(markedForReview)

  useEffect(() => {
    setLocalMarked(markedForReview)
  }, [markedForReview])

  const handleMarkChange = () => {
    const newMarked = !localMarked
    setLocalMarked(newMarked)
    onMarkForReview(newMarked)
  }

  const options = [
    { letter: 'A', text: question.option_a },
    { letter: 'B', text: question.option_b },
    { letter: 'C', text: question.option_c },
    { letter: 'D', text: question.option_d },
  ]

  return (
    <div className="question-card">
      <div className="question-card__header">
        <div className="question-card__number">Question {question.question_number}</div>
        <div className="question-card__subject">{question.subject}</div>
      </div>

      <div className="question-card__text">{question.question_text}</div>

      <div className="question-card__options">
        {options.map((option) => (
          <label key={option.letter} className="question-card__option">
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.letter}
              checked={selectedOption === option.letter}
              onChange={() => onOptionSelect(option.letter)}
              className="question-card__radio"
            />
            <span className="question-card__option-letter">{option.letter}</span>
            <span className="question-card__option-text">{option.text}</span>
          </label>
        ))}
      </div>

      <div className="question-card__footer">
        <label className="question-card__review-checkbox">
          <input
            type="checkbox"
            checked={localMarked}
            onChange={handleMarkChange}
            className="question-card__checkbox"
          />
          <span>Mark for review</span>
        </label>
      </div>
    </div>
  )
}
