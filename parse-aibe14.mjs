import { readFileSync, writeFileSync } from 'fs'

const aibeText = readFileSync('./aibe14_extracted.txt', 'utf-8')

// Remove page numbers and control characters
const cleanedText = aibeText.replace(/\n\d{1,2}\n/g, '\n').replace(/\f/g, '')

const lines = cleanedText.split('\n')

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

// Parse questions
const questions = []
const fullText = lines.join('\n')

const questionRegex = /^(\d{1,3})\.\s+(.+?)(?=^\d{1,3}\.\s+|\Z)/gms

let match
while ((match = questionRegex.exec(fullText)) !== null) {
  const qNum = parseInt(match[1])

  if (qNum < 1 || qNum > 100) continue

  const questionBlock = match[2]

  // Extract options
  const optionAMatch = questionBlock.match(/\(a\)\s+([^\(]+?)(?=\(b\))/is)
  const optionBMatch = questionBlock.match(/\(b\)\s+([^\(]+?)(?=\(c\))/is)
  const optionCMatch = questionBlock.match(/\(c\)\s+([^\(]+?)(?=\(d\))/is)
  const optionDMatch = questionBlock.match(/\(d\)\s+([^\(]+?)(?=Correct Answer|$)/is)

  if (!optionAMatch || !optionBMatch || !optionCMatch || !optionDMatch) continue

  const optionA = optionAMatch[1].trim()
  const optionB = optionBMatch[1].trim()
  const optionC = optionCMatch[1].trim()
  const optionD = optionDMatch[1].trim()

  // Extract correct answer
  const correctMatch = questionBlock.match(/Correct Answer:\s*\(?([A-D])\)?/i)
  const correctOption = correctMatch ? correctMatch[1].toUpperCase() : null

  if (!correctOption) continue

  // Extract question text
  const qTextMatch = questionBlock.match(/^(.+?)(?=\(a\))/is)
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
writeFileSync('./aibe14_questions.json', JSON.stringify(questions, null, 2))

console.log(`✅ Parsed AIBE 14`)
console.log(`Total questions extracted: ${questions.length}`)

// Show which are missing
const nums = new Set(questions.map(q => q.question_number))
const missing = []
for (let i = 1; i <= 100; i++) {
  if (!nums.has(i)) missing.push(i)
}
console.log(`Missing: ${missing.join(', ')}`)
