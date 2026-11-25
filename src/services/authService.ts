import type { Session } from '@supabase/supabase-js'
import { requireSupabase } from '../lib/supabase'

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await requireSupabase().auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  const { error } = await requireSupabase().auth.signOut()
  if (error) throw error
}

export async function getSession(): Promise<Session | null> {
  const { data } = await requireSupabase().auth.getSession()
  return data.session
}

export function onSessionChange(cb: (session: Session | null) => void): () => void {
  const { data } = requireSupabase().auth.onAuthStateChange((_event, session) => cb(session))
  return () => data.subscription.unsubscribe()
}

/** Asks the database whether the logged-in user is in the admins list. */
export async function isAdmin(): Promise<boolean> {
  const { data, error } = await requireSupabase().rpc('is_admin')
  if (error) throw error
  return data === true
}
