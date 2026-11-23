import Link from "next/link";
import { businessInfo } from "@/lib/data";
import { CookieSettingsButton } from "@/components/CookieConsent";
import Brand from "./Brand";

export default function Footer() {
  return <footer className="studio-footer">
    <div className="studio-shell footer-grid">
      <div><Brand footer/>
        <p>{businessInfo.name}<br/>{businessInfo.address.street} · {businessInfo.address.zip} Nürnberg</p>
      </div>
      <nav aria-label="Seiten">
        <Link href="/leistungen">Leistungen</Link>
        <Link href="/arbeiten">Projekte</Link>
        <Link href="/staedte">Einsatzgebiet</Link>
        <Link href="/firmenkunden">Für Firmen</Link>
      </nav>
      <div><a href={"tel:" + businessInfo.phone.replace(/\s/g, "")}>{businessInfo.phone}</a>
        <a href={"mailto:" + businessInfo.email}>{businessInfo.email}</a>
        <a href={"https://wa.me/" + businessInfo.whatsapp.replace(/\D/g, "")}>Auf WhatsApp schreiben</a>
      </div>
    </div>
    <div className="studio-shell footer-end"><span>© {new Date().getFullYear()} {businessInfo.displayName}</span>
      <nav aria-label="Rechtliches"><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><CookieSettingsButton/></nav>
    </div>
  </footer>;
}
