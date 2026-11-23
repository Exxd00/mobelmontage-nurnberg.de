import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UnlistedArea } from "@/components/service/Directory";
import ServiceDetail from "@/components/service/ServiceDetail";
import { legacyCitySlugs } from "@/lib/legacy-city-slugs";
import {
  cityServices,
  directoryCities,
  findCity,
  pageMetadata,
  findService,
} from "@/lib/service-directory";
import { serviceIntro } from "@/lib/service-guide";

type Props = { params: Promise<{ citySlug: string; serviceSlug: string }> };

export function generateStaticParams() {
  return directoryCities.flatMap((city) =>
    cityServices(city).map((service) => ({
      citySlug: city.slug,
      serviceSlug: service.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { citySlug, serviceSlug } = await params;
  const city = findCity(citySlug);
  const service = findService(serviceSlug);
  if (!service) notFound();
  if (!city) {
    if (!legacyCitySlugs.has(citySlug)) notFound();
    return {
      ...pageMetadata(
        "Einsatzort prüfen | Möbelmontage Nürnberg",
        "Postleitzahl und Vorhaben für eine individuelle Anfrage angeben.",
        `/${citySlug}/${service.slug}`,
      ),
      robots: { index: false, follow: true },
    };
  }
  return pageMetadata(
    `${service.name} in ${city.name} | Angebot für Ihren Einsatzort`,
    `${service.name} in ${city.name}. ${serviceIntro(service)}`,
    `/${city.slug}/${service.slug}`,
  );
}

export default async function CityServicePage({ params }: Props) {
  const { citySlug, serviceSlug } = await params;
  const service = findService(serviceSlug);
  if (!service) notFound();
  const city = findCity(citySlug);
  if (!city) {
    if (!legacyCitySlugs.has(citySlug)) notFound();
    return <UnlistedArea />;
  }
  return <ServiceDetail city={city} service={service} />;
}
