import type { CSSProperties } from 'react'
import type { PortfolioImage } from '../types'
import { THUMB_MAX_EDGE } from '../lib/resizeImage'
import { FadeImage } from './FadeImage'
import styles from './Feed.module.css'

type Props = {
  images: PortfolioImage[]
  onOpen: (index: number) => void
}

const monthYear = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })

/**
 * One piece per screen, each with a gallery-style label underneath.
 * Scrolling snaps to exactly the next piece.
 */
export function Feed({ images, onOpen }: Props) {
  return (
    <ol className={styles.feed}>
      {images.map((img, i) => (
        <li
          key={img.id}
          className={styles.slide}
          style={{ '--ar': img.width / img.height } as CSSProperties}
        >
          <button
            type="button"
            className={styles.art}
            onClick={() => onOpen(i)}
            aria-label={`Enlarge piece from ${monthYear.format(new Date(img.createdAt))}`}
          >
            <FadeImage
              src={img.thumbUrl}
              // High-DPI phones pick the full image; small/low-DPI screens can use the thumb.
              srcSet={`${img.thumbUrl} ${Math.min(THUMB_MAX_EDGE, img.width)}w, ${img.fullUrl} ${img.width}w`}
              sizes="(min-width: 900px) 70vw, 100vw"
              width={img.width}
              height={img.height}
              loading={i < 2 ? 'eager' : 'lazy'}
              decoding="async"
              alt=""
            />
          </button>

          <p className={styles.placard}>
            <span className={styles.date}>{monthYear.format(new Date(img.createdAt))}</span>
          </p>
        </li>
      ))}
    </ol>
  )
}
