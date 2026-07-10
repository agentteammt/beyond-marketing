/* ============================================================
   Sprungmarken / Deep-Links (unsichtbar, kein UI)
   Sorgt dafür, dass geteilte Links beim Öffnen zur richtigen
   Stelle scrollen:
       Startseite:  https://…/#pakete
       Unterseite:  https://…/#/ansatz/prozess
   Die native Link-Vorschau (unten links im Browser) entsteht
   automatisch durch die echten <a href>-Elemente in der Seite –
   dieses Skript baut KEIN eigenes Anzeige-Element.
   ============================================================ */
(function () {
  "use strict";

  var NAV_OFFSET = 72; // Höhe der fixen Topbar + Luft

  // Ziel-Sektion aus dem Hash lesen
  function sectionFromHash() {
    var hash = location.hash || "";
    var m = hash.toLowerCase().match(/^#\/(?:ansatz|leistungen|team)\/([a-z0-9\-]+)/);
    if (m) return m[1];
    var m2 = hash.match(/^#([a-z0-9\-]+)$/i); // reiner #anker (Startseite)
    if (m2) return m2[1];
    return "";
  }

  function smoothTo(top) {
    top = Math.max(0, top);
    if (window.__lenis && window.__lenis.scrollTo) {
      window.__lenis.scrollTo(top, { lock: false });
    } else {
      try { window.scrollTo({ top: top, behavior: "smooth" }); }
      catch (e) { window.scrollTo(0, top); }
    }
  }

  function scrollToEl(el) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    smoothTo(top);
  }

  // Bevorzugt die App-Logik (reveal-aware: landet bei animierten Bereichen
  // dort, wo der Inhalt bereits sichtbar ist), sonst simpler Scroll.
  function scrollToTarget(id) {
    if (typeof window.__scrollToId === "function") { window.__scrollToId(id); return true; }
    var el = document.getElementById(id);
    if (el) { scrollToEl(el); return true; }
    return false;
  }

  // Deep-Link beim Laden: auf die Ziel-Sektion scrollen, sobald sie existiert
  function honorDeepLink() {
    var id = sectionFromHash();
    if (!id) return;
    var tries = 0;
    (function poll() {
      var el = document.getElementById(id);
      if (el) {
        var animated = /^leistung-\d+$/.test(id);
        if (!animated) { setTimeout(function () { scrollToTarget(id); }, 120); return; }
        // Animierter Bereich: kurz auf das Reveal-Ziel warten, damit wir dort
        // landen, wo der Inhalt voll sichtbar ist (nicht auf dem leeren Anfang).
        var t2 = 0;
        (function waitReveal() {
          if ((window.__revealTargets && typeof window.__revealTargets[id] === "function") || t2++ > 12) {
            scrollToTarget(id); return;
          }
          setTimeout(waitReveal, 80);
        })();
        return;
      }
      if (tries++ < 40) setTimeout(poll, 100); // bis ~4s versuchen
    })();
  }

  function init() {
    honorDeepLink();
    // Deep-Link innerhalb derselben Route (app.js lädt bei Routenwechsel neu)
    window.addEventListener("hashchange", function () {
      var id = sectionFromHash();
      if (id) scrollToTarget(id);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(init, 300); });
  } else {
    setTimeout(init, 300);
  }
})();
