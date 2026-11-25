import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UnlistedArea } from "@/components/service/Directory";
import ServiceDetail from "@/components/service/ServiceDetail";
import { legacyCitySlugs, legacyLabel } from "@/lib/legacy-city-slugs";
import {
  cityServices,
  directoryCities,
  findCity,
  localServiceGuide,
  pageMetadata,
  findService,
} from "@/lib/service-directory";
import { serviceIntro } from "@/lib/service-guide";

type Props = { params: Promise<{ citySlug: string; serviceSlug: string }> };

export function generateStaticParams() {
  return directoryCities.flatMap((city) => cityServices(city).map((service) => ({
    citySlug: city.slug, serviceSlug: service.slug,
  })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { citySlug, serviceSlug } = await params;
  const city = findCity(citySlug);
  const service = findService(serviceSlug);
  if (!service) notFound();
  if (!city) {
    if (!legacyCitySlugs.has(citySlug)) notFound();
    const label = legacyLabel(citySlug);
    const metadata = pageMetadata(
      `${service.name} anfragen – Ortsangabe ${label}`,
      `${service.name} zur Ortsangabe „${label}“ anfragen. Die Verfügbarkeit prüfen wir anhand von Gemeinde, Postleitzahl und Auftragsumfang.`,
      `/${citySlug}/${service.slug}`,
    );
    return { ...metadata, robots: { index: false, follow: true } };
  }
  const guide = localServiceGuide(city, service);
  return pageMetadata(
    guide?.title ?? `${service.name} in ${city.name} | Angebot für Ihren Einsatzort`,
    guide?.description ?? `${service.name} in ${city.name}. ${serviceIntro(service)}`,
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
    return <UnlistedArea citySlug={citySlug} service={service} />;
  }
  return <ServiceDetail city={city} service={service} />;
}
