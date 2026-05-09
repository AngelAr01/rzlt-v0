'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      router.push('/dashboard')
      router.refresh()

    } catch (err) {
      console.error(err)
      setError('Unexpected error')

    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-zinc-900 p-8">

        <div className="mb-8">
          <p className="font-mono text-xs tracking-widest text-zinc-500 mb-3">
            RZLT
          </p>

          <h1 className="text-3xl font-bold mb-2">
            Welcome back.
          </h1>

          <p className="text-zinc-500 text-sm">
            Continue your experiment.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            required
          />

          {error && (
            <div className="border border-red-900 bg-red-950/30 p-3">
              <p className="text-red-400 text-sm">
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-zinc-200 font-mono text-sm tracking-wider mt-2"
          >
            {loading ? 'Loading...' : 'Login →'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-zinc-600 text-sm">
            Don&apos;t have an account?{' '}

            <Link
              href="/register"
              className="text-white hover:text-zinc-300"
            >
              Register
            </Link>
          </p>
        </div>

      </div>
    </main>
  )
}
