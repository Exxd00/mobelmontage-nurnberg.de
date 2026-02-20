"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ChevronRight } from "lucide-react";
import { businessInfo, services, cities } from "@/lib/data";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Leistungen", href: "/leistungen" },
  { name: "Städte", href: "/staedte" },
  { name: "Arbeiten", href: "/arbeiten" },
  { name: "Kontakt", href: "/kontakt" },
];

const legalLinks = [
  { name: "Impressum", href: "/impressum" },
  { name: "Datenschutz", href: "/datenschutz" },
];

export default function Footer() {
  const mainCities = cities.filter((c) => c.isMain).slice(0, 6);

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white" role="contentinfo">
      {/* Main Footer */}
      <div className="container-max section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-white"
                  aria-hidden="true"
                >
                  <path
                    d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 22V12H15V22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold">{businessInfo.name}</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Professionelle Möbel- & Küchenmontage in Nürnberg und Umgebung.
            </p>
            <p className="text-gray-500 text-xs">
              Rechnung mit ausgewiesener MwSt.
            </p>
            <div className="space-y-2 text-sm">
              <a
                href={`tel:${businessInfo.phone}`}
                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors py-2 no-underline min-h-[44px]"
                aria-label={`Anrufen: ${businessInfo.phone}`}
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {businessInfo.phone}
              </a>
              <a
                href={`mailto:${businessInfo.email}`}
                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors py-2 no-underline min-h-[44px]"
                aria-label={`E-Mail senden an: ${businessInfo.email}`}
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                {businessInfo.email}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Schnelllinks">
            <h2 className="font-bold mb-4 text-white text-base">Navigation</h2>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-1 py-2 no-underline min-h-[44px]"
                  >
                    <ChevronRight className="w-3 h-3" aria-hidden="true" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Leistungen">
            <h2 className="font-bold mb-4 text-white text-base">Leistungen</h2>
            <ul className="space-y-1">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/service/${service.slug}`}
                    className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-1 py-2 no-underline min-h-[44px]"
                  >
                    <ChevronRight className="w-3 h-3" aria-hidden="true" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cities */}
          <nav aria-label="Städte">
            <h2 className="font-bold mb-4 text-white text-base">Städte</h2>
            <ul className="space-y-1">
              {mainCities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/${city.slug}`}
                    className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-1 py-2 no-underline min-h-[44px]"
                  >
                    <ChevronRight className="w-3 h-3" aria-hidden="true" />
                    {city.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/staedte"
                  className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-medium py-2 no-underline min-h-[44px]"
                >
                  <ChevronRight className="w-3 h-3" aria-hidden="true" />
                  Alle Städte
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Working Hours & Regional Info */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>{businessInfo.workingHours.daily}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>
                {businessInfo.address.city}, {businessInfo.address.state}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Regionaler Montageservice in Nürnberg, Fürth, Erlangen und Umgebung.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-max py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} {businessInfo.name}. Alle Rechte
              vorbehalten.
            </p>
            <nav aria-label="Rechtliche Links">
              <ul className="flex items-center gap-4">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-primary transition-colors py-2 no-underline min-h-[44px] inline-flex items-center"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
