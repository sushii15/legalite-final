import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CompanionMode } from '@/components/CompanionMode'

interface CompanionPageProps {
  user: any
  userPlan: 'free' | 'paid' | 'premium'
}

export function CompanionPage({ user, userPlan }: CompanionPageProps) {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!attemptId) {
      setError('No test session found')
      setLoading(false)
      return
    }

    // Companion mode is ready - start polling in the component
    setLoading(false)
  }, [attemptId])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <p>Loading companion...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>📊 Test Companion</h1>
      <CompanionMode attemptId={attemptId!} />
    </div>
  )
}
