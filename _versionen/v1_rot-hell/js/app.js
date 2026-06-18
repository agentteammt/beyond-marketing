/* AUTO-GENERIERT aus app.jsx — NICHT direkt bearbeiten (Quelle: app.jsx, dann neu kompilieren). */
;(function(){
/* app.jsx — KI-Werkstatt landing page root.
   ====================================================================
   AUSTAUSCHBARE INHALTE — hier alles Eventspezifische anpassen:
   ==================================================================== */
const CONTENT = {
  brand: "KI-Werkstatt",
  claimLead: "10 Minuten in der",
  claimAccent: "KI-Werkstatt",
  claimSub: "Wir nehmen Ihr Marketing auseinander und sagen klar, wo KI sofort wirkt. Live, ehrlich, ohne Verkaufsgespräch.",
  // Leer lassen -> interaktiver Buchungsdialog (Slots + Supabase). Calendly-Link eintragen -> echtes Inline-Embed.
  CALENDLY_URL: "",
  event: {
    eventName: "bvik Tag der Industriekommunikation 2026",
    dateLong: "25. Juni 2026",
    dateShort: "25.06.2026",
    place: "Fürstenfeldbruck bei München",
    booth: "Stand 14"
  },
  // ---- Werkstatt-Slots ---------------------------------------------
  // 10-Min-Slots im Fenster, mit Pause; jeder Slot 3x buchbar.
  // Supabase-Zugang trägst du in index.html unter window.KIW_SUPABASE ein.
  booking: {
    date: "2026-06-25",
    // ISO-Datum, geht 1:1 an Supabase
    dateLabel: "Do · 25. Juni 2026",
    slotMinutes: 10,
    capacity: 3,
    // wie oft jeder Slot vergeben werden kann
    blocks: [{
      label: "Früher Nachmittag",
      start: "13:15",
      end: "14:15"
    }, {
      label: "Später Nachmittag",
      start: "15:30",
      end: "16:30"
    }]
  },
  marquee: ["GEO-Check", "LinkedIn-Check", "KI-Videos", "KI-Automatisierung", "Social-Media-Content", "360°-KI-Marketing", "Live an Stand 14"]
};

/* ==================== TWEAK-DEFAULTS ==================== */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentPair": ["#db0a30", "#06d6a0"],
  "cta": "#db0a30",
  "heroStyle": "Mond",
  "intensity": "Standard"
} /*EDITMODE-END*/;
const INTENSITY_MAP = {
  "Ruhig": 0.6,
  "Standard": 1,
  "Maximal": 1.35
};

/* ----------------------------------------------------------------- */
const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;

/* Register ScrollTrigger immediately (before any effect runs) so the pinned
   horizontal section can build its trigger regardless of effect ordering. */
if (window.gsap && window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
const PRM = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Single programmatic-scroll path: route through Lenis when it's running so
   button/nav jumps share the same momentum curve as the wheel. */
function smoothScrollTo(top) {
  top = Math.max(0, top);
  if (window.__lenis && !PRM()) {
    window.__lenis.scrollTo(top, {
      lock: false
    });
    return;
  }
  window.scrollTo({
    top,
    behavior: PRM() ? "auto" : "smooth"
  });
}
const H_PANELS = ["checks", "linkedin", "stand"];
function scrollToId(id) {
  const hi = H_PANELS.indexOf(id);
  if (hi !== -1) {
    // Horizontal panel: derive the absolute scroll position from the pinned
    // ScrollTrigger's range so the page lands exactly on that panel.
    const hs = window.__hscroll;
    if (hs && hs.st) {
      const frac = hs.count > 1 ? hi / (hs.count - 1) : 0;
      smoothScrollTo(hs.st.start + frac * (hs.st.end - hs.st.start));
      return;
    }
  }
  const el = document.getElementById(id);
  if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 64);
}

/* ----------------------------- Top bar ----------------------------- */
function TopBar({
  onBook
}) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onS = () => setSolid(window.scrollY > 40);
    onS();
    window.addEventListener("scroll", onS, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onS);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      transition: "background .4s, box-shadow .4s, backdrop-filter .4s",
      background: solid ? "color-mix(in srgb, var(--bg-0) 78%, transparent)" : "transparent",
      color: "var(--ink)",
      backdropFilter: solid ? "blur(12px)" : "none",
      WebkitBackdropFilter: solid ? "blur(12px)" : "none",
      boxShadow: solid ? "0 1px 0 var(--line)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 64
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    onClick: e => {
      e.preventDefault();
      smoothScrollTo(0);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo.png",
    alt: "KI-Werkstatt",
    style: {
      width: 30,
      height: 30
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "display",
    style: {
      fontSize: 16,
      letterSpacing: ".02em"
    }
  }, "KI-Werkstatt")), /*#__PURE__*/React.createElement("div", {
    className: "topbar-right",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tik-lockup tik-badge",
    style: {
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tik-lockup-lbl",
    style: {
      fontFamily: "Poppins",
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".22em",
      textTransform: "uppercase",
      color: "var(--muted)",
      whiteSpace: "nowrap"
    }
  }, "Live auf dem"), /*#__PURE__*/React.createElement("img", {
    src: "assets/tik-logo-white.png",
    alt: "Tag der Industriekommunikation",
    style: {
      height: 24,
      width: "auto",
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "tik-lockup-div",
    style: {
      width: 1,
      height: 26,
      background: "var(--line-strong)"
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-cta topbar-cta",
    style: {
      padding: "11px 20px",
      fontSize: 14
    },
    onClick: onBook
  }, "Slot sichern"))));
}

