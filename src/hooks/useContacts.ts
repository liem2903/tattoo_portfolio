import { useCallback, useEffect, useState } from 'react'
import { defaultContacts } from '../config'
import { supabase } from '../lib/supabase'
import { getContacts, saveContacts } from '../services/contactService'
import type { ContactDetails } from '../types'

type State = { status: 'loading' | 'ready'; contacts: ContactDetails }

/** Saved contact details, falling back to the defaults in config.ts if they can't be loaded. */
export function useContacts() {
  const [state, setState] = useState<State>(
    supabase ? { status: 'loading', contacts: defaultContacts } : { status: 'ready', contacts: defaultContacts },
  )

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    getContacts()
      .then((saved) => !cancelled && setState({ status: 'ready', contacts: saved ?? defaultContacts }))
      .catch((e) => {
        console.warn('Using default contacts:', e)
        if (!cancelled) setState({ status: 'ready', contacts: defaultContacts })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const save = useCallback(async (details: ContactDetails) => {
    const saved = await saveContacts(details)
    setState({ status: 'ready', contacts: saved })
    return saved
  }, [])

  return { ...state, save }
}
