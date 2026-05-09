'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type BaselineData = {
  primary_activity: string
  sessions_per_week: string
  avg_session_duration: string
  usual_play_time: string
  wearable_device: string
  avg_sleep_hours: string
  performance_issues: string[]
  mental_exhaustion_score: number
  emotions_affect_score: number
  willing_checkins: boolean | null
}

const TOTAL_STEPS = 10

function OptionButton({
  label,
  selected,
  onClick
}: {
  label: string
  selected: boolean
  onClick: () => void
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

function ScaleSelector({
  value,
  onChange
}: {
  value: number
  onChange: (v: number) => void
}) {
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

export default function OnboardingPage() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState<BaselineData>({
    primary_activity: '',
    sessions_per_week: '',
    avg_session_duration: '',
    usual_play_time: '',
    wearable_device: '',
    avg_sleep_hours: '',
    performance_issues: [],
    mental_exhaustion_score: 0,
    emotions_affect_score: 0,
    willing_checkins: null,
  })

  function toggleIssue(issue: string) {
    setData(d => {
      const issues = d.performance_issues.includes(issue)
        ? d.performance_issues.filter(i => i !== issue)
        : d.performance_issues.length < 2
          ? [...d.performance_issues, issue]
          : d.performance_issues

      return {
        ...d,
        performance_issues: issues
      }
    })
  }

  function canAdvance() {
    switch (step) {
      case 1:
        return !!data.primary_activity
      case 2:
        return !!data.sessions_per_week
      case 3:
        return !!data.avg_session_duration
      case 4:
        return !!data.usual_play_time
      case 5:
        return !!data.wearable_device
      case 6:
        return !!data.avg_sleep_hours
      case 7:
        return data.performance_issues.length > 0
      case 8:
        return data.mental_exhaustion_score > 0
      case 9:
        return data.emotions_affect_score > 0
      case 10:
        return data.willing_checkins !== null
      default:
        return false
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true)

      const supabase = createClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        alert('No authenticated session')
        return
      }

      const user = session.user

      // CREATE / UPDATE PROFILE
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          username: user.email?.split('@')[0] || 'user',
          onboarding_complete: true,
          experiment_start_date: new Date().toISOString(),
        })

      if (profileError) {
        alert(JSON.stringify(profileError))
        return
      }

      // SAVE BASELINE
      const { error: baselineError } = await supabase
        .from('baseline_responses')
        .insert({
          user_id: user.id,
          ...data,
        })

      if (baselineError) {
        alert(JSON.stringify(baselineError))
        return
      }

      router.push('/dashboard')

    } catch (err) {
      console.error(err)
      alert('Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  const questions: Record<number, string> = {
    1: 'What is your primary game or activity?',
    2: 'How often do you play or bet per week?',
    3: 'How long is your average session?',
    4: 'What time do you usually play?',
    5: 'Do you currently use any wearable device?',
    6: 'On average, how many hours do you sleep per night?',
    7: 'Which issue affects your performance the most?',
    8: 'How often do you feel mentally exhausted after sessions?',
    9: 'How often do emotions affect your decisions while playing?',
    10: 'Would you complete short pre/post session check-ins for 7 days?',
  }

  const steps: Record<number, React.ReactNode> = {
    1: (
      <div className="flex flex-col gap-3">
        {[
          ['online_poker', 'Online Poker'],
          ['live_poker', 'Live Poker'],
          ['sports_betting', 'Sports Betting'],
          ['dfs', 'DFS'],
          ['casino', 'Casino Gambling'],
          ['trading', 'Trading / Crypto'],
          ['other', 'Other'],
        ].map(([value, label]) => (
          <OptionButton
            key={value}
            label={label}
            selected={data.primary_activity === value}
            onClick={() =>
              setData(d => ({
                ...d,
                primary_activity: value,
              }))
            }
          />
        ))}
      </div>
    ),

    2: (
      <div className="flex flex-col gap-3">
        {[
          ['1-2', '1–2 sessions'],
          ['3-5', '3–5 sessions'],
          ['6-10', '6–10 sessions'],
          ['10+', '10+ sessions'],
        ].map(([value, label]) => (
          <OptionButton
            key={value}
            label={label}
            selected={data.sessions_per_week === value}
            onClick={() =>
              setData(d => ({
                ...d,
                sessions_per_week: value,
              }))
            }
          />
        ))}
      </div>
    ),

    3: (
      <div className="flex flex-col gap-3">
        {[
          ['<1h', 'Less than 1 hour'],
          ['1-2h', '1–2 hours'],
          ['2-4h', '2–4 hours'],
          ['4-6h', '4–6 hours'],
          ['6h+', '6+ hours'],
        ].map(([value, label]) => (
          <OptionButton
            key={value}
            label={label}
            selected={data.avg_session_duration === value}
            onClick={() =>
              setData(d => ({
                ...d,
                avg_session_duration: value,
              }))
            }
          />
        ))}
      </div>
    ),

    4: (
      <div className="flex flex-col gap-3">
        {[
          ['morning', 'Morning'],
          ['afternoon', 'Afternoon'],
          ['evening', 'Evening'],
          ['late_night', 'Late Night'],
        ].map(([value, label]) => (
          <OptionButton
            key={value}
            label={label}
            selected={data.usual_play_time === value}
            onClick={() =>
              setData(d => ({
                ...d,
                usual_play_time: value,
              }))
            }
          />
        ))}
      </div>
    ),

    5: (
      <div className="flex flex-col gap-3">
        {[
          ['apple_watch', 'Apple Watch'],
          ['whoop', 'WHOOP'],
          ['oura', 'Oura Ring'],
          ['garmin', 'Garmin'],
          ['fitbit', 'Fitbit'],
          ['none', 'No wearable'],
        ].map(([value, label]) => (
          <OptionButton
            key={value}
            label={label}
            selected={data.wearable_device === value}
            onClick={() =>
              setData(d => ({
                ...d,
                wearable_device: value,
              }))
            }
          />
        ))}
      </div>
    ),

    6: (
      <div className="flex flex-col gap-3">
        {[
          ['<5h', 'Less than 5 hours'],
          ['5-6h', '5–6 hours'],
          ['6-7h', '6–7 hours'],
          ['7-8h', '7–8 hours'],
          ['8h+', '8+ hours'],
        ].map(([value, label]) => (
          <OptionButton
            key={value}
            label={label}
            selected={data.avg_sleep_hours === value}
            onClick={() =>
              setData(d => ({
                ...d,
                avg_sleep_hours: value,
              }))
            }
          />
        ))}
      </div>
    ),

    7: (
      <div>
        <p className="text-zinc-500 text-sm mb-4">
          Select up to 2
        </p>

        <div className="flex flex-col gap-3">
          {[
            ['tilt', 'Tilt'],
            ['fatigue', 'Fatigue'],
            ['impulsivity', 'Impulsivity'],
            ['lack_of_focus', 'Lack of focus'],
            ['anxiety', 'Anxiety / Stress'],
            ['poor_discipline', 'Poor discipline'],
            ['chasing_losses', 'Chasing losses'],
            ['overconfidence', 'Overconfidence'],
            ['burnout', 'Burnout'],
            ['emotional_swings', 'Emotional swings'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleIssue(value)}
              className={`w-full text-left px-4 py-3 border font-mono text-sm transition-colors ${
                data.performance_issues.includes(value)
                  ? 'border-white bg-white text-black'
                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    ),

    8: (
      <ScaleSelector
        value={data.mental_exhaustion_score}
        onChange={(v) =>
          setData(d => ({
            ...d,
            mental_exhaustion_score: v,
          }))
        }
      />
    ),

    9: (
      <ScaleSelector
        value={data.emotions_affect_score}
        onChange={(v) =>
          setData(d => ({
            ...d,
            emotions_affect_score: v,
          }))
        }
      />
    ),

    10: (
      <div className="flex flex-col gap-3">
        <OptionButton
          label="Yes — I'm in"
          selected={data.willing_checkins === true}
          onClick={() =>
            setData(d => ({
              ...d,
              willing_checkins: true,
            }))
          }
        />

        <OptionButton
          label="No"
          selected={data.willing_checkins === false}
          onClick={() =>
            setData(d => ({
              ...d,
              willing_checkins: false,
            }))
          }
        />
      </div>
    ),
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 py-12">
      <div className="w-full max-w-md">

        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-xs text-zinc-600">
              BASELINE ASSESSMENT
            </span>

            <span className="font-mono text-xs text-zinc-600">
              {step} / {TOTAL_STEPS}
            </span>
          </div>

          <Progress
            value={(step / TOTAL_STEPS) * 100}
            className="h-px bg-zinc-900"
          />
        </div>

        <h2 className="text-xl font-bold mb-8 leading-snug">
          {questions[step]}
        </h2>

        {steps[step]}

        <div className="flex gap-3 mt-8">

          {step > 1 && (
            <Button
              variant="ghost"
              onClick={() => setStep(s => s - 1)}
            >
              ← Back
            </Button>
          )}

          <Button
            onClick={
              step < TOTAL_STEPS
                ? () => setStep(s => s + 1)
                : handleSubmit
            }
            disabled={!canAdvance() || loading}
            className="flex-1 bg-white text-black"
          >
            {loading
              ? 'Saving...'
              : step < TOTAL_STEPS
                ? 'Continue →'
                : 'Start experiment →'}
          </Button>

        </div>
      </div>
    </main>
  )
}
