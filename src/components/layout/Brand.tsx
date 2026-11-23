import Link from "next/link";
import styles from "./Brand.module.css";

export default function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" className={footer ? styles.footer : styles.header} aria-label="Möbelmontage Nürnberg – Startseite">
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path fill="#9CAF88" d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"/>
          <path fill="#E8412C" d="M9 22V12H15V22"/>
        </svg>
      </span>
      {footer ? <span>Möbelmontage Nürnberg</span> : (
        <span className={styles.wordmark}>
          Möbelmontage
          <span className={styles.subline}>
            Nürnberg
            <span className={styles.services} aria-hidden="true">
              <span>•</span>
              <span className={styles.rotation}>
                <span>Lieferung</span><span>Möbelmontage</span><span>Küchenmontage</span>
              </span>
            </span>
          </span>
        </span>
      )}
    </Link>
  );
}
