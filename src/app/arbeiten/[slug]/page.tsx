import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProjectCover } from "@/components/sections/Gallery";
import { getProject, projects, type ProjectPhoto } from "@/lib/projects";
import styles from "../projects.module.css";

const origin = "https://mobelmontage-nurnberg.de";
type Props = { params: Promise<{ slug: string }> };

const serviceLabels = {
  "kuecheninsel-montage": "Kücheninsel montieren",
  "kuechenzeile-montage": "Küchenzeile montieren",
  "eckküche-montage": "Eckküche montieren",
  "arbeitsplatten-montage": "Arbeitsplatte einpassen",
  "einbaugeraete-montage": "Einbaugeräte montieren",
};

const projectServices: Record<string, (keyof typeof serviceLabels)[]> = {
  "weisse-messekueche": ["kuecheninsel-montage", "kuechenzeile-montage"],
  "kueche-mit-holzinsel": ["kuecheninsel-montage", "arbeitsplatten-montage"],
  "gruene-winkelkueche": ["eckküche-montage", "arbeitsplatten-montage"],
  "dunkle-inselkueche": ["kuecheninsel-montage", "einbaugeraete-montage"],
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const title = `${project.title} – Küchenmontage`;
  const url = `${origin}/arbeiten/${project.slug}`;
  const image = { url: project.cover.src, width: 1080, height: 720, alt: project.cover.alt };
  return {
    title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: { title, description: project.summary, url, locale: "de_DE", images: [image] },
    twitter: { card: "summary_large_image", title, description: project.summary, images: [image] },
  };
}

function Photo({ photo, heading, caption }: { photo: ProjectPhoto; heading: string; caption: string }) {
  return (
    <figure className={styles.figure}>
      <Image src={photo.src} alt={photo.alt} width={720} height={800} loading="lazy" unoptimized />
      <figcaption><strong>{heading}</strong><span>{caption}</span></figcaption>
    </figure>
  );
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const url = `${origin}/arbeiten/${project.slug}`;
  const inquiryHref = `/?leistung=kuechenmontage&projekt=${project.slug}#kontakt-form`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", url, name: project.title, description: project.summary, inLanguage: "de",
        isPartOf: { "@type": "CollectionPage", url: `${origin}/arbeiten` },
        primaryImageOfPage: { "@type": "ImageObject", contentUrl: origin + project.cover.src, caption: project.cover.alt },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: origin + "/" },
          { "@type": "ListItem", position: 2, name: "Projekte", item: origin + "/arbeiten" },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
    ],
  };
  return (
    <>
      <Header offerHref={inquiryHref} />
      <main id="main-content" className={styles.page}>
        <div className={styles.wrap}>
          <nav className={styles.crumb} aria-label="Brotkrumennavigation">
            <Link href="/">Startseite</Link><span aria-hidden="true">/</span><Link href="/arbeiten">Projekte</Link>
            <span aria-hidden="true">/</span><span aria-current="page">{project.shortTitle}</span>
          </nav>
          <article>
            <header className={styles.detailHero}>
              <div className={styles.detailText}>
                <h1>{project.title}</h1><p>{project.summary}</p>
                <div className={styles.heroActions}>
                  <Link className="studio-button" href={inquiryHref}>Ähnliche Küche anfragen <ArrowRight size={17} aria-hidden="true" /></Link>
                  <a className={styles.jump} href="#vergleich">Vorher und nachher ansehen <span aria-hidden="true">↓</span></a>
                </div>
              </div>
              <ProjectCover project={project} sizes="(max-width: 760px) 92vw, (max-width: 1250px) 56vw, 640px" priority />
            </header>
            <div id="vergleich" className={styles.stages}>
              {project.comparisons.map((pair) => (
                <section key={pair.title}>
                  <h2>{pair.title}</h2>
                  <div className={styles.comparison}>
                    <Photo photo={pair.before} heading="Vor der Fertigstellung" caption={pair.beforeCaption} />
                    <Photo photo={pair.after} heading="Nach der Montage" caption={pair.afterCaption} />
                  </div>
                </section>
              ))}
              {project.details && (
                <section>
                  <h2>Montagedetails</h2>
                  <div className={styles.details}>
                    {project.details.map((detail) => <Photo key={detail.title} photo={detail.photo} heading={detail.title} caption={detail.caption} />)}
                  </div>
                </section>
              )}
            </div>
            <nav className={styles.related} aria-labelledby="passende-leistungen">
              <h2 id="passende-leistungen">Passende Leistungen</h2>
              <ul>
                {(projectServices[project.slug] ?? []).map((service) => (
                  <li key={service}><Link href={`/service/${service}`}>{serviceLabels[service]} <ArrowRight size={16} aria-hidden="true" /></Link></li>
                ))}
                <li><Link href="/firmenkunden/ausstellung">Ausstellungsküche für Messe und Showroom <ArrowRight size={16} aria-hidden="true" /></Link></li>
              </ul>
            </nav>
          </article>
          <aside className={styles.cta}>
            <div><h2>Küchenmontage anfragen</h2><p>Wir erstellen Ihnen ein Angebot anhand Ihres Plans und der gewünschten Montagearbeiten.</p></div>
            <Link href={inquiryHref}>Zum Anfrageformular <ArrowRight size={18} aria-hidden="true" /></Link>
          </aside>
          <div className={styles.returnLinks}>
            <Link href="/arbeiten"><ArrowLeft size={17} aria-hidden="true" /> Alle Projekte</Link>
            <Link href="/service/kuechenmontage">Leistung Küchenmontage <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </>
  );
}
