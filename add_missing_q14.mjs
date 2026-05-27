import { readFileSync, writeFileSync } from 'fs'

// Read existing JSON
const existingQuestions = JSON.parse(readFileSync('./aibe14_questions.json', 'utf-8'))

// Add missing questions manually
const missingQs = [
  {
    question_number: 2,
    question_text: "Assertion (A): Collateral transactions to wagering are valid. Reason (R): only wagering agreements are declared void under section 30 of the Indian contract Act.",
    option_a: "(a) is true, but (r) is false.",
    option_b: "(a) is false, but (r) is true.",
    option_c: "Both (a) and (r) are true, but (r) is not correct explanation of (a)",
    option_d: "Both (a) and (r) are true, and (r) is correct explanation of (a)",
    correct_option: "D",
    subject: "Contract Law",
    explanation: "Section 30 of the Indian Contract Act, 1872, declares wagering agreements to be void, meaning they are unenforceable but not illegal. Because the main agreement is not illegal, transactions that are collateral (or subsidiary) to it are not tainted with illegality and remain valid and enforceable. Both are true, and (R) is the correct explanation for (A)."
  },
  {
    question_number: 5,
    question_text: "The Concept of 'Curative' Petition was introduced by the Supreme Court of India in the case of",
    option_a: "Rupa Ashok Hura V/s Ashok Hura,AIR 2002 SC 1771",
    option_b: "M.C.Mehta V/s Union of India, AIR 1987 SC 1087",
    option_c: "Krishna Swami V/s Union of India, (1992) 45 CC 605",
    option_d: "Sheela Barse V/s Union of India, (1986) 35 CC 5962",
    correct_option: "A",
    subject: "Constitutional Law",
    explanation: "The concept of a 'Curative Petition' was evolved by the Supreme Court in the landmark case of Rupa Ashok Hurra v. Ashok Hurra (2002). It serves as the final and ultimate remedy for justice against a final judgment of the Supreme Court, available even after a review petition has been dismissed. The court created this remedy using its inherent powers to prevent the abuse of its process and to cure a gross miscarriage of justice."
  },
  {
    question_number: 6,
    question_text: "Right to Fair Legal Aid was recognised as a Fundamental Right under Article 21 of Indian Constitution in the case of",
    option_a: "Hussaainara Khatoon V/s State of Bihar, AIR 1979 SC 1360",
    option_b: "M.H Hoskot V/s State of Maharashtra, AIR 1978 SC 1548",
    option_c: "Madhu Mehta V/s Union of India (1989) 4 SC 1548",
    option_d: "Rudal Shah V/s State of Bihar (1983) 45 SC 14",
    correct_option: "B",
    subject: "Constitutional Law",
    explanation: "In M.H. Hoskot v. State of Maharashtra (1978), Justice Krishna Iyer held that the right to a fair, just and reasonable procedure under Article 21 is meaningless without legal representation for the poor. Therefore, free legal aid was recognized as an essential and enforceable part of Article 21. The later case of Hussainara Khatoon strongly reiterated this principle in the context of undertrial prisoners."
  },
  {
    question_number: 20,
    question_text: "Supreme Court of India held that it is permanent obligation of every member of medical profession either government or private to give medical aid to every injured person brought for treatment immediately without waiting for procedural formalities in the case of",
    option_a: "Common Cause V/s Union of India (1996) 1 SC 753",
    option_b: "Peoples Union of India, AIR 1983 SC 339",
    option_c: "Parmanand Katara V/s Union of India, AIR 1989 SC 2039",
    option_d: "Lakshmi Kant Pandey V/s Union of India (1984) 25 SC 244",
    correct_option: "C",
    subject: "Constitutional Law",
    explanation: "In the landmark case of Parmanand Katara v. Union of India (1989), the Supreme Court elevated the professional obligation of doctors to a legal duty enforceable under Article 21 of the Constitution. The court held that every doctor, whether at a government or a private hospital, has a professional duty to extend medical assistance to an injured person to preserve life without waiting for legal formalities like a police report."
  },
  {
    question_number: 21,
    question_text: "The Supreme Court of India has issued the direction to make the CBI independent agency so that it can function more effectively and investigate Crimes and Corruptions at high places in public life in the Case of",
    option_a: "Union of India V/s Association For democratic reforms, AIR 2002 SC 2112",
    option_b: "Bangalore medical Trust V/s B.S Muddappa (1991) 45 SC 54",
    option_c: "Vincent Panikurlangra V/s Union of India (1987) 2 SC 165",
    option_d: "Vincent Narayan V/s Union of India, AIR 1998 SC 889",
    correct_option: "D",
    subject: "Constitutional Law",
    explanation: "In the case of Vineet Narain & Others v. Union of India (famously known as the Jain Hawala case), the Supreme Court expressed deep concern over the executive's interference in the functioning of the CBI. The Court issued directives including fixing a two-year tenure for the CBI Director and placing the supervision of the CBI under the Central Vigilance Commission instead of the executive."
  },
  {
    question_number: 29,
    question_text: "Which of the following statements are true? i. Minor's contract can be ratified on attaining majority ii. Minor's contact be ratified on attaining majority iii. Minor's contract can be ratified jointly by both the parties to the contract. iv. Minor is not liable under minor's contract",
    option_a: "(i) and (iii)",
    option_b: "(ii) and (iv)",
    option_c: "(i) and (ii)",
    option_d: "(ii) and (iii)",
    correct_option: "B",
    subject: "Contract Law",
    explanation: "A minor's contract is void ab initio (void from the beginning) under Section 11 of the Indian Contract Act, as established in Mohori Bibee v. Dharmodas Ghose. Since the contract is void from the start, it cannot be ratified by the minor upon attaining majority. A new contract must be formed. Only statement (iv) is true - a minor is not liable under a void contract."
  },
  {
    question_number: 34,
    question_text: "Under which of the following sections of CrPC provisions relating to police report is given?",
    option_a: "Section 173 (2) (i)",
    option_b: "Section 177",
    option_c: "Section 174 (2) (i) v",
    option_d: "Section 175",
    correct_option: "A",
    subject: "Criminal Procedure",
    explanation: "Section 173 of the Code of Criminal Procedure, 1973 deals with the Report of police officer on completion of investigation. Subsection (2) of Section 173 mandates that the officer-in-charge shall forward this report to a Magistrate empowered to take cognizance, commonly known as the chargesheet or final report."
  },
  {
    question_number: 49,
    question_text: "Section 2(j) of the Industrial Disputes Act, 1947 define 'Industry' means any i.Business trade, undertaking ii.Manufacture or calling of iii. Included any calling, service, employment, handicraft iv. Industrial occupation of workmen",
    option_a: "(i) and (ii)",
    option_b: "(i), (ii) and (iii)",
    option_c: "(iii)and (iv)",
    option_d: "All of the above",
    correct_option: "D",
    subject: "Labour & Employment Law",
    explanation: "The definition of 'Industry' in Section 2(j) of the Industrial Disputes Act, 1947, is extremely broad. It means 'any business, trade, undertaking, manufacture or calling of employers' and includes 'any calling, service, employment, handicraft, or industrial occupation or avocation of workmen'. Therefore, all the listed activities are part of the comprehensive definition."
  },
  {
    question_number: 50,
    question_text: "Which of the following provisions of the Hindu Marriage Act, 1955 incorporates the fault theory of divorce?",
    option_a: "Section 13(1)",
    option_b: "Section 11",
    option_c: "Section 13B",
    option_d: "Section 13(2)",
    correct_option: "A",
    subject: "Family Law",
    explanation: "Section 13(1) of the Hindu Marriage Act, 1955, is the primary provision embodying the fault theory of divorce. It lists several fault-based grounds for divorce, such as adultery, cruelty, desertion, conversion to another religion, and incurable leprosy. Section 13B provides for divorce by mutual consent (no-fault theory)."
  },
  {
    question_number: 53,
    question_text: "'A' places men with firearms at the outlets of a building and tells 'Z' that they will fire at 'Z' if 'Z' attempts to leave the building 'A' is:",
    option_a: "Wrongfully restrains Z",
    option_b: "Wrongfully confines Z",
    option_c: "Both A & B",
    option_d: "None of the above",
    correct_option: "B",
    subject: "Criminal Law",
    explanation: "By blocking all outlets of the building, 'A' has completely prevented 'Z' from proceeding in any direction beyond the confines of the building. Wrongful Confinement (S. 340) restrains a person in a way that prevents them from moving beyond certain defined limits, which is a total restraint. This is distinct from wrongful restraint, which is a partial restraint on movement in one direction."
  },
  {
    question_number: 54,
    question_text: "'A' incites a dog to spring upon 'Z', without Z's consent. If 'A' intends to cause injury, fear or annoyance to 'Z'",
    option_a: "'A' uses force to 'Z'",
    option_b: "'A' assaulted 'Z'",
    option_c: "'A' uses criminal force to 'Z'",
    option_d: "None of the above",
    correct_option: "C",
    subject: "Criminal Law",
    explanation: "Force (S. 349) is caused by inducing any animal to move. Criminal Force (S. 350) is using force intentionally without consent, intending to cause injury, fear, or annoyance. By inciting the dog with such intent, 'A' uses criminal force. Assault (S. 351) is merely the apprehension of force, whereas here the force is actually applied."
  },
  {
    question_number: 55,
    question_text: "'A' causes cattle to enter upon the field belonging to 'Z', intending to cause and knowing that he is likely to cause damage to 'Z's' crop. 'A' has committed:",
    option_a: "Mischief",
    option_b: "Criminal trespassing",
    option_c: "Criminal breach of trust",
    option_d: "Extortion",
    correct_option: "A",
    subject: "Criminal Law",
    explanation: "This act fits the definition of 'Mischief' under Section 425 of the IPC. The essential ingredients are: intending to cause wrongful loss or damage, and causing destruction or change in property that diminishes its value or utility. By causing cattle to damage Z's crop, A intentionally caused a change that diminishes the crop's value."
  },
  {
    question_number: 58,
    question_text: "Which of the following provisions of the Advocates Act, 1961 provides for the power of Bar Council of India to withdraw to itself, any proceedings for disciplinary action pending before any State Bar Council:",
    option_a: "Section 35",
    option_b: "Section 37",
    option_c: "Section 36(2)",
    option_d: "None of the Above",
    correct_option: "C",
    subject: "Professional Conduct",
    explanation: "Section 36(2) of the Advocates Act gives the BCI the power to withdraw for inquiry before itself any disciplinary proceedings pending against any advocate before a State Bar Council and dispose of the same. This is an oversight power to ensure fairness or address cases of national importance."
  },
  {
    question_number: 85,
    question_text: "Which of the following sections of the Indian Succession Act, 1925, deals with the rules of intestate succession for Hindus?",
    option_a: "Section 29",
    option_b: "Section 30",
    option_c: "Section 31",
    option_d: "Section 32",
    correct_option: "None",
    subject: "Family Law",
    explanation: "The Indian Succession Act, 1925, does not govern the intestate succession of Hindus. Section 2(2) of the Act explicitly excludes Hindus from its intestate succession provisions. The intestate succession for Hindus is governed by the Hindu Succession Act, 1956, not the Indian Succession Act, 1925."
  },
  {
    question_number: 87,
    question_text: "Which of the following sections of the Limitation Act, 1963, prescribes the limitation period for filing a suit for recovery of movable property?",
    option_a: "Article 91",
    option_b: "Article 92",
    option_c: "Article 93",
    option_d: "Article 94",
    correct_option: "None",
    subject: "Civil Procedure",
    explanation: "The limitation period for suits relating to movable property is governed by Articles 68 and 69 in the Schedule to the Limitation Act, 1963, not Articles 91-94. Article 68 covers recovery of specific movable property lost or stolen, and Article 69 covers recovery of other specific movable property, both with a 3-year limitation period."
  },
  {
    question_number: 89,
    question_text: "Which of the following cases established the principle of 'absolute liability' in India?",
    option_a: "M.C. Mehta v. Union of India (Oleum Gas Leak Case)",
    option_b: "Rylands v. Fletcher",
    option_c: "Donoghue v. Stevenson",
    option_d: "Bhopal Gas Tragedy Case",
    correct_option: "A",
    subject: "Tort Law",
    explanation: "The principle of 'Absolute Liability' was established by the Supreme Court of India in M.C. Mehta v. Union of India (1987), also known as the Oleum Gas Leak Case. The court held that an enterprise engaged in a hazardous activity has an absolute and non-delegable duty to ensure no harm results, with no available exceptions unlike strict liability."
  },
  {
    question_number: 100,
    question_text: "Which of the following cases held that the right to privacy is a fundamental right under Article 21 of the Constitution?",
    option_a: "Maneka Gandhi v. Union of India",
    option_b: "Justice K.S. Puttaswamy v. Union of India",
    option_c: "Kharak Singh v. State of Uttar Pradesh",
    option_d: "Govind v. State of Madhya Pradesh",
    correct_option: "B",
    subject: "Constitutional Law",
    explanation: "The definitive and authoritative ruling came from the nine-judge Constitution Bench in Justice K.S. Puttaswamy (Retd.) v. Union of India (2017). The court unanimously held that the Right to Privacy is a fundamental right, protected as an intrinsic part of the Right to Life and Personal Liberty under Article 21. This landmark judgment overruled earlier decisions and firmly established privacy as a fundamental right."
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
writeFileSync('./aibe14_questions.json', JSON.stringify(allQuestions, null, 2))

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
