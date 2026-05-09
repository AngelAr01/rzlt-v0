// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()


  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    // Verificar si completó onboarding
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('users')
      .select('onboarding_complete')
      .eq('id', user!.id)
      .single()

    if (!profile?.onboarding_complete) {
      router.push('/onboarding')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link href="/" className="font-mono text-xs text-zinc-600 hover:text-zinc-400">
            ← RZLT
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-zinc-500 text-sm mb-8">Continue your experiment.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <Label className="text-zinc-400 text-xs font-mono tracking-wider mb-2 block">
              EMAIL
            </Label>
            <Input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          <div>
            <Label className="text-zinc-400 text-xs font-mono tracking-wider mb-2 block">
              PASSWORD
            </Label>
            <Input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-mono border border-red-900 bg-red-950/30 px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="bg-white text-black hover:bg-zinc-200 font-mono tracking-wider mt-2"
          >
            {loading ? 'Logging in...' : 'Login →'}
          </Button>
        </form>

        <p className="text-center text-zinc-600 text-sm mt-6">
          No account?{' '}
          <Link href="/register" className="text-zinc-400 hover:text-white">
            Join the experiment
          </Link>
        </p>
      </div>
    </main>
  )
}
