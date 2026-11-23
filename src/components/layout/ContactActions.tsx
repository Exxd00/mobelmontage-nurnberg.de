"use client";

import { useEffect, useRef, useState } from "react";
import {
  trackPhoneCancelled, trackPhoneClick, trackPhoneConfirmed,
  trackWhatsAppCancelled, trackWhatsAppClick, trackWhatsAppConfirmed,
} from "@/lib/analytics";
import { businessInfo } from "@/lib/data";
import styles from "./contact-actions.module.css";

type Contact = { whatsapp: boolean; href: string; source: string };

export default function ContactActions() {
  const [contact, setContact] = useState<Contact | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    function intercept(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || link.closest("dialog")) return;
      const whatsapp = link.protocol === "https:" && link.hostname === "wa.me";
      if (!whatsapp && link.protocol !== "tel:") return;
      event.preventDefault();
      const source = location.pathname + "#" + (link.closest("header,footer,main")?.tagName.toLowerCase() ?? "page");
      if (whatsapp) trackWhatsAppClick(source);
      else trackPhoneClick(link.pathname, source);
      trigger.current = link;
      setContact({ whatsapp, href: link.href, source });
    }
    document.addEventListener("click", intercept);
    return () => document.removeEventListener("click", intercept);
  }, []);

  useEffect(() => { if (contact && !dialog.current?.open) dialog.current?.showModal(); }, [contact]);

  function close(confirmed: boolean) {
    if (!contact) return;
    if (contact.whatsapp) {
      if (confirmed) trackWhatsAppConfirmed(contact.source);
      else trackWhatsAppCancelled(contact.source);
    } else {
      if (confirmed) trackPhoneConfirmed(businessInfo.phone, contact.source);
      else trackPhoneCancelled(contact.source);
    }
    dialog.current?.close();
    setContact(null);
    trigger.current?.focus({ preventScroll: true });
  }

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="contact-choice-title"
    onCancel={event => { event.preventDefault(); close(false); }}>
    {contact && <>
      <h2 id="contact-choice-title">{contact.whatsapp ? "WhatsApp öffnen?" : "Anruf starten?"}</h2>
      <p>{contact.whatsapp
        ? "Ihre Anfrage geht über WhatsApp an Möbelmontage Nürnberg."
        : "Sie erreichen Möbelmontage Nürnberg unter " + businessInfo.phone + "."}</p>
      <div className={styles.actions}>
        <button type="button" autoFocus onClick={() => close(false)}>Abbrechen</button>
        <a href={contact.href} onClick={event => {
          event.preventDefault();
          const destination = contact.href;
          close(true);
          window.location.assign(destination);
        }}>{contact.whatsapp ? "WhatsApp öffnen" : "Jetzt anrufen"}</a>
      </div>
    </>}
  </dialog>;
}
