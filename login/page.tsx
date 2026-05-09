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

    // Prueba temporal
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/dashboard';
    }, 800);
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header elegante */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="font-mono text-xs tracking-[4px] text-zinc-500">EXPERIMENT</span>
          </div>
          <h1 className="text-6xl font-bold tracking-tighter text-white">RZLT</h1>
          <p className="text-2xl mt-4 text-white">Welcome back.</p>
          <p className="text-zinc-400 mt-1">Continue your experiment.</p>
        </div>

        {/* Formulario */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-700 focus:border-zinc-500 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 outline-none"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-700 focus:border-zinc-500 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 outline-none"
                required
              />
            </div>

            {error && <p className="text-red-400 text-center text-sm">{error}</p>}

            <button
              type
