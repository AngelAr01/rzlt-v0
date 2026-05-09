'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister() {
    try {
      setLoading(true)
      setError('')

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      console.log('REGISTER SUCCESS:', data)

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
      <div className="w-full max-w-sm border border-zinc-800 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Create Account
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border border-zinc-800 px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border border-zinc-800 px-4 py-3"
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
            {loading ? 'Loading...' : 'Create Account'}
          </button>

        </div>
      </div>
    </main>
  )
}
