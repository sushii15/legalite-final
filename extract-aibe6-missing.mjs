import { readFileSync, writeFileSync } from 'fs'

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

// Manually extracted missing questions
const manualQuestions = [
  {
    qNum: 97,
    questionText: "K. C. Gajapati Narayan Deo v. State of Orissa, is often quoted with reference to",
    optionA: "Doctrine of Eclipse",
    optionB: "Doctrine of severability",
    optionC: "Doctrine of colorable legislation",
    optionD: "Doctrine of territorial nexus",
    correctOption: "C"
  },
  {
    qNum: 98,
    questionText: "Raja Ram Pal v. Hon'ble Speaker, Lok Sabha deals with",
    optionA: "Presidents' election",
    optionB: "Privileges of the legislature",
    optionC: "Pardoning power",
    optionD: "Office of profit",
    correctOption: "B"
  }
]

const questions = []

for (const item of manualQuestions) {
  const subject = getSubject(item.questionText)

  questions.push({
    question_number: item.qNum,
    question_text: item.questionText.trim(),
    option_a: item.optionA,
    option_b: item.optionB,
    option_c: item.optionC,
    option_d: item.optionD,
    correct_option: item.correctOption,
    subject: subject,
    explanation: 'No explanation'
  })

  console.log(`✅ Q${item.qNum} extracted`)
}

// Sort by question number
questions.sort((a, b) => a.question_number - b.question_number)

// Write to JSON
writeFileSync('./aibe6_missing.json', JSON.stringify(questions, null, 2))

console.log(`\n✅ Extracted ${questions.length} missing AIBE 6 questions`)
