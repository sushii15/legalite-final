import { readFileSync, writeFileSync } from 'fs'

// Read existing JSON
const existingQuestions = JSON.parse(readFileSync('./aibe16_questions.json', 'utf-8'))

// Question 100 data extracted from raw text
const q100 = {
  question_number: 100,
  question_text: "Law laid down under section -73 of Indian Contract Act 1872 is related to which of the following cases:",
  option_a: "Hothester Vs De-la-tur",
  option_b: "Rabinson Vs Devison",
  option_c: "Hedley Vs Baxendal",
  option_d: "Dikinson Vs Dads",
  correct_option: "C",
  subject: "Contract Law",
  explanation: "Section 73 of the Indian Contract Act, 1872, deals with compensation for loss or damage caused by a breach of contract. It lays down the rule for measuring damages, stating that the aggrieved party is entitled to compensation for any loss which naturally arose in the usual course of things from such breach, or which the parties knew, when they made the contract, to be likely to result from the breach of it. This principle of 'remoteness of damages' is directly derived from the rules laid down in the famous English case of Hadley v. Baxendale (1854)."
}

// Question 99 data
const q99 = {
  question_number: 99,
  question_text: "The maxim 'actus non facit reum nisi mens sit rea' means",
  option_a: "There can be no crime without a guilty mind",
  option_b: "Crime has to be coupled with guilty mind",
  option_c: "Crime is the result of guilty mind",
  option_d: "In crime intention is relevant, motive is irrelevant",
  correct_option: "A",
  subject: "Criminal Law",
  explanation: "'Actus non facit reum nisi mens sit rea' is a fundamental maxim of criminal law. It translates to 'an act does not make a man guilty unless his mind is also guilty.' This means that to constitute a crime, there must be a combination of two elements: Actus Reus (the guilty act or physical element) and Mens Rea (the guilty mind or mental element such as intention, knowledge, or recklessness)."
}

// Add missing questions
const allQuestions = existingQuestions.filter(q => q.question_number !== 99)
allQuestions.push(q99)
allQuestions.push(q100)

// Sort by question number
allQuestions.sort((a, b) => a.question_number - b.question_number)

// Write back
writeFileSync('./aibe16_questions.json', JSON.stringify(allQuestions, null, 2))

console.log(`✅ Added missing questions 99 and 100`)
console.log(`Total questions: ${allQuestions.length}`)
