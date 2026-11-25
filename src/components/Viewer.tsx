import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import type { PortfolioImage } from '../types'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Props = {
  images: PortfolioImage[]
  index: number | null
  onClose: () => void
}

/** Full-screen view: swipe/arrow keys between images, pinch or double-tap to zoom, pull down or Esc to close. */
export function Viewer({ images, index, onClose }: Props) {
  const reduced = prefersReducedMotion()
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
      animation={{
        // Open/close: short fade. Swipe follows the finger then settles with a strong ease-out.
        fade: reduced ? 0 : 200,
        swipe: reduced ? 0 : 280,
        // Arrow keys / buttons: no animation, so browsing with the keyboard never feels delayed.
        navigation: 0,
        easing: { fade: 'ease', swipe: EASE_OUT, navigation: EASE_OUT },
      }}
      styles={{ container: { backgroundColor: 'rgba(14, 14, 14, 0.97)' } }}
    />
  )
}
