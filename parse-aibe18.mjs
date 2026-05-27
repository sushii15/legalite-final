import { readFileSync, writeFileSync } from 'fs'

// Read the extracted text file
const aibe18Text = readFileSync('C:\\Users\\sasha\\Downloads\\aibe18_text.txt', 'utf-8')

// Parse the questions - extract Q1-100
const lines = aibe18Text.split('\n')

// Find where questions start and answer key starts
let questionStart = -1
let answerKeyStart = -1

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Question 1:')) {
    questionStart = i
  }
  if (lines[i].includes('Set Code-A') && lines[i + 1] && lines[i + 1].includes('Answer Key')) {
    answerKeyStart = i + 1
    break
  }
}

console.log('Question start index:', questionStart)
console.log('Answer key start index:', answerKeyStart)

// Extract answer key
const answerKeyLine = lines[answerKeyStart]
const answerKeyCells = answerKeyLine.split(/\s+/).filter(cell => cell.match(/^[A-D&]+$/))

console.log('Answer key cells found:', answerKeyCells.length)
console.log('First 20 answers:', answerKeyCells.slice(0, 20))

// Subject categorization based on question content
const getSubject = (questionText) => {
  const lower = questionText.toLowerCase()

  if (lower.includes('constitution') || lower.includes('article ') || lower.includes('amendment')) {
    return 'Constitutional Law'
  } else if (lower.includes('penal code') || lower.includes('ipc') || lower.includes('murder') || lower.includes('theft') || lower.includes('hurt')) {
    return 'Criminal Law'
  } else if (lower.includes('criminal procedure') || lower.includes('crpc') || lower.includes('magistrate') || lower.includes('sessions judge')) {
    return 'Criminal Procedure'
  } else if (lower.includes('civil procedure') || lower.includes('cpc') || lower.includes('suit') || lower.includes('plaint')) {
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
  } else if (lower.includes('advocate') || lower.includes('bar council')) {
    return 'Professional Conduct'
  } else if (lower.includes('motor vehicle')) {
    return 'Motor Vehicles Act'
  } else if (lower.includes('consumer')) {
    return 'Consumer Law'
  } else if (lower.includes('information technology') || lower.includes('cyber') || lower.includes('electronic')) {
    return 'Information Technology Law'
  } else if (lower.includes('maternity') || lower.includes('factories') || lower.includes('industrial dispute')) {
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
const questionRegex = /^Question (\d+):\s+(.+?)(?=\(A\)|$)/ms

let questionCount = 0
for (let i = questionStart; i < answerKeyStart - 5; i++) {
  const line = lines[i]

  if (line.match(/^Question \d+:/)) {
    // Extract question number and text
    const match = line.match(/^Question (\d+):\s+(.+)$/)
    if (match) {
      const qNum = parseInt(match[1])
      const rest = match[2]

      // Extract the question text and options from this line and next lines
      let questionText = rest
      let optionA = '', optionB = '', optionC = '', optionD = ''

      // Parse options from the current and next lines
      const fullQuestion = lines.slice(i, Math.min(i + 10, answerKeyStart - 5)).join(' ')

      // Extract options using regex
      const optionMatches = fullQuestion.match(/\(A\)\s+([^(]+)\(B\)\s+([^(]+)\(C\)\s+([^(]+)\(D\)\s+([^(]+?)(?=\n|$)/s)

      if (optionMatches) {
        optionA = optionMatches[1].trim()
        optionB = optionMatches[2].trim()
        optionC = optionMatches[3].trim()
        optionD = optionMatches[4].trim()

        // Extract just the question text (before options)
        const optStart = fullQuestion.indexOf('(A)')
        questionText = fullQuestion.substring(0, optStart).trim()
      }

      // Get the correct answer
      const correctAnswer = answerKeyCells[qNum - 1]

      questions.push({
        question_number: qNum,
        question_text: questionText,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_option: correctAnswer && correctAnswer !== '' ? correctAnswer : null,
        subject: getSubject(questionText),
        explanation: null
      })

      questionCount++
    }
  }
}

console.log(`\nParsed ${questions.length} questions`)
console.log('First question:', questions[0])
console.log('Last question:', questions[questions.length - 1])

// Write to JSON file
writeFileSync(
  'C:\\Users\\sasha\\Downloads\\legalite-final\\aibe18_questions.json',
  JSON.stringify(questions, null, 2)
)

console.log('\n✅ AIBE 18 questions saved to aibe18_questions.json')
console.log(`Total questions: ${questions.length}`)
console.log(`Subject distribution:`)
const subjects = {}
questions.forEach(q => {
  subjects[q.subject] = (subjects[q.subject] || 0) + 1
})
Object.entries(subjects).sort((a, b) => b[1] - a[1]).forEach(([subj, count]) => {
  console.log(`  ${subj}: ${count}`)
})
