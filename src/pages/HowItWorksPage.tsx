import { useNavigate } from 'react-router-dom'

export function HowItWorksPage() {
  const navigate = useNavigate()

  return (
    <>
      <section className="hero">
        <div className="page-wrap">
          <div className="fade-up d-1">
            <div className="eyebrow">How It Works</div>
            <h1 className="h1">Three steps to pass<span style={{ display: 'block' }}>AIBE.</span></h1>
          </div>
          <p className="lede fade-up d-2">
            Train how you like — on paper or directly in Legalite. We recommend paper. It's how the real
            exam works.
          </p>
        </div>
      </section>

      <section className="steps" style={{ padding: '96px 0' }}>
        <div className="page-wrap">
          <div className="step fade-up d-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', marginBottom: '128px', position: 'relative' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '140px', lineHeight: '0.9', fontWeight: 500, color: 'var(--gold)', opacity: 0.15, letterSpacing: '-0.03em', position: 'absolute', top: '-40px', left: '-20px', pointerEvents: 'none' }}>
              01
            </div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h3 className="h3">Bring the right bare acts to your practice.</h3>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--ink-2)', marginBottom: 0, maxWidth: '480px' }}>
                Legalite helps you bring the RIGHT bare acts — clean, no commentary, exam-approved. Download
                the PDF and write on paper with your annotated Bare Acts, just like June 7th. Or take it
                online in Legalite. Your choice. We recommend paper for the real exam feel.
              </p>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', padding: '40px', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '12px' }}>Q 47</div>
                <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink)', lineHeight: '1.6', marginBottom: '24px' }}>
                  Under Article 21 of the Indian Constitution, the right to life includes the right to live with human dignity. Which Supreme Court judgment first expanded the scope of Article 21?
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {['Maneka Gandhi v. Union of India', 'Kesavananda Bharati v. State of Kerala', 'Golaknath v. State of Punjab', 'Shankari Prasad v. Union of India'].map((option, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)', transition: 'all 0.2s' }}>
                      <input type="radio" name="q47" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      <span style={{ fontSize: '14px', color: 'var(--ink)' }}>{String.fromCharCode(65 + i)}) {option}</span>
                    </label>
                  ))}
                </div>

                <div style={{ padding: '16px', background: 'var(--gold-light)', borderRadius: '8px', border: '1px solid var(--gold)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gold-deep)', marginBottom: '4px' }}>📖 Bare Acts Reference</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-2)' }}>Universal Ed. — pg. 12</div>
                </div>
              </div>
            </div>
          </div>

          <div className="step step-alt fade-up d-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', marginBottom: '128px', position: 'relative', direction: 'rtl' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '140px', lineHeight: '0.9', fontWeight: 500, color: 'var(--gold)', opacity: 0.15, letterSpacing: '-0.03em', position: 'absolute', top: '-40px', right: '-20px', pointerEvents: 'none' }}>
              02
            </div>
            <div style={{ position: 'relative', zIndex: 2, direction: 'ltr' }}>
              <h3 className="h3">Track your confidence. Mark what you'll search.</h3>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--ink-2)', marginBottom: 0, maxWidth: '480px' }}>
                Legalite uses the Red/Orange/Green method: Green for confident answers, Orange for questions
                where you'll need to search the bare acts, Red for unsure. Legalite tracks every mark in
                real-time. After the test, see exactly which topics need more work.
              </p>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', padding: '40px', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden', direction: 'ltr' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '12px' }}>Time Elapsed</div>
                  <div style={{ fontSize: '48px', fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--mono)', marginBottom: '32px' }}>
                    1:24:17
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '8px' }}>Pace Guide</div>
                  <div style={{ fontSize: '14px', color: 'var(--gold-deep)', fontWeight: 600 }}>
                    You should be on Q 47
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '12px' }}>Confidence Tracking</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Green (Confident)', count: 28, color: '#16a766' },
                      { label: 'Orange (Unsure)', count: 15, color: '#f2c960' },
                      { label: 'Red (Guessed)', count: 4, color: '#c62828' }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: item.color }}></div>
                        <span style={{ fontSize: '13px', color: 'var(--ink-2)' }}>{item.label}: {item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="step fade-up d-5" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', position: 'relative' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '140px', lineHeight: '0.9', fontWeight: 500, color: 'var(--gold)', opacity: 0.15, letterSpacing: '-0.03em', position: 'absolute', top: '-40px', left: '-20px', pointerEvents: 'none' }}>
              03
            </div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h3 className="h3">Find answers in seconds. With your books.</h3>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--ink-2)', marginBottom: 0, maxWidth: '480px' }}>
                After you finish, reveal answers one by one. Every explanation shows the exact page number in
                YOUR bare act edition — Universal, EBC, or LexisNexis. The exact books you'll bring to the
                exam hall. Tab it. You'll find it in seconds on June 7th.
              </p>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '20px', padding: '40px', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '8px' }}>Q 47</div>
                <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)', lineHeight: '1.6', marginBottom: '16px' }}>
                  Under Article 21 of the Indian Constitution, the right to life includes the right to live with human dignity. Which Supreme Court judgment first expanded the scope of Article 21?
                </h3>

                <div style={{ padding: '12px', background: '#e8f5e9', borderRadius: '8px', marginBottom: '16px', borderLeft: '3px solid #16a766' }}>
                  <div style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 600 }}>✓ Correct Answer: B</div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--ink-3)', fontWeight: 600, marginBottom: '8px' }}>Explanation</div>
                  <p style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: '1.6' }}>
                    Maneka Gandhi v. Union of India (1978) is the landmark judgment that significantly expanded the scope of Article 21. Justice P.N. Bhagwati held that the right to life is not merely confined to existence but includes the right to live with human dignity.
                  </p>
                </div>

                <div style={{ padding: '16px', background: 'var(--gold-light)', borderRadius: '8px', border: '1px solid var(--gold)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gold-deep)', marginBottom: '8px' }}>📖 Bare Acts References</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--ink-2)' }}>
                    <div>Universal Ed. — pg. 12</div>
                    <div>EBC Ed. — pg. 8</div>
                    <div>LexisNexis Ed. — pg. 15</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '96px 0', background: 'var(--cream)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="page-wrap">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 className="h2">Built for your way.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {[
              { num: '01', title: 'Print Mode', desc: 'Print PDFs or take tests online — your choice' },
              { num: '02', title: 'Confidence Tracking', desc: "Red, Orange, Green method shows what you'll search" },
              { num: '03', title: 'Bare Act Refs', desc: 'Universal, EBC, LexisNexis page numbers included' },
              { num: '04', title: 'Progress Tracking', desc: 'See your weak subjects after each test' },
              { num: '05', title: 'AI Mocks', desc: 'Unlimited fresh practice questions' },
              { num: '06', title: 'Re-entry Mode', desc: 'Built for people 1–2 years out of law' },
            ].map((feature) => (
              <div
                key={feature.num}
                className="fade-up"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ fontFamily: 'var(--serif)', fontSize: '48px', fontWeight: 500, color: 'var(--gold)', marginBottom: '16px' }}>
                  {feature.num}
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 500, color: 'var(--ink)', marginBottom: '12px' }}>
                  {feature.title}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--ink-2)', lineHeight: 1.55 }}>
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '96px 0', textAlign: 'center' }}>
        <div className="page-wrap">
          <h2 className="h2 fade-up" style={{ color: 'var(--cream)', marginBottom: '12px' }}>
            Ready to pass?
          </h2>
          <p className="lede fade-up d-2" style={{ color: 'rgba(251, 247, 240, 0.7)', marginBottom: '40px' }}>
            Start with a free paper. Upgrade when you're ready.
          </p>
          <div className="fade-up d-3" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/')} className="btn btn-gold btn-lg">
              Start Learning Now
            </button>
            <button onClick={() => navigate('/signup')} className="btn btn-ghost btn-lg">
              Sign Up
            </button>
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
