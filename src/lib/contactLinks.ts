import type { ContactDetails, ContactLink } from '../types'

/** "@name", "name" or an instagram.com URL -> "name". */
export function normalizeInstagram(input: string): string {
  return input
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .replace(/[/?#].*$/, '')
}

/** "0432 887 938" -> "tel:+61432887938". Numbers already starting with + are kept. */
export function phoneHref(phone: string, countryCode: string): string {
  const trimmed = phone.trim()
  const digits = trimmed.replace(/\D/g, '')
  if (trimmed.startsWith('+')) return `tel:+${digits}`
  if (digits.startsWith('0')) return `tel:+${countryCode}${digits.slice(1)}`
  return `tel:${digits}`
}

/** Turns stored details into the lines shown on the page, skipping empty ones. */
export function toContactLinks(details: ContactDetails, countryCode: string): ContactLink[] {
  const links: ContactLink[] = []
  const handle = normalizeInstagram(details.instagram)
  if (handle) {
    links.push({ label: 'Instagram', display: `@${handle}`, href: `https://instagram.com/${handle}` })
  }
  const phone = details.phone.trim()
  if (phone) links.push({ label: 'Phone', display: phone, href: phoneHref(phone, countryCode) })
  const email = details.email.trim()
  if (email) links.push({ label: 'Email', display: email, href: `mailto:${email}` })
  return links
}
