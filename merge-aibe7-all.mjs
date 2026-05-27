import { readFileSync, writeFileSync } from 'fs'

// Read all JSON files
const main = JSON.parse(readFileSync('./aibe7_all_100_questions.json', 'utf-8'))
const manual1 = JSON.parse(readFileSync('./aibe7_manual.json', 'utf-8'))
const manual2 = JSON.parse(readFileSync('./aibe7_final_missing.json', 'utf-8'))
const recovered = JSON.parse(readFileSync('./aibe7_missing.json', 'utf-8'))

// Combine all
const allQuestions = [...main, ...manual1, ...manual2, ...recovered]

// Remove duplicates (keep first occurrence)
const seen = new Set()
const unique = allQuestions.filter(q => {
  if (seen.has(q.question_number)) {
    console.log(`⚠️  Duplicate Q${q.question_number} found, keeping first version`)
    return false
  }
  seen.add(q.question_number)
  return true
})

// Sort by question number
unique.sort((a, b) => a.question_number - b.question_number)

// Write final file
writeFileSync('./aibe7_all_100_questions_final.json', JSON.stringify(unique, null, 2))

console.log(`✅ Merged all sources`)
console.log(`Total questions: ${unique.length}`)

// Verify
const nums = new Set(unique.map(q => q.question_number))
const missing = []
for (let j = 1; j <= 100; j++) {
  if (!nums.has(j)) missing.push(j)
}

if (missing.length > 0) {
  console.log(`⚠️  Still missing: ${missing.join(', ')}`)
} else {
  console.log(`✅ ALL 100 QUESTIONS COMPLETE!`)
}
