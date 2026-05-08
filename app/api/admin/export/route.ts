// app/api/admin/export/route.ts
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data } = await supabase
    .from('pre_session_checkins')
    .select(`
      session_date, completed_at,
      sleep_hours, energy_level, stress_level, focus_level,
      emotional_stability, confidence_level, caffeine_consumed,
      substances_consumed, exercised_today, planned_duration,
      users(username),
      post_session_checkins(
        actual_duration, session_result, decision_quality,
        emotional_stability, mental_fatigue, tilt_experienced,
        played_longer, chased_losses, unusual_decisions, a_game_score,
        completed_at
      )
    `)
    .not('completed_at', 'is', null)
    .order('session_date', { ascending: true })

  // Construir CSV
  const headers = [
    'username', 'session_date',
    'pre_completed_at', 'sleep_hours', 'energy', 'stress', 'focus',
    'emotional_stability_pre', 'confidence', 'caffeine', 'substances', 'exercised', 'planned_duration',
    'post_completed_at', 'actual_duration', 'result', 'decision_quality',
    'emotional_stability_post', 'mental_fatigue', 'tilt',
    'played_longer', 'chased_losses', 'unusual_decisions', 'a_game_score'
  ]

  const rows = data?.map(row => {
    const post = (row.post_session_checkins as any[])?.[0]
    const user = row.users as any
    return [
      user?.username ?? '',
      row.session_date,
      row.completed_at,
      row.sleep_hours,
      row.energy_level,
      row.stress_level,
      row.focus_level,
      row.emotional_stability,
      row.confidence_level,
      row.caffeine_consumed,
      row.substances_consumed,
      row.exercised_today,
      row.planned_duration,
      post?.completed_at ?? '',
      post?.actual_duration ?? '',
      post?.session_result ?? '',
      post?.decision_quality ?? '',
      post?.emotional_stability ?? '',
      post?.mental_fatigue ?? '',
      post?.tilt_experienced ?? '',
      post?.played_longer ?? '',
      post?.chased_losses ?? '',
      post?.unusual_decisions ?? '',
      post?.a_game_score ?? '',
    ].join(',')
  }) ?? []

  const csv = [headers.join(','), ...rows].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="rzlt-export-${new Date().toISOString().split('T')[0]}.csv"`
    }
  })
}
