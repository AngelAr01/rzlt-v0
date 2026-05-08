// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://khxkzrazndemxutgtzxu.supabase.co/rest/v1/',
    'sb_publishable_7sPC8xkEvKw-QfWRpXGz5Q_FTnre34P'
  )
}
