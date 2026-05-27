import { readFileSync, writeFileSync } from 'fs'

// Read all three files
const parsed83 = JSON.parse(readFileSync('./aibe8_questions.json', 'utf-8'))
const missing8 = JSON.parse(readFileSync('./aibe8_missing_17.json', 'utf-8'))
const missing9 = JSON.parse(readFileSync('./aibe8_missing_9.json', 'utf-8'))

// Combine all
const allQuestions = [...parsed83, ...missing8, ...missing9]

// Sort by question number
allQuestions.sort((a, b) => a.question_number - b.question_number)

// Write merged file
writeFileSync('./aibe8_all_100_questions.json', JSON.stringify(allQuestions, null, 2))

console.log(`✅ Merged AIBE 8 questions`)
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
