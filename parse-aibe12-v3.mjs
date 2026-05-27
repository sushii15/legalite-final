import { readFileSync, writeFileSync } from 'fs'

const aibeText = readFileSync('./aibe12_extracted.txt', 'utf-8')

// IMPORTANT: First, remove ALL page numbers (lines that are just 1-3 digits)
const lines = aibeText.split('\n')
const cleanedLines = lines.filter(line => {
  const trimmed = line.trim()
  // Remove if it's just a number (1-100)
  if (trimmed.match(/^\d{1,3}$/) && parseInt(trimmed) > 0 && parseInt(trimmed) <= 200) {
    return false
  }
  return true
})
const cleanedText = cleanedLines.join('\n')

// Subject categorization
const getSubject = (questionText) => {
  const lower = questionText.toLowerCase()

  if (lower.includes('constitution') || lower.includes('article ') || lower.includes('amendment')) {
    return 'Constitutional Law'
  } else if (lower.includes('penal code') || lower.includes('ipc') || lower.includes('murder') || lower.includes('theft') || lower.includes('hurt')) {
    return 'Criminal Law'
  } else if (lower.includes('criminal procedure') || lower.includes('crpc') || lower.includes('magistrate') || lower.includes('sessions judge')) {
    return 'Criminal Procedure'
  } else if (lower.includes('civil procedure') || lower.includes('cpc') || lower.includes('suit') || lower.includes('plaint') || lower.includes('order vi') || lower.includes('order vii')) {
    return 'Civil Procedure'
  } else if (lower.includes('evidence act') || lower.includes('confession') || lower.includes('hearsay') || lower.includes('leading question')) {
    return 'Evidence Law'
  } else if (lower.includes('hindu') || lower.includes('marriage') || lower.includes('divorce') || lower.includes('muslim law') || lower.includes('succession')) {
    return 'Family Law'
  } else if (lower.includes('contract') || lower.includes('fraud') || lower.includes('consideration')) {
    return 'Contract Law'
  } else if (lower.includes('tort') || lower.includes('negligence')) {
    return 'Tort Law'
  } else if (lower.includes('property') || lower.includes('transfer')) {
    return 'Property Law'
  } else if (lower.includes('arbitration') || lower.includes('lok adalat') || lower.includes('conciliation')) {
    return 'ADR & Alternative Dispute Resolution'
  } else if (lower.includes('company') || lower.includes('director') || lower.includes('shareholder')) {
    return 'Company Law'
  } else if (lower.includes('environmental') || lower.includes('precautionary') || lower.includes('public trust')) {
    return 'Environmental Law'
  } else if (lower.includes('administrative')) {
    return 'Administrative Law'
  } else if (lower.includes('advocate') || lower.includes('bar council') || lower.includes('workman') || lower.includes('teacher')) {
    return 'Professional Conduct'
  } else if (lower.includes('motor vehicle')) {
    return 'Motor Vehicles Act'
  } else if (lower.includes('consumer')) {
    return 'Consumer Law'
  } else if (lower.includes('information technology') || lower.includes('cyber') || lower.includes('electronic')) {
    return 'Information Technology Law'
  } else if (lower.includes('maternity') || lower.includes('factories') || lower.includes('industrial dispute') || lower.includes('workman') || lower.includes('labour')) {
    return 'Labour & Employment Law'
  } else if (lower.includes('negotiable instrument') || lower.includes('cheque')) {
    return 'Negotiable Instruments Act'
  } else if (lower.includes('land acquisition')) {
    return 'Land Acquisition Law'
  } else if (lower.includes('intellectual property') || lower.includes('patent') || lower.includes('trademark') || lower.includes('copyright')) {
    return 'Intellectual Property Law'
  } else if (lower.includes('income tax') || lower.includes('tax')) {
    return 'Tax Law'
  }

  return 'General Law'
}

