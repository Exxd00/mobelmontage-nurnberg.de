import type { Service } from "./service-directory";

export const serviceBasics: Record<
  string,
  {
    title: string;
    price: string;
    intro: string;
    preparation: string;
    question: string;
    answer: string;
  }
> = {
  lieferungen: {
    title: "Lieferung",
    price: "39 €",
    intro:
      "Wir holen Möbel am vereinbarten Ort ab und bringen sie bis zum vereinbarten Platz.",
    preparation:
      "Bitte nennen Sie Abhol- und Lieferadresse, Anzahl und Maße der Packstücke sowie Stockwerk und Aufzug an beiden Adressen.",
    question: "Welche Angaben braucht eine Lieferanfrage?",
    answer:
      "Mit den beiden Adressen, Packmaßen und den Tragewegen lässt sich einschätzen, wie viel Platz im Fahrzeug und vor Ort nötig ist.",
  },
  moebelmontage: {
    title: "Möbelmontage",
    price: "59 €",
    intro:
      "Wir bauen Möbel nach Anleitung auf und richten Türen und Auszüge am vorgesehenen Standort aus.",
    preparation:
      "Schicken Sie die Modellnamen oder Produktlinks, Stückzahlen und ein Foto vom Stellplatz. Bei hohen Schränken ist die Raumhöhe wichtig.",
    question: "Kann ich mehrere Möbel gemeinsam anfragen?",
    answer:
      "Ja. Führen Sie die Möbel in einer Liste auf und nennen Sie Stückzahl und Modell. So kann das Angebot den gesamten Aufbau berücksichtigen.",
  },
  kuechenmontage: {
    title: "Küchenmontage",
    price: "149 €",
    intro:
      "Wir setzen Küchen aus einzelnen Schränken zusammen, richten sie aus und passen Fronten, Auszüge und Arbeitsplatten an.",
    preparation:
      "Für die Anfrage helfen Küchenplan, Wandmaße und Fotos der Leitungen und Geräte. Nennen Sie Geräteanschlüsse oder Ausschnitte, die im Angebot berücksichtigt werden sollen.",
    question: "Welche Unterlagen helfen bei der Küchenmontage?",
    answer:
      "Grundriss, Schrankplan und Geräteliste zeigen, wie die Küche aufgebaut wird. Fotos verdeutlichen vorhandene Anschlüsse und Übergänge.",
  },
};

