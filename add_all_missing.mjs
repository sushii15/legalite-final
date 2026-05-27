import { readFileSync, writeFileSync } from 'fs'

const existingQuestions = JSON.parse(readFileSync('./aibe16_questions.json', 'utf-8'))

const missingQs = [
  {
    question_number: 12,
    question_text: "A discrimination against a man or a woman, only on grounds of would be violative of Article 15(1)",
    option_a: "Sex",
    option_b: "Remuneration",
    option_c: "Place of birth",
    option_d: "Religion",
    correct_option: "A",
    subject: "Constitutional Law",
    explanation: "Article 15(1) prohibits discrimination on grounds of sex, among others."
  },
  {
    question_number: 28,
    question_text: "What is ad hoc arbitration?",
    option_a: "It is a proceeding administered by the parties themselves, with rules created solely for that specific case",
    option_b: "Parties make their own arrangement with respect to all aspects of the arbitration, including the laws and rules",
    option_c: "The seal of arbitration, the language, and the scope and issues to be resolved by means of arbitration",
    option_d: "(a) (b) (c)",
    correct_option: "D",
    subject: "ADR & Alternative Dispute Resolution",
    explanation: "All statements describe ad hoc arbitration."
  },
  {
    question_number: 29,
    question_text: "Which of the following Sections of the Civil Procedure Code define the Mesne Profit?",
    option_a: "Section 2(4)",
    option_b: "Section 2(14)",
    option_c: "Section 2(6)",
    option_d: "Section 2(12)",
    correct_option: "D",
    subject: "Civil Procedure",
    explanation: "Section 2(12) defines Mesne Profits."
  },
  {
    question_number: 30,
    question_text: "An advocate is under an obligation to uphold the rule of law. It was said in",
    option_a: "Hikmant ali khan Vs Ishwar Prasad Arya",
    option_b: "O.P. Sharma Vs high court of Punjab Haryana",
    option_c: "L.D. Jaikwal Vs state of Uttar Pradesh",
    option_d: "Shamsher singh bedi Vs High court of Punjab Haryana",
    correct_option: "B",
    subject: "Professional Conduct",
    explanation: "The O.P. Sharma case establishes the advocate's duty to uphold rule of law."
  },
  {
    question_number: 32,
    question_text: "The verification of the registered office shall be furnished to the registrar within a period of incorporation",
    option_a: "30 days",
    option_b: "60 days",
    option_c: "90 days",
    option_d: "120 days",
    correct_option: "A",
    subject: "Company Law",
    explanation: "Section 12(4) of Companies Act specifies 30 days."
  },
  {
    question_number: 35,
    question_text: "Which of the following cases can be cured under section 465 of the code of criminal procedure, 1973?",
    option_a: "Entertaining of complaint without complying with section 195 and 340",
    option_b: "The reading and recording of evidence in one case into another",
    option_c: "The examination of witness in absence of the accused",
    option_d: "Non Compliance with 235(2)",
    correct_option: "D",
    subject: "Criminal Procedure",
    explanation: "Section 465 can cure procedural errors; non-compliance with Section 235(2) is curable."
  },
  {
    question_number: 39,
    question_text: "Z, under the influence of madness, attempts to kill X. Is Z guilty of an offence?",
    option_a: "Z has not committed any offence and X has the same right of private defence",
    option_b: "As per Section 98 of IPC, X has committed an offence and no right of private defence",
    option_c: "Z has committed an offence for not using his mind",
    option_d: "None above",
    correct_option: "A",
    subject: "Criminal Law",
    explanation: "Section 84 excludes insane persons; Section 98 grants private defence rights regardless."
  },
  {
    question_number: 41,
    question_text: "Section 65, Indian Evidence Act lays down:",
    option_a: "A notice must be given before secondary evidence",
    option_b: "Notice to produce must be in writing",
    option_c: "CPC Order XI Rules 15 prescribes notice type",
    option_d: "All of them",
    correct_option: "D",
    subject: "Evidence Law",
    explanation: "All are correct procedural requirements."
  },
  {
    question_number: 69,
    question_text: "Freedom of Residence under Article 19 of the Indian Constitution is available in which clause?",
    option_a: "Clause (1) (e)",
    option_b: "Clause (1) (d)",
    option_c: "Clause (1) (b)",
    option_d: "Clause (1) (c)",
    correct_option: "A",
    subject: "Constitutional Law",
    explanation: "Article 19(1)(e) grants freedom to reside and settle."
  },
  {
    question_number: 83,
    question_text: "How many kinds of presumptions are there as classified by the Supreme Court?",
    option_a: "Permissive presumptions or presumptions of facts",
    option_b: "Compelling presumptions or presumptions of law",
    option_c: "Irrebuttable presumptions of law or conclusive presumptions",
    option_d: "All of them",
    correct_option: "D",
    subject: "Evidence Law",
    explanation: "Three main types of presumptions exist."
  },
  {
    question_number: 92,
    question_text: "Every person who is a member of a defence service holds office during the pleasure of",
    option_a: "Prime Minister",
    option_b: "President",
    option_c: "Council of Minister",
    option_d: "Both (A) and (B)",
    correct_option: "B",
    subject: "Constitutional Law",
    explanation: "Article 310(1) states pleasure of the President."
  },
  {
    question_number: 96,
    question_text: "A Railway servant was killed in a bus accident during employment. Compensation may be claimed under",
    option_a: "The Motor Vehicle Act",
    option_b: "The Employees Compensation Act, 1923",
    option_c: "Both (a) and (b)",
    option_d: "Either under (a) OR under (b)",
    correct_option: "D",
    subject: "Labour & Employment Law",
    explanation: "Election of remedies applies; choose one statute."
  },
  {
    question_number: 97,
    question_text: "Casting Couch in Bollywood is an example of",
    option_a: "sexual assault",
    option_b: "sexual harassment",
    option_c: "both (a) and (b)",
    option_d: "None of the above",
    correct_option: "B",
    subject: "General Law",
    explanation: "It is quid pro quo sexual harassment."
  }
]

const allQuestions = [...existingQuestions]
const existingNums = new Set(existingQuestions.map(q => q.question_number))

missingQs.forEach(q => {
  if (!existingNums.has(q.question_number)) {
    allQuestions.push(q)
  }
})

allQuestions.sort((a, b) => a.question_number - b.question_number)
writeFileSync('./aibe16_questions.json', JSON.stringify(allQuestions, null, 2))

console.log(`✅ Merged all questions`)
console.log(`Total questions: ${allQuestions.length}`)

const nums = new Set(allQuestions.map(q => q.question_number))
const missing = []
for (let i = 1; i <= 100; i++) {
  if (!nums.has(i)) missing.push(i)
}
if (missing.length > 0) {
  console.log(`Still missing: ${missing.join(', ')}`)
} else {
  console.log(`✅ All 100 questions present!`)
}
