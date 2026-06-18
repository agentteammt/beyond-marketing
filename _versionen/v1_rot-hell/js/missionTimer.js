/* AUTO-GENERIERT aus missionTimer.jsx — NICHT direkt bearbeiten (Quelle: missionTimer.jsx, dann neu kompilieren). */
;(function(){
/* missionTimer.jsx — T-minus Raketenstart-Countdown vor dem Buchungsformular.
   Exporte (window): useCountdown, MissionTimer.

   ┌───────────────────────────────────────────────────────────────────┐
   │  ANPASSBARE KONSTANTEN — als Props an <MissionTimer> übergeben      │
   │  oder hier in MISSION_DEFAULTS ändern.                              │
   │  eventDate    : Start des Events (ISO, lokale Zeit)                 │
   │  eventEndDate : Ende des Event-Tages → schaltet auf „MISSION LÄUFT" │
   │  place        : Ort (Anzeige in der Statuszeile)                    │
   │  freeSlots    : Anzahl freier Slots (Dringlichkeitszeile, 0 = aus)  │
   │  Farben/Glow kommen aus den CSS-Variablen (--accent, --caution …).  │
   └───────────────────────────────────────────────────────────────────┘ */
const MISSION_DEFAULTS = {
  eventDate: "2026-06-25T09:00:00",
  eventEndDate: "2026-06-25T18:00:00",
  place: "Fürstenfeldbruck",
  freeSlots: 18,
  brand: "KI-Werkstatt"
};
function pad2(n) {
  return String(n).padStart(2, "0");
}
function fmtDate(iso) {
  const d = new Date(iso);
  return pad2(d.getDate()) + "." + pad2(d.getMonth() + 1) + "." + d.getFullYear();
}

/* Timer-Logik — getrennt von der Darstellung.
   Liefert { state: 'before'|'live'|'after', days, hours, minutes, seconds }. */
function useCountdown(eventDate, eventEndDate) {
  const R = React;
  const start = R.useMemo(() => new Date(eventDate).getTime(), [eventDate]);
  const end = R.useMemo(() => new Date(eventEndDate || eventDate).getTime(), [eventEndDate, eventDate]);
  const calc = R.useCallback(() => {
    const now = Date.now();
    if (now < start) {
      let s = Math.floor((start - now) / 1000);
      const days = Math.floor(s / 86400);
      s -= days * 86400;
      const hours = Math.floor(s / 3600);
      s -= hours * 3600;
      const minutes = Math.floor(s / 60);
      const seconds = s - minutes * 60;
      return {
        state: "before",
        days,
        hours,
        minutes,
        seconds
      };
    }
    if (now <= end) return {
      state: "live",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
    return {
      state: "after",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }, [start, end]);
  const [t, setT] = R.useState(calc);
  R.useEffect(() => {
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000); // 1s-Tick, sauber aufgeräumt
    return () => clearInterval(id);
  }, [calc]);
  return t;
}
function MtModule({
  value,
  label,
  pad = 2,
  flip
}) {
  const v = pad ? String(value).padStart(pad, "0") : String(value);
  return /*#__PURE__*/React.createElement("div", {
    className: "mt-module"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-num"
  }, flip ? /*#__PURE__*/React.createElement("span", {
    key: v,
    className: "mt-flip"
  }, v) : v), /*#__PURE__*/React.createElement("div", {
    className: "mt-unit"
  }, label));
}
function MissionTimer(props) {
  const cfg = Object.assign({}, MISSION_DEFAULTS, props);
  const {
    state,
    days,
    hours,
    minutes,
    seconds
  } = useCountdown(cfg.eventDate, cfg.eventEndDate);
  const dateShort = fmtDate(cfg.eventDate);
  const onBook = cfg.onBook || function () {};
  const status = cfg.brand + " · Startfreigabe am " + dateShort;

  // Hintergrund-Video (≈8 MB) erst beim Scrollen laden — hält es komplett vom
  // initialen Seitenaufruf fern (PageSpeed). Diese Sektion liegt in einem
  // GSAP-transformierten Horizontal-Scroll, in dem IntersectionObserver bei
  // reiner Transform-Bewegung NICHT zuverlässig auslöst. Darum zwei Trigger:
  //  (1) IntersectionObserver — greift bei normalem/mobilem Stapel-Layout.
  //  (2) Scroll-Schwelle — sobald der Nutzer ~25 % der Seite nach unten
  //      scrollt, wird vorgeladen (genug Vorlauf zum Puffern). Wer nie
  //      scrollt, lädt es nie (Sektion wird dann auch nie gesehen).
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let loaded = false;
    const load = () => {
      if (loaded) return;
      loaded = true;
      v.src = "assets/timer-bg.mp4";
      const p = v.play();
      if (p && p.catch) p.catch(function () {});
      cleanup();
    };
    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      if (window.scrollY > max * 0.25) load();
    };
    let io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) load();
        });
      }, {
        rootMargin: "800px 0px"
      });
      io.observe(v);
    }
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    onScroll(); // falls die Seite bereits gescrollt geladen wird
    function cleanup() {
      if (io) {
        io.disconnect();
        io = null;
      }
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, []);
  return /*#__PURE__*/React.createElement("section", {
    className: "mt-band",
    "aria-label": "Mission-Countdown",
    style: {
      minHeight: "100svh",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("video", {
    ref: videoRef,
    poster: "assets/timer-poster.webp",
    muted: true,
    loop: true,
    playsInline: true,
    preload: "none",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: 0.4,
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      background: "radial-gradient(120% 90% at 50% 45%, rgba(7,11,22,.35) 8%, rgba(7,11,22,.72) 70%, #070b16), linear-gradient(0deg, #070b16, transparent 24%, transparent 78%, var(--bg-1))"
    }
  }), /*#__PURE__*/React.createElement(HazardEdge, {
    animate: true,
    style: {
      position: "relative",
      zIndex: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: "relative",
      zIndex: 2,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
      padding: "clamp(40px,6vw,70px) 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "caution-tag",
    style: {
      justifyContent: "center",
      marginBottom: 22,
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "live-dot",
    style: {
      background: "var(--caution)"
    }
  }), " ", status), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tik-badge",
    style: {
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "Poppins",
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".24em",
      textTransform: "uppercase",
      color: "var(--muted)",
      whiteSpace: "nowrap"
    }
  }, "pr\xE4sentiert auf dem"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 24,
      background: "var(--glass-line)"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/tik-logo-white.png",
    alt: "Tag der Industriekommunikation",
    style: {
      height: 26,
      width: "auto",
      display: "block"
    }
  }))), state === "before" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mt-tminus"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "spark",
    size: 15
  }), " bald ist es soweit"), /*#__PURE__*/React.createElement("div", {
    className: "mt-modules"
  }, /*#__PURE__*/React.createElement(MtModule, {
    value: days,
    label: "Tage",
    pad: 2
  }), /*#__PURE__*/React.createElement(MtModule, {
    value: hours,
    label: "Std",
    pad: 2
  }), /*#__PURE__*/React.createElement(MtModule, {
    value: minutes,
    label: "Min",
    pad: 2
  }), /*#__PURE__*/React.createElement(MtModule, {
    value: seconds,
    label: "Sek",
    pad: 2,
    flip: true
  }))), state === "live" && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "live-dot"
  }), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "Poppins",
      fontWeight: 600,
      letterSpacing: ".3em",
      fontSize: 13,
      color: "var(--accent)",
      textTransform: "uppercase"
    }
  }, "Mission l\xE4uft")), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(34px,5.5vw,68px)",
      textWrap: "balance"
    }
  }, "Heute live \u2014 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, cfg.place))), state === "after" && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 0 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-tminus",
    style: {
      color: "var(--muted)"
    }
  }, "Mission abgeschlossen"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(30px,4.6vw,56px)",
      textWrap: "balance"
    }
  }, "N\xE4chster Termin folgt.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      marginTop: 34
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-cta",
    style: {
      fontSize: 16,
      padding: "17px 34px"
    },
    onClick: onBook
  }, state === "after" ? "Auf die Warteliste" : "Jetzt Slot sichern", " ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow",
    size: 16
  })), cfg.freeSlots > 0 && state !== "after" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      fontFamily: "Poppins",
      fontSize: 13,
      letterSpacing: ".06em",
      color: "var(--ink-dim)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cone",
    size: 15
  }), " Nur noch ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--caution)",
      fontWeight: 600
    }
  }, cfg.freeSlots), " freie Slots an Stand 14"))), /*#__PURE__*/React.createElement(HazardEdge, {
    thin: true,
    animate: true,
    style: {
      position: "relative",
      zIndex: 2
    }
  }));
}
Object.assign(window, {
  useCountdown,
  MissionTimer
});
})();
