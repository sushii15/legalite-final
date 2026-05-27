import { readFileSync, writeFileSync } from 'fs'

// Read both JSON files
const existingQuestions = JSON.parse(readFileSync('./aibe12_questions.json', 'utf-8'))
const missingQuestions = JSON.parse(readFileSync('./aibe12_missing_33.json', 'utf-8'))

// Combine and sort by question_number
const allQuestions = [...existingQuestions, ...missingQuestions]
allQuestions.sort((a, b) => a.question_number - b.question_number)

// Write merged JSON
writeFileSync('./aibe12_all_100_questions.json', JSON.stringify(allQuestions, null, 2))

console.log(`✅ Merged AIBE 12 questions`)
console.log(`Total questions: ${allQuestions.length}`)

// Verify all 100 are present
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
