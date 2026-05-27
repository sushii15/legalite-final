import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '@/lib/auth'
import '../styles/navbar.css'

interface NavbarProps {
  user: any
  userPlan?: 'free' | 'paid' | 'premium'
  onUpgradeClick?: () => void
}

export function Navbar({ user, userPlan = 'free', onUpgradeClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const getButtonText = () => {
    if (!user) return null
    if (userPlan === 'free') return 'Upgrade to ₹299 →'
    if (userPlan === 'paid') return 'Upgrade to ₹799 →'
    return '✓ Premium'
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          Legalite<span className="brand-dot">.ai</span>
        </Link>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/how-it-works" style={{ color: 'var(--ink-2)', fontSize: '15px', textDecoration: 'none', fontFamily: 'var(--sans)', fontWeight: 500 }}>
                How It Works
              </Link>
              <button
                className="nav-button nav-button-secondary"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button nav-button-ghost">
                Log In
              </Link>
              <Link to="/signup" className="nav-button nav-button-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
