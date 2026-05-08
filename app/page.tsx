// app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-zinc-900">
        <span className="font-mono text-sm tracking-widest text-zinc-400">
          RZLT
        </span>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
              Join the experiment
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-24">
        <p className="font-mono text-xs tracking-widest text-zinc-500 mb-6 uppercase">
          Performance Intelligence · V0
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none">
          You think you're
          <br />
          <span className="text-zinc-500">playing your A-game.</span>
          <br />
          You're probably not.
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mb-10 leading-relaxed">
          Most EV is destroyed by mental state, not strategy.
          RZLT tracks the gap between how you feel and how you actually perform.
        </p>
        <Link href="/register">
          <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-mono text-sm tracking-wider px-8">
            Start 7-Day Experiment →
          </Button>
        </Link>
        <p className="text-zinc-600 text-xs mt-4 font-mono">
          Free · Anonymous · No wearable required
        </p>
      </section>

      {/* Problem */}
      <section className="border-t border-zinc-900 px-8 py-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
        {[
          {
            label: 'HUDs analyze hands.',
            sub: 'Not the state you were in when you played them.'
          },
          {
            label: 'Trackers analyze results.',
            sub: 'Not why the results happened.'
          },
          {
            label: 'Wearables analyze health.',
            sub: 'Not its impact on your decisions.'
          }
        ].map((item) => (
          <div key={item.label} className="border border-zinc-800 p-6">
            <p className="text-white font-mono text-sm mb-2">{item.label}</p>
            <p className="text-zinc-500 text-sm">{item.sub}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-8 py-6 flex justify-between items-center">
        <span className="font-mono text-xs text-zinc-600">RZLT · V0 · 2025</span>
        <span className="font-mono text-xs text-zinc-600">Performance Intelligence System</span>
      </footer>
    </main>
  )
}
