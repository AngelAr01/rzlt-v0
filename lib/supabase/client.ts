// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'TU_PROJECT_URL',
    'TU_ANON_KEY'
  )
}
