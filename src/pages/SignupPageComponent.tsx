import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth'

export function SignupPageComponent() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    examDate: '',
    termsAgreed: false,
    emailUpdates: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.termsAgreed) {
      setError('You must agree to the Terms of Service and Privacy Policy')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      await signUpWithEmail(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone || undefined,
        formData.examDate || undefined
      )
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google')
      setLoading(false)
    }
  }

  return (
    <>
      <section>
        <div className="page-wrap">
          <div className="signup-container">
            <div className="signup-left fade-up d-1">
              <div className="eyebrow">Join thousands of candidates</div>
              <h1 className="signup-h1">Start preparing for AIBE 21.</h1>
              <p className="lede">
                Get access to real AIBE papers, live pace companion, and bare act page references.
                Everything you need to pass on the first attempt.
              </p>

              <ul className="benefit-list">
                <li className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div className="benefit-text">15 real past exams + 5 AI-graded mocks</div>
                </li>
                <li className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div className="benefit-text">Live companion tracks your pace in real-time</div>
                </li>
                <li className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div className="benefit-text">Bare act references for Universal, EBC & LexisNexis</div>
                </li>
                <li className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div className="benefit-text">Red/Orange/Green confidence tracking</div>
                </li>
                <li className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div className="benefit-text">No card needed to start. First paper is free forever.</div>
                </li>
              </ul>
            </div>

            <div className="card fade-up d-2" style={{ borderRadius: '20px', padding: '48px' }}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 500, color: 'var(--ink)', margin: '0 0 8px', textAlign: 'left' }}>
                Create your account
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--ink-2)', marginBottom: '32px' }}>
                Takes 2 minutes. We'll never spam you.
              </p>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', fontSize: '13px' }}>
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your full name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min. 8 characters"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Exam Date</label>
                    <input
                      type="month"
                      className="form-input"
                      name="examDate"
                      value={formData.examDate}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <label className="checkbox-wrap" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px', fontSize: '13px', color: 'var(--ink-2)', lineHeight: '1.5' }}>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    name="termsAgreed"
                    checked={formData.termsAgreed}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <span>
                    I agree to the{' '}
                    <a href="#" style={{ color: 'var(--gold-deep)' }}>
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" style={{ color: 'var(--gold-deep)' }}>
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <label className="checkbox-wrap" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px', fontSize: '13px', color: 'var(--ink-2)', lineHeight: '1.5' }}>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    name="emailUpdates"
                    checked={formData.emailUpdates}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>Send me updates about AIBE 21 prep tips</span>
                </label>

                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--ink-2)' }}>
                  Already have an account?{' '}
                  <a
                    onClick={() => navigate('/login')}
                    style={{ color: 'var(--gold-deep)', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Log in here
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
