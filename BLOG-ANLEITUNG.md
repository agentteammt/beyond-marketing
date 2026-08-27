# Blog — Aufbau, Pflege, neuer Beitrag

## Wie der Blog technisch funktioniert

Der Blog ist **kein Teil der React-App**. Er besteht aus echten statischen
HTML-Dateien, die Vercel dank `cleanUrls: true` unter sauberen Adressen ohne
`.html` ausliefert:

| Datei | Öffentliche URL |
| --- | --- |
| `blog/index.html` | `/blog` |
| `blog/generative-engine-optimization-geo.html` | `/blog/generative-engine-optimization-geo` |
| `blog/seo-mit-ki.html` | `/blog/seo-mit-ki` |
| `blog/marketing-automation-b2b.html` | `/blog/marketing-automation-b2b` |
| `blog/content-mit-ki-erstellen.html` | `/blog/content-mit-ki-erstellen` |
| `blog/ki-strategie-entwickeln.html` | `/blog/ki-strategie-entwickeln` |
| `blog/chatgpt-werbung.html` | `/blog/chatgpt-werbung` |
| `blog/feed.xml` | `/blog/feed.xml` (RSS) |

Jede Seite liefert Text, Überschriften, Meta-Angaben und strukturierte Daten
**in der ersten Server-Antwort** — ohne JavaScript. Genau das ist der Grund für
diese Bauweise: Suchmaschinen und KI-Systeme brauchen kein Rendering.

Gestyled wird alles über eine Datei: `assets/blog.css`.

## Was pro Beitrag gesetzt ist

- Eigener `<title>`, `meta description`, `canonical`, OG- und Twitter-Tags
- `BlogPosting`- und `BreadcrumbList`-Schema, bei FAQ zusätzlich `FAQPage`
- Autor mit Foto (E-E-A-T), Datum, Lesezeit, Inhaltsverzeichnis
- CTA-Kästen auf die Sprungmarken der Startseite, Kurz-Kontaktformular vor den FAQ
- Drei verwandte Beiträge am Ende, plus kontextuelle Links im Fließtext

Alle Werte stammen aus den Briefing-Tabellen der Word-Dateien (Meta-Title,
Meta-Description, URL-Slug, Ziel-Keyword, Sprungmarken, CTA-Labels).

## Interne Verlinkung (Quervernetzung)

- **Hub → Beitrag:** Übersichtsseite verlinkt alle sechs.
- **Beitrag → Beitrag:** je drei „Weiterlesen"-Karten plus die erste Nennung
  eines Fachbegriffs im Text (`GEO`, `SEO mit KI`, `Marketing Automation`,
  `KI-Strategie`, `ChatGPT Werbung`, `Content mit KI`).
- **Beitrag → Leistung:** die Briefing-Sprungmarken sind auf die echten Anker
  der Live-Seite gemappt:

| Briefing | echte URL |
| --- | --- |
| `#geo-check` | `/#leistung-02` |
| `#ki-audit` | `/#leistung-01` |
| `#linkedin` | `/#leistung-03` |
| `#landingpages` | `/#leistung-04` |
| `#automatisierung` | `/#leistung-05` |
| `#seo` | `/#leistungen` |
| `#team` | `/#/team` |
| `#ansatz` | `/#/ansatz` |
| `#kontakt` | `/#kontakt` |

- **Startseite → Blog:** „Blog" in Hauptnavigation, Mobil-Menü und Footer
  (`js/app.js`).

## Neuen Beitrag anlegen (Beitrag 7)

1. Eine bestehende Datei kopieren, z. B.
   `blog/seo-mit-ki.html` → `blog/mein-neues-thema.html`.
2. Im `<head>` austauschen: `<title>`, `meta description`, `canonical`,
   `og:url`, `og:title`, `og:description`, `twitter:*`,
   `article:published_time`, `article:section`.
3. Im JSON-LD austauschen: `headline`, `name`, `description`, `url`, `@id`,
   `datePublished`, `dateModified`, `keywords`, `articleSection`, `author`,
   den dritten `BreadcrumbList`-Eintrag und die `FAQPage`-Fragen.
4. Im Body austauschen: Eyebrow, `<h1>`, Autorenzeile, Inhaltsverzeichnis
   (`.toc` — ein `<li>` pro `<h2>`, `href` = die `id` der Überschrift),
   Fließtext, FAQ-`<details>`, Autorenbox, die drei „Weiterlesen"-Karten.
5. `sitemap.xml`: einen `<url>`-Block ergänzen.
6. `blog/feed.xml`: einen `<item>`-Block ergänzen.
7. `blog/index.html`: eine `.card` in das `.cards`-Raster einfügen und den
   Zähler in `.hub-count` erhöhen.
8. In zwei bis drei bestehenden Beiträgen einen Link auf den neuen setzen —
   sonst hängt er ohne interne Verlinkung im Raum.

## Offene Punkte

- **Veröffentlichungsdaten** sind gesetzt (14. Juli bis 18. August 2026), aber
  frei gewählt. Falls andere Daten gelten: in Beitrag (`<time>`,
  `article:published_time`, JSON-LD), `sitemap.xml`, `feed.xml` und
  `blog/index.html` anpassen.
- **OG-Bilder** nutzen aktuell das globale `assets/og-image.jpg`. Eigene
  1200×630-Bilder pro Beitrag verbessern das Teilen-Vorschaubild deutlich.
- **Kontaktformular** in den Beiträgen öffnet das E-Mail-Programm
  (`mailto:team@team-mt.de`). Für echten Versand ohne Mail-Client eine
  Supabase-Edge-Function oder einen Formular-Dienst anbinden — die Struktur
  liegt in `kontaktformular-einbindung.md`.
- **Eigene Projektzahlen** ergänzen: alle sechs Briefings verlangen das
  ausdrücklich („Vor Veröffentlichung eigene Projektzahlen ergänzen").
- **Deploy-Kopien** `deploy/` und `_deploy/` enthalten den Blog noch nicht.
  Der Blog liegt im Projekt-Root. Vor dem Livegang prüfen, welcher Ordner
  deployt wird, und `blog/`, `assets/blog/`, `assets/blog.css`,
  `sitemap.xml`, `js/app.js` und `js/legal.js` dorthin spiegeln.
- Nach dem Livegang `sitemap.xml` in der Google Search Console neu einreichen.
