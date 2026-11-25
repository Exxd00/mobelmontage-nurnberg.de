import type { Metadata } from "next";

export const siteOrigin = "https://mobelmontage-nurnberg.de";

const siteImage = {
  url: new URL("/og-image.jpg", siteOrigin).href,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Weiße Messeküche mit beleuchteten Glasvitrinen",
};

// Only use JPEG crops that ship with this site. New photographs can use the site card until a crop is available.
const previewWidths: Record<string, number> = {
  "/projekte/kueche-mit-holzinsel/hero-1080.webp": 1080,
  "/projekte/gruene-winkelkueche/hero-1080.webp": 1080,
  "/projekte/dunkle-inselkueche/hero-1080.webp": 1080,
  "/projekte/kueche-mit-holzinsel/regal.webp": 720,
  "/projekte/weisse-messekueche/vorher.webp": 720,
  "/projekte/weisse-messekueche/spuelzeile-nachher.webp": 720,
};

export function projectShareImage(src: string, alt: string) {
  if (src === "/projekte/weisse-messekueche/hero-1080.webp") return { ...siteImage, alt };
  const width = previewWidths[src];
  if (!width) return siteImage;
  return {
    url: new URL(src.replace(/\.webp$/, "-vorschau.jpg"), siteOrigin).href,
    width, height: width * 0.525, type: "image/jpeg", alt,
  };
}

export function pageMetadata(title: string, description: string, path: string, image = siteImage): Metadata {
  const url = new URL(path, siteOrigin).href;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, type: "website", locale: "de_DE",
      siteName: "Möbelmontage Nürnberg", images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
