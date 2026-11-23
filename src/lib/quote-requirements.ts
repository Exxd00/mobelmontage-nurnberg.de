export type QuoteField = {
  key: string;
  label: string;
  group: string;
  kind: "select" | "count" | "text" | "textarea" | "date";
  options?: readonly string[];
  hint?: string;
};

type Details = Record<string, string>;
type QuoteScope = {
  service: string;
  plz: string;
  serviceDetails: Details;
  fileCount: number;
  businessInquiry?: boolean;
};

const job = "Arbeitsumfang";
const access = "Transport und Zugang";
const when = "Termin";
const fixedDate = "An einem festen Datum";
const collect = "Bitte abholen und zum Montageort bringen";
const carry = "Im Gebäude, bitte zum Montageraum tragen";
const upperFloor = "Über Treppen oder mit Aufzug";

function select(key: string, label: string, group: string, options: readonly string[]): QuoteField {
  return { key, label, group, kind: "select", options };
}

function input(key: string, label: string, group: string, kind: QuoteField["kind"], hint?: string): QuoteField {
  return { key, label, group, kind, hint };
}

function routeStop(stop: "pickup" | "delivery" | "worksite", details: Details): QuoteField[] {
  const group = { pickup: "Abholort", delivery: "Lieferort", worksite: "Weg zum Montageort" }[stop];
  const fields: QuoteField[] = [];
  if (stop !== "worksite") {
    fields.push(input(stop + "Address", stop === "pickup" ? "Abholadresse mit PLZ und Ort" : "Lieferadresse mit PLZ und Ort", group, "text", "Straße und Hausnummer oder genaue Abholstation, Postleitzahl und Ort."));
  }
  fields.push(select(stop + "Floor", "Wo werden die Stücke übernommen oder abgestellt?", group,
    ["An der Bordsteinkante", "Im Erdgeschoss, stufenlos", upperFloor]));
  if (details[stop + "Floor"] === upperFloor) {
    fields.push(input(stop + "Level", "Welche Etage?", group, "text", "Zum Beispiel 3. OG oder Untergeschoss."),
      select(stop + "Lift", "Passt das größte Stück in den Aufzug?", group, ["Ja", "Nein, Treppe erforderlich", "Kein Aufzug vorhanden"]));
  }
  fields.push(select(stop + "Parking", "Trageweg vom möglichen Halteplatz", group, ["Bis 10 m", "11 bis 30 m", "31 bis 50 m", "Mehr als 50 m"]));
  if (details[stop + "Parking"] === "Mehr als 50 m") fields.push(input(stop + "Distance", "Ungefähre Weglänge in Metern", group, "count"));
  return fields;
}

function assemblyLocation(details: Details): QuoteField[] {
  const fields = [select("partsLocation", "Wo liegen die Teile am Montagetermin?", access, ["Im Montageraum", "Lieferung in den Montageraum ist organisiert", carry, collect])];
  if (details.partsLocation === collect) fields.push(...routeStop("pickup", details), ...routeStop("delivery", details));
  if (details.partsLocation === carry) fields.push(...routeStop("worksite", details));
  return fields;
}

