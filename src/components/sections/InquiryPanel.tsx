"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { businessInfo } from "@/lib/data";
import { inquiryQuery, readInquiryIds, resolveInquiry, type DirectoryReference } from "@/lib/inquiry-context";

const QuickContactForm = dynamic(() => import("./QuickContactForm"), {
  loading: () => <p className="form-loading" role="status">Formular wird geladen …</p>,
});

const options = [["kuechenmontage","Küche montieren"],["moebelmontage","Möbel aufbauen"],["lieferungen","Möbel liefern lassen"],["andere","Etwas anderes"]];

type Props = { projectTitles: Record<string, string> };

function Entry({ query, projectTitles }: Props & { query: string }) {
  const ids = readInquiryIds(new URLSearchParams(query));
  const directoryQuery = inquiryQuery({ task: ids.task, city: ids.city });
  const [directory, setDirectory] = useState<DirectoryReference | null>(null);
  const [choice, setChoice] = useState("");
  useEffect(() => {
    if (!directoryQuery) return;
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 4500);
    fetch("/api/anfrage-kontext?" + directoryQuery, { signal: controller.signal })
      .then(response => response.ok ? response.json() : {})
      .then(result => { if (active) setDirectory(result); })
      .catch(() => { if (active) setDirectory({}); })
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [directoryQuery]);
  if (directoryQuery && !directory) return <p className="form-loading" role="status">Anfrage wird vorbereitet …</p>;
  const context = resolveInquiry(ids, projectTitles, directory ?? {});
  const service = context.ids.service ?? choice;
  if (service) return <QuickContactForm initialService={service} initialDetails={context.reference}
    contactLabels={{ task: context.ids.task ? directory?.task?.name : undefined,
      city: directory?.city?.unconfirmed ? undefined : directory?.city?.name,
      project: context.ids.project ? projectTitles[context.ids.project] : undefined }}
    inquiryContext={{ ...context.ids, service }} businessInquiry={Boolean(context.ids.business)} embedded/>;
  return <>
    <h3>Ihr Vorhaben</h3>
    {options.map(([value,label]) =>
      <button key={value} type="button" onClick={() => setChoice(value)}>{label}<ArrowUpRight aria-hidden="true" size={18}/></button>
    )}
    <noscript><p>Per E-Mail erreichen Sie uns ebenfalls. Beschreiben Sie die gewünschten Arbeiten und die Möbel oder Packstücke. Nennen Sie Einsatzort, Zugang, Terminwunsch und eine Telefonnummer für Rückfragen.</p></noscript>
  </>;
}

function CurrentEntry({ projectTitles }: Props) {
  const query = inquiryQuery(readInquiryIds(useSearchParams()));
  return <Entry key={query} query={query} projectTitles={projectTitles}/>;
}

export default function InquiryPanel({ projectTitles }: Props) {
  return <section id="kontakt-form" className="studio-inquiry"><div className="studio-shell inquiry-grid">
    <div><h2>Wofür brauchen Sie ein Angebot?</h2><p>Wählen Sie Ihre Leistung. Das Formular fragt nach dem Umfang, dem Einsatzort und Ihrem Terminwunsch. Mit diesen Angaben kann unser Team Ihren Auftrag direkt prüfen und den Preis für Sie kalkulieren.</p>
      <a className="inquiry-phone" href={"tel:" + businessInfo.phone.replace(/\s/g,"")}>{businessInfo.phone}</a>
      <a className="inquiry-email" href={"mailto:" + businessInfo.email}>{businessInfo.email}</a></div>
    <div className="inquiry-entry">
      <Suspense fallback={<Entry query="" projectTitles={projectTitles}/>}>
        <CurrentEntry projectTitles={projectTitles}/>
      </Suspense>
    </div>
  </div></section>;
}
