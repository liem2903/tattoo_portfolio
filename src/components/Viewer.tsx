import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import type { PortfolioImage } from '../types'

type Props = {
  images: PortfolioImage[]
  index: number | null
  onClose: () => void
}

/** Full-screen view: swipe/arrow keys between images, pinch or double-tap to zoom, pull down or Esc to close. */
export function Viewer({ images, index, onClose }: Props) {
  return (
    <Lightbox
      open={index !== null}
      index={index ?? 0}
      close={onClose}
      slides={images.map((img) => ({
        src: img.fullUrl,
        width: img.width,
        height: img.height,
      }))}
      plugins={[Zoom]}
      zoom={{ maxZoomPixelRatio: 2, scrollToZoom: true }}
      carousel={{ finite: images.length <= 1, padding: 0, spacing: '6%' }}
      controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
      animation={{ fade: 180, swipe: 260 }}
      styles={{ container: { backgroundColor: 'rgba(14, 14, 14, 0.97)' } }}
    />
  )
}
