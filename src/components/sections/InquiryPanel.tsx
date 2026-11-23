"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { businessInfo } from "@/lib/data";

const QuickContactForm = dynamic(() => import("./QuickContactForm"), {
  loading: () => <p className="form-loading" role="status">Formular wird geladen …</p>,
});

const options = [["kuechenmontage","Küche montieren"],["moebelmontage","Möbel aufbauen"],["lieferungen","Möbel liefern lassen"],["andere","Etwas anderes"]];

export default function InquiryPanel({ projectTitles }: { projectTitles: Record<string, string> }) {
  const [service, setService] = useState("");
  const [reference, setReference] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selected = params.get("leistung");
    if (selected && options.some(([id]) => id === selected)) {
      const slug = params.get("projekt");
      if (selected === "kuechenmontage" && slug && Object.hasOwn(projectTitles, slug)) {
        setReference("Bezug: " + projectTitles[slug]);
      }
      setService(selected);
    }
  }, [projectTitles]);
  return <section id="kontakt-form" className="studio-inquiry"><div className="studio-shell inquiry-grid">
    <div><h2>Was möchten Sie<br/>montieren lassen?</h2><p>Wählen Sie Ihr Vorhaben. Fotos, Maße oder ein Küchenplan helfen uns, den Aufwand einzuschätzen.</p>
      <a className="inquiry-phone" href={"tel:" + businessInfo.phone.replace(/\s/g,"")}>{businessInfo.phone}</a>
      <a className="inquiry-email" href={"mailto:" + businessInfo.email}>{businessInfo.email}</a></div>
    <div className="inquiry-entry">
      {service ? <QuickContactForm initialService={service} initialDetails={reference} embedded/> : <>
        <h3>Ihr Vorhaben</h3>
        {options.map(([value,label]) =>
          <button key={value} type="button" onClick={() => setService(value)}>{label}<ArrowUpRight aria-hidden="true" size={18}/></button>
        )}
        <noscript><p>Für die schriftliche Anfrage senden Sie uns bitte eine E-Mail mit Ort und Leistungswunsch.</p></noscript>
      </>}
    </div>
  </div></section>;
}
