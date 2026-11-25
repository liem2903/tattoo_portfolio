import { useRef } from 'react'
import styles from './Admin.module.css'

type Props = { busy: boolean; onFiles: (files: File[]) => void }

export function UploadButton({ busy, onFiles }: Props) {
  const input = useRef<HTMLInputElement>(null)

  return (
    <>
      <button
        type="button"
        className={styles.primary}
        disabled={busy}
        onClick={() => input.current?.click()}
      >
        {busy ? 'Uploading…' : 'Upload'}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          e.target.value = '' // allow picking the same file again
          onFiles(files)
        }}
      />
    </>
  )
}
