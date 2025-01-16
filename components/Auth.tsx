'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabase'

export function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    setLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Check your email for the confirmation link!')
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Log In'}
        </button>
        <button
          onClick={handleSignUp}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
          disabled={loading}
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}

