import { readFileSync } from 'fs'

const aibeText = readFileSync('./aibe7_extracted.txt', 'utf-8').replace(/\r/g, '')
const lines = aibeText.split('\n')

let questionCount = 0

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim()
  const qMatch = line.match(/^(\d{1,3})\.\s+(.+)$/)
  
  if (qMatch) {
    const num = parseInt(qMatch[1])
    if (num >= 1 && num <= 100) {
      questionCount++
      if (num <= 15) {
        console.log(`Found Q${num}: "${qMatch[2].substring(0, 60)}..."`)
      }
    }
  }
}

console.log(`\nTotal matching question headers: ${questionCount}`)
