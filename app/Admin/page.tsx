import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { secret?: string }
}) {
  if (searchParams.secret !== process.env.ADMIN_SECRET) {
    redirect('/')
  }

  const supabase = createAdminClient()

  const { data: users } = await supabase
    .from('profiles')
    .select(`
      id, username, email, created_at,
      experiment_start_date, experiment_active, onboarding_complete,
      baseline_responses(id, completed_at),
      pre_session_checkins(id, session_date, completed_at),
      post_session_checkins(id, session_date, completed_at)
    `)
    .order('created_at', { ascending: false })

  const now = new Date()

  function getExperimentDay(startDate: string) {
    const start = new Date(startDate)
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }

  const totalUsers = users?.length ?? 0
  const activeUsers = users?.filter(u => u.experiment_active).length ?? 0
  const completedBaseline = users?.filter(u => {
    const baseline = u.baseline_responses as { id: string; completed_at: string }[]
    return baseline?.length > 0
  }).length ?? 0
  const totalCheckins = users?.reduce((acc, u) => {
    const pre = u.pre_session_checkins as { id: string; completed_at: string | null }[]
    return acc + (pre?.filter(c => c.completed_at)?.length ?? 0)
  }, 0) ?? 0

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="font-mono text-xs text-zinc-600 mb-1">RZLT · ADMIN</p>
            <h1 className="text-2xl font-bold">Experiment Dashboard</h1>
          </div>
          <a
            href={`/api/admin/export?secret=${searchParams.secret}`}
            className="font-mono text-xs border border-zinc-700 px-4 py-2 text-zinc-400 hover:text-white hover:border-zinc-500"
          >
            Export CSV →
          </a>
        </div>

        <div className="grid grid-cols-4 gap-1 mb-8">
          {[
            { label: 'TOTAL USERS', value: totalUsers },
            { label: 'ACTIVE', value: activeUsers },
            { label: 'BASELINE DONE', value: completedBaseline },
            { label: 'TOTAL CHECK-INS', value: totalCheckins },
          ].map(s => (
            <div key={s.label} className="bg-zinc-950 border border-zinc-900 p-5">
              <p className="font-mono text-xs text-zinc-600 mb-2">{s.label}</p>
              <p className="text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="border border-zinc-900 overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-950">
                <th className="text-left px-4 py-3 text-zinc-600 text-xs">USER</th>
                <th className="text-left px-4 py-3 text-zinc-600 text-xs">EMAIL</th>
                <th className="text-left px-4 py-3 text-zinc-600 text-xs">BASELINE</th>
                <th className="text-left px-4 py-3 text-zinc-600 text-xs">DAY</th>
                <th className="text-left px-4 py-3 text-zinc-600 text-xs">PRE</th>
                <th className="text-left px-4 py-3 text-zinc-600 text-xs">POST</th>
                <th className="text-left px-4 py-3 text-zinc-600 text-xs">JOINED</th>
              </tr>
            </thead>
            <tbody>
              {users?.map(user => {
                const baseline = user.baseline_responses as { id: string }[]
                const pre = user.pre_session_checkins as { id: string; completed_at: string | null }[]
                const post = user.post_session_checkins as { id: string; completed_at: string | null }[]
                const day = user.experiment_start_date
                  ? getExperimentDay(user.experiment_start_date)
                  : null
                const preCount = pre?.filter(c => c.completed_at)?.length ?? 0
                const postCount = post?.filter(c => c.completed_at)?.length ?? 0
                const hasBaseline = baseline?.length > 0

                return (
                  <tr key={user.id} className="border-b border-zinc-900 hover:bg-zinc-950">
                    <td className="px-4 py-3 text-white">{user.username}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{user.email}</td>
                    <td className="px-4 py-3">
                      {hasBaseline
                        ? <span className="text-green-500">✓</span>
                        : <span className="text-zinc-700">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {day ? (day > 7 ? 'Complete' : `Day ${day}`) : '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{preCount}</td>
                    <td className="px-4 py-3 text-zinc-400">{postCount}</td>
                    <td className="px-4 py-3 text-zinc-600 text-xs">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
