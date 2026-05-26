"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookie-consent");
    if (!hasConsented) {
      // Delay showing the banner for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] p-4 no-print"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="container-max">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Text */}
          <div className="flex-1">
            <h3 id="cookie-consent-title" className="font-bold text-foreground mb-1">
              Cookie-Einstellungen
            </h3>
            <p id="cookie-consent-description" className="text-sm text-muted-foreground">
              Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten.{" "}
              <Link href="/datenschutz" className="text-primary hover:underline">
                Mehr erfahren
              </Link>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={declineCookies}
              className="flex-1 md:flex-none px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors min-h-[44px]"
            >
              Ablehnen
            </button>
            <button
              onClick={acceptCookies}
              className="flex-1 md:flex-none px-6 py-2.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors min-h-[44px]"
            >
              Akzeptieren
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={declineCookies}
            className="absolute top-2 right-2 md:static p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
