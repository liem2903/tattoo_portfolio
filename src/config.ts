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
  name: 'Josh Sagar',
  /** Optional second line under the name. Set to '' to hide it. */
  subtitle: 'Sydney',
}

// Add, remove, or reorder contacts here. One entry = one line on the page.
export const contacts: Contact[] = [
  {
    label: 'Instagram',
    display: '@_goshjosh',
    href: 'https://instagram.com/_goshjosh',
  },
  {
    label: 'Phone',
    display: '0432 887 938',
    href: 'tel:+61432887938',
  },
  {
    label: 'Email',
    display: 'jwillsagar@gmail.com',
    href: 'mailto:jwillsagar@gmail.com',
  },
]
