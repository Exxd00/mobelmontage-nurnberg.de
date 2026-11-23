import Link from "next/link";
import { Directory, Intro } from "@/components/service/Directory";
import FormCTA from "@/components/sections/FormCTA";
import styles from "@/components/service/Directory.module.css";
import {
  directoryCities,
  mainCities,
  pageMetadata,
} from "@/lib/service-directory";
import CityFinder from "./CityFinder";

export const metadata = pageMetadata(
  "Einsatzgebiet für Möbelmontage und Lieferung | Region Nürnberg",
  "Finden Sie Ihren Ort und die passenden Leistungen für Möbellieferung, Möbelaufbau und Küchenmontage. Verfügbarkeit und Anfahrt können Sie mit Ihrer Postleitzahl anfragen.",
  "/staedte",
);

export default function StaedtePage() {
  const sorted = [...directoryCities].sort((a, b) =>
    a.name.localeCompare(b.name, "de"),
  );
  return (
    <Directory crumbs={[{ label: "Einsatzgebiet", href: "/staedte" }]}>
      <Intro
        title="Unser Einsatzgebiet"
        description="Wir planen Möbelmontage, Küchenaufbau und Lieferungen von Nürnberg aus. Wählen Sie Ihren Ort für die verfügbaren Leistungen. Anfahrt und Termin stimmen wir mit Ihnen ab."
      />
      <section className={styles.band}>
        <h2>Regionale Stadtseiten</h2>
        <div className={styles.links}>
          {mainCities.map((city) => (
            <Link key={city.slug} href={`/${city.slug}`}>
              {city.name}
            </Link>
          ))}
        </div>
      </section>
      <CityFinder cities={sorted} />
      <FormCTA
        title="Ihre Adresse liegt außerhalb der Liste?"
        subtitle="Nennen Sie uns die Postleitzahl und Ihren Auftrag. Wir prüfen, ob sich Ihr Einsatz in eine Tour einplanen lässt."
      />
    </Directory>
  );
}
