export const businessInquiries = {
  buero: { service: "moebelmontage", title: "Büromöbel aufbauen" },
  ausstellung: { service: "kuechenmontage", title: "Ausstellungsküche montieren" },
  lieferung: { service: "lieferungen", title: "Möbel zum Betrieb liefern" },
  teekueche: { service: "kuechenmontage", title: "Teeküche einrichten" },
} as const;

export type BusinessInquiry = keyof typeof businessInquiries;
export const businessInquiryKeys = Object.keys(businessInquiries) as BusinessInquiry[];

export function isBusinessInquiry(key: string | null): key is BusinessInquiry {
  return key !== null && Object.hasOwn(businessInquiries, key);
}

export function businessInquiryHref(key: BusinessInquiry) {
  return `/?leistung=${businessInquiries[key].service}&betrieb=${key}#kontakt-form`;
}