/* ----------------------------- Parallax fallback hero ----------------------------- */
function ParallaxHero({
  img,
  intro,
  approachMs = 1600,
  easing = "ease-out"
}) {
  const ref = useRef(null);
  const [arrived, setArrived] = useState(!intro);
  useEffect(() => {
    if (!intro) {
      setArrived(true);
      return;
    }
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setArrived(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [intro]);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = e => {
      const x = e.clientX / window.innerWidth - 0.5,
        y = e.clientY / window.innerHeight - 0.5;
      if (!ref.current) return;
      ref.current.querySelectorAll("[data-depth]").forEach(el => {
        const d = parseFloat(el.dataset.depth);
        el.style.transform = `translate(${x * d * 40}px, ${y * d * 30}px) scale(1.06)`;
      });
    };
    window.addEventListener("mousemove", onMove, {
      passive: true
    });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  const outerTransition = intro ? `transform ${approachMs}ms ${easing}, opacity ${approachMs}ms ${easing}, filter ${approachMs}ms ${easing}` : "none";
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      transform: arrived ? "scale(1)" : "scale(0.72)",
      filter: arrived ? "blur(0px)" : "blur(7px)",
      opacity: arrived ? 1 : 0.25,
      transition: outerTransition
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: "absolute",
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    "data-depth": "0.6",
    src: img || "assets/hero-overalls.webp",
    alt: "",
    fetchpriority: "high",
    decoding: "async",
    style: {
      position: "absolute",
      inset: "-4%",
      width: "108%",
      height: "108%",
      objectFit: "cover",
      transition: "transform .3s ease-out",
      opacity: 0.9
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(120% 90% at 30% 30%, transparent 30%, rgba(5,6,10,.5) 70%, #05060a), linear-gradient(90deg, #05060a 8%, transparent 55%)"
    }
  })));
}

