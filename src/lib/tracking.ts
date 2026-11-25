import { hasAnalyticsConsent } from './consent';

interface TrackingData {
  gclid: string | null;
  source: string;
  medium: string;
  campaign: string;
  page: string;
  referrer: string;
}

let referrerProcessed = false;
let previousCampaign = "";

// Get URL parameters
function getUrlParam(param: string): string | null {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(param)?.trim();
  if (!value || value.length > 256) return null;
  return (param === "gclid" ? /^[A-Za-z0-9_.-]+$/ : /^[\p{L}\p{N} _.-]+$/u).test(value) ? value : null;
}

// Store tracking data in localStorage
function storeTrackingData(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
    // Also store timestamp
    localStorage.setItem(`${key}_timestamp`, Date.now().toString());
  } catch {
    // Ignore storage errors
  }
}

// Get stored tracking data
function getStoredTrackingData(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = localStorage.getItem(key);
    const timestamp = localStorage.getItem(`${key}_timestamp`);

    // Check if data is still valid (30 days)
    if (value) {
      const age = Date.now() - Number(timestamp);
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      if (!timestamp || !Number.isFinite(age) || age < 0 || age > thirtyDays) {
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}_timestamp`);
        return null;
      }
    }

    return value;
  } catch {
    return null;
  }
}

// Detect traffic source
function detectSource(): string {
  if (typeof window === 'undefined') return 'Direct';

  // Check for GCLID (Google Ads)
  const gclid = getUrlParam('gclid');
  if (gclid) return 'Google Ads';

  // Check for UTM source
  const utmSource = getUrlParam('utm_source');
  if (utmSource) {
    if (/^google(?:[ ._-]?ads)?$/i.test(utmSource)) {
      const medium = getUrlParam('utm_medium') || '';
      if (/^(cpc|ppc|paid|paidsearch|paid[ _-]search|display|cpm|retargeting)$/i.test(medium) || /^google[ ._-]?ads$/i.test(utmSource)) return 'Google Ads';
      return /^organic$/i.test(medium) ? 'Google Organic' : 'Google';
    }
    if (utmSource.toLowerCase().includes('facebook')) return 'Facebook';
    if (utmSource.toLowerCase().includes('instagram')) return 'Instagram';
    return utmSource;
  }

  // Check referrer
  const referrer = document.referrer;
  if (!referrer) return 'Direct';

  try {
    const refUrl = new URL(referrer);
    const refHost = refUrl.hostname.toLowerCase();

    if (refHost === window.location.hostname) return 'Direct';
    const from = (domain: string) => refHost === domain || refHost.endsWith('.' + domain);
    if (/(^|\.)google\.(?:com|[a-z]{2}|(?:co|com)\.[a-z]{2})$/.test(refHost)) return 'Google Organic';
    if (from('bing.com')) return 'Bing Organic';
    if (from('facebook.com')) return 'Facebook';
    if (from('instagram.com')) return 'Instagram';
    if (from('twitter.com') || from('x.com') || from('t.co')) return 'Twitter/X';
    if (from('linkedin.com')) return 'LinkedIn';
    if (from('youtube.com') || from('youtu.be')) return 'YouTube';

    return 'Referral: ' + refHost;
  } catch {
    return 'Unknown';
  }
}

// Initialize tracking on page load
export function initTracking(): void {
  if (!hasAnalyticsConsent()) return;
  const gclid = getUrlParam('gclid');
  const utmSource = getUrlParam('utm_source');
  const utmMedium = getUrlParam('utm_medium');
  const utmCampaign = getUrlParam('utm_campaign');
  const explicit = Boolean(gclid || utmSource || utmMedium || utmCampaign);
  const signature = explicit ? JSON.stringify([gclid, utmSource, utmMedium, utmCampaign]) : '';
  if (referrerProcessed && (!explicit || signature === previousCampaign)) {
    previousCampaign = signature;
    return;
  }
  referrerProcessed = true;
  previousCampaign = signature;
  const source = detectSource();
  if (!getStoredTrackingData('first_source')) storeTrackingData('first_source', source);
  if (!explicit && source === 'Direct' && getStoredTrackingData('last_source')) return;
  // A new visit's campaign and click ID must belong to the same traffic source.
  storeTrackingData('gclid', gclid || '');
  storeTrackingData('utm_source', utmSource || '');
  storeTrackingData('utm_medium', utmMedium || '');
  storeTrackingData('utm_campaign', utmCampaign || '');
  storeTrackingData('last_source', source);
}

// Get all tracking data for form submission
export function getTrackingData(): TrackingData {
  if (!hasAnalyticsConsent()) {
    return { gclid: null, source: 'Nicht erfasst', medium: '', campaign: '', page: '', referrer: '' };
  }
  initTracking();
  const source = getStoredTrackingData('last_source') || detectSource();
  const gclid = source === 'Google Ads' ? getStoredTrackingData('gclid') || getUrlParam('gclid') : null;
  const medium = getStoredTrackingData('utm_medium') || getUrlParam('utm_medium') || '';
  const campaign = getStoredTrackingData('utm_campaign') || getUrlParam('utm_campaign') || '';
  const page = window.location.origin + window.location.pathname;
  const referrer = document.referrer ? new URL(document.referrer).origin : '';

  return {
    gclid,
    source,
    medium,
    campaign,
    page,
    referrer,
  };
}

// Get GCLID specifically
export function getGCLID(): string | null {
  return getTrackingData().gclid;
}

// Get current page URL
export function getCurrentPage(): string {
  if (!hasAnalyticsConsent()) return '';
  return window.location.origin + window.location.pathname;
}

// Get traffic source
export function getTrafficSource(): string {
  return getTrackingData().source;
}

export function clearAttribution(): void {
  referrerProcessed = false;
  previousCampaign = '';
  try {
    for (const key of ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'first_source', 'last_source', 'leads']) {
      localStorage.removeItem(key);
      localStorage.removeItem(key + '_timestamp');
    }
  } catch {
    // Storage may be disabled by the browser.
  }
}
