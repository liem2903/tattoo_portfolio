// The artist's contact details, stored as a single row in `site_contacts`.
import { requireSupabase } from '../lib/supabase'
import { normalizeInstagram } from '../lib/contactLinks'
import type { ContactDetails } from '../types'

/** The saved details, or null if none have been saved yet. */
export async function getContacts(): Promise<ContactDetails | null> {
  const { data, error } = await requireSupabase()
    .from('site_contacts')
    .select('instagram, phone, email')
    .maybeSingle()
  if (error) throw error
  return (data as ContactDetails | null) ?? null
}

export async function saveContacts(details: ContactDetails): Promise<ContactDetails> {
  const clean: ContactDetails = {
    instagram: normalizeInstagram(details.instagram),
    phone: details.phone.trim(),
    email: details.email.trim(),
  }
  const { data, error } = await requireSupabase()
    .from('site_contacts')
    .upsert({ id: true, ...clean, updated_at: new Date().toISOString() })
    .select('instagram, phone, email')
  if (error) throw error
  // RLS silently matches zero rows when not allowed, rather than erroring.
  if (!data || data.length === 0) throw new Error('Not allowed to change the contacts.')
  return data[0] as ContactDetails
}
