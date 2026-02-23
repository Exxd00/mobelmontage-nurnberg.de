import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";
import ContactForm from "@/components/sections/ContactForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { businessInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kontakt - Kostenlose Anfrage",
  description:
    "Kontaktieren Sie Möbelmontage Nürnberg für ein kostenloses Angebot. Telefon, WhatsApp oder Kontaktformular - wir sind für Sie da!",
  alternates: {
    canonical: "https://mobelmontage-nurnberg.de/kontakt",
  },
};

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main className="pb-16" style={{ paddingTop: 'calc(6rem + env(safe-area-inset-top, 0px))' }}>
        <div className="container-max">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Kontaktieren Sie uns
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Haben Sie Fragen oder möchten ein Angebot? Wir sind für Sie da!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-bold text-xl mb-4">Kontaktdaten</h2>
                <div className="space-y-4">
                  <a
                    href={`tel:${businessInfo.phone}`}
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <p className="font-medium">{businessInfo.phone}</p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${businessInfo.email}`}
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">E-Mail</p>
                      <p className="font-medium">{businessInfo.email}</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Adresse</p>
                      <p className="font-medium">
                        {businessInfo.address.city}, {businessInfo.address.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-bold text-xl mb-4">Öffnungszeiten</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>{businessInfo.workingHours.daily}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm compact />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
