import { readFileSync, writeFileSync } from 'fs'

// Read all three files
const parsed69 = JSON.parse(readFileSync('./aibe10_questions.json', 'utf-8'))
const missing17 = JSON.parse(readFileSync('./aibe10_missing_31.json', 'utf-8'))
const missing14 = JSON.parse(readFileSync('./aibe10_missing_14.json', 'utf-8'))

// Combine all
const allQuestions = [...parsed69, ...missing17, ...missing14]

// Sort by question number
allQuestions.sort((a, b) => a.question_number - b.question_number)

// Write merged file
writeFileSync('./aibe10_all_100_questions.json', JSON.stringify(allQuestions, null, 2))

console.log(`✅ Merged AIBE 10 questions`)
console.log(`Total questions: ${allQuestions.length}`)

// Verify
const nums = new Set(allQuestions.map(q => q.question_number))
const missing = []
for (let i = 1; i <= 100; i++) {
  if (!nums.has(i)) missing.push(i)
}

if (missing.length > 0) {
  console.log(`❌ Missing: ${missing.join(', ')}`)
} else {
  console.log(`✅ All 100 questions present!`)
}