/* ----------------------------- Hero ----------------------------- */
function Hero({
  tweaks,
  onBook
}) {
  const mountRef = useRef(null);
  const apiRef = useRef(null);
  const heroRef = useRef(null);
  const glassRef = useRef(null);
  const intro = useHeroIntro();
  const want3D = false;
  const heroMode = tweaks.heroStyle === "Station" ? "station" : "image";
  const heroImage = tweaks.heroStyle === "Mond" ? "assets/hero-moon.webp" : "assets/hero-overalls.webp";
  const [using3D, setUsing3D] = useState(false);

  // init / teardown hero engine
  useEffect(() => {
    if (!want3D) {
      if (apiRef.current) {
        apiRef.current.destroy();
        apiRef.current = null;
      }
      setUsing3D(false);
      return;
    }
    if (!window.KIWHero || !window.KIWHero.supported()) {
      setUsing3D(false);
      return;
    }
    const cfg = {
      accent: tweaks.accentPair[0],
      accent2: tweaks.accentPair[1],
      cta: tweaks.cta,
      intensity: INTENSITY_MAP[tweaks.intensity],
      mode: heroMode,
      imageUrl: heroImage,
      intro: intro.active && heroMode === "image" ? {
        approachMs: intro.timing.approachMs,
        igniteMs: intro.timing.igniteMs,
        ribbonStaggerMs: intro.timing.ribbonStaggerMs,
        parallax: intro.timing.parallax
      } : null
    };
    const api = window.KIWHero.init(mountRef.current, cfg);
    if (api) {
      apiRef.current = api;
      setUsing3D(true);
    } else {
      setUsing3D(false);
    }
    const onScroll = () => {
      if (!apiRef.current) return;
      const h = window.innerHeight;
      apiRef.current.setScroll(Math.min(1, window.scrollY / h));
    };
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (apiRef.current) {
        apiRef.current.destroy();
        apiRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [want3D, heroMode, heroImage]);

  // live config updates
  useEffect(() => {
    if (apiRef.current) apiRef.current.setConfig({
      accent: tweaks.accentPair[0],
      accent2: tweaks.accentPair[1],
      cta: tweaks.cta,
      intensity: INTENSITY_MAP[tweaks.intensity]
    });
  }, [tweaks.accentPair, tweaks.cta, tweaks.intensity]);

  // when the intro is skipped or finishes, snap the WebGL scene to its final state
  useEffect(() => {
    if (intro.phase === "done" && apiRef.current && apiRef.current.skipIntro) apiRef.current.skipIntro();
  }, [intro.phase, using3D]);
  // light-hero: maus-reaktiver roter Glow + Glas-Parallaxe
  useEffect(() => {
    const sec = heroRef.current;
    if (!sec) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = e => {
      const r = sec.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      sec.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      sec.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      if (glassRef.current) glassRef.current.style.transform = "translate(" + ((x - 0.5) * 30).toFixed(1) + "px," + ((y - 0.5) * 24).toFixed(1) + "px) rotate(" + ((x - 0.5) * 5).toFixed(2) + "deg)";
    };
    window.addEventListener("mousemove", onMove, {
      passive: true
    });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  const ev = CONTENT.event;
  const T = intro.timing;
  const typing = intro.phase === "type";
  const textDone = intro.phase === "done";
  const eyebrowShow = intro.phase !== "approach";
  const fade = (show, delay) => ({
    opacity: show ? 1 : 0,
    transform: show ? "none" : "translateY(14px)",
    transition: "opacity " + T.ctaFadeMs + "ms " + T.easing + " " + delay + "ms, transform " + T.ctaFadeMs + "ms " + T.easing + " " + delay + "ms",
    pointerEvents: show ? "auto" : "none"
  });
  return /*#__PURE__*/React.createElement("section", {
    id: "top",
    ref: heroRef,
    style: {
      position: "relative",
      minHeight: "100svh",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      background: "var(--bg-0)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      background: "radial-gradient(circle at var(--mx,72%) var(--my,40%), color-mix(in srgb,var(--accent) 18%, transparent), transparent 50%)",
      transition: "background .25s ease-out"
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    className: "hero-glass"
  }, /*#__PURE__*/React.createElement("img", {
    ref: glassRef,
    src: "assets/hero-glass.png",
    alt: "",
    style: {
      width: "100%",
      display: "block",
      transition: "transform .25s ease-out"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: "relative",
      zIndex: 2,
      paddingTop: 90,
      paddingBottom: 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: Object.assign({
      marginBottom: 26
    }, fade(eyebrowShow, 0))
  }, "Jetzt mitmachen"), intro.active ? /*#__PURE__*/React.createElement(Typewriter, {
    lead: CONTENT.claimLead,
    accent: CONTENT.claimAccent,
    speed: T.typeSpeedMs,
    play: typing,
    done: textDone,
    onDone: intro.skip
  }) : /*#__PURE__*/React.createElement("h1", {
    "aria-label": CONTENT.claimLead + " " + CONTENT.claimAccent,
    style: {
      fontSize: "clamp(40px,7vw,88px)",
      lineHeight: 0.98,
      marginBottom: 8
    }
  }, CONTENT.claimLead, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)",
      textShadow: "0 0 calc(50px*var(--glow)) color-mix(in srgb,var(--accent) 55%, transparent)"
    }
  }, CONTENT.claimAccent)), /*#__PURE__*/React.createElement("p", {
    style: {
      ...Object.assign({
        fontSize: "clamp(16px,2.1vw,21px)",
        color: "var(--ink-dim)",
        maxWidth: 540,
        margin: "20px 0 0",
        fontWeight: 300
      }, fade(textDone, 0)),
      fontSize: "20px",
      fontFamily: '"EB Garamond", Garamond, "Times New Roman", serif',
      fontStyle: "italic",
      fontWeight: 400,
      lineHeight: 1.45
    }
  }, CONTENT.claimSub), /*#__PURE__*/React.createElement("div", {
    style: Object.assign({
      display: "flex",
      gap: 14,
      flexWrap: "wrap",
      marginTop: 38
    }, fade(textDone, 120))
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-cta",
    onClick: onBook
  }, "Werkstatt-Slot sichern ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => scrollToId("checks")
  }, "Was wir checken")), /*#__PURE__*/React.createElement("div", {
    style: Object.assign({
      display: "flex",
      gap: 26,
      flexWrap: "wrap",
      marginTop: 42,
      color: "var(--ink-dim)"
    }, fade(textDone, 240))
  }, /*#__PURE__*/React.createElement(Meta, {
    icon: "cal",
    label: ev.dateLong
  }), /*#__PURE__*/React.createElement(Meta, {
    icon: "pin",
    label: ev.place
  }), /*#__PURE__*/React.createElement(Meta, {
    icon: "target",
    label: ev.eventName
  })))), /*#__PURE__*/React.createElement("div", {
    className: "hero-draghint",
    style: {
      position: "absolute",
      bottom: 26,
      left: 0,
      right: 0,
      zIndex: 2,
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "var(--muted)",
      fontFamily: "Poppins",
      fontSize: 12,
      letterSpacing: ".18em",
      textTransform: "uppercase"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: using3D ? "drag" : "spark",
    size: 16
  }), using3D ? heroMode === "station" ? "Ziehen zum Drehen · Scrollen" : "Bewegen & Ziehen · Scrollen" : "Scrollen zum Entdecken")));
}
function Meta({
  icon,
  label
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      fontSize: 13.5,
      fontFamily: "Poppins"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 17
  })), label);
}

