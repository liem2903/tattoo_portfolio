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
