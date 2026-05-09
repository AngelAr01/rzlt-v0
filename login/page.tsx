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

    // Versión de prueba sin Supabase
    setTimeout(() => {
      setError('✅ Botón funciona! (versión de prueba)');
      setLoading(false);
      window.location.href = '/dashboard';
    }, 800);
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
            className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-zinc-900 border border-zinc-700 rounded-2xl text-white"
            required
          />

          {error && (
            <div className="text-center text-green-400 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 transition text-black py-6 rounded-2xl font-semibold text-lg disabled:opacity-70"
          >
            {loading ? 'Cargando...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-zinc-500">
          No tienes cuenta?{' '}
          <Link href="/register" className="text-white underline">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