// Each detail page describes the particular object and the information needed to quote it.
const details: Record<string, string> = {
  "moebel-lieferung":
    "Ob einzelnes Möbelstück oder mehrere Kartons: Maße, Gewicht und die beiden Adressen bestimmen, wie die Lieferung geplant wird.",
  "ikea-lieferung":
    "Für die Abholung bei IKEA helfen Abholort, Zeitfenster und Artikel- oder Packliste. Den Abholnachweis benötigen wir erst zur Durchführung.",
  "sofa-lieferung":
    "Bei einem Sofa entscheiden vor allem die längste Seite und die engste Stelle im Treppenhaus. Fotos von Eingang und Wendepodest helfen bei der Planung.",
  "matratzen-lieferung":
    "Matratzen unterscheiden sich beim Transport durch ihre Verpackung. Geben Sie an, ob das Modell gerollt oder in voller Größe übernommen wird.",
  "express-lieferung":
    "Bei kurzfristigen Lieferungen prüfen wir zunächst Abholbereitschaft, Strecke und freie Kapazität. Nennen Sie die späteste gewünschte Ankunft.",
  "same-day-lieferung":
    "Eine Lieferung am selben Tag hängt von der Abholfreigabe und einer verfügbaren Tour ab. Die Terminbestätigung erfolgt nach Prüfung Ihrer Anfrage.",
  etagenlieferung:
    "Für den Transport in eine bestimmte Etage brauchen wir Anzahl der Stockwerke, Aufzugmaße und die Entfernung zwischen Halteplatz und Hauseingang.",
  "schwerlast-lieferung":
    "Gewicht, Schwerpunkt, Untergrund und Zugang bestimmen, ob ein schweres Stück über den vorgesehenen Weg transportiert werden kann.",
  "ikea-montage":
    "Über Modellname oder IKEA-Artikelnummer lassen sich Anleitung und Bauteile zuordnen. Geben Sie ergänzend die Zahl der Möbel und mögliche Wandbefestigungen an.",
  "pax-schrank-montage":
    "Für einen PAX-Schrank zählen Korpusbreite und -höhe, Innenausstattung, Türart und Deckenhöhe. Ein Plan aus dem Konfigurator erleichtert die Kalkulation.",
  "bett-montage":
    "Bei einem Bett sind Liegefläche, Bettrahmen und mögliche Schubladen oder Hebemechaniken wichtig. Geben Sie an, ob das Bett neu oder bereits zerlegt ist.",
  "schrank-montage":
    "Für die Schrankmontage helfen Höhe, Breite, Türart und Zahl der Einlegeböden oder Auszüge. Bei Wandbefestigungen nennen Sie bitte den Wandaufbau.",
  "regal-montage":
    "Für ein Regal benötigen wir Modell, Maße und den gewünschten Standort. Teilen Sie mit, ob einzelne Elemente miteinander oder mit der Wand verbunden werden sollen.",
  "tisch-montage":
    "Ein fester Tisch, ein Ausziehtisch und ein höhenverstellbarer Schreibtisch haben unterschiedliche Untergestelle. Ein Produktlink zeigt den vorgesehenen Aufbau.",
  "kommode-montage":
    "Schubladenzahl, Auszugssystem und Kippsicherung bestimmen die Arbeit an einer Kommode. Ein Foto oder das konkrete Modell hilft bei der Anfrage.",
  "bueromoebel-montage":
    "Bei Büroeinrichtungen lassen sich Schreibtische, Rollcontainer und Schränke raumweise planen. Nennen Sie Stückzahlen, Stellplan und mögliche Montagezeiten.",
  "kinderzimmer-montage":
    "Für Kinderzimmermöbel sind vorgesehene Befestigungen und der Wandaufbau besonders wichtig. Geben Sie die Modelle und den gewünschten Stellplatz an.",
  "schlafzimmer-montage":
    "Für ein Schlafzimmer können Schrank, Bett und Kommoden gemeinsam kalkuliert werden. Raumhöhe und Platz zum Auslegen der Bauteile helfen bei der Planung.",
  "wohnzimmer-montage":
    "Bei Wohnwänden und Lowboards helfen Stellbreite, Aufteilung und die Lage von Steckdosen. Nennen Sie Hängeelemente und gewünschte Wandbefestigungen.",
  "poco-montage":
    "Bei Möbeln von POCO helfen Modellbezeichnung oder Montageanleitung, die Bauteile zuzuordnen. Ergänzen Sie die Stückzahl und den verfügbaren Stellplatz.",
  "xxxlutz-montage":
    "Für Möbel von XXXLutz prüfen wir anhand der Produktbezeichnung und Anleitung, welche Korpusse, Türen und Auszüge aufgebaut werden sollen.",
  "roller-montage":
    "Für ROLLER-Möbel helfen ein Link zum Produkt, ein Foto des Kartonetiketts oder die Anleitung. So lässt sich der Aufwand für das konkrete Modell einschätzen.",
  "ikea-kuechenmontage":
    "Für eine IKEA-Küche ist der Küchenplan mit Artikelübersicht hilfreich. Er zeigt Korpusse, Schienen, Fronten und die geplanten Gerätepositionen.",
  "metod-kuechenmontage":
    "Beim METOD-System werden Schrankaufteilung, Aufhängeschienen und die Höhe der Arbeitsplatte zusammen geplant. Senden Sie den Plan mit den Wandmaßen.",
  "kuechen-umbau":
    "Für den Umbau einer vorhandenen Küche vergleichen wir die heutige Anordnung mit dem neuen Plan. Kennzeichnen Sie Elemente, die erhalten oder versetzt werden sollen.",
  "arbeitsplatten-montage":
    "Bei Arbeitsplatten zählen Material, Plattenstärke, Eckverbindungen und Ausschnitte für Spüle oder Kochfeld. Eine bemaßte Skizze zeigt die geplanten Übergänge.",
  "einbaugeraete-montage":
    "Gerätemodell, Nischenmaß und Befestigungssystem zeigen, wie ein Einbaugerät in den Schrank passt. Erforderliche Anschlüsse werden im Angebot gesondert geklärt.",
  "kuechenzeile-montage":
    "Bei einer geraden Küchenzeile bestimmen Wandlänge, Gerätemaße und Anschlusspunkte die Aufteilung der Unter- und Oberschränke.",
  "eckküche-montage":
    "Für eine Eckküche sind die Wandmaße auf beiden Seiten, der Winkel und die Verbindung der Arbeitsplatten wichtig. Senden Sie möglichst eine bemaßte Draufsicht.",
  "kuecheninsel-montage":
    "Bei einer Kücheninsel helfen der Grundriss, die Position zur Küchenzeile und Angaben zu den Geräten in der Insel. So lassen sich Durchgänge und Anschlüsse berücksichtigen.",
};

export function serviceIntro(service: Service) {
  return details[service.slug] ?? serviceBasics[service.parentId].intro;
}
