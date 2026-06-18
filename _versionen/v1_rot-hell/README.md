# KI-Werkstatt — Landingpage (Tag der Industriekommunikation 2026)

Statische Website für die KI-Werkstatt von **team::mt**. **Kein Build-Schritt auf
dem Server nötig** — sie läuft so, wie sie ist, auf jedem statischen Host. Diese
Anleitung bringt sie über **GitHub → Vercel** online.

---

## Inhalt

- [Schnellstart](#schnellstart)
- [Lokale Vorschau](#lokale-vorschau)
- [Projektstruktur](#projektstruktur)
- [Konfiguration (Supabase & Google Analytics)](#konfiguration)
- [Buchungs-Backend einrichten (Supabase)](#buchungs-backend-einrichten-supabase)
- [Rechtsseiten & Datenschutz](#rechtsseiten--datenschutz)
- [Quellcode bearbeiten](#quellcode-bearbeiten)
- [Eigene Domain](#eigene-domain)

---

## Schnellstart

### Über die GitHub-Website
1. Repository öffnen → **„Add file" → „Upload files"**.
2. Den **gesamten Ordnerinhalt** hineinziehen. Achte darauf, dass die Ordner
   **`js/`** (inkl. `js/vendor/`) und **`assets/`** mit dabei sind.
3. Unten **„Commit changes"**.

### Über die Kommandozeile
```bash
git init
git add .
git commit -m "KI-Werkstatt Landingpage"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/DEIN-REPO.git
git push -u origin main
```

### Vercel
Repository in Vercel importieren — **Framework Preset: „Other"**, kein Build
Command, kein Output-Verzeichnis. Vercel liefert die Dateien direkt aus.
Jeder weitere Push deployt automatisch.

> Die mitgelieferte `vercel.json` setzt nur Cache-Header (Bilder/Fonts/Vendor
> langlebig, HTML/App-Code stets frisch) und aktiviert `cleanUrls` — damit
> funktionieren `/impressum` und `/datenschutz` ohne `.html`-Endung.

---

## Lokale Vorschau

Wegen der `fetch`-Aufrufe (Schriften, Module) muss die Seite über einen
**lokalen Server** laufen — ein Doppelklick auf `index.html` reicht nicht.

```bash
# Variante 1: Python (vorinstalliert auf macOS/Linux)
python3 -m http.server 8000

# Variante 2: Node
npx serve .
```
Dann `http://localhost:8000` öffnen.

---

## Projektstruktur

```
index.html               ← Einstiegspunkt (lädt js/ + Bibliotheken)
impressum.html           ← Impressum (DDG / § 18 MStV)
datenschutz.html         ← Datenschutzerklärung (DSGVO)

js/                      ← VORKOMPILIERT — nicht von Hand bearbeiten
  _hooks-global.js
  tweaks-panel.js  sections.js  heroIntro.js
  missionTimer.js  baustellenschild.js  app.js
  legal.js               ← Cookie-Consent-Banner + Footer-Rechtslinks
  vendor/                ← selbst gehostete Bibliotheken (kein CDN)
    react.production.min.js  react-dom.production.min.js
    three.min.js  gsap.min.js  ScrollTrigger.min.js  lenis.min.js

*.jsx                    ← QUELLCODE (hier bearbeiten, dann neu kompilieren)
hero3d.js                ← WebGL-Hero (Vanilla)
supabase.js              ← Anbindung der Buchung an Supabase
supabase-setup.sql       ← Datenbank-Setup (einmalig im Supabase-SQL-Editor)

assets/                  ← Bilder (WebP), Logos, Video, Schriften, Favicon
  fonts/                 ← selbst gehostete Schriften (Space Grotesk, Sora)
  legal-pages.css        ← Styles der Rechtsseiten

vercel.json  .gitignore  README.md
```

> **Performance:** Kein Babel im Browser (JSX ist zu `js/` vorkompiliert),
> React-Produktions-Build, Skripte mit `defer`, Bilder als WebP, das
> Hintergrund-Video lädt erst beim Scrollen. Schriften **und** Bibliotheken sind
> selbst gehostet — es gehen keine Anfragen an Google oder fremde CDNs.

---

## Konfiguration

Beide Einstellungen stehen oben in **`index.html`**:

### Supabase (Buchungsformular)
```html
<script>
  window.KIW_SUPABASE = {
    url: "https://DEINPROJEKT.supabase.co",
    anonKey: "DEIN_ANON_PUBLIC_KEY",
  };
</script>
```
- Den **anon public key** findest du im Supabase-Dashboard unter
  **Project Settings → API**. Er darf öffentlich im Code stehen
  (geschützt durch Row-Level-Security). **Niemals** den `service_role`-Key
  verwenden!
- **Beide Felder leer** = **Demo-Modus**: das Formular funktioniert, speichert
  aber nichts.

### Google Analytics (optional)
```html
<script>
  window.KIW_GA_ID = ""; // z. B. "G-XXXXXXXXXX"
</script>
```
- Leer = **kein** Analytics.
- Mit gültiger Mess-ID wird Google Analytics **erst nach Einwilligung** im
  Cookie-Banner geladen (Consent Mode v2, `anonymize_ip`).

---

## Buchungs-Backend einrichten (Supabase)

1. Auf [supabase.com](https://supabase.com) ein Projekt anlegen
   (Server-Region möglichst **EU/Frankfurt**).
2. Im Dashboard **SQL Editor → New query** öffnen, den **kompletten Inhalt von
   `supabase-setup.sql`** einfügen und ausführen. Das legt Tabellen, die beiden
   Funktionen, die Sicherheitsregeln und die Termin-Slots an.
3. URL + anon-Key (Schritt oben) in `index.html` eintragen.

Die Slots sind aktuell **13:15 – 14:15** und **15:30 – 16:30** (10-Min-Takt,
je 3 Plätze). Zum Ändern die `insert`-Werte in `supabase-setup.sql` anpassen
bzw. die Tabelle `slots` direkt im Supabase-Table-Editor pflegen.

---

## Rechtsseiten & Datenschutz

- **`impressum.html`** und **`datenschutz.html`** sind fertig mit den Daten der
  team::mt gmbh befüllt und aus dem Footer verlinkt.
- Das **Cookie-Banner** (`js/legal.js`) erscheint beim ersten Besuch; die Wahl
  ist jederzeit über **„Cookie-Einstellungen"** im Footer änderbar.
- **Vor dem Livegang noch erledigen** (in der Datenschutzerklärung als gelbe
  Hinweise markiert): Auftragsverarbeitungsverträge (AVV) mit **Vercel**,
  **Supabase** und ggf. **Google** abschließen; bei aktivem Analytics den
  GA-Abschnitt bestätigen. Eine anwaltliche Endprüfung wird empfohlen.

---

## Quellcode bearbeiten

`index.html` lädt die **kompilierten** Dateien aus `js/`. Wer Aussehen/Verhalten
ändern will, bearbeitet die **`.jsx`-Quelle** und lässt sie neu zu `js/` kompilieren
(Babel-Preset „react"). Eine direkte Änderung an `js/*.js` geht beim nächsten
Kompilieren verloren.

Reine Stil-/Textänderungen ohne Logik lassen sich auch direkt im `<style>`-Block
bzw. in den HTML-Dateien vornehmen.

---

## Eigene Domain

Vercel-Projekt → **Settings → Domains** → Domain hinzufügen und den angezeigten
DNS-Eintrag beim Anbieter setzen.
