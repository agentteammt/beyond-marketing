# Prüfbericht Blog — SEO und GEO

Stand 27. August 2026 · geprüft: `blog/index.html` plus sechs Beitragsseiten,
`sitemap.xml`, `robots.txt`, `llms.txt`, strukturierte Daten, interne Verlinkung.

---

## Gesamtbild

Die technische Basis ist sauber und liegt über dem, was man bei einem neu
aufgesetzten Blog normalerweise sieht. Sieben crawlbare Seiten, alle mit
eigenem Title, eigener Description, selbstreferenzierendem Canonical, gültigem
JSON-LD und ohne Konsolenfehler. Kein JavaScript nötig, um den Text zu lesen —
genau das, was Suchmaschinen und KI-Systeme brauchen.

Die Lücken liegen nicht in der Technik. Sie liegen in der **Zitierfähigkeit**
der Texte: es fehlen Quellen, Zahlen und Zitate. Das ist ausgerechnet der
Bereich, den die eigenen Briefings als Hausaufgabe markiert hatten und der bei
GEO die stärkste Wirkung hat.

**Ironie am Rande:** der GEO-Beitrag empfiehlt „Konsens und Belege: externe
Erwähnungen, Studien und Fachzitate erhöhen die Chance spürbar" — und enthält
selbst keine einzige externe Quelle.

---

## Messwerte

| Seite | Title | Desc | H1 | H2 | Wörter | FAQ | Quellen |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /blog | 49 | 143 | 1 | 1 | 232 | – | 0 |
| generative-engine-optimization-geo | 62 | 146 | 1 | 12 | 1.711 | 7 | 0 |
| seo-mit-ki | 42 | 158 | 1 | 9 | 1.141 | 7 | 0 |
| marketing-automation-b2b | 56 | 146 | 1 | 10 | 1.102 | 7 | 0 |
| content-mit-ki-erstellen | 54 | 152 | 1 | 10 | 1.121 | 7 | 0 |
| ki-strategie-entwickeln | 61 | 157 | 1 | 9 | 1.099 | 7 | 0 |
| chatgpt-werbung | 55 | 136 | 1 | 10 | 1.686 | 7 | 0 |

Titles und Descriptions sind alle eindeutig, keine Duplikate, keine
Keyword-Kannibalisierung zwischen den sechs Themen (die Beiträge grenzen sich
im Text sogar ausdrücklich voneinander ab — vorbildlich).

---

## In diesem Durchgang behoben

| Befund | Was war | Was jetzt |
| --- | --- | --- |
| Titles zu lang | 65–73 Zeichen, weil ich „· team::mt" angehängt hatte — die Briefings hatten die Titles bewusst auf ≤ 60 getrimmt | Suffix entfernt, jetzt 42–62 Zeichen |
| Hub-Description zu lang | 165 Zeichen, wurde in der Suche abgeschnitten | 143 Zeichen |
| Entitäten-Signale dünn | `Organization` ohne `@id` und ohne `sameAs` | Feste `@id`, `sameAs` auf team-mt.de, LinkedIn, Instagram, YouTube, beide Adressen |
| Autoren ohne Identität | nur Name im Schema | Martina Manich mit `jobTitle`, `url`, LinkedIn-`sameAs`, `worksFor`; Team-Autoren mit `url` und `parentOrganization` |
| Keine Maschinenlesbarkeit für KI | – | `llms.txt` im Root: Kurzprofil, Leistungen, alle Seiten, alle sechs Beiträge mit Ein-Satz-Zusammenfassung |
| KI-Crawler nicht adressiert | nur `User-agent: *` | GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended ausdrücklich erlaubt |

`ki-strategie-entwickeln` (61) und `generative-engine-optimization-geo` (62)
liegen ein bis zwei Zeichen über der Richtlinie. Das sind die Original-Titles
aus den Briefings, deshalb unverändert gelassen — in der Praxis kein
Abschneiden.

---

## Offene Lücken, nach Wirkung sortiert

### 1. Keine einzige externe Quelle — hoch

Sechs Beiträge, null Verweise auf Studien, Statistiken oder Fachquellen. Die
Princeton-GEO-Untersuchung (KDD 2024) hat neun Optimierungsmethoden gegen
Perplexity gemessen; **Quellen zitieren war mit rund +40 % Sichtbarkeit der
stärkste Hebel**, Statistiken ergänzen mit rund +37 % der zweitstärkste. Für
Domains mit noch geringer Autorität war der Effekt deutlich größer.

