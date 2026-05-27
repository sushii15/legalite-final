import { readFileSync, writeFileSync } from 'fs'

// Read all JSON files
const parsed = JSON.parse(readFileSync('./aibe6_questions_parsed.json', 'utf-8'))
const missing = JSON.parse(readFileSync('./aibe6_missing.json', 'utf-8'))

// Combine all
const allQuestions = [...parsed, ...missing]

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
writeFileSync('./aibe6_all_100_questions_final.json', JSON.stringify(unique, null, 2))

console.log(`✅ Merged all AIBE 6 sources`)
console.log(`Total questions: ${unique.length}`)

// Verify
const nums = new Set(unique.map(q => q.question_number))
const missing_qs = []
for (let j = 1; j <= 100; j++) {
  if (!nums.has(j)) missing_qs.push(j)
}

if (missing_qs.length > 0) {
  console.log(`⚠️  Still missing: ${missing_qs.join(', ')}`)
} else {
  console.log(`✅ ALL 100 AIBE 6 QUESTIONS COMPLETE!`)
}
