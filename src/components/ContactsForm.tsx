import { useState, type FormEvent } from 'react'
import type { ContactDetails } from '../types'
import styles from './Admin.module.css'

type Props = {
  contacts: ContactDetails
  /** Resolves with the details as stored (e.g. "@name" becomes "name"). */
  onSave: (details: ContactDetails) => Promise<ContactDetails>
}

/** Edit the Instagram, phone and email shown at the top of the site. */
export function ContactsForm({ contacts, onSave }: Props) {
  const [draft, setDraft] = useState(contacts)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ kind: 'info' | 'error'; text: string } | null>(null)

  const changed =
    draft.instagram !== contacts.instagram || draft.phone !== contacts.phone || draft.email !== contacts.email

  function set(key: keyof ContactDetails, value: string) {
    setDraft((d) => ({ ...d, [key]: value }))
    setMessage(null)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      setDraft(await onSave(draft))
      setMessage({ kind: 'info', text: 'Saved. The site shows the new details now.' })
    } catch (err) {
      setMessage({ kind: 'error', text: `Couldn’t save: ${err instanceof Error ? err.message : String(err)}` })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className={styles.section} aria-labelledby="contacts-title">
      <h2 id="contacts-title" className={styles.sectionTitle}>
        Contacts
      </h2>
      <form className={styles.contactsForm} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span>Instagram handle</span>
          <input
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="yourhandle"
            value={draft.instagram}
            onChange={(e) => set('instagram', e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>Phone</span>
          <input
            type="tel"
            autoComplete="tel"
            placeholder="0400 000 000"
            value={draft.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={draft.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </label>

        {message && (
          <p className={message.kind === 'error' ? styles.error : styles.hint} role={message.kind === 'error' ? 'alert' : 'status'}>
            {message.text}
          </p>
        )}

        <div>
          <button type="submit" className={styles.primary} disabled={busy || !changed}>
            {busy ? 'Saving…' : 'Save contacts'}
          </button>
        </div>
      </form>
      <p className={styles.hint}>Leave a field empty to hide it from the site.</p>
    </section>
  )
}
