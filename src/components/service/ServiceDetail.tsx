import Link from "next/link";
import Image from "next/image";
import FormCTA from "@/components/sections/FormCTA";
import { projects } from "@/lib/projects";
import { inquiryHref } from "@/lib/inquiry-context";
import { priceFinderHref } from "@/lib/price-examples";
import {
  cityServices,
  localServiceGuide,
  serviceLocations,
  serviceList,
  siteOrigin,
  type City,
  type Service,
} from "@/lib/service-directory";
import { mainServiceGuides, serviceBasics, serviceIntro } from "@/lib/service-guide";
import { Directory, Intro, JsonLd, KitchenExample } from "./Directory";
import styles from "./Directory.module.css";

export default function ServiceDetail({
  service,
  city,
}: { service: Service; city?: City }) {
  const basics = serviceBasics[service.parentId];
  const localGuide = city && localServiceGuide(city, service);
  const intro = localGuide?.description ?? serviceIntro(service);
  const place = city ? city.name : "Nürnberg und Umgebung";
  const path = city
    ? `/${city.slug}/${service.slug}`
    : `/service/${service.slug}`;
  const crumbs = city
    ? [
        { label: "Einsatzgebiet", href: "/staedte" },
        { label: city.name, href: `/${city.slug}` },
      ]
    : [{ label: "Leistungen", href: "/leistungen" }];
  const related = (city ? cityServices(city) : serviceList).filter(
    (s) => s.parentId === service.parentId && s.slug !== service.slug,
  );
  const isMainService = service.slug === service.parentId;
  const guide = !city && isMainService ? mainServiceGuides[service.slug] : undefined;
  const example = guide?.example;
  const project = example && projects.find((item) => item.slug === example.slug);
  const projectPhoto = example && project?.comparisons[0]?.[example.stage];
  const context = { service: service.parentId, task: isMainService ? undefined : service.slug, city: city?.slug };
  return (
    <Directory crumbs={[...crumbs, { label: service.name, href: path }]} offerHref={inquiryHref(context)}>
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": new URL(path, siteOrigin).href + "#leistung",
          name: service.name,
          serviceType: basics.title,
          description: intro,
          url: new URL(path, siteOrigin).href,
          provider: { "@id": siteOrigin + "/#betrieb" },
          areaServed: city
            ? { "@type": "Place", name: city.name }
            : { "@type": "Place", name: "Nürnberg und Umgebung" },
        }}
      />
      <Intro
        title={localGuide?.title ?? `${service.name} in ${place}`}
        description={intro}
        price={isMainService ? basics.price : undefined}
        priceLabel="Richtpreis für die Anfrage"
      />
      {localGuide && <section className={styles.band}>
        <h2>{localGuide.heading}</h2>
        {localGuide.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </section>}
      <section className={styles.band}>
        <div className={styles.steps}>
          <div>
            <h2>Wie entsteht der Preis?</h2>
            <p>{guide ? guide.price : <>
              {isMainService
                ? `${basics.title} beginnt bei ${basics.price}.`
                : `Der Preis für ${service.name} richtet sich nach dem konkreten Auftrag.`}{" "}
              Umfang, Zugang und Anfahrt fließen in das Angebot ein. Den
              vereinbarten Preis erhalten Sie vor der Beauftragung.
            </>}</p>
            <Link href={priceFinderHref(service.slug, city?.slug)}>Preisbeispiele ansehen →</Link>
          </div>
          <div>
            <h2>Was braucht die Anfrage?</h2>
            <p>{guide?.preparation ?? basics.preparation}</p>
            {city && (
              <p>
                Für den Einsatz in {city.name} helfen uns Postleitzahl und
                Wunschtermin bei der Tourenplanung.
              </p>
            )}
            <Link href={inquiryHref(context)}>Anfrage stellen →</Link>
          </div>
        </div>
      </section>
      {guide && (
        <section className={styles.band}>
          <div className={styles.steps}>
            {[guide.planning, guide.onSite].map(({ title, text }) => (
              <div key={title}>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {example && project && projectPhoto && (
        <section className={styles.project}>
          <div className={styles.projectMedia}>
            <Image src={projectPhoto.src} alt={projectPhoto.alt} width={720} height={800} loading="lazy" unoptimized />
          </div>
          <div className={styles.projectCopy}>
            <small>Aus der Küchenmontage auf der Messe</small>
            <h2>{example.heading}</h2>
            <p>{example.caption}</p>
            <Link href={`/arbeiten/${project.slug}`}>{project.shortTitle} vor und nach der Montage →</Link>
          </div>
        </section>
      )}
      {!guide && service.parentId === "kuechenmontage" && (
        <KitchenExample
          slug={
            service.slug === "kuecheninsel-montage"
              ? "dunkle-inselkueche"
              : service.slug === "arbeitsplatten-montage"
                ? "kueche-mit-holzinsel"
                : service.slug === "eckküche-montage"
                  ? "gruene-winkelkueche"
                  : "weisse-messekueche"
          }
        />
      )}
      {guide ? (
        <section className={styles.band}>
          <h2>Fragen zur {basics.title}</h2>
          <dl>
            {guide.questions.map(({ question, answer }) => (
              <div key={question}>
                <dt><strong>{question}</strong></dt>
                <dd><p>{answer}</p></dd>
              </div>
            ))}
          </dl>
          <Link href="/firmenkunden">{guide.businessLink} →</Link>
        </section>
      ) : (
        <section className={styles.band}>
          <h2>{basics.question}</h2>
          <p>{basics.answer}</p>
        </section>
      )}
      {related.length > 0 && (
        <section className={styles.band}>
          <h2>Weitere Leistungen{city ? ` in ${city.name}` : ""}</h2>
          <div className={styles.linkgrid}>
            {related.map((item) => (
              <Link
                prefetch={false}
                key={item.slug}
                href={
                  city ? `/${city.slug}/${item.slug}` : `/service/${item.slug}`
                }
              >
                {item.name}
                <span aria-hidden>↗</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {!city && (
        <section className={styles.band}>
          <h2>{service.name} nach Einsatzort</h2>
          <div className={styles.links}>
            {serviceLocations(service).map((item) => (
              <Link
                prefetch={false}
                href={`/${item.slug}/${service.slug}`}
                key={item.slug}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/staedte">Alle Orte</Link>
          </div>
        </section>
      )}
      <FormCTA cityName={city?.name} serviceName={service.name} context={context} />
    </Directory>
  );
}
