"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import Brand from "./Brand";
import "@/app/studio.css";

const links = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/arbeiten", label: "Projekte" },
  { href: "/staedte", label: "Einsatzgebiet" },
  { href: "/firmenkunden", label: "Für Firmen" },
];

export default function Header({ offerHref }: { offerHref?: string }) {
  const pathname = usePathname();
  const offer = offerHref ?? (pathname === "/" ? "#kontakt-form" : "/#kontakt-form");
  const [dark, setDark] = useState(false);
  const [largeType, setLargeType] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const currentDark = document.documentElement.classList.contains("dark");
    setDark(currentDark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", currentDark ? "#202A22" : "#F7F5EF");
    let large = document.documentElement.classList.contains("bigtype");
    try {
      const saved = localStorage.getItem("bigtype");
      if (saved !== null) large = saved === "true";
    } catch { /* Keep the current choice when storage is unavailable. */ }
    document.documentElement.classList.toggle("bigtype", large);
    setLargeType(large);
    if (menu.current) menu.current.open = false;
  }, [pathname]);
  function changeTheme() {
    const next = document.documentElement.classList.toggle("dark");
    setDark(next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next ? "#202A22" : "#F7F5EF");
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* Storage can be disabled. */ }
  }
  function closeMenu() {
    if (menu.current) menu.current.open = false;
  }
  function changeTypeSize() {
    const next = document.documentElement.classList.toggle("bigtype");
    setLargeType(next);
    try { localStorage.setItem("bigtype", String(next)); } catch { /* The current page can still use the preference. */ }
  }
  const navItems = links.map(({href, label}) =>
    <Link key={href} href={href} prefetch={false} aria-current={pathname === href ? "page" : undefined} onClick={closeMenu}>{label}</Link>
  );
  const typeButton = (
    <button type="button" className="text-size-toggle" aria-pressed={largeType} onClick={changeTypeSize}>
      <span aria-hidden="true">A+</span><span>Größere Schrift</span>
    </button>
  );
  return (
    <header className="studio-header">
      <div className="studio-bar">
        <Brand/>
        <nav className="wide-links" aria-label="Hauptnavigation">{navItems}{typeButton}</nav>
        <div className="header-tools">
          <button className="theme-switch" onClick={changeTheme} aria-label={dark ? "Hellen Modus einschalten" : "Dunklen Modus einschalten"}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
          <Link className="studio-button header-action" prefetch={false} href={offer}>Angebot anfragen <ArrowUpRight size={16}/></Link>
          <details ref={menu} className="mobile-menu" onKeyDown={e => { if (e.key === "Escape") { closeMenu(); menu.current?.querySelector("summary")?.focus(); } }}>
            <summary aria-label="Navigation"><Menu className="menu-closed"/><X className="menu-open"/></summary>
            <nav aria-label="Mobile Hauptnavigation">{navItems}{typeButton}<Link prefetch={false} href={offer} onClick={closeMenu}>Angebot anfragen</Link></nav>
          </details>
        </div>
      </div>
    </header>
  );
}
