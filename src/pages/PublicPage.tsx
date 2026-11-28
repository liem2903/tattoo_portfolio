import { useState } from 'react'
import { Header } from '../components/Header'
import { Feed } from '../components/Feed'
import { Status } from '../components/Status'
import { Viewer } from '../components/Viewer'
import { useContacts } from '../hooks/useContacts'
import { useImages } from '../hooks/useImages'
import { artist } from '../config'
import { toContactLinks } from '../lib/contactLinks'
import { supabase } from '../lib/supabase'

export function PublicPage() {
  const { status, images, error } = useImages()
  const contacts = useContacts()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      {/* Wait for the saved contacts so old ones never flash up */}
      <Header contacts={contacts.status === 'ready' ? toContactLinks(contacts.contacts, artist.phoneCountryCode) : []} />
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
          <Feed images={images} onOpen={setOpenIndex} />
        )}
      </main>
      <Viewer images={images} index={openIndex} onClose={() => setOpenIndex(null)} />
    </>
  )
}