function furniture(details: Details): QuoteField[] {
  const fields = [
    select("assemblyTask", "Welche Arbeit sollen wir übernehmen?", job, ["Aufbau", "Abbau", "Abbau und Wiederaufbau", "Umbau oder Teilmontage"]),
    input("furnitureType", "Welche Möbel sollen wir montieren?", job, "text", "Zum Beispiel Kleiderschrank, Bett oder mehrere Schreibtische."),
    input("itemCount", "Wie viele Möbelstücke insgesamt?", job, "count"),
    input("specification", "Welche Modelle und Ausstattungen?", job, "textarea", "Je Modell Stückzahl, Produktlink oder Artikelnummer und Extras wie Schubladen oder Schiebetüren nennen. Alternativ Maße und Ausstattung beschreiben oder eine lesbare Stückliste, Anleitung oder Fotos mit diesen Angaben beifügen."),
    select("furnitureCondition", "Zustand der Möbel", job, ["Neu und originalverpackt", "Gebraucht und zerlegt", "Aufgebaut", "Teilweise aufgebaut oder gemischter Zustand"]),
  ];
  if (details.assemblyTask !== "Abbau") {
    fields.push(select("wallFixing", "Ist eine Wandbefestigung vorgesehen?", job, ["Ja", "Nein", "Laut Anleitung noch zu prüfen"]));
    if (details.wallFixing === "Ja") fields.push(select("wallMaterial", "Wand am Befestigungspunkt", job, ["Massivwand", "Trockenbau", "Holz", "Anderer Aufbau", "Wandaufbau unbekannt"]));
  }
  if (details.assemblyTask === "Umbau oder Teilmontage" || details.furnitureCondition === "Teilweise aufgebaut oder gemischter Zustand") {
    fields.push(input("remainingWork", "Welche Arbeiten stehen noch aus?", job, "textarea", "Benennen Sie die betroffenen Möbel und die gewünschten Arbeitsschritte."));
  }
  if (details.assemblyTask === "Abbau und Wiederaufbau") {
    fields.push(select("reassemblySite", "Wo findet der Wiederaufbau statt?", access, ["Am selben Standort", "An einem anderen Standort"]));
    if (details.reassemblySite === "An einem anderen Standort") {
      fields.push(select("transfer", "Wer organisiert den Transport zwischen den Standorten?", access, ["Bitte Transport mit anbieten", "Transport ist bereits organisiert"]),
        ...routeStop("pickup", details), ...routeStop("delivery", details));
      return fields;
    }
  }
  if (details.assemblyTask === "Abbau") {
    fields.push(select("afterDismantling", "Wo sollen die zerlegten Teile bleiben?", access, ["Im selben Raum", "An einen anderen Platz im Gebäude tragen", "Zu einer anderen Adresse liefern"]));
    if (details.afterDismantling === "Zu einer anderen Adresse liefern") fields.push(...routeStop("pickup", details), ...routeStop("delivery", details));
    if (details.afterDismantling === "An einen anderen Platz im Gebäude tragen") fields.push(input("internalCarry", "Weg zwischen den Räumen", access, "text", "Ungefähre Entfernung, Etagen und Aufzug angeben."));
    return fields;
  }
  return [...fields, ...assemblyLocation(details)];
}

function kitchen(details: Details): QuoteField[] {
  const fields = [
    select("form", "Welche Form hat die Küche?", job, ["Einzeilig", "Zweizeilig", "L-Form", "U-Form", "Mit Insel oder Halbinsel", "Andere Anordnung"]),
    input("cabinetCount", "Wie viele Küchen- und Hochschränke insgesamt?", job, "count", "Unter-, Ober- und Hochschränke zusammenzählen. Bei reinen Anpassungsarbeiten sind 0 Schränke möglich."),
    select("kitchenCondition", "Montagezustand", job, ["Neue Schränke, zerlegt", "Vormontierte Schränke", "Gebrauchte Küche, zerlegt", "Teilweise aufgebaute Küche oder Umbau"]),
    input("specification", "Küchenplan oder Maße der Küchenzeilen", job, "textarea", "Einen bemaßten Plan beifügen oder die Länge jeder Zeile bzw. Insel mit Einheit und die Schrankanordnung beschreiben. Bei Teilmontage die betroffenen Elemente angeben."),
    select("hasOldKitchen", "Welche Arbeiten fallen an der alten Küche an?", job, ["Keine", "Nur abbauen", "Abbauen und abtransportieren", "Nur abtransportieren"]),
  ];
  if (details.hasOldKitchen && details.hasOldKitchen !== "Keine") fields.push(input("oldKitchenScope", "Umfang der alten Küche", job, "text", "Anzahl der alten Schränke, ungefähre Zeilenlänge und mitzunehmende Geräte."));
  fields.push(select("countertopType", "Welche Arbeitsplatte bearbeiten wir?", job, ["Keine Bearbeitung", "Holz oder Schichtstoff", "Stein, Keramik oder Verbundwerkstoff", "Anderes Material"]));
  if (details.countertopType && details.countertopType !== "Keine Bearbeitung") fields.push(input("worktopScope", "Maße, Zuschnitte und Ausschnitte", job, "text", "Länge mit Einheit, benötigte Schnitte und Öffnungen für Spüle oder Kochfeld nennen."));
  fields.push(input("appliances", "Welche Geräte sollen eingebaut werden?", job, "text", "Geräte mit Anzahl nennen, zum Beispiel Backofen und zwei Kühlgeräte. Ohne Einbau „keine“ eintragen."),
    select("connections", "Welche Anschlüsse sollen im Angebot geprüft werden?", job, ["Keine", "Wasser / Abfluss", "Elektro", "Wasser / Abfluss und Elektro"]));
  if (details.kitchenCondition === "Teilweise aufgebaute Küche oder Umbau") fields.push(input("remainingWork", "Was ist bereits erledigt und was sollen wir übernehmen?", job, "textarea"));
  return [...fields, ...assemblyLocation(details)];
}

