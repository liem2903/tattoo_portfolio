import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Accept the URL with or without a pasted-in path like /rest/v1/; only the origin is valid.
const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
const url = rawUrl ? rawUrl.replace(/^(https?:\/\/[^/]+).*$/, '$1') : undefined
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()

export const BUCKET = 'portfolio'

/** null when the env vars are missing, so the UI can say so instead of crashing. */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).',
    )
  }
  return supabase
}
