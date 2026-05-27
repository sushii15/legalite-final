import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmail, signInWithGoogle } from '@/lib/auth'

export function LoginPageComponent() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmail(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Failed to log in with Google')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="login-wrapper">
        <div className="card login-card fade-up d-1">
          <div className="eyebrow">Welcome back</div>
          <h1 className="login-title">Log In</h1>
          <p className="login-subtitle">Access your AIBE prep.</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-options">
              <label className="checkbox-wrap">
                <input type="checkbox" className="checkbox-input" disabled={loading} />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '28px 0', color: 'var(--ink-3)', fontSize: '13px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }}></div>
              or
              <div style={{ flex: 1, height: '1px', background: 'var(--line)' }}></div>
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-block btn-lg"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              Continue with Google
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-block btn-lg"
              style={{ marginTop: '12px' }}
              onClick={() => alert('Apple login coming soon')}
              disabled={loading}
            >
              Continue with Apple
            </button>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--ink-2)' }}>
              Don't have an account?{' '}
              <a
                onClick={() => navigate('/signup')}
                style={{ color: 'var(--gold-deep)', fontWeight: 600, cursor: 'pointer' }}
              >
                Sign up here
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