/* ----------------------------- Sections ----------------------------- */
/* ---- full-height live-check panel (GEO / LinkedIn) ---- */
function CheckPanel({
  id,
  index,
  title,
  lead,
  points,
  img,
  alt,
  scanLabel,
  accent2,
  reticle,
  stamp,
  onBook
}) {
  const sr = useScanReveal(2200);
  const root = Object.assign({
    position: "relative",
    minHeight: "100svh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    borderTop: "1px solid var(--line)"
  }, accent2 ? {
    "--accent": "var(--accent-2)"
  } : {});
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    style: root,
    ref: sr.ref
  }, /*#__PURE__*/React.createElement("img", {
    src: img,
    alt: alt,
    loading: "lazy",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(120% 90% at 50% 45%, transparent 30%, rgba(255,255,255,.85) 78%, var(--bg-0)), linear-gradient(0deg, var(--bg-0), transparent 22%, transparent 80%, var(--bg-0))"
    }
  }), /*#__PURE__*/React.createElement(ConeFloat, {
    size: 34,
    delay: 0.6,
    style: {
      bottom: "12%",
      right: "6%"
    }
  }), /*#__PURE__*/React.createElement(ScanFrame, null), sr.playing && /*#__PURE__*/React.createElement("span", {
    className: "scan-reveal-line play",
    key: sr.run,
    "aria-hidden": "true"
  }), stamp && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      zIndex: 4,
      right: "7%",
      top: "23%"
    }
  }, /*#__PURE__*/React.createElement(StatusStempel, {
    label: stamp.label,
    sub: stamp.sub,
    color: stamp.color
  })), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: "relative",
      zIndex: 2,
      paddingTop: 96,
      paddingBottom: 80,
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "scan-reveal-content" + (sr.playing ? " play" : "") + (sr.badging ? " badging" : ""),
    key: sr.run,
    style: {
      "--scan-dur": "2200ms",
      maxWidth: 1180,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      opacity: sr.reduce ? 1 : sr.run > 0 ? undefined : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 14,
      flexWrap: "wrap",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(LiveBadge, {
    color: "var(--accent)"
  }), /*#__PURE__*/React.createElement("span", {
    className: "kicker-num"
  }, index)), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(24px,3vw,40px)",
      lineHeight: 1.06,
      marginBottom: 12,
      color: "var(--ink)",
      textWrap: "balance"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--ink-dim)",
      fontSize: 16,
      marginBottom: 30,
      maxWidth: 520
    }
  }, lead), /*#__PURE__*/React.createElement(BigScan, {
    label: scanLabel
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-cta",
    style: {
      marginTop: 30
    },
    onClick: onBook
  }, "Slot f\xFCr diesen Check sichern ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow",
    size: 16
  })))));
}
function GeoCheckSection({
  onBook
}) {
  return /*#__PURE__*/React.createElement(CheckPanel, {
    id: "checks",
    index: "// 01 \xB7 GEO-Check \xB7 live an Ihrer Domain",
    title: "Findet die KI Ihr Unternehmen?",
    lead: "Generative Suche entscheidet, wer genannt wird. Wir pr\xFCfen Ihre Website live vor Ort.",
    points: ["Sichtbar für KI", "Zitiert statt Wettbewerb", "Strukturlücken"],
    img: "assets/viz-red-1.png",
    alt: "Mechaniker betrachtet auf einem Monitor eine im Weltraum schwebende KI-Visualisierung",
    scanLabel: "GEO-Analyse l\xE4uft",
    reticle: "GEO-SCAN",
    onBook: onBook
  });
}
function LinkedInCheckSection({
  onBook
}) {
  return /*#__PURE__*/React.createElement(CheckPanel, {
    id: "linkedin",
    accent2: true,
    index: "// 02 \xB7 LinkedIn-Check \xB7 live an Ihrem Profil",
    title: "Ihr LinkedIn Profil im Quick-Check",
    lead: "Ihr lautester B2B-Kanal \u2014 wir pr\xFCfen live, was Wirkung bringt und was verbessert werden kann.",
    points: ["Positionierung & Vertrauen", "Automatisierbare Reichweite", "Hebel, priorisiert"],
    img: "assets/viz-red-2.png",
    alt: "Mechaniker mit Schutzbrille biegt einen Schraubenschl\xFCssel, aus dem farbige Lichtstr\xF6me flie\xDFen",
    scanLabel: "Profil-Scan l\xE4uft",
    reticle: "LINKEDIN-SCAN",
    onBook: onBook
  });
}

/* ---- full-height demos + result CTA ---- */
function DemosSection({
  onBook
}) {
  const sr = useScanReveal(4000);
  return /*#__PURE__*/React.createElement("section", {
    id: "stand",
    className: "grid-bg",
    style: {
      position: "relative",
      minHeight: "100svh",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      borderTop: "1px solid var(--line)"
    },
    ref: sr.ref
  }, /*#__PURE__*/React.createElement(ConeFloat, {
    size: 28,
    delay: 1.6,
    style: {
      bottom: "18%",
      right: "6%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 320,
      height: 320,
      opacity: 0.06,
      backgroundImage: "repeating-linear-gradient(45deg, var(--caution) 0 22px, transparent 22px 44px)",
      maskImage: "radial-gradient(circle at top right, #000, transparent 70%)",
      WebkitMaskImage: "radial-gradient(circle at top right, #000, transparent 70%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement(ScanFrame, null), sr.playing && /*#__PURE__*/React.createElement("span", {
    className: "scan-reveal-line play",
    key: sr.run,
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: "relative",
      zIndex: 1,
      width: "100%",
      paddingTop: 120,
      paddingBottom: 104
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "scan-reveal-content" + (sr.playing ? " play" : ""),
    key: sr.run,
    style: {
      opacity: sr.reduce ? 1 : sr.run > 0 ? undefined : 0
    }
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(Eyebrow, {
    num: "// 03"
  }, "KI zum Anfassen"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(30px,4.6vw,56px)",
      maxWidth: 820,
      marginBottom: 72,
      textWrap: "balance"
    }
  }, "Weitere ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "KI-Werkstatt-Impulse"), ".")), /*#__PURE__*/React.createElement(Reveal, {
    delay: 100
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 28,
      marginBottom: 44
    },
    className: "demogrid"
  }, /*#__PURE__*/React.createElement(DemoCard, {
    icon: "video",
    title: "KI-Videos",
    body: "Von Skript bis fertigem Clip: wie aus einer Produktidee in Minuten ein vorzeigbares Marketing-Video wird."
  }), /*#__PURE__*/React.createElement(DemoCard, {
    icon: "bolt",
    title: "KI-Automatisierung",
    body: "Wiederkehrende Marketing-Abl\xE4ufe, die sich selbst erledigen \u2014 vom Lead bis zum Reporting."
  }), /*#__PURE__*/React.createElement(DemoCard, {
    icon: "share",
    title: "Social-Media-Content",
    body: "Automatisiert geplant, getextet und gestaltet: Content-Pipelines, die Ihren Kanal ohne Mehraufwand tragen."
  }))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 160
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: 4,
      overflow: "hidden",
      background: "linear-gradient(120deg, color-mix(in srgb,var(--cta) 12%, var(--bg-1)), var(--bg-1) 70%)",
      boxShadow: "inset 0 0 0 1px var(--glass-line)"
    }
  }, /*#__PURE__*/React.createElement(HazardEdge, {
    thin: true,
    animate: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "resultbar",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 28,
      padding: "28px 32px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "caution-tag",
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sign",
    size: 15
  }), " Ergebnis zum Mitnehmen"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: "clamp(22px,2.6vw,30px)",
      marginBottom: 6
    }
  }, "Ehrliche und konkret Tipps und Tricks f\xFCr Ihren KI Alltag, jetzt anmelden."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--ink-dim)",
      fontSize: 15,
      margin: 0
    }
  }, "Status plus die n\xE4chsten sinnvollen Schritte f\xFCr Ihr Marketing.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-cta",
    onClick: onBook
  }, "Slot sichern ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow",
    size: 16
  }))))))));
}

