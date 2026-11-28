// Everything about the artist that appears on the site lives here.
// Edit these values, push, and the site redeploys.

import type { ContactDetails } from './types'

export const artist = {
  name: 'Josh Sagar',
  /** Optional second line under the name. Set to '' to hide it. */
  subtitle: 'Sydney',
  /** Used to turn a local number like 0432… into a dialable +61 432… link. */
  phoneCountryCode: '61',
}

// The contacts are edited on the admin page and stored in Supabase.
// These are only shown if the saved ones can't be loaded (or before
// supabase/setup.sql has been run).
export const defaultContacts: ContactDetails = {
  instagram: '_goshjosh',
  phone: '0432 887 938',
  email: 'jwillsagar@gmail.com',
}
