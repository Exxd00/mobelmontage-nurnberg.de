import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight, Phone, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";
import ContactForm from "@/components/sections/ContactForm";
import { cities, services, businessInfo } from "@/lib/data";

interface CityPageProps {
  params: Promise<{ citySlug: string }>;
}

export async function generateStaticParams() {
  return cities.map((city) => ({
    citySlug: city.slug,
  }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const city = cities.find((c) => c.slug === citySlug);

  if (!city) {
    return {
      title: "Stadt nicht gefunden",
    };
  }

  return {
    title: `Möbelmontage ${city.name} - IKEA Montage & Küchenmontage`,
    description: `Professionelle Möbelmontage in ${city.name}. IKEA Montage, Küchenmontage, Lieferservice. Schnell, zuverlässig, fair. Jetzt kostenlos anfragen!`,
    alternates: {
      canonical: `https://mobelmontage-nurnberg.de/${city.slug}`,
    },
    openGraph: {
      title: `Möbelmontage ${city.name} - IKEA Montage & Küchenmontage`,
      description: `Professionelle Möbelmontage in ${city.name}. IKEA Montage, Küchenmontage, Lieferservice.`,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { citySlug } = await params;
  const city = cities.find((c) => c.slug === citySlug);

  if (!city) {
    notFound();
  }

  // JSON-LD for local business in this city
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Möbelmontage ${city.name}`,
    description: `Professionelle Möbelmontage in ${city.name}`,
    areaServed: {
      "@type": "City",
      name: city.name,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: "Bayern",
      addressCountry: "DE",
    },
    telephone: businessInfo.phone,
    email: businessInfo.email,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />
      <main className="pt-24 pb-16">
        <div className="container-max">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 badge-primary mb-4">
              <MapPin className="w-4 h-4" />
              <span>{city.region}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Möbelmontage in{" "}
              <span className="text-gradient-animate">{city.name}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              Professionelle Möbelmontage, Küchenmontage und Lieferservice in{" "}
              {city.name} und Umgebung. IKEA Spezialist mit über{" "}
              {businessInfo.stats.yearsExperience} Jahren Erfahrung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${businessInfo.phone}`}
                className="inline-flex items-center justify-center gap-2 btn-primary px-6 py-3 rounded-xl font-medium"
              >
                <Phone className="w-5 h-5" />
                Jetzt anrufen
              </a>
              <Link
                href="#kontakt-form"
                className="inline-flex items-center justify-center gap-2 btn-outline px-6 py-3 rounded-xl font-medium"
              >
                Kostenlos anfragen
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Services in this city */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Unsere Leistungen in {city.name}
            </h2>
            <div className="grid grid-cols-3 gap-3 md:gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/${city.slug}/${service.slug}`}
                  className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 card-hover group text-center"
                >
                  <h3 className="font-bold text-sm md:text-lg mb-2 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                    {service.name} in {city.name}
                  </p>
                  <ul className="mt-3 space-y-1 text-left hidden md:block">
                    {service.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                        <span className="truncate">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </section>

          {/* Why choose us in this city */}
          <section className="mb-12 bg-muted/50 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Warum {businessInfo.name} in {city.name}?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: `${businessInfo.stats.yearsExperience}+`, label: "Jahre Erfahrung" },
                { value: "100%", label: "Zufriedenheit" },
                { value: "24h", label: "Antwortzeit" },
                { value: "Faire", label: "Festpreise" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Form */}
          <ContactForm />

          {/* Related cities */}
          <section className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              Weitere Städte in der Nähe
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
              {cities
                .filter((c) => c.region === city.region && c.slug !== city.slug)
                .slice(0, 12)
                .map((nearbyCity) => (
                  <Link
                    key={nearbyCity.slug}
                    href={`/${nearbyCity.slug}`}
                    className="glass-card rounded-lg p-3 card-hover text-center"
                  >
                    <span className="text-sm font-medium hover:text-primary transition-colors">
                      {nearbyCity.name}
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
