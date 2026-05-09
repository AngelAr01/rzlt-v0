'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError('Something went wrong. Try again.');
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: email,
        username: username.toLowerCase().trim(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

    if (profileError) {
      setError(
        profileError.code === '23505'
          ? 'Username already taken.'
          : profileError.message
      );
      setLoading(false);
      return;
    }

    router.push('/onboarding');
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md border border-zinc-900 p-8">
        <div className="text-center mb-10">
          <p className="font-mono text-xs tracking-widest text-zinc-500 mb-3">RZLT</p>
          <h1 className="text-4xl font-bold mb-3">Create account</h1>
          <p className="text-zinc-400">Join the experiment.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white placeholder:text-zinc-700 focus:border-white outline-none"
            required
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white placeholder:text-zinc-700 focus:border-white outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password (min. 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white placeholder:text-zinc-700 focus:border-white outline-none"
            minLength={8}
            required
          />

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-950/30 p-3">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-base font-medium bg-white text-black hover:bg-zinc-200"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
