import { businessInquiries, isBusinessInquiry } from "./business-inquiries";
import { getPriceExample } from "./price-examples";

const queryKeys = {
  service: "leistung", task: "aufgabe", city: "ort",
  example: "beispiel", project: "projekt", business: "betrieb",
} as const;

export type InquiryIds = Partial<Record<keyof typeof queryKeys, string>>;
type Search = { getAll: (name: string) => string[] } | Record<string, string | string[] | undefined>;

const keys = Object.entries(queryKeys) as [keyof InquiryIds, string][];
const idPattern = /^[a-z0-9äöüß]+(?:-[a-z0-9äöüß]+)*$/;

export const inquiryServices: Record<string, string> = {
  kuechenmontage: "Küchenmontage", moebelmontage: "Möbelmontage",
  lieferungen: "Lieferung", andere: "Anderes Vorhaben",
};

export function readInquiryIds(params: Search): InquiryIds {
  const ids: InquiryIds = {};
  for (const [key, name] of keys) {
    const values = typeof params.getAll === "function" ? params.getAll(name) : (params as Record<string, string | string[] | undefined>)[name];
    const value = Array.isArray(values) ? (values.length === 1 ? values[0] : undefined) : values;
    if (value && value.length <= 100 && idPattern.test(value)) ids[key] = value;
  }
  return ids;
}

export function inquiryQuery(context: InquiryIds) {
  const params = new URLSearchParams();
  for (const [key, name] of keys) {
    const id = context[key];
    if (id && id.length <= 100 && idPattern.test(id)) params.set(name, id);
  }
  return params.toString();
}

export function inquiryHref(context: InquiryIds, destination: "quote" | "callback" = "quote") {
  const query = inquiryQuery(context);
  return (destination === "quote" ? "/" : "/rueckruf") + (query ? "?" + query : "") + (destination === "quote" ? "#kontakt-form" : "");
}

export type DirectoryReference = {
  task?: { slug: string; name: string; parent: string };
  city?: { slug: string; name: string; unconfirmed?: boolean };
};

export function resolveInquiry(
  source: InquiryIds,
  projectTitles: Record<string, string>,
  directory: DirectoryReference = {},
  destination: "quote" | "callback" = "quote",
) {
  const ids: InquiryIds = {};
  const lines: string[] = [];
  const businessKey = source.business ?? null;
  const business = isBusinessInquiry(businessKey) ? businessInquiries[businessKey] : undefined;
  const service = source.service ?? (destination === "callback" ? business?.service : undefined);
  if (service && Object.hasOwn(inquiryServices, service)) ids.service = service;
  if (business && business.service === ids.service) {
    ids.business = source.business;
    lines.push("Firmenanfrage: " + business.title);
  }
  const { task, city } = directory;
  if (task && task.slug === source.task && task.parent === ids.service && task.slug !== task.parent) {
    ids.task = task.slug;
    lines.push("Gewünschte Arbeit: " + task.name);
  }
  if (city && city.slug === source.city) {
    ids.city = city.slug;
    lines.push((city.unconfirmed ? "Ortsangabe zur Prüfung: " : "Bezug zur Ortsseite: ") + city.name);
  }
  const example = getPriceExample(source.example ?? null);
  if (example && example.service === ids.service) {
    ids.example = example.id;
    lines.push(`Preisorientierung für ${example.title} (ab ${example.from}).`);
  }
  if (ids.service === "kuechenmontage" && source.project && Object.hasOwn(projectTitles, source.project)) {
    ids.project = source.project;
    lines.push("Bezug: " + projectTitles[source.project]);
  }
  return { ids, reference: lines.join("\n") };
}
