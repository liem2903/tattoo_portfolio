// Shrinks a photo in the browser before upload, so phone photos (3-12 MB)
// become ~0.5 MB JPEGs plus a small thumbnail for the grid.

export const FULL_MAX_EDGE = 2400
export const THUMB_MAX_EDGE = 800

export type ResizedImage = {
  full: Blob
  thumb: Blob
  width: number
  height: number
}

type Source = { draw: CanvasImageSource; width: number; height: number; release: () => void }

async function decode(file: File): Promise<Source> {
  // Fast path; respects EXIF rotation so phone photos aren't sideways.
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
    return { draw: bmp, width: bmp.width, height: bmp.height, release: () => bmp.close() }
  } catch {
    // Fallback for formats createImageBitmap can't handle in some browsers (e.g. HEIC on Safari).
    const url = URL.createObjectURL(file)
    try {
      const img = new Image()
      img.src = url
      await img.decode()
      return {
        draw: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        release: () => URL.revokeObjectURL(url),
      }
    } catch {
      URL.revokeObjectURL(url)
      throw new Error(`Couldn’t read “${file.name}”. Try a JPEG or PNG.`)
    }
  }
}

function fit(width: number, height: number, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(width, height))
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}

function render(src: Source, maxEdge: number, quality: number): Promise<{ blob: Blob; width: number; height: number }> {
  const size = fit(src.width, src.height, maxEdge)
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('This browser can’t process images.')
  // JPEG has no transparency; paint white under PNGs with transparent areas.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size.width, size.height)
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(src.draw, 0, 0, size.width, size.height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve({ blob, ...size }) : reject(new Error('Image conversion failed.'))),
      'image/jpeg',
      quality,
    )
  })
}

export async function resizeImage(file: File): Promise<ResizedImage> {
  const src = await decode(file)
  try {
    const full = await render(src, FULL_MAX_EDGE, 0.86)
    const thumb = await render(src, THUMB_MAX_EDGE, 0.8)
    return { full: full.blob, thumb: thumb.blob, width: full.width, height: full.height }
  } finally {
    src.release()
  }
}
