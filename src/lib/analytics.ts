// Analytics & Lead Tracking Utility
// Supports Google Analytics 4, Facebook Pixel, and custom events

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
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
  | 'whatsapp_click'
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
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...customParams,
    });
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    const fbEvent = mapToFacebookEvent(action);
    if (fbEvent) {
      window.fbq('track', fbEvent, {
        content_category: category,
        content_name: label,
        value: value,
        ...customParams,
      });
    }
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Event tracked:', { action, category, label, value, customParams });
  }
}

// Track lead generation
export function trackLead({ source, service, city, phone, email, value }: TrackLeadParams): void {
  const leadData = {
    lead_source: source,
    service_type: service,
    city: city,
    has_phone: !!phone,
    has_email: !!email,
    estimated_value: value || 59, // Default minimum value
    timestamp: new Date().toISOString(),
  };

  // Google Analytics 4 - Lead event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      currency: 'EUR',
      value: value || 59,
      ...leadData,
    });
  }

  // Facebook Pixel - Lead event
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: service || 'General Inquiry',
      content_category: source,
      value: value || 59,
      currency: 'EUR',
    });
  }

  // Store lead in localStorage for retargeting
  try {
    const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    existingLeads.push(leadData);
    localStorage.setItem('leads', JSON.stringify(existingLeads.slice(-10))); // Keep last 10
  } catch {
    // Ignore storage errors
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 Lead tracked:', leadData);
  }
}

// Track phone call clicks
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

  // Also track as conversion
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual conversion ID
      value: 30,
      currency: 'EUR',
    });
  }
}

// Track WhatsApp clicks
export function trackWhatsAppClick(source: string): void {
  trackEvent({
    action: 'whatsapp_click',
    category: 'contact',
    label: source,
  });

  trackLead({
    source: 'whatsapp',
    value: 40,
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

  trackLead({
    source: formName,
    service: service,
    city: city,
    value: getServiceValue(service),
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

// Helper: Map events to Facebook standard events
function mapToFacebookEvent(action: EventAction): string | null {
  const mapping: Partial<Record<EventAction, string>> = {
    form_submit: 'Lead',
    phone_click: 'Contact',
    whatsapp_click: 'Contact',
    cta_click: 'InitiateCheckout',
    service_view: 'ViewContent',
  };
  return mapping[action] || null;
}

// Helper: Get estimated service value
function getServiceValue(service?: string): number {
  if (!service) return 59;

  const values: Record<string, number> = {
    lieferungen: 39,
    moebelmontage: 89,
    kuechenmontage: 249,
  };

  return values[service] || 59;
}

// Initialize scroll tracking
export function initScrollTracking(): void {
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
}

// Initialize time on page tracking
export function initTimeTracking(): void {
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

  setInterval(checkTime, 5000);
}
