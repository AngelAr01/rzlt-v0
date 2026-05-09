'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setMessage("✅ Botón funciona");
      setLoading(false);
      // window.location.href = "/dashboard"; // descomenta después
    }, 600);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center">
          <h1 className="text-7xl font-bold tracking-tighter">RZLT</h1>
          <p className="text-3xl mt-4">Welcome back.</p>
          <p className="text-zinc-400">Continue your experiment.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-5 text-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-5 text-lg"
          />

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-5 rounded-2xl text-xl font-medium"
          >
            {loading ? "Cargando..." : "Sign In"}
          </button>
        </form>

        {message && <p className="text-green-400 text-center">{message}</p>}

        <p className="text-center text-zinc-500">
          No tienes cuenta? <Link href="/register" className="text-white">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