/* ---- "Wer steht dahinter" — Mission Control (team::mt) ---- */
function MissionControlSection({
  onBook
}) {
  const sr = useScanReveal(2200);
  return /*#__PURE__*/React.createElement("section", {
    id: "team",
    className: "grid-bg mglow",
    style: {
      position: "relative",
      minHeight: "100svh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden"
    },
    ref: sr.ref
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    className: "mglow-layer"
  }), /*#__PURE__*/React.createElement(HazardEdge, {
    animate: true,
    style: {
      position: "relative",
      zIndex: 3
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      background: "radial-gradient(70% 60% at 50% 42%, color-mix(in srgb,var(--accent) 8%, transparent), transparent 70%), radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(255,255,255,.9))"
    }
  }), /*#__PURE__*/React.createElement(ConeFloat, {
    size: 30,
    delay: 1.1,
    style: {
      top: "16%",
      left: "7%"
    }
  }), /*#__PURE__*/React.createElement(ScanFrame, null), sr.playing && /*#__PURE__*/React.createElement("span", {
    className: "scan-reveal-line play",
    key: sr.run,
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: "relative",
      zIndex: 2,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      paddingTop: 110,
      paddingBottom: 90
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "scan-reveal-content" + (sr.playing ? " play" : ""),
    key: sr.run,
    style: {
      "--scan-dur": "2200ms",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: 760,
      opacity: sr.reduce ? 1 : sr.run > 0 ? undefined : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mc-emblem",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mc-glow"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mc-ring r2"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mc-ring r1"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mc-ring r3"
  }), /*#__PURE__*/React.createElement("img", {
    className: "mc-emblem-logo",
    src: "assets/logo.png",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "mc-stamp",
    style: {
      position: "absolute",
      right: 0,
      bottom: "10%",
      transform: "translateX(78%)",
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement(StatusStempel, {
    label: "Werkstatt-Betreiber",
    sub: "team::mt",
    color: "var(--accent)"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 18
    }
  }, "// Mission Control"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(30px,4.4vw,56px)",
      lineHeight: 1.05,
      marginBottom: 18,
      textWrap: "balance"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "team::mt"), " \u2014 das Team hinter der Werkstatt"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--ink-dim)",
      fontSize: 17,
      lineHeight: 1.62,
      marginBottom: 18,
      maxWidth: 620
    }
  }, "Wir sind eine Marketing-Agentur aus M\xFCnchen, die Marketing-Abteilungen KI-f\xE4hig macht \u2014 von Sichtbarkeit bis Automatisierung. Die KI-Werkstatt ist unser Stand, an dem wir genau das live zeigen."), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: "clamp(18px,2.2vw,26px)",
      color: "var(--accent)",
      letterSpacing: ".01em",
      marginBottom: 34
    }
  }, "Beyond Marketing."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      flexWrap: "wrap",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-cta",
    href: "https://team-mt.de",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "team-mt.de ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow",
    size: 16
  }))))), /*#__PURE__*/React.createElement(HazardEdge, {
    thin: true,
    animate: true,
    style: {
      position: "relative",
      zIndex: 3
    }
  }));
}
function BandSection() {
  return /*#__PURE__*/React.createElement("section", {
    "data-glitch": true,
    style: {
      position: "relative",
      height: "min(62vh,520px)",
      display: "grid",
      placeItems: "center",
      overflow: "hidden",
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/viz-red-3.png",
    alt: "Leuchtende 'Work in Progress'-Tafel mit Pylonen auf einer Metallplattform im Weltraum",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity: 0.5,
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(80% 80% at 50% 50%, transparent, rgba(255,255,255,.85)), linear-gradient(0deg, var(--bg-0), transparent 40%, transparent 60%, var(--bg-0))"
    }
  }), /*#__PURE__*/React.createElement(Reveal, {
    className: "wrap",
    style: {
      position: "relative",
      zIndex: 1,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "caution-tag",
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sign",
    size: 16
  }), " Baustelle im Orbit"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(26px,4.2vw,52px)",
      maxWidth: 900,
      margin: "0 auto",
      textWrap: "balance"
    }
  }, "KI ist kein Werkzeug f\xFCr sp\xE4ter.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "Es liegt schon auf Ihrer Werkbank.")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--ink-dim)",
      fontSize: 17,
      maxWidth: 560,
      margin: "22px auto 0"
    }
  }, "Wir zeigen Ihnen am Stand, welche Teile davon sofort in Ihr Marketing passen.")));
}

