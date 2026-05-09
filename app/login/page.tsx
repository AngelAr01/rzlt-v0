'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
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
      
      console.log("🔄 Intentando login con:", email);

      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        console.error("❌ Error Supabase:", supabaseError);
        setError(supabaseError.message);
        return;
      }

      console.log("✅ Login exitoso!", data.user?.email);
      
      // Redirección fuerte
      window.location.href = '/dashboard';

    } catch (err: any) {
      console.error("❌ Error catch:", err);
      setError('Error inesperado. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-zinc-900 p-8 rounded-xl">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs tracking-widest text-zinc-500 mb-3">RZLT</p>
          <h1 className="text-3xl font-bold mb-2">Welcome back.</h1>
          <p className="text-zinc-500">Continue your experiment.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white rounded"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border border-zinc-800 px-4 py-3 text-sm outline-none focus:border-white rounded"
            required
          />

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-zinc-200 py-6 font-medium"
          >
            {loading ? 'Entering the lab...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-white hover:underline">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
