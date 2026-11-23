import Link from "next/link";
import FormCTA from "@/components/sections/FormCTA";
import {
  Directory,
  Intro,
  KitchenExample,
} from "@/components/service/Directory";
import styles from "@/components/service/Directory.module.css";
import { services } from "@/lib/data";
import { pageMetadata } from "@/lib/service-directory";
import { serviceBasics } from "@/lib/service-guide";

export const metadata = pageMetadata(
  "Leistungen & Preise für Lieferung und Montage | Möbelmontage Nürnberg",
  "Lieferung ab 39 €, Möbelmontage ab 59 € und Küchenmontage ab 149 €. Richtpreise, Beispiele und Angaben für Ihr individuelles Angebot in der Region Nürnberg.",
  "/leistungen",
);

const examples = [
  ["PAX-Schrank, 2 m", "ab 89 €", "ca. 2 Std."],
  ["KALLAX-Regal", "ab 35 €", "ca. 30 Min."],
  ["MALM-Bett, 160 cm", "ab 59 €", "ca. 1 Std."],
  ["HEMNES-Kommode", "ab 45 €", "ca. 45 Min."],
  ["IKEA-Küche mit zehn Schränken", "ab 349 €", "ca. 1 Tag"],
  ["Lieferung und Montage eines PAX-Schranks", "ab 149 €", "ca. 3 Std."],
];

export default function LeistungenPage() {
  return (
    <Directory crumbs={[{ label: "Leistungen", href: "/leistungen" }]}>
      <Intro
        title="Leistungen und Preise"
        description="Vom einzelnen Möbelstück bis zur Küchenzeile: Wählen Sie Ihren Auftrag und sehen Sie, welche Angaben für ein konkretes Angebot helfen."
      />
      <section className={styles.band}>
        <h2>Was möchten Sie beauftragen?</h2>
        <div className={styles.tiles}>
          {services.map((group) => {
            const item = serviceBasics[group.id];
            return (
              <article className={styles.tile} key={group.id}>
                <h3>
                  <Link href={`/service/${group.slug}`}>{item.title}</Link>
                </h3>
                <p className={styles.tilePrice}>ab {item.price}</p>
                <p>{item.intro}</p>
                <Link href={`#${group.id}`}>Arbeiten im Detail ↓</Link>
              </article>
            );
          })}
        </div>
      </section>
      <section className={styles.band}>
        <h2>Wie viel kostet der Aufbau?</h2>
        <p>
          Diese Beispiele dienen zur Orientierung. Modell, Montageumfang und
          Anfahrt bestimmen das konkrete Angebot.
        </p>
        <table className={styles.priceTable}>
          <caption className="sr-only">
            Preis- und Zeitbeispiele für einzelne Aufträge
          </caption>
          <thead>
            <tr>
              <th scope="col">Auftrag</th>
              <th scope="col">Richtpreis</th>
              <th scope="col">Zeitbedarf</th>
            </tr>
          </thead>
          <tbody>
            {examples.map(([item, price, time]) => (
              <tr key={item}>
                <th scope="row">{item}</th>
                <td>{price}</td>
                <td>{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <KitchenExample />
      {services.map((group) => (
        <section className={styles.band} id={group.id} key={group.id}>
          <h2>{serviceBasics[group.id].title} im Detail</h2>
          <p>{serviceBasics[group.id].preparation}</p>
          <div className={styles.linkgrid}>
            {group.subServices.map((item) => (
              <Link
                prefetch={false}
                key={item.slug}
                href={`/service/${item.slug}`}
              >
                {item.name}
                <span aria-hidden>↗</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <FormCTA />
    </Directory>
  );
}
