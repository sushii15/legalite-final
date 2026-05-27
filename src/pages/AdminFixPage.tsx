import { useState } from 'react'

export function AdminFixPage() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const applyRLSFix = async () => {
    setLoading(true)
    setStatus('Attempting to apply RLS policy fix...')

    try {
      // Display the SQL that needs to be run
      const sqlToRun = `
      CREATE POLICY "Users can create their own profile"
      ON user_profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
      `

      setStatus(`
✅ RLS Policy SQL Ready

The following SQL needs to be executed in your Supabase dashboard:

${sqlToRun}

Steps to apply:
1. Go to Supabase Dashboard for your project
2. Navigate to SQL Editor
3. Click "New Query"
4. Paste the SQL above
5. Click "Execute"
6. Return to the signup page and try again

If you see an error about the policy already existing, that's okay - the fix has already been applied.
      `)
    } catch (error: any) {
      setStatus(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '20px',
      fontFamily: 'sans-serif',
      lineHeight: '1.6'
    }}>
      <h1>Legalite.ai RLS Policy Fix</h1>

      <p>
        If you're seeing "new row violates row-level security policy for table user_profiles"
        when trying to sign up, you need to apply the missing RLS INSERT policy.
      </p>

      <button
        onClick={applyRLSFix}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#8B7355',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Generating...' : 'Get RLS Fix SQL'}
      </button>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#333'
      }}>
        {status || 'Click the button above to get the SQL fix.'}
      </div>
    </div>
  )
}
