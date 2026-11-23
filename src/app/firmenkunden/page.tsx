import Link from "next/link";
import { ArrowDown, ArrowRight, Armchair, CookingPot, PanelsTopLeft, Truck } from "lucide-react";
import { Directory } from "@/components/service/Directory";
import { businessInquiries, type BusinessInquiry } from "@/lib/business-inquiries";
import { pageMetadata } from "@/lib/service-directory";
import styles from "./business.module.css";

export const metadata = pageMetadata(
  "Möbelmontage für Firmen in Nürnberg | Büro, Teeküche & Ausstellung",
  "Büromöbel aufbauen, eine Teeküche montieren oder Möbel anliefern lassen. Beschreiben Sie Stückzahl, Einsatzort und Zeitfenster für Ihr Firmenangebot.",
  "/firmenkunden",
);

const jobs = [
  { key: "buero", icon: Armchair, body: "Schreibtische, Regale oder Schränke für einen neuen Arbeitsplatz? Eine Stückliste mit Modellnamen und eine Skizze der Räume helfen, den Aufbau je Raum zu planen." },
  { key: "ausstellung", icon: PanelsTopLeft, body: "Für die Montage am Messestand oder im Showroom zählen die Planversion, der Anliefertermin und das Zeitfenster bis zur Übergabe. Fotos zeigen, welche Teile bereits stehen." },
  { key: "lieferung", icon: Truck, body: "Möbel sollen vom Händler oder aus einem anderen Betrieb zu Ihnen? Nennen Sie beide Adressen, die Packmaße und die Stelle im Gebäude, an der die Lieferung enden soll." },
  { key: "teekueche", icon: CookingPot, body: "Bei einer neuen Küche für das Team helfen Grundriss, Schrankliste und Gerätemodelle. Kennzeichnen Sie, welche Teile übernommen werden und wo Ausschnitte in der Arbeitsplatte vorgesehen sind." },
] satisfies { key: BusinessInquiry; icon: typeof Armchair; body: string }[];

export default function BusinessPage() {
  return (
    <Directory crumbs={[{ label: "Für Firmen", href: "/firmenkunden" }]}>
      <header className={styles.hero}>
        <div className={styles.copy}>
          <h1>Möbelmontage <em>für Firmen.</em></h1>
          <p>Ein Büro zieht in neue Räume, die Teeküche ist geliefert oder der Messestand soll zur Eröffnung fertig sein? Für Aufträge in Nürnberg und Umgebung stimmen wir die Montage mit Ihrem Betrieb ab.</p>
          <a className={styles.button} href="#firmenauftrag">Firmenauftrag wählen <ArrowDown size={17} aria-hidden="true"/></a>
        </div>
        <Link href="/arbeiten/kueche-mit-holzinsel" className={styles.photo} aria-label="Messeprojekt Kücheninsel in Holzoptik ansehen">
          <picture>
            <source media="(max-width: 680px)" srcSet="/projekte/kueche-mit-holzinsel/hero-640.webp" />
            <img src="/projekte/kueche-mit-holzinsel/hero-640.webp" srcSet="/projekte/kueche-mit-holzinsel/hero-640.webp 640w, /projekte/kueche-mit-holzinsel/hero-1080.webp 1080w" sizes="(max-width: 1470px) 45vw, 662px" width="1080" height="720" fetchPriority="high" alt="Fertig montierte Messeküche mit Holzinsel, offenen Fächern und eingepasster Arbeitsplatte"/>
          </picture>
          <span>Messeküche ansehen <ArrowRight size={15} aria-hidden="true"/></span>
        </Link>
      </header>
      <section id="firmenauftrag" className={styles.work}>
        <h2>Was steht in Ihrem Betrieb an?</h2>
        <div className={styles.grid}>
          {jobs.map(({ key, icon: Icon, body }) => (
            <Link key={key} href={`/firmenkunden/${key}`} data-intent={`firmenkunden_${key}`} className={styles.card}>
              <Icon size={25} aria-hidden="true"/>
              <h3>{businessInquiries[key].title}</h3>
              <p>{body}</p>
              <span>Ablauf ansehen <ArrowRight size={16} aria-hidden="true"/></span>
            </Link>
          ))}
        </div>
      </section>
      <section className={styles.planning}>
        <h2>Was brauchen wir für Ihr Angebot?</h2>
        <div>
          <h3>Auftrag und Ansprechpartner</h3>
          <p>Nennen Sie Ihren Betrieb, die Kontaktperson und den Einsatzort. Wenn die Räume während der Montage genutzt werden, beschreiben Sie die belegten Bereiche und die Zeiten, in denen wir Zugang haben. Bei mehreren Etagen ist ein Plan mit der Verteilung der Möbel hilfreich.</p>
          <h3>Zufahrt und Termin</h3>
          <p>Wo kann das Fahrzeug halten? Ein Lastenaufzug, die Entfernung zwischen Ladezone und Stellplatz sowie feste Anmeldezeiten ändern die Planung. Auf einem Messegelände gehören auch Halle, Standnummer und das freigegebene Lieferfenster in die Anfrage.</p>
          <h3>Vom Plan zum Preis</h3>
          <p>Schicken Sie eine vorhandene Stückliste, Fotos oder einen Küchenplan mit. Wir prüfen Anfahrt, Tragewege und Montageumfang und erstellen ein individuelles Angebot. Teilen Sie uns mit, wenn Anlieferung und Aufbau an unterschiedlichen Tagen stattfinden sollen. Über den Auftrag entscheiden Sie, sobald Sie das Angebot geprüft haben.</p>
          <Link href="/arbeiten">Vier dokumentierte Messeküchen ansehen →</Link>
        </div>
      </section>
    </Directory>
  );
}
