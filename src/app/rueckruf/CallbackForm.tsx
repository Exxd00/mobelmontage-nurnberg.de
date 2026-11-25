"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { InquiryIds } from "@/lib/inquiry-context";
import { businessInfo } from "@/lib/data";
import { trackEvent, trackLead } from "@/lib/analytics";
import { getTrackingData } from "@/lib/tracking";
import { isContactPhone } from "@/lib/quote-requirements";
import { newInquiryAttempt } from "@/lib/inquiry-attempt";
import styles from "./callback.module.css";

export default function CallbackForm({ context, note }: { context: InquiryIds; note: string }) {
  const sending = useRef(false);
  const attempt = useRef<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const phone = String(data.get("phone") ?? "").trim();
    if (!isContactPhone(phone)) {
      setError("Geben Sie eine erreichbare Telefonnummer mit Vorwahl an.");
      form.querySelector<HTMLInputElement>('[name="phone"]')?.focus();
      return;
    }
    const name = String(data.get("name") ?? "").trim();
    if (!name) {
      setError("Bitte geben Sie Ihren Namen an.");
      form.querySelector<HTMLInputElement>('[name="name"]')?.focus();
      return;
    }
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      const tracking = getTrackingData();
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attempt: attempt.current ??= newInquiryAttempt(),
          service: "rueckruf", name, phone, serviceDetails: { company: String(data.get("company") ?? "").trim(), timeSlot: String(data.get("timeSlot") ?? "").trim() },
          message: String(data.get("note") ?? "").trim(),
          quelle: tracking.source, gclid: tracking.gclid, seite: "/rueckruf",
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success || !payload.notificationsSent?.email) throw new Error();
      setResult(typeof payload.reference === "string" ? payload.reference : "");
      trackEvent({ action: "callback_requested", category: "conversion", label: context.business ?? "privat" });
      trackLead({ source: "callback", service: context.service });
    } catch {
      setError("Der Rückrufwunsch konnte nicht übermittelt werden. Ihre Angaben bleiben hier. Versuchen Sie es erneut oder rufen Sie uns an.");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  if (result !== null) return <section className={styles.form} role="status">
    <h2>Ihr Rückrufwunsch ist eingegangen.</h2>
    {result && <p>Ihre Anfragenummer: <strong>{result}</strong></p>}
    <p>Wir melden uns unter der angegebenen Telefonnummer.</p>
    <Link href="/">Zur Startseite →</Link>
  </section>;
  return <>
  <noscript>
    <style>{`[data-callback-form]{display:none!important}`}</style>
    <div className={styles.form}><p>Für einen Rückruf nennen Sie uns bitte per E-Mail Ihren Namen, Ihre Telefonnummer und eine passende Zeit.</p>
      <a href={`mailto:${businessInfo.email}`}>{businessInfo.email}</a>
      <a href={"tel:" + businessInfo.phone.replace(/\s/g, "")}>{businessInfo.phone}</a>
    </div>
  </noscript>
  <form data-callback-form className={styles.form} method="post" onSubmit={submit}>
    <label>Ihr Name<input name="name" autoComplete="name" required maxLength={120}/></label>
    <label>Telefonnummer<input name="phone" type="tel" autoComplete="tel" required maxLength={45}/></label>
    {context.business && <label>Firma (optional)<input name="company" autoComplete="organization" maxLength={180}/></label>}
    <label>Wann passt ein Rückruf? (optional)<input name="timeSlot" maxLength={160} placeholder="z. B. werktags nach 15 Uhr"/></label>
    <label>Worum geht es? (optional)<textarea name="note" defaultValue={note} maxLength={1200} rows={note ? 4 : 2}/></label>
    <p>Wie wir Ihre Angaben verwenden, erfahren Sie im <Link href="/datenschutz">Datenschutz</Link>.</p>
    {error && <p role="alert">{error} <a href={"tel:" + businessInfo.phone.replace(/\s/g, "")}>{businessInfo.phone}</a></p>}
    <button disabled={busy} type="submit">{busy ? "Wird übermittelt …" : "Rückruf anfragen"}</button>
  </form></>;
}
