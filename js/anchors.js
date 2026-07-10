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

  // Deep-Link beim Laden: auf die Ziel-Sektion scrollen, sobald sie existiert
  function honorDeepLink() {
    var id = sectionFromHash();
    if (!id) return;
    var tries = 0;
    (function poll() {
      var el = document.getElementById(id);
      if (el) { setTimeout(function () { scrollToEl(el); }, 120); return; }
      if (tries++ < 40) setTimeout(poll, 100); // bis ~4s versuchen
    })();
  }

  function init() {
    honorDeepLink();
    // Deep-Link innerhalb derselben Route (app.js lädt bei Routenwechsel neu)
    window.addEventListener("hashchange", function () {
      var id = sectionFromHash();
      if (id) { var el = document.getElementById(id); if (el) scrollToEl(el); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(init, 300); });
  } else {
    setTimeout(init, 300);
  }
})();
