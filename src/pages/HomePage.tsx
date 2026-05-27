import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <section className="hero">
        <div className="page-wrap hero-grid">
          <div className="hero-left">
            <div className="eyebrow fade-up d-1">AIBE 21 — June 7, 2026</div>
            <h1 className="h1 fade-up d-2">Pass the AIBE.<br />Practice law.</h1>
            <p className="lede fade-up d-3">
              20 real AIBE papers. A live pace companion. Bare act page references for every answer.
            </p>
            <div className="hero-cta fade-up d-4">
              <button onClick={() => navigate('/signup')} className="btn btn-primary btn-lg">
                Start Learning Now
              </button>
              <button onClick={() => navigate('/signup')} className="btn btn-ghost btn-lg">
                Sign Up
              </button>
            </div>
          </div>

          <div className="hero-right">
            <div className="stats-2x2 fade-up d-3">
              <div className="stat-box">
                <div className="stat-num">20</div>
                <div className="stat-lbl">Practice Exams</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">10</div>
                <div className="stat-lbl">AI-graded Mocks</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">2.5<span className="unit">L+</span></div>
                <div className="stat-lbl">Candidates Yearly</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">June 7 2026</div>
                <div className="stat-lbl">AIBE 21 Exam</div>
              </div>
            </div>

            <div className="qcard fade-up d-5">
              <div className="qcard-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="qchip"><span className="qchip-dot"></span> Constitutional Law</span>
                  <span className="qchip-pill">High Weightage</span>
                </div>
                <span className="qcount">Q 47 / 100</span>
              </div>

              <p className="qtext">
                Under Article 21 of the Constitution, the right to life and personal liberty has been
                judicially expanded to include which of the following?
              </p>

              <div className="qopts">
                <button className="qopt" data-letter="A">
                  <span className="qopt-letter"><span>A</span></span>Right to property
                </button>
                <button className="qopt correct" data-letter="B">
                  <span className="qopt-letter"><span>B</span></span>Right to a clean environment
                </button>
                <button className="qopt" data-letter="C">
                  <span className="qopt-letter"><span>C</span></span>Right to vote
                </button>
                <button className="qopt" data-letter="D">
                  <span className="qopt-letter"><span>D</span></span>Right to bear arms
                </button>
              </div>

              <div className="qreveal">
                <div className="qreveal-title">Answer revealed · with references</div>
                <div className="qreveal-body">
                  The Supreme Court has read Article 21 expansively — <em>Subhash Kumar v. State of
                    Bihar</em> (1991) established the right to a pollution-free environment as a facet
                  of the right to life.
                </div>
                <div className="qrefs">
                  <div className="qref">
                    <span className="qref-icon">📖</span><span className="qref-key">Article 21</span>&nbsp;
                    — Constitution of India
                  </div>
                  <div className="qref">📄 Bare Acts references with page numbers</div>
                  <div className="qref">
                    <span className="qref-icon">⭐</span><span className="qref-key">Repeat</span>&nbsp;
                    — Appeared in AIBE 17, 18, 20
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(180deg, rgba(139,115,85,0.03) 0%, transparent 100%)', padding: '80px 32px', marginBottom: '80px', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="page-wrap">
          <div style={{ maxWidth: '600px', margin: '0 auto 60px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '16px' }}>Limited Time Offer</div>
            <h2 style={{ fontSize: '32px', fontWeight: 600, margin: '0 0 12px 0', color: 'var(--ink)', fontFamily: 'var(--serif)' }}>Free access through May 30</h2>
            <p style={{ fontSize: '16px', color: 'var(--ink-2)', margin: '0', lineHeight: '1.6' }}>
              Get full access to all 20 papers and 10 AI mock tests at no cost. No card required.
            </p>
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="page-wrap">
          <div className="section-head">
            <div className="section-eye">Pricing</div>
            <h2 className="h2">
              Plans for later. <span className="accent">Free right now.</span>
            </h2>
            <p className="section-sub">
              As of now, all plans are free until May 30, 2026. These options will be available after the free period ends.
            </p>
          </div>

          <div className="price-grid">
            <div className="pcard">
              <div className="pcard-tier">Free Forever</div>
              <div className="pcard-sub">For the curious starter</div>
              <div className="pcard-price">
                <div className="pcard-amt">₹0</div>
              </div>
              <div className="pcard-note">No card needed</div>
              <div className="pcard-divider"></div>
              <ul className="pfeats">
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>1 full AIBE paper
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Companion mode (live pacing)
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Print mode for offline practice
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Basic answer explanations
                </li>
              </ul>
              <button onClick={() => navigate('/signup')} className="btn btn-ghost btn-block btn-lg">
                Get Started Free
              </button>
            </div>

            <div className="pcard featured" style={{ opacity: 0.5, pointerEvents: 'none' }}>
              <div className="pcard-badge">Most Popular</div>
              <div className="pcard-tier">Monthly</div>
              <div className="pcard-sub">For serious candidates</div>
              <div className="pcard-price">
                <div className="pcard-amt">
                  ₹<span className="accent">299</span>
                </div>
              </div>
              <div className="pcard-note">per month · cancel anytime</div>
              <div className="pcard-divider"></div>
              <ul className="pfeats">
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>10 real past exams
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>5 AI tests
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Companion mode (live pacing)
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Bare act page references
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Progress tracking & analytics
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Study guides<span className="soon">Coming</span>
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Flashcards<span className="soon">Coming</span>
                </li>
              </ul>
              <button onClick={() => navigate('/signup')} className="btn btn-gold btn-block btn-lg">
                Start for ₹299
              </button>
            </div>

            <div className="pcard" style={{ opacity: 0.5, pointerEvents: 'none' }}>
              <div className="pcard-bestvalue">Best Value</div>
              <div className="pcard-tier">6 Months</div>
              <div className="pcard-sub">For the all-in attempt</div>
              <div className="pcard-price">
                <div className="pcard-amt">₹799</div>
              </div>
              <div className="pcard-note">6 months · save 55%</div>
              <div className="pcard-divider"></div>
              <ul className="pfeats">
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>15 real past exams
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>10 AI tests
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Companion mode (live pacing)
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Bare act page references
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Study guides<span className="soon">Coming</span>
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Flashcards<span className="soon">Coming</span>
                </li>
                <li className="pfeat">
                  <span className="pfeat-check">✓</span>Hindi UI<span className="soon">Coming</span>
                </li>
              </ul>
              <button onClick={() => navigate('/signup')} className="btn btn-primary btn-block btn-lg">
                Get 6 Months
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="page-wrap foot-inner">
          <div className="foot-brand">
            Legalite<span className="accent">.ai</span>
          </div>
          <div className="foot-disclaim">Not affiliated with the Bar Council of India.</div>
          <div className="foot-links">
            <a className="foot-link" href="#">Privacy</a>
            <a className="foot-link" href="#">Terms</a>
            <a className="foot-link" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </>
  )
}
