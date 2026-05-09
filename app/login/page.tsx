'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();

      const { error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        setError(supabaseError.message);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs tracking-[3px] text-zinc-500 mb-2">RZLT</p>
          <h1 className="text-4xl font-bold mb-2">Welcome back.</h1>
          <p className="text-zinc-400">Continue your experiment.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-900 p-3 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-base font-medium bg-white text-black hover:bg-zinc-200"
          >
            {loading ? 'Entering the lab...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-white hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
