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
      <Header />
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
                <a className={styles.jump} href="#vergleich">Vorher und nachher ansehen <span aria-hidden="true">↓</span></a>
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
          </article>
          <aside className={styles.cta}>
            <div><h2>Küchenmontage anfragen</h2><p>Wir erstellen Ihnen ein Angebot anhand Ihres Plans und der gewünschten Montagearbeiten.</p></div>
            <Link href={`/?leistung=kuechenmontage&projekt=${project.slug}#kontakt-form`}>Zum Anfrageformular <ArrowRight size={18} aria-hidden="true" /></Link>
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
