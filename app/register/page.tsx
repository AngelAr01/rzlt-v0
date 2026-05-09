'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function 
    try {
      setLoading(true)
      setError('')
console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE KEY EXISTS:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
  console.log('FULL ERROR:', error)
  setError(JSON.stringify(error))
  return
}
    
      const user = data.user

      if (!user) {
        setError('User not created')
        return
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email,
          username,
        })

      if (profileError) {
        setError(profileError.message)
        return
      }

      router.push('/onboarding')

    } catch (err) {
      console.error(err)
      setError('Something went wrong')

    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-4">

        <h1 className="text-3xl font-bold">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 px-4 py-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 px-4 py-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 px-4 py-3"
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-white text-black py-3 font-bold"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

      </div>
    </main>
  )
}