Konkret fehlen Belege an Stellen, wo der Text ohnehin behauptet:

- „Die Konkurrenz um Plätze in KI-Antworten ist heute noch gering"
- „Suchbegriffe rund um KI-Sichtbarkeit und GEO wachsen rasant"
- „US-Suchvolumen chatgpt ads: von 50 auf 4.400 in acht Monaten"

Das letzte Beispiel steht bereits als Zahl im Briefing von Beitrag 6 — mit
Quellenangabe (Ahrefs oder Semrush, je nachdem woher sie stammt) wird daraus
ein zitierfähiger Satz.

**Zu tun:** zwei bis vier belegte Aussagen pro Beitrag, jeweils mit Link und
Datum. Nicht mehr — es sollen Belege sein, keine Fußnotensammlung.

### 2. Eigene Projektzahlen fehlen — hoch

Alle sechs Briefings verlangen das wörtlich („Vor Veröffentlichung eigene
Projektzahlen ergänzen", „Reale Vorher-Nachher-Zahlen aus Projekten
ergänzen"). Aktuell enthält jeder Beitrag vier bis sechs Zahlen, und die sind
fast alle weich („33 Jahre", „fünf Hebel", „in wenigen Wochen").

Originaldaten sind der einzige Inhalt, den kein Wettbewerber kopieren kann, und
für KI-Systeme das attraktivste Zitat. Ein Satz wie „Bei einem
Maschinenbau-Kunden stieg die Nennungsrate in ChatGPT innerhalb von vier
Monaten von 0 auf 6 von 20 Testfragen" ist mehr wert als drei Absätze
Erklärung.

**Zu tun:** pro Beitrag mindestens eine belastbare eigene Zahl.

### 3. Vier Beiträge liegen unter dem eigenen Wortziel — mittel

| Beitrag | Ziel laut Briefing | tatsächlich | Differenz |
| --- | --- | --- | --- |
| seo-mit-ki | 1.600–1.900 | 1.141 | −460 |
| marketing-automation-b2b | 1.600–1.900 | 1.102 | −500 |
| content-mit-ki-erstellen | 1.500–1.800 | 1.121 | −380 |
| ki-strategie-entwickeln | 1.700–2.000 | 1.099 | −600 |

Beitrag 1 (1.711) und Beitrag 6 (1.686) treffen ihr Ziel. Länge ist kein
Rankingfaktor an sich, aber die vier kürzeren decken ihr Thema messbar weniger
tief ab, als das Briefing vorgesehen hat. Google beantwortet eine Suchanfrage
inzwischen über mehrere parallel erzeugte Teilfragen („query fan-out") — wer
das Themenfeld nur halb abdeckt, wird für die Nebenfragen nicht abgerufen.

**Zu tun:** je Beitrag ein bis zwei zusätzliche H2-Abschnitte, die eine echte
Folgefrage beantworten. Kein Auffüllen.

### 4. Keine Experten-Zitate — mittel

Briefing 1 und 5 verlangen ausdrücklich „optional ein Original-Zitat der
Geschäftsführung". Zitate mit Name und Funktion sind in derselben Untersuchung
der dritte stärkste Hebel (rund +30 %) und tragen direkt auf E-E-A-T ein.

**Zu tun:** ein bis zwei Sätze wörtliche Rede von Martina Manich pro
Strategie-Beitrag, mit Name und Rolle ausgezeichnet.

### 5. Kein sichtbares Aktualisierungsdatum — mittel

`dateModified` steht im Schema, aber auf der Seite sieht der Leser nur das
Veröffentlichungsdatum. KI-Systeme gewichten Aktualität stark, und undatierte
oder scheinbar alte Inhalte verlieren gegen datierte.

**Zu tun:** „Zuletzt aktualisiert: [Datum]" in die Meta-Zeile, und `dateModified`
bei jeder Textänderung wirklich mitziehen. Sinnvoll erst, wenn die echten
Veröffentlichungsdaten gesetzt sind (bisher meine Platzhalter).

### 6. Beitrag 6 hängt intern schwach — mittel

Inbound-Links aus anderen Beiträgen:

| Beitrag | Verlinkt von |
| --- | --- |
| generative-engine-optimization-geo | 5 |
| ki-strategie-entwickeln | 4 |
| seo-mit-ki | 4 |
| marketing-automation-b2b | 2 |
| content-mit-ki-erstellen | 2 |
| **chatgpt-werbung** | **1** |

`chatgpt-werbung` ist inhaltlich der Beitrag mit dem stärksten Wachstumstrend
(Ziel-Keyword 320/Mo, Tendenz stark steigend) und bekommt intern am wenigsten
Gewicht.

**Zu tun:** aus Beitrag 3 und 4 je einen kontextuellen Link auf
`chatgpt-werbung` setzen.

### 7. Hub-Seite ist inhaltlich dünn — mittel

232 Wörter, im Wesentlichen Karten. Für eine Übersichtsseite ist das
grenzwertig; sie kann selbst kaum ranken und trägt wenig zur Themenautorität
bei.

**Zu tun:** 150 bis 250 Wörter Einordnung — worum es in diesem Blog geht, für
wen, wie die sechs Themen zusammenhängen. Gern mit Links auf die Beiträge im
Fließtext.

### 8. Kein eigenes Teilen-Bild pro Beitrag — niedrig

Alle sechs nutzen `assets/og-image.jpg`. Auf LinkedIn — dem wichtigsten Kanal
dieser Zielgruppe — sieht damit jeder geteilte Beitrag identisch aus.

**Zu tun:** sechs Bilder 1200 × 630 px, Titel als Text im Bild.

### 9. `HowTo`-Auszeichnung ungenutzt — niedrig

Vier Beiträge enthalten einen „In fünf Schritten"-Abschnitt, der sich als
`HowTo` auszeichnen ließe. Google zeigt dafür seit 2023 keine Rich Results
mehr, andere KI-Systeme lesen es aber weiterhin gern. Kleiner Hebel, geringer
Aufwand — Priorität nach allem oben.

### 10. Off-Page: dort, wo KI am häufigsten zitiert — nicht im Blog lösbar

Marken werden laut Auswertungen deutlich häufiger über Dritte zitiert als über
die eigene Domain; Wikipedia allein macht einen erheblichen Teil der
ChatGPT-Zitate aus. Der Blog kann das nicht ersetzen.

**Zu tun, außerhalb dieses Projekts:** Fachbeiträge in Branchenmedien, echte
Beteiligung in relevanten Communities, aktuelle Profile auf
Bewertungsplattformen, konsistente Unternehmensangaben überall. Genau das, was
der eigene GEO-Beitrag unter „externe Signale stärken" beschreibt.

---

## Was ausdrücklich in Ordnung ist

- Eine H1 pro Seite, saubere H2/H3-Hierarchie, keine Sprünge
- Ziel-Keyword in Title, H1, URL und in den ersten 100 Wörtern — bei allen sechs
- Definition früh im Text platziert (Voraussetzung für Featured Snippet und KI-Zitat)
- `BlogPosting` + `BreadcrumbList` + `FAQPage` auf allen Beiträgen, gültiges JSON
- Sieben FAQ-Paare pro Beitrag in natürlicher Fragesprache
- Vergleichstabellen dort, wo es um „X vs. Y" geht — das Format, das KI-Systeme am liebsten zitieren
- Alle Bilder mit beschreibendem Alt-Text, WebP bzw. komprimiertes JPEG, `loading="lazy"`
- Selbst gehostete Schriften, keine externen Requests, kein Render-Blocking durch Fremdcode
- Kein horizontales Scrollen, Layout ohne Sprünge (Bildcontainer haben feste Seitenverhältnisse)
- Sitemap mit neun URLs, `robots.txt` blockiert nichts, RSS vorhanden
- Keine Keyword-Kannibalisierung, kein Keyword-Stuffing (das würde die KI-Sichtbarkeit sogar senken)

---

## Reihenfolge für den nächsten Durchgang

1. Zwei bis vier belegte Aussagen pro Beitrag ergänzen (Punkt 1)
2. Je eine eigene Projektzahl pro Beitrag (Punkt 2)
3. Echte Veröffentlichungsdaten setzen, dann sichtbares Aktualisierungsdatum (Punkt 5)
4. Die vier kurzen Beiträge um je einen Abschnitt erweitern (Punkt 3)
5. Zitate der Geschäftsführung in Beitrag 1 und 5 (Punkt 4)
6. Interne Links auf `chatgpt-werbung` (Punkt 6), Hub-Text (Punkt 7)
7. Sechs OG-Bilder (Punkt 8)

Nach dem Livegang: `sitemap.xml` in der Google Search Console einreichen und
nach vier bis sechs Wochen für die sechs Ziel-Keywords prüfen, ob und wie
ChatGPT, Perplexity und die Google AI Overviews team::mt nennen. Ohne diese
Nullmessung lässt sich später nicht sagen, ob GEO gewirkt hat.
