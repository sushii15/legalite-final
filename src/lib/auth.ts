import { supabase } from './supabase'

export async function signUpWithEmail(email: string, password: string, fullName: string, phone?: string, examDate?: string) {
  // Convert month format "2026-06" to date format "2026-06-01" for PostgreSQL DATE type
  const examDateFormatted = examDate ? `${examDate}-01` : null

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone || null,
        exam_date: examDateFormatted
      }
    }
  })

  if (error) throw error

  // Insert user profile with plan = 'free'
  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert([
      {
        id: data.user?.id,
        email,
        full_name: fullName,
        phone: phone || null,
        exam_date: examDateFormatted,
        plan: 'free'
      }
    ])

  if (profileError) throw profileError

  return data
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`
    }
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}
