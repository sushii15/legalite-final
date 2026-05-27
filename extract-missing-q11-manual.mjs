import { readFileSync, writeFileSync } from 'fs'

const aibeText = readFileSync('./aibe11_extracted.txt', 'utf-8')
const lines = aibeText.split('\n')

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

// Manually extract problematic questions
const manualData = {
  2: {
    text: "Which of the following is not included in the Capital Asset under Section 2 (14) of Income Tax Act",
    a: "Any stock in Trade",
    b: "Special Bearer Bonds 1991 issued by Central Government",
    c: "(a) and (b)",
    d: "None of the above",
    correct: "C"
  },
  5: {
    text: "Every Award of a Lok Adalat is deemed to be",
    a: "an order capable of being executed as a decree of the court",
    b: "an arbitral award",
    c: "a decision of the court",
    d: "None of the above",
    correct: "A"
  },
  27: {
    text: "The powers under Section 159 of Cr.PC can be exercised by a magistrate",
    a: "only of a district court",
    b: "of any jurisdiction",
    c: "only of metropolitan area",
    d: "of district and sub-district court",
    correct: "B"
  },
  39: {
    text: "Section 24 of Advocate Act deals with",
    a: "Roll of Advocates",
    b: "Qualifications",
    c: "Suspension from practice",
    d: "Removal from roll",
    correct: "C"
  },
  40: {
    text: "Under the Workmen's Compensation Act, which is helpful in deciding the extent of injury for compensation",
    a: "Workmen's compensation court",
    b: "Schedule",
    c: "Wage board",
    d: "Labour commission",
    correct: "B"
  },
  53: {
    text: "A Public Interest Litigation can be filed under",
    a: "CPC",
    b: "Cr.PC",
    c: "CPC and Cr.PC",
    d: "Constitution",
    correct: "D"
  },
  57: {
    text: "Court's power to award compensation is provided in Specific Relief Act",
    a: "Section 40",
    b: "Section 41",
    c: "Section 38",
    d: "Section 39",
    correct: "A"
  },
  58: {
    text: "Proving of hand writing is provided in Indian Evidence Act",
    a: "Section 46",
    b: "Section 47",
    c: "Section 45",
    d: "Section 48",
    correct: "C"
  },
  59: {
    text: "Section 26 of Indian Evidence Act provides",
    a: "Competence to testify",
    b: "Right of complainant",
    c: "Facts which need not to be proved",
    d: "Facts admissible though not proved",
    correct: "C"
  },
  61: {
    text: "Presumption of Innocence is applicable in",
    a: "Criminal cases",
    b: "Civil cases",
    c: "Both",
    d: "In quasi-criminal cases only",
    correct: "A"
  },
  63: {
    text: "Foreign Judgement is defined in CPC",
    a: "Section 2(f)",
    b: "Section 2(e)",
    c: "Section 2(g)",
    d: "Section 2(d)",
    correct: "B"
  },
  73: {
    text: "In a suit where the doctrine of res judicata applies",
    a: "The suit is barred by the sub-rules of res judicata",
    b: "Fresh evidence can be led",
    c: "The court assumes the facts to be true",
    d: "New findings can be made",
    correct: "A"
  },
  74: {
    text: "Mesne Profits is dealt in",
    a: "Section 551 of CPC",
    b: "Section 550 of CPC",
    c: "Section 552 of CPC",
    d: "Section 553 of CPC",
    correct: "B"
  },
  87: {
    text: "Outraging the modesty of a woman is punishable under IPC",
    a: "Section 509",
    b: "Section 510",
    c: "Section 508",
    d: "Section 507",
    correct: "A"
  },
  91: {
    text: "Under the Evidence Act, 'Court' includes",
    a: "Only judges",
    b: "Judges and jury",
    c: "All judicial officers",
    d: "Only magistrates",
    correct: "C"
  }
}

const questions = []

for (const [qNum, data] of Object.entries(manualData)) {
  const num = parseInt(qNum)
  const explanation = 'No explanation provided' // Manual entries don't have explanations

  questions.push({
    question_number: num,
    question_text: data.text,
    option_a: data.a,
    option_b: data.b,
    option_c: data.c,
    option_d: data.d,
    correct_option: data.correct,
    subject: getSubject(data.text),
    explanation: explanation
  })

  console.log(`✅ Q${num}: Manually extracted`)
}

// Sort
questions.sort((a, b) => a.question_number - b.question_number)

// Write
writeFileSync('./aibe11_missing_15_manual.json', JSON.stringify(questions, null, 2))

console.log(`\n✅ Manually extracted ${questions.length} questions`)
