import { pageMetadata } from "@/lib/page-metadata";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { businessInfo } from "@/lib/data";

export const metadata = pageMetadata(
  "Datenschutzerklärung | Möbelmontage Nürnberg",
  "Datenschutzerklärung von Möbelmontage Nürnberg",
  "/datenschutz",
);

export default function DatenschutzPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="studio-legal pb-16 pt-12">
        <div className="container-max">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">
              Datenschutzerklärung
            </h1>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-bold mb-4">
                  1. Datenschutz auf einen Blick
                </h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Allgemeine Hinweise
                </h3>
                <p className="text-foreground">
                  Die folgenden Hinweise geben einen einfachen Überblick
                  darüber, was mit Ihren personenbezogenen Daten passiert, wenn
                  Sie diese Website besuchen. Personenbezogene Daten sind alle
                  Daten, mit denen Sie persönlich identifiziert werden können.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">
                  2. Datenerfassung auf dieser Website
                </h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Wer ist verantwortlich für die Datenerfassung?
                </h3>
                <p className="text-foreground">
                  Die Datenverarbeitung auf dieser Website erfolgt durch den
                  Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum
                  dieser Website entnehmen.
                </p>

                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Wie erfassen wir Ihre Daten?
                </h3>
                <p className="text-foreground">
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns
                  diese mitteilen. Hierbei kann es sich z.B. um Daten handeln,
                  die Sie in ein Kontaktformular eingeben.
                </p>
                <p className="text-foreground mt-2">
                  Andere Daten werden automatisch beim Besuch der Website durch
                  unsere IT-Systeme erfasst. Das sind vor allem technische Daten
                  (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des
                  Seitenaufrufs).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">
                  3. Kontaktformular
                </h2>
                <p className="text-foreground">
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen,
                  werden Ihre Angaben aus dem Anfrageformular inklusive der von
                  Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der
                  Anfrage und für den Fall von Anschlussfragen bei uns
                  gespeichert. Wenn Sie Fotos oder Pläne auswählen, bereitet
                  Ihr Browser die Dateien vor. Erst beim Absenden werden sie
                  mit Ihrer Anfrage über unseren E-Mail-Dienst an unseren
                  Betrieb übermittelt. Für Rückrufwünsche verwenden wir die
                  angegebene Telefonnummer und Ihre freiwilligen Zeitangaben.
                </p>
                <p className="text-foreground mt-2">
                  Nach der Annahme durch unseren E-Mail-Dienst übertragen wir für die
                  Bearbeitung eine Zusammenfassung an unsere Anfrageübersicht in Google
                  Sheets. Dazu gehören Name, angefragte Leistung, Anfragenummer,
                  Priorität sowie eine angegebene E-Mail-Adresse und Postleitzahl.
                  Mit Ihrer Zustimmung zur Statistik kann die Übersicht auch die
                  Besuchsquelle und eine Google-Klickkennung enthalten. Fotos,
                  Pläne und Telefonnummern bleiben der Anfrage per E-Mail vorbehalten.
                </p>
                <p className="text-foreground mt-2">
                  Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6
                  Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung
                  eines Vertrags zusammenhängt oder zur Durchführung
                  vorvertraglicher Maßnahmen erforderlich ist.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">
                  4. Cookies
                </h2>
                <p className="text-foreground">
                  Wir speichern Ihre Auswahl zur optionalen Statistik und
                  die von Ihnen gewählte Darstellung lokal in Ihrem Browser.
                </p>
                <p className="text-foreground mt-2">
                  Das Anfrageformular funktioniert auch bei ausgeschalteter
                  Statistik. Unter „Cookie-Einstellungen“ am Seitenende können
                  Sie Ihre Auswahl jederzeit ändern.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">
                  5. Analyse-Tools und Werbung
                </h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  Google Analytics
                </h3>
                <p className="text-foreground">
                  Nach Ihrer Zustimmung laden wir den Webanalysedienst Google
                  Analytics. Anbieter ist die Google Ireland Limited
                  (&ldquo;Google&rdquo;), Gordon House, Barrow Street, Dublin 4,
                  Irland.
                </p>
                <p className="text-foreground mt-2">
                  Google Analytics verwendet Cookies für Nutzungsstatistiken.
                  Wir messen insbesondere Seitenaufrufe und Kontaktaktionen.
                  Bei erlaubter Statistik ordnen wir Anfragen gegebenenfalls
                  einer Kampagne zu und speichern deren Kennungen bis zu
                  30 Tage im Browser. Die Nutzungsdaten können an Server von
                  Google in den USA übertragen werden.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">
                  6. Ihre Rechte
                </h2>
                <p className="text-foreground">
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über
                  Herkunft, Empfänger und Zweck Ihrer gespeicherten
                  personenbezogenen Daten zu erhalten. Sie haben außerdem ein
                  Recht, die Berichtigung oder Löschung dieser Daten zu
                  verlangen.
                </p>
                <p className="text-foreground mt-2">
                  Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt
                  haben, können Sie diese Einwilligung jederzeit für die Zukunft
                  widerrufen. Außerdem haben Sie das Recht, unter bestimmten
                  Umständen die Einschränkung der Verarbeitung Ihrer
                  personenbezogenen Daten zu verlangen.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">
                  7. Kontakt
                </h2>
                <p className="text-foreground">
                  Bei Fragen zum Datenschutz können Sie uns jederzeit
                  kontaktieren:
                </p>
                <p className="text-foreground mt-2">
                  {businessInfo.name}
                  <br />
                  E-Mail: {businessInfo.email}
                  <br />
                  Telefon: {businessInfo.phone}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
