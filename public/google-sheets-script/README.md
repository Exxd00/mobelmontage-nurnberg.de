# Anfrageübersicht in Google Sheets

Diese Vorlage gehört zum Tabellenblatt für Möbelmontage Nürnberg. Die Website sendet den Auftrag zuerst an das betriebliche Postfach. Sobald der E-Mail-Dienst die Nachricht angenommen hat, übermittelt sie eine Zusammenfassung an `SHEETS_WEBHOOK_URL`. Bestätigte Telefon- und WhatsApp-Klicks werden bei erlaubter Statistik als eigene Ereignisse erfasst.

## Tabelle und Bereitstellung

1. In der vorgesehenen Tabelle **Erweiterungen → Apps Script** öffnen. Bei einer vorhandenen Bereitstellung die aktive Version und die Zuordnung von Blatt und Spalten mit dem Beispiel unten vergleichen. Eigene Anpassungen beim Aktualisieren übernehmen.
2. Den geprüften Stand von `script.gs` speichern. Das Zielblatt hat die ID 0, bei anderen Vorlagen verwendet das Skript das erste Blatt.
3. Unter **Bereitstellen → Bereitstellungen verwalten** die vorhandene Web-App bearbeiten und eine neue Version auswählen. Bei einer neuen Tabelle eine Web-App für die Aufrufe vom Server einrichten. Die ausführende Identität benötigt Schreibrechte in der Zieltabelle.
4. Die URL der aktiven Web-App mit der geschützten Servervariable `SHEETS_WEBHOOK_URL` abgleichen. Die Website auf Vercel und die Web-App bei Google haben jeweils eine eigene Bereitstellung.

## Spalten

| Spalte | Inhalt |
|---|---|
| A | Eingangszeit in Berlin |
| B | Bearbeitungsstatus |
| C | Ereignistyp |
| D | Name oder Herkunft des Kontaktklicks |
| E | Angegebene E-Mail-Adresse |
| F | Angegebene Postleitzahl |
| G | Leistung |
| H | Priorität |
| I | Besuchsquelle bei erlaubter Statistik |
| J | Google-Klickkennung bei erlaubter Statistik |
| K | Bewertung |
| Zusätzliche Spalte „Anfragenummer“ | Referenz aus der E-Mail |

Beim ersten Eingang mit Referenz legt die Vorlage die Spalte „Anfragenummer“ rechts neben den belegten Spalten an, sofern sie hinter K noch fehlt. Bestehende Zeilen behalten ihre Werte. Ein wiederholter Eingang mit identischer Referenz bestätigt die vorhandene Zeile. Ältere Formulare sowie Telefon- und WhatsApp-Ereignisse sind ohne Referenz möglich.

## Eingang abgleichen

Meldet das Serverprotokoll `Sheet notification unconfirmed for MN-…`, zuerst im Postfach nach der Anfragenummer suchen und den tatsächlichen Eingang mit der Tabelle abgleichen. Fehlt der Eintrag, können die Angaben aus der vorhandenen E-Mail übernommen werden. Die Ausführungsprotokolle der aktiven Apps-Script-Version zeigen Fehler des Webhooks. Der erneute Versand einer Kundenanfrage ist für diesen Abgleich entbehrlich.
