/* legal.js — DSGVO-Consent-Banner + Footer-Rechtslinks für die KI-Werkstatt.
   ====================================================================
   Eigenständiges Vanilla-JS-Modul (unabhängig vom React-Build).
   - Schlichtes Banner: Akzeptieren / Ablehnen / Einstellungen
   - Kategorie "Statistik" (Google Analytics) wird ERST nach Einwilligung geladen
   - Speichert die Wahl in localStorage (Schlüssel: kiw-consent-v1)
   - Hängt Impressum / Datenschutz / Cookie-Einstellungen in den Footer ein

   GOOGLE-ANALYTICS-ID HIER ODER IN index.html (window.KIW_GA_ID) EINTRAGEN.
   Ohne gültige ID (G-XXXXXXXXXX) wird KEIN Analytics geladen — die Einwilligung
   wird trotzdem korrekt gespeichert.
   ==================================================================== */
(function () {
  "use strict";

  var STORE_KEY = "kiw-consent-v1";
  var GA_ID = (window.KIW_GA_ID || "").trim();
  var GA_VALID = /^G-[A-Z0-9]{6,}$/i.test(GA_ID);

  /* ---------------- Consent-Zustand ---------------- */
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var p = JSON.parse(raw);
      if (!p || typeof p !== "object") return null;
      return p;
    } catch (e) { return null; }
  }
  function save(state) {
    state.ts = new Date().toISOString();
    state.v = 1;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
    apply(state);
  }

  /* ---------------- Google Analytics (Consent Mode v2) ---------------- */
  var gaLoaded = false;
  function bootGtagConsentDefault() {
    // Consent Mode: alles verweigert, bis der Nutzer zustimmt.
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      wait_for_update: 500
    });
  }
  function loadGA() {
    if (gaLoaded || !GA_VALID) return;
    gaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  }
  function apply(state) {
    var granted = !!(state && state.analytics);
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
    }
    if (granted) loadGA();
  }

  /* ---------------- DOM-Helfer ---------------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "style") n.setAttribute("style", attrs[k]);
      else if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }

  /* ---------------- Styles ---------------- */
  var CSS = '\
  .cc-root{font-family:"Poppins",system-ui,sans-serif;}\
  .cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:9500;display:flex;justify-content:center;padding:18px;pointer-events:none;}\
  .cc-card{pointer-events:auto;width:min(960px,100%);background:rgba(255,255,255,.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(18,38,66,.12);border-radius:8px;box-shadow:0 26px 70px rgba(20,40,70,.18);overflow:hidden;}\
  .cc-hazard{height:2px;width:100%;background:linear-gradient(90deg,transparent,#db0a30 18%,#db0a30 82%,transparent);}\
  .cc-body{padding:22px 26px 24px;display:grid;grid-template-columns:1.5fr auto;gap:26px;align-items:center;}\
  .cc-eyebrow{font-family:"EB Garamond",Georgia,serif;font-style:italic;font-weight:500;font-size:18px;color:#db0a30;margin-bottom:8px;}\
  .cc-title{font-family:"Poppins",sans-serif;font-weight:600;font-size:18px;color:#0e1b2e;margin:0 0 7px;letter-spacing:-.01em;}\
  .cc-text{color:#46566e;font-size:13.5px;line-height:1.6;margin:0;}\
  .cc-text a{color:#db0a30;text-decoration:underline;text-underline-offset:2px;}\
  .cc-actions{display:flex;flex-direction:column;gap:10px;min-width:188px;}\
  .cc-btn{font-family:"Poppins",sans-serif;font-weight:600;font-size:13.5px;letter-spacing:.01em;padding:13px 20px;border-radius:2px;cursor:pointer;border:0;text-align:center;transition:transform .2s,box-shadow .25s,background .25s,color .2s;white-space:nowrap;}\
  .cc-btn:active{transform:translateY(1px);}\
  .cc-accept{background:#db0a30;color:#fff;box-shadow:0 8px 26px color-mix(in srgb,#db0a30 38%,transparent);}\
  .cc-accept:hover{box-shadow:0 10px 36px color-mix(in srgb,#db0a30 52%,transparent);}\
  .cc-reject{background:#fff;color:#0e1b2e;box-shadow:inset 0 0 0 1px rgba(18,38,66,.22);}\
  .cc-reject:hover{box-shadow:inset 0 0 0 1px #db0a30;color:#db0a30;}\
  .cc-settings{background:transparent;color:#69788e;font-size:12.5px;padding:6px;letter-spacing:.04em;}\
  .cc-settings:hover{color:#db0a30;}\
  .cc-overlay{position:fixed;inset:0;z-index:9600;background:rgba(14,27,46,.45);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;}\
  .cc-modal{width:min(560px,100%);max-height:88vh;overflow:auto;background:#fff;border:1px solid rgba(18,38,66,.12);border-radius:10px;box-shadow:0 40px 100px rgba(20,40,70,.3);}\
  .cc-modal-body{padding:28px 30px 30px;}\
  .cc-modal h2{font-family:"Poppins",sans-serif;font-weight:700;font-size:22px;color:#0e1b2e;margin:0 0 6px;letter-spacing:-.01em;}\
  .cc-modal p.cc-lead{color:#46566e;font-size:13.5px;line-height:1.6;margin:0 0 22px;}\
  .cc-cat{display:flex;gap:16px;align-items:flex-start;padding:18px 0;border-top:1px solid rgba(18,38,66,.10);}\
  .cc-cat:last-of-type{border-bottom:1px solid rgba(18,38,66,.10);}\
  .cc-cat-info{flex:1;}\
  .cc-cat-name{font-family:"Poppins",sans-serif;font-weight:600;font-size:15px;color:#0e1b2e;margin:0 0 4px;}\
  .cc-cat-desc{color:#69788e;font-size:12.5px;line-height:1.55;margin:0;}\
  .cc-switch{flex:none;position:relative;width:46px;height:26px;border-radius:40px;background:rgba(18,38,66,.14);box-shadow:inset 0 0 0 1px rgba(18,38,66,.16);cursor:pointer;transition:background .22s;margin-top:2px;}\
  .cc-switch.on{background:#db0a30;box-shadow:inset 0 0 0 1px #db0a30,0 0 16px color-mix(in srgb,#db0a30 40%,transparent);}\
  .cc-switch.locked{cursor:not-allowed;opacity:.7;}\
  .cc-switch .cc-knob{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:left .22s;}\
  .cc-switch.on .cc-knob{left:23px;background:#fff;}\
  .cc-modal-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px;}\
  .cc-modal-actions .cc-btn{flex:1 1 auto;}\
  .cc-tag{font-family:"Poppins",sans-serif;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:#69788e;border:1px solid rgba(18,38,66,.2);border-radius:2px;padding:3px 8px;white-space:nowrap;}\
  .cc-foot-links{display:flex;gap:18px;flex-wrap:wrap;align-items:center;}\
  .cc-foot-links a,.cc-foot-links button{font-family:"Poppins",sans-serif;font-size:12.5px;letter-spacing:.05em;color:#69788e;background:none;border:0;padding:0;cursor:pointer;transition:color .2s;}\
  .cc-foot-links a:hover,.cc-foot-links button:hover{color:#db0a30;}\
  @media (max-width:720px){\
    .cc-banner{padding:9px;}\
    .cc-card{max-height:calc(100dvh - 18px);overflow:auto;}\
    .cc-hazard{height:4px;}\
    .cc-body{grid-template-columns:1fr;gap:13px;padding:14px 16px 15px;}\
    .cc-eyebrow{display:none;}\
    .cc-title{font-size:15.5px;margin-bottom:5px;}\
    .cc-text{font-size:12.5px;line-height:1.48;}\
    .cc-actions{min-width:0;flex-direction:row;flex-wrap:wrap;gap:8px;}\
    .cc-accept,.cc-reject{flex:1 1 0;min-width:0;width:auto;padding:12px 10px;font-size:13px;}\
    .cc-settings{flex:1 1 100%;order:3;padding:2px;font-size:12px;}\
  }\
  @media (prefers-reduced-motion: no-preference){.cc-card{animation:ccin .5s cubic-bezier(.2,.8,.2,1);}}\
  @keyframes ccin{from{transform:translateY(30px);opacity:0;}to{transform:none;opacity:1;}}\
  ';

  function injectCSS() {
    if (document.getElementById("cc-style")) return;
    var s = el("style", { id: "cc-style" });
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------------- Banner ---------------- */
  var bannerEl = null;
  function showBanner() {
    if (bannerEl) return;
    var card = el("div", { class: "cc-card" }, [
      el("div", { class: "cc-hazard" }),
      el("div", { class: "cc-body" }, [
        el("div", {}, [
          el("div", { class: "cc-eyebrow" }, ["Cookie-Einstellungen"]),
          el("p", { class: "cc-title" }, ["Wir respektieren Ihre Privatsphäre"]),
          el("p", { class: "cc-text", html:
            'Wir verwenden nur technisch notwendige Cookies, damit diese Seite funktioniert. ' +
            'Optionale Statistik-Cookies (Google&nbsp;Analytics) setzen wir nur mit Ihrer Einwilligung ein. ' +
            'Details in unserer <a href="datenschutz.html">Datenschutzerklärung</a>.' })
        ]),
        el("div", { class: "cc-actions" }, [
          mkBtn("cc-btn cc-accept", "Alle akzeptieren", function () { acceptAll(); }),
          mkBtn("cc-btn cc-reject", "Nur notwendige", function () { rejectAll(); }),
          mkBtn("cc-btn cc-settings", "Einstellungen", function () { openSettings(); })
        ])
      ])
    ]);
    bannerEl = el("div", { class: "cc-banner cc-root", role: "dialog", "aria-label": "Cookie-Hinweis", "aria-live": "polite" }, [card]);
    document.body.appendChild(bannerEl);
  }
  function hideBanner() {
    if (bannerEl) { bannerEl.remove(); bannerEl = null; }
  }
  function mkBtn(cls, label, fn) {
    var b = el("button", { class: cls, type: "button" }, [label]);
    b.addEventListener("click", fn);
    return b;
  }

  function acceptAll() { save({ necessary: true, analytics: true }); hideBanner(); }
  function rejectAll() { save({ necessary: true, analytics: false }); hideBanner(); }

  /* ---------------- Einstellungs-Dialog ---------------- */
  var overlayEl = null;
  function openSettings() {
    var state = load() || { necessary: true, analytics: false };
    var draft = { analytics: !!state.analytics };

    var analyticsSwitch = el("div", {
      class: "cc-switch" + (draft.analytics ? " on" : ""),
      role: "switch", tabindex: "0", "aria-checked": draft.analytics ? "true" : "false",
      "aria-label": "Statistik-Cookies"
    }, [el("div", { class: "cc-knob" })]);
    function toggleAnalytics() {
      draft.analytics = !draft.analytics;
      analyticsSwitch.classList.toggle("on", draft.analytics);
      analyticsSwitch.setAttribute("aria-checked", draft.analytics ? "true" : "false");
    }
    analyticsSwitch.addEventListener("click", toggleAnalytics);
    analyticsSwitch.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleAnalytics(); }
    });

    var modal = el("div", { class: "cc-modal cc-root" }, [
      el("div", { class: "cc-hazard" }),
      el("div", { class: "cc-modal-body" }, [
        el("h2", {}, ["Cookie-Einstellungen"]),
        el("p", { class: "cc-lead", html:
          'Entscheiden Sie selbst, welche Cookies wir verwenden dürfen. Ihre Auswahl können Sie ' +
          'jederzeit über „Cookie-Einstellungen" im Footer ändern. Mehr in der ' +
          '<a href="datenschutz.html">Datenschutzerklärung</a>.' }),
        // notwendig
        el("div", { class: "cc-cat" }, [
          el("div", { class: "cc-cat-info" }, [
            el("p", { class: "cc-cat-name" }, ["Technisch notwendig"]),
            el("p", { class: "cc-cat-desc" }, [
              "Erforderlich für den Betrieb der Seite (z. B. Speicherung Ihrer Cookie-Auswahl, Buchungsfunktion). Kann nicht deaktiviert werden."
            ])
          ]),
          el("span", { class: "cc-tag" }, ["Immer aktiv"])
        ]),
        // statistik
        el("div", { class: "cc-cat" }, [
          el("div", { class: "cc-cat-info" }, [
            el("p", { class: "cc-cat-name" }, ["Statistik"]),
            el("p", { class: "cc-cat-desc" }, [
              "Google Analytics hilft uns anonymisiert zu verstehen, wie die Seite genutzt wird. Wird erst nach Ihrer Einwilligung geladen."
            ])
          ]),
          analyticsSwitch
        ]),
        el("div", { class: "cc-modal-actions" }, [
          mkBtn("cc-btn cc-accept", "Auswahl speichern", function () {
            save({ necessary: true, analytics: draft.analytics });
            closeSettings(); hideBanner();
          }),
          mkBtn("cc-btn cc-reject", "Alle akzeptieren", function () {
            acceptAll(); closeSettings();
          })
        ])
      ])
    ]);

    overlayEl = el("div", { class: "cc-overlay cc-root" }, [modal]);
    overlayEl.addEventListener("click", function (e) { if (e.target === overlayEl) closeSettings(); });
    document.addEventListener("keydown", escClose);
    document.body.appendChild(overlayEl);
  }
  function escClose(e) { if (e.key === "Escape") closeSettings(); }
  function closeSettings() {
    if (overlayEl) { overlayEl.remove(); overlayEl = null; }
    document.removeEventListener("keydown", escClose);
  }

  /* ---------------- Footer-Links ---------------- */
  function injectFooterLinks() {
    var footer = document.querySelector("footer");
    if (!footer || footer.querySelector(".cc-foot-links")) return false;
    var wrap = footer.querySelector(".wrap") || footer;
    var row = el("div", {
      class: "cc-foot-links cc-root",
      style: "display:flex;gap:18px;flex-wrap:wrap;align-items:center;padding-top:18px;margin-top:6px;border-top:1px solid rgba(140,180,220,.14);"
    }, [
      el("a", { href: "impressum.html" }, ["Impressum"]),
      el("a", { href: "datenschutz.html" }, ["Datenschutz"])
    ]);
    var cookieBtn = el("button", { type: "button" }, ["Cookie-Einstellungen"]);
    cookieBtn.addEventListener("click", openSettings);
    row.appendChild(cookieBtn);
    wrap.appendChild(row);
    return true;
  }
  function watchFooter() {
    if (injectFooterLinks()) return;
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if (injectFooterLinks() || tries > 40) clearInterval(iv);
    }, 300);
  }

  /* ---------------- Init ---------------- */
  function init() {
    injectCSS();
    bootGtagConsentDefault();
    var state = load();
    if (state) apply(state); else showBanner();
    watchFooter();
    // öffentliche API (z. B. für Footer-Link aus React)
    window.KIWConsent = { open: openSettings, get: load, reset: function () {
      try { localStorage.removeItem(STORE_KEY); } catch (e) {}
      showBanner();
    } };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
