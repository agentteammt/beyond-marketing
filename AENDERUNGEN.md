# Änderungen zum Pushen — team::mt Beyond Marketing

Diese Dateien ersetzen die gleichnamigen Dateien in deinem Repository
(Struktur wie im Projekt-Root). Beim Upload über GitHub einfach den Ordner
`js/` und die `index.html` hineinziehen und committen.

## Geänderte / neue Dateien
- `index.html`          — GEÄNDERT: Google-Ads-Config (KIW_ADS), neue Skripte
                          eingebunden, Cache-Versionen erhöht (app.js v85,
                          legal.js v2, anchors.js, ads-conversion.js).
- `js/app.js`           — GEÄNDERT: fehlende Sprungmarken-IDs ergänzt
                          (leistungen-index, herkunft, abschluss, ansatz-intro,
                          team-intro).
- `js/legal.js`         — GEÄNDERT: Cookie-Banner um Kategorie „Marketing"
                          (Google Ads) erweitert; Consent Mode v2 schaltet
                          ad_storage erst nach Einwilligung frei.
                          Speicher-Schlüssel auf v2 -> Besucher werden erneut
                          gefragt (rechtlich korrekt bei neuer Verarbeitung).
- `js/anchors.js`       — NEU: unsichtbare Deep-Link-Logik (geteilte Anker-Links
                          scrollen beim Öffnen zur richtigen Stelle).
- `js/ads-conversion.js`— NEU: feuert die Google-Ads-Conversion beim Klick auf
                          den Header-Button „Gespräch anfragen" — nur an Google
                          Ads, nur nach Marketing-Einwilligung.

## Vor dem Live-Gang beachten
- Google-Ads-Tracking läuft aktuell im TESTMODUS. Zum Scharfschalten in
  `index.html` bei `window.KIW_ADS` -> `test: false` setzen
  (schaltet nur die Konsolen-Logs ab, Funktion bleibt gleich).
- Prüfen, ob die Kontowährung in Google Ads EUR ist; sonst
  `KIW_ADS.currency` anpassen.

## Nicht enthalten (bewusst)
- `app.jsx` wurde NICHT geändert (ist veralteter Quellstand; die laufende
  Wahrheit ist `js/app.js`). Falls ihr später wieder aus `.jsx` kompiliert,
  müssen diese Änderungen dort nachgezogen werden.
