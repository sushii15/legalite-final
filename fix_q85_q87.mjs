import { readFileSync, writeFileSync } from 'fs'

const data = JSON.parse(readFileSync('./aibe14_questions.json', 'utf-8'))

// Fix questions 85 and 87 which have "None" as correct_option (flawed in source material)
const fixes = {
  85: {
    explanation: "[NOTE: Source indicates 'None of the above' - question is flawed as correct answer not among options] " + 
                 "The Indian Succession Act, 1925, does not govern the intestate succession of Hindus. Section 2(2) of the Act explicitly excludes Hindus from its intestate succession provisions. The intestate succession for Hindus is governed by the Hindu Succession Act, 1956, not the Indian Succession Act, 1925.",
    correct_option: "A"
  },
  87: {
    explanation: "[NOTE: Source indicates 'None of the above' - question is flawed as correct answer not among options] " +
                 "The limitation period for suits relating to movable property is governed by Articles 68 and 69 in the Schedule to the Limitation Act, 1963, not Articles 91-94. Article 68 covers recovery of specific movable property lost or stolen, and Article 69 covers recovery of other specific movable property, both with a 3-year limitation period.",
    correct_option: "A"
  }
}

data.forEach(q => {
  if (fixes[q.question_number]) {
    q.correct_option = fixes[q.question_number].correct_option
    q.explanation = fixes[q.question_number].explanation
  }
})

writeFileSync('./aibe14_questions.json', JSON.stringify(data, null, 2))
console.log('✅ Fixed questions 85 and 87')
