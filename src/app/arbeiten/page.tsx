import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Gallery from "@/components/sections/Gallery";
import { projects } from "@/lib/projects";
import styles from "./projects.module.css";

const title = "Küchenmontage im Vorher-Nachher-Vergleich";
const description = "Vier Messeküchen vor und nach der Montage. Fotos von Kücheninseln, Auszügen, Arbeitsplatten und fertigen Fronten zeigen den Aufbau im Detail.";
const url = "https://mobelmontage-nurnberg.de/arbeiten";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: projects[0].cover.alt }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
};

export default function ArbeitenPage() {
  const gallery = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url, name: title, description, inLanguage: "de",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: project.title,
        url: `${url}/${project.slug}`,
      })),
    },
  };
  return (
    <>
      <Header />
      <main id="main-content" className={styles.page}>
        <div className={styles.wrap}>
          <nav className={styles.crumb} aria-label="Brotkrumennavigation">
            <Link href="/">Startseite</Link><span aria-hidden="true">/</span><span aria-current="page">Projekte</span>
          </nav>
          <div className={styles.intro}>
            <h1>Küchenmontage<br />im Detail.</h1>
            <p>Vier Messeküchen, fotografiert während und nach dem Aufbau. Entdecken Sie, wie aus offenen Korpussen fertige Inseln, Schrankwände und Spülzeilen werden.</p>
          </div>
          <Gallery />
          <aside className={styles.cta}>
            <div><h2>Ihre Küche ist schon geplant?</h2><p>Schicken Sie uns den Küchenplan und Ihren gewünschten Montagetermin.</p></div>
            <Link href="/?leistung=kuechenmontage#kontakt-form">Angebot anfragen <ArrowRight size={18} aria-hidden="true" /></Link>
          </aside>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gallery).replace(/</g, "\\u003c") }} />
    </>
  );
}
