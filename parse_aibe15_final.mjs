import { readFileSync, writeFileSync } from 'fs'

const aibe15Text = readFileSync('./aibe15_extracted.txt', 'utf-8')

// Remove page numbers
const cleanedText = aibe15Text.replace(/\n\d{1,2}\n/g, '\n')

const lines = cleanedText.split('\n')

let questionStart = -1
for (let i = 0; i < lines.length; i++) {
  if (lines[i].match(/^1\.\s+Section 66A/)) {
    questionStart = i
    break
  }
}

console.log('Question start index:', questionStart)

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
const fullText = lines.slice(questionStart).join('\n')

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
  const answerMatch = questionBlock.match(/Correct Answer:\s*\(([a-d])\)/i)
  const correctAnswer = answerMatch ? answerMatch[1].toUpperCase() : null

  // Extract solution
  const solutionMatch = questionBlock.match(/Solution:\s*(.+?)(?=Quick Tip|$)/is)
  const explanation = solutionMatch ? solutionMatch[1].trim() : null

  // Extract question text
  const optStart = questionBlock.indexOf('(a)')
  const questionText = questionBlock.substring(0, optStart).trim()

  if (questionText.length > 5) {
    questions.push({
      question_number: qNum,
      question_text: questionText,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct_option: correctAnswer,
      subject: getSubject(questionText),
      explanation: explanation
    })
  }
}

console.log(`Parsed ${questions.length} questions`)

writeFileSync('./aibe15_questions.json', JSON.stringify(questions, null, 2))

console.log(`✅ AIBE 15 questions saved`)
console.log(`Total: ${questions.length}`)

const subjects = {}
questions.forEach(q => {
  subjects[q.subject] = (subjects[q.subject] || 0) + 1
})
console.log(`Subject distribution:`)
Object.entries(subjects).sort((a, b) => b[1] - a[1]).forEach(([subj, count]) => {
  console.log(`  ${subj}: ${count}`)
})
