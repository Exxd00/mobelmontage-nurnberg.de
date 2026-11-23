import type { Metadata } from "next";
import Link from "next/link";
import { Armchair, ArrowRight, ArrowUpRight, CookingPot, MapPin, Plus, Truck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InquiryPanel from "@/components/sections/InquiryPanel";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: { absolute: "Möbelmontage Nürnberg | Küchenmontage, Möbelaufbau & Lieferung" },
  description: "Möbelaufbau ab 59 €, Küchenmontage ab 149 € und Möbellieferung ab 39 € in Nürnberg und Umgebung. Vier Messeküchen im Vorher-Nachher-Vergleich. Angebot anfragen.",
  alternates: { canonical: "/" },
};

const services = [
  { slug: "kuechenmontage", label: "Küchenmontage", price: "149", detail: "Vom Ausrichten der Unterschränke bis zum Einpassen der Arbeitsplatte.", icon: CookingPot },
  { slug: "moebelmontage", label: "Möbelmontage", price: "59", detail: "Aufbau von Schränken, Betten und Regalen, auch von IKEA.", icon: Armchair },
  { slug: "lieferungen", label: "Möbellieferung", price: "39", detail: "Abholung im Möbelhaus und Lieferung bis in Ihre Wohnung.", icon: Truck },
];

const questions = [
  ["Was kostet die Möbelmontage in Nürnberg?", "Die Möbelmontage beginnt bei 59 €, die Küchenmontage bei 149 € und die Möbellieferung bei 39 €. Der konkrete Preis hängt von Umfang, Anfahrt und Zugang ab. Mit Ihrer Anfrage erhalten Sie ein Angebot für Ihr Vorhaben."],
  ["Welche Angaben braucht das Montageteam?", "Nennen Sie den Ort, die Möbelstücke oder den Küchenhersteller und Ihren Wunschtermin. Hilfreich sind Fotos, Artikelnummern oder ein Küchenplan. Für eine Lieferung ergänzen Sie Abholadresse, Zieladresse und Stockwerk."],
  ["Kann ich eine IKEA-Küche montieren lassen?", "Ja. Geben Sie das Küchensystem und den Plan an, etwa bei einer IKEA METOD Küche. Schreiben Sie dazu, welche Schränke, Geräte und Arbeitsplatten vorhanden sind und welche Arbeiten Sie benötigen."],
  ["Wo kann ich abgeschlossene Montagen sehen?", "Im Projektbereich finden Sie vier Messeküchen. Jedes Projekt zeigt den Montagezustand und das Ergebnis mit einer Beschreibung der sichtbaren Arbeitsschritte."],
];

const featured = ["gruene-winkelkueche", "kueche-mit-holzinsel"].map(slug => projects.find(project => project.slug === slug)!);

export default function HomePage() {
  return <><Header/><main id="main-content" className="studio-home">
    <section className="studio-shell opening">
      <div className="opening-copy">
        <p className="service-area"><MapPin size={15} aria-hidden="true"/> Nürnberg · Fürth · Erlangen</p>
        <h1>Möbelmontage <br/><em>in Nürnberg.</em></h1>
        <p className="opening-intro">Wir montieren Ihre Möbel und Küchen und liefern vom Möbelhaus bis in Ihre Wohnung. Sie erhalten ein Angebot passend zu Ihrem Auftrag.</p>
        <div className="opening-links"><a className="studio-button" href="#kontakt-form">Angebot anfragen <ArrowUpRight size={18}/></a><Link className="studio-link" href="/arbeiten">Projekte ansehen <ArrowRight size={17}/></Link></div>
      </div>
      <figure className="opening-photo">
        <Link href="/arbeiten/weisse-messekueche" aria-label="Projekt ansehen: weiße Messeküche mit Glasvitrinen">
          <img src="/projekte/weisse-messekueche/hero-1080.webp" srcSet="/projekte/weisse-messekueche/hero-640.webp 640w, /projekte/weisse-messekueche/hero-1080.webp 1080w" sizes="(max-width: 740px) 92vw, (max-width: 1240px) 52vw, 660px" width="1080" height="720" alt="Fertig montierte weiße Messeküche mit beleuchteten Glasvitrinen und dunkler Arbeitsplatte" fetchPriority="high"/>
          <span className="opening-caption">Weiße Messeküche <ArrowUpRight size={16}/></span>
        </Link>
      </figure>
    </section>
    <section className="studio-services" id="leistungen"><div className="studio-shell">
      <div className="section-heading"><h2>Unsere Leistungen</h2><Link className="studio-link" href="/leistungen">Leistungen & Preise <ArrowRight size={16}/></Link></div>
      <div className="service-grid">{services.map(({slug,label,price,detail,icon: Icon}) =>
        <Link key={slug} className="service-item" href={"/service/"+slug}>
          <span className="service-item-top"><Icon size={26} strokeWidth={1.55}/><span>ab {price} €</span></span>
          <h3>{label} <ArrowUpRight size={18}/></h3><p>{detail}</p>
        </Link>)}</div>
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
