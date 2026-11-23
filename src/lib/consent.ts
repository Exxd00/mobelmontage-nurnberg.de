export type CookieChoice = "accepted" | "declined";
export const consentKey = "cookie-consent";
export const consentChanged = "montage:consent-changed";
let sessionChoice: CookieChoice | null = null;
let sessionOnly = false;

export function getCookieChoice(): CookieChoice | null {
  if (typeof window === "undefined") return null;
  if (sessionOnly) return sessionChoice;
  try {
    const stored = window.localStorage.getItem(consentKey);
    return stored === "accepted" || stored === "declined" ? stored : null;
  } catch {
    // Browsers that disable storage can still apply a choice for this page.
    return sessionChoice;
  }
}

export function hasAnalyticsConsent() {
  return getCookieChoice() === "accepted";
}

export function setCookieChoice(choice: CookieChoice) {
  sessionChoice = choice;
  try {
    window.localStorage.setItem(consentKey, choice);
    sessionOnly = false;
  } catch {
    sessionOnly = true;
  }
  window.dispatchEvent(new Event(consentChanged));
}
