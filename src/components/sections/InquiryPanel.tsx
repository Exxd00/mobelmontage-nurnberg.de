"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { businessInfo } from "@/lib/data";
import { businessInquiries, isBusinessInquiry } from "@/lib/business-inquiries";
import { getPriceExample } from "@/lib/price-examples";

const QuickContactForm = dynamic(() => import("./QuickContactForm"), {
  loading: () => <p className="form-loading" role="status">Formular wird geladen …</p>,
});

const options = [["kuechenmontage","Küche montieren"],["moebelmontage","Möbel aufbauen"],["lieferungen","Möbel liefern lassen"],["andere","Etwas anderes"]];

export default function InquiryPanel({ projectTitles }: { projectTitles: Record<string, string> }) {
  const [service, setService] = useState("");
  const [reference, setReference] = useState("");
  const [businessInquiry, setBusinessInquiry] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selected = params.get("leistung");
    const business = params.get("betrieb");
    const references = [];
    if (isBusinessInquiry(business) && businessInquiries[business].service === selected) {
      setBusinessInquiry(true);
      references.push("Firmenanfrage: " + businessInquiries[business].title);
    }
    if (selected && options.some(([id]) => id === selected)) {
      const example = getPriceExample(params.get("beispiel"));
      if (example?.service === selected) {
        references.push(`Preisorientierung für ${example.title} (ab ${example.from}).`);
      }
      const slug = params.get("projekt");
      if (selected === "kuechenmontage" && slug && Object.hasOwn(projectTitles, slug)) {
        references.push("Bezug: " + projectTitles[slug]);
      }
      setService(selected);
    }
    setReference(references.join("\n"));
  }, [projectTitles]);
  return <section id="kontakt-form" className="studio-inquiry"><div className="studio-shell inquiry-grid">
    <div><h2>Was möchten Sie<br/>montieren lassen?</h2><p>Wählen Sie Ihr Vorhaben. Fotos, Maße oder ein Küchenplan helfen uns, den Aufwand einzuschätzen.</p>
      <a className="inquiry-phone" href={"tel:" + businessInfo.phone.replace(/\s/g,"")}>{businessInfo.phone}</a>
      <a className="inquiry-email" href={"mailto:" + businessInfo.email}>{businessInfo.email}</a></div>
    <div className="inquiry-entry">
      {service ? <QuickContactForm initialService={service} initialDetails={reference} businessInquiry={businessInquiry} embedded/> : <>
        <h3>Ihr Vorhaben</h3>
        {options.map(([value,label]) =>
          <button key={value} type="button" onClick={() => setService(value)}>{label}<ArrowUpRight aria-hidden="true" size={18}/></button>
        )}
        <noscript><p>Für die schriftliche Anfrage senden Sie uns bitte eine E-Mail mit Ort und Leistungswunsch.</p></noscript>
      </>}
    </div>
  </div></section>;
}
