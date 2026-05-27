# Legalite.ai — Handoff to Claude Code

## Project Status

**Design Phase:** ✅ COMPLETE
- Homepage (`Legalite Homepage.html`) — Premium warm beige aesthetic
- Dashboard (`Dashboard.html`) — Tier-based access with lock states
- Product Specification (`PRODUCT_SPEC.md`) — Complete technical spec
- All design assets, color systems, and typography defined

**Development Phase:** 🚀 READY TO START
- Frontend: React + HTML/CSS (design system established)
- Backend: Supabase (PostgreSQL + Auth)
- Payments: Razorpay integration
- Real-time: Companion mode (polling implementation)

---

## Files Delivered

### Design Files (HTML)
1. **Legalite Homepage.html**
   - Marketing page with hero, stats strip, pricing, footer
   - Color palette: Cream (#F5F0E8), Dark Brown (#3D2E1E), Gold (#C9A96E)
   - Typography: Cormorant Garamond (serif), DM Sans (sans-serif)
   - Responsive design, smooth animations

2. **Dashboard.html**
   - User dashboard with tier-based content
   - Features: Practice papers grid, AI mock tests, progress tracking
   - Circular progress indicators (SVG)
   - Dynamic paper generation (AIBE 20-5)
   - Lock states for free/paid/premium tiers
   - Navbar matches homepage design

### Documentation
3. **PRODUCT_SPEC.md**
   - Complete 8,000-word product specification
   - User tiers, features, flows, technical requirements
   - Database schema, data models, roadmap
   - Business rules and success metrics

---

## Design System

### Color Palette (CSS Variables)
```css
--cream: #F5F0E8           /* Main background */
--dark-brown: #3D2E1E      /* Primary text & headings */
--gold: #C9A96E            /* Accent color */
--warm-tan: #D4C5A9        /* Secondary accent */
--beige: #EDE6D6           /* Card backgrounds */
--light-beige: #F9F7F3     /* Hover states */
--body-text: #5A4A3A       /* Body text */
--border-color: #E8DFD3    /* Borders */
```

### Typography
- **Headlines:** Cormorant Garamond (400-600 weight)
  - H1: 56px, H2: 44px, Section titles: 28px
- **Body:** DM Sans (400-600 weight)
  - Body: 14-16px, Small: 12-13px
- **Monospace:** JetBrains Mono (for question IDs, references)

### Components
- **Buttons:** Rounded pill-style (border-radius: 999px)
  - Primary (dark brown): Hover lift + shadow
  - Gold accent buttons: Same hover effect
- **Cards:** Subtle shadows, 6px border-radius
- **Forms:** Clean, minimal design
- **Icons:** Emoji for UI (lock 🔒, check ✓, etc.)

### Spacing
- **Padding:** 24px, 32px, 36px, 40px
- **Gap:** 12px (tight), 24px (normal), 32px (generous)
- **Margin:** Top/bottom 48-96px between sections

---

## Dashboard Architecture

### User Plan States
The dashboard changes based on `USER_PLAN` variable (test with 'free' | 'paid' | 'premium'):

**Free Tier:**
- AIBE 20 unlocked
- AIBE 19-5 locked (shows "₹299 Plan" badge + lock icon)
- No AI mock tests (shows upgrade CTA)
- Navbar: "Upgrade to ₹299 →"

**₹299 Tier (paid):**
- AIBE 20-11 unlocked (10 papers)
- AIBE 10-5 locked (shows "Premium" badge)
- 5 AI mock tests visible
- Navbar: "Upgrade to ₹799 →"

**₹799 Tier (premium):**
- AIBE 20-6 unlocked (15 papers)
- 10 AI mock tests visible
- Navbar: "✓ Premium" (disabled)

### Dynamic Paper Generation
Papers are generated via JavaScript from `papersData` array:
```javascript
const papersData = [
  { aibe: 20, progress: 68, attempted: true, date: 'May 20' },
  { aibe: 19, progress: 0, attempted: false, date: null },
  // ... through AIBE 5
];
```

Each paper card includes:
- Circular SVG progress indicator
- Paper name & meta info
- Start/Continue buttons
- Review button (only if completed)

### Navbar Integration
Matches homepage navbar with:
- Blurred frosted glass backdrop
- Sticky behavior with scroll shadow
- Logo: "Legalite**.**ai" with gold italic dot
- Button changes based on plan tier

---

## Key Features Implemented (Design)

✅ **Practice Papers Section**
- 2-column grid (responsive)
- Circular progress indicators
- Tier-based visibility (papers show based on plan)

✅ **AI Mock Tests Section**
- Same card layout as practice papers
- Tier-based count (5 for ₹299, 10 for ₹799)
- Empty state for free users with upgrade CTA

✅ **Quick Stats (Hero Section)**
- 3-card stat display
- Papers Completed, Average Score, Weak Subjects
- Hover animations

✅ **Recent Attempts Table**
- Compact card layout on mobile
- Shows score, date, time taken
- Review button per attempt

✅ **Progress Section**
- 2-column layout: Strong/Weak subjects
- Subject list with percentages
- Simple, clean design

---

## Next Steps for Claude Code

### Phase 1: Setup & Authentication (Week 1)
- [ ] Initialize React project with TypeScript
- [ ] Set up Supabase project
  - [ ] Create `users` table with RLS
  - [ ] Create `papers` table
  - [ ] Create `questions` table
  - [ ] Create `attempts` table
  - [ ] Create `answers` table
- [ ] Implement Supabase Auth (email/password, Google OAuth)
- [ ] Protected routes & redirects
- [ ] User profile page (exam date, plan info)

### Phase 2: Core Features (Week 2-3)
- [ ] Seed question data (AIBE 20, AIBE 19)
  - Start with 100 sample questions per paper
  - Add explanations, bare act page references
- [ ] Dashboard page (convert HTML → React component)
  - Use design system from homepage/dashboard
  - Implement tier-based paper visibility
  - Dynamic paper generation from DB
- [ ] Test interface (`/test/:paperId`)
  - Question carousel with timer
  - Option selection & storage
  - Submission & score calculation
- [ ] Review answers page (`/review/:attemptId`)
  - Full question display
  - Show correct/incorrect answers
  - Display bare act page references (if user is ₹299+)

### Phase 3: Payments & Companion Mode (Week 4)
- [ ] Razorpay integration
  - Create orders for ₹299 and ₹799
  - Webhook for payment success
  - Update user.plan in Supabase
- [ ] Companion mode (`/companion/:attemptId`)
  - Real-time pace calculation
  - Polling every 5 seconds for progress
  - Display time elapsed & target question
- [ ] Dashboard updates on payment
  - Rerender papers based on new plan

### Phase 4: Polish & Optimization (Week 5+)
- [ ] Performance optimization (query caching, lazy loading)
- [ ] Mobile responsiveness testing (especially companion mode)
- [ ] Error handling & user feedback
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Analytics integration
- [ ] Testing (unit, integration, E2E)

---

## Database Schema (Ready for Implementation)

See `PRODUCT_SPEC.md` for full schema. Key tables:

### users
```sql
id (uuid) | email | password | full_name | phone | exam_date | plan ('free'|'paid'|'premium') | created_at
```

### papers
```sql
id ('aibe_20', 'aibe_19') | title | is_free | created_at
```

### questions
```sql
id | paper_id | question_number | question_text | option_a | option_b | option_c | option_d | correct_option | subject | explanation | bare_act_pages (jsonb) | created_at
```

### attempts
```sql
id | user_id | paper_id | started_at | completed_at | duration_minutes | score | status ('in_progress'|'completed') | created_at
```

### answers
```sql
id | attempt_id | question_id | selected_option | is_correct | time_spent_seconds | marked_for_review | created_at
```

---

## Design System Files to Reference

**Homepage:** `Legalite Homepage.html`
- Color definitions in `:root` CSS variables
- Button styles (`.btn`, `.btn-primary`, `.btn-gold`, `.btn-ghost`)
- Navbar design (`.nav`, `.nav-inner`, `.brand`)
- Type scales and typography system

**Dashboard:** `Dashboard.html`
- Additional color refinements (body text, borders)
- Card styles (`.paper-card`, `.stat-card`, `.progress-card`)
- Spacing system (padding, gaps, margins)
- Lock state styling (`.locked`, `.locked-badge`, `.lock-icon`)
- Circular progress indicator (SVG)

---

## Important Notes

### 1. Warm Beige Aesthetic
Maintain throughout all new screens:
- Subtle, elegant color palette
- Minimal use of gradients/borders
- Generous whitespace
- Serif headlines + sans-serif body
- Smooth, premium animations (not jarring)

### 2. Tier-Based Logic
Every feature access must check `user.plan`:
```javascript
if (userPlan === 'free') {
  // Show only AIBE 20
} else if (userPlan === 'paid') {
  // Show AIBE 20-11
} else if (userPlan === 'premium') {
  // Show AIBE 20-6
}
```

### 3. Real-Time Sync
Companion mode needs real-time progress updates:
- Poll `/api/attempt/{id}/progress` every 5 seconds
- Show current time elapsed + question count
- Update target question in real-time

### 4. Bare Act References
High priority:
- Store page numbers for all 3 editions (Universal, EBC, LexisNexis)
- Show in review: "📖 Universal Ed. — Page 142"
- Hide from free users with lock message

### 5. AIBE Context
- 100 questions, 3.5 hours (210 minutes)
- 4 MCQ options (A/B/C/D)
- 19 subjects covered
- No negative marking, pass: 45% (Gen/OBC), 40% (SC/ST)
- **Critical:** New criminal laws (BNS/BNSS/BSA) are 90% of criminal Qs

### 6. Exam Date: June 7, 2026
- Urgency for students: countdown timer on dashboard?
- After June 7, pivot to AIBE 22 marketing

---

## File Locations

```
legalite/
├── Legalite Homepage.html          # Marketing page
├── Dashboard.html                  # User dashboard (design prototype)
├── PRODUCT_SPEC.md                 # Full specification
├── HANDOFF_TO_CLAUDE_CODE.md       # This file
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx           # Dashboard component (build from HTML)
│   │   ├── TestInterface.tsx       # Online test taking
│   │   ├── ReviewAnswers.tsx       # Answer review page
│   │   ├── CompanionMode.tsx       # Real-time pace guide
│   │   ├── PricingCards.tsx        # Pricing from homepage
│   │   └── Navbar.tsx              # Reusable navbar
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── TestPage.tsx
│   │   ├── ReviewPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   └── PricingPage.tsx
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client
│   │   ├── auth.ts                 # Auth utilities
│   │   ├── payments.ts             # Razorpay integration
│   │   └── calculations.ts         # Score, pace logic
│   ├── styles/
│   │   ├── globals.css             # Color vars, typography
│   │   └── components.css          # Component styles
│   └── App.tsx
├── public/
│   └── (favicon, etc.)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Environment Variables (.env)

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_RAZORPAY_KEY_ID=xxx
VITE_APP_URL=http://localhost:5173
```

---

## Quick Start Checklist

- [ ] Clone repo, install dependencies
- [ ] Create Supabase project, link via .env
- [ ] Set up authentication (email + Google OAuth)
- [ ] Create database tables & RLS policies
- [ ] Seed AIBE 20 & AIBE 19 questions (or use fixtures)
- [ ] Build Dashboard component from HTML design
- [ ] Build TestInterface component
- [ ] Test paper visibility based on plan tier
- [ ] Integrate Razorpay payments
- [ ] Build Companion mode with polling
- [ ] Deploy to Vercel/Netlify

---

## Questions for Claude Code

Before starting, clarify:
1. Preferred frontend framework? (React, Vue, Svelte?)
2. State management? (React Context, Zustand, Redux?)
3. UI library? (Tailwind, shadcn, Material-UI?) → **Recommend: Build from scratch, use design system from HTML**
4. Hosting? (Vercel, Netlify, AWS?)
5. Database backups strategy?
6. Email service for auth? (Supabase built-in or SendGrid?)

---

## Contact & Support

For questions about:
- **Design:** Reference `Legalite Homepage.html` and `Dashboard.html`
- **Product:** See `PRODUCT_SPEC.md` (complete technical spec)
- **Features:** Check user flows section in spec
- **Data:** Database schema in `PRODUCT_SPEC.md`

---

**Handoff Complete** ✅
**Date:** May 24, 2026
**Status:** Ready for development
**Next:** Start React/Supabase implementation
