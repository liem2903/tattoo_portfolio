import { useState } from 'react'
import { deleteImage, uploadImage } from '../services/imageService'
import type { PortfolioImage } from '../types'

export type Notice = { kind: 'info' | 'error'; text: string } | null

/** Upload/delete with progress + messages. Calls onChange after anything changes. */
export function useAdminActions(onChange: () => Promise<void> | void) {
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<Notice>(null)

  async function upload(files: File[]) {
    if (files.length === 0) return
    setUploading(true)
    const failed: string[] = []
    for (let i = 0; i < files.length; i++) {
      setNotice({ kind: 'info', text: `Uploading ${i + 1} of ${files.length}…` })
      try {
        await uploadImage(files[i])
      } catch (e) {
        console.error(e)
        failed.push(files[i].name)
      }
    }
    await onChange()
    setUploading(false)
    const done = files.length - failed.length
    setNotice(
      failed.length === 0
        ? { kind: 'info', text: `Uploaded ${done} ${done === 1 ? 'image' : 'images'}.` }
        : { kind: 'error', text: `Uploaded ${done}. Failed: ${failed.join(', ')}` },
    )
  }

  async function remove(image: PortfolioImage) {
    if (!window.confirm('Delete this image from the portfolio?')) return
    setDeletingId(image.id)
    try {
      await deleteImage(image)
      await onChange()
      setNotice({ kind: 'info', text: 'Image deleted.' })
    } catch (e) {
      setNotice({ kind: 'error', text: e instanceof Error ? e.message : 'Delete failed.' })
    } finally {
      setDeletingId(null)
    }
  }

  return { upload, remove, uploading, deletingId, notice }
}
