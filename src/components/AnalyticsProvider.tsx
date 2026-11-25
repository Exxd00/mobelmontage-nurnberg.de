"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { consentChanged, consentKey, getCookieChoice, hasAnalyticsConsent, isPublicAnalyticsPage } from "@/lib/consent";
import { clearAttribution, initTracking } from "@/lib/tracking";
import { initScrollTracking, initTimeTracking, trackCityView, trackServiceView, trackEvent } from "@/lib/analytics";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-L3LZL8MWC4";
const reservedPaths = new Set(["kontakt", "leistungen", "arbeiten", "impressum", "datenschutz", "staedte", "admin", "thank-you", "firmenkunden", "rueckruf"]);
let tagStarted = false;

function applyConsent(enabled: boolean) {
  Reflect.set(window, "ga-disable-" + measurementId, !enabled);
  if (!enabled) {
    // An operator page pauses measurement without revoking a public-site choice.
    if (getCookieChoice() === "accepted") return;
    clearAttribution();
    for (const entry of document.cookie.split(";")) {
      const name = entry.split("=")[0].trim();
      if (!/^(_ga($|_)|_gid$|_fbp$)/.test(name)) continue;
      const expired = name + "=; Max-Age=0; path=/; SameSite=Lax";
      document.cookie = expired;
      document.cookie = expired + "; Domain=" + location.hostname;
      if (location.hostname.endsWith(".mobelmontage-nurnberg.de")) {
        document.cookie = expired + "; Domain=mobelmontage-nurnberg.de";
      }
    }
    return;
  }
  if (!measurementId || tagStarted) return;
  tagStarted = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params -- Google's gtag loader expects an Arguments object, not an array command.
    if (hasAnalyticsConsent()) window.dataLayer?.push(arguments);
  };
  window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.gtag("js", new Date());
  // One tag configuration per document. GA4 handles history changes with enhanced measurement.
  window.gtag("config", measurementId, { allow_google_signals: false, allow_ad_personalization_signals: false });
  const tag = document.createElement("script");
  tag.async = true;
  tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(tag);
}

export default function AnalyticsProvider({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const customerPage = isPublicAnalyticsPage(pathname);
  const [enabled, setEnabled] = useState(false);
  const previousPath = useRef("");
  useEffect(() => {
    function sync() {
      const allowed = hasAnalyticsConsent();
      applyConsent(allowed);
      setEnabled(allowed);
    }
    function syncFromOtherTab(event: StorageEvent) {
      if (event.key === consentKey || event.key === null) sync();
    }
    sync();
    window.addEventListener(consentChanged, sync);
    window.addEventListener("storage", syncFromOtherTab);
    return () => {
      window.removeEventListener(consentChanged, sync);
      window.removeEventListener("storage", syncFromOtherTab);
    };
  }, [customerPage]);

  useEffect(() => {
    if (!enabled || !customerPage) { previousPath.current = ""; return; }
    if (previousPath.current !== pathname) {
      initTracking();
      if (pathname.startsWith("/service/")) trackServiceView(pathname.slice("/service/".length));
      const city = pathname.match(/^\/([a-z-]+)$/)?.[1];
      if (city && !reservedPaths.has(city)) trackCityView(city);
      previousPath.current = pathname;
    }
    const stopScroll = initScrollTracking();
    const stopTimer = initTimeTracking();
    function contactLinkClick(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || event.defaultPrevented) return;
      const section = link.closest("header,footer,main")?.tagName.toLowerCase() || "page";
      if (link.dataset.intent) trackEvent({ action: "cta_click", category: "navigation", label: link.dataset.intent, customParams: { origin_page: pathname } });
      if (link.protocol === "mailto:") trackEvent({ action: "email_click", category: "contact", label: section });
    }
    document.addEventListener("click", contactLinkClick, true);
    return () => {
      stopScroll?.();
      stopTimer?.();
      document.removeEventListener("click", contactLinkClick, true);
    };
  }, [enabled, pathname, customerPage]);

  return <>{children}</>;
}