function delivery(details: Details): QuoteField[] {
  return [
    input("itemDescription", "Was soll geliefert werden?", job, "textarea", "Pro Möbel oder Paket die Art und Stückzahl angeben."),
    input("itemCount", "Wie viele Transportstücke insgesamt?", job, "count"),
    input("itemSize", "Packmaße des größten Stücks", job, "text", "Länge × Breite × Höhe mit Einheit, zum Beispiel 210 × 70 × 45 cm."),
    input("itemWeight", "Gewicht des schwersten Stücks in kg (geschätzt)", job, "text", "Eine Schätzung genügt, zum Beispiel 32 oder 12,5."),
    ...routeStop("pickup", details), ...routeStop("delivery", details),
  ];
}

function other(): QuoteField[] {
  return [
    input("taskDescription", "Was sollen wir für Sie erledigen?", job, "textarea", "Beschreiben Sie das gewünschte Ergebnis und welche Arbeiten wir übernehmen sollen."),
    input("scope", "Welche Stückzahlen und Maße bestimmen den Aufwand?", job, "textarea", "Zum Beispiel drei Regalböden à 80 cm an einer Betonwand."),
    input("access", "Wie erreichen wir den Arbeitsort?", access, "text", "Etage, Aufzug und Weg vom Halteplatz nennen."),
  ];
}

const services = ["moebelmontage", "kuechenmontage", "lieferungen", "andere", "umzuege", "entruempelung"];

export function needsWorksitePostcode(service: string): boolean {
  return service !== "lieferungen" && service !== "umzuege";
}

export function isContactPhone(value: string): boolean {
  return /^[+\d\s()/.-]+$/.test(value) && /^\d{5,20}$/.test(value.replace(/\D/g, ""));
}

export function getQuoteFields(service: string, details: Details, businessInquiry = false): QuoteField[] {
  if (!services.includes(service)) return [];
  let fields: QuoteField[];
  switch (service) {
    case "moebelmontage": fields = furniture(details); break;
    case "kuechenmontage": fields = kitchen(details); break;
    case "lieferungen": fields = delivery(details); break;
    case "umzuege":
      fields = [input("scope", "Umzugsgut und Mengen", job, "textarea", "Möbelliste, Kartonanzahl und schwere Stücke angeben."), ...routeStop("pickup", details), ...routeStop("delivery", details)];
      break;
    case "entruempelung":
      fields = [input("scope", "Gegenstände und geschätztes Volumen", job, "textarea"), ...routeStop("worksite", details)];
      break;
    default: fields = other();
  }
  fields.push(select("timeframe", "Wann soll der Auftrag stattfinden?", when, ["Flexibel nach Vereinbarung", "Innerhalb einer Woche", "Innerhalb von vier Wochen", fixedDate]));
  if (details.timeframe === fixedDate) fields.push(input("requestedDate", "Wunschtermin", when, "date"));
  if (businessInquiry) fields.push(input("company", "Firma oder Organisation", "Betrieb", "text"),
    input("timeSlot", "Zugangs- oder Lieferzeitfenster im Betrieb", "Betrieb", "text", "Zum Beispiel werktags 8–12 Uhr. Bei freiem Zugang „flexibel“ eintragen."));
  return fields;
}

