import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { Directory } from "@/components/service/Directory";
import { businessGuides } from "@/lib/business-guides";
import { businessInquiries, businessInquiryHref, businessInquiryKeys, isBusinessInquiry } from "@/lib/business-inquiries";
import { pageMetadata } from "@/lib/service-directory";
import styles from "../business.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return businessInquiryKeys.map((slug) => ({ slug }));
}

async function getGuide(params: Props["params"]) {
  const { slug } = await params;
  if (!isBusinessInquiry(slug)) notFound();
  const guide = businessGuides[slug];
  const { file, project, alt } = guide.photo;
  const wide = file === "hero-1080";
  const directory = `/projekte/${project}/`;
  const image = { url: directory + file + ".webp", width: wide ? 1080 : 720, height: wide ? 720 : 800, alt };
  const srcSet = wide ? `${directory}hero-640.webp 640w, ${image.url} 1080w` : undefined;
  return { slug, guide, image, srcSet };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, guide, image } = await getGuide(params);
  const title = slug === "ausstellung" ? `${guide.title} | Nürnberg` : guide.title;
  const meta = pageMetadata(title, guide.description, `/firmenkunden/${slug}`);
  return { ...meta, openGraph: { ...meta.openGraph, images: [image] }, twitter: { ...meta.twitter, images: [image] } };
}

export default async function BusinessGuidePage({ params }: Props) {
  const { slug, guide, image, srcSet } = await getGuide(params);
  const inquiry = businessInquiries[slug];
  return (
    <Directory crumbs={[{ label: "Für Firmen", href: "/firmenkunden" }, { label: inquiry.title, href: `/firmenkunden/${slug}` }]}>
      <header className={styles.guideHero}>
        <div className={styles.guideCopy}>
          <h1>{guide.title}</h1>
          <p>{guide.intro}</p>
          <div className={styles.actions}>
            <Link className={styles.button} href={businessInquiryHref(slug)} data-intent={`firmenangebot_${slug}`}>{guide.offerLabel} <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link className={styles.outline} href={`/rueckruf?betrieb=${slug}`} data-intent={`firmenrueckruf_${slug}`}><Phone size={16} aria-hidden="true" /> Rückruf anfragen</Link>
          </div>
        </div>
        <figure className={styles.guideFigure}>
          <picture>
            {srcSet && <source media="(max-width: 680px)" srcSet={`/projekte/${guide.photo.project}/hero-640.webp`} />}
            <img src={image.url} srcSet={srcSet} sizes={srcSet ? "(max-width: 720px) 92vw, (max-width: 1400px) 39vw, 520px" : undefined} width={image.width} height={image.height} alt={image.alt} fetchPriority="high" />
          </picture>
          <figcaption>{guide.photo.caption} <Link href={`/arbeiten/${guide.photo.project}`}>{guide.photo.link} →</Link></figcaption>
        </figure>
      </header>
      <div className={styles.guideBody}>
        {guide.sections.map(({ heading, text }) => (
          <section className={styles.guideSection} key={heading}><h2>{heading}</h2><p>{text}</p></section>
        ))}
        <nav aria-label="Weiterführende Informationen" className={styles.guideLinks}>
          <Link href={`/service/${inquiry.service}`}>{guide.serviceLabel} →</Link>
          <Link href="/firmenkunden">Alle Leistungen für Firmen →</Link>
        </nav>
      </div>
    </Directory>
  );
}
