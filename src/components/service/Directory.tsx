import type { ReactNode } from "react";
import { ProjectCover } from "@/components/sections/Gallery";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { businessInfo } from "@/lib/data";
import { projects } from "@/lib/projects";
import { siteOrigin } from "@/lib/service-directory";
import styles from "./Directory.module.css";

type Crumb = { label: string; href: string };

export function JsonLd({ value }: { value: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(value).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function Directory({
  crumbs,
  children,
}: { crumbs: Crumb[]; children: ReactNode }) {
  const trail = [{ label: "Startseite", href: "/" }, ...crumbs];
  return (
    <>
      <Header />
      <main id="main-content" className={styles.page}>
        <div className={styles.inner}>
          <JsonLd
            value={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: trail.map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: item.label,
                item: new URL(item.href, siteOrigin).href,
              })),
            }}
          />
          <nav aria-label="Brotkrumennavigation">
            <ol className={styles.crumbs}>
              {trail.map((item, i) => (
                <li key={item.href}>
                  {i === trail.length - 1 ? (
                    <span aria-current="page">{item.label}</span>
                  ) : (
                    <Link href={item.href}>{item.label}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

export function Intro({
  title,
  description,
  price,
  priceLabel,
}: {
  title: string;
  description: string;
  price?: string;
  priceLabel?: string;
}) {
  return (
    <header className={styles.hero}>
      <div className={price ? styles.heroSplit : undefined}>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {price && (
          <div className={styles.priceBlock}>
            <span>{priceLabel}</span>
            <strong>ab {price}</strong>
          </div>
        )}
      </div>
    </header>
  );
}

export function KitchenExample({
  slug = "weisse-messekueche",
}: { slug?: string }) {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return null;
  return (
    <section className={styles.project}>
      <div className={styles.projectMedia}>
        <ProjectCover
          project={project}
          sizes="(max-width: 700px) 100vw, 440px"
        />
      </div>
      <div className={styles.projectCopy}>
        <small>Aus der Küchenmontage auf der Messe</small>
        <h2>{project.shortTitle}</h2>
        <p>{project.summary}</p>
        <Link href={`/arbeiten/${project.slug}`}>
          Vorher und nachher ansehen →
        </Link>
      </div>
    </section>
  );
}

export function UnlistedArea() {
  return (
    <Directory crumbs={[{ label: "Einsatzgebiet", href: "/staedte" }]}>
      <Intro
        title="Einsatzort prüfen"
        description="Nennen Sie uns Ihren Ort, die Postleitzahl und die gewünschte Leistung. Wir prüfen die Anfahrt und melden uns mit den Möglichkeiten für Ihr Vorhaben."
      />
      <section className={styles.band}>
        <h2>Kontakt für Ihre Anfrage</h2>
        <div className={styles.links}>
          <Link href="/#kontakt-form">Montage oder Lieferung anfragen →</Link>
          <a href={`tel:${businessInfo.phone.replace(/\s/g, "")}`}>
            {businessInfo.phone}
          </a>
          <Link href="/staedte">Zum Ortsverzeichnis</Link>
        </div>
      </section>
    </Directory>
  );
}
