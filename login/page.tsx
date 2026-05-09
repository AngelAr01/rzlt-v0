'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setMessage('Login simulado - funciona el botón ✅');
      setLoading(false);
      // window.location.href = '/dashboard';  // descomenta cuando quieras redirigir
    }, 600);
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-bold tracking-tighter">RZLT</h1>
          <p className="text-3xl mt-6">Welcome back.</p>
          <p className="text-zinc-400 mt-2">Continue your experiment.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-yellow-300 text-black placeholder:text-black/70 rounded-3xl px-6 py-4 text-lg outline-none"
            placeholder="Email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
