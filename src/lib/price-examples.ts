type ServiceId = "lieferungen" | "moebelmontage" | "kuechenmontage";

export const startingPrices = {
  lieferungen: "39 €",
  moebelmontage: "59 €",
  kuechenmontage: "149 €",
} as const;

type PriceExample = {
  id: string;
  service: ServiceId;
  title: string;
  from: string;
  duration?: string;
  preparation: string;
};

export const priceExamples: PriceExample[] = [
  { id: "pax-2m", service: "moebelmontage", title: "PAX-Schrank, 2 m", from: "89 €", duration: "ca. 2 Std.", preparation: "Für das Angebot helfen die Schrankplanung, die Türart und die Raumhöhe am Stellplatz." },
  { id: "kallax-regal", service: "moebelmontage", title: "KALLAX-Regal", from: "35 €", duration: "ca. 30 Min.", preparation: "Nennen Sie die Größe des Regals, die Zahl der Einsätze und ob eine Wandbefestigung vorgesehen ist." },
  { id: "malm-bett-160", service: "moebelmontage", title: "MALM-Bett, 160 cm", from: "59 €", duration: "ca. 1 Std.", preparation: "Geben Sie die genaue Ausführung und vorhandene Bettkästen oder Zusatzteile an." },
  { id: "hemnes-kommode", service: "moebelmontage", title: "HEMNES-Kommode", from: "45 €", duration: "ca. 45 Min.", preparation: "Ein Produktlink oder die Anzahl der Schubladen hilft, das Modell zuzuordnen." },
  { id: "ikea-kueche-10", service: "kuechenmontage", title: "IKEA-Küche mit zehn Schränken", from: "349 €", duration: "ca. 1 Tag", preparation: "Schicken Sie Küchenplan und Geräteliste. Geben Sie an, welche Arbeitsplatten, Ausschnitte und Anschlüsse zu berücksichtigen sind." },
  { id: "pax-lieferung-montage", service: "moebelmontage", title: "Lieferung und Montage eines PAX-Schranks", from: "149 €", duration: "ca. 3 Std.", preparation: "Nennen Sie Abholadresse, Lieferadresse, Etage und Schrankausstattung, damit Fahrt und Aufbau gemeinsam kalkuliert werden können." },
  { id: "moebellieferung", service: "lieferungen", title: "Andere Möbellieferung", from: startingPrices.lieferungen, preparation: "Für Ihr Angebot brauchen wir Abhol- und Lieferort, Packmaße, Etage und Angaben zu den Tragewegen." },
  { id: "moebelaufbau", service: "moebelmontage", title: "Anderer Möbelaufbau", from: startingPrices.moebelmontage, preparation: "Mit Stückzahl, Modellnamen oder Produktlinks und einem Foto des Stellplatzes können wir den Aufwand für Ihren Aufbau einschätzen." },
  { id: "kuechenaufbau", service: "kuechenmontage", title: "Andere Küchenmontage", from: startingPrices.kuechenmontage, preparation: "Ein bemaßter Küchenplan, Angaben zu Geräten und Fotos der Stellwände helfen uns, Ihren Auftrag einzuschätzen." },
];

export function getPriceExample(id: string | null) {
  return priceExamples.find((example) => example.id === id);
}
