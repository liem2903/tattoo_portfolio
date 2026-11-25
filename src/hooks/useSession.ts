import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSession, isAdmin, onSessionChange } from '../services/authService'

type State =
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'signed-in'; session: Session; isAdmin: boolean }

export function useSession(): State {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function apply(session: Session | null) {
      if (!session) {
        if (!cancelled) setState({ status: 'signed-out' })
        return
      }
      let admin = false
      try {
        admin = await isAdmin()
      } catch {
        admin = false
      }
      if (!cancelled) setState({ status: 'signed-in', session, isAdmin: admin })
    }

    void getSession().then(apply)
    // Supabase recommends not awaiting other Supabase calls inside this callback,
    // so defer the admin check to the next tick.
    const unsubscribe = onSessionChange((session) => {
      setTimeout(() => void apply(session), 0)
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  return state
}
