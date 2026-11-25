"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  trackPhoneCancelled, trackPhoneClick, trackPhoneConfirmed,
  trackWhatsAppCancelled, trackWhatsAppClick, trackWhatsAppConfirmed,
} from "@/lib/analytics";
import { businessInfo } from "@/lib/data";
import styles from "./contact-actions.module.css";

type Contact = { whatsapp: boolean; href: string; source: string; callback: string };

export default function ContactActions() {
  const [contact, setContact] = useState<Contact | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dock = document.querySelector<HTMLElement>("[data-contact-dock]");
    function syncLinks() {
      const active = document.querySelector<HTMLElement>("[data-active-whatsapp]");
      for (const link of document.querySelectorAll<HTMLAnchorElement>("a[data-page-whatsapp]")) {
        link.href = active?.dataset.activeWhatsapp || link.dataset.pageWhatsapp || link.href;
      }
    }
    syncLinks();
    window.addEventListener("montage:contact-context", syncLinks);
    const covered = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) covered.add(entry.target); else covered.delete(entry.target);
      }
      dock?.toggleAttribute("data-covered", covered.size > 0);
    });
    for (const target of document.querySelectorAll("#kontakt-form, #preisfinder, main form, footer")) observer.observe(target);
    return () => { observer.disconnect(); window.removeEventListener("montage:contact-context", syncLinks); };
  }, [pathname]);

  useEffect(() => {
    function intercept(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || link.closest("dialog")) return;
      const whatsapp = link.protocol === "https:" && link.hostname === "wa.me";
      if (!whatsapp && link.protocol !== "tel:") return;
      event.preventDefault();
      const dock = document.querySelector<HTMLElement>("[data-contact-dock]");
      const active = document.querySelector<HTMLElement>("[data-active-callback]");
      const callback = active?.dataset.activeCallback || dock?.dataset.defaultCallback || "/rueckruf";
      const source = location.pathname + "#" + (link.closest("[data-contact-dock]") ? "schnellkontakt" : link.closest("header,footer,main")?.tagName.toLowerCase() ?? "page");
      if (whatsapp) trackWhatsAppClick(source);
      else trackPhoneClick(link.pathname, source);
      trigger.current = link;
      setContact({ whatsapp, href: link.href, source, callback });
    }
    document.addEventListener("click", intercept);
    return () => document.removeEventListener("click", intercept);
  }, []);

  useEffect(() => { if (contact && !dialog.current?.open) dialog.current?.showModal(); }, [contact]);

  function close(confirmed: boolean) {
    if (!contact || !dialog.current?.open) return false;
    dialog.current.close();
    if (contact.whatsapp) {
      if (confirmed) trackWhatsAppConfirmed(contact.source);
      else trackWhatsAppCancelled(contact.source);
    } else {
      if (confirmed) trackPhoneConfirmed(businessInfo.phone, contact.source);
      else trackPhoneCancelled(contact.source);
    }
    setContact(null);
    trigger.current?.focus({ preventScroll: true });
    return true;
  }

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="contact-choice-title"
    onCancel={event => { event.preventDefault(); close(false); }}>
    {contact && <>
      <h2 id="contact-choice-title">{contact.whatsapp ? "WhatsApp öffnen?" : "Anruf starten?"}</h2>
      <p>{contact.whatsapp
        ? "In WhatsApp können Sie diesen Entwurf bearbeiten und selbst senden."
        : "Sie erreichen Möbelmontage Nürnberg unter " + businessInfo.phone + "."}</p>
      {contact.whatsapp && <blockquote className={styles.draft}>{new URL(contact.href).searchParams.get("text")}</blockquote>}
      <div className={styles.actions}>
        <button type="button" autoFocus onClick={() => close(false)}>Abbrechen</button>
        <a href={contact.href} onClick={event => {
          event.preventDefault();
          const destination = contact.href;
          if (close(true)) window.location.assign(destination);
        }}>{contact.whatsapp ? "WhatsApp öffnen" : "Jetzt anrufen"}</a>
      </div>
      {!contact.whatsapp && !pathname.startsWith("/rueckruf") && <a className={styles.callback} href={contact.callback}>Lieber zurückrufen lassen</a>}
    </>}
  </dialog>;
}
