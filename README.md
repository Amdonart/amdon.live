# Amdon.live

Persönlicher Linkhub mit hellem Pixelstil, klaren Linkflächen und einem animierten Codehintergrund. Oben steht das vorhandene Amdon-Logo. Alle Kanäle und Projekte sind direkt verlinkt.

Die Website besteht aus statischem HTML und CSS. Sie benötigt kein Framework, keine Datenbank, keine API-Schlüssel und keine externen JavaScript-Bibliotheken. Schrift und Grafiken liegen lokal bei.

## Lokal öffnen

Die Datei `index.html` lässt sich direkt im Browser öffnen. Für Prüfung und Vorschau über HTTP: Node.js 22 oder neuer installieren, dann im Projektordner ausführen:

```sh
npm ci
npm test
npm run dev
```

Vorschau: http://127.0.0.1:4173. Mit Strg+C beenden. Der Server ist ausschließlich lokal erreichbar und liefert nur öffentliche Website-Dateien aus.

## Dateien bearbeiten

- `index.html`: Startseite, Kanal- und Projektlinks, dekorative Codezeilen.
- `affiliate.html`: Partnerseite und Affiliate-Hinweis.
- `styles.css`: Layout, mobile Ansicht, Hover- und Codeanimationen.
- `assets/amdon-logo.png`: vorhandenes Logo.
- `assets/white-circuit.svg`: dezenter Leiterbahn-Hintergrund.
- `assets/fonts/`: Silkscreen samt zugehöriger OFL-Lizenz.
- `scripts/`: Prüfung, statischer Build und lokaler Vorschau-Server.
- `tests/`: HTTP-Tests für den Vorschau-Server.

Die Hintergrundtexte sind rein dekorative Codebeispiele; sie führen keine Aktionen aus. Bei reduzierter Bewegung in den Systemeinstellungen bleiben sie statisch und zeigen keine Glitches.

## Prüfen und bauen

```sh
npm test
npm run build
npm run preview
```

Der Build erstellt `dist/` ausschließlich aus den acht öffentlichen Dateien in `scripts/site-files.mjs`. Es werden keine Pakete benötigt. `npm ci` verwendet die mitgelieferte, abhängigkeitenfreie Lockdatei.

Die Prüfung kontrolliert HTML-Verschachtelung, interne Ziele, Asset-Pfade, eindeutige IDs, Verweise auf Beschriftungen und den Build-Umfang. Die HTTP-Tests prüfen ausgelieferte Dateitypen, Fehlerbehandlung und den Ausschluss lokaler Projektdateien. Externe Links und die optische Darstellung werden dadurch nicht vollständig geprüft.

## Auf GitHub bereitstellen

1. Ein leeres Repository erstellen und diese Projektdateien hochladen oder per Git pushen. Der Hauptbranch für den Workflow heißt `main`.
2. Für Hosting im Repository unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** wählen.
3. Der Workflow `.github/workflows/pages.yml` prüft Pull Requests. Pushes auf `main` werden nach erfolgreicher Prüfung gebaut und auf GitHub Pages veröffentlicht. Der Workflow lässt sich auch manuell starten.

Dokumentation: [GitHub Pages mit eigenem Workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Alle Website-Pfade sind relativ und funktionieren auch unter `https://BENUTZER.github.io/REPOSITORY/`. Eine eigene Domain ist noch nicht festgeschrieben: Für `amdon.live` die Domain in GitHub Pages eintragen und DNS nach GitHubs Anleitung konfigurieren. Soll eine `CNAME`-Datei mitgebaut werden, diese zusätzlich in `scripts/site-files.mjs` aufnehmen.

## Repository und lokale Metadaten

`dist/`, Abhängigkeiten, lokale Hostingdaten, Geheimnisse und der separate frühere Checkout `.sites-checkout/` sind per `.gitignore` ausgeschlossen. Die Git-Historie dieses separaten Checkouts bleibt lokal erhalten. Sie wird weder gebaut noch veröffentlicht. Der Projektordner selbst wurde nicht neu initialisiert, committed oder zu GitHub übertragen.

Es wird keine Lizenz für Logo oder eigene Inhalte neu vergeben. Für die Schrift gilt die beiliegende OFL-Lizenz.
