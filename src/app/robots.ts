import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/thank-you", "/api/", "/admin/"],
    },
    sitemap: "https://mobelmontage-nurnberg.de/sitemap.xml",
  };
}
