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

// Manually extracted questions
const questions = [
  {
    question_number: 7,
    question_text: "An agreement to sell is distinguished from a sale in that in an agreement to sell",
    option_a: "the ownership passes to the buyer",
    option_b: "the ownership does not pass to the buyer",
    option_c: "the seller retains the right of ownership",
    option_d: "Both (b) and (c)",
    correct_option: "D",
    subject: getSubject("An agreement to sell is distinguished from a sale"),
    explanation: "No explanation"
  },
  {
    question_number: 10,
    question_text: "Goodwill in the context of sale of business is",
    option_a: "the reputation of the business",
    option_b: "the value arising from the reputation",
    option_c: "both tangible and intangible property",
    option_d: "the sum total of goodwill and other assets",
    correct_option: "B",
    subject: getSubject("Goodwill in the context of sale of business"),
    explanation: "No explanation"
  },
  {
    question_number: 12,
    question_text: "Title to goods in a sale is transferred",
    option_a: "unconditionally",
    option_b: "conditionally",
    option_c: "when parties intend it to pass",
    option_d: "None of the above",
    correct_option: "C",
    subject: getSubject("Title to goods in a sale is transferred"),
    explanation: "No explanation"
  },
  {
    question_number: 29,
    question_text: "The expression 'right to sue' in the context of the CPC refers to",
    option_a: "the right of a party to initiate legal proceedings",
    option_b: "the right to defend an action",
    option_c: "the right to appeal against an order",
    option_d: "the right to execute a decree",
    correct_option: "A",
    subject: "Civil Procedure",
    explanation: "No explanation"
  },
  {
    question_number: 32,
    question_text: "Caveat in the context of the CPC is filed to",
    option_a: "prevent passing of an order against the caveator without notice",
    option_b: "prevent filing of a suit",
    option_c: "prevent execution of a decree",
    option_d: "stay proceedings",
    correct_option: "A",
    subject: "Civil Procedure",
    explanation: "No explanation"
  },
  {
    question_number: 56,
    question_text: "The doctrine of 'separate entity' of a company has been established in the case of",
    option_a: "Salomon v. Salomon",
    option_b: "State of Karnataka v. Sri Ranganatha Enterprises",
    option_c: "Glancore Ltd v. Rimmer",
    option_d: "Re: Macaura",
    correct_option: "A",
    subject: "Company Law",
    explanation: "No explanation"
  },
  {
    question_number: 76,
    question_text: "The concept of 'Doctrine of Constructive Fraud' applies to",
    option_a: "all contracts",
    option_b: "only contracts of insurance and guarantee",
    option_c: "contracts of sale and purchase of land",
    option_d: "partnership agreements",
    correct_option: "B",
    subject: getSubject("Doctrine of Constructive Fraud"),
    explanation: "No explanation"
  },
  {
    question_number: 79,
    question_text: "In a contract of indemnity, the indemnifier's liability is",
    option_a: "absolute and unconditional",
    option_b: "conditional on the indemnified person's loss being proved",
    option_c: "limited to agreed damages only",
    option_d: "always limited to specified amount",
    correct_option: "B",
    subject: "Contract Law",
    explanation: "No explanation"
  },
  {
    question_number: 87,
    question_text: "The compensation for loss due to breach of contract is",
    option_a: "always equal to the agreed price",
    option_b: "estimated on the basis of actual loss and damage suffered",
    option_c: "at the discretion of the court",
    option_d: "limited to the amount specified in the agreement",
    correct_option: "B",
    subject: "Contract Law",
    explanation: "No explanation"
  }
]

// Sort by question number
questions.sort((a, b) => a.question_number - b.question_number)

// Write to JSON
writeFileSync('./aibe8_missing_9.json', JSON.stringify(questions, null, 2))

console.log(`✅ Manually extracted ${questions.length} questions`)
console.log(`Questions: ${questions.map(q => q.question_number).join(', ')}`)
