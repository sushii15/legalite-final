import { readFileSync, writeFileSync } from 'fs'

const aibeText = readFileSync('./aibe7_extracted.txt', 'utf-8').replace(/\r/g, '')
const lines = aibeText.split('\n')

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

// Missing questions
const missingQs = [6, 12, 29, 45, 51, 58, 87, 90, 98]

const questions = []

for (const qNum of missingQs) {
  let startIdx = -1

  // Find the line starting with "N. "
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (trimmed.match(new RegExp(`^${qNum}\\.\\s+`))) {
      startIdx = i
      break
    }
  }

  if (startIdx === -1) {
    console.log(`❌ Q${qNum}: Not found`)
    continue
  }

  let questionText = lines[startIdx].trim().replace(new RegExp(`^${qNum}\\.\\s+`), '')
  let optionA = '', optionB = '', optionC = '', optionD = '', correctOption = '', explanation = ''
  let i = startIdx + 1

  // First, try to extract options from the same line (in case they're there)
  const aMatch = questionText.match(/\(A\)\s+(.+?)\s*\(B\)/)
  const bMatch = questionText.match(/\(B\)\s+(.+?)\s*\(C\)/)
  const cMatch = questionText.match(/\(C\)\s+(.+?)\s*\(D\)/)
  const dMatch = questionText.match(/\(D\)\s+(.+?)$/)

  if (aMatch && bMatch && cMatch && dMatch) {
    // All options on same line
    optionA = aMatch[1].trim()
    optionB = bMatch[1].trim()
    optionC = cMatch[1].trim()
    optionD = dMatch[1].trim()
    questionText = questionText.replace(/\s*\(A\).*$/, '').trim()
  } else {
    // Options might be on separate lines
    let optionBuffer = ''

    while (i < lines.length) {
      const line = lines[i].trim()

      // Skip blank lines and page numbers
      if (line === '' || line.match(/^\d{1,3}$/) || line.match(/^\d{1,2}$/)) {
        i++
        continue
      }

      // Check for "Correct Answer" - stop here
      if (line.startsWith('Correct Answer')) {
        break
      }

      // Check if this line has option markers
      if (line.match(/\([A-D]\)/i)) {
        optionBuffer += ' ' + line
      } else if (!line.startsWith('Solution') && !line.startsWith('Quick Tip') && !line.startsWith('Step')) {
        // Continue adding to question text if we haven't found options yet
        if (!optionBuffer) {
          questionText += ' ' + line
        }
      }

      i++
    }

    questionText = questionText.trim()

    // Parse options from buffer with improved regex that handles any content
    if (optionBuffer) {
      const optAMatch = optionBuffer.match(/\(A\)\s+(.+?)\s*\(B\)/i)
      const optBMatch = optionBuffer.match(/\(B\)\s+(.+?)\s*\(C\)/i)
      const optCMatch = optionBuffer.match(/\(C\)\s+(.+?)\s*\(D\)/i)
      const optDMatch = optionBuffer.match(/\(D\)\s+(.+?)$/i)

      if (optAMatch && optBMatch && optCMatch && optDMatch) {
        optionA = optAMatch[1].trim()
        optionB = optBMatch[1].trim()
        optionC = optCMatch[1].trim()
        optionD = optDMatch[1].trim()
      }
    }
  }

  // Look for correct answer
  while (i < lines.length) {
    const nextLine = lines[i].trim()

    if (nextLine.startsWith('Correct Answer')) {
      const correctMatch = nextLine.match(/Correct Answer:\s*\(?([A-D])\)?/i)
      if (correctMatch) {
        correctOption = correctMatch[1].toUpperCase()
      }
      i++
      break
    }

    i++
  }

  // Extract explanation from Solution section
  while (i < lines.length) {
    const nextLine = lines[i].trim()

    if (nextLine.startsWith('Solution') || nextLine.startsWith('Step')) {
      i++
      let expText = ''
      while (i < lines.length) {
        const sLine = lines[i].trim()

        if (sLine.startsWith('Quick Tip') || sLine.match(new RegExp(`^${qNum + 1}\\.`))) {
          break
        }

        if (sLine && !sLine.match(/^\d{1,3}$/) && !sLine.match(/^\d{1,2}$/)) {
          expText += ' ' + sLine
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
    console.log(`❌ Q${qNum}: Missing correct_option`)
    continue
  }

  if (!optionA || !optionB || !optionC || !optionD) {
    console.log(`❌ Q${qNum}: Missing options - A:${optionA ? 'YES' : 'NO'} B:${optionB ? 'YES' : 'NO'} C:${optionC ? 'YES' : 'NO'} D:${optionD ? 'YES' : 'NO'}`)
    continue
  }

  if (!questionText.trim()) {
    console.log(`❌ Q${qNum}: Missing question_text`)
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

  console.log(`✅ Q${qNum} extracted`)
}

// Write to JSON
writeFileSync('./aibe7_missing_recovered.json', JSON.stringify(questions, null, 2))

console.log(`\n✅ Recovered ${questions.length}/${missingQs.length} missing questions`)
