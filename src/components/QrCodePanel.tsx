import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import styles from './Admin.module.css'

// Plain black on white with a quiet zone: the most reliably scannable option.
const QR_OPTIONS = { margin: 4, errorCorrectionLevel: 'M' as const, color: { dark: '#000000', light: '#ffffff' } }

/** QR code for the public gallery, built from whatever address the site is live on. */
export function QrCodePanel() {
  const siteUrl = `${window.location.origin}/`
  const [png, setPng] = useState<string | null>(null)
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void Promise.all([
      QRCode.toDataURL(siteUrl, { ...QR_OPTIONS, width: 2048 }),
      QRCode.toString(siteUrl, { ...QR_OPTIONS, type: 'svg' }),
    ]).then(([pngUrl, svgText]) => {
      if (cancelled) return
      setPng(pngUrl)
      setSvg(URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' })))
    })
    return () => {
      cancelled = true
    }
  }, [siteUrl])

  // Free the SVG object URL when it's replaced or the panel unmounts.
  useEffect(() => () => void (svg && URL.revokeObjectURL(svg)), [svg])

  return (
    <section className={styles.section} aria-labelledby="qr-title">
      <h2 id="qr-title" className={styles.sectionTitle}>
        QR code
      </h2>
      <p className={styles.qrUrl}>{siteUrl}</p>
      {png && <img className={styles.qr} src={png} alt={`QR code linking to ${siteUrl}`} />}
      <div className={styles.qrActions}>
        <a className={styles.secondary} href={png ?? undefined} download="portfolio-qr.png" aria-disabled={!png}>
          Download PNG
        </a>
        <a className={styles.secondary} href={svg ?? undefined} download="portfolio-qr.svg" aria-disabled={!svg}>
          Download SVG
        </a>
      </div>
      <p className={styles.hint}>
        PNG for posting or quick printing. SVG for print shops, stays sharp at any size. If the site address
        changes (e.g. a custom domain), download again: old printed codes keep pointing at the old address.
      </p>
    </section>
  )
}
