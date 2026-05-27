import { readFileSync, writeFileSync } from 'fs'

// Read all three files
const parsed54 = JSON.parse(readFileSync('./aibe9_questions.json', 'utf-8'))
const missing22 = JSON.parse(readFileSync('./aibe9_missing_46.json', 'utf-8'))
const missing24 = JSON.parse(readFileSync('./aibe9_missing_24.json', 'utf-8'))

// Combine all
const allQuestions = [...parsed54, ...missing22, ...missing24]

// Sort by question number
allQuestions.sort((a, b) => a.question_number - b.question_number)

// Write merged file
writeFileSync('./aibe9_all_100_questions.json', JSON.stringify(allQuestions, null, 2))

console.log(`✅ Merged AIBE 9 questions`)
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
