import type { Metadata } from "next";
import { cities, getAllServices } from "./data";

export const siteOrigin = "https://mobelmontage-nurnberg.de";
export type City = (typeof cities)[number];
export type Service = ReturnType<typeof getAllServices>[number];

const bySlug = new Map<string, City>();
for (const city of cities) {
  if (!bySlug.has(city.slug)) bySlug.set(city.slug, city);
}

export const directoryCities = [...bySlug.values()];
export const mainCities = directoryCities.filter((city) => city.isMain);
export const serviceList = getAllServices();

export function findService(segment: string) {
  // Next can supply percent-encoded segments when prerendering a non-ASCII slug.
  try {
    const slug = decodeURIComponent(segment);
    return serviceList.find((service) => service.slug === slug);
  } catch {
    return undefined;
  }
}

export function findCity(slug: string) {
  return bySlug.get(slug);
}

export function cityServices(city: City) {
  return city.isMain
    ? serviceList
    : serviceList.filter((item) => item.slug === item.parentId);
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = new URL(path, siteOrigin).href;
  const image = {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "Weiße Küche mit beleuchteten Glasvitrinen",
  };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "de_DE",
      siteName: "Möbelmontage Nürnberg",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
