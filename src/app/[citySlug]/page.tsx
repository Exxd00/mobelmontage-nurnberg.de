import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Directory, Intro, UnlistedArea } from "@/components/service/Directory";
import styles from "@/components/service/Directory.module.css";
import FormCTA from "@/components/sections/FormCTA";
import { legacyCitySlugs, legacyLabel } from "@/lib/legacy-city-slugs";
import {
  directoryCities,
  findCity,
  pageMetadata,
} from "@/lib/service-directory";
import { services } from "@/lib/data";
import { serviceBasics } from "@/lib/service-guide";

type Props = { params: Promise<{ citySlug: string }> };

export function generateStaticParams() {
  return directoryCities.map((city) => ({ citySlug: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { citySlug } = await params;
  const city = findCity(citySlug);
  if (!city) {
    if (!legacyCitySlugs.has(citySlug)) notFound();
    const label = legacyLabel(citySlug);
    const metadata = pageMetadata(
      `Lieferung oder Montage anfragen – Ortsangabe ${label}`,
      `Anfrage zur Ortsangabe „${label}“: Mit Gemeinde und Postleitzahl prüfen wir, ob Anfahrt und Termin für Ihr Vorhaben möglich sind.`,
      `/${citySlug}`,
    );
    return { ...metadata, robots: { index: false, follow: true } };
  }
  return pageMetadata(
    `Möbelmontage, Küchenmontage und Lieferung in ${city.name}`,
    `Leistungen und Einstiegspreise für ${city.name} in der Region ${city.region}. Möbel, Küche oder Lieferung mit Postleitzahl und Terminwunsch anfragen.`,
    `/${city.slug}`,
  );
}

export default async function CityPage({ params }: Props) {
  const { citySlug } = await params;
  const city = findCity(citySlug);
  if (!city) {
    if (!legacyCitySlugs.has(citySlug)) notFound();
    return <UnlistedArea citySlug={citySlug} />;
  }
  const others = directoryCities
    .filter((item) => item.region === city.region && item.slug !== city.slug)
    .slice(0, 8);
  return (
    <Directory
      crumbs={[
        { label: "Einsatzgebiet", href: "/staedte" },
        { label: city.name, href: `/${city.slug}` },
      ]}
    >
      <Intro
        title={`Möbelmontage in ${city.name}`}
        description={`Ein Schrank soll aufgebaut, eine Küche eingepasst oder ein Möbelstück geliefert werden? Für Ihren Einsatz in ${city.name} können Sie Umfang und Anfahrt gemeinsam anfragen.`}
      />
      <section className={styles.band}>
        <h2>Leistungen in {city.name}</h2>
        <div className={styles.tiles}>
          {services.map((group) => {
            const basics = serviceBasics[group.id];
            return (
              <article key={group.id} className={styles.tile}>
                <h3>
                  <Link href={`/${city.slug}/${group.slug}`}>
                    {basics.title}
                  </Link>
                </h3>
                <p className={styles.tilePrice}>ab {basics.price}</p>
                <p>{basics.intro}</p>
                {city.isMain && (
                  <div className={styles.links}>
                    {group.subServices.map((item) => (
                      <Link
                        prefetch={false}
                        key={item.slug}
                        href={`/${city.slug}/${item.slug}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
      <section className={styles.band}>
        <div className={styles.steps}>
          <div>
            <h2>Wie frage ich einen Termin an?</h2>
            <p>
              Schicken Sie die Postleitzahl in {city.name}, die Möbel- oder
              Küchenliste und Ihren Wunschtermin. Bei einer Lieferung helfen
              auch Abholadresse und Etage. Wir stimmen Ausführung und Preis mit
              Ihnen ab.
            </p>
          </div>
          <div>
            <h2>Wie sieht die Küchenmontage aus?</h2>
            <p>
              Unsere Bilder aus dem Messebau zeigen offene Schrankkorpusse,
              eingepasste Arbeitsplatten und die fertigen Fronten im direkten
              Vergleich.
            </p>
            <Link href="/arbeiten">
              Küchenprojekte vor und nach der Montage →
            </Link>
          </div>
        </div>
      </section>
      <FormCTA cityName={city.name} />
      {others.length > 0 && (
        <section className={styles.band}>
          <h2>Weitere Orte in der Region</h2>
          <div className={styles.links}>
            {others.map((item) => (
              <Link prefetch={false} key={item.slug} href={`/${item.slug}`}>
                {item.name}
              </Link>
            ))}
            <Link href="/staedte">Ortsverzeichnis</Link>
          </div>
        </section>
      )}
    </Directory>
  );
}
