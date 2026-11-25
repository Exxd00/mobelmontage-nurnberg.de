import type { Service } from "./service-directory";
import { startingPrices, singleItemPrices } from "./price-examples";

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
    price: startingPrices.lieferungen,
    intro:
      "Wir holen Möbel am vereinbarten Ort ab und bringen sie bis zum vereinbarten Platz.",
    preparation:
      "Bitte nennen Sie Abhol- und Lieferadresse, Art und Anzahl der Packstücke sowie den Zugang an beiden Orten. Maße, Etage und Aufzug helfen uns, den Trageweg zu planen.",
    question: "Welche Angaben braucht eine Lieferanfrage?",
    answer:
      "Mit den beiden Adressen, Packmaßen und den Tragewegen lässt sich einschätzen, wie viel Platz im Fahrzeug und vor Ort nötig ist.",
  },
  moebelmontage: {
    title: "Möbelmontage",
    price: startingPrices.moebelmontage,
    intro:
      "Wir bauen Möbel nach Anleitung auf und richten Türen und Auszüge am vorgesehenen Standort aus.",
    preparation:
      "Beschreiben Sie Art, Stückzahl und Ausführung Ihrer Möbel. Zur eindeutigen Zuordnung helfen Modellname, Produktlink, Foto oder Plan. Bei hohen Schränken ist auch die Raumhöhe wichtig.",
    question: "Kann ich mehrere Möbel gemeinsam anfragen?",
    answer:
      "Ja. Führen Sie die Möbel in einer Liste auf und nennen Sie Stückzahl und Modell. So kann das Angebot den gesamten Aufbau berücksichtigen.",
  },
  kuechenmontage: {
    title: "Küchenmontage",
    price: startingPrices.kuechenmontage,
    intro:
      "Wir setzen Küchen aus einzelnen Schränken zusammen, richten sie aus und passen Fronten, Auszüge und Arbeitsplatten an.",
    preparation:
      "Nennen Sie Küchenform, Schrankzahl, gewünschte Anschlüsse und Arbeiten an der Arbeitsplatte. Wenn ein Plan vorliegt, können Sie ihn zusammen mit Fotos der Stellwände beifügen.",
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

type MainServiceGuide = {
  price: string;
  preparation: string;
  planning: { title: string; text: string };
  onSite: { title: string; text: string };
  questions: { question: string; answer: string }[];
  businessLink: string;
  example?: {
    slug: string;
    stage: "before" | "after";
    heading: string;
    caption: string;
  };
};

export const mainServiceGuides: Record<string, MainServiceGuide> = {
  lieferungen: {
    price: "Eine Möbellieferung beginnt bei 39 €. Für Ihr Angebot zählen die Strecke zwischen Abholung und Lieferort, Anzahl und Gewicht der Packstücke sowie der Weg vom Fahrzeug bis zum vereinbarten Abstellplatz. Ein Sofa ins dritte Obergeschoss erfordert eine andere Planung als zwei flache Pakete, die Sie an der Haustür übernehmen.",
    preparation: "Nennen Sie beide Adressen und senden Sie die Packliste oder ein Foto der Etiketten. Entscheidend sind die Außenmaße der verpackten Teile. Bei einem gebrauchten Sofa helfen Fotos von Füßen, Armlehnen und der Verbindung zwischen den Sitzteilen. Daraus lässt sich erkennen, welche Teile sich für den Transport trennen lassen.",
    planning: {
      title: "Abholung im Möbelhaus abstimmen",
      text: "Teilen Sie uns mit, an welcher Warenausgabe die Bestellung bereitliegt, ab wann sie freigegeben ist und wann die Ausgabe schließt. Bei mehreren Bestellungen ordnen Sie die Packstücke bitte den jeweiligen Abholorten zu. Vor der Fahrt klären wir mit Ihnen, welchen Nachweis der Händler für die Übergabe verlangt und wer am Ziel erreichbar ist.",
    },
    onSite: {
      title: "Passt das längste Stück durchs Treppenhaus?",
      text: "Messen Sie bei langen Teilen die lichte Breite von Haustür und Wohnungstür sowie die Tiefe des engsten Treppenpodests. Bei einem Aufzug brauchen wir Türbreite, Kabinenhöhe und Kabinentiefe. Ein Foto vom Wendepunkt ist oft aussagekräftiger als die Angabe der Etage. Nennen Sie auch Hinterhofzugänge oder eine längere Strecke zwischen Haltemöglichkeit und Eingang.",
    },
    questions: [
      { question: "Kann die Lieferung direkt in das gewünschte Zimmer gehen?", answer: "Geben Sie Raum und Etage bereits bei der Anfrage an. Wir prüfen den Trageweg für die genannten Möbel und halten im Angebot fest, wo die Übergabe erfolgen soll. So wissen beide Seiten vor der Abholung, bis wohin die Leistung reicht." },
      { question: "Wie frage ich Lieferung und Aufbau zusammen an?", answer: "Ergänzen Sie die Modellliste um die Möbel, die am Ziel aufgebaut werden sollen. Wenn die Ware erst nachmittags abgeholt werden kann oder die Wohnung nur zeitweise zugänglich ist, geben Sie beide Zeitfenster an. Wir stimmen Liefertermin und möglichen Montagetermin mit Ihnen ab." },
    ],
    businessLink: "Anlieferungen an Betriebsstandorte anfragen",
  },
  moebelmontage: {
    price: `Für die Montage eines einzelnen KALLAX-Regals in Nürnberg beginnen die Preise bei ${singleItemPrices.kallax}, für eine einzelne HEMNES-Kommode bei ${singleItemPrices.hemnes}. Der Aufwand hängt von den einzelnen Möbeln ab. Ein Bettgestell mit vier Seitenteilen lässt sich anders kalkulieren als ein Schrank derselben Breite mit Schiebetüren, Schubladen und Innenbeleuchtung. Geben Sie pro Möbel die Modellbezeichnung, die gewünschte Ausstattung und die Stückzahl an. Sie erhalten den Preis für den vereinbarten Umfang vor der Beauftragung.`,
    preparation: "Ein Produktlink, die Artikelnummer oder ein Foto der Anleitung genügt meist zur ersten Zuordnung. Ergänzen Sie Breite, Höhe und Tiefe des Möbels sowie die verfügbare Raumhöhe. Bei einem bereits genutzten Möbel helfen Bilder der zerlegten Teile, Beschläge und Rückwände. Vermerken Sie fehlende Schrauben, ausgerissene Verbinder oder Teile, die miteinander verbunden bleiben sollen.",
    planning: {
      title: "Den Stellplatz ausmessen",
      text: "Messen Sie zwischen den engsten Punkten am vorgesehenen Standort. Eine Sockelleiste, ein Heizkörper oder eine hervorstehende Fensterbank kann den nutzbaren Platz einschränken. Prüfen Sie auch, wohin Türen aufschwingen und wie weit sich Auszüge öffnen lassen. Wenn mehrere Schränke nebeneinander stehen sollen, zeigt eine einfache Skizze die Reihenfolge und die gewünschte Anschlagseite.",
    },
    onSite: {
      title: "Was am Montagetag bereitliegen sollte",
      text: "Ordnen Sie Kartons und Beschläge nach Möglichkeit dem jeweiligen Zimmer zu. Am Aufbauort brauchen die Monteure Platz zum Auslegen langer Seitenwände und Zugang zu den Befestigungspunkten. Ist eine Wandbefestigung vorgesehen, teilen Sie den bekannten Wandaufbau mit. Fotos vom leeren Stellplatz und von auffälligen Leitungsführungen helfen, offene Fragen vor dem Termin zu besprechen.",
    },
    questions: [
      { question: "Lassen sich einzelne Schränke und Kommoden gemeinsam buchen?", answer: "Ja. Listen Sie die Modelle raumweise auf und markieren Sie die Möbel, deren Aufbau zuerst erfolgen soll. So lassen sich Anfahrt, Reihenfolge und benötigter Platz für den ganzen Auftrag planen." },
      { question: "Was ist bei gebrauchten Möbeln wichtig?", answer: "Fotos vom aufgebauten Zustand helfen beim Zuordnen der Teile. Bewahren Sie Beschläge nach Möbelstück getrennt auf und teilen Sie uns bekannte Schäden mit. So lässt sich vorab klären, welche Arbeiten mit den vorhandenen Teilen möglich sind." },
    ],
    businessLink: "Möbelmontage für Büro- und Gewerberäume",
    example: { slug: "weisse-messekueche", stage: "before", heading: "Korpusse und Auszugsschienen", caption: "Die Aufnahme von der weißen Messeküche zeigt die Schrankkorpusse vor der Inselverkleidung. Die offenen Seiten geben den Blick auf die später verdeckten Auszugsschienen frei." },
  },
  kuechenmontage: {
    price: "Die Küchenmontage beginnt bei 149 €. Für das konkrete Angebot zählen Zahl und Anordnung der Schränke, Länge und Material der Arbeitsplatte, Ausschnitte sowie die vorgesehenen Geräte. Eine bereits zugeschnittene Zeile erfordert andere Arbeitsschritte als eine Küche über Eck. Im Angebot legen wir fest, welche Montagearbeiten, Anpassungen und Gerätepositionen zum Auftrag gehören.",
    preparation: "Schicken Sie den Küchenplan mit Schrankbreiten und Gerätebezeichnungen. Hilfreich sind eine bemaßte Draufsicht, ein Foto jeder Stellwand und die Lage von Wasseranschlüssen, Steckdosen und Abluftöffnung. Bei einer gebrauchten Küche brauchen wir zusätzlich die Maße am neuen Standort und Bilder vorhandener Ausschnitte. Kennzeichnen Sie, welche Fronten, Geräte und Arbeitsplatten Sie wiederverwenden möchten.",
    planning: {
      title: "Arbeitsplatte, Ecken und Anschlüsse",
      text: "Geben Sie bei einer Arbeitsplatte Material und Stärke an. Für Spüle und Kochfeld helfen Modellnummer oder Einbauskizze, weil Außenmaß und benötigter Ausschnitt voneinander abweichen können. Bei einer Insel sind Durchgänge, Position der Geräte und der Weg der Anschlüsse wichtig. Wenn noch Bodenbelag oder Fliesenspiegel fehlen, nennen Sie den geplanten Stand zum Montagetermin.",
    },
    onSite: {
      title: "Die Montage vor Ort vorbereiten",
      text: "Teilen Sie uns mit, ob eine bestehende Küche den Stellplatz belegt, wann die neue Ware eintrifft und wo lange Platten gelagert werden können. Ein Foto des Zugangs hilft bei der Planung sperriger Teile. Nach dem Ausrichten der Schränke lassen sich Arbeitsplatte, Fronten und Auszüge anpassen. Welche Geräte eingebaut und welche Anschlussarbeiten separat organisiert werden, stimmen wir vorher ab.",
    },
    questions: [
      { question: "Kann ich eine teilweise aufgebaute Küche anfragen?", answer: "Ja. Fotografieren Sie den aktuellen Stand und markieren Sie im Plan die offenen Arbeiten. Geben Sie an, welche Schränke bereits befestigt sind und ob Platten, Beschläge und Geräte am Montageort bereitliegen." },
      { question: "Was hilft beim Umbau einer Küche über Eck?", answer: "Messen Sie beide Wandseiten und zeichnen Sie Türen, Fenster sowie feste Anschlusspunkte ein. Bei einer vorhandenen Arbeitsplatte ist die Lage des Eckstoßes wichtig. Damit lässt sich besprechen, welche Teile weitergenutzt werden können und wo Anpassungen nötig sind." },
    ],
    businessLink: "Montage für Ausstellungen und gewerbliche Projekte",
    example: { slug: "kueche-mit-holzinsel", stage: "after", heading: "Arbeitsplatte und Einbauten an einer Insel", caption: "An der fertig montierten Messeinsel sind Kochfeld und Spüle in die Platte in Holzoptik eingelassen. Die Vorheraufnahme im Projekt zeigt die Öffnungen vor dem Einbau." },
  },
};
