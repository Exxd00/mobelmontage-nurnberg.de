import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

// Viewport configuration for PWA and WebView
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f97316" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  viewportFit: "cover", // For notch devices
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mobelmontage-nurnberg.de"),
  title: {
    default: "Möbelmontage Nürnberg - Professionelle IKEA Montage & Küchenmontage",
    template: "%s | Möbelmontage Nürnberg",
  },
  description:
    "Professionelle Möbelmontage in Nürnberg und Umgebung. IKEA Montage, Küchenmontage, Lieferservice. Schnell, zuverlässig, fair. Jetzt kostenlos anfragen!",
  keywords: [
    "Möbelmontage Nürnberg",
    "IKEA Montage Nürnberg",
    "Küchenmontage Nürnberg",
    "Möbelaufbau Nürnberg",
    "IKEA Küche montieren",
    "PAX Schrank Montage",
    "Möbel Lieferung Nürnberg",
    "Möbelmontage Fürth",
    "Möbelmontage Erlangen",
  ],
  authors: [{ name: "Möbelmontage Nürnberg" }],
  creator: "Möbelmontage Nürnberg",
  publisher: "Möbelmontage Nürnberg",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Möbelmontage",
  },
  applicationName: "Möbelmontage Nürnberg",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://mobelmontage-nurnberg.de",
    siteName: "Möbelmontage Nürnberg",
    title: "Möbelmontage Nürnberg - Professionelle IKEA Montage & Küchenmontage",
    description:
      "Professionelle Möbelmontage in Nürnberg und Umgebung. IKEA Montage, Küchenmontage, Lieferservice. Schnell, zuverlässig, fair.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Möbelmontage Nürnberg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Möbelmontage Nürnberg - Professionelle IKEA Montage & Küchenmontage",
    description:
      "Professionelle Möbelmontage in Nürnberg und Umgebung. IKEA Montage, Küchenmontage, Lieferservice.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://mobelmontage-nurnberg.de",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
    "msapplication-TileColor": "#f97316",
    "msapplication-tap-highlight": "no",
  },
};

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Möbelmontage Nürnberg",
  image: "https://mobelmontage-nurnberg.de/og-image.jpg",
  "@id": "https://mobelmontage-nurnberg.de",
  url: "https://mobelmontage-nurnberg.de",
  telephone: "+49 176 20126149",
  email: "info@mobelmontage-nurnberg.de",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hauptstraße 123",
    addressLocality: "Nürnberg",
    addressRegion: "Bayern",
    postalCode: "90402",
    addressCountry: "DE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 49.4521,
    longitude: 11.0767,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "22:00",
    },
  ],
  sameAs: [],
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "500",
  },
  areaServed: [
    { "@type": "City", name: "Nürnberg" },
    { "@type": "City", name: "Fürth" },
    { "@type": "City", name: "Erlangen" },
    { "@type": "City", name: "Schwabach" },
    { "@type": "State", name: "Bayern" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Möbelmontage Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Möbelmontage",
          description: "Professioneller Aufbau aller Möbelarten",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Küchenmontage",
          description: "Komplette Kücheninstallation inkl. Geräte",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Lieferungen",
          description: "Transport und Lieferung von Möbeln",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Minimal Critical CSS - Inline for faster first paint */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root{--primary:24 95% 53%;--background:0 0% 100%;--foreground:20 10% 10%}
          .dark{--background:20 14% 8%;--foreground:30 20% 98%}
          html{overflow-y:scroll;visibility:visible}
          body{margin:0;background:hsl(var(--background));color:hsl(var(--foreground));font-family:var(--font-inter),system-ui,sans-serif}
          /* Safe area insets for notch devices */
          body{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}
        `}} />

        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-L3LZL8MWC4" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-L3LZL8MWC4', {
                page_title: document.title,
                page_location: window.location.href,
                send_page_view: true
              });
              // Track page load timing
              window.addEventListener('load', function() {
                setTimeout(function() {
                  var timing = performance.timing;
                  var loadTime = timing.loadEventEnd - timing.navigationStart;
                  gtag('event', 'page_load_time', {
                    event_category: 'Performance',
                    value: loadTime
                  });
                }, 0);
              });
            `,
          }}
        />

        {/* Facebook Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_PIXEL_ID');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* DNS Prefetch for essential resources */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Favicon & PWA Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />

        {/* Splash screens for iOS */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />

        {/* WebView / Hybrid App Meta */}
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className={`antialiased ${inter.className}`}>
        {/* Theme initialization script - runs before React hydration to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered:', registration.scope);
                  }).catch(function(error) {
                    console.log('SW registration failed:', error);
                  });
                });
              }
            `,
          }}
        />

        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Zum Hauptinhalt springen
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
