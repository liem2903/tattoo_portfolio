import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gallery } from '../components/Gallery'
import { UploadButton } from '../components/UploadButton'
import { Viewer } from '../components/Viewer'
import { useAdminActions } from '../hooks/useAdminActions'
import { useImages } from '../hooks/useImages'
import { LoginForm } from '../components/LoginForm'
import { QrCodePanel } from '../components/QrCodePanel'
import { Status } from '../components/Status'
import { useSession } from '../hooks/useSession'
import { supabase } from '../lib/supabase'
import { signOut } from '../services/authService'
import styles from '../components/Admin.module.css'

export function AdminPage() {
  if (!supabase) {
    return <Status role="alert">Supabase isn’t configured. See .env.example.</Status>
  }
  return <AdminGate />
}

function AdminGate() {
  const session = useSession()

  if (session.status === 'loading') return <Status>Loading…</Status>
  if (session.status === 'signed-out') return <LoginForm />

  if (!session.isAdmin) {
    return (
      <div className={styles.login}>
        <p>This account isn’t set up as the admin.</p>
        <button type="button" className={styles.secondary} onClick={() => void signOut()}>
          Sign out
        </button>
      </div>
    )
  }

  return <Dashboard />
}

function Dashboard() {
  const { status, images, error, refresh } = useImages()
  const { upload, remove, uploading, deletingId, notice } = useAdminActions(refresh)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <div className={styles.bar}>
        <p className={styles.barTitle}>Admin</p>
        <div className={styles.barActions}>
          <Link to="/" className={styles.textButton}>
            View site
          </Link>
          <button type="button" className={styles.textButton} onClick={() => void signOut()}>
            Sign out
          </button>
          <UploadButton busy={uploading} onFiles={(files) => void upload(files)} />
        </div>
      </div>

      {notice && (
        <p className={styles.notice} data-kind={notice.kind} role={notice.kind === 'error' ? 'alert' : 'status'}>
          {notice.text}
        </p>
      )}

      <main>
        {status === 'loading' ? (
          <Status>Loading…</Status>
        ) : status === 'error' && images.length === 0 ? (
          <Status role="alert">Couldn’t load images. {error}</Status>
        ) : images.length === 0 ? (
          <Status>No images yet. Tap Upload to add some.</Status>
        ) : (
          <Gallery
            images={images}
            onOpen={setOpenIndex}
            renderOverlay={(img) => (
              <button
                type="button"
                className={styles.delete}
                disabled={deletingId === img.id}
                onClick={() => void remove(img)}
              >
                {deletingId === img.id ? '…' : 'Delete'}
              </button>
            )}
          />
        )}
      </main>

      <QrCodePanel />

      <Viewer images={images} index={openIndex} onClose={() => setOpenIndex(null)} />
    </>
  )
}
