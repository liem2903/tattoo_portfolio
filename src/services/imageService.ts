// Data access for portfolio images. Components never call Supabase directly;
// they go through hooks, which go through this module.
import { BUCKET, requireSupabase } from '../lib/supabase'
import { resizeImage } from '../lib/resizeImage'
import type { ImageRow, PortfolioImage } from '../types'

function toPortfolioImage(row: ImageRow): PortfolioImage {
  const storage = requireSupabase().storage.from(BUCKET)
  return {
    id: row.id,
    fullPath: row.full_path,
    thumbPath: row.thumb_path,
    fullUrl: storage.getPublicUrl(row.full_path).data.publicUrl,
    thumbUrl: storage.getPublicUrl(row.thumb_path).data.publicUrl,
    width: row.width,
    height: row.height,
    createdAt: row.created_at,
  }
}

/** All images, newest first. */
export async function listImages(): Promise<PortfolioImage[]> {
  const { data, error } = await requireSupabase()
    .from('images')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as ImageRow[]).map(toPortfolioImage)
}

const UPLOAD_OPTIONS = { contentType: 'image/jpeg', cacheControl: '31536000', upsert: false }

/** Shrinks a photo, uploads full + thumbnail, and records it. */
export async function uploadImage(file: File): Promise<PortfolioImage> {
  const client = requireSupabase()
  const storage = client.storage.from(BUCKET)
  const { full, thumb, width, height } = await resizeImage(file)

  const id = crypto.randomUUID()
  const fullPath = `full/${id}.jpg`
  const thumbPath = `thumbs/${id}.jpg`

  const up1 = await storage.upload(fullPath, full, UPLOAD_OPTIONS)
  if (up1.error) throw up1.error
  const up2 = await storage.upload(thumbPath, thumb, UPLOAD_OPTIONS)
  if (up2.error) {
    await storage.remove([fullPath])
    throw up2.error
  }

  const { data, error } = await client
    .from('images')
    .insert({ full_path: fullPath, thumb_path: thumbPath, width, height })
    .select()
    .single()
  if (error) {
    await storage.remove([fullPath, thumbPath])
    throw error
  }
  return toPortfolioImage(data as ImageRow)
}

/** Removes the record first (so it disappears from the site), then the files. */
export async function deleteImage(image: PortfolioImage): Promise<void> {
  const client = requireSupabase()
  const { data, error } = await client.from('images').delete().eq('id', image.id).select('id')
  if (error) throw error
  // RLS silently matches zero rows when not allowed, rather than erroring.
  if (!data || data.length === 0) throw new Error('Not allowed to delete this image.')
  const { error: storageError } = await client.storage
    .from(BUCKET)
    .remove([image.fullPath, image.thumbPath])
  // The image is already gone from the site; leftover files only cost storage.
  if (storageError) console.warn('Image record deleted but files remain:', storageError)
}
