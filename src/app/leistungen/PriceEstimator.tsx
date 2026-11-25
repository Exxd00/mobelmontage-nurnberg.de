"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import FormCTA from "@/components/sections/FormCTA";
import { inquiryHref, inquiryQuery, readInquiryIds, type InquiryIds } from "@/lib/inquiry-context";
import { getPriceExample, priceExamples } from "@/lib/price-examples";
import { contactLinks } from "@/lib/contact-links";
import styles from "@/components/service/Directory.module.css";

type Category = { id: string; name: string; subServices: { slug: string; name: string }[] };

function usePriceSelection(services: Category[]) {
  const source = readInquiryIds(useSearchParams());
  const group = services.find(item => item.id === source.service);
  const linkedExample = getPriceExample(source.example || null);
  const example = linkedExample && (!group || linkedExample.service === group.id) ? linkedExample : undefined;
  const task = group?.subServices.find(item => item.slug === source.task);
  const category = group?.id || example?.service || "";
  const context = {
    service: category,
    task: task?.slug,
    city: source.city,
    example: example?.id,
  };
  return { category, task, example, context };
}

export default function PriceEstimator({ services }: { services: Category[] }) {
  const { category, task, example, context } = usePriceSelection(services);
  const chat = contactLinks(context, { task: task?.name });
  useEffect(() => {
    const notify = () => window.dispatchEvent(new Event("montage:contact-context"));
    notify();
    return () => queueMicrotask(notify);
  }, [chat.whatsapp, chat.callback]);
  const choices = priceExamples.filter(item => !category || item.service === category);
  function updateSelection(next: InquiryIds) {
    const url = new URL(window.location.href);
    for (const key of ["leistung", "aufgabe", "beispiel"]) url.searchParams.delete(key);
    new URLSearchParams(inquiryQuery(next)).forEach((value, key) => url.searchParams.set(key, value));
    window.history.replaceState(null, "", url);
  }
  return (
    <div data-active-whatsapp={chat.whatsapp} data-active-callback={chat.callback}>
      <div className={styles.filters}>
        <label htmlFor="preis-bereich">
          Leistung
          <select id="preis-bereich" value={category} onChange={event => updateSelection({ service: event.target.value })}>
            <option value="">Alle Leistungen</option>
            {services.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
          </select>
        </label>
        <label htmlFor="preis-vorhaben">
          Preisbeispiel
          <select id="preis-vorhaben" value={example?.id || ""} onChange={event => {
            const next = getPriceExample(event.target.value);
            updateSelection({ service: next?.service || category, example: next?.id,
              task: next?.duration ? undefined : task?.slug });
          }}>
            <option value="">Beispiel auswählen</option>
            {choices.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </label>
      </div>
      <div aria-live="polite" aria-atomic="true">
        {example && <div className={styles.tile}>
          <h3>{example.title}</h3>
          <p className={styles.tilePrice}>
            {example.duration ? "Richtpreis" : "Einstiegspreis"} ab {example.from}
          </p>
          {example.duration && <p>Für dieses Beispiel sind {example.duration} vorgesehen.</p>}
          <p>{example.preparation}</p>
        </div>}
      </div>
      {context.service && <div className={styles.links}>
        <Link href={inquiryHref(context)}>{task && !example ? `${task.name} anfragen` : "Angebot mit dieser Auswahl anfragen"} →</Link>
        <Link href={inquiryHref(context, "callback")}>Rückruf zu diesem Vorhaben</Link>
      </div>}
    </div>
  );
}

export function PriceHeader({ services }: { services: Category[] }) {
  const { context } = usePriceSelection(services);
  return <Header offerHref={inquiryHref(context)}/>;
}

export function PriceFormCTA({ services }: { services: Category[] }) {
  const { context } = usePriceSelection(services);
  return <FormCTA context={context}/>;
}
