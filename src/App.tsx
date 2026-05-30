import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { getCurrentUser, getUserProfile } from '@/lib/auth'
import { createRazorpayOrder, openRazorpayModal, verifyPaymentAndUpdatePlan } from '@/lib/payments'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { HomePage } from '@/pages/HomePage'
import { LoginPageComponent } from '@/pages/LoginPageComponent'
import { SignupPageComponent } from '@/pages/SignupPageComponent'
import { HowItWorksPage } from '@/pages/HowItWorksPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { TestPage } from '@/pages/TestPage'
import { MockTestPage } from '@/pages/MockTestPage'
import { ReviewPage } from '@/pages/ReviewPage'
import { CompanionPage } from '@/pages/CompanionPage'
import './styles/globals.css'
import './styles/pages.css'
import './styles/test.css'

function App() {
  const [user, setUser] = useState(null)
  const [userPlan, setUserPlan] = useState<'free' | 'paid' | 'premium'>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          let profile = null
          try {
            profile = await getUserProfile(currentUser.id)
          } catch (_) {
            // No profile row yet — still treat as logged in with defaults
          }
          const userWithProfile = {
            ...currentUser,
            user_metadata: {
              ...currentUser.user_metadata,
              full_name: profile?.full_name || currentUser.user_metadata?.full_name || 'Learner'
            }
          }
          setUser(userWithProfile)
          setUserPlan(profile?.plan || 'free')
        }
      } catch (error) {
        console.error('Auth error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const handleUpgradeClick = () => {
    // Placeholder for Razorpay integration (Phase 4)
    alert('Razorpay upgrade flow coming in Phase 4')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    )
  }

  // Protected route: redirect to /login if not authenticated
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) return <Navigate to="/login" replace />
    return <>{children}</>
  }

  return (
    <>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar user={user} userPlan={userPlan} onUpgradeClick={handleUpgradeClick} />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPageComponent />} />
              <Route path="/signup" element={<SignupPageComponent />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route
                path="/dashboard"
                element={<ProtectedRoute><DashboardPage user={user} userPlan={userPlan} onUpgradeClick={handleUpgradeClick} /></ProtectedRoute>}
              />
              <Route path="/test/:paperId" element={<ProtectedRoute><TestPage user={user} userPlan={userPlan} /></ProtectedRoute>} />
              <Route path="/review/:attemptId" element={<ProtectedRoute><ReviewPage user={user} userPlan={userPlan} /></ProtectedRoute>} />
              <Route path="/mock/:mockId" element={<ProtectedRoute><MockTestPage user={user} userPlan={userPlan} /></ProtectedRoute>} />
              <Route path="/mock-review/:attemptId" element={<ProtectedRoute><ReviewPage user={user} userPlan={userPlan} /></ProtectedRoute>} />
              <Route path="/companion/:attemptId" element={<ProtectedRoute><CompanionPage user={user} userPlan={userPlan} /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <Analytics />
    </>
  )
}

export default App
