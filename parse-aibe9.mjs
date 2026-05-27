import { readFileSync, writeFileSync } from 'fs'

const aibeText = readFileSync('./aibe9_extracted.txt', 'utf-8')

// Split by lines
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

const questions = []

// Process line by line
let i = 0
while (i < lines.length) {
  const line = lines[i].trim()

  // Check if this line starts a question (format: "N. ")
  const qMatch = line.match(/^(\d{1,3})\.\s+(.+)$/)
  if (qMatch) {
    const questionNum = parseInt(qMatch[1])
    if (questionNum < 1 || questionNum > 100) {
      i++
      continue
    }

    let questionText = qMatch[2]
    let optionA, optionB, optionC, optionD, correctOption, explanation

    // Read next lines to find options
    i++
    let foundOptions = false
    let optionsLine = ''

    // Skip blank lines and page numbers
    while (i < lines.length) {
      const nextLine = lines[i].trim()

      // Skip blank lines
      if (nextLine === '') {
        i++
        continue
      }

      // Skip page numbers (single or double digits that are standalone)
      if (nextLine.match(/^\d{1,2}$/) && nextLine.length <= 2) {
        i++
        continue
      }

      // Check for options - they contain "(A)" or "(a)"
      if (nextLine.match(/\([A-D]\)/i)) {
        optionsLine = nextLine
        foundOptions = true
        i++
        break
      }

      // If we hit "Correct Answer" without finding options, skip this question
      if (nextLine.startsWith('Correct Answer')) {
        break
      }

      // Continue reading question text if it's not options yet
      questionText += ' ' + nextLine
      i++
    }

    if (!foundOptions) {
      continue
    }

    // Parse options from the single line (format: (A) text (B) text (C) text (D) text)
    const optionAMatch = optionsLine.match(/\(A\)\s+([^\(]+?)(?=\(B\))/i)
    const optionBMatch = optionsLine.match(/\(B\)\s+([^\(]+?)(?=\(C\))/i)
    const optionCMatch = optionsLine.match(/\(C\)\s+([^\(]+?)(?=\(D\))/i)
    const optionDMatch = optionsLine.match(/\(D\)\s+([^\(]+?)$/i)

    if (!optionAMatch || !optionBMatch || !optionCMatch || !optionDMatch) {
      // Try lowercase
      const optionAMatch2 = optionsLine.match(/\(a\)\s+([^\(]+?)(?=\(b\))/i)
      const optionBMatch2 = optionsLine.match(/\(b\)\s+([^\(]+?)(?=\(c\))/i)
      const optionCMatch2 = optionsLine.match(/\(c\)\s+([^\(]+?)(?=\(d\))/i)
      const optionDMatch2 = optionsLine.match(/\(d\)\s+([^\(]+?)$/i)

      if (!optionAMatch2 || !optionBMatch2 || !optionCMatch2 || !optionDMatch2) {
        continue
      }

      optionA = optionAMatch2[1].trim()
      optionB = optionBMatch2[1].trim()
      optionC = optionCMatch2[1].trim()
      optionD = optionDMatch2[1].trim()
    } else {
      optionA = optionAMatch[1].trim()
      optionB = optionBMatch[1].trim()
      optionC = optionCMatch[1].trim()
      optionD = optionDMatch[1].trim()
    }

    // Now find Correct Answer and Solution
    while (i < lines.length) {
      const nextLine = lines[i].trim()

      if (nextLine.startsWith('Correct Answer')) {
        // Extract the answer letter
        const correctMatch = nextLine.match(/Correct Answer:\s*\(?([A-D])\)?/i)
        if (correctMatch) {
          correctOption = correctMatch[1].toUpperCase()
        }

        // Now find Solution
        i++
        let solutionText = ''
        while (i < lines.length) {
          const sLine = lines[i].trim()

          if (sLine.startsWith('Quick Tip')) {
            // End of solution
            break
          }

          if (sLine === '' || sLine.match(/^\d{1,2}$/)) {
            // Skip blank lines and page numbers
            i++
            continue
          }

          if (sLine.startsWith('Solution') || sLine.startsWith('Solution:')) {
            i++
            continue
          }

          solutionText += ' ' + sLine
          i++
        }

        explanation = solutionText.trim().substring(0, 500) || 'No explanation provided'
        break
      }

      i++
    }

    // Add question to array
    if (correctOption && optionA && optionB && optionC && optionD) {
      const subject = getSubject(questionText)

      questions.push({
        question_number: questionNum,
        question_text: questionText.trim(),
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_option: correctOption,
        subject: subject,
        explanation: explanation
      })
    }
  }

  i++
}

// Sort by question number
questions.sort((a, b) => a.question_number - b.question_number)

// Write to JSON
writeFileSync('./aibe9_questions.json', JSON.stringify(questions, null, 2))

console.log(`✅ Parsed AIBE 9`)
console.log(`Total questions extracted: ${questions.length}`)

// Show which are missing
const nums = new Set(questions.map(q => q.question_number))
const missing = []
for (let i = 1; i <= 100; i++) {
  if (!nums.has(i)) missing.push(i)
}
if (missing.length > 0) {
  console.log(`Missing: ${missing.join(', ')}`)
} else {
  console.log(`✅ All 100 questions present!`)
}
