"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { businessInfo } from "@/lib/data";

export default function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 via-primary/10 to-orange-500/5">
      <div className="container-max">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Bereit für Ihr Projekt?
            </h2>
            <p className="text-muted-foreground mb-6 text-base md:text-lg">
              Kontaktieren Sie uns jetzt für ein kostenloses und unverbindliches
              Angebot. Wir sind für Sie da!
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href={`tel:${businessInfo.phone}`}
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                onClick={() => {
                  if (typeof window !== "undefined" && window.gtag) {
                    window.gtag("event", "phone_click", {
                      event_category: "contact",
                      event_label: "cta_section",
                    });
                  }
                }}
              >
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">{businessInfo.phone}</span>
              </a>
              <a
                href={`mailto:${businessInfo.email}`}
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">{businessInfo.email}</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span>
                  {businessInfo.address.city}, {businessInfo.address.state}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/kontakt">
                <Button
                  size="lg"
                  className="btn-primary shimmer pulse-cta px-8 py-6 rounded-xl w-full sm:w-auto"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.gtag) {
                      window.gtag("event", "cta_click", {
                        event_category: "conversion",
                        event_label: "contact_page",
                      });
                    }
                  }}
                >
                  Jetzt anfragen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Info Card */}
          <div className="glass-card rounded-2xl md:rounded-3xl p-6 md:p-8">
            <h3 className="font-bold text-lg md:text-xl mb-4">
              Öffnungszeiten
            </h3>
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Täglich</span>
                <span className="font-medium">08:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Auch am Wochenende</span>
                <span className="font-medium text-primary">Verfügbar</span>
              </div>
            </div>

            <div className="border-t border-border mt-6 pt-6">
              <h3 className="font-bold text-lg md:text-xl mb-4">
                Schnelle Anfrage
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Schreiben Sie uns direkt per WhatsApp für eine schnelle Antwort.
              </p>
              <a
                href={`https://wa.me/${businessInfo.whatsapp}?text=Hallo, ich interessiere mich für Ihre Dienstleistungen.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#20bd5a] transition-colors"
                onClick={() => {
                  if (typeof window !== "undefined" && window.gtag) {
                    window.gtag("event", "whatsapp_click", {
                      event_category: "contact",
                      event_label: "cta_section",
                    });
                  }
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp schreiben
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
