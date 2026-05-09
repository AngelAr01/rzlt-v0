// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // CAMBIO IMPORTANTE:
  // users -> profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  console.log(profile)
  console.log(profileError)

  if (!profile) {
    redirect('/onboarding')
  }

  if (!profile.onboarding_complete) {
    redirect('/onboarding')
  }

  const startDate = new Date(profile.experiment_start_date)
  const today = new Date()

  const dayNumber =
    Math.floor(
      (today.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1

  const experimentDay = Math.min(Math.max(dayNumber, 1), 7)
  const experimentComplete = dayNumber > 7

  const todayStr = today.toISOString().split('T')[0]

  const { data: preToday } = await supabase
    .from('pre_session_checkins')
    .select('id, completed_at')
    .eq('user_id', user.id)
    .eq('session_date', todayStr)
    .not('completed_at', 'is', null)
    .maybeSingle()

  const { data: postToday } = await supabase
    .from('post_session_checkins')
    .select('id, completed_at')
    .eq('user_id', user.id)
    .eq('session_date', todayStr)
    .not('completed_at', 'is', null)
    .maybeSingle()

  const { count: totalPre } = await supabase
    .from('pre_session_checkins')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .not('completed_at', 'is', null)

  const { count: totalPost } = await supabase
    .from('post_session_checkins')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .not('completed_at', 'is', null)

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex justify-between items-center px-8 py-5 border-b border-zinc-900">
        <span className="font-mono text-sm tracking-widest text-zinc-400">
          RZLT
        </span>

        <span className="font-mono text-xs text-zinc-600">
          {profile.username || profile.email}
        </span>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <div className="mb-10">
          {experimentComplete ? (
            <>
              <p className="font-mono text-xs text-zinc-500 mb-2 tracking-wider">
                EXPERIMENT COMPLETE
              </p>

              <h1 className="text-3xl font-bold">
                7 days done.
              </h1>

              <p className="text-zinc-500 mt-2">
                Your data is being processed.
              </p>
            </>
          ) : (
            <>
              <p className="font-mono text-xs text-zinc-500 mb-2 tracking-wider">
                DAY {experimentDay} OF 7
              </p>

              <h1 className="text-3xl font-bold">
                {preToday && postToday
                  ? "Today's done. Good work."
                  : "What's your state today?"}
              </h1>
            </>
          )}
        </div>

        {!experimentComplete && (
          <div className="flex flex-col gap-4 mb-10">
            <div
              className={`border p-6 ${
                preToday ? 'border-zinc-800' : 'border-white'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-mono text-xs text-zinc-500 tracking-wider mb-1">
                    PRE-SESSION
                  </p>

                  <p className="font-bold">
                    Before you play
                  </p>
                </div>

                {preToday && (
                  <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2 py-1">
                    DONE
                  </span>
                )}
              </div>

              <p className="text-zinc-500 text-sm mb-4">
                Energy, stress, focus, confidence.
                Takes 60 seconds.
              </p>

              {!preToday ? (
                <Link href="/checkin/pre">
                  <Button className="w-full bg-white text-black hover:bg-zinc-200 font-mono text-sm">
                    Start pre-session →
                  </Button>
                </Link>
              ) : (
                <p className="text-zinc-600 text-xs font-mono">
                  Completed at{' '}
                  {new Date(
                    preToday.completed_at!
                  ).toLocaleTimeString()}
                </p>
              )}
            </div>

            <div
              className={`border p-6 ${
                !preToday
                  ? 'border-zinc-900 opacity-40'
                  : postToday
                  ? 'border-zinc-800'
                  : 'border-zinc-600'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-mono text-xs text-zinc-500 tracking-wider mb-1">
                    POST-SESSION
                  </p>

                  <p className="font-bold">
                    After you play
                  </p>
                </div>

                {postToday && (
                  <span className="font-mono text-xs text-zinc-500 border border-zinc-800 px-2 py-1">
                    DONE
                  </span>
                )}
              </div>

              <p className="text-zinc-500 text-sm mb-4">
                Results, decisions, emotional state.
                Takes 60 seconds.
              </p>

              {preToday && !postToday ? (
                <Link href={`/checkin/post?pre=${preToday.id}`}>
                  <Button
                    variant="outline"
                    className="w-full border-zinc-600 text-white hover:bg-zinc-900 font-mono text-sm"
                  >
                    Start post-session →
                  </Button>
                </Link>
              ) : postToday ? (
                <p className="text-zinc-600 text-xs font-mono">
                  Completed at{' '}
                  {new Date(
                    postToday.completed_at!
                  ).toLocaleTimeString()}
                </p>
              ) : (
                <p className="text-zinc-700 text-xs font-mono">
                  Complete pre-session first
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-1 border border-zinc-900">
          {[
            {
              label: 'DAY',
              value: experimentComplete
                ? '✓'
                : `${experimentDay}/7`,
            },
            {
              label: 'PRE CHECK-INS',
              value: totalPre ?? 0,
            },
            {
              label: 'POST CHECK-INS',
              value: totalPost ?? 0,
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-zinc-950 p-4 text-center"
            >
              <p className="font-mono text-xs text-zinc-600 mb-2">
                {stat.label}
              </p>

              <p className="text-2xl font-bold">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
