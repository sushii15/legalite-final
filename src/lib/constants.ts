// PLAN TIER LIMITS
export const TIER_LIMITS = {
  free: {
    papers: 1,
    mockTests: 0,
    description: 'Free Plan',
  },
  paid: {
    papers: 11,
    mockTests: 5,
    description: '₹299/month',
  },
  premium: {
    papers: 16,
    mockTests: 10,
    description: '₹799/6 months',
  },
} as const

// EXAM CONFIGURATION
export const EXAM_CONFIG = {
  examName: 'AIBE 21',
  examDate: '2026-06-07',
  totalQuestions: 100,
  totalTime: 210, // minutes (3.5 hours)
  negativeMark: -0.25,
} as const

// PAPER CONFIGURATION
export const PAPER_COUNTS = {
  totalAvailable: 16, // AIBE 20 to AIBE 5
  startYear: 20,
  endYear: 5,
} as const

// COMPANION MODE
export const COMPANION_CONFIG = {
  pollInterval: 5000, // milliseconds (5 seconds)
} as const

// PAYMENT
export const PAYMENT_CONFIG = {
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
  plans: {
    paid: {
      amount: 29900, // in paise (₹299)
      currency: 'INR',
      duration: '1 month',
    },
    premium: {
      amount: 79900, // in paise (₹799)
      currency: 'INR',
      duration: '6 months',
    },
  },
} as const

// SUBJECTS
export const SUBJECTS = [
  'Constitution',
  'CPC',
  'Criminal Law',
  'Contract Law',
  'Torts',
  'Family Law',
  'Evidence',
  'Administrative Law',
  'Intellectual Property',
  'Commercial Law',
] as const
