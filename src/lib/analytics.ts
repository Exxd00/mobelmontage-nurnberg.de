/**
 * Analytics & Lead Tracking Utility
 * Google Analytics 4 and confirmed contact actions.
 */

import { getTrackingData } from './tracking';
import { hasAnalyticsConsent } from './consent';

// Send event to Google Sheets via API
// Only called for confirmed actions: phone_call, whatsapp, form
async function sendToGoogleSheets(
  eventType: 'phone_call' | 'whatsapp' | 'form',
  source: string,
  phoneNumber?: string
): Promise<void> {
  if (!hasAnalyticsConsent()) return;
  try {
    // Get tracking data
    const tracking = getTrackingData();

    await fetch('/api/track-event', {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        source,
        phoneNumber,
        // Tracking data
        gclid: tracking.gclid,
        trafficSource: tracking.source,
        page: tracking.page,
      }),
    });
  } catch (error) {
    console.error('Failed to send event to Google Sheets:', error);
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Event types for type safety
export type EventCategory =
  | 'contact'
  | 'engagement'
  | 'navigation'
  | 'conversion'
  | 'lead';

export type EventAction =
  | 'form_submit'
  | 'form_start'
  | 'phone_click'
  | 'phone_confirmed'
  | 'phone_cancelled'
  | 'whatsapp_click'
  | 'whatsapp_confirmed'
  | 'whatsapp_cancelled'
  | 'email_click'
  | 'cta_click'
  | 'service_view'
  | 'city_view'
  | 'scroll_depth'
  | 'time_on_page'
  | 'lead_generated';

interface TrackEventParams {
  action: EventAction;
  category: EventCategory;
  label?: string;
  value?: number;
  customParams?: Record<string, unknown>;
}

interface TrackLeadParams {
  source: string;
  service?: string;
  city?: string;
  phone?: string;
  email?: string;
  value?: number;
}

// Track general events
export function trackEvent({ action, category, label, value, customParams }: TrackEventParams): void {
  if (!hasAnalyticsConsent()) return;
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...customParams,
    });
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Event tracked:', { action, category, label, value, customParams });
  }
}

// Track lead generation
export function trackLead({ source, service, city, phone, email, value }: TrackLeadParams): void {
  if (!hasAnalyticsConsent()) return;
  window.gtag?.('event', 'generate_lead', {
    lead_source: source,
    service_type: service,
    city,
    has_phone: !!phone,
    has_email: !!email,
    ...(value === undefined ? {} : { value, currency: 'EUR' }),
  });
}

// Track phone call clicks (GA4 only, no Google Sheets)
export function trackPhoneClick(phoneNumber: string, source: string): void {
  trackEvent({
    action: 'phone_click',
    category: 'contact',
    label: source,
    customParams: {
      phone_number: phoneNumber,
      click_source: source,
    },
  });
}

// Track WhatsApp clicks (GA4 only, no Google Sheets)
export function trackWhatsAppClick(source: string): void {
  trackEvent({
    action: 'whatsapp_click',
    category: 'contact',
    label: source,
  });
}

// Track WhatsApp confirmation - SENDS TO GOOGLE SHEETS
export function trackWhatsAppConfirmed(source: string): void {
  trackEvent({
    action: 'whatsapp_confirmed',
    category: 'conversion',
    label: source,
  });

  // Send to Google Sheets as 'whatsapp' event type
  sendToGoogleSheets('whatsapp', source);

  trackLead({ source: 'whatsapp' });
}

// Track WhatsApp cancellation (GA4 only, no Google Sheets)
export function trackWhatsAppCancelled(source: string): void {
  trackEvent({
    action: 'whatsapp_cancelled',
    category: 'engagement',
    label: source,
  });
}

// Track phone confirmation - SENDS TO GOOGLE SHEETS
export function trackPhoneConfirmed(phoneNumber: string, source: string): void {
  trackEvent({
    action: 'phone_confirmed',
    category: 'conversion',
    label: source,
    customParams: {
      phone_number: phoneNumber,
      click_source: source,
    },
  });

  // Send to Google Sheets as 'phone_call' event type
  sendToGoogleSheets('phone_call', source, phoneNumber);

  trackLead({ source: 'phone_call' });
}

// Track phone cancellation (GA4 only, no Google Sheets)
export function trackPhoneCancelled(source: string): void {
  trackEvent({
    action: 'phone_cancelled',
    category: 'engagement',
    label: source,
  });
}

// Track CTA button clicks
export function trackCTAClick(ctaName: string, location: string): void {
  trackEvent({
    action: 'cta_click',
    category: 'engagement',
    label: `${ctaName} - ${location}`,
  });
}

// Track form interactions
export function trackFormStart(formName: string): void {
  trackEvent({
    action: 'form_start',
    category: 'engagement',
    label: formName,
  });
}

export function trackFormSubmit(formName: string, service?: string, city?: string): void {
  trackEvent({
    action: 'form_submit',
    category: 'conversion',
    label: formName,
    customParams: {
      service_type: service,
      city: city,
    },
  });
}

// Track page/service views
export function trackServiceView(serviceName: string): void {
  trackEvent({
    action: 'service_view',
    category: 'engagement',
    label: serviceName,
  });
}

export function trackCityView(cityName: string): void {
  trackEvent({
    action: 'city_view',
    category: 'engagement',
    label: cityName,
  });
}

// Track scroll depth
export function trackScrollDepth(percentage: number): void {
  if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
    trackEvent({
      action: 'scroll_depth',
      category: 'engagement',
      label: `${percentage}%`,
      value: percentage,
    });
  }
}

// Initialize scroll tracking
export function initScrollTracking() {
  if (typeof window === 'undefined') return;

  let maxScroll = 0;
  const thresholds = [25, 50, 75, 100];
  const tracked = new Set<number>();

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;

      for (const threshold of thresholds) {
        if (scrollPercent >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          trackScrollDepth(threshold);
        }
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}

// Initialize time on page tracking
export function initTimeTracking() {
  if (typeof window === 'undefined') return;

  const startTime = Date.now();
  const intervals = [30, 60, 120, 300]; // seconds
  const tracked = new Set<number>();

  const checkTime = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);

    for (const interval of intervals) {
      if (elapsed >= interval && !tracked.has(interval)) {
        tracked.add(interval);
        trackEvent({
          action: 'time_on_page',
          category: 'engagement',
          label: `${interval}s`,
          value: interval,
        });
      }
    }
  };

  const timer = window.setInterval(checkTime, 5000);
  return () => window.clearInterval(timer);
}
