import { cities, getAllServices } from "./data";

export { pageMetadata, siteOrigin } from "./page-metadata";
export type City = (typeof cities)[number];
export type Service = ReturnType<typeof getAllServices>[number];

const bySlug = new Map<string, City>();
for (const city of cities) {
  if (!bySlug.has(city.slug)) bySlug.set(city.slug, city);
}

export const directoryCities = [...bySlug.values()];
export const mainCities = directoryCities.filter((city) => city.isMain);
export const serviceList = getAllServices();

const localGuides = [
  {
    city: "herzogenaurach", service: "ikea-lieferung",
    title: "IKEA-Bestellung nach Herzogenaurach liefern lassen",
    description: "Abholung bei IKEA und Lieferung nach Herzogenaurach anfragen. So bestimmen Abholfenster, Packliste und der Weg bis zum gewünschten Stellplatz den Aufwand.",
    heading: "Was steht auf Ihrer Abholbestätigung?",
    paragraphs: [
      "Prüfen Sie, an welcher Warenausgabe die Bestellung bereitliegt und für welches Zeitfenster die Abholung vorgesehen ist. Zur Kalkulation helfen die Anzahl der Kartons sowie Maße und Gewicht des größten Pakets. Den Abholcode benötigen wir erst für die vereinbarte Abholung.",
      "Geben Sie für die Lieferadresse in Herzogenaurach an, wo die Pakete abgestellt werden sollen. Bei langen Schrankseiten zählt neben der Etage auch, ob die Kartons in den Aufzug passen oder über das Treppenhaus getragen werden müssen.",
    ],
  },
  {
    city: "vestenbergsgreuth", service: "sofa-lieferung",
    title: "Sofa in Vestenbergsgreuth abholen oder liefern lassen",
    description: "Sofatransport in Vestenbergsgreuth anfragen. Maße der einzelnen Teile, Türen, Treppen und Tragewege an Abhol- und Lieferadresse helfen bei der Preisermittlung.",
    heading: "Passt das Sofa um das Treppenpodest?",
    paragraphs: [
      "Messen Sie das größte Teil, das tatsächlich getragen wird. Bei einem Ecksofa kann das ein einzelnes Element sein. Nennen Sie Länge, Breite und Höhe und ob sich Füße, Armlehnen oder das Eckelement für den Transport abnehmen lassen.",
      "Beschreiben Sie den Weg an beiden Adressen, von der Wohnung bis zum Fahrzeug und vom Fahrzeug bis zum neuen Stellplatz. Bei einer engen Tür oder einer Wendung im Treppenhaus hilft ein Foto mit dem gemessenen Durchgangsmaß.",
    ],
  },
];

export function localServiceGuide(city: City, service: Service) {
  return localGuides.find(guide => guide.city === city.slug && guide.service === service.slug);
}

export function findService(segment: string) {
  // Next can supply percent-encoded segments when prerendering a non-ASCII slug.
  try {
    const slug = decodeURIComponent(segment);
    return serviceList.find((service) => service.slug === slug);
  } catch {
    return undefined;
  }
}

export function findCity(slug: string) {
  return bySlug.get(slug);
}

export function cityServices(city: City) {
  return city.isMain
    ? serviceList
    : serviceList.filter((item) => item.slug === item.parentId || localServiceGuide(city, item));
}

export function serviceLocations(service: Service) {
  return directoryCities.filter(city => city.isMain || localServiceGuide(city, service));
}
