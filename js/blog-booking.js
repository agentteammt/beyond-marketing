/* Erstgespräch-Buchung für die Blogseiten.
   Nutzt dieselbe API wie das Hauptformular der Startseite: window.KIWBooking
   (aus supabase.js) mit loadAvailability() und bookSlot().
   Gleiche Slot-Zeiten und derselbe Werktage-Filter (Di–Do) wie ErstgesprachBooking in js/app.js.

   Zustandsmodell — bewusst pessimistisch:
     offline      Supabase nicht konfiguriert  -> kein Formular, ehrlicher Ausweg
     loading      Verfügbarkeit noch unbekannt -> Zeiten gesperrt, Absenden gesperrt
     ready        Verfügbarkeit geladen        -> Zeiten nach remaining
     unavailable  geladen, aber kein Slot frei -> Hinweis statt leerem Raster
     error        Laden fehlgeschlagen         -> Hinweis + Ausweg
   Die Bestätigung erscheint ausschliesslich, wenn bookSlot() "ok" zurückgibt. */
(function () {
  var BOOK_TIMES = ["09:00", "09:30", "10:00", "10:30", "15:00", "15:30"];
  var DOW = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  var MON = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  var MAIL = "team@team-mt.de";
  var LEAD_BASE = "30 Minuten, ohne Verkaufsdruck. ";
  var LEADS = {
    loading:     LEAD_BASE + "Tag und Uhrzeit wählen, Anliegen dazuschreiben — die Bestätigung kommt per E-Mail aus dem team::mt-Expertenteam.",
    ready:       LEAD_BASE + "Tag und Uhrzeit wählen, Anliegen dazuschreiben — die Bestätigung kommt per E-Mail aus dem team::mt-Expertenteam.",
    unavailable: LEAD_BASE + "Für den gewählten Tag ist gerade nichts frei — wählen Sie einen anderen Tag oder schreiben Sie uns direkt.",
    error:       LEAD_BASE + "Die Terminwahl ist im Moment nicht erreichbar — schreiben Sie uns direkt, wir antworten innerhalb von 24 Stunden.",
    offline:     "Ein Erstgespräch dauert 30 Minuten, ohne Verkaufsdruck. Die Online-Terminwahl ist gerade nicht verfügbar."
  };

  function nextBusinessDays(n) {
    var out = [], base = new Date(); base.setHours(0, 0, 0, 0), i = 0;
    while (out.length < n && i < 60) {
      i++;
      var x = new Date(base); x.setDate(base.getDate() + i);
      var wd = x.getDay();
      if (wd !== 2 && wd !== 3 && wd !== 4) continue;
      out.push({
        iso: x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"),
        dow: DOW[wd], dom: x.getDate(), mon: MON[x.getMonth()]
      });
    }
    return out;
  }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in (attrs || {})) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function configured() {
    return !!(window.KIWBooking && window.KIWBooking.configured && window.KIWBooking.configured());
  }
  function fallback(lead) {
    return el("div", { class: "bb-fallback" }, [
      el("p", { text: lead }),
      el("div", { class: "bb-fallback-actions" }, [
        el("a", { class: "bg-cta", href: "mailto:" + MAIL + "?subject=Anfrage%20Erstgespr%C3%A4ch" }, ["E-Mail schreiben"]),
        el("a", { class: "bb-alt", href: "/kontakt" }, ["Termin auf der Startseite wählen"])
      ])
    ]);
  }

  function mount(host) {
    var box = host.closest ? host.closest(".formbox") : null;
    var lead = box ? box.querySelector("[data-booking-lead]") : null;
    function setLead(s) { if (lead && LEADS[s]) lead.textContent = LEADS[s]; }

    if (!configured()) {
      setLead("offline");
      host.appendChild(fallback("Die Online-Terminwahl ist gerade nicht verfügbar. Schreiben Sie uns direkt — Sie erhalten innerhalb von 24 Stunden eine Antwort aus dem team::mt-Expertenteam."));
      return;
    }

    var dates = nextBusinessDays(8);
    if (!dates.length) { setLead("offline"); host.appendChild(fallback("Aktuell sind keine Termine freigegeben. Schreiben Sie uns direkt.")); return; }

    var state = "loading", selDate = dates[0].iso, selTime = null, avail = null, sending = false, reqId = 0;

    var dayRow  = el("div", { class: "bb-chips" });
    var timeRow = el("div", { class: "bb-times" });
    var timeNote = el("p", { class: "bb-msg" });
    var msg = el("p", { class: "bb-msg", role: "status", "aria-live": "polite" });
    var btn = el("button", { class: "bg-cta", type: "submit", "data-beyond-event": "Beyond_Blog_Booking" }, ["Termin anfragen"]);

    var fName = el("input", { id: "bb-name", name: "name", type: "text", required: "required", autocomplete: "name" });
    var fComp = el("input", { id: "bb-comp", name: "company", type: "text", autocomplete: "organization" });
    var fMail = el("input", { id: "bb-mail", name: "email", type: "email", required: "required", autocomplete: "email" });
    var fNote = el("textarea", { id: "bb-note", name: "note", placeholder: "Worum geht es konkret?" });

    function field(id, label, input, hint) {
      return el("div", null, [el("label", { for: id, text: label + (hint ? " " + hint : "") }), input]);
    }
    /* null = noch unbekannt, Zahl = freie Plätze */
    function remaining(t) {
      if (state !== "ready") return null;
      var r = avail[t];
      return r ? r.remaining : 0;
    }
    function valid() {
      return state === "ready" && !!selTime && !!selDate &&
             !!fName.value.trim() && /\S+@\S+\.\S+/.test(fMail.value.trim());
    }
    function say(text, kind) {
      msg.textContent = text || "";
      msg.className = "bb-msg" + (kind ? " bb-" + kind : "");
      /* Fehler assertiv ankündigen, wie die Buchung auf der Startseite */
      msg.setAttribute("role", kind === "err" ? "alert" : "status");
      msg.setAttribute("aria-live", kind === "err" ? "assertive" : "polite");
    }
    function sync() {
      [].forEach.call(dayRow.children, function (b) {
        b.setAttribute("aria-pressed", b.dataset.iso === selDate ? "true" : "false");
        b.disabled = sending;
      });
      [].forEach.call(timeRow.children, function (b) {
        var rem = remaining(b.dataset.time);
        var blocked = rem == null || rem <= 0;          // unbekannt gilt als gesperrt
        b.disabled = blocked || sending;
        b.setAttribute("aria-pressed", b.dataset.time === selTime ? "true" : "false");
        b.title = state === "ready" && rem != null && rem <= 0 ? "Belegt" : "";
      });
      timeRow.hidden = (state === "unavailable" || state === "error");
      timeNote.hidden = (state === "ready");
      timeNote.textContent =
        state === "loading" ? "Verfügbarkeit wird geladen …" :
        state === "unavailable" ? "Für diesen Tag sind derzeit keine Zeiten freigegeben. Wählen Sie einen anderen Tag — oder schreiben Sie uns direkt an " + MAIL + "." :
        state === "error" ? "Die Verfügbarkeit konnte nicht geladen werden. Schreiben Sie uns bitte an " + MAIL + "." : "";
      timeNote.className = "bb-msg" + (state === "unavailable" || state === "error" ? " bb-err" : "");
      setLead(state);
      btn.disabled = !valid() || sending;
      btn.textContent = sending ? "Wird gesendet …" : "Termin anfragen";
    }
    function refresh() {
      var my = ++reqId;
      state = "loading"; avail = null; sync();
      window.KIWBooking.loadAvailability(selDate).then(function (rows) {
        if (my !== reqId) return;
        var map = (rows || []).reduce(function (m, r) { m[r.label] = r; return m; }, {});
        var free = BOOK_TIMES.some(function (t) { return map[t] && map[t].remaining > 0; });
        avail = map;
        state = free ? "ready" : "unavailable";
        if (!free) selTime = null;
        sync();
      })["catch"](function () {
        if (my !== reqId) return;
        state = "error"; selTime = null; sync();
      });
    }

    dates.forEach(function (d) {
      var b = el("button", { type: "button", class: "bb-chip", "aria-pressed": "false" }, [
        el("span", { class: "bb-dow", text: d.dow }),
        el("span", { class: "bb-dom", text: String(d.dom) }),
        el("span", { class: "bb-mon", text: d.mon })
      ]);
      b.dataset.iso = d.iso;
      b.addEventListener("click", function () { selDate = d.iso; selTime = null; say(""); refresh(); });
      dayRow.appendChild(b);
    });
    BOOK_TIMES.forEach(function (t) {
      var b = el("button", { type: "button", class: "bb-time", "aria-pressed": "false", disabled: "disabled" }, [t]);
      b.dataset.time = t;
      b.addEventListener("click", function () { selTime = t; say(""); sync(); });
      timeRow.appendChild(b);
    });

    var form = el("form", { class: "bb-form", novalidate: "novalidate" }, [
      el("div", { class: "bb-step" }, [el("span", { class: "bb-num", text: "1" }), "Tag wählen"]),
      dayRow,
      el("div", { class: "bb-step" }, [el("span", { class: "bb-num", text: "2" }), "Uhrzeit wählen"]),
      timeRow, timeNote,
      el("div", { class: "bb-step" }, [el("span", { class: "bb-num", text: "3" }), "Kontakt"]),
      el("div", { class: "frow" }, [
        field("bb-name", "Name", fName),
        field("bb-comp", "Unternehmen", fComp, "(optional)")
      ]),
      field("bb-mail", "E-Mail-Adresse", fMail),
      field("bb-note", "Ihr Anliegen", fNote, "(optional)"),
      el("div", { class: "fsub" }, [btn, el("span", { class: "fnote", html: 'Lieber schreiben? <a href="mailto:' + MAIL + '">' + MAIL + '</a>' })]),
      msg
    ]);
    [fName, fMail].forEach(function (i) { i.addEventListener("input", sync); });

    function succeed(dateIso, time) {
      host.innerHTML = "";
      host.appendChild(el("div", { class: "bb-done" }, [
        el("div", { class: "bb-check", html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>' }),
        el("h3", { text: "Termin ist angefragt." }),
        el("p", { text: "Wir haben Ihre Anfrage für " + dateIso.split("-").reverse().join(".") + " um " + time + " Uhr gespeichert und melden uns per E-Mail zurück." }),
        el("a", { class: "bg-cta", href: "/blog" }, ["Weiter im Blog"])
      ]));
      if (typeof window.beyondTrack === "function") {
        window.beyondTrack("Beyond_Booking_Erfolg", { booking_date: dateIso, booking_time: time });
      }
    }
    function fail(text) { sending = false; say(text, "err"); sync(); }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!valid() || sending) return;
      var d = selDate, t = selTime;
      var row = avail && avail[t];
      if (!row || row.slot_id == null) { selTime = null; fail("Dieser Termin ist nicht mehr verfügbar."); refresh(); return; }
      sending = true; say(""); sync();
      window.KIWBooking.bookSlot(d, row.slot_id, fName.value.trim(), fMail.value.trim(), fComp.value.trim(), fNote.value.trim())
        .then(function (r) {
          if (r === "ok") { succeed(d, t); return; }               // nur hier Bestätigung
          if (r === "full") { selTime = null; fail("Dieser Termin ist gerade belegt. Bitte wählen Sie einen anderen."); refresh(); return; }
          fail("Die Anfrage konnte nicht gespeichert werden. Bitte schreiben Sie uns an " + MAIL + ".");
        })["catch"](function () {
          fail("Verbindung fehlgeschlagen. Bitte später erneut versuchen oder an " + MAIL + " schreiben.");
        });
    });

    host.appendChild(form);
    refresh();
  }

  function init() { [].forEach.call(document.querySelectorAll("[data-blog-booking]"), mount); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
