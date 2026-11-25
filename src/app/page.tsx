import type { Metadata } from "next";
import Link from "next/link";
import { Armchair, ArrowRight, ArrowUpRight, Building2, CookingPot, MapPin, MessageCircle, Phone, PhoneIncoming, Plus, Truck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InquiryPanel from "@/components/sections/InquiryPanel";
import { projects } from "@/lib/projects";
import { businessInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: { absolute: "Möbelmontage Nürnberg | Küchenmontage, Möbelaufbau & Lieferung" },
  description: "Möbelaufbau ab 59 €, Küchenmontage ab 149 € und Möbellieferung ab 39 € in Nürnberg und Umgebung. Vier Messeküchen im Vorher-Nachher-Vergleich. Angebot anfragen.",
  alternates: { canonical: "/" },
};

const services = [
  { href: "/service/kuechenmontage", label: "Küche montieren", price: "ab 149 €", detail: "Von der Schrankzeile bis zur Insel mit eingepasster Arbeitsplatte.", icon: CookingPot },
  { href: "/service/moebelmontage", label: "Möbel aufbauen", price: "ab 59 €", detail: "Schränke, Betten und Regale nach Anleitung aufbauen lassen.", icon: Armchair },
  { href: "/service/lieferungen", label: "Möbel liefern", price: "ab 39 €", detail: "Möbel abholen und bis zum vereinbarten Stellplatz bringen lassen.", icon: Truck },
  { href: "/firmenkunden", label: "Für Firmen", price: "Nach Aufwand", detail: "Aufbau im Büro, Lieferung zum Betrieb oder Montage einer Ausstellungsküche.", icon: Building2 },
];

const questions = [
  ["Was kostet die Möbelmontage in Nürnberg?", "Die Möbelmontage beginnt bei 59 €, die Küchenmontage bei 149 € und die Möbellieferung bei 39 €. Der konkrete Preis hängt von Umfang, Anfahrt und Zugang ab. Mit Ihrer Anfrage erhalten Sie ein Angebot für Ihr Vorhaben."],
  ["Welche Angaben braucht das Montageteam?", "Für den Möbelaufbau helfen Modell, Stückzahl und Ausführung oder ein aussagekräftiges Foto bzw. ein Plan. Bei Küchen fragen wir nach Form, Schrankzahl, Anschlüssen und Arbeitsplatte. Für eine Lieferung brauchen wir die Packstücke, beide Adressen und die Tragewege. Ergänzen Sie den gewünschten Zeitraum, damit wir Aufwand und Termin gemeinsam prüfen können."],
  ["Kann ich eine IKEA-Küche montieren lassen?", "Ja. Geben Sie das Küchensystem und den Plan an, etwa bei einer IKEA METOD Küche. Schreiben Sie dazu, welche Schränke, Geräte und Arbeitsplatten vorhanden sind und welche Arbeiten Sie benötigen."],
  ["Wo kann ich abgeschlossene Montagen sehen?", "Im Projektbereich finden Sie vier Messeküchen. Jedes Projekt zeigt den Montagezustand und das Ergebnis mit einer Beschreibung der sichtbaren Arbeitsschritte."],
];

const frequentJobs = [
  ["PAX-Schrank aufbauen", "pax-schrank-montage"],
  ["Arbeitsplatte montieren", "arbeitsplatten-montage"],
  ["Bett aufbauen", "bett-montage"],
  ["Sofa liefern", "sofa-lieferung"],
];

const featured = ["gruene-winkelkueche", "kueche-mit-holzinsel"].map(slug => projects.find(project => project.slug === slug)!);

export default function HomePage() {
  return <><Header/><main id="main-content" className="studio-home">
    <section className="studio-shell opening">
      <div className="opening-copy">
        <p className="service-area"><MapPin size={15} aria-hidden="true"/> Nürnberg · Fürth · Erlangen</p>
        <h1>Möbelmontage <br/><em>in Nürnberg.</em></h1>
        <p className="opening-intro">Die neue Küche ist geplant, der Schrank noch im Karton? Wir bauen Ihre Möbel auf oder liefern sie bis in Ihre Wohnung. Wählen Sie Ihr Vorhaben für ein persönliches Angebot.</p>
        <div className="opening-links"><a className="studio-button" href="#leistungen">Vorhaben wählen <ArrowRight size={18}/></a><Link className="studio-link" href="/leistungen#preisfinder">Preis einschätzen <ArrowUpRight size={17}/></Link></div>
        <div className="opening-contacts" role="group" aria-label="Kontaktwege">
          <a href={"tel:" + businessInfo.phone.replace(/\s/g, "")}><Phone size={16} aria-hidden="true"/>Anrufen</a>
          <a href={"https://wa.me/" + businessInfo.whatsapp.replace(/\D/g, "")}><MessageCircle size={16} aria-hidden="true"/>WhatsApp</a>
          <Link href="/rueckruf"><PhoneIncoming size={16} aria-hidden="true"/>Rückruf</Link>
        </div>
      </div>
      <figure className="opening-photo">
        <Link href="/arbeiten/weisse-messekueche" aria-label="Projekt ansehen: weiße Messeküche mit Glasvitrinen">
          <img src="/projekte/weisse-messekueche/hero-1080.webp" srcSet="/projekte/weisse-messekueche/hero-640.webp 640w, /projekte/weisse-messekueche/hero-1080.webp 1080w" sizes="(max-width: 539px) 37vw, (max-width: 780px) 44vw, (max-width: 1470px) 45vw, 662px" width="1080" height="720" alt="Fertig montierte weiße Messeküche mit beleuchteten Glasvitrinen und dunkler Arbeitsplatte" fetchPriority="high"/>
          <span className="opening-caption">Weiße Messeküche <ArrowUpRight size={16}/></span>
        </Link>
      </figure>
    </section>
    <section className="studio-services" id="leistungen"><div className="studio-shell">
      <div className="section-heading"><h2>Was möchten Sie montieren oder liefern lassen?</h2><Link className="studio-link" href="/leistungen">Leistungen & Preise <ArrowRight size={16}/></Link></div>
      <div className="service-grid">{services.map(({href,label,price,detail,icon: Icon}) =>
        <Link key={href} className="service-item" href={href}>
          <span className="service-item-top"><Icon size={26} strokeWidth={1.55}/><span>{price}</span></span>
          <h3>{label} <ArrowUpRight size={18}/></h3><p>{detail}</p>
        </Link>)}</div>
      <nav className="frequent-jobs" aria-label="Häufige Aufträge">
        {frequentJobs.map(([label, slug]) => <Link key={slug} prefetch={false} href={`/service/${slug}`}>{label}<ArrowRight size={15} aria-hidden="true"/></Link>)}
      </nav>
    </div></section>
    <section className="studio-shell home-projects">
      <div className="section-heading"><div><h2>Unsere Küchenprojekte</h2><p>Vier Messeküchen, vom offenen Korpus bis zur fertigen Front.</p></div>
        <Link className="studio-link" href="/arbeiten">Alle vier Projekte <ArrowRight size={16}/></Link></div>
      <div className="featured-grid">{featured.map(project =>
        <Link className="featured-card" key={project.slug} href={"/arbeiten/"+project.slug}>
          <img src={"/projekte/"+project.slug+"/hero-640.webp"} srcSet={"/projekte/"+project.slug+"/hero-640.webp 640w, "+project.cover.src+" 1080w"} sizes="(max-width: 650px) 92vw, 46vw" width={640} height={427} alt={project.cover.alt} loading="lazy" decoding="async"/>
          <div><h3>{project.title}</h3><ArrowUpRight aria-hidden="true"/></div>
        </Link>)}</div>
    </section>
    <section className="home-answers"><div className="studio-shell answer-grid">
      <div><h2>Vor der Montage</h2><p>Antworten zu Preis, Vorbereitung und Ablauf.</p><Link className="studio-link" href="/staedte">Einsatzgebiet prüfen <ArrowRight size={16}/></Link></div>
      <div>{questions.map(([q,a]) => <details key={q}><summary>{q}<Plus size={17} aria-hidden="true"/></summary><p>{a}</p></details>)}</div>
    </div></section>
    <InquiryPanel projectTitles={Object.fromEntries(projects.map(project => [project.slug, project.title]))}/>
  </main><Footer/></>;
}
