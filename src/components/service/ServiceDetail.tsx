import Link from "next/link";
import FormCTA from "@/components/sections/FormCTA";
import { businessInfo } from "@/lib/data";
import {
  cityServices,
  mainCities,
  serviceList,
  siteOrigin,
  type City,
  type Service,
} from "@/lib/service-directory";
import { serviceBasics, serviceIntro } from "@/lib/service-guide";
import { Directory, Intro, JsonLd, KitchenExample } from "./Directory";
import styles from "./Directory.module.css";

export default function ServiceDetail({
  service,
  city,
}: { service: Service; city?: City }) {
  const basics = serviceBasics[service.parentId];
  const intro = serviceIntro(service);
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
  const inquiryHref = `/?leistung=${encodeURIComponent(service.parentId)}#kontakt-form`;
  return (
    <Directory crumbs={[...crumbs, { label: service.name, href: path }]}>
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": new URL(path, siteOrigin).href + "#leistung",
          name: service.name,
          serviceType: basics.title,
          description: intro,
          url: new URL(path, siteOrigin).href,
          provider: {
            "@id": siteOrigin + "/#betrieb",
            "@type": "LocalBusiness",
            name: businessInfo.name,
            url: siteOrigin,
            telephone: businessInfo.phone,
          },
          areaServed: city
            ? { "@type": "Place", name: city.name }
            : { "@type": "Place", name: "Nürnberg und Umgebung" },
        }}
      />
      <Intro
        title={`${service.name} in ${place}`}
        description={intro}
        price={isMainService ? basics.price : undefined}
        priceLabel="Richtpreis für die Anfrage"
      />
      <section className={styles.band}>
        <div className={styles.steps}>
          <div>
            <h2>Wie entsteht der Preis?</h2>
            <p>
              {isMainService
                ? `${basics.title} beginnt bei ${basics.price}.`
                : `Der Preis für ${service.name} richtet sich nach dem konkreten Auftrag.`}{" "}
              Umfang, Zugang und Anfahrt fließen in das Angebot ein. Den
              vereinbarten Preis erhalten Sie vor der Beauftragung.
            </p>
            <Link href="/leistungen">Preisbeispiele ansehen →</Link>
          </div>
          <div>
            <h2>Was braucht die Anfrage?</h2>
            <p>{basics.preparation}</p>
            {city && (
              <p>
                Für den Einsatz in {city.name} helfen uns Postleitzahl und
                Wunschtermin bei der Tourenplanung.
              </p>
            )}
            <Link href={inquiryHref}>Anfrage stellen →</Link>
          </div>
        </div>
      </section>
      {service.parentId === "kuechenmontage" && (
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
      <section className={styles.band}>
        <h2>{basics.question}</h2>
        <p>{basics.answer}</p>
      </section>
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
            {mainCities.map((item) => (
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
      <FormCTA cityName={city?.name} serviceName={service.name} href={inquiryHref} />
    </Directory>
  );
}
