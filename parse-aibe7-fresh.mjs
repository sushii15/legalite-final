import { readFileSync, writeFileSync } from 'fs'

const aibeText = readFileSync('./aibe7_extracted.txt', 'utf-8').replace(/\r/g, '')
const lines = aibeText.split('\n')

// Subject categorization
const getSubject = (questionText) => {
  const lower = questionText.toLowerCase()
  if (lower.includes('constitution') || lower.includes('article ') || lower.includes('amendment')) return 'Constitutional Law'
  if (lower.includes('penal code') || lower.includes('ipc') || lower.includes('murder') || lower.includes('theft') || lower.includes('hurt')) return 'Criminal Law'
  if (lower.includes('criminal procedure') || lower.includes('crpc') || lower.includes('magistrate')) return 'Criminal Procedure'
  if (lower.includes('civil procedure') || lower.includes('cpc') || lower.includes('suit')) return 'Civil Procedure'
  if (lower.includes('evidence act') || lower.includes('confession') || lower.includes('hearsay')) return 'Evidence Law'
  if (lower.includes('hindu') || lower.includes('marriage') || lower.includes('divorce') || lower.includes('succession')) return 'Family Law'
  if (lower.includes('contract') || lower.includes('fraud') || lower.includes('consideration')) return 'Contract Law'
  if (lower.includes('tort') || lower.includes('negligence')) return 'Tort Law'
  if (lower.includes('property') || lower.includes('transfer')) return 'Property Law'
  if (lower.includes('arbitration') || lower.includes('lok adalat') || lower.includes('conciliation')) return 'ADR & Alternative Dispute Resolution'
  if (lower.includes('company') || lower.includes('director') || lower.includes('shareholder')) return 'Company Law'
  if (lower.includes('environmental') || lower.includes('precautionary')) return 'Environmental Law'
  if (lower.includes('administrative')) return 'Administrative Law'
  if (lower.includes('advocate') || lower.includes('bar council') || lower.includes('workman')) return 'Professional Conduct'
  if (lower.includes('motor vehicle')) return 'Motor Vehicles Act'
  if (lower.includes('consumer')) return 'Consumer Law'
  if (lower.includes('information technology') || lower.includes('cyber')) return 'Information Technology Law'
  if (lower.includes('factories') || lower.includes('labour')) return 'Labour & Employment Law'
  if (lower.includes('negotiable instrument') || lower.includes('cheque')) return 'Negotiable Instruments Act'
  if (lower.includes('intellectual property') || lower.includes('patent') || lower.includes('trademark')) return 'Intellectual Property Law'
  if (lower.includes('income tax') || lower.includes('tax')) return 'Tax Law'
  return 'General Law'
}

const questions = []

// Process line by line
let i = 0
while (i < lines.length) {
  const line = lines[i].trim()

  // Match question start: "N. " where N is 1-100
  const qMatch = line.match(/^(\d{1,3})\.\s+(.+)$/)
  if (qMatch) {
    const questionNum = parseInt(qMatch[1])
    if (questionNum < 1 || questionNum > 100) {
      i++
      continue
    }

    let questionText = qMatch[2]
    let optionA = '', optionB = '', optionC = '', optionD = '', correctOption = '', explanation = ''

    // Read next lines to find options
    i++
    let foundOptions = false
    let optionsLine = ''

    // Skip blank lines and page numbers, find options
    while (i < lines.length) {
      const nextLine = lines[i].trim()

      // Skip blank lines and page numbers
      if (nextLine === '' || nextLine.match(/^\d{1,2}$/) && nextLine.length <= 2) {
        i++
        continue
      }

      // Check for "Correct Answer" first
      if (nextLine.startsWith('Correct Answer')) {
        const correctMatch = nextLine.match(/Correct Answer:\s*\(?([A-D])\)?/i)
        if (correctMatch) {
          correctOption = correctMatch[1].toUpperCase()
        }
        foundOptions = true
        i++
        break
      }

      // Check for options - they contain "(A)" or "(a)"
      if (nextLine.match(/\([A-D]\)/i)) {
        optionsLine = nextLine
        foundOptions = true
        i++
        break
      }

      // Continue reading question text if it's not options yet
      questionText += ' ' + nextLine
      i++
    }

    if (!foundOptions) {
      continue
    }

    // Parse options from the single line
    if (optionsLine) {
      const optionAMatch = optionsLine.match(/\(A\)\s+([^\(]+?)(?=\(B\))/i)
      const optionBMatch = optionsLine.match(/\(B\)\s+([^\(]+?)(?=\(C\))/i)
      const optionCMatch = optionsLine.match(/\(C\)\s+([^\(]+?)(?=\(D\))/i)
      const optionDMatch = optionsLine.match(/\(D\)\s+([^\(]+?)$/i)

      if (optionAMatch && optionBMatch && optionCMatch && optionDMatch) {
        optionA = optionAMatch[1].trim()
        optionB = optionBMatch[1].trim()
        optionC = optionCMatch[1].trim()
        optionD = optionDMatch[1].trim()
      }
    }

    // Extract explanation from Solution section
    while (i < lines.length) {
      const nextLine = lines[i].trim()

      if (nextLine.startsWith('Solution') || nextLine.startsWith('Solution:')) {
        i++
        let expText = ''
        while (i < lines.length) {
          const sLine = lines[i].trim()

          if (sLine.startsWith('Quick Tip') || sLine.match(new RegExp(`^${questionNum + 1}\\.`))) {
            break
          }

          if (sLine === '' || sLine.match(/^\d{1,2}$/)) {
            i++
            continue
          }

          expText += ' ' + sLine
          i++
        }

        explanation = expText.trim().substring(0, 500) || 'No explanation'
        break
      }

      i++
    }

    // Validate and add
    if (correctOption && optionA && optionB && optionC && optionD && questionText.trim()) {
      const subject = getSubject(questionText)

      questions.push({
        question_number: questionNum,
        question_text: questionText.trim(),
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_option: correctOption,
        subject: subject,
        explanation: explanation
      })
    }
  }

  i++
}

// Sort by question number
questions.sort((a, b) => a.question_number - b.question_number)

// Write to JSON
writeFileSync('./aibe7_questions_fresh.json', JSON.stringify(questions, null, 2))

console.log(`✅ Parsed AIBE 7`)
console.log(`Total questions extracted: ${questions.length}`)

// Show which are missing
const nums = new Set(questions.map(q => q.question_number))
const missing = []
for (let j = 1; j <= 100; j++) {
  if (!nums.has(j)) missing.push(j)
}
if (missing.length > 0) {
  console.log(`Missing: ${missing.slice(0, 30).join(', ')}${missing.length > 30 ? '...' : ''}`)
} else {
  console.log(`✅ All 100 questions present!`)
}
