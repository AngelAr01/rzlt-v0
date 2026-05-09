'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulación temporal (sin Supabase)
    setTimeout(() => {
      setError('Login simulado - funciona el botón ✅');
      setLoading(false);
      
      // Redirección temporal
      window.location.href = '/dashboard';
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md border border-zinc-800 p-10 rounded-3xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-2">RZLT</h1>
          <p className="text-2xl">Welcome back.</p>
          <p className="text-zinc-500">Continue your experiment.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:border-white outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-2xl focus:border-white outline-none"
            required
          />

          {error && <p className="text-center text-green-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-6 rounded-2xl font-semibold disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-zinc-500">
          No tienes cuenta? <Link href="/register" className="text-white">Regístrate</Link>
        </p>
      </div>
    </main>
  );
}
