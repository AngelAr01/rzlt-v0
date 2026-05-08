// app/checkin/post/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type PostData = {
  actual_duration: string
  session_result: string
  decision_quality: number
  emotional_stability: number
  mental_fatigue: number
  tilt_experienced: number
  played_longer: boolean | null
  chased_losses: boolean | null
  unusual_decisions: boolean | null
  a_game_score: number
}

function OptionBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border font-mono text-sm transition-colors ${
        selected ? 'border-white bg-white text-black' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

function Scale({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {[1,2,3,4,5,6,7,8,9,10].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`w-10 h-10 font-mono text-sm border transition-colors ${
            value === n ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-500'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

const TOTAL = 10

function PostSessionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSessionId = searchParams.get('pre')
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState<PostData>({
    actual_duration: '',
    session_result: '',
    decision_quality: 0,
    emotional_stability: 0,
    mental_fatigue: 0,
    tilt_experienced: 0,
    played_longer: null,
    chased_losses: null,
    unusual_decisions: null,
    a_game_score: 0,
  })

  function canAdvance() {
    switch (step) {
      case 1: return !!data.actual_duration
      case 2: return !!data.session_result
      case 3: return data.decision_quality > 0
      case 4: return data.emotional_stability > 0
      case 5: return data.mental_fatigue > 0
      case 6: return data.tilt_experienced > 0
      case 7: return data.played_longer !== null
      case 8: return data.chased_losses !== null
      case 9: return data.unusual_decisions !== null
      case 10: return data.a_game_score > 0
      default: return false
    }
  }

  async function handleSubmit() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const now = new Date()
    await supabase.from('post_session_checkins').insert({
      user_id: user.id,
      pre_session_id: preSessionId ?? null,
      session_date: now.toISOString().split('T')[0],
      completed_at: now.toISOString(),
      ...data,
    })

    router.push('/dashboard')
  }

  const questions: Record<number, string> = {
    1: 'How long was your session?',
    2: 'What was the result of the session?',
    3: 'How would you rate your decision quality?',
    4: 'How emotionally stable were you during the session?',
    5: 'How mentally fatigued do you feel right now?',
    6: 'Did you experience tilt or emotional frustration?',
    7: 'Did you continue playing longer than originally planned?',
    8: 'Did you chase losses during this session?',
    9: 'Did you make decisions you normally would not make?',
    10: 'Do you feel this session reflected your A-game?',
  }

  const steps: Record<number, React.ReactNode> = {
    1: (
      <div className="flex flex-col gap-3">
        {[['<1h','Less than 1 hour'],['1-2h','1–2 hours'],['2-4h','2–4 hours'],['4-6h','4–6 hours'],['6h+','6+ hours']].map(([v,l]) => (
          <OptionBtn key={v} label={l} selected={data.actual_duration === v} onClick={() => setData(d => ({ ...d, actual_duration: v }))} />
        ))}
      </div>
    ),
    2: (
      <div className="flex flex-col gap-3">
        {[['big_loss','Big Loss'],['small_loss','Small Loss'],['break_even','Break Even'],['small_win','Small Win'],['big_win','Big Win']].map(([v,l]) => (
          <OptionBtn key={v} label={l} selected={data.session_result === v} onClick={() => setData(d => ({ ...d, session_result: v }))} />
        ))}
      </div>
    ),
    3: <Scale value={data.decision_quality} onChange={v => setData(d => ({ ...d, decision_quality: v }))} />,
    4: <Scale value={data.emotional_stability} onChange={v => setData(d => ({ ...d, emotional_stability: v }))} />,
    5: <Scale value={data.mental_fatigue} onChange={v => setData(d => ({ ...d, mental_fatigue: v }))} />,
    6: <Scale value={data.tilt_experienced} onChange={v => setData(d => ({ ...d, tilt_experienced: v }))} />,
    7: (
      <div className="flex flex-col gap-3">
        <OptionBtn label="Yes" selected={data.played_longer === true} onClick={() => setData(d => ({ ...d, played_longer: true }))} />
        <OptionBtn label="No" selected={data.played_longer === false} onClick={() => setData(d => ({ ...d, played_longer: false }))} />
      </div>
    ),
    8: (
      <div className="flex flex-col gap-3">
        <OptionBtn label="Yes" selected={data.chased_losses === true} onClick={() => setData(d => ({ ...d, chased_losses: true }))} />
        <OptionBtn label="No" selected={data.chased_losses === false} onClick={() => setData(d => ({ ...d, chased_losses: false }))} />
      </div>
    ),
    9: (
      <div className="flex flex-col gap-3">
        <OptionBtn label="Yes" selected={data.unusual_decisions === true} onClick={() => setData(d => ({ ...d, unusual_decisions: true }))} />
        <OptionBtn label="No" selected={data.unusual_decisions === false} onClick={() => setData(d => ({ ...d, unusual_decisions: false }))} />
      </div>
    ),
    10: <Scale value={data.a_game_score} onChange={v => setData(d => ({ ...d, a_game_score: v }))} />,
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-xs text-zinc-500 tracking-wider">POST-SESSION CHECK-IN</span>
            <span className="font-mono text-xs text-zinc-600">{step}/{TOTAL}</span>
          </div>
          <Progress value={(step / TOTAL) * 100} className="h-px bg-zinc-900" />
        </div>

        <h2 className="text-xl font-bold mb-8">{questions[step]}</h2>
        {steps[step]}

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="text-zinc-500 hover:text-white">
              ← Back
            </Button>
          )}
          <Button
            onClick={step < TOTAL ? () => setStep(s => s + 1) : handleSubmit}
            disabled={!canAdvance() || loading}
            className="flex-1 bg-white text-black hover:bg-zinc-200 font-mono tracking-wider disabled:opacity-30"
          >
            {loading ? 'Saving...' : step < TOTAL ? 'Continue →' : 'Done →'}
          </Button>
        </div>
      </div>
    </main>
  )
}

export default function PostSessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <PostSessionForm />
    </Suspense>
  )
}
