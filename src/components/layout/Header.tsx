"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import "@/app/studio.css";

const links = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/arbeiten", label: "Projekte" },
  { href: "/staedte", label: "Einsatzgebiet" },
];

export default function Header() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    if (menu.current) menu.current.open = false;
  }, [pathname]);
  function changeTheme() {
    const next = document.documentElement.classList.toggle("dark");
    setDark(next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* Storage can be disabled. */ }
  }
  function closeMenu() {
    if (menu.current) menu.current.open = false;
  }
  const navItems = links.map(({href, label}) =>
    <Link key={href} href={href} prefetch={false} aria-current={pathname === href ? "page" : undefined} onClick={closeMenu}>{label}</Link>
  );
  return (
    <header className="studio-header">
      <div className="studio-bar">
        <Link href="/" className="studio-brand" aria-label="Möbelmontage Nürnberg – Startseite">
          <span className="brand-mark" aria-hidden="true">M<span>N</span></span>
          <span>Möbelmontage<strong>Nürnberg</strong></span>
        </Link>
        <nav className="wide-links" aria-label="Hauptnavigation">{navItems}</nav>
        <div className="header-tools">
          <button className="theme-switch" onClick={changeTheme} aria-label={dark ? "Hellen Modus einschalten" : "Dunklen Modus einschalten"}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
          <Link className="studio-button header-action" prefetch={false} href="/#kontakt-form">Angebot anfragen <ArrowUpRight size={16}/></Link>
          <details ref={menu} className="mobile-menu" onKeyDown={e => { if (e.key === "Escape") { closeMenu(); menu.current?.querySelector("summary")?.focus(); } }}>
            <summary aria-label="Navigation"><Menu className="menu-closed"/><X className="menu-open"/></summary>
            <nav aria-label="Mobile Hauptnavigation">{navItems}<Link prefetch={false} href="/#kontakt-form" onClick={closeMenu}>Angebot anfragen</Link></nav>
          </details>
        </div>
      </div>
    </header>
  );
}