/* ---- horizontal pinned scroll for the four full-height panels (desktop only) ----
   Pinned + scrubbed via GSAP ScrollTrigger; the track slides left as the page
   scrolls down. All smoothing is supplied by the shared Lenis instance (lerp .08),
   so the horizontal glide trails the wheel with the same momentum as the rest of
   the page and never hard-snaps at the section boundaries. */
function HorizontalScroll({
  labels,
  children
}) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const labelRefs = useRef([]);
  const [enabled, setEnabled] = useState(false);
  const count = React.Children.count(children);
  useEffect(() => {
    const compute = () => {
      const wide = window.matchMedia("(min-width: 901px)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const libs = !!(window.gsap && window.ScrollTrigger);
      setEnabled(wide && !coarse && !reduce && libs);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  useEffect(() => {
    const wrap = wrapRef.current,
      track = trackRef.current;
    if (wrap) wrap.dataset.enabled = enabled ? "1" : "0";
    if (!enabled || !wrap || !track || !window.gsap || !window.ScrollTrigger) {
      if (track) track.style.transform = "";
      return;
    }
    const gsap = window.gsap,
      ScrollTrigger = window.ScrollTrigger;
    const distance = () => Math.max(1, track.scrollWidth - window.innerWidth);
    const paint = p => {
      if (fillRef.current) fillRef.current.style.width = (p * 100).toFixed(2) + "%";
      const active = Math.round(p * (count - 1));
      labelRefs.current.forEach((el, i) => {
        if (el) el.style.color = i === active ? "var(--accent)" : "var(--muted)";
      });
    };
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: () => "+=" + distance(),
        pin: true,
        pinSpacing: true,
        scrub: true,
        // follow scroll 1:1 — Lenis' lerp is the only smoothing layer
        anticipatePin: 1,
        // pre-arm the pin so the boundary transition stays seamless
        invalidateOnRefresh: true,
        onUpdate: self => paint(self.progress),
        onRefresh: self => paint(self.progress)
      }
    });
    window.__hscroll = {
      st: tween.scrollTrigger,
      count
    };
    paint(0);

    // Pin distance depends on final layout — recompute after fonts / images / boot settle.
    const refresh = () => ScrollTrigger.refresh();
    const t1 = setTimeout(refresh, 450);
    window.addEventListener("load", refresh);
    return () => {
      clearTimeout(t1);
      window.removeEventListener("load", refresh);
      if (window.__hscroll && tween.scrollTrigger && window.__hscroll.st === tween.scrollTrigger) window.__hscroll = null;
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      track.style.transform = "";
      ScrollTrigger.refresh();
    };
  }, [enabled, count]);
  if (!enabled) {
    return /*#__PURE__*/React.createElement("div", {
      id: "hwrap",
      ref: wrapRef,
      "data-enabled": "0"
    }, children);
  }
  return /*#__PURE__*/React.createElement("section", {
    id: "hwrap",
    ref: wrapRef,
    "data-enabled": "1",
    style: {
      height: "100vh",
      overflow: "hidden",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    style: {
      display: "flex",
      height: "100%",
      width: "max-content",
      willChange: "transform"
    }
  }, React.Children.map(children, (ch, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: "0 0 100vw",
      width: "100vw",
      height: "100%",
      position: "relative",
      overflow: "hidden"
    }
  }, ch))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 22,
      left: 0,
      right: 0,
      zIndex: 5,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 11,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 24
    }
  }, labels.map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    ref: el => labelRefs.current[i] = el,
    style: {
      fontFamily: "Poppins",
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: ".2em",
      textTransform: "uppercase",
      color: i === 0 ? "var(--accent)" : "var(--muted)",
      transition: "color .3s"
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 210,
      height: 2,
      background: "rgba(140,190,230,.18)",
      borderRadius: 2,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: fillRef,
    style: {
      height: "100%",
      width: "0%",
      background: "var(--accent)",
      boxShadow: "0 0 10px var(--accent)"
    }
  }))));
}
function AblaufSection() {
  return /*#__PURE__*/React.createElement("section", {
    id: "ablauf",
    className: "sec-pad grid-bg theme-shift",
    "data-theme-shift": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: "relative",
      zIndex: 1,
      display: "grid",
      gridTemplateColumns: "0.85fr 1.15fr",
      gap: "clamp(32px,6vw,90px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ablaufhead"
  }, /*#__PURE__*/React.createElement(Reveal, null, /*#__PURE__*/React.createElement(Eyebrow, {
    num: "// 04"
  }, "So l\xE4uft die Werkstatt ab"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(30px,4.2vw,52px)",
      marginBottom: 22,
      textWrap: "balance"
    }
  }, "10 Minuten. Ein klarer Befund. Kein Pitch."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--ink-dim)",
      fontSize: 16,
      marginBottom: 30
    }
  }, "Wir arbeiten an Ihrem echten Material. Sie gehen mit Erkenntnissen, nicht mit einem Flyer."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-cta",
    onClick: () => scrollToId("book")
  }, "Slot sichern ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow",
    size: 16
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StepRow, {
    num: "1",
    icon: "cal",
    title: "Slot sichern",
    body: "\xDCber LinkedIn oder hier: Sie buchen Ihre 10 Minuten an Stand 14. Wir halten den Platz f\xFCr Sie frei."
  }), /*#__PURE__*/React.createElement(StepRow, {
    num: "2",
    icon: "scan",
    title: "Quick-Check vor Ort",
    body: "Wir \xF6ffnen Ihre Website und Ihr LinkedIn-Profil und lassen GEO- und LinkedIn-Check live laufen."
  }), /*#__PURE__*/React.createElement(StepRow, {
    num: "3",
    icon: "spark",
    title: "Live-Auswertung & Demos",
    body: "Sie sehen Ihren Status sofort \u2014 und live, wie KI-Videos, Automatisierungen und Social-Content entstehen."
  }), /*#__PURE__*/React.createElement(StepRow, {
    num: "4",
    icon: "chart",
    title: "Roadmap zum Mitnehmen",
    body: "Priorisierte n\xE4chste Schritte f\xFCr Ihr Marketing \u2014 konkret, ehrlich, ohne Verkaufsgespr\xE4ch.",
    last: true
  }))));
}
function BookSection({
  onBookFired
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "book",
    className: "sec-pad mglow"
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    className: "mglow-layer"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      zIndex: 4,
      right: "6%",
      top: "8%"
    },
    className: "book-stamp"
  }, /*#__PURE__*/React.createElement(StatusStempel, {
    label: "Jetzt anmelden",
    color: "var(--accent)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1.05fr",
      gap: "clamp(32px,5vw,72px)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    className: "bookcopy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "caution-tag",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "cone",
    size: 16
  }), " Begrenzte Pl\xE4tze \xB7 Stand 14"), /*#__PURE__*/React.createElement(Eyebrow, {
    num: "// 05"
  }, "Werkstatt-Slot buchen"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: "clamp(32px,4.6vw,60px)",
      marginBottom: 20,
      textWrap: "balance"
    }
  }, "Sichern Sie sich Ihre ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "10 Minuten"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--ink-dim)",
      fontSize: 17,
      marginBottom: 30,
      maxWidth: 460
    }
  }, "Die Pl\xE4tze an Stand 14 sind begrenzt. W\xE4hlen Sie einen Slot \u2014 wir bereiten Ihren Check vor."), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "grid",
      gap: 16
    }
  }, [["clock", "Nur 10 Minuten Ihrer Messezeit"], ["target", "An Ihrem echten Webauftritt & Profil"], ["check", "Konkreter Befund statt Verkaufsgespräch"]].map(([ic, tx]) => /*#__PURE__*/React.createElement("li", {
    key: tx,
    style: {
      display: "flex",
      gap: 14,
      alignItems: "center",
      color: "var(--ink)",
      fontSize: 15.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      flex: "none",
      borderRadius: 2,
      display: "grid",
      placeItems: "center",
      color: "var(--accent)",
      boxShadow: "inset 0 0 0 1px var(--line-strong)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18
  })), tx)))), /*#__PURE__*/React.createElement(Reveal, {
    delay: 120
  }, /*#__PURE__*/React.createElement(BookingEmbed, {
    calendlyUrl: CONTENT.CALENDLY_URL,
    booking: CONTENT.booking,
    event: CONTENT.event,
    onBookClick: onBookFired
  }))));
}

