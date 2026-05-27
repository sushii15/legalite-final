# Legalite.ai — Complete Product Specification

## Table of Contents
1. [Product Overview](#product-overview)
2. [User Tiers & Pricing](#user-tiers--pricing)
3. [Core Features](#core-features)
4. [Test Modes](#test-modes)
5. [Question Bank](#question-bank)
6. [User Flows](#user-flows)
7. [Technical Requirements](#technical-requirements)
8. [Data Models](#data-models)

---

## Product Overview

**What is Legalite.ai?**
Legalite is an AIBE (All India Bar Examination) exam prep platform designed for law graduates and working professionals preparing for the mandatory licensing exam. The platform provides practice tests, real exam papers, live pacing guidance, and bare act page references.

**Target Users:**
- Fresh law graduates (3-6 months before exam)
- Working professionals 1-2 years out of law school (preparing to finally get licensed)
- Anyone appearing for AIBE 21 or later

**Exam Context:**
- AIBE 21: June 7, 2026 (15 days from May 23, 2026)
- 100 MCQ questions, 3.5 hours (210 minutes)
- No negative marking
- Pass score: 45% (Gen/OBC), 40% (SC/ST)
- 19 subjects across civil law, criminal law, and professional ethics
- **Critical Change:** New criminal laws (BNS/BNSS/BSA) replaced old laws (IPC/CrPC/Evidence Act) — 90% of criminal questions now use new laws

---

## User Tiers & Pricing

### FREE TIER (₹0)
**Tagline:** "For the curious starter"
**Target:** Users trying the platform, verifying value before paying

**What They Get:**
- ✅ 1 full AIBE paper (AIBE 20)
- ✅ Companion mode (live pacing)
- ✅ Print mode for offline practice
- ✅ Basic answer explanations
- ✅ Progress tracking & analytics

**What They DON'T Get:**
- ❌ AIBE 19, 18, 17... (locked)
- ❌ AI mock tests (locked)
- ❌ Bare act page references (hidden in review)
- ❌ Study guides (coming soon, but locked)
- ❌ Flashcards (coming soon, but locked)
- ❌ PDF exports (locked)
- ❌ Hindi UI (locked)

**UI Behavior:**
- Papers AIBE 19+ show as locked cards with lock icon, "₹299 Plan" badge, "Unlock with ₹299" button
- AI mocks section shows empty state with lock icon and upgrade CTA
- In review answers, bare act references show: "🔒 Bare Act page references — Upgrade to ₹299"

---

### ₹299/MONTH TIER (paid)
**Tagline:** "For serious candidates"
**Target:** Primary conversion — users committed to passing in 1-3 months
**Duration:** Monthly subscription, cancel anytime

**What They Get:**
- ✅ 10 real past exams (AIBE 20 down to AIBE 11)
- ✅ 5 AI-generated mock tests
- ✅ Companion mode (live pacing)
- ✅ Bare act page references (Universal/EBC/LexisNexis editions)
- ✅ Progress tracking & analytics
- ✅ Study guides (coming June 1)
- ✅ Flashcards (coming June 1)

**What They DON'T Get:**
- ❌ AIBE 10, 9, 8... (locked — "Premium" badge)
- ❌ 10 AI mocks (locked — only 5)
- ❌ PDF exports (locked)
- ❌ Hindi UI (locked)

**UI Behavior:**
- Papers AIBE 20-11 fully unlocked, clickable, no badges
- Papers AIBE 10-5 show as locked with "Premium" badge, "Upgrade to ₹799" button
- 5 AI mock tests generated and visible
- Full bare act references visible in review: "Universal Ed. — Page 142, Section 420"
- Study guides/Flashcards show "[COMING]" badges but are accessible (empty for now)

---

### ₹799/6-MONTHS TIER (premium)
**Tagline:** "For the all-in attempt"
**Target:** Comprehensive prep, best value for students with 1-2 months to exam
**Duration:** 6-month license, save 55% vs monthly

**What They Get:**
- ✅ 15 real past exams (AIBE 20 down to AIBE 6)
- ✅ 10 AI-generated mock tests
- ✅ Companion mode (live pacing)
- ✅ Bare act page references (all editions)
- ✅ Progress tracking & analytics
- ✅ Study guides (coming June 1)
- ✅ Flashcards (coming June 1)
- ✅ PDF exports (download completed attempts as PDF)
- ✅ Hindi UI (coming June 1)

**What They DON'T Get:**
- ❌ AIBE 5 and older (future expansion)

**UI Behavior:**
- All papers AIBE 20-6 fully unlocked
- 10 AI mock tests generated and visible
- Full bare act references in all editions
- "Download PDF" button visible on completed test reviews
- "Hindi UI" toggle available in settings
- "✓ Premium" badge in navbar

---

## Core Features

### 1. Practice Papers (Real AIBE Exams)

**What:** Past year AIBE question papers (AIBE 20, 19, 18, ... all the way to AIBE 1 eventually)

**Paper Data Structure:**
- Paper ID: aibe_20, aibe_19, etc.
- Contains 100 questions (exact same format as real exam)
- Each question has: question text, 4 options (A/B/C/D), correct answer, explanation, bare act page references

**Features:**
- Can be attempted **multiple times** (unlimited attempts)
- Progress is **saved** (user can start, leave, come back later)
- After submission, user can **review answers** with explanations
- Shows **weak subjects** (subjects where user scored <60%)

**Roadmap:**
- MVP: AIBE 20 (free), AIBE 20+19 (₹299), AIBE 20-6 (₹799)
- Week 2: Add AIBE 18, 17, 16 (1 paper per day)
- Week 3+: Add more papers as needed

---

### 2. AI Mock Tests

**What:** AI-generated practice tests in the same format as AIBE (100 questions, 3.5 hours, 4 options)

**Features:**
- Not real past exams, but AI-generated based on AIBE patterns
- Same subjects, difficulty, question types as real AIBE
- No exact duplicates from real papers
- Unlimited attempts
- User can generate new tests on demand

**Availability:**
- Free: 0 mocks
- ₹299: 5 AI mocks accessible (pre-generated or on-demand)
- ₹799: 10 AI mocks accessible

**Implementation Note:**
- **For MVP:** Pre-generate 5 and 10 mock tests (don't make it AI-generated in real-time, too slow)
- **Later:** Can switch to real-time generation if needed

---

### 3. Companion Mode (Live Pacing Guide)

**What:** A real-time pace guide that tells users "you should be on Question X by now" while they take a test

**How It Works:**
- User starts a test (online or with printout)
- Opens **Companion Mode on phone** (separate interface/widget)
- As minutes pass, Companion shows:
  - Current time elapsed (e.g., "15 min 23 sec")
  - Ideal question number user should be on (e.g., "You should be on Question 24")
  - Checkpoint alerts every 30 minutes (e.g., "30 min mark: You should have completed ~40 questions")

**Math Behind Pacing:**
- 210 minutes total for 100 questions
- Average pace: 2.1 minutes per question
- Ideal checkpoints:
  - 30 min: Q43
  - 60 min: Q86
  - 90 min: Q129 (impossible — there are only 100, so pace up!)
  - 120 min: All 100 done, review for 90 min
  - 210 min: Finish

**Availability:** All tiers (free, ₹299, ₹799)

**MVP Implementation:**
- Simple text display: "Time elapsed | Question you should be on"
- NOT a complex animated UI, just functional

---

### 4. Bare Act Page References

**What:** When reviewing answers, show exact page numbers where the answer is located in the bare acts

**Example:**
```
Question: "Under Section 420 IPC, what is the definition of cheating?"
Answer: [D] Whoever deceives another...
Explanation: This is covered in Section 420 of the Bharatiya Nyaya Sanhita (BNS).

📖 Bare Act References:
• Universal Ed. — Page 142
• EBC Ed. — Page 138
• LexisNexis Ed. — Page 151
```

**Available Editions:**
- Universal Edition (most common)
- EBC (Eastern Book Company) Edition
- LexisNexis Edition

**Why Important:**
- AIBE allows carrying bare acts into the exam hall
- Students need to know EXACTLY where to find answers
- Pages vary by edition — must show all three

**Availability:**
- Free: Hidden (shows lock message)
- ₹299: Visible
- ₹799: Visible

**MVP Data:**
- Will need to manually map ~200 questions from AIBE 19+20 to page numbers for all 3 editions
- Can be a JSON file: `{ questionId: { universal: 142, ebc: 138, lexisnexis: 151 } }`

---

### 5. Progress Tracking & Analytics

**What:** Shows user's performance metrics and weak areas

**Metrics Shown:**
- **Papers Completed:** 2/20 (shows progress through papers)
- **Average Score:** 68% (across all attempts)
- **Weak Subjects:** Shows list of subjects with <60% score
  - Example: Criminal Law (54%), Torts (48%), Family Law (61%)

**Weak Subject Algorithm:**
- Track user's score in each subject across all attempts
- Calculate average score per subject
- Flag subjects <60% as "weak"
- Show top 3 weak subjects on dashboard

**Data to Track:**
- Per attempt: questions attempted, score, time taken, subject breakdown
- Subject breakdown: count correct in each of 19 subjects
- Calculate rolling average per subject

**Availability:** All tiers

---

### 6. Study Guides (Coming June 1)

**What:** Pre-written summaries of each law for quick revision

**Content Examples:**
- "Criminal Law (BNS) — Key Sections"
- "Contract Act — Essential Terms"
- "Family Law — Marriage & Divorce Basics"

**Format:**
- 500-1000 word summaries per law
- Bullet points, NOT prose
- Key definitions and section numbers
- Examples where helpful

**Availability:**
- Free: Locked
- ₹299: Accessible (available June 1)
- ₹799: Accessible (available June 1)

**MVP Status:** COMING — not built yet, but mentioned in pricing

---

### 7. Flashcards (Coming June 1)

**What:** Digital flashcards for spaced repetition learning

**Format:**
- Front: "Definition of cheating" or "Section 420 BNS covers..."
- Back: Answer with explanation

**Coverage:**
- ~500-1000 flashcards covering all 19 subjects
- Organized by subject and difficulty
- User can mark as "know" or "learn more"
- Spaced repetition algorithm (show harder cards more often)

**Availability:**
- Free: Locked
- ₹299: Accessible (available June 1)
- ₹799: Accessible (available June 1)

**MVP Status:** COMING — not built yet, but mentioned in pricing

---

### 8. PDF Exports

**What:** Download completed test + answers as PDF for offline review

**Contents:**
- All 100 questions with user's answers
- Correct answers highlighted
- Score breakdown (68/100)
- Explanations for each question
- Bare act page references (for ₹799 users)

**Use Cases:**
- Print and annotate with pen
- Share with mentor/friend
- Archive for later review

**Availability:**
- Free: Locked
- ₹299: Locked
- ₹799: Accessible (button visible in review)

**MVP Status:** COMING — design only, not built yet

---

### 9. Hindi UI (Coming June 1)

**What:** Interface translated to Hindi (questions stay in English, but UI is Hindi)

**Elements Translated:**
- Navigation (Dashboard, Papers, Mocks, etc.)
- Button labels (Start Test, Review Answers, etc.)
- Section titles (Practice Papers, Recent Attempts, etc.)
- Settings and preferences

**Questions:** Stay in English (AIBE exam is only in English)

**Availability:**
- Free: Locked
- ₹299: Locked
- ₹799: Accessible (toggle in settings)

**MVP Status:** COMING — design only, not built yet

---

## Test Modes

### Mode 1: Online Test Mode

**How It Works:**
1. User clicks "Start Test" on a paper card
2. Questions load in Legalite interface
3. User can:
   - Read question + options
   - Select one option (A/B/C/D)
   - See 4 buttons: "Previous Question", "Next Question", "Mark for Review", "Submit"
4. Timer shows time elapsed and time remaining
5. User can navigate freely (not linear)
6. User submits when done

**Data Tracked:**
- Time started & time submitted
- Each question: option selected, time spent on question, marked for review?
- Calculated: total score, subject breakdown

**After Submission:**
- Shows score: "68/100 (68%)"
- Shows weak subjects
- Option to "Review Answers"

---

### Mode 2: Print Mode + Companion

**How It Works:**
1. User clicks "Print PDF" (or "Download as PDF")
2. Gets clean PDF of 100 questions with no answers
3. User prints and writes on paper (like real exam)
4. Meanwhile, opens **Companion Mode** on phone
5. Companion tracks time and shows: "You should be on Question 34"
6. After ~3.5 hours, user uploads their answers to Legalite
   - OR manually enters answers question-by-question

**Data Tracked:**
- Same as online mode (score, subject breakdown, time)
- Additionally tracks: used print mode (metadata)

**After Submission:**
- Same review flow as online mode

**MVP Status:**
- PDF generation: COMING (design only)
- Manual answer entry: COMING (design only)
- Companion mode: MVP READY (simple text display)

---

## Question Bank

### AIBE 20 (Launched May 24)
- 100 questions, fully seeded
- All answers & explanations ready
- All bare act page references (3 editions) ready

### AIBE 19 (Launched May 24)
- 100 questions, fully seeded
- All answers & explanations ready
- All bare act page references (3 editions) ready

### AIBE 18-6 (Roadmap Week 2-3)
- 100 questions each
- Will add 1 paper per day through end of May
- Questions + answers + explanations sourced
- Bare act references: manually map by end of May

### AI Mock Tests
- 5 mocks for ₹299 (pre-generated placeholder data)
- 10 mocks for ₹799 (pre-generated placeholder data)
- Format: Same as real AIBE (100 Qs, 3.5 hrs)
- Will eventually be AI-generated, but for MVP: hardcoded sample data

---

## User Flows

### Flow 1: Free User → Try Platform → Upgrade to ₹299

**Steps:**
1. Homepage → "Get Started Free"
2. Sign up (email, password, phone, exam date)
3. Redirected to dashboard
4. Sees AIBE 20 unlocked, AIBE 19+ locked with "Upgrade to ₹299" badges
5. Takes AIBE 20 test
6. Reviews answers (sees explanations but NOT bare act page numbers)
7. Sees weak subjects, realizes needs more practice
8. Clicks "Upgrade to ₹299" button or navbar
9. Razorpay checkout opens
10. Pays ₹299
11. Webhook updates user.plan = 'paid' in Supabase
12. Dashboard reloads
13. AIBE 19-11 now unlocked
14. Can see bare act page references in review

---

### Flow 2: ₹299 User → Wants All Papers → Upgrade to ₹799

**Steps:**
1. User on dashboard, sees "Upgrade to ₹799" badge on AIBE 10
2. Realizes they have only 2 weeks to AIBE, wants all 15 papers
3. Clicks "Upgrade to ₹799"
4. Razorpay checkout for ₹799/6-months (or pro-rata upgrade?)
5. Pays
6. Webhook updates user.plan = 'premium'
7. Dashboard reloads
8. All papers AIBE 20-6 now unlocked
9. 10 AI mocks visible
10. "Download PDF" button appears

---

### Flow 3: Take a Test Online

**Steps:**
1. Dashboard → "AIBE 20" card → "Continue" (if in progress) or "Start Test"
2. Redirected to `/test/aibe_20`
3. Test interface loads:
   - Question 1/100 displayed
   - 4 option buttons (A, B, C, D)
   - Timer showing 3:30 remaining
   - "Previous | Next | Mark for Review | Submit" buttons
4. User clicks option D
5. Clicks "Next"
6. Question 2/100 loads
7. ... user answers 100 questions ...
8. User clicks "Submit"
9. Answers stored in `attempts` table
10. Score calculated
11. Review page loads with score: "68/100"
12. Weak subjects shown
13. Option to "Review Answers" or "Back to Dashboard"

---

### Flow 4: Review Answers After Test

**Steps:**
1. Test completed, score shown
2. Click "Review Answers"
3. Redirected to `/review/attempt_id`
4. Shows Question 1:
   - Full question text
   - User's selected answer: "D" (highlighted)
   - Correct answer: "C" (highlighted in green)
   - Explanation: "This is defined in Section..."
   - **Bare Act References** (if user is ₹299+):
     - "📖 Universal Ed. — Page 142"
     - "📖 EBC Ed. — Page 138"
     - "📖 LexisNexis Ed. — Page 151"
5. User clicks "Next Answer" or "Previous Answer"
6. Navigates through all answers
7. Can also filter by "Incorrect Only" or "Marked for Review"

---

### Flow 5: Use Companion Mode While Taking Test

**Steps:**
1. User starting AIBE 20 test online
2. Opens Legalite on phone (or separate device/browser tab)
3. Taps "Open Companion Mode"
4. Redirected to `/companion/attempt_id`
5. Shows:
   - "Time Elapsed: 15:23"
   - "Questions Completed: 24"
   - "Target: Question 24" ✓ (on pace)
   - Next checkpoint: "30 min mark (Q43) in 14:37"
6. Page refreshes every 5 seconds or updates in real-time
7. User answers more questions on main device
8. Companion shows: "Questions Completed: 34" (as they submit answers)
9. If behind pace: "Target: Question 45, Current: 34 — Speed up!"

**Tech Note:** Requires real-time sync between test page and companion page (WebSocket or polling)

---

## Technical Requirements

### Authentication
- **Provider:** Supabase Auth (email/password + optional Google OAuth)
- **Session:** JWT tokens, auto-refresh
- **Protected Routes:** `/dashboard`, `/test/:id`, `/review/:id`, `/companion/:id`
- **Public Routes:** `/`, `/how-it-works`, `/pricing`, `/login`, `/signup`

### Database (Supabase PostgreSQL)

#### Tables:
1. **users**
   - id (uuid, primary key)
   - email (string, unique)
   - password (hashed, Supabase handles)
   - full_name (string)
   - phone (string)
   - exam_date (date)
   - plan (string: 'free' | 'paid' | 'premium')
   - razorpay_customer_id (string, nullable)
   - created_at (timestamp)
   - updated_at (timestamp)

2. **papers**
   - id (string: 'aibe_20', 'aibe_19', etc.)
   - title (string: 'AIBE 20')
   - is_free (boolean: true only for AIBE 20)
   - created_at (timestamp)

3. **questions**
   - id (uuid)
   - paper_id (string, foreign key to papers)
   - question_number (integer: 1-100)
   - question_text (text)
   - option_a (text)
   - option_b (text)
   - option_c (text)
   - option_d (text)
   - correct_option (string: 'A' | 'B' | 'C' | 'D')
   - subject (string: 'Criminal Law', 'Contract', etc.)
   - section_ref (string: 'Section 420 BNS', optional)
   - explanation (text)
   - bare_act_pages (jsonb: { universal: 142, ebc: 138, lexisnexis: 151 })
   - difficulty (string: 'easy' | 'medium' | 'hard', for AI mocks)
   - created_at (timestamp)

4. **attempts**
   - id (uuid)
   - user_id (uuid, foreign key)
   - paper_id (string, foreign key)
   - started_at (timestamp)
   - completed_at (timestamp, nullable until submission)
   - duration_minutes (integer, calculated)
   - score (integer: 0-100)
   - status (string: 'in_progress' | 'completed' | 'archived')
   - is_mock (boolean: false for real papers, true for AI mocks)
   - created_at (timestamp)

5. **answers** (user's answers to questions)
   - id (uuid)
   - attempt_id (uuid, foreign key)
   - question_id (uuid, foreign key)
   - selected_option (string: 'A' | 'B' | 'C' | 'D')
   - is_correct (boolean, calculated after submission)
   - time_spent_seconds (integer)
   - marked_for_review (boolean)
   - created_at (timestamp)

### Payments
- **Provider:** Razorpay
- **Flow:**
  1. User clicks "Upgrade to ₹299"
  2. Frontend creates Razorpay order
  3. Razorpay modal opens
  4. User pays
  5. Razorpay webhook calls `/api/webhooks/razorpay`
  6. Backend validates signature, updates user.plan
  7. Frontend detects plan change (polling or WebSocket) and reloads

- **Pricing:**
  - ₹299 for 1 month (monthly recurrence possible, but for MVP: one-time)
  - ₹799 for 6 months

- **Storage:** Save razorpay_customer_id on user for future transactions

### Real-Time Features
- **Companion Mode:** Needs real-time sync of attempt progress
  - Option 1: Poll backend every 2-5 seconds for latest `answers` count
  - Option 2: Use WebSocket (more complex, but smoother)
  - **MVP:** Use polling

### File Storage
- **PDF Generation:** For print mode
  - Tool: jsPDF or similar
  - Storage: AWS S3 or Supabase Storage
  - Format: Clean PDF with questions, no answers

---

## Data Models

### Exam Breakdown (19 Subjects)

**Civil Major Laws:**
- Constitution of India (COI)
- Civil Procedure Code (CPC)

**Criminal Major Laws (NEW):**
- Bharatiya Nyaya Sanhita (BNS) — replaced IPC
- Bharatiya Nagarik Suraksha Sanhita (BNSS) — replaced CrPC
- Bharatiya Sakshya Adhiniyam (BSA) — replaced Evidence Act

**Civil Minor Laws:**
- Indian Contract Act
- Transfer of Property Act
- Specific Relief Act
- Limitation Act
- Negotiable Instruments Act
- Family Law (Hindu/Muslim/Christian)
- Advocate Act
- Arbitration & Conciliation Act
- Consumer Protection Act
- Law of Torts
- Public Interest Litigation (PIL)

**Professional Ethics:**
- Conduct rules for advocates
- Legal ethics

**Estimated Question Distribution (from AIBE guidance):**
- Civil Major: 20 Qs
- Criminal Major: 30 Qs (heavily on new laws)
- Contract/SRA/TPA/NI: 8 Qs
- Family Law: 8 Qs
- Professional Ethics: 4 Qs
- PIL: 4 Qs
- Other (Torts, Consumer, Arbitration, etc.): 18 Qs

---

## Calculation Formulas

### Score Calculation
```
score = (correct_answers / 100) * 100
```

### Subject Breakdown
```
per_subject_score = (correct_in_subject / questions_in_subject) * 100
```

### Weak Subject Detection
```
weak_subjects = subjects where average_score < 60%
```

### Pace Calculation
```
ideal_questions_at_time = (time_elapsed_minutes / 210) * 100
behind_pace = (ideal_questions - questions_completed) > 5
```

---

## Future Roadmap

### Phase 1 (MVP - May 24)
- ✅ Homepage + How It Works + Pricing pages
- ✅ Login/Signup
- ✅ Dashboard with lock states
- ✅ AIBE 20 + AIBE 19 questions
- ✅ Online test mode
- ✅ Review answers with explanations
- ✅ Bare act page references (3 editions)
- ✅ Basic progress tracking (papers completed, avg score, weak subjects)
- ✅ Companion mode (text display)
- ✅ Razorpay payments integration
- ✅ RLS & security on Supabase

### Phase 2 (Week 1-2 after launch - May 25-31)
- ✅ Add AIBE 18, 17, 16, 15, 14, 13 papers (1 per day)
- ✅ AI mock tests (5 for ₹299, 10 for ₹799)
- ✅ Better progress charts/visualizations
- ✅ Subject-wise performance breakdown
- ✅ Bug fixes & performance optimization

### Phase 3 (June 1+)
- ✅ Study guides (20-30 pre-written summaries)
- ✅ Flashcards (500+ cards with spaced repetition)
- ✅ PDF export for completed attempts
- ✅ Hindi UI toggle
- ✅ Print mode + PDF generation
- ✅ Manual answer entry (for print mode)
- ✅ Re-entry diagnostic (for users 1-2 years out of law)

### Phase 4+ (Post-AIBE)
- Advanced analytics (percentile ranking, recommendation engine)
- Live classes (partner with tutors)
- Community forum
- Answer discussion threads
- More past exams (AIBE 1-5, state bar exams)

---

## Edge Cases & Business Rules

### Paper Accessibility
- Users cannot see or access papers beyond their tier limit
- Papers are locked, not deleted (shows locked card)
- Attempting to access locked paper via URL returns 403 Forbidden

### Attempt Limits
- Users can attempt the same paper unlimited times
- Each attempt creates new record in `attempts` table
- Can see progress across multiple attempts on dashboard

### Score Calculation
- Only completed attempts count toward statistics
- In-progress attempts show in dashboard but don't affect averages
- If user starts a test and abandons, it stays as "in_progress" (not counted)

### Subscription Management
- Users cannot downgrade (if on ₹799, cannot go to ₹299)
- Can upgrade anytime (₹299 → ₹799)
- Cancellation: User can cancel ₹299 monthly anytime
- ₹799: Non-refundable, locked for 6 months (no cancellation mid-term)

### Bare Act Editions
- Every question must have page references for all 3 editions
- If reference is missing, show: "Page reference not yet available"
- High priority to complete all references before launch

### Weak Subject Tracking
- Only updated after test submission
- Tracks across ALL attempts (rolling average)
- Shows only if user has completed at least 1 full paper
- Updates every time a new attempt is completed

---

## Success Metrics (Future)

- Users who convert free → ₹299: Target >10% of signups
- Users who complete ₹299 → ₹799: Target >20% of ₹299 users
- Test completion rate: >70% (at least 1 full paper attempted)
- Average score improvement: +5-10% between first and last attempt
- Retention (Day 7): >40% of signups return
- Revenue: 100 users Month 1 (₹29,900), 500 users Month 6 (₹1,49,500)

---

## Notes for Development

1. **Security First:** All user data is sensitive. Use RLS on all tables, validate plan tier before serving content.

2. **Bare Act References:** Manual data entry — allocate time for this. Consider hiring law student to verify page numbers.

3. **Questions:** All 100 questions per paper must be 100% accurate. Triple-check answers and explanations.

4. **Performance:** Dashboard loads all papers dynamically — optimize queries. Use caching where possible.

5. **Mobile-First:** Companion mode will be heavily used on phones. Test all screens on mobile.

6. **Razorpay Testing:** Use test API keys. Test payment flow end-to-end before launch.

7. **Timezone:** All timestamps in IST (India Standard Time, UTC+5:30). User's exam date should consider timezone.

8. **Exam Date:** After AIBE 21 (June 7), platform becomes less urgent. Plan for Q3/Q4 for AIBE 22 marketing.

---

**Last Updated:** May 23, 2026
**Status:** MVP Ready for Development
**Next Step:** Begin React + Supabase implementation
