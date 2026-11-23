import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import {
  cityServices,
  directoryCities,
  serviceList,
  siteOrigin,
} from "@/lib/service-directory";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/leistungen",
    "/staedte",
    "/arbeiten",
    "/impressum",
    "/datenschutz",
    ...projects.map((project) => `/arbeiten/${project.slug}`),
    ...serviceList.map((s) => `/service/${s.slug}`),
    ...directoryCities.map((city) => `/${city.slug}`),
    ...directoryCities.flatMap((city) =>
      cityServices(city).map((s) => `/${city.slug}/${s.slug}`),
    ),
  ];
  return paths.map((path) => ({ url: new URL(path, siteOrigin).href }));
}
