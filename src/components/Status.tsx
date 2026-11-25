import type { ReactNode } from 'react'

/** Plain one-line message used for loading / empty / error states. */
export function Status({ children, role }: { children: ReactNode; role?: 'alert' | 'status' }) {
  return (
    <p
      role={role ?? 'status'}
      style={{ padding: '24px var(--gutter)', margin: 0, color: 'var(--muted)' }}
    >
      {children}
    </p>
  )
}
