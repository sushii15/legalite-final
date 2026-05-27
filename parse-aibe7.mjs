import { readFileSync, writeFileSync } from 'fs'

const aibeText = readFileSync('./aibe7_extracted.txt', 'utf-8')
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

const questions = []
let i = 0

while (i < lines.length) {
  const line = lines[i].trim()
  const qMatch = line.match(/^(\d{1,3})\.\s+(.+)$/)
  
  if (qMatch) {
    const questionNum = parseInt(qMatch[1])
    if (questionNum < 1 || questionNum > 100) {
      i++
      continue
    }

    let questionText = qMatch[2]
    let optionA, optionB, optionC, optionD, correctOption, explanation
    i++
    let foundOptions = false
    let optionsLine = ''

    while (i < lines.length) {
      const nextLine = lines[i].trim()
      if (nextLine === '') {
        i++
        continue
      }
      if (nextLine.match(/^\d{1,2}$/) && nextLine.length <= 2) {
        i++
        continue
      }
      if (nextLine.match(/\([A-D]\)/i)) {
        optionsLine = nextLine
        foundOptions = true
        i++
        break
      }
      if (nextLine.startsWith('Correct Answer')) {
        break
      }
      questionText += ' ' + nextLine
      i++
    }

    if (!foundOptions) {
      continue
    }

    const optionAMatch = optionsLine.match(/\(A\)\s+([^\(]+?)(?=\(B\))/i)
    const optionBMatch = optionsLine.match(/\(B\)\s+([^\(]+?)(?=\(C\))/i)
    const optionCMatch = optionsLine.match(/\(C\)\s+([^\(]+?)(?=\(D\))/i)
    const optionDMatch = optionsLine.match(/\(D\)\s+([^\(]+?)$/i)

    if (!optionAMatch || !optionBMatch || !optionCMatch || !optionDMatch) {
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

    while (i < lines.length) {
      const nextLine = lines[i].trim()
      if (nextLine.startsWith('Correct Answer')) {
        const correctMatch = nextLine.match(/Correct Answer:\s*\(?([A-D])\)?/i)
        if (correctMatch) {
          correctOption = correctMatch[1].toUpperCase()
        }
        i++
        let solutionText = ''
        while (i < lines.length) {
          const sLine = lines[i].trim()
          if (sLine.startsWith('Quick Tip')) break
          if (sLine === '' || sLine.match(/^\d{1,2}$/)) {
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

    if (correctOption && optionA && optionB && optionC && optionD) {
      questions.push({
        question_number: questionNum,
        question_text: questionText.trim(),
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_option: correctOption,
        subject: getSubject(questionText),
        explanation: explanation
      })
    }
  }
  i++
}

questions.sort((a, b) => a.question_number - b.question_number)
writeFileSync('./aibe7_questions.json', JSON.stringify(questions, null, 2))

console.log(`✅ Parsed AIBE 7`)
console.log(`Total questions extracted: ${questions.length}`)

const nums = new Set(questions.map(q => q.question_number))
const missing = []
for (let i = 1; i <= 100; i++) {
  if (!nums.has(i)) missing.push(i)
}
console.log(`Missing: ${missing.join(', ')}`)
