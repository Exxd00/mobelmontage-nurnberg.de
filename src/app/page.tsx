"use client";

import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";

// Lazy load below-the-fold sections - SSR: false for faster initial load
const FloatingButtons = dynamic(() => import("@/components/layout/FloatingButtons"), {
  ssr: false,
});

const CookieConsent = dynamic(() => import("@/components/CookieConsent"), {
  ssr: false,
});

const TrustSection = dynamic(() => import("@/components/sections/TrustSection"), {
  ssr: false,
  loading: () => <div className="h-48 bg-muted/30 animate-pulse rounded-2xl mx-4" />,
});

const ContactForm = dynamic(() => import("@/components/sections/ContactForm"), {
  ssr: false,
  loading: () => <div className="h-96 bg-muted/30 animate-pulse rounded-2xl mx-4" />,
});

const HowWeWork = dynamic(() => import("@/components/sections/HowWeWork"), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted/30 animate-pulse rounded-2xl mx-4" />,
});

const WhyUs = dynamic(() => import("@/components/sections/WhyUs"), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted/30 animate-pulse rounded-2xl mx-4" />,
});

const FAQSection = dynamic(() => import("@/components/sections/FAQSection"), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted/30 animate-pulse rounded-2xl mx-4" />,
});

const Testimonials = dynamic(() => import("@/components/sections/Testimonials"), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted/30 animate-pulse rounded-2xl mx-4" />,
});

const Gallery = dynamic(() => import("@/components/sections/Gallery"), {
  ssr: false,
  loading: () => <div className="h-96 bg-muted/30 animate-pulse rounded-2xl mx-4" />,
});

const CTASection = dynamic(() => import("@/components/sections/CTASection"), {
  ssr: false,
  loading: () => <div className="h-64 bg-muted/30 animate-pulse rounded-2xl mx-4" />,
});

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* 1. Hero Section - Critical, loaded immediately */}
        <HeroSection />

        {/* 2. Trust Section (Statistics + Partner Logos) */}
        <TrustSection />

        {/* 3. Contact Form */}
        <ContactForm />

        {/* 4. How We Work */}
        <HowWeWork />

        {/* 5. Why Choose Us */}
        <WhyUs />

        {/* 6. FAQ Section - New */}
        <FAQSection />

        {/* 7. Testimonials */}
        <Testimonials />

        {/* 8. Gallery */}
        <Gallery />

        {/* 9. CTA Section with Contact Info */}
        <CTASection />
      </main>
      <Footer />
      <FloatingButtons />
      <CookieConsent />
    </>
  );
}
