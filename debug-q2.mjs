import { readFileSync } from 'fs'

const aibeText = readFileSync('./aibe7_extracted.txt', 'utf-8').replace(/\r/g, '')
const lines = aibeText.split('\n')

const qNum = 2
let startIdx = -1

// Find Q2
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim().match(/^2\.\s+/)) {
    startIdx = i
    console.log(`Found Q${qNum} at line ${i}`)
    console.log(`Line content: ${lines[i]}`)
    break
  }
}

if (startIdx !== -1) {
  const line = lines[startIdx].trim()
  const qMatch = line.match(/^(\d{1,3})\.\s+(.+)$/)
  console.log(`\nRegex match:`, qMatch ? 'YES' : 'NO')
  if (qMatch) {
    console.log(`  Question num: ${qMatch[1]}`)
    console.log(`  Full line: ${qMatch[2]}`)

    let fullLine = qMatch[2]

    // Try to extract options
    const aMatch = fullLine.match(/\(A\)\s+([^\(]+?)(?=\(B\))/)
    const bMatch = fullLine.match(/\(B\)\s+([^\(]+?)(?=\(C\))/)
    const cMatch = fullLine.match(/\(C\)\s+([^\(]+?)(?=\(D\))/)
    const dMatch = fullLine.match(/\(D\)\s+([^\(]+?)$/)

    console.log(`\nOption extraction:`)
    console.log(`  A Match: ${aMatch ? 'YES - ' + aMatch[1] : 'NO'}`)
    console.log(`  B Match: ${bMatch ? 'YES - ' + bMatch[1] : 'NO'}`)
    console.log(`  C Match: ${cMatch ? 'YES - ' + cMatch[1] : 'NO'}`)
    console.log(`  D Match: ${dMatch ? 'YES - ' + dMatch[1] : 'NO'}`)

    if (aMatch && bMatch && cMatch && dMatch) {
      let questionText = fullLine.replace(/\s*\(A\).*$/, '').trim()
      console.log(`\nQuestion text after removing options: ${questionText}`)

      // Now look for Correct Answer
      let correctOption = ''
      let i = startIdx + 1
      console.log(`\nLooking for Correct Answer starting at line ${i}`)
      while (i < lines.length) {
        const nextLine = lines[i].trim()
        console.log(`  Line ${i}: "${nextLine.substring(0, 50)}..."`)

        if (nextLine.startsWith('Correct Answer')) {
          console.log(`    -> Found Correct Answer line`)
          const correctMatch = nextLine.match(/Correct Answer:\s*\(?([A-D])\)?/i)
          if (correctMatch) {
            correctOption = correctMatch[1].toUpperCase()
            console.log(`    -> Extracted option: ${correctOption}`)
          }
          i++
          break
        }

        i++
      }

      console.log(`\nFinal validation:`)
      console.log(`  correctOption: ${correctOption || 'MISSING'}`)
      console.log(`  questionText: ${questionText ? 'YES' : 'MISSING'}`)
      console.log(`\nWould be added: ${correctOption && questionText ? 'YES' : 'NO'}`)
    }
  }
}
