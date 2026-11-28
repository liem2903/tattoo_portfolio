/** A row in the `images` table. */
export type ImageRow = {
  id: string
  full_path: string
  thumb_path: string
  width: number
  height: number
  created_at: string
}

/** An image ready for the UI, with public URLs resolved. */
export type PortfolioImage = {
  id: string
  fullPath: string
  thumbPath: string
  fullUrl: string
  thumbUrl: string
  width: number
  height: number
  createdAt: string
}

/** The artist's contact details as he types them on the admin page. Empty = hidden. */
export type ContactDetails = {
  /** Handle without the @ */
  instagram: string
  /** As it should be shown, e.g. "0432 887 938" */
  phone: string
  email: string
}

/** One contact line on the public page. */
export type ContactLink = {
  label: string
  display: string
  href: string
}
