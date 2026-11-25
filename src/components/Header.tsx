import { artist, contacts } from '../config'
import styles from './Header.module.css'

/** Name, subtitle and contacts at the top of the page. Centred on desktop to line up with the images. */
export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.name}>{artist.name}</h1>
      {artist.subtitle && <p className={styles.subtitle}>{artist.subtitle}</p>}

      <ul className={styles.contacts}>
        {contacts.map((c) => (
          <li key={c.label}>
            <a
              className={styles.contact}
              href={c.href}
              {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className={styles.label}>{c.label}</span>
              <span className={styles.value}>{c.display}</span>
            </a>
          </li>
        ))}
      </ul>
    </header>
  )
}