// Now use regex on cleaned text
const questions = []
const questionRegex = /^(\d{1,3})\.\s+(.+?)(?=^\d{1,3}\.\s+|\Z)/gms

let match
while ((match = questionRegex.exec(cleanedText)) !== null) {
  const qNum = parseInt(match[1])

  if (qNum < 1 || qNum > 100) continue

  const questionBlock = match[2]

  // Extract options - try uppercase first, then lowercase
  let optionA, optionB, optionC, optionD

  // Try uppercase pattern
  let optionAMatch = questionBlock.match(/\(A\)\s+([^\(]+?)(?=\(B\))/i)
  let optionBMatch = questionBlock.match(/\(B\)\s+([^\(]+?)(?=\(C\))/i)
  let optionCMatch = questionBlock.match(/\(C\)\s+([^\(]+?)(?=\(D\))/i)
  let optionDMatch = questionBlock.match(/\(D\)\s+([^\(]+?)(?=Correct Answer|Solution|Quick Tip|^\d|$)/i)

  if (optionAMatch && optionBMatch && optionCMatch && optionDMatch) {
    optionA = optionAMatch[1].trim()
    optionB = optionBMatch[1].trim()
    optionC = optionCMatch[1].trim()
    optionD = optionDMatch[1].trim()
  } else {
    // Try lowercase
    optionAMatch = questionBlock.match(/\(a\)\s+([^\(]+?)(?=\(b\))/i)
    optionBMatch = questionBlock.match(/\(b\)\s+([^\(]+?)(?=\(c\))/i)
    optionCMatch = questionBlock.match(/\(c\)\s+([^\(]+?)(?=\(d\))/i)
    optionDMatch = questionBlock.match(/\(d\)\s+([^\(]+?)(?=Correct Answer|Solution|Quick Tip|^\d|$)/i)

    if (!optionAMatch || !optionBMatch || !optionCMatch || !optionDMatch) continue

    optionA = optionAMatch[1].trim()
    optionB = optionBMatch[1].trim()
    optionC = optionCMatch[1].trim()
    optionD = optionDMatch[1].trim()
  }

  // Extract correct answer
  let correctMatch = questionBlock.match(/Correct Answer:\s*\(?([A-D])\)?/i)
  if (!correctMatch) {
    correctMatch = questionBlock.match(/Correct Answer:\s+\(([A-D])\)/i)
  }
  const correctOption = correctMatch ? correctMatch[1].toUpperCase() : null

  if (!correctOption) continue

  // Extract question text
  const qTextMatch = questionBlock.match(/^(.+?)(?=\(A\)|\(a\))/i)
  const questionText = qTextMatch ? qTextMatch[1].trim() : ''

  if (!questionText) continue

  // Extract explanation
  const explanationMatch = questionBlock.match(/Solution:|Explanation:(.+?)(?=Quick Tip|$)/is)
  const explanation = explanationMatch && explanationMatch[1] ? explanationMatch[1].trim().substring(0, 500) : 'No explanation provided'

  const subject = getSubject(questionText)

  questions.push({
    question_number: qNum,
    question_text: questionText,
    option_a: optionA,
    option_b: optionB,
    option_c: optionC,
    option_d: optionD,
    correct_option: correctOption,
    subject: subject,
    explanation: explanation
  })
}

// Sort by question number
questions.sort((a, b) => a.question_number - b.question_number)

// Write to JSON
writeFileSync('./aibe12_questions.json', JSON.stringify(questions, null, 2))

console.log(`✅ Parsed AIBE 12 (v3 - cleaned page numbers)`)
console.log(`Total questions extracted: ${questions.length}`)

// Show which are missing
const nums = new Set(questions.map(q => q.question_number))
const missing = []
for (let i = 1; i <= 100; i++) {
  if (!nums.has(i)) missing.push(i)
}
if (missing.length > 0) {
  console.log(`Missing: ${missing.join(', ')}`)
} else {
  console.log(`✅ All 100 questions present!`)
}
