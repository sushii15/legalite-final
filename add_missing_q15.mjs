import { readFileSync, writeFileSync } from 'fs'

// Read existing JSON
const existingQuestions = JSON.parse(readFileSync('./aibe15_questions.json', 'utf-8'))

// Add missing questions manually
const missingQs = [
  {
    question_number: 8,
    question_text: "The Arbitration Act 1996 repeals:",
    option_a: "The Arbitration Act, 1940",
    option_b: "The Arbitration (Protocol and Convention) Act, 1937",
    option_c: "The Foreign Awards (Recognition and Enforcement) Act, 1961",
    option_d: "All of the above",
    correct_option: "D",
    subject: "ADR & Alternative Dispute Resolution",
    explanation: "The Arbitration and Conciliation Act, 1996, was enacted to consolidate and amend the law relating to arbitration in India. It replaced several older statutes including the Arbitration Act of 1940, the Arbitration (Protocol and Convention) Act of 1937, and the Foreign Awards (Recognition and Enforcement) Act, 1961."
  },
  {
    question_number: 11,
    question_text: "X, Y, Z jointly promise to pay A an amount of Rs. 50,000/- Subsequently X, Y became untraceable. Can A compel Z to pay?",
    option_a: "A can, under Section 43 para 1",
    option_b: "A can under Section 49 para 1",
    option_c: "A cannot and will have to wait till X, Y become traceable",
    option_d: "Z can be compelled only for one third",
    correct_option: "A",
    subject: "Contract Law",
    explanation: "When multiple parties promise to pay an amount jointly, they are liable jointly and severally for the entire amount. If one party becomes untraceable, the other parties remain liable. Section 43 of the Indian Contract Act provides that when a joint promise is made, the creditor can compel any of the joint promisors to perform the promise. In this case, even though X and Y are untraceable, Z can be compelled to pay the full amount under joint liability provisions."
  },
  {
    question_number: 21,
    question_text: "A Hindu wife had been living with her children and all the children had been brought up by her without any assistance and help from the husband for many years. The wife was entitled to separate residence and maintenance under:",
    option_a: "Section 18 (2) (f) of Hindu Adoptions and Maintenance Act",
    option_b: "Section 18 (2) (d) of Hindu Adoptions and Maintenance Act",
    option_c: "Section 18 (2) (a) of Hindu Adoptions and Maintenance Act",
    option_d: "Section 18 (2) (g) of Hindu Adoptions and Maintenance Act",
    correct_option: "A",
    subject: "Family Law",
    explanation: "Section 18 of the Hindu Adoptions and Maintenance Act, 1956, allows for a Hindu wife to claim maintenance and separate residence if her husband is guilty of cruelty or other conditions that impair her right to live together with him. Section 18 (2)(f) specifically provides grounds under which the wife is entitled to separate maintenance if she has been living separately from her husband for a long period due to his cruelty, neglect, or desertion."
  },
  {
    question_number: 28,
    question_text: "National Green Tribunal cannot exercise its jurisdiction with reference to:",
    option_a: "Wildlife (Protection) Act, 1972",
    option_b: "Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006",
    option_c: "The Public Liability Insurance Act, 1991",
    option_d: "both A & B",
    correct_option: "C",
    subject: "Environmental Law",
    explanation: "The National Green Tribunal (NGT) was established under the National Green Tribunal Act, 2010, with the purpose of handling matters related to environmental protection and conservation of forests, wildlife, and other natural resources. The NGT has jurisdiction over environmental matters, including the Wildlife (Protection) Act, 1972, and the Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006. However, the NGT does not have jurisdiction over the Public Liability Insurance Act, 1991, which primarily deals with liability for accidents or incidents causing harm to human beings or property."
  },
  {
    question_number: 31,
    question_text: "\"From a plain reading of Section 195 Cr.P.C., it is manifest that it comes into operation at the stage when the Court intends to take cognizance of an offence under Section 190(1) Cr.P.C.; and it has nothing to do with the statutory power of the police to investigate into an F.I.R. which discloses a cognizable offence.... In other words, the statutory power of the Police to investigate under the Code is not in any way controlled or circumscribed by Section 195 Cr.P.C.\" - This was held by the Supreme Court in the case of:",
    option_a: "Nalini Vs State of Tamilnadu",
    option_b: "Raj Singh Vs State [(1989)]",
    option_c: "Shamsher Singh Vs State of Punjab",
    option_d: "State of Himachal Pradesh Vs Tara Dutta",
    correct_option: "C",
    subject: "Criminal Procedure",
    explanation: "In the case of Shamsher Singh Vs State of Punjab, the Supreme Court clarified that the statutory power of the police to investigate is not controlled by Section 195 Cr.P.C. The Court held that Section 195 of the Criminal Procedure Code comes into operation at the stage when the Court intends to take cognizance of an offence, and it has nothing to do with the police's power to investigate a cognizable offence disclosed in an FIR."
  },
  {
    question_number: 37,
    question_text: "The Supreme Court invoked the principle of `Transformative Constitutionalism' in the case of:",
    option_a: "Navtej Singh Johar Vs Union of India (2018)",
    option_b: "Suresh Kumar Koushal Vs Naz Foundation (2010)",
    option_c: "Naz Foundation Vs Government of NCT of Delhi (2009)",
    option_d: "Aruna Roy Vs Union of India, (2002)",
    correct_option: "A",
    subject: "Constitutional Law",
    explanation: "The principle of Transformative Constitutionalism refers to the notion that the Constitution should be interpreted in a way that fosters social change and equality. In Navtej Singh Johar Vs Union of India (2018), the Supreme Court of India invoked the principle of transformative constitutionalism to decriminalize Section 377 of the Indian Penal Code. The Court held that the law violated the fundamental rights of LGBTQ+ individuals, thereby bringing about transformative change in the legal landscape."
  },
  {
    question_number: 52,
    question_text: "The definition of Contract is defined under:",
    option_a: "Section 2(a) of the Indian Contract Act",
    option_b: "Section 2(h) of the Indian Contract Act",
    option_c: "Section 2(d) of the Indian Contract Act",
    option_d: "Section 2(g) of the Indian Contract Act",
    correct_option: "C",
    subject: "Contract Law",
    explanation: "According to Section 2(d) of the Indian Contract Act, a contract is defined as an agreement that is enforceable by law. This section provides the basic definition of a contract in legal terms. Section 2(a) defines a contract as an agreement, but it does not specify the enforceability aspect. Section 2(h) defines 'agreement' and includes conditions necessary for an agreement to become a contract."
  },
  {
    question_number: 55,
    question_text: "A, with the intention of causing Z to be convicted of a criminal conspiracy, writes a letter in imitation of Z's handwriting, purporting to be addressed to an accomplice in such criminal conspiracy, and puts the letter in a place which he knows that the officers of the police are likely to search. A has committed an offence under:",
    option_a: "Section 256 of IPC",
    option_b: "Section 192 of IPC",
    option_c: "Section 195 of IPC",
    option_d: "Section 201 of IPC",
    correct_option: "C",
    subject: "Criminal Law",
    explanation: "Section 195 of the Indian Penal Code deals with the fabrication of false evidence or forging of documents to cause a person to be convicted of a crime. By writing a false letter in imitation of Z's handwriting and putting it in a place where the police are likely to find it, A is attempting to influence the criminal conspiracy investigation by misleading the authorities. This constitutes fabricating false evidence under Section 195."
  },
  {
    question_number: 65,
    question_text: "According to Justice 'Abbot Parry' what are the \"Seven Lamps of Advocacy\":",
    option_a: "(i) Honesty (ii) Courage (iii) professionalism (iv) Wit (v) Eloquence, (vi) Judgment and (vii) Fellowship",
    option_b: "(i) Honesty (ii) Courage (iii) Industry (iv) Wit (v) Eloquence, (vi) Judgment and (vii) Fellowship",
    option_c: "(i) Influence (ii) Courage (iii) Industry (iv) Wit (v) Eloquence, (vi) Judgment and (vii) Fellowship",
    option_d: "(i) Honesty (ii) Courage (iii) Industry (iv) seriousness (v) Eloquence, (vi) Judgment and (vii) Fellowship",
    correct_option: "B",
    subject: "Professional Conduct",
    explanation: "Justice Abbot Parry famously stated the Seven Lamps of Advocacy that serve as guiding principles for an advocate. These principles emphasize the qualities that make an advocate successful and ethical in the legal profession. The Seven Lamps are: (i) Honesty, (ii) Courage, (iii) Industry, (iv) Wit, (v) Eloquence, (vi) Judgment, and (vii) Fellowship. These elements encapsulate the core values and attributes essential for an advocate to succeed and serve their clients effectively."
  },
  {
    question_number: 68,
    question_text: "The Supreme Court has legalised living wills and passive euthanasia subject to certain conditions in the case of:",
    option_a: "Aruna Ramachandra Shanbaug Vs Union of India (2011)",
    option_b: "Common Cause Vs Union of India, (2018) 5 SCC 1",
    option_c: "Gian Kaur Vs State of Punjab (1996)",
    option_d: "D Chenna Jagadeeswar Vs State of A.P. (1988)",
    correct_option: "B",
    subject: "Constitutional Law",
    explanation: "In Common Cause Vs Union of India (2018), the Supreme Court of India legalised living wills and passive euthanasia, subject to certain safeguards and conditions. The Court held that a person has the right to refuse medical treatment under the right to live with dignity, and passive euthanasia could be allowed if the individual is terminally ill and there is no hope for recovery."
  },
  {
    question_number: 70,
    question_text: "Right to know the antecedents of the candidates in the election flow from:",
    option_a: "Article 19 (1)(a)",
    option_b: "Article 20",
    option_c: "Article 13",
    option_d: "Article 14",
    correct_option: "A",
    subject: "Constitutional Law",
    explanation: "Article 19(1)(a) of the Indian Constitution guarantees freedom of speech and expression. The Right to Information (RTI), including the right to know the antecedents of candidates in elections, falls under this article as part of the freedom of expression and the public's right to make informed choices in democratic elections."
  },
  {
    question_number: 73,
    question_text: "Provisions relating to GST are inserted in the Constitution by:",
    option_a: "The Constitution (one hundred and first) Act 2016",
    option_b: "The Constitution (one hundred and second) Act 2016",
    option_c: "The Constitution (eighty fourth) Act 2016",
    option_d: "The Constitution (seventy seven) Act 2016",
    correct_option: "A",
    subject: "Constitutional Law",
    explanation: "The Goods and Services Tax (GST) was introduced in India through the 101st Amendment to the Constitution, which was passed in 2016. This amendment inserted provisions related to GST into the Indian Constitution, giving legal framework to the new indirect tax system."
  },
  {
    question_number: 100,
    question_text: "A marriage between a girl of 22 years marries her maternal uncle's son of 23 years in accordance with the Special Marriage Act. Such marriage is:",
    option_a: "Valid",
    option_b: "Voidable",
    option_c: "Void",
    option_d: "Valid only in north India",
    correct_option: "A",
    subject: "Family Law",
    explanation: "Under the Special Marriage Act, 1954, marriages are recognized irrespective of religion or caste, as long as they meet the necessary legal requirements. The Act permits marriage between persons who are not within the prohibited degrees of relationship. The marriage described involves a girl of 22 years marrying her maternal uncle's son, which is not prohibited under the Special Marriage Act. The marriage is valid as long as both parties have the legal capacity to marry."
  }
]

// Merge with existing and remove duplicates
const allQuestions = [...existingQuestions]
const existingNums = new Set(existingQuestions.map(q => q.question_number))

missingQs.forEach(q => {
  if (!existingNums.has(q.question_number)) {
    allQuestions.push(q)
  }
})

// Sort by question number
allQuestions.sort((a, b) => a.question_number - b.question_number)

// Write back
writeFileSync('./aibe15_questions.json', JSON.stringify(allQuestions, null, 2))

console.log(`✅ Merged all questions`)
console.log(`Total questions: ${allQuestions.length}`)

// Show which are still missing
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
