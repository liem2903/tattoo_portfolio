import { useCallback, useState, type ImgHTMLAttributes } from 'react'

/** <img> that fades in once loaded. Handles images already cached before React attaches onLoad. */
export function FadeImage({ className, onLoad, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false)

  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <img
      {...props}
      ref={ref}
      className={`fade-img ${className ?? ''}`}
      data-loaded={loaded}
      onLoad={(e) => {
        setLoaded(true)
        onLoad?.(e)
      }}
      // Never leave a broken image invisible forever
      onError={() => setLoaded(true)}
    />
  )
}
