/* ============================================================
   Google Ads — Conversion-Tracking (GTM-Ersatz für DIESE Conversion)
   ------------------------------------------------------------
   Auslöser : Klick auf den Header-Button „Gespräch anfragen"
              (data-beyond-event="Beyond_Nav_Gespraech", Desktop + Mobil).
   Ziel     : NUR Google Ads (send_to = AW-…/LABEL), NICHT GA4.
   Consent  : Feuert ausschließlich bei Marketing-Einwilligung
              (KIWConsent.get().marketing === true) — DSGVO-konform.
   Konfig   : window.KIW_ADS in index.html (id, label, value, currency, test).
   Test     : Bei test:true Konsolen-Logs. Manuell in der Konsole:
                kiwTestAdsConversion()       → mit Consent-Prüfung
                kiwTestAdsConversion(true)    → Consent erzwingen (nur interner Tag-Test!)
   ============================================================ */
(function () {
  "use strict";

  var cfg = window.KIW_ADS || {};
  var TEST = !!cfg.test;
  function log() { if (TEST && window.console) console.log.apply(console, ["[KIW Ads]"].concat([].slice.call(arguments))); }

  if (!cfg.id || !cfg.label) { log("Nicht konfiguriert (id/label fehlen) — Conversion inaktiv."); return; }
  var SEND_TO = cfg.id + "/" + cfg.label;

  function marketingConsent() {
    try {
      var s = window.KIWConsent && window.KIWConsent.get && window.KIWConsent.get();
      return !!(s && s.marketing);
    } catch (e) { return false; }
  }

  function fire(reason, force) {
    if (!force && !marketingConsent()) {
      log("⛔ NICHT gefeuert — keine Marketing-Einwilligung. (Auslöser:", reason + ")");
      return false;
    }
    if (!window.gtag) {
      log("⛔ gtag noch nicht verfügbar — Conversion nicht gesendet.");
      return false;
    }
    var params = { send_to: SEND_TO, transaction_id: "gespraech_" + Date.now() };
    if (cfg.value != null && cfg.value !== "") {
      params.value = cfg.value;
      params.currency = cfg.currency || "EUR";
    }
    window.gtag("event", "conversion", params);
    log("✅ Conversion an Google Ads gesendet:", params, "(Auslöser:", reason + (force ? ", ERZWUNGEN" : "") + ")");
    return true;
  }

  // Manueller Test aus der Browser-Konsole
  window.kiwTestAdsConversion = function (force) {
    log("Manueller Test gestartet…");
    return fire("manueller Test", !!force);
  };

  // Auslöser: Header-CTA „Gespräch anfragen" (Desktop-Topbar + Mobil-Menü)
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var el = t.closest('[data-beyond-event="Beyond_Nav_Gespraech"]');
    if (!el) return;
    fire("Header-Button „Gespräch anfragen\"");
  }, true);

  log("Bereit. send_to =", SEND_TO, "| Testmodus AKTIV.",
      "Header-Klick feuert bei Marketing-Consent. Manuell: kiwTestAdsConversion()");
})();
