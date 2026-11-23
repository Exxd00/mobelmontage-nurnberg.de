export type ProjectPhoto = {
  src: string;
  alt: string;
};

type Comparison = {
  title: string;
  before: ProjectPhoto;
  after: ProjectPhoto;
  beforeCaption: string;
  afterCaption: string;
};

export type KitchenProject = {
  slug: string;
  title: string;
  summary: string;
  cover: ProjectPhoto;
  shortTitle: string;
  comparisons: Comparison[];
  details?: { title: string; photo: ProjectPhoto; caption: string }[];
};

function photo(project: string, name: string, alt: string): ProjectPhoto {
  return { src: `/projekte/${project}/${name}.webp`, alt };
}

const white = "weisse-messekueche";
const wood = "kueche-mit-holzinsel";
const green = "gruene-winkelkueche";
const dark = "dunkle-inselkueche";

export const projects: KitchenProject[] = [
  {
    slug: white,
    title: "Weiße Küche mit Glasvitrinen",
    shortTitle: "Weiße Messeküche",
    summary: "Schwarz gerahmte Vitrinen verbinden die weiße Insel mit der Hochschrankwand dahinter. Eine zweite Zeile nimmt die Spüle auf.",
    cover: photo(white, "hero-1080", "Weiße Kücheninsel mit dunkler Arbeitsplatte vor beleuchteten Glasvitrinen"),
    comparisons: [
      {
        title: "Insel und Hochschrankwand",
        before: photo(white, "vorher", "Offene weiße Schrankkorpusse und Auszugsschienen an der Insel"),
        after: photo(white, "nachher", "Geschlossene Insel mit beleuchteten Glasfächern und eingebautem Backofen dahinter"),
        beforeCaption: "Die Schrankkorpusse stehen. An den offenen Stirnseiten sind die Schienen der späteren Auszüge zu sehen.",
        afterCaption: "Glas und weiße Fronten schließen die Insel ab. Dahinter sitzt der Backofen bündig zwischen Hochschrank und Vitrine.",
      },
      {
        title: "Die Spülzeile",
        before: photo(white, "spuelzeile-vorher", "Unterschränke ohne Fronten vor der gemusterten Wand der Spülzeile"),
        after: photo(white, "spuelzeile-nachher", "Weiße Schubladen, schwarze Spüle und beleuchtete Wandregale"),
        beforeCaption: "An der Wandzeile liegen die Auszüge noch offen. Die Unterschränke stehen auf sichtbaren Stellfüßen.",
        afterCaption: "Fronten und Sockel verdecken den Unterbau. Schwarze Armatur und beleuchtete Wandregale greifen die Farbe der Arbeitsplatte auf.",
      },
    ],
  },
  {
    slug: wood,
    title: "Kücheninsel in Holzoptik",
    shortTitle: "Küche mit Holzinsel",
    summary: "Eine breite Insel vereint Kochfeld, Spüle und Auszüge. Die Arbeitsplatte in Holzoptik läuft an der Stirnseite bis zum Boden.",
    cover: photo(wood, "hero-1080", "Insel in Holzoptik mit schwarzer Spüle und beigen Schubladen"),
    comparisons: [
      {
        title: "Von der offenen Insel zur fertigen Zeile",
        before: photo(wood, "vorher", "Offene Korpusse der Insel mit sichtbaren Auszugsschienen und Ausschnitten in der Platte"),
        after: photo(wood, "nachher", "Montierte Auszüge, Spüle und Kochfeld in der holzfarbenen Inselplatte"),
        beforeCaption: "Die Ausschnitte für Spüle und Kochfeld sind vorbereitet. Im offenen Korpus lassen sich die Auszugsschienen erkennen.",
        afterCaption: "Beige Fronten verdecken die Schienen. Kochfeld und schwarze Spüle sitzen auf beiden Seiten der durchgehenden Holzdekorfläche.",
      },
    ],
    details: [
      {
        title: "Das offene Regal",
        photo: photo(wood, "regal", "Offene Holzfächer mit einer senkrechten Lichtleiste an der Rückwand"),
        caption: "Zwischen den geschlossenen Hochschränken liegt ein schmales Regal. Seine Beleuchtung betont die einzelnen Fächer.",
      },
    ],
  },
  {
    slug: green,
    title: "Grüne Küche über Eck",
    shortTitle: "Grüne Winkelküche",
    summary: "Die Arbeitsplatte folgt dem Winkel der grünen Schränke. Vom offenen Regal am Eingang reicht die Zeile bis zu Spüle und Backofen.",
    cover: photo(green, "hero-1080", "Grüne Winkelküche mit Holzdekor, eingelassenem Kochfeld und Backofen"),
    comparisons: [
      {
        title: "Die Zeile entlang der Arbeitsplatte",
        before: photo(green, "vorher", "Grünes Stirnregal neben offenen Unterbauten und dem Ausschnitt für das Kochfeld"),
        after: photo(green, "nachher", "Fertige grüne Winkelküche mit geschlossenen Schubladen, Spüle und Oberschrank"),
        beforeCaption: "Geschlossene Wangen und Stirnregal stehen bereits. Die Öffnungen für Schubladen und Kochfeld geben den Blick auf den Aufbau frei.",
        afterCaption: "Die zweite Aufnahme zeigt die fertigen Fronten aus einem etwas anderen Blickwinkel. Über der Spüle sitzt ein verglaster Hängeschrank.",
      },
    ],
    details: [
      {
        title: "Unterschränke ausrichten",
        photo: photo(green, "waage", "Gelbe Wasserwaage über den grünen Unterschränken"),
        caption: "Vor der Arbeitsplatte wird die Höhe der benachbarten Korpusse mit der Wasserwaage geprüft.",
      },
      {
        title: "Auszüge befestigen",
        photo: photo(green, "schiene", "Eine Hand verschraubt die metallene Auszugsschiene im offenen Schrank"),
        caption: "Die Nahaufnahme zeigt die Verschraubung der Auszugsschiene an der Innenseite des Unterschranks.",
      },
      {
        title: "Arbeitsplatten einpassen",
        photo: photo(green, "platte", "Monteur hält zwei Arbeitsplatten am Eckstoß in Position"),
        caption: "Am Eckstoß hält der Monteur die Platten von oben in Position und greift von unten an die Verbindung.",
      },
    ],
  },
  {
    slug: dark,
    title: "Dunkle Insel mit Kupferakzenten",
    shortTitle: "Dunkle Inselküche",
    summary: "Eine kupferfarbene Spüle setzt sich von der dunklen Inselplatte ab. Zwei Standbilder aus dem Projektvideo zeigen den Einbau aus fast derselben Position.",
    cover: photo(dark, "hero-1080", "Anthrazitfarbene Kücheninsel mit kupferfarbener Spüle und schwarzem Kochfeld"),
    comparisons: [
      {
        title: "Spüle und Kochfeld an der Insel",
        before: photo(dark, "vorher", "Dunkle Insel mit zwei leeren Ausschnitten und offenen Schrankelementen"),
        after: photo(dark, "nachher", "Fertige Insel mit kupferfarbener Spüle, Kochfeld und geschlossenen Fronten"),
        beforeCaption: "In der Platte sind zwei Ausschnitte sichtbar. Darunter fehlen noch einzelne Fronten und Auszüge.",
        afterCaption: "Die Ausschnitte nehmen Spüle und Kochfeld auf. Die kupferfarbene Nischenrückwand greift den Ton des Beckens auf.",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
