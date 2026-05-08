// app/api/reminders/send/route.ts
import { createAdminClient } from '@/lib/supabase/admin'
import {
  sendPreSessionReminder,
  sendPostSessionReminder,
  sendReEngagementEmail
} from '@/lib/email'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  // Verificación simple — Vercel Cron envía este header
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = new Date()
  const hour = now.getUTCHours()

  // Solo corre en horas relevantes
  if (hour !== 9 && hour !== 22) {
    return Response.json({ skipped: true, hour })
  }

  const { data: users } = await supabase
    .from('users')
    .select('id, email, username, experiment_start_date, timezone')
    .eq('experiment_active', true)

  let sent = 0

  for (const user of users ?? []) {
    const start = new Date(user.experiment_start_date)
    const dayNumber = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1

    if (dayNumber < 1 || dayNumber > 7) continue

    const today = now.toISOString().split('T')[0]

    if (hour === 9) {
      // Pre-session reminder
      const { data: existing } = await supabase
        .from('pre_session_checkins')
        .select('id')
        .eq('user_id', user.id)
        .eq('session_date', today)
        .maybeSingle()

      if (!existing) {
        await sendPreSessionReminder(user.email, user.username, dayNumber)
        await supabase.from('reminder_logs').insert({
          user_id: user.id,
          type: 'pre_session',
          day_number: dayNumber
        })
        sent++
      }

      // Re-engagement si no hizo check-in ayer
      if (dayNumber > 1) {
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        const yd = yesterday.toISOString().split('T')[0]

        const { data: yesterdayCheck } = await supabase
          .from('pre_session_checkins')
          .select('id')
          .eq('user_id', user.id)
          .eq('session_date', yd)
          .maybeSingle()

        if (!yesterdayCheck) {
          await sendReEngagementEmail(user.email, user.username, dayNumber)
          sent++
        }
      }
    }

    if (hour === 22) {
      // Post-session reminder
      const { data: postExisting } = await supabase
        .from('post_session_checkins')
        .select('id')
        .eq('user_id', user.id)
        .eq('session_date', today)
        .maybeSingle()

      if (!postExisting) {
        // Buscar pre de hoy para linkear en el email
        const { data: preToday } = await supabase
          .from('pre_session_checkins')
          .select('id')
          .eq('user_id', user.id)
          .eq('session_date', today)
          .maybeSingle()

        await sendPostSessionReminder(
          user.email,
          user.username,
          dayNumber,
          preToday?.id ?? null
        )
        await supabase.from('reminder_logs').insert({
          user_id: user.id,
          type: 'post_session',
          day_number: dayNumber
        })
        sent++
      }
    }
  }

  return Response.json({ ok: true, sent })
}
