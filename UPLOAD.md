# GitHub-Upload — was in dieses Paket gehört und was sich geändert hat

Dieser Ordner ist die **vollständige, deploybare Website**. Alle Dateien
gehören ins Repository-Root. Jede lokale Referenz in allen zehn HTML-Seiten ist
geprüft und auflösbar — es fehlt nichts.

Auf Vercel ist **kein Build Command** und **kein Output-Verzeichnis** nötig.
`vercel.json` ist unverändert; `cleanUrls: true` war schon aktiv und liefert die
neuen Blogseiten ohne `.html`-Endung aus.

---

## Variante A — alles hochladen (empfohlen, sicher)

GitHub-Website → Repository öffnen → **Add file → Upload files** → den
**gesamten Inhalt dieses Ordners** hineinziehen → **Commit changes**.

Achte darauf, dass die Ordner `js/` (inkl. `js/vendor/`), `assets/`
(inkl. `assets/fonts/`, `assets/leistungen/`, `assets/team/`, `assets/blog/`)
und `blog/` mit dabei sind.

Über die Kommandozeile:

```bash
git add .
git commit -m "Blog mit sechs Beiträgen, SEO/GEO-Grundlagen, Navigation"
git push
```

## Variante B — nur die Änderungen committen

### Neu (15 Dateien)

```
blog/index.html
blog/generative-engine-optimization-geo.html
blog/seo-mit-ki.html
blog/marketing-automation-b2b.html
blog/content-mit-ki-erstellen.html
blog/ki-strategie-entwickeln.html
blog/chatgpt-werbung.html
blog/feed.xml
assets/blog.css
assets/blog/chatgpt-werbung.png
assets/blog/content-mit-ki.png
js/blog-booking.js
llms.txt
BLOG-ANLEITUNG.md
SEO-GEO-AUDIT.md
```

### Geändert (5 Dateien)

| Datei | Was |
| --- | --- |
| `js/app.js` | „Blog" in Header-Navigation, Mobil-Menü (als Punkt 04) und Footer-Navigation |
| `js/legal.js` | Impressum- und Datenschutz-Links root-absolut (`/impressum`, `/datenschutz`) — vorher relativ, damit aus `/blog/` heraus 404 |
| `index.html` | Cache-Buster: `js/app.js?v=88`, `js/legal.js?v=4` |
| `assets/blog.css` | Blog-Stylesheet, aktuell als `?v=10` eingebunden |
| `js/blog-booking.js` | **neu** — Erstgespräch-Buchung auf den Blogseiten, nutzt dieselbe `window.KIWBooking`-API (Supabase) wie das Hauptformular |
| `sitemap.xml` | 3 → 9 URLs (Blog-Hub plus sechs Beiträge) |
| `robots.txt` | GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended ausdrücklich erlaubt; Sitemap-Verweis unverändert |

**Wichtig bei Variante B:** `js/app.js` und `js/legal.js` müssen zusammen mit
`index.html` hochgeladen werden. Ohne den neuen Cache-Buster in `index.html`
liefern Browser die alten JS-Dateien aus, dann fehlt der Blog-Link in der
Navigation und die Rechtslinks bleiben kaputt.

---

## Was NICHT hochgeladen wird

Diese Ordner liegen im Arbeitsprojekt, sind aber alte Zwischenstände und dürfen
das Repository nicht erreichen:

```
deploy/  _deploy/  _versionen/  _export-github/  _github-push/
github-push/  push-update/  webseite/  uploads/  screenshots/
content/  formular-paket/  *.dc.html  app.jsx  *.jsx
```

Sie enthalten den Blog nicht und würden beim Deployment nur Verwirrung stiften.
Falls in deinem Repository bereits ein `deploy/`-Ordner live geht statt des
Roots: sag Bescheid, dann spiegele ich den Blog dorthin.

---

## Nach dem Deployment prüfen

1. `https://beyond-marketing.team-mt.de/blog` lädt und zeigt sechs Beiträge
2. `https://beyond-marketing.team-mt.de/blog/seo-mit-ki` lädt **ohne** `.html`
3. „Blog" erscheint in der Hauptnavigation und im Footer der Startseite
4. Im Footer einer Blogseite führen Impressum und Datenschutz auf echte Seiten
5. `https://beyond-marketing.team-mt.de/llms.txt` und `/robots.txt` sind erreichbar
6. `sitemap.xml` in der Google Search Console neu einreichen
7. Eine Beitragsseite durch den [Rich Results Test](https://search.google.com/test/rich-results)
   schicken — erwartet werden `BlogPosting`, `BreadcrumbList` und `FAQPage`

Die offenen inhaltlichen Punkte stehen in `SEO-GEO-AUDIT.md`, die Anleitung für
Beitrag 7 in `BLOG-ANLEITUNG.md`.
