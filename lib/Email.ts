// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'RZLT <checkin@rzlt.app>'
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL

export async function sendPreSessionReminder(
  email: string,
  username: string,
  day: number
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Day ${day} — Check in before you play`,
    html: `
      <div style="background:#000;color:#fff;font-family:monospace;padding:40px;max-width:480px">
        <p style="color:#666;font-size:11px;letter-spacing:3px;margin-bottom:24px">RZLT · DAY ${day} OF 7</p>
        <h1 style="font-size:24px;margin-bottom:12px">What's your state today?</h1>
        <p style="color:#888;margin-bottom:32px">
          Before you sit down, take 60 seconds to record your mental and physical state.
          This is how we find patterns.
        </p>
        <a href="${BASE_URL}/checkin/pre"
           style="display:inline-block;background:#fff;color:#000;padding:12px 24px;font-family:monospace;font-size:13px;text-decoration:none">
          Start pre-session check-in →
        </a>
        <p style="color:#444;font-size:11px;margin-top:32px">
          ${username} · RZLT Performance Intelligence
        </p>
      </div>
    `
  })
}

export async function sendPostSessionReminder(
  email: string,
  username: string,
  day: number,
  preId: string | null
) {
  const url = preId
    ? `${BASE_URL}/checkin/post?pre=${preId}`
    : `${BASE_URL}/checkin/post`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Day ${day} — How did the session go?`,
    html: `
      <div style="background:#000;color:#fff;font-family:monospace;padding:40px;max-width:480px">
        <p style="color:#666;font-size:11px;letter-spacing:3px;margin-bottom:24px">RZLT · DAY ${day} OF 7</p>
        <h1 style="font-size:24px;margin-bottom:12px">Session debrief.</h1>
        <p style="color:#888;margin-bottom:32px">
          How was your decision quality? Did you experience tilt?
          60 seconds to close the loop on today.
        </p>
        <a href="${url}"
           style="display:inline-block;background:#fff;color:#000;padding:12px 24px;font-family:monospace;font-size:13px;text-decoration:none">
          Start post-session check-in →
        </a>
        <p style="color:#444;font-size:11px;margin-top:32px">
          ${username} · RZLT Performance Intelligence
        </p>
      </div>
    `
  })
}

export async function sendReEngagementEmail(
  email: string,
  username: string,
  day: number
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Still with us? Day ${day} data matters`,
    html: `
      <div style="background:#000;color:#fff;font-family:monospace;padding:40px;max-width:480px">
        <p style="color:#666;font-size:11px;letter-spacing:3px;margin-bottom:24px">RZLT · DAY ${day} OF 7</p>
        <h1 style="font-size:24px;margin-bottom:12px">You missed yesterday.</h1>
        <p style="color:#888;margin-bottom:32px">
          Gaps in the data reduce the quality of your insights.
          Consistency is the whole point of the experiment.
        </p>
        <a href="${BASE_URL}/dashboard"
           style="display:inline-block;background:#fff;color:#000;padding:12px 24px;font-family:monospace;font-size:13px;text-decoration:none">
          Continue experiment →
        </a>
      </div>
    `
  })
}
