import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) throw error
  if (!data) throw new Error('User not found')

  // In a real-world application, you should use proper password hashing and comparison
  if (data.password !== password) throw new Error('Invalid password')

  return data
}

export async function signOut() {
  // For now, we'll just return a resolved promise
  // In a real application, you might want to clear any stored session data
  return Promise.resolve()
}

export async function getSession() {
  // For now, we'll just check if there's a stored admin user in localStorage
  const adminUser = localStorage.getItem('adminUser')
  return adminUser ? JSON.parse(adminUser) : null
}

