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
    e.preventDefault();           // ← Esto es clave
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();

      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        setError(supabaseError.message);
        return;
      }

      // Login exitoso
      window.location.href = '/dashboard';

    } catch (err: any) {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md border border-zinc-900 p-8 rounded-2xl">
        <div className="text-center mb-10">
          <p className="font-mono text-xs tracking-widest text-zinc-500 mb-3">RZLT</p>
          <h1 className="text-4xl font-bold mb-3">Welcome back.</h1>
          <p className="text-zinc-400">Continue your experiment.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-white outline-none"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl focus:border-white outline-none"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-950/30 p-3 rounded
