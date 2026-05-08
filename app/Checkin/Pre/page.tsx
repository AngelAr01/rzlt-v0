// app/checkin/pre/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type PreData = {
  sleep_hours: string
  energy_level: number
  stress_level: number
  focus_level: number
  emotional_stability: number
  confidence_level: number
  caffeine_consumed: boolean | null
  substances_consumed: boolean | null
  exercised_today: boolean | null
  planned_duration: string
}

function OptionBtn({
  label, selected, onClick
}: {
  label: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border font-mono text-sm transition-colors ${
        selected
          ? 'border-white bg-white text-black'
          : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
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
            value === n
              ? 'bg-white text-black border-white'
              : 'border-zinc-800 text-zinc-500 hover:border-zinc-500'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

const TOTAL = 10

export default function PreSessionPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [recordId, setRecordId] = useState<string | null>(null)

  const [data, setData] = useState<PreData>({
    sleep_hours: '',
    energy_level: 0,
    stress_level: 0,
    focus_level: 0,
    emotional_stability: 0,
    confidence_level: 0,
    caffeine_consumed: null,
    substances_consumed: null,
    exercised_today: null,
    planned_duration: '',
  })

  function canAdvance() {
    switch (step) {
      case 1: return !!data.sleep_hours
      case 2: return data.energy_level > 0
      case 3: return data.stress_level > 0
      case 4: return data.focus_level > 0
      case 5: return data.emotional_stability > 0
      case 6: return data.confidence_level > 0
      case 7: return data.caffeine_consumed !== null
      case 8: return data.substances_consumed !== null
      case 9: return data.exercised_today !== null
      case 10: return !!data.planned_duration
      default: return false
    }
  }

  async function handleSubmit() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const now = new Date()
    const { data: record } = await supabase
      .from('pre_session_checkins')
      .insert({
        user_id: user.id,
        session_date: now.toISOString().split('T')[0],
        completed_at: now.toISOString(),
        ...data,
      })
      .select('id')
      .single()

    router.push('/dashboard')
  }

  const questions: Record<number, string> = {
    1: 'How many hours did you sleep last night?',
    2: 'Current energy level',
    3: 'Current stress level',
    4: 'Current focus level',
    5: 'Current emotional stability',
    6: 'How confident do you feel entering this session?',
    7: 'Have you consumed caffeine within the last 4 hours?',
    8: 'Have you consumed alcohol or recreational substances today?',
    9: 'Did you exercise today?',
    10: 'How long do you plan to play today?',
  }

  const steps: Record<number, React.ReactNode> = {
    1: (
      <div className="flex flex-col gap-3">
        {[['<5h','Less than 5 hours'],['5-6h','5–6 hours'],['6-7h','6–7 hours'],['7-8h','7–8 hours'],['8h+','8+ hours']].map(([v,l]) => (
          <OptionBtn key={v} label={l} selected={data.sleep_hours === v} onClick={() => setData(d => ({ ...d, sleep_hours: v }))} />
        ))}
      </div>
    ),
    2: <Scale value={data.energy_level} onChange={v => setData(d => ({ ...d, energy_level: v }))} />,
    3: <Scale value={data.stress_level} onChange={v => setData(d => ({ ...d, stress_level: v }))} />,
    4: <Scale value={data.focus_level} onChange={v => setData(d => ({ ...d, focus_level: v }))} />,
    5: <Scale value={data.emotional_stability} onChange={v => setData(d => ({ ...d, emotional_stability: v }))} />,
    6: <Scale value={data.confidence_level} onChange={v => setData(d => ({ ...d, confidence_level: v }))} />,
    7: (
      <div className="flex flex-col gap-3">
        <OptionBtn label="Yes" selected={data.caffeine_consumed === true} onClick={() => setData(d => ({ ...d, caffeine_consumed: true }))} />
        <OptionBtn label="No" selected={data.caffeine_consumed === false} onClick={() => setData(d => ({ ...d, caffeine_consumed: false }))} />
      </div>
    ),
    8: (
      <div className="flex flex-col gap-3">
        <OptionBtn label="Yes" selected={data.substances_consumed === true} onClick={() => setData(d => ({ ...d, substances_consumed: true }))} />
        <OptionBtn label="No" selected={data.substances_consumed === false} onClick={() => setData(d => ({ ...d, substances_consumed: false }))} />
      </div>
    ),
    9: (
      <div className="flex flex-col gap-3">
        <OptionBtn label="Yes" selected={data.exercised_today === true} onClick={() => setData(d => ({ ...d, exercised_today: true }))} />
        <OptionBtn label="No" selected={data.exercised_today === false} onClick={() => setData(d => ({ ...d, exercised_today: false }))} />
      </div>
    ),
    10: (
      <div className="flex flex-col gap-3">
        {[['<1h','Less than 1 hour'],['1-2h','1–2 hours'],['2-4h','2–4 hours'],['4h+','4+ hours']].map(([v,l]) => (
          <OptionBtn key={v} label={l} selected={data.planned_duration === v} onClick={() => setData(d => ({ ...d, planned_duration: v }))} />
        ))}
      </div>
    ),
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-xs text-zinc-500 tracking-wider">PRE-SESSION CHECK-IN</span>
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
