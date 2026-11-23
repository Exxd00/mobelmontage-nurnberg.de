import type { BusinessInquiry } from "./business-inquiries";

type BusinessGuide = {
  title: string;
  description: string;
  intro: string;
  offerLabel: string;
  sections: { heading: string; text: string }[];
  photo: {
    project: string;
    file: string;
    alt: string;
    caption: string;
    link: string;
  };
  serviceLabel: string;
};

export const businessGuides = {
  buero: {
    title: "Büromöbelmontage in Nürnberg",
    description: "Schreibtische, Aktenschränke und Regale für Ihren Betrieb aufbauen lassen. So planen Sie Stückliste, Raumbelegung und Montagetermin.",
    intro: "Ein neuer Arbeitsplatz ist schnell bestellt. Sollen gleich mehrere Räume eingerichtet werden, muss schon vor dem ersten Paket klar sein, welcher Tisch wohin gehört. Wir planen den Aufbau Ihrer Büromöbel in Nürnberg und Umgebung anhand der Möbelmodelle, der Raumaufteilung und der Zeiten, zu denen wir in den Betrieb können.",
    offerLabel: "Büromontage anfragen",
    sections: [
      { heading: "Welche Möbel kommen in welchen Raum?", text: "Eine Tabelle mit Raum, Möbelmodell und Stückzahl genügt für den Einstieg. Ergänzen Sie jeweils, ob die Teile neu verpackt sind oder aus einem bisherigen Büro stammen. Bei gebrauchten Schränken helfen Fotos von Beschlägen und Verbindungen. Kennzeichnen Sie am Grundriss Türen, Heizkörper und die gewünschte Stellrichtung der Tische. So lassen sich Schranktüren und Auszüge bei der Aufstellung berücksichtigen." },
      { heading: "Wie bleibt der Betrieb während des Aufbaus erreichbar?", text: "Sollen Besprechungsräume tagsüber nutzbar bleiben, geben Sie die freien Zeitfenster je Raum an. Nennen Sie den Zugang für das Montageteam, die Etage, den Aufzug und einen Platz für die Kartons. Bei einem Aufbau in Etappen können wir anhand Ihrer Liste besprechen, welche Arbeitsplätze zuerst gebraucht werden. Hilfreich ist eine Person vor Ort, die Rückfragen zum Stellplan beantworten kann. Wenn Tische höhenverstellbar sind, nennen Sie außerdem das Gestellmodell und legen Sie die zugehörige Anleitung sowie die beschrifteten Steuerkabel am jeweiligen Arbeitsplatz bereit." },
      { heading: "Was gehört in das Angebot?", text: "Teilen Sie uns mit, ob Sie nur den Aufbau, zusätzlich einen Abbau am bisherigen Standort oder auch den Transport wünschen. Fügen Sie Modellbezeichnungen, Händlerlinks oder eine Bestellübersicht bei. Bei Wandbefestigungen benötigen wir Angaben zur Wand und zur gewünschten Position. Auf dieser Grundlage klären wir offene Punkte, stimmen den Leistungsumfang ab und nennen Ihnen den Preis für die angefragten Arbeiten." },
    ],
    photo: { project: "kueche-mit-holzinsel", file: "regal", alt: "Offene Holzfächer mit einer senkrechten Lichtleiste an der Rückwand", caption: "Regaldetail aus unserer dokumentierten Messeküche. Das Bild zeigt die Einteilung der Fächer zwischen zwei geschlossenen Schränken.", link: "Regal im Messeprojekt ansehen" },
    serviceLabel: "Möbelmontage und Richtpreise",
  },
  ausstellung: {
    title: "Ausstellungsküche für Messe und Showroom montieren lassen",
    description: "Montage einer Küchenpräsentation für Messe oder Showroom in Nürnberg anfragen. Pläne, Zufahrt, Standzeiten und Präsentation vorbereiten.",
    intro: "Wenn sich die Türen für die ersten Besucher öffnen, sollen Fronten, Insel und Arbeitsplatte an ihrem Platz sein. Für die Montage einer Ausstellungsküche in Nürnberg und Umgebung klären wir mit Ihnen den verfügbaren Standplatz, die Anlieferung und den letzten möglichen Zeitpunkt für die Übergabe.",
    offerLabel: "Ausstellungsmontage anfragen",
    sections: [
      { heading: "Welcher Plan gilt für den Aufbau?", text: "Schicken Sie die freigegebene Planversion mit Grundriss, Ansichten und Maßen. Markieren Sie, welche Seiten der Insel dem Publikum zugewandt sind und wo Wangen, Sichtblenden oder offene Fächer sitzen. Bei mehreren Exponaten hilft eine gemeinsame Liste mit Standposition und Modellnummer. Geben Sie an, ob Geräte rein zur Präsentation eingebaut werden oder im Betrieb vorgeführt werden sollen." },
      { heading: "Wie greifen Anlieferung und Montage ineinander?", text: "Für einen Messestand brauchen wir Halle, Standnummer, Zufahrt und die vom Veranstalter freigegebenen Einfahrtzeiten. Im Showroom zählen auch Öffnungszeiten und nutzbare Lagerflächen. Nennen Sie die Kontaktperson für Warenannahme und Standfreigabe. Wenn Bodenleger, Standbauer oder andere Gewerke parallel arbeiten, vermerken Sie, ab wann die Stellfläche frei ist und wann die Küche für den nächsten Arbeitsschritt übergeben werden muss." },
      { heading: "Was passiert zwischen Aufbau und Übergabe?", text: "Aus dem Plan leiten wir ab, wie die Korpusse aufgestellt werden und wann sich Arbeitsplatte, Auszüge und Fronten montieren lassen. Zum Abschluss lässt sich am Stand gemeinsam prüfen, ob Schubladen frei laufen und die sichtbaren Fugen zum Entwurf passen. Soll die Küche nach der Veranstaltung wieder abgebaut werden, nennen Sie schon in der Anfrage das Abbauzeitfenster und wer die Teile übernimmt. Teilen Sie dem Team mit, welche Fronten, Glasböden und Zubehörteile für den Rücktransport einzeln gekennzeichnet werden sollen und wo die zugehörigen Originalverpackungen aufbewahrt werden." },
    ],
    photo: { project: "gruene-winkelkueche", file: "hero-1080", alt: "Fertig montierte grüne Winkelküche mit Holzdekor und integriertem Kochfeld", caption: "Die grüne Winkelküche aus unserer Messeserie. Im Projekt sehen Sie auch die Ausrichtung der Korpusse und den Eckstoß der Arbeitsplatte.", link: "Montageschritte der Winkelküche ansehen" },
    serviceLabel: "Küchenmontage und Richtpreise",
  },
  lieferung: {
    title: "Möbellieferung für Betriebe in Nürnberg",
    description: "Möbel für Büro oder Geschäft abholen und zum vereinbarten Übergabepunkt liefern lassen. Abholfreigabe, Packmaße und Tragewege klären.",
    intro: "Sollen neue Büromöbel vom Händler in Ihren Betrieb oder vorhandene Möbel von einem Standort zum anderen? Für eine gewerbliche Möbellieferung in Nürnberg und Umgebung planen wir Abholung und Übergabe anhand von zwei Adressen, den Packstücken und den Zeitfenstern auf beiden Seiten.",
    offerLabel: "Lieferung anfragen",
    sections: [
      { heading: "Was wird wo abgeholt?", text: "Geben Sie Abholadresse, Bestellnummer und Ansprechpartner an der Ausgabe an. Liegt die Ware zur Abholung bereit oder muss ein Termin gebucht werden? Eine Packliste mit Anzahl, Maßen und Gewichten hilft bei der Einschätzung. Bei langen Tischplatten, Glasfronten oder bereits montierten Schränken schicken Sie möglichst ein Foto mit. Vermerken Sie auch, ob das Möbel verpackt ist und ob sich einzelne Teile abnehmen lassen." },
      { heading: "Bis wohin sollen die Möbel getragen werden?", text: "Die Lieferadresse allein sagt wenig über den Weg im Gebäude aus. Nennen Sie die vereinbarte Entladestelle und den gewünschten Übergabepunkt, etwa den Empfang im Erdgeschoss oder einen Besprechungsraum im zweiten Stock. Für sperrige Möbel sind Türbreiten, Treppenabsätze und die Innenmaße des Aufzugs wichtig. Sprechen Sie mit dem Hausdienst ab, wo das Fahrzeug halten kann und ob der Aufzug zu einer bestimmten Zeit reserviert werden muss." },
      { heading: "Wer übernimmt die Ware?", text: "Benennen Sie am Ziel eine erreichbare Person, die die Lieferung annehmen und den vorgesehenen Raum zeigen kann. Sind mehrere Abteilungen beteiligt, legen Sie der Packliste die Zuordnung zu den Räumen bei. Falls im Anschluss aufgebaut werden soll, führen Sie die betreffenden Modelle einzeln auf. Wir können so getrennt abstimmen, wie weit die Lieferung reicht und welche Montagearbeiten zusätzlich in Ihr Angebot gehören. Bei einer Übergabe an der Warenannahme erleichtern eine interne Bestellreferenz und die Telefonnummer der empfangenden Abteilung die Zuordnung zu Ihrem Auftrag." },
    ],
    photo: { project: "weisse-messekueche", file: "vorher", alt: "Offene Schrankkorpusse und Auszugsschienen einer weißen Kücheninsel während der Montage", caption: "Montageaufnahme aus dem Projekt Weiße Messeküche. Zu sehen sind die bereits aufgestellten Korpusse mit offenen Auszugsschienen.", link: "Weiteren Aufbau der Messeküche ansehen" },
    serviceLabel: "Möbellieferung und Richtpreise",
  },
  teekueche: {
    title: "Teeküchenmontage für Büros in Nürnberg",
    description: "Eine Teeküche für Pausenraum oder Büro montieren lassen. Erfahren Sie, welche Maße, Geräteangaben und Zugangszeiten für ein Angebot helfen.",
    intro: "Eine Zeile für Kaffee und Geschirr oder ein ganzer Pausenraum mit Kühlschrank und Spülmaschine? Für Ihre Teeküchenmontage in Nürnberg und Umgebung stimmen wir Schränke, Geräte und Arbeitsfläche auf den vorhandenen Raum ab. Der erste Schritt ist ein Küchenplan, auf dem sich vorhandene Teile und neue Elemente unterscheiden lassen.",
    offerLabel: "Teeküche anfragen",
    sections: [
      { heading: "Passt die Planung in den Pausenraum?", text: "Senden Sie den Grundriss mit Wandlängen, Raumhöhe und Position der Tür. Fotos von Nischen, Heizkörpern und Fenstern ergänzen die Maße. Bei einem kleinen Raum lohnt sich ein Blick auf die Nutzung im Alltag. Kann die Spülmaschine offen stehen, während jemand an den Kühlschrank muss? Gibt es über der Kaffeemaschine genug Platz bis zum Hängeschrank? Markieren Sie Engstellen und gewünschte Änderungen im Plan." },
      { heading: "Welche Geräte und Anschlüsse sind vorgesehen?", text: "Für Kühlschrank, Spülmaschine und Spüle helfen Modellnummern und Einbaumaße. Vermerken Sie, ob die Arbeitsplatte bereits zugeschnitten wurde und welche Ausschnitte noch fehlen. Auf einem Foto sollten Steckdosen, Wasseranschlüsse und Ablauf erkennbar sein. Falls Elektro- oder Sanitärarbeiten nötig sind, klären wir vorab, welche Leistungen im Montageangebot stehen und welche Termine Sie mit den zuständigen Fachbetrieben abstimmen müssen." },
      { heading: "Wie lässt sich die Montage mit dem Büroalltag vereinbaren?", text: "Nennen Sie die Liefertermine für Schränke und Geräte sowie die Zeiten, in denen der Pausenraum frei ist. Soll die alte Küchenzeile weichen, beschreiben Sie, was abgebaut, weiterverwendet oder gesondert abgeholt wird. Zur Übergabe lassen sich die Schrankausrichtung, die Bedienung der Auszüge und die Lage der eingesetzten Geräte gemeinsam durchgehen. Mit Raumfotos und Stückliste können wir Umfang und Zeitbedarf für Ihren Betrieb konkret einschätzen. Findet die Montage in einem bereits genutzten Pausenraum statt, planen Sie bitte auch eine vorübergehende Stellfläche für Geschirr, Kaffeemaschine und vorhandene Kleingeräte ein." },
    ],
    photo: { project: "weisse-messekueche", file: "spuelzeile-nachher", alt: "Schwarze Spüle in einer weißen Schrankzeile vor beleuchteten Wandregalen", caption: "Spülzeile aus der weißen Messeküche. Das Projektdetail zeigt das Zusammenspiel von Unterschränken, Arbeitsplatte und Spüle.", link: "Spülzeile vor und nach dem Einbau ansehen" },
    serviceLabel: "Küchenmontage und Richtpreise",
  },
} satisfies Record<BusinessInquiry, BusinessGuide>;
