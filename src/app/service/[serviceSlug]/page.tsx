import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetail from "@/components/service/ServiceDetail";
import { findService, pageMetadata, serviceList } from "@/lib/service-directory";
import { serviceIntro } from "@/lib/service-guide";

type Props = { params: Promise<{ serviceSlug: string }> };

export function generateStaticParams() {
  return serviceList.map((service) => ({ serviceSlug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceSlug } = await params;
  const service = findService(serviceSlug);
  if (!service) notFound();
  return pageMetadata(
    `${service.name} – Leistungen und Ablauf | Möbelmontage Nürnberg`,
    serviceIntro(service),
    `/service/${service.slug}`,
  );
}

export default async function ServicePage({ params }: Props) {
  const { serviceSlug } = await params;
  const service = findService(serviceSlug);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}
