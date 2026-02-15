import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Phone, CheckCircle, MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";
import ContactForm from "@/components/sections/ContactForm";
import { services, getAllServices, cities, businessInfo } from "@/lib/data";

interface ServicePageProps {
  params: Promise<{ serviceSlug: string }>;
}

export async function generateStaticParams() {
  const allServices = getAllServices();
  return allServices.map((service) => ({
    serviceSlug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { serviceSlug } = await params;
  const allServices = getAllServices();
  const service = allServices.find((s) => s.slug === serviceSlug);

  if (!service) {
    return {
      title: "Leistung nicht gefunden",
    };
  }

  return {
    title: `${service.name} Nürnberg - Professioneller Service`,
    description: `${service.name} in Nürnberg und Umgebung. Professionell, schnell und zuverlässig. Jetzt kostenlos anfragen!`,
    alternates: {
      canonical: `https://mobelmontage-nurnberg.de/service/${service.slug}`,
    },
    openGraph: {
      title: `${service.name} Nürnberg - Professioneller Service`,
      description: `${service.name} in Nürnberg und Umgebung. Professionell, schnell und zuverlässig.`,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceSlug } = await params;
  const allServices = getAllServices();
  const serviceData = allServices.find((s) => s.slug === serviceSlug);

  if (!serviceData) {
    notFound();
  }

  // Find the main service
  const mainService = services.find((s) => s.id === serviceData.parentId);
  const mainCities = cities.filter((c) => c.isMain).slice(0, 8);
  const relatedServices = allServices
    .filter((s) => s.parentId === serviceData.parentId && s.slug !== serviceSlug)
    .slice(0, 8);

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceData.name,
    description: `${serviceData.name} in Nürnberg und Umgebung`,
    provider: {
      "@type": "LocalBusiness",
      name: businessInfo.name,
      telephone: businessInfo.phone,
    },
    areaServed: {
      "@type": "State",
      name: "Bayern",
    },
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
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li>
                <Link
                  href="/leistungen"
                  className="text-muted-foreground hover:text-primary"
                >
                  Leistungen
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="text-foreground font-medium">{serviceData.name}</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 badge-primary mb-4">
              <span>{serviceData.parentName}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gradient-animate">{serviceData.name}</span>
              <br />
              <span className="text-2xl md:text-3xl text-muted-foreground">
                in Nürnberg und Umgebung
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              Professionelle {serviceData.name} von erfahrenen Experten. Schnell,
              zuverlässig und zu fairen Preisen.
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

          {/* Features */}
          {mainService && (
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Was wir bieten
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {mainService.features.map((feature) => (
                  <div
                    key={feature}
                    className="glass-card rounded-xl p-4 flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Available cities */}
          <section className="mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              {serviceData.name} in diesen Städten
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
              {mainCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}/${serviceSlug}`}
                  className="glass-card rounded-lg p-3 md:p-4 card-hover group"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {serviceData.name} {city.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link
                href="/staedte"
                className="text-primary hover:underline text-sm font-medium"
              >
                Alle Städte anzeigen →
              </Link>
            </div>
          </section>

          {/* Contact Form */}
          <ContactForm />

          {/* Related services */}
          {relatedServices.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl md:text-2xl font-bold mb-6">
                Ähnliche Leistungen
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                {relatedServices.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/service/${related.slug}`}
                    className="glass-card rounded-lg p-3 md:p-4 card-hover text-center"
                  >
                    <span className="text-sm font-medium hover:text-primary transition-colors">
                      {related.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
