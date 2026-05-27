import { readFileSync, writeFileSync } from 'fs'

const aibeText = readFileSync('./aibe11_extracted.txt', 'utf-8')

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

// Missing questions
const missingQs = [2, 5, 11, 18, 26, 27, 39, 40, 53, 57, 58, 59, 61, 62, 63, 73, 74, 75, 84, 87, 91, 93, 97]

// Regex to extract by question number
const cleanedText = aibeText.replace(/\r/g, '')
const questions = []

for (const qNum of missingQs) {
  // Try to find question block: "QNum. " to next question or end
  const regex = new RegExp(`^${qNum}\\.\\s+(.+?)(?=^\\d{1,3}\\.\\s+|\\Z)`, 'ms')
  const match = cleanedText.match(regex)

  if (!match) {
    console.log(`❌ Q${qNum}: Not found`)
    continue
  }

  const questionBlock = match[1]

  // Extract options - try uppercase first
  let optionAMatch = questionBlock.match(/\(A\)\s+([^\(]+?)(?=\(B\))/i)
  let optionBMatch = questionBlock.match(/\(B\)\s+([^\(]+?)(?=\(C\))/i)
  let optionCMatch = questionBlock.match(/\(C\)\s+([^\(]+?)(?=\(D\))/i)
  let optionDMatch = questionBlock.match(/\(D\)\s+([^\(]+?)(?=Correct Answer|Solution|Quick Tip|^\d|$)/i)

  if (optionAMatch && optionBMatch && optionCMatch && optionDMatch) {
    // Found uppercase options
  } else {
    // Try lowercase
    optionAMatch = questionBlock.match(/\(a\)\s+([^\(]+?)(?=\(b\))/i)
    optionBMatch = questionBlock.match(/\(b\)\s+([^\(]+?)(?=\(c\))/i)
    optionCMatch = questionBlock.match(/\(c\)\s+([^\(]+?)(?=\(d\))/i)
    optionDMatch = questionBlock.match(/\(d\)\s+([^\(]+?)(?=Correct Answer|Solution|Quick Tip|^\d|$)/i)

    if (!optionAMatch || !optionBMatch || !optionCMatch || !optionDMatch) {
      console.log(`❌ Q${qNum}: Could not extract options`)
      continue
    }
  }

  // Extract correct answer
  let correctMatch = questionBlock.match(/Correct Answer:\s*\(?([A-D])\)?/i)
  if (!correctMatch) {
    correctMatch = questionBlock.match(/Correct Answer:\s+\(([A-D])\)/i)
  }
  const correctOption = correctMatch ? correctMatch[1].toUpperCase() : null

  if (!correctOption) {
    console.log(`❌ Q${qNum}: Could not extract correct answer`)
    continue
  }

  // Extract question text
  const qTextMatch = questionBlock.match(/^(.+?)(?=\(A\)|\(a\))/i)
  const questionText = qTextMatch ? qTextMatch[1].trim() : ''

  if (!questionText) {
    console.log(`❌ Q${qNum}: Could not extract question text`)
    continue
  }

  // Extract explanation
  const explanationMatch = questionBlock.match(/Solution:|Explanation:(.+?)(?=Quick Tip|$)/is)
  const explanation = explanationMatch && explanationMatch[1] ? explanationMatch[1].trim().substring(0, 500) : 'No explanation'

  const subject = getSubject(questionText)

  questions.push({
    question_number: qNum,
    question_text: questionText,
    option_a: optionAMatch[1].trim(),
    option_b: optionBMatch[1].trim(),
    option_c: optionCMatch[1].trim(),
    option_d: optionDMatch[1].trim(),
    correct_option: correctOption,
    subject: subject,
    explanation: explanation
  })

  console.log(`✅ Q${qNum}: Extracted`)
}

// Sort by question number
questions.sort((a, b) => a.question_number - b.question_number)

// Write to JSON
writeFileSync('./aibe11_missing_23.json', JSON.stringify(questions, null, 2))

console.log(`\n✅ Extracted ${questions.length} missing questions`)
console.log(`Expected: ${missingQs.length}`)

// Verify all found
const extractedNums = new Set(questions.map(q => q.question_number))
const stillMissing = missingQs.filter(q => !extractedNums.has(q))
if (stillMissing.length > 0) {
  console.log(`⚠️  Still missing: ${stillMissing.join(', ')}`)
} else {
  console.log(`✅ All 23 missing questions extracted!`)
}
