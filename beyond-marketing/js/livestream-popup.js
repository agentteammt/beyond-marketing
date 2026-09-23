/* Livestream-Aufzeichnung: Teaser-Popup unten rechts (nur Startseite).
   Erscheint ~3 s nach dem Laden; ist der Cookie-Banner offen, erst kurz nach dessen Schließen.
   Schließen gilt nur bis zum Neuladen; nach Klick auf den Button 60 Tage ausgeblendet (localStorage). */
(function () {
  "use strict";
  var KEY = "beyond-popup-livestream-v1";
  var DELAY = 3000;
  var MAIL = "mailto:team@team-mt.de"
    + "?subject=" + encodeURIComponent("Aufzeichnung anfragen: LinkedIn trifft KI – was funktioniert wirklich?")
    + "&body=" + encodeURIComponent("Hallo team::mt,\n\nbitte schicken Sie mir die Aufzeichnung des Livestreams „LinkedIn trifft KI: Was funktioniert wirklich?“.\n\nName:\nUnternehmen:\n\nVielen Dank!");

  var seg = (location.pathname.split("/").filter(Boolean).pop() || "").replace(/\.html$/, "");
  if (seg && seg !== "index" && seg !== "beyond-marketing") return;
  try {
    var until = +localStorage.getItem(KEY) || 0;
    if (until > Date.now()) return;
  } catch (e) {}

  function remember(days) { try { localStorage.setItem(KEY, String(Date.now() + days * 864e5)); } catch (e) {} }
  function track(name) { try { window.beyondTrack && window.beyondTrack(name, { click_location: "popup_livestream" }); } catch (e) {} }

  var CSS = '\
  .lsp{position:fixed;right:24px;bottom:24px;z-index:9400;width:min(380px,calc(100vw - 32px));font-family:"Poppins",system-ui,sans-serif;color:var(--ink,#0e1b2e);\
    background:rgba(255,255,255,.96);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(18,38,66,.12);border-radius:8px;\
    box-shadow:0 26px 70px rgba(20,40,70,.22);overflow:hidden;opacity:0;transform:translateY(24px);transition:opacity .45s ease,transform .55s cubic-bezier(.2,.8,.2,1);}\
  .lsp.is-in{opacity:1;transform:none}\
  .lsp-hazard{height:2px;background:linear-gradient(90deg,transparent,#db0a30 18%,#db0a30 82%,transparent)}\
  .lsp-media{position:relative;aspect-ratio:16/8;background:#eef1f5 url("assets/livestream-aufzeichnung.jpg?v=2") 60% 58%/cover no-repeat}\
  .lsp-tag{position:absolute;left:14px;top:14px;display:flex;align-items:center;gap:7px;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.92);\
    font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#0e1b2e;box-shadow:0 2px 10px rgba(20,40,70,.12)}\
  .lsp-tag i{width:7px;height:7px;border-radius:50%;background:#db0a30;display:block}\
  .lsp-x{position:absolute;right:10px;top:10px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.92);color:#0e1b2e;cursor:pointer;\
    display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(20,40,70,.12);transition:background .2s}\
  .lsp-x:hover{background:#fff}\
  .lsp-x svg{width:14px;height:14px}\
  .lsp-body{padding:20px 22px 22px;display:flex;flex-direction:column;gap:10px}\
  .lsp-kicker{margin:0;font-size:13px;font-weight:500;color:#db0a30}\
  .lsp-h{margin:0;font-size:20px;line-height:1.25;font-weight:600;letter-spacing:-.01em;text-wrap:pretty}\
  .lsp-p{margin:0;font-size:14px;line-height:1.55;color:var(--ink-dim,#46566e);text-wrap:pretty}\
  .lsp-cta{margin-top:6px;justify-content:center;width:100%;padding:13px 20px;font-size:15px}\
  .lsp-note{margin:0;font-size:12px;color:var(--muted,#62718a);text-align:center}\
  @media (max-width:560px){.lsp{right:16px;bottom:16px}.lsp-media{aspect-ratio:16/6}.lsp-body{padding:16px 18px 18px}.lsp-h{font-size:18px}}\
  @media (prefers-reduced-motion:reduce){.lsp{transition:opacity .2s}}';

  function build() {
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    var el = document.createElement("aside");
    el.className = "lsp";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-labelledby", "lsp-h");
    el.innerHTML = '\
      <div class="lsp-hazard"></div>\
      <div class="lsp-media" role="img" aria-label="Livestream LinkedIn trifft KI mit Mihail Vasilev, Stephanie Schubert, Martina Manich und Joelle Lenz">\
        <span class="lsp-tag"><i></i>Aufzeichnung</span>\
        <button type="button" class="lsp-x" aria-label="Schließen" data-beyond-event="Beyond_Popup_Livestream_Close" data-beyond-skip>\
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 2l10 10M12 2L2 12"/></svg>\
        </button>\
      </div>\
      <div class="lsp-body">\
        <p class="lsp-kicker">Verpasst? Oder noch mal reinschauen?</p>\
        <h2 class="lsp-h" id="lsp-h">LinkedIn trifft KI: Was funktioniert wirklich?</h2>\
        <p class="lsp-p">Der Livestream mit Rittal, VDMA und team::mt als Aufzeichnung – kostenlos per Mail.</p>\
        <a class="btn btn-cta lsp-cta" href="' + MAIL + '" data-beyond-event="Beyond_Popup_Livestream_Anfrage">Jetzt Aufzeichnung anfragen\
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>\
        </a>\
        <p class="lsp-note">Kurze Mail genügt – wir schicken Ihnen den Link.</p>\
      </div>';
    document.body.appendChild(el);

    function close(days) {
      if (days) remember(days);
      el.classList.remove("is-in");
      document.removeEventListener("keydown", onKey);
      setTimeout(function () { el.remove(); }, 500);
    }
    function onKey(e) { if (e.key === "Escape") close(0); }
    el.querySelector(".lsp-x").addEventListener("click", function () { close(0); });
    el.querySelector(".lsp-cta").addEventListener("click", function () { remember(60); setTimeout(function () { close(60); }, 400); });
    document.addEventListener("keydown", onKey);

    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("is-in"); }); });
    track("Beyond_Popup_Livestream_Shown");
  }

  function bannerOpen() {
    var b = document.querySelector(".cc-banner");
    return !!(b && b.offsetParent !== null && getComputedStyle(b).display !== "none" && getComputedStyle(b).visibility !== "hidden");
  }

  function whenReady() {
    if (!bannerOpen()) return build();
    var iv = setInterval(function () {
      if (!bannerOpen()) { clearInterval(iv); setTimeout(build, 1200); }
    }, 400);
  }

  function start() { setTimeout(whenReady, DELAY); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
