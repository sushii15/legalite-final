import fs from 'fs';

// Answer key for AIBE 19
const answerKey = {
  1: 'B', 2: 'D', 3: 'A', 4: null, 5: null, 6: 'A', 7: 'C', 8: 'B', 9: 'C', 10: 'A',
  11: 'C', 12: 'C', 13: 'C', 14: null, 15: 'B', 16: 'B', 17: 'B', 18: 'D', 19: 'B', 20: 'B',
  21: 'C', 22: 'C', 23: 'D', 24: 'A', 25: null, 26: 'C', 27: 'D', 28: 'C', 29: 'B', 30: 'A',
  31: 'A', 32: 'D', 33: 'B', 34: 'D', 35: 'B', 36: 'A', 37: 'A', 38: 'B', 39: 'B', 40: 'C',
  41: 'D', 42: 'B', 43: 'A', 44: 'C', 45: 'B', 46: 'B', 47: 'B', 48: 'C', 49: 'B', 50: 'B',
  51: 'D', 52: null, 53: 'B', 54: 'D', 55: 'C', 56: 'C', 57: null, 58: 'D', 59: 'B', 60: 'C',
  61: 'D', 62: 'A', 63: 'C', 64: 'A', 65: 'D', 66: 'D', 67: 'A', 68: 'C', 69: null, 70: 'C',
  71: 'B', 72: 'A', 73: 'D', 74: 'B', 75: 'A&C', 76: 'D', 77: 'C', 78: 'B', 79: 'A', 80: 'B',
  81: 'B', 82: 'A', 83: 'C', 84: 'C', 85: 'A', 86: 'B', 87: 'C', 88: null, 89: 'B', 90: 'D',
  91: 'C', 92: 'C', 93: 'D', 94: 'D', 95: 'B', 96: 'C', 97: 'B', 98: 'B', 99: 'B', 100: 'D'
};

function getSubject(qNum) {
  if (qNum <= 10) return 'Constitutional Law';
  if (qNum <= 20) return 'Criminal Law (BNS)';
  if (qNum <= 27) return 'Criminal Procedure (BNSS)';
  if (qNum <= 34) return 'Civil Procedure';
  if (qNum === 35) return 'Evidence Law';
  if (qNum <= 40) return 'Contract Law';
  if (qNum <= 43) return 'Family Law';
  if (qNum === 44) return 'Administrative Law';
  if (qNum === 45) return 'Labor Law';
  if (qNum === 46) return 'Tax Law';
  if (qNum === 47) return 'Environmental Law';
  if (qNum === 48) return 'IP Law';
  if (qNum === 49) return 'Professional Conduct';
  if (qNum === 50) return 'Arbitration Law';
  if (qNum <= 56) return 'Constitutional Law';
  if (qNum <= 61) return 'Criminal Law (BNS)';
  if (qNum <= 71) return 'Criminal Procedure (BNSS)';
  if (qNum <= 72) return 'Civil Procedure';
  if (qNum <= 78) return 'Evidence Law';
  if (qNum <= 80) return 'Contract Law';
  if (qNum <= 83) return 'Property Law';
  if (qNum === 84) return 'Administrative Law';
  if (qNum === 85) return 'Labor Law';
  if (qNum === 86) return 'Tax Law';
  if (qNum === 87) return 'Environmental Law';
  if (qNum === 88) return 'IP Law';
  if (qNum === 89) return 'Professional Conduct';
  if (qNum === 90) return 'Arbitration Law';
  return 'Constitutional Law';
}

const extractedText = fs.readFileSync('../aibe19_extracted.txt', 'utf-8');
const lines = extractedText.split('\n');

const questions = [];
let i = 0;

while (i < lines.length && questions.length < 100) {
  const line = lines[i].trim();
  const qMatch = line.match(/^(\d+)\.\s+(.+)/);
  
  if (qMatch) {
    const qNum = parseInt(qMatch[1]);
    if (qNum <= 100 && qNum > 0) {
      let qText = qMatch[2];
      let optA = '', optB = '', optC = '', optD = '';
      
      // Collect text until we find options
      i++;
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        if (nextLine.match(/^\(A\)/)) break;
        if (nextLine) qText += ' ' + nextLine;
        i++;
      }
      
      // Get options
      if (i < lines.length && lines[i].trim().match(/^\(A\)/)) {
        optA = lines[i].trim().replace(/^\(A\)\s*/, '');
        i++;
      }
      if (i < lines.length && lines[i].trim().match(/^\(B\)/)) {
        optB = lines[i].trim().replace(/^\(B\)\s*/, '');
        i++;
      }
      if (i < lines.length && lines[i].trim().match(/^\(C\)/)) {
        optC = lines[i].trim().replace(/^\(C\)\s*/, '');
        i++;
      }
      if (i < lines.length && lines[i].trim().match(/^\(D\)/)) {
        optD = lines[i].trim().replace(/^\(D\)\s*/, '');
        i++;
      }
      
      questions.push({
        question_number: qNum,
        question_text: qText.trim(),
        option_a: optA,
        option_b: optB,
        option_c: optC,
        option_d: optD,
        correct_option: answerKey[qNum] || null,
        subject: getSubject(qNum),
        explanation: null
      });
    }
  }
  i++;
}

const jsonOutput = JSON.stringify(questions, null, 2);
fs.writeFileSync('aibe19_questions.json', jsonOutput);
console.log(`Successfully created aibe19_questions.json with ${questions.length} questions`);
