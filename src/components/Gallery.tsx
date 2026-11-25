import Masonry from 'react-masonry-css'
import type { ReactNode } from 'react'
import type { PortfolioImage } from '../types'
import { FadeImage } from './FadeImage'
import styles from './Gallery.module.css'

const columns = { default: 4, 1200: 3, 720: 2 }

type Props = {
  images: PortfolioImage[]
  onOpen: (index: number) => void
  /** Extra controls drawn over each image (admin delete button). */
  renderOverlay?: (image: PortfolioImage) => ReactNode
}

export function Gallery({ images, onOpen, renderOverlay }: Props) {
  return (
    <Masonry breakpointCols={columns} className={styles.grid} columnClassName={styles.column}>
      {images.map((img, i) => (
        <figure key={img.id} className={styles.item}>
          <button
            type="button"
            className={styles.open}
            onClick={() => onOpen(i)}
            aria-label={`Open image ${i + 1} of ${images.length}`}
          >
            <FadeImage
              src={img.thumbUrl}
              width={img.width}
              height={img.height}
              style={{ aspectRatio: `${img.width} / ${img.height}` }}
              loading={i < 6 ? 'eager' : 'lazy'}
              decoding="async"
              alt=""
            />
          </button>
          {renderOverlay?.(img)}
        </figure>
      ))}
    </Masonry>
  )
}
