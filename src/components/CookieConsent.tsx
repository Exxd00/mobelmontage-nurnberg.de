"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { consentKey, getCookieChoice, setCookieChoice, type CookieChoice } from "@/lib/consent";
import styles from "./CookieConsent.module.css";

const showSettings = "montage:cookie-settings";

export function CookieSettingsButton({ className }: { className?: string }) {
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(showSettings))}>Cookie-Einstellungen</button>;
}

export default function CookieConsent() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<CookieChoice | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  useEffect(() => {
    const sync = () => {
      const choice = getCookieChoice();
      setCurrent(choice);
      setShowPrompt(choice === null);
    };
    const syncFromOtherTab = (event: StorageEvent) => {
      if (event.key === consentKey || event.key === null) sync();
    };
    const openSettings = () => {
      setCurrent(getCookieChoice());
      if (!dialog.current?.open) dialog.current?.showModal();
    };
    sync();
    window.addEventListener(showSettings, openSettings);
    window.addEventListener("storage", syncFromOtherTab);
    return () => {
      window.removeEventListener(showSettings, openSettings);
      window.removeEventListener("storage", syncFromOtherTab);
    };
  }, []);

  function save(choice: CookieChoice) {
    setCookieChoice(choice);
    setCurrent(choice);
    setShowPrompt(false);
    dialog.current?.close();
  }

  return (
    <>
    {showPrompt && <>
      <aside aria-label="Statistik-Einstellungen" data-cookie-prompt className={styles.prompt}>
        <button className={styles.details} type="button" aria-label="Mehr über optionale Statistik erfahren" onClick={() => dialog.current?.showModal()}>Optionale Statistik</button>
        <div className={styles.choices}>
          <button type="button" onClick={() => save("declined")}>Ablehnen</button>
          <button type="button" onClick={() => save("accepted")}>Erlauben</button>
        </div>
      </aside>
      <div aria-hidden="true" className={styles.reserve} />
    </>}
    <dialog ref={dialog} aria-labelledby="cookie-title" aria-describedby="cookie-description"
      className="m-auto w-full max-w-[min(28rem,92vw)] rounded-2xl border border-border bg-card p-6 text-foreground shadow-xl backdrop:bg-black/45">
      <h2 id="cookie-title" className="mb-2 text-xl font-semibold">Cookie-Einstellungen</h2>
      <p id="cookie-description" className="text-sm">Mit Ihrer Zustimmung messen wir mit Google Analytics Seitenaufrufe und Kontaktaktionen. Sie können Ihre Auswahl jederzeit ändern.</p>
      <p className="my-4 text-sm">Statistik ist {current === "accepted" ? "aktiviert" : "ausgeschaltet"}. <Link href="/datenschutz" className="underline" onClick={() => dialog.current?.close()}>Datenschutzerklärung</Link></p>
      <div className="flex flex-wrap gap-2">
        <button className="min-h-11 rounded-lg border border-current px-3 py-2 text-sm" type="button" onClick={() => save("declined")}>Ablehnen</button>
        <button className="min-h-11 rounded-lg border border-current px-3 py-2 text-sm" type="button" onClick={() => save("accepted")}>Statistik erlauben</button>
        <button className="min-h-11 px-2 text-sm underline" type="button" onClick={() => dialog.current?.close()}>Schließen</button>
      </div>
    </dialog>
    </>
  );
}
