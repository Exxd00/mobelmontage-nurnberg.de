import type { Metadata, Viewport } from "next";
import { businessInfo } from "@/lib/data";
import CookieConsent from "@/components/CookieConsent";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import "./globals.css";

const site = "https://mobelmontage-nurnberg.de";
const title = "Möbelmontage und Küchenmontage in Nürnberg";
const description = "Möbel aufbauen lassen, eine Küche montieren oder Möbel liefern lassen. Entdecken Sie Küchenprojekte und stellen Sie Ihre Anfrage in Nürnberg und Umgebung.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f0" },
    { media: "(prefers-color-scheme: dark)", color: "#172e27" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: title, template: "%s | Möbelmontage Nürnberg" },
  description,
  alternates: { canonical: "./" },
  applicationName: businessInfo.displayName,
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192x192.png", sizes: "192x192" }],
  },
  openGraph: {
    type: "website", locale: "de_DE", siteName: businessInfo.displayName, title, description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Weiße Messeküche mit beleuchteten Glasvitrinen" }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.jpg"] },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

const business = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": site + "/#betrieb",
  name: businessInfo.displayName,
  legalName: businessInfo.name,
  url: site,
  image: site + "/og-image.jpg",
  telephone: businessInfo.phone,
  email: businessInfo.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: businessInfo.address.street,
    postalCode: businessInfo.address.zip,
    addressLocality: businessInfo.address.city,
    addressRegion: businessInfo.address.state,
    addressCountry: "DE",
  },
  openingHours: "Mo-Su 08:00-22:00",
  areaServed: ["Nürnberg", "Fürth", "Erlangen", "Schwabach"],
};

const setTheme = "try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch{}";
const registerOffline = "if('serviceWorker' in navigator)window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})},{once:true})";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setTheme }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, "\\u003c") }} />
      </head>
      <body className="antialiased">
        <a className="skip-link" href="#main-content">Zum Hauptinhalt springen</a>
        {children}
        <CookieConsent />
        <AnalyticsProvider />
        {process.env.NODE_ENV === "production" && <script dangerouslySetInnerHTML={{ __html: registerOffline }} />}
      </body>
    </html>
  );
}
