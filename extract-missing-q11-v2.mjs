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

// Missing questions
const missingQs = [2, 5, 11, 18, 26, 27, 39, 40, 53, 57, 58, 59, 61, 62, 63, 73, 74, 75, 84, 87, 91, 93, 97]

const questions = []

for (const qNum of missingQs) {
  // Find line with "N. Question text"
  let startIdx = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().match(new RegExp(`^${qNum}\\.\\s+`))) {
      startIdx = i
      break
    }
  }

  if (startIdx === -1) {
    console.log(`❌ Q${qNum}: Not found`)
    continue
  }

  // Collect question text and options
  let questionText = lines[startIdx].trim().replace(new RegExp(`^${qNum}\\.\\s+`), '')
  let optionA = '', optionB = '', optionC = '', optionD = '', correctOption = ''
  let i = startIdx + 1

  // Read following lines until we find all options and correct answer
  let foundAllOptions = false
  let optionBuffer = ''

  while (i < lines.length && !foundAllOptions) {
    const line = lines[i].trim()

    if (line === '' || line.match(/^\d{1,2}$/) || line.match(/^\d{1,3}$/)) {
      // Skip blank lines and page numbers
      i++
      continue
    }

    if (line.startsWith('Correct Answer')) {
      // Found correct answer
      const correctMatch = line.match(/Correct Answer:\s*\(?([A-D])\)?/i)
      if (correctMatch) {
        correctOption = correctMatch[1].toUpperCase()
      }
      foundAllOptions = true
      break
    }

    if (line.match(/\([A-D]\)/i)) {
      // Option line - accumulate until we have all 4 options
      optionBuffer += ' ' + line

      // Check if we have all 4 options now
      const aMatch = optionBuffer.match(/\(A\)\s+([^\(]+?)(?=\(B\))/i)
      const bMatch = optionBuffer.match(/\(B\)\s+([^\(]+?)(?=\(C\))/i)
      const cMatch = optionBuffer.match(/\(C\)\s+([^\(]+?)(?=\(D\))/i)
      const dMatch = optionBuffer.match(/\(D\)\s+([^\(]+?)$/i)

      if (aMatch && bMatch && cMatch && dMatch) {
        optionA = aMatch[1].trim()
        optionB = bMatch[1].trim()
        optionC = cMatch[1].trim()
        optionD = dMatch[1].trim()
      }
    } else if (line.startsWith('Solution') || line.startsWith('Step')) {
      // Reached solution without finding all options - use what we have
      if (optionA && optionB && optionC && optionD) {
        foundAllOptions = true
        break
      }
    } else if (!line.startsWith('Quick Tip')) {
      // Continue collecting question text if not yet at options
      if (!optionBuffer) {
        questionText += ' ' + line
      }
    }

    i++
  }

  // Try lowercase option patterns if uppercase failed
  if (!optionA && optionBuffer) {
    const aMatch = optionBuffer.match(/\(a\)\s+([^\(]+?)(?=\(b\))/i)
    const bMatch = optionBuffer.match(/\(b\)\s+([^\(]+?)(?=\(c\))/i)
    const cMatch = optionBuffer.match(/\(c\)\s+([^\(]+?)(?=\(d\))/i)
    const dMatch = optionBuffer.match(/\(d\)\s+([^\(]+?)$/i)

    if (aMatch && bMatch && cMatch && dMatch) {
      optionA = aMatch[1].trim()
      optionB = bMatch[1].trim()
      optionC = cMatch[1].trim()
      optionD = dMatch[1].trim()
    }
  }

  // Extract explanation from Solution section
  let explanation = 'No explanation'
  while (i < lines.length) {
    const line = lines[i].trim()

    if (line.startsWith('Solution') || line.startsWith('Explanation')) {
      i++
      let expText = ''
      while (i < lines.length) {
        const eLine = lines[i].trim()
        if (eLine.startsWith('Quick Tip') || eLine.match(new RegExp(`^${qNum + 1}\\.`))) {
          break
        }
        if (eLine && !eLine.match(/^\d{1,2}$/)) {
          expText += ' ' + eLine
        }
        i++
      }
      explanation = expText.trim().substring(0, 500) || 'No explanation'
      break
    }
    i++
  }

  // Validate
  if (!correctOption) {
    console.log(`❌ Q${qNum}: Could not extract correct answer`)
    continue
  }

  if (!optionA || !optionB || !optionC || !optionD) {
    console.log(`❌ Q${qNum}: Missing option(s)`)
    continue
  }

  if (!questionText.trim()) {
    console.log(`❌ Q${qNum}: No question text`)
    continue
  }

  const subject = getSubject(questionText)

  questions.push({
    question_number: qNum,
    question_text: questionText.trim(),
    option_a: optionA,
    option_b: optionB,
    option_c: optionC,
    option_d: optionD,
    correct_option: correctOption,
    subject: subject,
    explanation: explanation
  })

  console.log(`✅ Q${qNum}: Extracted`)
}

// Sort by question number
questions.sort((a, b) => a.question_number - b.question_number)

// Write to JSON
writeFileSync('./aibe11_missing_23.json', JSON.stringify(questions, null, 2))

console.log(`\n✅ Extracted ${questions.length} missing questions`)

// Verify all found
const extractedNums = new Set(questions.map(q => q.question_number))
const stillMissing = missingQs.filter(q => !extractedNums.has(q))
if (stillMissing.length > 0) {
  console.log(`⚠️  Still missing: ${stillMissing.join(', ')}`)
} else {
  console.log(`✅ All 23 missing questions extracted!`)
}
