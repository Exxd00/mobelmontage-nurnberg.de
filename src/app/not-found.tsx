import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <>
    <Header/>
    <main id="main-content" className="studio-shell studio-legal py-16">
      <h1>Seite nicht gefunden</h1>
      <p className="mt-4">Der Link führt zu keiner aktuellen Seite. Hier finden Sie unsere Montageleistungen, Preise und Einsatzorte.</p>
      <nav className="opening-links" aria-label="Weitere Seiten">
        <Link className="studio-button" href="/leistungen">Leistungen und Preise</Link>
        <Link className="studio-link" href="/staedte">Einsatzgebiet</Link>
        <Link className="studio-link" href="/">Zur Startseite</Link>
      </nav>
    </main>
    <Footer/>
  </>;
}