function validateField(field: QuoteField, value: string, scope: QuoteScope): string | undefined {
  const { key, label, kind } = field;
  if (key === "specification" && scope.fileCount > 0) return;
  if (!value) return key === "specification" ? "Bitte ergänzen Sie die Angaben oder fügen Sie einen passenden Plan bzw. ein Foto bei." : `Bitte ausfüllen: ${label}.`;
  if (kind === "select" && !field.options?.includes(value)) return `Bitte wählen Sie eine der Angaben für „${label}“.`;
  if (key === "kitchenCondition" && Number(scope.serviceDetails.cabinetCount) === 0 && value !== "Teilweise aufgebaute Küche oder Umbau") return "Bei einer vollständigen Montage bitte die Schrankanzahl angeben. Für reine Anpassungsarbeiten „Teilweise aufgebaute Küche oder Umbau“ wählen.";
  if (kind === "count") {
    const minimum = key.endsWith("Distance") ? 51 : key === "cabinetCount" ? 0 : 1;
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < minimum) return `Bitte eine ganze Zahl ab ${minimum} eingeben.`;
  }
  if (kind === "date") {
    const day = new Date(value + "T12:00:00Z");
    const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(new Date());
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(day.getTime()) || day.toISOString().slice(0, 10) !== value || value < today) return "Bitte ein gültiges Datum ab heute auswählen.";
  }
  if (key.endsWith("Address")) {
    const words = value.replace(/\b\d{5}\b/g, "").match(/\p{L}[\p{L}.-]+/gu) || [];
    if (!/\b\d{5}\b/.test(value) || words.length < 2) return "Bitte die Adresse mit Straße oder Abholstation, fünfstelliger PLZ und Ort angeben.";
  }
  if (key === "itemWeight" && !/^\d+(?:[.,]\d+)?(?:\s*kg)?$/i.test(value)) return "Bitte das geschätzte Gewicht in kg als Zahl eingeben.";
  if (key === "itemWeight" && parseFloat(value.replace(",", ".")) <= 0) return "Das Gewicht muss größer als 0 kg sein.";
  const hasLength = /\d\s*(?:mm|cm|m)\b/i.test(value);
  if (key === "itemSize") {
    const sizes = value.match(/-?\d+(?:[.,]\d+)?/g) || [];
    if (!hasLength || sizes.length < 3 || sizes.some(size => Number(size.replace(",", ".")) <= 0)) return "Bitte Länge, Breite und Höhe mit Einheit angeben, zum Beispiel 210 × 70 × 45 cm.";
  }
  if (key === "specification" && scope.service === "kuechenmontage" && !hasLength) return "Bitte die Küchenmaße mit Einheit angeben oder den bemaßten Plan beifügen.";
  if (key === "specification" && scope.service === "moebelmontage") {
    const productReference = /https?:\/\/\S+\.\S+|\d[\d. -]{3,}\d|(?=.*\p{L})(?=.*\d).{5,}/iu.test(value);
    const description = value.length >= 10 && value.split(/\s+/).length >= 3;
    if (!productReference && !description) return "Bitte einen Produktlink, die Artikelnummer oder Modell und Ausstattung ergänzen oder eine passende Datei beifügen.";
  }
  if (kind === "textarea" && key !== "specification" && value.length < 5) return `Bitte „${label}“ genauer beschreiben.`;
  if ((kind === "text" || kind === "textarea") && /^[\s.?!_–—-]*$/.test(value)) return `Bitte „${label}“ ergänzen.`;
}

export function validateQuoteScope(scope: QuoteScope): { field: string; message: string } | null {
  if (!services.includes(scope.service)) return { field: "service", message: "Bitte wählen Sie eine angebotene Leistung." };
  if (needsWorksitePostcode(scope.service) && !/^\d{5}$/.test(scope.plz.trim())) return { field: "plz", message: "Bitte die fünfstellige PLZ des Einsatzorts eingeben." };
  for (const field of getQuoteFields(scope.service, scope.serviceDetails, scope.businessInquiry)) {
    const message = validateField(field, scope.serviceDetails[field.key]?.trim() || "", scope);
    if (message) return { field: field.key, message };
  }
  return null;
}
