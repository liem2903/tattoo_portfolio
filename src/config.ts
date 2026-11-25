// Everything about the artist that appears on the site lives here.
// Edit these values, push, and the site redeploys.

export type Contact = {
  /** Shown on the page, e.g. "Instagram" */
  label: string
  /** What the visitor sees next to the label, e.g. "@handle" */
  display: string
  /** Where tapping goes: https://, tel:, mailto:, sms:, https://wa.me/... */
  href: string
}

export const artist = {
  name: 'Artist Name',
  /** Optional second line under the name. Set to '' to hide it. */
  subtitle: 'Studio Name · City',
}

// Add, remove, or reorder contacts here. One entry = one line on the page.
export const contacts: Contact[] = [
  {
    label: 'Instagram',
    display: '@yourhandle',
    href: 'https://instagram.com/yourhandle',
  },
  {
    label: 'Phone',
    display: '0400 000 000',
    href: 'tel:+61400000000',
  },
  {
    label: 'Email',
    display: 'hello@example.com',
    href: 'mailto:hello@example.com',
  },
]
