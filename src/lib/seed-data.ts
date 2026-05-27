// Seed data utilities for initial database population
// Used in Phase 1B to bootstrap the database with papers and questions

export interface PaperSeed {
  id: number
  aibe_id: number
  title: string
  question_count: number
  is_free: boolean
  year: number
}

export interface QuestionSeed {
  paper_id: number
  question_number: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: 'A' | 'B' | 'C' | 'D'
  subject: string
  explanation: string
  bare_act_pages: {
    universal?: number
    ebc?: number
    lexis_nexis?: number
  }
}

// AIBE Papers: 20 to 5
export const paperSeeds: PaperSeed[] = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1, // 1-16 (matches database auto-increment)
  aibe_id: 20 - i,
  title: `AIBE ${20 - i}`,
  question_count: 100,
  is_free: 20 - i === 20, // Only AIBE 20 is free
  year: 2005 + i, // AIBE 20 is 2024-2025, so adjust years
}))

// Sample questions for AIBE 20 (100 questions × subjects)
// In production, these would be seeded from a real question bank
export const generateSampleQuestions = (paperId: number, aibe: number): QuestionSeed[] => {
  const subjects = [
    'Constitutional Law',
    'Criminal Procedure Code',
    'Contract Law',
    'Torts',
    'Family Law',
    'Evidence Act',
    'Civil Procedure Code',
    'Administrative Law',
    'Company Law',
    'Intellectual Property',
  ]

  return Array.from({ length: 100 }, (_, i) => {
    const subject = subjects[i % subjects.length]
    const questionNum = i + 1

    return {
      paper_id: paperId,
      question_number: questionNum,
      question_text: `AIBE ${aibe} - Question ${questionNum} (${subject}): This is a sample question placeholder. In production, this would contain the actual question text from the AIBE exam.`,
      option_a: `Option A for question ${questionNum}`,
      option_b: `Option B for question ${questionNum}`,
      option_c: `Option C for question ${questionNum}`,
      option_d: `Option D for question ${questionNum}`,
      correct_option: (['A', 'B', 'C', 'D'] as const)[Math.floor(Math.random() * 4)],
      subject,
      explanation: `This is the explanation for question ${questionNum}. In production, this would contain the detailed explanation with references to relevant case law and statutes.`,
      bare_act_pages: {
        universal: 100 + Math.floor(Math.random() * 200),
        ebc: 120 + Math.floor(Math.random() * 200),
        lexis_nexis: 110 + Math.floor(Math.random() * 200),
      },
    }
  })
}

// Helper to create all papers with their questions
export function getAllPapersWithQuestions(): {
  papers: PaperSeed[]
  questions: QuestionSeed[]
} {
  const papers = paperSeeds
  const questions: QuestionSeed[] = []

  paperSeeds.forEach((paper) => {
    const sampleQuestions = generateSampleQuestions(paper.id, paper.aibe_id)
    questions.push(...sampleQuestions)
  })

  return { papers, questions }
}

// Export combined seed data for easy access
export const seedData = getAllPapersWithQuestions()
