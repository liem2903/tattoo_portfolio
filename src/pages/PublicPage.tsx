import { useState } from 'react'
import { Header } from '../components/Header'
import { Gallery } from '../components/Gallery'
import { Status } from '../components/Status'
import { Viewer } from '../components/Viewer'
import { useImages } from '../hooks/useImages'
import { supabase } from '../lib/supabase'

export function PublicPage() {
  const { status, images, error } = useImages()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <Header />
      <main>
        {!supabase ? (
          <Status role="alert">Gallery not connected yet. Add the Supabase variables.</Status>
        ) : status === 'loading' ? (
          <Status>Loading…</Status>
        ) : status === 'error' && images.length === 0 ? (
          <Status role="alert">Couldn’t load the gallery. {error}</Status>
        ) : images.length === 0 ? (
          <Status>No work posted yet.</Status>
        ) : (
          <Gallery images={images} onOpen={setOpenIndex} />
        )}
      </main>
      <Viewer images={images} index={openIndex} onClose={() => setOpenIndex(null)} />
    </>
  )
}