/* ----------------------------- Sticky mobile CTA ----------------------------- */
function StickyCTA({
  onBook
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onS = () => setShow(window.scrollY > window.innerHeight * 0.28);
    window.addEventListener("scroll", onS, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onS);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "sticky-cta",
    style: {
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 90,
      padding: "16px 16px calc(12px + env(safe-area-inset-bottom))",
      background: "color-mix(in srgb, var(--bg-0) 88%, transparent)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      transform: show ? "translateY(0)" : "translateY(110%)",
      transition: "transform .4s cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement(HazardEdge, {
    thin: true,
    animate: true,
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-cta",
    style: {
      width: "100%"
    },
    onClick: onBook
  }, "Werkstatt-Slot sichern ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow",
    size: 16
  })));
}

/* ----------------------------- App ----------------------------- */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // ---- Lenis smooth scroll (whole page, vertical) + shared RAF with GSAP ----
  // One RAF loop only: gsap.ticker drives lenis.raf, and every Lenis scroll event
  // pushes ScrollTrigger.update — so the pinned horizontal section stays perfectly
  // in sync with the page's smooth scroll. Disabled under reduced-motion.
  useEffect(() => {
    if (PRM() || !window.Lenis || !window.gsap) return;
    const gsap = window.gsap,
      ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Calmer feel: lower lerp = longer, smoother glide; reduced wheel/touch
    // multipliers so each scroll input travels less and nothing feels frantic.
    const lenis = new window.Lenis({
      lerp: 0.06,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
      smoothWheel: true
    });
    window.__lenis = lenis;
    if (ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
    const tick = time => lenis.raf(time * 1000); // gsap ticker gives seconds, lenis wants ms
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const onResize = () => ScrollTrigger && ScrollTrigger.refresh();
    window.addEventListener("load", onResize);
    const id = setTimeout(onResize, 500);
    return () => {
      clearTimeout(id);
      window.removeEventListener("load", onResize);
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (window.__lenis === lenis) window.__lenis = null;
    };
  }, []);

  // map tweaks -> CSS variables
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--accent", t.accentPair[0]);
    r.setProperty("--accent-2", t.accentPair[1]);
    r.setProperty("--cta", t.cta);
    r.setProperty("--glow", String(INTENSITY_MAP[t.intensity] || 1));
  }, [t.accentPair, t.cta, t.intensity]);

  // dismiss boot splash (robust: no transition/raf dependency for removal)
  useEffect(() => {
    const b = document.getElementById("boot");
    if (!b) return;
    const id = setTimeout(() => {
      b.classList.add("gone");
      setTimeout(() => {
        b.style.display = "none";
      }, 650);
    }, 250);
    return () => clearTimeout(id);
  }, []);

  // (2) headline typewriter — types each h2/.display in (like the hero H1) on first view
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const all = document.querySelectorAll("h2,.display");
    const els = [...all].filter(el => !el.closest(".scan-reveal-content, #hwrap, .mt-band, [data-notype]"));
    if (!els.length) return;
    const typeIn = (el, speed) => {
      if (el.dataset.tw) return;
      el.dataset.tw = "1";
      const chars = [];
      (function walk(node) {
        [...node.childNodes].forEach(ch => {
          if (ch.nodeType === 3) {
            const frag = document.createDocumentFragment();
            for (const c of ch.textContent) {
              const s = document.createElement("span");
              s.className = "tw-ch";
              s.textContent = c;
              frag.appendChild(s);
              chars.push(s);
            }
            node.replaceChild(frag, ch);
          } else if (ch.nodeType === 1 && ch.tagName !== "BR") {
            walk(ch);
          }
        });
      })(el);
      if (!chars.length) return;
      const caret = document.createElement("span");
      caret.className = "tw-caret2";
      caret.textContent = "▍";
      caret.setAttribute("aria-hidden", "true");
      chars[0].before(caret);
      let i = 0;
      const step = () => {
        if (i < chars.length) {
          chars[i].classList.add("on");
          chars[i].after(caret);
          i++;
          setTimeout(step, speed);
        } else {
          caret.remove();
        }
      };
      setTimeout(step, 90);
    };
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        typeIn(e.target, 26);
        io.unobserve(e.target);
      }
    }), {
      threshold: 0.3
    });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // (4) scroll-triggered dark->light section theme switch
  useEffect(() => {
    const els = document.querySelectorAll("[data-theme-shift]");
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.target.classList.toggle("lit", e.isIntersecting && e.intersectionRatio > 0.45));
    }, {
      threshold: [0, 0.45, 0.7, 1]
    });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  const goBook = useCallback(() => scrollToId("book"), []);
  const goBookFocus = useCallback(() => {
    scrollToId("book");
    setTimeout(() => {
      const el = document.querySelector("#book input");
      if (el) try {
        el.focus({
          preventScroll: true
        });
      } catch (e) {
        el.focus();
      }
    }, 650);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TopBar, {
    onBook: goBook
  }), /*#__PURE__*/React.createElement(Hero, {
    tweaks: t,
    onBook: goBook
  }), /*#__PURE__*/React.createElement(HorizontalScroll, {
    labels: ["GEO-Check", "LinkedIn", "Demos", "Countdown"]
  }, /*#__PURE__*/React.createElement(GeoCheckSection, {
    onBook: goBook
  }), /*#__PURE__*/React.createElement(LinkedInCheckSection, {
    onBook: goBook
  }), /*#__PURE__*/React.createElement(DemosSection, {
    onBook: goBook
  }), /*#__PURE__*/React.createElement(MissionTimer, {
    eventDate: "2026-06-25T09:00:00",
    eventEndDate: "2026-06-25T18:00:00",
    place: "F\xFCrstenfeldbruck",
    freeSlots: 18,
    brand: CONTENT.brand,
    onBook: goBookFocus
  })), /*#__PURE__*/React.createElement(ScanCut, null), /*#__PURE__*/React.createElement(AblaufSection, null), /*#__PURE__*/React.createElement(ScanCut, null), /*#__PURE__*/React.createElement(TrustStrip, null), /*#__PURE__*/React.createElement(BookSection, {
    onBookFired: () => {}
  }), /*#__PURE__*/React.createElement(ScanCut, null), /*#__PURE__*/React.createElement(MissionControlSection, {
    onBook: goBook
  }), /*#__PURE__*/React.createElement(ScanCut, null), /*#__PURE__*/React.createElement(QuickBook, {
    event: CONTENT.event,
    onBook: goBook
  }), /*#__PURE__*/React.createElement(Marquee, {
    items: CONTENT.marquee
  }), /*#__PURE__*/React.createElement(BandSection, null), /*#__PURE__*/React.createElement(BaustellenschildGenerator, {
    variant: "section"
  }), /*#__PURE__*/React.createElement(EventFooter, {
    event: CONTENT.event,
    logo: "assets/logo.png",
    onBookClick: goBook
  }), /*#__PURE__*/React.createElement(StickyCTA, {
    onBook: goBook
  }), /*#__PURE__*/React.createElement(GlobalScanCursor, null), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Farben"
  }), /*#__PURE__*/React.createElement(TweakColor, {
    label: "Leitfarbe",
    value: t.accentPair,
    options: [["#db0a30", "#06d6a0"], ["#e23a2e", "#06d6a0"], ["#c81d4a", "#1fb6ff"], ["#0a8d83", "#12a06a"]],
    onChange: v => setTweak("accentPair", v)
  }), /*#__PURE__*/React.createElement(TweakColor, {
    label: "CTA-Farbe",
    value: t.cta,
    options: ["#db0a30", "#e23a2e", "#ff5a3c", "#c20029"],
    onChange: v => setTweak("cta", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Hero"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Hero-Stil",
    value: t.heroStyle,
    options: ["Overall", "Mond", "Station", "Parallax"],
    onChange: v => setTweak("heroStyle", v)
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Intensit\xE4t",
    value: t.intensity,
    options: ["Ruhig", "Standard", "Maximal"],
    onChange: v => setTweak("intensity", v)
  })));
}
ReactDOM.createRoot(document.getElementById("app")).render(/*#__PURE__*/React.createElement(App, null));
})();
