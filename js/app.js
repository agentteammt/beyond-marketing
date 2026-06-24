/* AUTO-GENERIERT aus app.jsx — NICHT direkt bearbeiten (Quelle: app.jsx, dann neu kompilieren). */
;(function(){
/* app.jsx — KI-Werkstatt landing page root.
   ====================================================================
   AUSTAUSCHBARE INHALTE — hier alles Eventspezifische anpassen:
   ==================================================================== */
const CONTENT = {
  brand: "team::mt",
  claimLead: "Beyond Marketing.",
  claimAccent: "",
  claimSub: "Wir machen Marketing-Abteilungen KI-fähig – von Sichtbarkeit bis Automatisierung. 33 Jahre B2B-Erfahrung, neu gedacht mit KI und 360-Grad-Blick über alle Kanäle.",
  contactUrl: "https://team-mt.de",
  marquee: ["KI-Sichtbarkeit", "LinkedIn", "SEO", "Content", "Automatisierung", "360°-KI-Marketing"]
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
const h = React.createElement;
const H_PANELS = ["ansatz", "loesung"];
function scrollToId(id) {
  const hi = H_PANELS.indexOf(id);
  if (hi !== -1) {
    // Horizontal panel: derive the absolute scroll position from the pinned
    // ScrollTrigger's range so the page lands exactly on that panel.
    const hs = window.__hscroll;
    if (hs && hs.st) {
      let frac;
      if (hs.units) {
        const U = hs.units;
        // Mitte des Verweil-Fensters dieses Panels (steht dort volle Breite still)
        frac = (hi * (U.dwell + U.slide) + U.dwell / 2) / U.total;
      } else {
        frac = hs.count > 1 ? hi / (hs.count - 1) : 0;
      }
      smoothScrollTo(hs.st.start + frac * (hs.st.end - hs.st.start));
      return;
    }
  }
  const el = document.getElementById(id);
  if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 64);
}

/* Hash-basiertes Routing: #/ansatz und #/leistungen sind eigene Seiten.
   Anker-Sprungmarken nutzen weiterhin preventDefault (keine Hash-Änderung),
   nur echte Seitenwechsel lösen ein Reload aus. */
function getRoute() {
  var m = (location.hash || "").toLowerCase().match(/^#\/(ansatz|leistungen|team)\b/);
  return m ? m[1] : "home";
}

/* ----------------------------- Top bar ----------------------------- */
function TopBar({
  onBook,
  route
}) {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = e => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);
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
  }, h("div", {
    className: "wrap",
    style: { display: "flex", alignItems: "center", justifyContent: "flex-start", height: 64, gap: 20 }
  }, h("a", {
    href: "#/",
    onClick: e => { if (route === "home") { e.preventDefault(); smoothScrollTo(0); } },
    style: { display: "flex", alignItems: "center", gap: 11, marginRight: "auto" }
  }, h("img", {
    src: "assets/logo-wordmark.jpg", alt: "team::mt", style: { height: 21, width: "auto", display: "block", mixBlendMode: "multiply" }
  })), h("nav", {
    className: "topnav",
    style: { display: "flex", alignItems: "center", gap: 34.5, marginRight: 30, fontFamily: "Poppins", fontSize: 14, fontWeight: 500, color: "var(--ink-dim)" }
  }, [["Ansatz", "ansatz"], ["Leistungen", "leistungen"], ["Team", "team"]].map(([label, id]) => { const active = route === id; return h("a", {
    key: id, href: "#/" + id,
    style: { transition: "color .2s", color: active ? "var(--accent)" : "var(--ink-dim)", fontWeight: active ? 600 : 500 },
    onMouseEnter: e => e.currentTarget.style.color = "var(--accent)",
    onMouseLeave: e => e.currentTarget.style.color = active ? "var(--accent)" : "var(--ink-dim)"
  }, label); })), h("button", {
    className: "btn btn-cta topbar-cta",
    style: { padding: "11px 20px", fontSize: 14 },
    onClick: onBook
  }, "Gespräch anfragen"), h("button", {
    className: "navburger",
    "aria-label": menuOpen ? "Menü schließen" : "Menü öffnen",
    "aria-expanded": menuOpen ? "true" : "false",
    onClick: () => setMenuOpen(o => !o),
    style: { display: "none", alignItems: "center", justifyContent: "center", width: 42, height: 42, marginLeft: 4, background: "transparent", border: "1px solid var(--line-strong)", borderRadius: 6, cursor: "pointer", color: "var(--ink)", flex: "none" }
  }, h("span", { "aria-hidden": "true", style: { position: "relative", display: "block", width: 18, height: 12 } },
    ["top", "mid", "bot"].map((k, i) => h("span", { key: k, style: { position: "absolute", left: 0, right: 0, height: 2, borderRadius: 2, background: "currentColor", transition: "transform .28s cubic-bezier(.2,.8,.2,1), opacity .2s", top: i === 0 ? 0 : i === 1 ? 5 : 10, transform: menuOpen ? (i === 0 ? "translateY(5px) rotate(45deg)" : i === 1 ? "scaleX(0)" : "translateY(-5px) rotate(-45deg)") : "none", opacity: menuOpen && i === 1 ? 0 : 1 } }))))),
    h("div", {
      className: "navmenu",
      style: { position: "fixed", inset: 0, zIndex: 95, display: "none", flexDirection: "column", justifyContent: "center", background: "color-mix(in srgb, var(--bg-0) 96%, transparent)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", padding: "96px 32px 44px", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "opacity .35s ease", overflowY: "auto" },
      "aria-hidden": menuOpen ? "false" : "true"
    },
      h("nav", { style: { display: "flex", flexDirection: "column" } },
        [["Ansatz", "ansatz"], ["Leistungen", "leistungen"], ["Team", "team"]].map(([label, id], i) => {
          const active = route === id;
          const dl = menuOpen ? (0.14 + i * 0.08) : 0;
          return h("a", {
            key: id, href: "#/" + id, onClick: () => setMenuOpen(false),
            style: { display: "flex", alignItems: "baseline", gap: 16, fontFamily: "Poppins", fontWeight: 700, fontSize: "clamp(34px,11vw,56px)", letterSpacing: "-.02em", lineHeight: 1.06, color: active ? "var(--accent)" : "var(--ink)", textDecoration: "none", padding: "14px 0", borderBottom: "1px solid var(--line)", opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(30px)", transition: "opacity .5s cubic-bezier(.2,.8,.2,1) " + dl + "s, transform .62s cubic-bezier(.2,.8,.2,1) " + dl + "s" },
            onMouseEnter: e => e.currentTarget.style.color = "var(--accent)",
            onMouseLeave: e => e.currentTarget.style.color = active ? "var(--accent)" : "var(--ink)"
          },
            h("span", { "aria-hidden": "true", style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontWeight: 500, fontSize: "clamp(13px,3.4vw,17px)", color: "var(--accent)", flex: "none" } }, "0" + (i + 1)),
            h("span", null, label));
        })),
      (function () {
        const dl = menuOpen ? (0.14 + 3 * 0.08) : 0;
        const ent = { opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(30px)", transition: "opacity .5s ease " + dl + "s, transform .62s cubic-bezier(.2,.8,.2,1) " + dl + "s" };
        return h("div", { style: { marginTop: 38, ...ent } },
          h("button", { className: "btn btn-cta", style: { width: "100%" }, onClick: () => { setMenuOpen(false); onBook(); } }, "Gespräch anfragen ", h(Icon, { name: "arrow", size: 16 })),
          h("div", { style: { display: "flex", gap: 14, flexWrap: "wrap", marginTop: 22, color: "var(--muted)", fontFamily: "Poppins", fontSize: 13.5 } },
            h("span", null, "Rosenheim & Köln"),
            h("span", { "aria-hidden": "true", style: { color: "var(--accent)" } }, "·"),
            h("a", { href: "https://www.team-mt.de", target: "_blank", rel: "noopener noreferrer", style: { color: "var(--muted)", textDecoration: "none" } }, "team-mt.de")));
      })()));
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
  // hero video: dreht genau einmal — Start direkt mit dem Scan (beim Mount), danach Standbild
  useEffect(() => {
    const v = glassRef.current; if (!v) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let played = false;
    const playOnce = () => { if (played) return; played = true; try { v.currentTime = 0; const p = v.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} };
    const id = requestAnimationFrame(playOnce);
    return () => cancelAnimationFrame(id);
  }, []);
  // Mobil: 3D-Objekt exakt auf die vertikale Mitte der Headline ausrichten (robust gegen Intro/Layout)
  useEffect(() => {
    const sec = heroRef.current; if (!sec) return;
    const align = () => {
      const glass = sec.querySelector(".hero-glass");
      if (!glass) return;
      const mobile = window.matchMedia("(max-width:860px)").matches;
      const head = sec.querySelector("h1") || sec.querySelector(".tw-line") || sec.querySelector("p");
      if (!mobile || !head) { glass.style.removeProperty("top"); return; }
      const sr = sec.getBoundingClientRect(), hr = head.getBoundingClientRect();
      const center = (hr.top + hr.height / 2) - sr.top;
      glass.style.setProperty("top", center + "px", "important");
    };
    align();
    const id = setInterval(align, 200);
    const stop = setTimeout(() => clearInterval(id), 2200);
    window.addEventListener("resize", align);
    return () => { clearInterval(id); clearTimeout(stop); window.removeEventListener("resize", align); };
  }, []);
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
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    className: "hero-glass"
  }, /*#__PURE__*/React.createElement("div", {
    style: { position: "absolute", inset: "-12%", borderRadius: "50%", zIndex: 0, background: "radial-gradient(circle, color-mix(in srgb,var(--accent) 30%, transparent), transparent 62%)", filter: "blur(40px)", pointerEvents: "none" }
  }), /*#__PURE__*/React.createElement("video", {
    ref: glassRef, src: "assets/glass-logo.mp4", muted: true, playsInline: true, preload: "metadata",
    style: { position: "relative", zIndex: 1, width: "100%", display: "block", transition: "transform .25s ease-out", filter: "brightness(1.14) contrast(1.05) saturate(1.14) drop-shadow(0 28px 56px color-mix(in srgb,var(--accent) 32%, transparent))", WebkitMaskImage: "radial-gradient(ellipse 58% 60% at 50% 50%, #000 45%, rgba(0,0,0,0) 82%)", maskImage: "radial-gradient(ellipse 58% 60% at 50% 50%, #000 45%, rgba(0,0,0,0) 82%)" }
  })), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true", style: { position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "radial-gradient(130% 110% at 62% 42%, transparent 55%, rgba(14,27,46,.13) 100%)" }
  }), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true", style: { position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", opacity: 0.07, mixBlendMode: "multiply", backgroundImage: "var(--stamp-grunge)", backgroundSize: "170px 96px" }
  }), /*#__PURE__*/React.createElement("div", {
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
  }, "KI Marketing Agentur · B2B"), intro.active ? /*#__PURE__*/React.createElement(Typewriter, {
    lead: CONTENT.claimLead,
    accent: CONTENT.claimAccent,
    speed: T.typeSpeedMs,
    play: typing,
    done: textDone,
    onDone: intro.skip
  }) : /*#__PURE__*/React.createElement("h1", {
    "aria-label": CONTENT.claimLead + (CONTENT.claimAccent ? " " + CONTENT.claimAccent : ""),
    style: {
      fontSize: "clamp(40px,7vw,88px)",
      lineHeight: 0.98,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: { color: "#db0830" }
  }, "Beyond "), /*#__PURE__*/React.createElement("span", {
    style: { color: "#0e1b2e" }
  }, "Marketing."), CONTENT.claimAccent ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)",
      textShadow: "0 0 calc(50px*var(--glow)) color-mix(in srgb,var(--accent) 55%, transparent)"
    }
  }, CONTENT.claimAccent)) : null), /*#__PURE__*/React.createElement("p", {
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
  }, "Gespräch anfragen ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost hero-secondary",
    onClick: () => scrollToId("ansatz")
  }, "Unser Ansatz")), /*#__PURE__*/React.createElement("div", {
    style: Object.assign({
      display: "flex",
      gap: 26,
      flexWrap: "wrap",
      marginTop: 42,
      color: "var(--ink-dim)"
    }, fade(textDone, 240))
  }, /*#__PURE__*/React.createElement(Meta, {
    icon: "target",
    label: "360°-KI-Marketing"
  }), /*#__PURE__*/React.createElement(Meta, {
    icon: "pin",
    label: "Rosenheim & Köln"
  }), /*#__PURE__*/React.createElement(Meta, {
    icon: "spark",
    label: "33 Jahre B2B-Erfahrung"
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

function HeroBootReveal() {
  const reduce = useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const [gone, setGone] = useState(reduce);
  const rootRef = useRef(null), coverRef = useRef(null), beamWrapRef = useRef(null), beamRef = useRef(null), readRef = useRef(null);
  const finishedRef = useRef(false);
  useEffect(function () {
    if (reduce) return;
    const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/<>*+-";
    const BEAM_MS = 5500, HOLD = 520, EXIT = 560, SCRAMBLE = 460, STAGGER = 32;
    let raf = 0, start = performance.now(), cancelled = false, exitT = 0, chars = null, headCrossT = 0, headOrig = null;
    const ease = function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; };
    const splitHead = function () {
      const h1 = document.querySelector("#top h1");
      if (!h1 || h1.dataset.kiwSplit) return;
      try {
        headOrig = h1.innerHTML;
        const words = [];
        [].slice.call(h1.children).forEach(function (cs) {
          if (cs.tagName !== "SPAN") return;
          const color = cs.style.color || "";
          cs.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part || /^\s+$/.test(part)) return;
            words.push({ text: part, color: color });
          });
        });
        if (!words.length) return;
        h1.textContent = "";
        const allChars = [], wordEls = [];
        words.forEach(function (w, wi) {
          if (wi > 0) h1.appendChild(document.createTextNode(" "));
          const we = document.createElement("span");
          we.style.color = w.color; we.style.whiteSpace = "pre";
          for (const c of w.text) { const s = document.createElement("span"); s.dataset.ch = c; s.textContent = c; we.appendChild(s); allChars.push(s); }
          h1.appendChild(we); wordEls.push(we);
        });
        wordEls.forEach(function (we) { const w = we.getBoundingClientRect().width; we.style.display = "inline-block"; we.style.width = w.toFixed(2) + "px"; we.style.verticalAlign = "top"; });
        h1.dataset.kiwSplit = "1";
        chars = allChars;
      } catch (e) { chars = null; }
    };
    const frame = function (now) {
      if (cancelled) return;
      const t = now - start;
      const bp = Math.min(1, t / BEAM_MS);
      const by = ease(bp) * 106;
      const byPx = by / 100 * window.innerHeight;
      const ins = "inset(" + by.toFixed(2) + "% 0 0 0)";
      if (coverRef.current) { coverRef.current.style.clipPath = ins; coverRef.current.style.webkitClipPath = ins; }
      if (beamWrapRef.current) beamWrapRef.current.style.top = by.toFixed(2) + "%";
      if (beamRef.current) beamRef.current.style.opacity = (bp < 0.997 ? 1 : 0).toString();
      if (readRef.current) readRef.current.textContent = Math.min(100, Math.round(bp * 100)) + "%";
      if (!chars) splitHead();
      if (chars && chars.length) {
        const h1 = document.querySelector("#top h1");
        const top = h1 ? h1.getBoundingClientRect().top : 1e9;
        if (!headCrossT && byPx >= top) headCrossT = now;
        for (let i = 0; i < chars.length; i++) {
          const sp = chars[i], real = sp.dataset.ch;
          if (real === " ") { sp.textContent = " "; continue; }
          if (!headCrossT) { sp.textContent = real; sp.style.textShadow = "none"; sp.style.filter = "none"; continue; }
          const lt = now - headCrossT - i * STAGGER;
          if (lt < 0) { sp.textContent = GLYPHS[(Math.floor(now / 40) + i) % GLYPHS.length]; sp.style.textShadow = "0 0 6px color-mix(in srgb,var(--accent) 55%, transparent)"; sp.style.filter = "blur(1px)"; }
          else if (lt < SCRAMBLE) {
            sp.textContent = GLYPHS[(Math.floor(now / 26) + i * 3) % GLYPHS.length];
            const k = lt / SCRAMBLE;
            sp.style.textShadow = (4 * (1 - k)).toFixed(1) + "px 0 rgba(255,40,90," + (0.7 * (1 - k)).toFixed(2) + "), " + (-4 * (1 - k)).toFixed(1) + "px 0 rgba(0,200,255," + (0.6 * (1 - k)).toFixed(2) + ")";
            sp.style.filter = "blur(" + ((1 - k) * 1.3).toFixed(2) + "px)";
          } else { sp.textContent = real; sp.style.textShadow = "none"; sp.style.filter = "none"; }
        }
      }
      if (t >= BEAM_MS + HOLD && !finishedRef.current) { finishedRef.current = true; exitT = now; }
      if (finishedRef.current) {
        const ep = Math.min(1, (now - exitT) / EXIT);
        if (rootRef.current) rootRef.current.style.opacity = (1 - ep).toFixed(3);
        if (ep >= 1) { cancelled = true; try { window.dispatchEvent(new Event("kiw:introdone")); } catch (e) {} setGone(true); return; }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const skip = function () { if (!finishedRef.current) { finishedRef.current = true; exitT = performance.now(); } };
    const armed = setTimeout(function () { window.addEventListener("pointerdown", skip); window.addEventListener("keydown", skip); window.addEventListener("wheel", skip, { passive: true }); }, 520);
    return function () {
      cancelled = true; cancelAnimationFrame(raf); clearTimeout(armed);
      window.removeEventListener("pointerdown", skip); window.removeEventListener("keydown", skip); window.removeEventListener("wheel", skip);
      var h1r = document.querySelector("#top h1"); if (h1r && headOrig != null) { h1r.innerHTML = headOrig; delete h1r.dataset.kiwSplit; }
    };
  }, [reduce]);
  if (gone) return null;
  const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  return h("div", { ref: rootRef, "aria-hidden": "true", style: { position: "fixed", inset: 0, zIndex: 9600, pointerEvents: "none", willChange: "opacity" } },
    h("div", { ref: coverRef, style: { position: "absolute", inset: 0, background: "#f4f7fb", clipPath: "inset(0% 0 0 0)", WebkitClipPath: "inset(0% 0 0 0)" } },
      h("div", { style: { position: "absolute", inset: 0, opacity: .5, backgroundImage: "linear-gradient(rgba(18,38,66,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(18,38,66,.06) 1px,transparent 1px)", backgroundSize: "34px 34px" } })),
    h("div", { ref: beamWrapRef, style: { position: "absolute", left: 0, right: 0, top: "0%", height: 0, zIndex: 4 } },
      h("div", { style: { position: "absolute", left: 0, right: 0, top: 0, height: 140, background: "linear-gradient(180deg, color-mix(in srgb,var(--accent) 11%, transparent), transparent)", pointerEvents: "none" } }),
      h("div", { ref: beamRef, style: { position: "absolute", left: 0, right: 0, top: 0, height: 2, opacity: 0, background: "linear-gradient(90deg, transparent, var(--accent) 12%, var(--accent) 88%, transparent)", boxShadow: "0 0 22px 4px color-mix(in srgb,var(--accent) 75%, transparent)" } }),
      h("div", { style: { position: "absolute", left: "clamp(18px,5vw,60px)", right: "clamp(18px,5vw,60px)", top: 16, display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--muted)" } },
        h("span", { style: { width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 9px var(--accent)" } }),
        h("span", { style: { color: "var(--accent)", fontWeight: 600 } }, "team::mt"),
        h("span", null, "System initialisieren"),
        h("span", { ref: readRef, style: { marginLeft: "auto", fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "var(--ink-dim)" } }, "0%"))),
    h("div", { style: { position: "absolute", top: 14, left: 14, width: 18, height: 18, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)", opacity: .55, zIndex: 5 } }),
    h("div", { style: { position: "absolute", top: 14, right: 14, width: 18, height: 18, borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)", opacity: .55, zIndex: 5 } }),
    h("div", { style: { position: "absolute", bottom: 14, left: 14, width: 18, height: 18, borderBottom: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)", opacity: .55, zIndex: 5 } }),
    h("div", { style: { position: "absolute", bottom: 14, right: 14, width: 18, height: 18, borderBottom: "2px solid var(--accent)", borderRight: "2px solid var(--accent)", opacity: .55, zIndex: 5 } }));
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
    className: "lead",
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
    className: "lead",
    style: {
      color: "var(--ink-dim)",
      fontSize: 17,
      lineHeight: 1.62,
      marginBottom: 18,
      maxWidth: 620
    }
  }, "Wir sind eine Marketing-Agentur aus Rosenheim & K\u00f6ln, die Marketing-Abteilungen KI-f\xE4hig macht \u2014 von Sichtbarkeit bis Automatisierung. Die KI-Werkstatt ist unser Stand, an dem wir genau das live zeigen."), /*#__PURE__*/React.createElement("div", {
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
    className: "lead",
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
  children,
  hid = "hwrap",
  gkey = "__hscroll"
}) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const stageRef = useRef(null);
  const beamRef = useRef(null);
  const stepRef = useRef(null);
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
    const vw = () => window.innerWidth || 1;
    const panelX = i => -i * vw();
    // Verweil-/Gleit-Choreografie: jedes Panel steht erst volle Breite still (dwell),
    // dann gleitet der Track zum nächsten (slide). So ist jeder Abschnitt einmal
    // komplett über die volle Breite sichtbar, bevor der Übergang beginnt.
    const DWELL = 1.0,
      SLIDE = 1.15;
    const total = count * DWELL + Math.max(0, count - 1) * SLIDE;
    const pinLen = () => total * (window.innerHeight || 1);
    const paint = p => {
      if (fillRef.current) fillRef.current.style.width = (p * 100).toFixed(2) + "%";
      const curX = gsap.getProperty(track, "x") || 0;
      const center = -curX / vw();
      const active = Math.min(count - 1, Math.max(0, Math.round(center)));
      labelRefs.current.forEach((el, i) => {
        if (el) el.style.color = i === active ? "var(--accent)" : "var(--muted)";
      });
      if (stepRef.current) stepRef.current.textContent = ("0" + (active + 1)).slice(-2) + " / " + ("0" + count).slice(-2);
      const kids = track.children;
      for (let i = 0; i < kids.length; i++) {
        const d = Math.min(1, Math.abs(i - center));
        const el = kids[i];
        el.style.transformOrigin = "50% 50%";
        el.style.transform = "scale(" + (1 - d * 0.08).toFixed(4) + ")";
        el.style.opacity = (1 - d * 0.42).toFixed(3);
        el.style.filter = d > 0.02 ? "brightness(" + (1 - d * 0.24).toFixed(3) + ")" : "none";
      }
      try { window.dispatchEvent(new CustomEvent("hscroll:progress", { detail: { gkey, center, count } })); } catch (e) {}
    };
    gsap.set(track, { x: 0 });
    const tween = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: () => "+=" + pinLen(),
        pin: true,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => paint(self.progress),
        onRefresh: self => paint(self.progress)
      }
    });
    for (let i = 0; i < count; i++) {
      tween.to(track, { x: () => panelX(i), duration: DWELL, ease: "none" });
      if (i < count - 1) tween.to(track, { x: () => panelX(i + 1), duration: SLIDE, ease: "power2.inOut" });
    }
    window[gkey] = {
      st: tween.scrollTrigger,
      count,
      units: { dwell: DWELL, slide: SLIDE, total }
    };
    paint(0);

    // Entry-Effekt: Stage steigt auf + roter Scan-Beam beim Reinscrollen (Approach-ScrollTrigger)
    const setEnter = e => {
      const raw = Math.min(1, Math.max(0, e));
      // Reveal vom Pin entkoppelt: fertig bei ~70% des Anflugs, ease-out cubic
      const t = Math.min(1, raw / 0.7);
      const v = 1 - Math.pow(1 - t, 3);
      if (stageRef.current) {
        stageRef.current.style.opacity = (0.2 + 0.8 * v).toFixed(3);
        stageRef.current.style.transform = "translateY(" + ((1 - v) * 38).toFixed(1) + "px) scale(" + (0.965 + v * 0.035).toFixed(4) + ")";
        stageRef.current.style.clipPath = v >= 0.999 ? "none" : "inset(0 0 " + (100 - v * 100).toFixed(2) + "% 0)";
      }
      if (beamRef.current) {
        beamRef.current.style.opacity = (Math.sin(Math.PI * t) * 0.9).toFixed(3);
        beamRef.current.style.top = (v * 100).toFixed(1) + "%";
      }
    };
    const enterST = ScrollTrigger.create({
      trigger: wrap,
      start: "top bottom",
      end: "top top",
      scrub: true,
      onUpdate: self => setEnter(self.progress),
      onRefresh: self => setEnter(self.progress)
    });
    setEnter(0);

    // Pin distance depends on final layout — recompute after fonts / images / boot settle.
    const refresh = () => ScrollTrigger.refresh();
    const t1 = setTimeout(refresh, 450);
    window.addEventListener("load", refresh);
    return () => {
      clearTimeout(t1);
      window.removeEventListener("load", refresh);
      if (enterST) enterST.kill();
      if (window[gkey] && tween.scrollTrigger && window[gkey].st === tween.scrollTrigger) window[gkey] = null;
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      track.style.transform = "";
      ScrollTrigger.refresh();
    };
  }, [enabled, count]);
  if (!enabled) {
    return /*#__PURE__*/React.createElement("div", {
      id: hid,
      ref: wrapRef,
      "data-enabled": "0"
    }, children);
  }
  return /*#__PURE__*/React.createElement("section", {
    id: hid,
    ref: wrapRef,
    "data-enabled": "1",
    style: {
      height: "100vh",
      overflow: "hidden",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: stageRef,
    style: {
      position: "relative",
      height: "100%",
      width: "100%",
      opacity: 1,
      willChange: "transform, opacity",
      transformOrigin: "50% 42%"
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
  }, ch)))), /*#__PURE__*/React.createElement("div", {
    ref: beamRef,
    "aria-hidden": "true",
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 3,
      transform: "translateY(-50%)",
      zIndex: 6,
      pointerEvents: "none",
      opacity: 0,
      background: "linear-gradient(90deg, transparent, var(--accent) 18%, var(--accent) 82%, transparent)",
      boxShadow: "0 0 22px 4px color-mix(in srgb,var(--accent) 55%, transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 22,
      left: 0,
      right: 0,
      zIndex: 5,
      display: count > 1 ? "flex" : "none",
      flexDirection: "column",
      alignItems: "center",
      gap: 11,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    ref: stepRef,
    style: {
      fontFamily: "ui-monospace, Menlo, monospace",
      fontSize: 11,
      letterSpacing: ".2em",
      color: "var(--accent)"
    }
  }, "01 / " + ("0" + count).slice(-2)), /*#__PURE__*/React.createElement("div", {
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
    className: "lead",
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
    className: "lead",
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

/* =================================================================
   team::mt Sektionen (neuer Aufbau) — h = React.createElement
   ================================================================= */
function UeberleitBand() {
  return h("section", { style: { position: "relative", padding: "clamp(58px,9vw,108px) 0" } },
    h(Reveal, { className: "wrap", style: { textAlign: "center", maxWidth: 920, marginLeft: "auto", marginRight: "auto" } },
      h("h2", { style: { fontSize: "clamp(26px,4vw,46px)", textWrap: "balance", lineHeight: 1.1 } },
        "Marketing verändert sich schneller als je zuvor.", h("br"), h("span", { style: { color: "var(--accent)" } }, "Wir sorgen dafür, dass Sie vorne bleiben."))));
}

function WarumJetztPanel() {
  const rootRef = useRef(null), bgRef = useRef(null), wipeRef = useRef(null), headRef = useRef(null), ebRef = useRef(null);
  const chipRefs = useRef([]);
  const chips = ["mehr Kanäle", "mehr Content", "mehr Geschwindigkeit", "mehr Messbarkeit"];
  useEffect(() => {
    const root = rootRef.current; if (!root) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = chipRefs.current.filter(Boolean);
    const meta = els.map((el, i) => { const cx = i - (els.length - 1) / 2; return { conv: -cx * 130, rot: cx * 6, seed: i * 1.7 }; });
    const apply = (c, s, t) => {
      const cc = Math.min(1, c / 0.55);
      const inv = 1 - cc;
      els.forEach((el, i) => {
        const m = meta[i];
        const jx = reduce ? 0 : inv * 11 * Math.sin(t / 180 + m.seed);
        const jy = reduce ? 0 : inv * 7 * Math.cos(t / 150 + m.seed * 1.3);
        const rot = m.rot * inv + (reduce ? 0 : inv * 2.4 * Math.sin(t / 210 + m.seed));
        el.style.transform = "translate(" + (m.conv * inv + jx).toFixed(2) + "px," + (jy - inv * 4).toFixed(2) + "px) rotate(" + rot.toFixed(2) + "deg)";
        el.style.filter = "blur(" + (inv * 7).toFixed(2) + "px)";
        el.style.opacity = (0.32 + 0.68 * cc).toFixed(3);
      });
      if (bgRef.current) { bgRef.current.style.opacity = (inv * 0.85).toFixed(3); bgRef.current.style.transform = "scale(" + (1 + inv * 0.08).toFixed(3) + ")"; }
      if (wipeRef.current) { const w = Math.min(1, Math.max(0, s)); wipeRef.current.style.opacity = Math.sin(Math.PI * w).toFixed(3); wipeRef.current.style.transform = "translateX(" + (-40 + w * 210).toFixed(1) + "%)"; }
      if (headRef.current) { const hp = Math.min(1, Math.max(0, (c - 0.70) / 0.30)); headRef.current.style.opacity = hp.toFixed(3); headRef.current.style.transform = "translateY(" + ((1 - hp) * 18).toFixed(1) + "px)"; }
      if (ebRef.current) ebRef.current.style.opacity = (0.5 + 0.5 * c).toFixed(3);
    };
    const enabled = () => { const w = root.closest("#hwrap"); return !!(w && w.dataset.enabled === "1"); };
    let raf = 0;
    const loop = (t) => {
      const hs = window.__hscroll;
      if (reduce || !enabled()) apply(1, 1, t);
      else if (hs && hs.st && hs.units) {
        const p = hs.st.progress || 0;
        const U = hs.units;
        const p0End = U.dwell / U.total;          // Ende des Verweil-Fensters von Panel 1
        const cFull = U.dwell * 0.6 / U.total;    // Klarheit fertig nach 60% des Verweilens
        const c = Math.min(1, Math.max(0, p / cFull));
        const w = Math.min(1, Math.max(0, (p - p0End) / (U.slide / U.total))); // Wisch während des Gleitens
        apply(c, w, t);
      } else apply(0, 0, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return h("section", { id: "ansatz", ref: rootRef, className: "grid-bg", style: { position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden" } },
    h("div", { ref: wipeRef, "aria-hidden": "true", style: { position: "absolute", top: 0, bottom: 0, left: 0, width: "46%", zIndex: 3, pointerEvents: "none", opacity: 0, background: "linear-gradient(90deg, transparent 0%, color-mix(in srgb,var(--accent) 16%, transparent) 45%, color-mix(in srgb,var(--accent) 55%, transparent) 74%, var(--accent) 90%, transparent 100%)", boxShadow: "0 0 70px color-mix(in srgb,var(--accent) 40%, transparent)" } }),
    h("div", { className: "wrap", style: { position: "relative", zIndex: 2, paddingTop: 96, paddingBottom: 80, textAlign: "center", maxWidth: 1000, marginLeft: "auto", marginRight: "auto", width: "100%" } },
      h("div", { ref: ebRef, style: { display: "flex", justifyContent: "center" } }, h(Eyebrow, { num: "// 01" }, "Warum jetzt")),
      h("div", { style: { position: "relative", display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 46, marginTop: 6 } },
        chips.map((c, i) => h("span", { key: c, ref: el => chipRefs.current[i] = el, style: { position: "relative", display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 999, fontFamily: "Poppins", fontWeight: 500, fontSize: "clamp(14px,1.5vw,16px)", color: "var(--ink)", background: "var(--glass)", boxShadow: "inset 0 0 0 1px var(--glass-line)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", willChange: "transform, filter, opacity" } },
          h("span", { style: { width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" } }), c,
          i === 2 && h("img", { src: "assets/hero-glass.png", alt: "", "aria-hidden": "true", style: { position: "absolute", right: -62, top: "50%", width: 104, transform: "translateY(-50%) rotate(-9deg)", filter: "drop-shadow(0 16px 26px rgba(219,10,48,.30))", pointerEvents: "none" } })))),
      h("div", { ref: headRef, style: { opacity: 0 } },
        h("h2", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontWeight: 500, fontSize: "clamp(28px,4.4vw,54px)", textWrap: "balance", lineHeight: 1.12, maxWidth: 920, margin: "0 auto" } }, "Marketing wird gerade neu definiert. ", h("span", { style: { color: "var(--accent)", fontStyle: "normal" } }, "Mit oder ohne Sie.")),
        h("p", { className: "lead", style: { maxWidth: 640, margin: "18px auto 0" } }, "Marketing-Abteilungen sollen mehr leisten, schneller liefern und gleichzeitig effizienter werden — mit denselben Teams. KI ist die einzige Antwort, die diese Gleichung auflöst. Sie trennt gerade zwei Lager: die, die ihre Schlagkraft vervielfachen, und die, die zusehen."))));
}

function Kompass360Title() {
  const rootRef = useRef(null), bigRef = useRef(null), headRef = useRef(null), subRef = useRef(null), ebRef = useRef(null), hintRef = useRef(null);
  useEffect(() => {
    const cinematic = window.matchMedia("(min-width:901px)").matches && !window.matchMedia("(pointer:coarse)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !!(window.gsap && window.ScrollTrigger);
    if (!cinematic) return;
    const root = rootRef.current, big = bigRef.current, head = headRef.current, sub = subRef.current, eb = ebRef.current, hint = hintRef.current;
    const apply = (e) => {
      const ease = e * e * (3 - 2 * e);
      if (root) root.style.opacity = e.toFixed(3);
      if (big) {
        big.style.opacity = ease.toFixed(3);
        big.style.transform = "scale(" + (0.6 + 0.4 * ease).toFixed(4) + ")";
        big.style.filter = "blur(" + ((1 - ease) * 14).toFixed(2) + "px) drop-shadow(0 0 " + (16 + ease * 34).toFixed(0) + "px color-mix(in srgb,var(--accent) 44%, transparent))";
      }
      const he = Math.max(0, Math.min(1, (e - 0.3) / 0.7));
      if (head) { head.style.opacity = he.toFixed(3); head.style.transform = "translateY(" + ((1 - he) * 28).toFixed(1) + "px)"; }
      const se = Math.max(0, Math.min(1, (e - 0.5) / 0.5));
      if (sub) { sub.style.opacity = se.toFixed(3); sub.style.transform = "translateY(" + ((1 - se) * 20).toFixed(1) + "px)"; }
      if (eb) eb.style.opacity = e.toFixed(3);
      if (hint) hint.style.opacity = e.toFixed(3);
    };
    const compute = () => { if (!root) return 0; const r = root.getBoundingClientRect(); const vh = window.innerHeight; const cc = r.top + r.height / 2; return Math.max(0, Math.min(1, 1 - Math.abs(cc - vh / 2) / (vh * 0.6))); };
    const draw = () => apply(compute());
    draw();
    const onScroll = () => draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (window.__lenis && window.__lenis.on) window.__lenis.on("scroll", onScroll);
    window.addEventListener("resize", draw);
    return () => { window.removeEventListener("scroll", onScroll); if (window.__lenis && window.__lenis.off) window.__lenis.off("scroll", onScroll); window.removeEventListener("resize", draw); };
  }, []);
  return h("section", { ref: rootRef, className: "grid-bg", style: { position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderTop: "1px solid var(--line)" } },
    h("div", { className: "wrap", style: { textAlign: "center", maxWidth: 1120, marginLeft: "auto", marginRight: "auto", width: "100%" } },
      h("div", { ref: ebRef, style: { display: "flex", justifyContent: "center", marginBottom: 14 } }, h(Eyebrow, { num: "// 03" }, "Unsere L\u00f6sung")),
      h("div", { ref: bigRef, className: "display", style: { fontSize: "clamp(110px,25vw,400px)", lineHeight: 0.9, letterSpacing: "-.045em", color: "var(--accent)", willChange: "transform, opacity, filter" } }, "360\u00b0"),
      h("h2", { ref: headRef, style: { fontSize: "clamp(28px,4.4vw,60px)", textWrap: "balance", lineHeight: 1.04, marginTop: 6, willChange: "opacity, filter, transform" } }, "Wir nennen es ", h("span", { style: { color: "var(--accent)" } }, "Beyond Marketing.")),
      h("div", { ref: hintRef, style: { marginTop: 16, color: "var(--muted)", fontFamily: "Poppins", fontSize: 13, letterSpacing: ".22em", textTransform: "uppercase" } }, "360\u00b0 \u00b7 im KI-Marketing-Labor")));
}
function KompassPanel() {
  const channels = [["target", "Website", "Mehr Sichtbarkeit & Conversion"], ["linkedin", "LinkedIn", "Stärkere Positionierung"], ["scan", "SEO", "Mehr organische Reichweite"], ["share", "Content", "Schnellere Produktion"], ["chart", "Monitoring", "Datenbasierte Entscheidungen"], ["bolt", "Automatisierung", "Weniger manuelle Schleifen"]];
  const N = channels.length;
  const ANG = channels.map((_, i) => 12 + i * (360 / N));
  const RR = 40;
  const pos = i => { const a = ANG[i] * Math.PI / 180; return { left: 50 + RR * Math.sin(a), top: 50 - RR * Math.cos(a) }; };
  const secRef = useRef(null), coneRef = useRef(null), coreRef = useRef(null), coreLblRef = useRef(null), pulseRef = useRef(null), pulse2Ref = useRef(null), stageColRef = useRef(null);
  const nodeRefs = useRef([]);
  useEffect(() => {
    const sec = secRef.current; if (!sec) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia && window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
    const activate = (i, instant) => {
      const el = nodeRefs.current[i]; if (!el || el.dataset.on === "1") return;
      el.dataset.on = "1";
      if (instant) el.style.transition = "none";
      el.style.opacity = "1"; el.style.filter = "blur(0px)";
      const disc = el.querySelector("[data-disc]");
      if (disc) { disc.style.boxShadow = "inset 0 0 0 1.5px var(--accent), 0 0 26px color-mix(in srgb,var(--accent) 38%, transparent)"; disc.style.color = "var(--accent)"; disc.style.background = "color-mix(in srgb,var(--accent) 12%, var(--glass))"; }
      const ben = el.querySelector("[data-ben]");
      if (ben) { ben.style.opacity = "1"; ben.style.transform = "translateY(0)"; }
      const blip = el.querySelector("[data-blip]");
      if (blip && !instant) { blip.style.animation = "none"; void blip.offsetWidth; blip.style.animation = "kompass-blip 720ms ease-out forwards"; }
      if (!instant) { el.style.transform = el.dataset.base + " scale(1.16)"; setTimeout(() => { if (el.dataset.on === "1") el.style.transform = el.dataset.base + " scale(1)"; }, 360); }
    };
    const complete = (instant) => {
      if (coreRef.current) { coreRef.current.dataset.on = "1"; if (!instant && !reduce) coreRef.current.classList.add("kompass-core-on"); else coreRef.current.style.boxShadow = "inset 0 0 0 1px var(--accent), 0 0 56px color-mix(in srgb,var(--accent) 44%, transparent)"; }
      if (coreLblRef.current) coreLblRef.current.innerHTML = '<span style="color:var(--accent)">360°</span> aktiv';
      if (pulseRef.current && !instant) { pulseRef.current.style.animation = "none"; void pulseRef.current.offsetWidth; pulseRef.current.style.animation = "kompass-pulse 1000ms ease-out forwards"; }
      if (pulse2Ref.current && !instant) { pulse2Ref.current.style.animation = "none"; void pulse2Ref.current.offsetWidth; pulse2Ref.current.style.animation = "kompass-pulse 1200ms ease-out 160ms forwards"; }
    };
    if (reduce || mobile) {
      for (let i = 0; i < N; i++) activate(i, true);
      complete(true);
      if (coneRef.current) coneRef.current.style.display = "none";
      return;
    }
    const SPEED = 360 / 4500;
    let raf = 0, startT = 0, done = false, running = false;
    const inView = () => {
      const r = sec.getBoundingClientRect();
      const vw = window.innerWidth || 1, vh = window.innerHeight || 1;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      return cx > vw * 0.2 && cx < vw * 0.8 && cy > 0 && cy < vh;
    };
    const frame = now => {
      if (!running && inView()) { running = true; startT = now; }
      if (running) {
        const ang = (now - startT) * SPEED;
        if (coneRef.current) coneRef.current.style.transform = "translate(-50%,-50%) rotate(" + ang.toFixed(2) + "deg)";
        for (let i = 0; i < N; i++) if (ang >= ANG[i]) activate(i, false);
        if (!done && ang >= 372) { done = true; complete(false); }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);
  useEffect(() => {
    const cinematic = window.matchMedia("(min-width:901px)").matches && !window.matchMedia("(pointer:coarse)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !!(window.gsap && window.ScrollTrigger);
    const stage = stageColRef.current;
    if (!cinematic || !stage) return;
    const apply = (center) => {
      const fromDepth = Math.max(0, Math.min(1, 2 - center));
      stage.style.transform = "perspective(1200px) translateZ(" + (-fromDepth * 360).toFixed(0) + "px) scale(" + (1 - fromDepth * 0.06).toFixed(4) + ")";
      stage.style.filter = "blur(" + (fromDepth * 5).toFixed(2) + "px)";
      stage.style.opacity = (1 - fromDepth * 0.55).toFixed(3);
    };
    apply(2);
    const onProg = (e) => { if (e.detail && e.detail.gkey === "__hscroll") apply(e.detail.center); };
    window.addEventListener("hscroll:progress", onProg);
    return () => window.removeEventListener("hscroll:progress", onProg);
  }, []);
  const matte = { position: "absolute", width: "clamp(122px,18vmin,168px)", textAlign: "center", opacity: 0.4, filter: "blur(2.6px)", transform: "translate(-50%,-50%)", transition: "opacity .55s ease, filter .55s ease, transform .5s cubic-bezier(.34,1.56,.5,1)", willChange: "opacity, filter, transform" };
  const discBase = { position: "relative", width: "clamp(64px,9vmin,84px)", height: "clamp(64px,9vmin,84px)", margin: "0 auto", borderRadius: "50%", display: "grid", placeItems: "center", color: "var(--muted)", background: "var(--glass)", boxShadow: "inset 0 0 0 1px var(--glass-line)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", transition: "box-shadow .55s ease, color .55s ease, background .55s ease" };
  return h("section", { id: "kompass", ref: secRef, className: "grid-bg", style: { position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", borderTop: "1px solid var(--line)", paddingTop: 90, paddingBottom: 70 } },
    h("div", { className: "wrap kompass-grid", style: { display: "flex", flexWrap: "wrap", gap: "clamp(32px,5vw,76px)", alignItems: "center", justifyContent: "center", width: "100%" } },
    h("div", { style: { position: "relative", zIndex: 2, flex: "1 1 380px", maxWidth: 540 } },
      h(Eyebrow, { num: "// 02" }, "Unser Ansatz"),
      h("h2", { style: { fontSize: "clamp(26px,3.6vw,46px)", textWrap: "balance", lineHeight: 1.06, marginTop: 6 } }, h("span", { style: { color: "var(--accent)" } }, "360°"), " im KI-Marketing Labor statt Einzelmaßnahmen"),
      h("p", { className: "lead", style: { fontSize: "clamp(16px,1.7vw,19px)", marginTop: 20 } }, "Wir denken Marketing ganzheitlich: über Website, LinkedIn, SEO, Content, Monitoring und Automatisierung hinweg. So entstehen konsistente Botschaften, klare Prozesse und bessere Ergebnisse über alle Touchpoints hinweg."),
      h("p", { className: "lead", style: { fontSize: "clamp(16px,1.7vw,19px)", marginTop: 16 } }, "In unserem KI-Marketing Labor zeigen wir live, wie KI im Marketing konkret eingesetzt werden kann — von der Idee bis zur Umsetzung. Nicht als Buzzword, sondern als Arbeitsweise, die Zeit spart und Wirkung erhöht.")),
    h("div", { ref: stageColRef, style: { position: "relative", zIndex: 1, width: "clamp(300px,42vw,500px)", height: "clamp(300px,42vw,500px)", flex: "0 0 auto", willChange: "transform, opacity, filter" } },
      h("div", { "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "80%", height: "80%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, color-mix(in srgb,var(--accent) 32%, transparent) 0 1.6deg, transparent 1.6deg 5deg)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0 48.4%, #000 48.8% 50%, transparent 50.4%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 0 48.4%, #000 48.8% 50%, transparent 50.4%)" } }),
      h("div", { className: "kompass-tick-rev", "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "66%", height: "66%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, color-mix(in srgb,var(--accent) 26%, transparent) 0 9deg, transparent 9deg 16deg)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0 48%, #000 48.6% 50%, transparent 50.6%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 0 48%, #000 48.6% 50%, transparent 50.6%)" } }),
      h("div", { "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "52%", height: "52%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, color-mix(in srgb,var(--accent) 24%, transparent) 0 1.2deg, transparent 1.2deg 6deg)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0 47.8%, #000 48.4% 50%, transparent 50.8%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 0 47.8%, #000 48.4% 50%, transparent 50.8%)" } }),
      h("div", { "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "10%", bottom: "10%", width: 1, transform: "translateX(-50%)", background: "linear-gradient(to bottom, transparent, color-mix(in srgb,var(--accent) 14%, transparent) 18% 82%, transparent)" } }),
      h("div", { "aria-hidden": "true", style: { position: "absolute", top: "50%", left: "10%", right: "10%", height: 1, transform: "translateY(-50%)", background: "linear-gradient(to right, transparent, color-mix(in srgb,var(--accent) 14%, transparent) 18% 82%, transparent)" } }),
      h("div", { className: "kompass-tick", "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "86%", height: "86%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, color-mix(in srgb,var(--accent) 30%, transparent) 0deg 0.7deg, transparent 0.7deg 9deg)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0 46%, #000 47% 50%, transparent 51%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 0 46%, #000 47% 50%, transparent 51%)" } }),
      h("div", { className: "kompass-ping", "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "80%", height: "80%", transform: "translate(-50%,-50%) scale(.3)", borderRadius: "50%", boxShadow: "0 0 0 1px color-mix(in srgb,var(--accent) 40%, transparent)", opacity: 0, pointerEvents: "none" } }),
      h("div", { className: "kompass-ping d2", "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "80%", height: "80%", transform: "translate(-50%,-50%) scale(.3)", borderRadius: "50%", boxShadow: "0 0 0 1px color-mix(in srgb,var(--accent) 40%, transparent)", opacity: 0, pointerEvents: "none" } }),
      h("div", { ref: coneRef, "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "80%", height: "80%", transform: "translate(-50%,-50%) rotate(0deg)", transformOrigin: "50% 50%", willChange: "transform" } },
        h("div", { style: { position: "absolute", inset: 0, borderRadius: "50%", filter: "blur(1.5px)", background: "conic-gradient(from 0deg, color-mix(in srgb,var(--accent) 52%, transparent) 0deg, color-mix(in srgb,var(--accent) 0%, transparent) 16deg, transparent 248deg, color-mix(in srgb,var(--accent) 30%, transparent) 360deg)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0 26%, #000 40%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 0 26%, #000 40%)" } }),
        h("div", { style: { position: "absolute", left: "50%", top: 0, width: 2, height: "50%", transform: "translateX(-50%)", transformOrigin: "bottom center", background: "linear-gradient(to top, transparent, var(--accent))", boxShadow: "0 0 12px color-mix(in srgb,var(--accent) 60%, transparent)" } }),
        h("div", { style: { position: "absolute", left: "50%", top: 0, width: 12, height: 12, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 16px 2px color-mix(in srgb,var(--accent) 80%, transparent)" } })),
      h("div", { ref: pulseRef, "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "80%", height: "80%", transform: "translate(-50%,-50%) scale(.62)", borderRadius: "50%", boxShadow: "0 0 0 2px var(--accent)", opacity: 0, pointerEvents: "none" } }),
      h("div", { ref: pulse2Ref, "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "80%", height: "80%", transform: "translate(-50%,-50%) scale(.62)", borderRadius: "50%", boxShadow: "0 0 0 1px color-mix(in srgb,var(--accent) 55%, transparent)", opacity: 0, pointerEvents: "none" } }),
      h("div", { ref: coreRef, style: { position: "absolute", left: "50%", top: "50%", width: "clamp(150px,27vmin,232px)", height: "clamp(150px,27vmin,232px)", transform: "translate(-50%,-50%)", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 4, background: "radial-gradient(circle at 50% 38%, color-mix(in srgb,var(--accent) 14%, var(--glass)), var(--glass))", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 20px 60px rgba(0,0,0,.14)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", zIndex: 4 } },
        h("div", { className: "kompass-corering", "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "118%", height: "118%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb,var(--accent) 55%, transparent) 40deg, transparent 90deg, transparent 360deg)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0 48%, #000 50%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 0 48%, #000 50%)", pointerEvents: "none" } }),
        h("span", { ref: coreLblRef, className: "display", style: { fontSize: "clamp(22px,2.8vw,32px)", letterSpacing: ".005em", lineHeight: 1.05, color: "var(--ink)" } }, h("span", { style: { color: "var(--accent)" } }, "360°"), " Marketing")),
      channels.map(([ic, ch, benefit], i) => h("div", { key: ch, ref: el => nodeRefs.current[i] = el, "data-base": "translate(-50%,-50%)", style: Object.assign({ left: pos(i).left + "%", top: pos(i).top + "%", zIndex: 5 }, matte) },
        h("div", { "data-disc": "true", style: discBase }, h(Icon, { name: ic, size: 26 }), h("div", { "data-blip": "true", "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "100%", height: "100%", transform: "translate(-50%,-50%) scale(.25)", borderRadius: "50%", boxShadow: "0 0 0 2px var(--accent)", opacity: 0, pointerEvents: "none" } })),
        h("div", { style: { fontFamily: "Poppins", fontWeight: 600, fontSize: "clamp(13px,1.5vw,15px)", marginTop: 10 } }, ch),
        h("div", { "data-ben": "true", style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: "clamp(12.5px,1.4vw,14.5px)", color: "var(--ink-dim)", marginTop: 3, lineHeight: 1.25, opacity: 0, transform: "translateY(4px)", transition: "opacity .5s ease .12s, transform .5s ease .12s" } }, benefit))))));
}

function Bruecke360() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("on"); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) el.classList.add("on"); }), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return h("div", { ref: ref, className: "bruecke360", "aria-hidden": "true", style: { position: "relative", height: "clamp(120px,19vh,210px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "var(--bg-0)" } },
    h("span", { className: "display", style: { fontSize: 17, letterSpacing: ".06em", color: "var(--accent)" } }, "360\u00b0"),
    h("div", { className: "bruecke-line", style: { width: 1, height: "clamp(48px,9vh,92px)", background: "linear-gradient(to bottom, transparent, var(--accent))", position: "relative" } },
      h("span", { className: "bruecke-dot", style: { position: "absolute", left: "50%", top: 0, width: 8, height: 8, borderRadius: "50%", transform: "translate(-50%,-50%)", background: "var(--accent)", boxShadow: "0 0 12px 2px color-mix(in srgb,var(--accent) 75%, transparent)" } })));
}
let __bmShown = false;
function BeyondMarketingSection({ onBook }) {
  const secRef = useRef(null);
  const [shown, setShown] = useState(__bmShown);
  useEffect(() => {
    const el = secRef.current; if (!el) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { __bmShown = true; setShown(true); return; }
    let done = false;
    const check = () => { if (done) return; const r = el.getBoundingClientRect(); if (r.top < window.innerHeight * 0.78 && r.bottom > 0) { done = true; __bmShown = true; setShown(true); cleanup(); } };
    const cleanup = () => { window.removeEventListener("scroll", check); if (window.__lenis && window.__lenis.off) window.__lenis.off("scroll", check); };
    window.addEventListener("scroll", check, { passive: true });
    if (window.__lenis && window.__lenis.on) window.__lenis.on("scroll", check);
    check();
    return cleanup;
  }, []);
  const d = (s) => ({ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(20px)", filter: shown ? "none" : "blur(7px)", transition: "opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1), filter .7s ease", transitionDelay: s + "s" });
  return h("section", { id: "beyond", ref: secRef, className: "grid-bg", style: { borderTop: "1px solid var(--line)", minHeight: "100vh", display: "flex", alignItems: "center", padding: "clamp(60px,10vh,120px) 0" } },
    h("div", { className: "wrap", style: { maxWidth: 1180, margin: "0 auto", width: "100%" } },
      h("div", { className: "bm-split" },
        h("div", null,
          h("div", { className: "bm-r", style: { display: "flex", justifyContent: "flex-start", marginBottom: 22, ...d(0) } }, h(Eyebrow, { num: "// 03" }, "Definition")),
          h("div", { className: "bm-r", style: { fontFamily: "Poppins", fontWeight: 700, fontSize: "clamp(16px,1.8vw,22px)", letterSpacing: "-.01em", color: "var(--ink)", marginBottom: 8, ...d(0.12) } }, "Wir nennen es"),
          h("h2", { className: "bm-r", style: { fontFamily: '"EB Garamond", Georgia, serif', fontWeight: 500, fontSize: "clamp(34px,4.4vw,58px)", lineHeight: 1.0, margin: 0, color: "var(--ink)", ...d(0.34) } }, "Beyond Marketing"),
          h("div", { className: "bm-r", style: { display: "flex", alignItems: "center", gap: 14, marginTop: 16, color: "var(--muted)", fontFamily: "Poppins", fontSize: 14, flexWrap: "wrap", ...d(0.56) } },
            h("span", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: 18, color: "var(--ink-dim)" } }, "/bɪˈjɒnd ˈmɑːkɪtɪŋ/"),
            h("span", { style: { width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" } }),
            h("span", null, "Substantiv"),
            h("span", { style: { width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" } }),
            h("span", null, "team::mt")),
          h("p", { className: "bm-r", style: { fontFamily: '"EB Garamond", Georgia, serif', fontSize: "clamp(19px,2vw,27px)", lineHeight: 1.42, color: "var(--ink)", maxWidth: 560, marginTop: 28, marginBottom: 0, ...d(0.72) } },
            h("span", { style: { color: "var(--accent)", fontWeight: 600, fontFamily: "Poppins", fontSize: "0.62em", marginRight: 12, verticalAlign: "2px" } }, "1."),
            "Marketing, das mit KI über alle Kanäle hinweg denkt — 360°, immer aktiv, in Echtzeit messbar."),
          h("p", { className: "bm-r", style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: 16, color: "var(--ink-dim)", maxWidth: 520, marginTop: 16, marginBottom: 0, ...d(0.86) } }, "„Sie machen kein Marketing von gestern mehr — Sie machen Beyond Marketing.“")),
        h("div", { className: "bm-divider bm-r", "aria-hidden": "true", style: { alignSelf: "stretch", width: 1, minHeight: 220, background: "linear-gradient(to bottom, transparent, var(--accent), transparent)", boxShadow: "0 0 12px color-mix(in srgb,var(--accent) 55%, transparent)", ...d(0.6) } }),
        h("div", null,
          h("h3", { className: "bm-r", style: { fontSize: "clamp(30px,4vw,56px)", lineHeight: 1.04, textWrap: "balance", margin: 0, ...d(0.98) } }, "Sind Sie ", h("span", { style: { color: "var(--accent)" } }, "bereit?")),
          h("p", { className: "bm-r", style: { color: "var(--ink-dim)", fontSize: 16, lineHeight: 1.5, maxWidth: 390, marginTop: 18, ...d(1.1) } }, "Ein 10-Minuten-Gespräch genügt, um zu sehen, wo KI in Ihrem Marketing den größten Hebel setzt."),
          h("div", { className: "bm-r", style: { display: "flex", gap: 14, flexWrap: "wrap", marginTop: 32, ...d(1.22) } },
            h("button", { className: "btn btn-cta", onClick: onBook }, "Termin vereinbaren ", h(Icon, { name: "arrow", size: 16 })),
            h("a", { className: "btn btn-ghost", href: "https://team-mt.de", target: "_blank", rel: "noopener noreferrer" }, "team-mt.de"))))));
}
function GlassRing360({ onBook, leistungenHref, forceStatic }) {
  const channels = [["spark", "Von Kampagnen", "zu Always-on-Systemen"], ["scan", "Von Google", "zu KI-Antworten"], ["bolt", "Von Handarbeit", "zu Automatisierung"], ["chart", "Von Bauchgefühl", "zu Echtzeit-Daten"], ["arrow", "Von Wochen", "zu Stunden"], ["target", "Von Masse", "zu Personalisierung"]];
  const N = channels.length;
  const wrapRef = useRef(null), videoRef = useRef(null), introRef = useRef(null), convRef = useRef(null), idxRef = useRef(null), headingRef = useRef(null), sheetRef = useRef(null), scanRef = useRef(null), scanBeamRef = useRef(null), scanFillRef = useRef(null), scanReadRef = useRef(null);
  const labelRefs = useRef([]), lineRefs = useRef([]), dotRefs = useRef([]);
  const [fallback, setFallback] = useState(!!forceStatic);
  const goIndex = () => { const wrap = wrapRef.current; if (!wrap) return; const top = wrap.getBoundingClientRect().top + window.scrollY; const travel = wrap.offsetHeight - window.innerHeight; const target = top + 0.97 * travel; if (window.__lenis && window.__lenis.scrollTo) window.__lenis.scrollTo(target, { duration: 1.4 }); else window.scrollTo({ top: target, behavior: "smooth" }); };
  useEffect(() => {
    const cinematic = window.matchMedia("(min-width:901px)").matches && !window.matchMedia("(pointer:coarse)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!cinematic || forceStatic) { setFallback(true); return; }
    const wrap = wrapRef.current, video = videoRef.current;
    if (!wrap || !video) { setFallback(true); return; }
    let dur = 5.79;
    const onMeta = () => { if (isFinite(video.duration) && video.duration > 0) dur = video.duration; };
    video.addEventListener("loadedmetadata", onMeta);
    const DIRS = [[0.82, -0.56, 1], [-0.82, -0.56, -1], [1, 0.05, 1], [-1, 0.05, -1], [0.82, 0.62, 1], [-0.82, 0.62, -1]];
    const GAP = 26;
    const sstep = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
    const revealOf = (lt, fin, fout) => (lt <= 0 || lt >= 1) ? 0 : sstep(0, fin || 0.3, lt) * (1 - sstep(1 - (fout || 0.3), 1, lt));
    // Progress-Remap: das Band, in dem nur noch die Headline sichtbar ist
    // (logisch ~0.32..0.44), soll 30% schneller durchscrollen. Andere Phasen
    // behalten exakt ihre physische Scrollstrecke (Section-H\u00f6he entsprechend angepasst).
    const remapProg = (q) => {
      const L0 = 0.32, L1 = 0.44;
      const segA = L0, segB = (L1 - L0) * 0.7, segC = 1 - L1;
      const tot = segA + segB + segC;
      const qA = segA / tot, qB = (segA + segB) / tot;
      if (q <= qA) return qA > 0 ? q / qA * L0 : 0;
      if (q <= qB) return L0 + (q - qA) / (qB - qA) * (L1 - L0);
      return L1 + (q - qB) / (1 - qB) * (1 - L1);
    };
    const computeProg = () => { const r = wrap.getBoundingClientRect(); const tv = r.height - window.innerHeight; const q = tv > 0 ? Math.min(1, Math.max(0, -r.top / tv)) : 0; return remapProg(q); };
    const draw = () => {
      const p = computeProg();
      const rotT = Math.min(1, Math.max(0, (p - 0.42) / 0.36));
      if (isFinite(dur)) { const tt = rotT * (dur - 0.03); if (Math.abs(video.currentTime - tt) > 0.012) { try { video.currentTime = tt; } catch (e) {} } }
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2 + window.innerHeight * 0.10;
      const rad = Math.min(window.innerWidth * 0.27, window.innerHeight * 0.245);
      const innerR = Math.min(window.innerWidth, window.innerHeight) * 0.13;
      const ip = sstep(0.0, 0.18, p);
      const introVis = Math.max(0, 1 - sstep(0.28, 0.37, p));
      const videoIn = sstep(0.32, 0.42, p);
      const sp = Math.max(0, Math.min(1, (p - 0.44) / 0.36));
      const af = sp < 0.28 ? (sp / 0.28) : 1 + (sp - 0.28) / 0.72 * (N - 1);
      const conv = 0;
      const videoOut = sstep(0.82, 0.90, p);
      const textIn = sstep(0.865, 0.915, p);
      const defSwipe = sstep(0.94, 0.972, p);
      const idxIn = sstep(0.95, 0.99, p);
      if (videoRef.current) {
        videoRef.current.style.opacity = (videoIn * (1 - videoOut)).toFixed(3);
        const ob = Math.min(24, (1 - videoIn) * 24 + videoOut * 24);
        videoRef.current.style.filter = "brightness(1.16) contrast(1.06) saturate(1.12) blur(" + ob.toFixed(2) + "px)";
      }
      if (introRef.current) {
        const kids = introRef.current.children;
        const ipHead = sstep(0.0, 0.126, p);
        const fadeOut = sstep(0.24, 0.32, p);
        const headOut = sstep(0.72, 0.80, p);
        const toTop = sstep(0.30, 0.44, p);
        if (kids[0]) { const v = sstep(0, 0.10, ipHead); kids[0].style.opacity = (v * (1 - fadeOut)).toFixed(3); kids[0].style.filter = "blur(" + ((1 - v) * 10).toFixed(2) + "px)"; kids[0].style.transform = "translateY(" + ((1 - v) * 20).toFixed(1) + "px)"; }
        if (kids[1]) { kids[1].style.opacity = (1 - fadeOut).toFixed(3); const chips = kids[1].children; for (let c = 0; c < chips.length; c++) { const cv = sstep(0.04 + c * 0.06, 0.24 + c * 0.06, ipHead); chips[c].style.opacity = cv.toFixed(3); chips[c].style.filter = "blur(" + ((1 - cv) * 8).toFixed(2) + "px)"; chips[c].style.transform = "translateY(" + ((1 - cv) * 14).toFixed(1) + "px)"; } }
        if (kids[3]) { const v = sstep(0.11, 0.153, p); kids[3].style.opacity = (v * (1 - fadeOut)).toFixed(3); kids[3].style.filter = "blur(" + ((1 - v) * 8).toFixed(2) + "px)"; kids[3].style.transform = "translateY(" + ((1 - v) * 18).toFixed(1) + "px)"; }
        if (kids[2]) { const v = sstep(0.075, 0.115, p); const op = v * (1 - headOut); kids[2].style.opacity = op.toFixed(3); kids[2].style.filter = "blur(" + ((1 - v) * 10).toFixed(2) + "px)"; const ty = -toTop * window.innerHeight * 0.30; const sc = 1 - toTop * 0.4; kids[2].style.transform = "translateY(" + ty.toFixed(1) + "px) scale(" + sc.toFixed(3) + ")"; }
      }
      if (convRef.current) {
        convRef.current.style.opacity = (textIn * (1 - defSwipe)).toFixed(3);
        convRef.current.style.transform = "translateX(" + (-defSwipe * 60).toFixed(1) + "vw)";
        convRef.current.style.pointerEvents = textIn > 0.6 && defSwipe < 0.1 ? "auto" : "none";
      }
      if (sheetRef.current) {
        const ins = "inset(0 0 " + ((1 - textIn) * 100).toFixed(1) + "% 0)";
        sheetRef.current.style.clipPath = ins;
        sheetRef.current.style.webkitClipPath = ins;
      }
      {
        const scanProg = sstep(0.79, 0.86, p);
        const scanShow = sstep(0.78, 0.81, p) * (1 - sstep(0.875, 0.915, p));
        if (scanRef.current) scanRef.current.style.opacity = scanShow.toFixed(3);
        if (scanFillRef.current) scanFillRef.current.style.height = (scanProg * 100).toFixed(1) + "%";
        if (scanBeamRef.current) { scanBeamRef.current.style.top = (scanProg * 100).toFixed(1) + "%"; scanBeamRef.current.style.opacity = (scanProg > 0.02 && scanProg < 0.985 ? 1 : 0).toString(); }
        if (scanReadRef.current) scanReadRef.current.textContent = Math.round(scanProg * 100) + "%";
      }
      if (idxRef.current) {
        idxRef.current.style.opacity = idxIn.toFixed(3);
        idxRef.current.style.transform = "translateX(" + ((1 - idxIn) * 60).toFixed(1) + "vw)";
        idxRef.current.style.pointerEvents = idxIn > 0.6 ? "auto" : "none";
      }
      for (let i = 0; i < N; i++) {
        const lab = labelRefs.current[i], ln = lineRefs.current[i], dt = dotRefs.current[i];
        if (!lab) continue;
        const rev = revealOf(af - i, i === 0 ? 0.45 : 0.3, i === 0 ? 0.45 : 0.3) * (1 - conv);
        const dx = DIRS[i][0], dy = DIRS[i][1], side = DIRS[i][2];
        const ax = cx + dx * (rad + GAP), ay = cy + dy * (rad + GAP);
        const objX = cx + dx * innerR, objY = cy + dy * innerR;
        const tipX = cx + dx * rad, tipY = cy + dy * rad;
        lab.style.opacity = rev.toFixed(3);
        lab.style.filter = "blur(" + ((1 - rev) * 7).toFixed(2) + "px)";
        lab.style.left = ax.toFixed(1) + "px"; lab.style.top = ay.toFixed(1) + "px";
        lab.style.transform = side > 0 ? "translate(0,-50%)" : "translate(-100%,-50%)";
        lab.style.textAlign = side > 0 ? "left" : "right";
        if (conv > 0.001) {
          const sa = Math.sin(conv * Math.PI);
          const sR = (rad + GAP) * (1 - conv);
          const sX = cx + dx * sR, sY = cy + dy * sR;
          if (ln) { ln.setAttribute("x1", cx.toFixed(1)); ln.setAttribute("y1", cy.toFixed(1)); ln.setAttribute("x2", sX.toFixed(1)); ln.setAttribute("y2", sY.toFixed(1)); ln.style.opacity = (sa * 0.9).toFixed(3); }
          if (dt) { dt.style.left = sX.toFixed(1) + "px"; dt.style.top = sY.toFixed(1) + "px"; dt.style.opacity = sa.toFixed(3); }
        } else {
          if (ln) { ln.setAttribute("x1", objX.toFixed(1)); ln.setAttribute("y1", objY.toFixed(1)); ln.setAttribute("x2", tipX.toFixed(1)); ln.setAttribute("y2", tipY.toFixed(1)); ln.style.opacity = (rev * 0.9).toFixed(3); }
          if (dt) { dt.style.left = objX.toFixed(1) + "px"; dt.style.top = objY.toFixed(1) + "px"; dt.style.opacity = rev.toFixed(3); }
        }
      }
    };
    const prime = () => { try { const pr = video.play(); if (pr && pr.then) pr.then(() => { try { video.pause(); } catch (e) {} }).catch(() => {}); else try { video.pause(); } catch (e) {} } catch (e) {} };
    prime();
    video.addEventListener("loadeddata", prime, { once: true });
    draw();
    const onScroll = () => draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (window.__lenis && window.__lenis.on) window.__lenis.on("scroll", onScroll);
    window.addEventListener("resize", draw);
    video.addEventListener("loadeddata", draw);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", draw);
      window.removeEventListener("scroll", onScroll);
      if (window.__lenis && window.__lenis.off) window.__lenis.off("scroll", onScroll);
      window.removeEventListener("resize", draw);
    };
  }, []);
  if (fallback) {
    return h("section", { id: "loesung360", className: "sec-pad grid-bg", style: { borderTop: "1px solid var(--line)", overflow: "hidden" } },
      h("div", { className: "wrap", style: { maxWidth: 1080, margin: "0 auto" } },
        h("div", { style: { textAlign: "center", maxWidth: 760, margin: "0 auto" } },
          h("div", { style: { display: "flex", justifyContent: "center", marginBottom: 18 } }, h(Eyebrow, { num: "// 01" }, "Warum Beyond")),
          h("div", { style: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 26 } }, ["mehr Kanäle", "mehr Content", "mehr Geschwindigkeit", "mehr Messbarkeit"].map((c) => h("span", { key: c, style: { display: "inline-flex", alignItems: "center", gap: 9, padding: "10px 18px", borderRadius: 999, fontFamily: "Poppins", fontWeight: 500, fontSize: "clamp(13px,1.4vw,15px)", color: "var(--ink)", background: "var(--glass)", boxShadow: "inset 0 0 0 1px var(--glass-line)" } }, h("span", { style: { width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" } }), c))),
          h("h2", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontWeight: 500, fontSize: "clamp(28px,4.4vw,54px)", textWrap: "balance", lineHeight: 1.12, margin: 0 } }, "Marketing wird gerade neu definiert. ", h("span", { style: { color: "var(--accent)", fontStyle: "normal" } }, "Mit Ihnen?")),
          h("p", { className: "lead", style: { maxWidth: 640, margin: "18px auto 0" } }, "Marketing-Abteilungen sollen mehr leisten, schneller liefern und gleichzeitig effizienter werden — mit denselben Teams. KI ist die einzige Antwort, die diese Gleichung auflöst. Sie trennt gerade zwei Lager: die, die ihre Schlagkraft vervielfachen, und die, die zusehen.")),
        h("div", { style: { marginTop: "clamp(48px,6vw,82px)" } },
          h("div", { style: { display: "flex", justifyContent: "center", marginBottom: 28 } }, h(Eyebrow, { num: "// 02" }, "360° im KI-Marketing")),
          h("div", { style: { position: "relative", width: "min(440px,82vw)", margin: "0 auto clamp(28px,4vw,52px)", aspectRatio: "1 / 1" } }, h("video", { src: "assets/glass-logo.mp4", autoPlay: true, muted: true, loop: true, playsInline: true, preload: "metadata", "aria-hidden": "true", style: { width: "100%", height: "100%", objectFit: "cover", filter: "brightness(1.12) contrast(1.05) saturate(1.1)", WebkitMaskImage: "radial-gradient(ellipse 60% 62% at 50% 50%, #000 46%, rgba(0,0,0,0) 90%)", maskImage: "radial-gradient(ellipse 60% 62% at 50% 50%, #000 46%, rgba(0,0,0,0) 90%)" } })),
          h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "22px 40px" } },
            channels.map(([ic, ch, be]) => h("div", { key: ch, style: { display: "flex", gap: 14, alignItems: "flex-start" } },
              h("span", { style: { color: "var(--accent)", flex: "none", marginTop: 2 } }, h(Icon, { name: ic, size: 22 })),
              h("div", null, h("div", { style: { fontFamily: "Poppins", fontWeight: 600, fontSize: 17 } }, ch), h("div", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontSize: 18, color: "var(--ink-dim)", marginTop: 2 } }, be)))))),
        h("div", { style: { marginTop: "clamp(48px,6vw,82px)", position: "relative", padding: "clamp(26px,3.4vw,46px)", borderRadius: 12, background: "linear-gradient(180deg, rgba(255,255,255,.7), rgba(244,247,251,.5))", boxShadow: "inset 0 0 0 1px color-mix(in srgb,var(--accent) 30%, transparent), 0 30px 70px rgba(20,40,70,.10)" } },
          h("div", { style: { display: "flex", justifyContent: "flex-start", marginBottom: 18 } }, h(Eyebrow, { num: "// 03" }, "Definition")),
          h("div", { style: { fontFamily: "Poppins", fontWeight: 700, fontSize: "clamp(16px,1.8vw,22px)", letterSpacing: "-.01em", color: "var(--ink)", marginBottom: 8 } }, "Wir nennen es"),
          h("h2", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontWeight: 500, fontSize: "clamp(34px,4.4vw,58px)", lineHeight: 1.0, margin: 0, color: "var(--ink)" } }, "Beyond Marketing"),
          h("div", { style: { display: "flex", alignItems: "center", gap: 14, marginTop: 16, color: "var(--muted)", fontFamily: "Poppins", fontSize: 14, flexWrap: "wrap" } },
            h("span", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: 18, color: "var(--ink-dim)" } }, "/bɪˈjɒnd ˈmɑːkɪtɪŋ/"),
            h("span", { style: { width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" } }),
            h("span", null, "Substantiv"),
            h("span", { style: { width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" } }),
            h("span", null, "team::mt")),
          h("p", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontSize: "clamp(19px,2vw,27px)", lineHeight: 1.42, color: "var(--ink)", maxWidth: 640, marginTop: 24, marginBottom: 0 } }, h("span", { style: { color: "var(--accent)", fontWeight: 600, fontFamily: "Poppins", fontSize: "0.62em", marginRight: 12, verticalAlign: "2px" } }, "1."), "Marketing, das mit KI über alle Kanäle hinweg denkt — 360°, immer aktiv, in Echtzeit messbar."),
          h("p", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: 16, color: "var(--ink-dim)", maxWidth: 560, marginTop: 14, marginBottom: 0 } }, "„Sie machen kein Marketing von gestern mehr — Sie machen Beyond Marketing.“")),
        leistungenHref ? h("div", { style: { marginTop: "clamp(40px,5vw,60px)", textAlign: "center" } }, h("a", { href: leistungenHref, className: "btn btn-cta", style: { textDecoration: "none" } }, "Alle Leistungen ansehen ", h(Icon, { name: "arrow", size: 16 }))) : null));
  }
  return h("section", { id: "loesung360", ref: wrapRef, className: "grid-bg", style: { position: "relative", height: "636vh", borderTop: "1px solid var(--line)" } },
    h("div", { style: { position: "sticky", top: 0, height: "100vh", overflow: "hidden" } },
    h("div", { ref: introRef, style: { position: "absolute", inset: 0, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px", pointerEvents: "none" } },
      h("div", { style: { display: "flex", justifyContent: "center", marginBottom: 18 } }, h(Eyebrow, { num: "// 01" }, "Warum Beyond")),
      h("div", { style: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 26, maxWidth: 700 } }, ["mehr Kanäle", "mehr Content", "mehr Geschwindigkeit", "mehr Messbarkeit"].map((c) => h("span", { key: c, style: { display: "inline-flex", alignItems: "center", gap: 9, padding: "10px 18px", borderRadius: 999, fontFamily: "Poppins", fontWeight: 500, fontSize: "clamp(13px,1.4vw,15px)", color: "var(--ink)", background: "var(--glass)", boxShadow: "inset 0 0 0 1px var(--glass-line)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" } }, h("span", { style: { width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" } }), c))),
      h("h2", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontWeight: 500, fontSize: "clamp(28px,4.4vw,54px)", textWrap: "balance", lineHeight: 1.12, maxWidth: 900, margin: 0 } }, "Marketing wird gerade neu definiert. ", h("span", { style: { color: "var(--accent)", fontStyle: "normal" } }, "Mit Ihnen?")),
      h("p", { className: "lead", style: { maxWidth: 640, margin: "18px auto 0" } }, "Marketing-Abteilungen sollen mehr leisten, schneller liefern und gleichzeitig effizienter werden — mit denselben Teams. KI ist die einzige Antwort, die diese Gleichung auflöst. Sie trennt gerade zwei Lager: die, die ihre Schlagkraft vervielfachen, und die, die zusehen.")),
    h("div", { ref: convRef, style: { position: "absolute", inset: 0, zIndex: 7, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(40px,7vh,90px) 5vw", opacity: 0, pointerEvents: "none" } },
      h("div", { ref: sheetRef, style: { position: "relative", width: "100%", maxWidth: 1080, margin: "0 auto", padding: "clamp(18px,2.6vh,34px) clamp(20px,2.8vw,44px) clamp(20px,2.6vh,34px)", background: "linear-gradient(180deg, rgba(255,255,255,.74), rgba(244,247,251,.6))", boxShadow: "inset 0 0 0 1px color-mix(in srgb,var(--accent) 36%, transparent), 0 34px 90px rgba(20,40,70,.14)", backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)", overflow: "hidden", willChange: "clip-path, opacity" } },
        h("div", { "aria-hidden": "true", style: { position: "absolute", inset: 0, pointerEvents: "none", opacity: .45, backgroundImage: "linear-gradient(color-mix(in srgb,var(--accent) 14%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--accent) 14%,transparent) 1px,transparent 1px)", backgroundSize: "34px 34px", WebkitMaskImage: "linear-gradient(180deg,#000,transparent 92%)", maskImage: "linear-gradient(180deg,#000,transparent 92%)" } }),
        h("div", { "aria-hidden": "true", style: { position: "absolute", top: 9, left: 9, width: 16, height: 16, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" } }),
        h("div", { "aria-hidden": "true", style: { position: "absolute", top: 9, right: 9, width: 16, height: 16, borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" } }),
        h("div", { "aria-hidden": "true", style: { position: "absolute", bottom: 9, left: 9, width: 16, height: 16, borderBottom: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" } }),
        h("div", { "aria-hidden": "true", style: { position: "absolute", bottom: 9, right: 9, width: 16, height: 16, borderBottom: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" } }),
        h("div", { style: { position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 11.5, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)", borderBottom: "1px solid color-mix(in srgb,var(--accent) 26%, transparent)", paddingBottom: 12, marginBottom: "clamp(14px,2.2vh,26px)" } },
          h("span", { style: { display: "inline-flex", alignItems: "center", gap: 9, color: "var(--accent)", fontWeight: 600 } }, h("span", { style: { width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 9px var(--accent)" } }), "Messprotokoll"),
          h("span", null, "team::mt \u00b7 Vermessung 100%")),
        h("div", { className: "wrap", style: { position: "relative", maxWidth: 1100, margin: "0 auto", width: "100%", paddingLeft: 0, paddingRight: 0 } },
          h("div", { className: "bm-split" },
          h("div", null,
            h("div", { style: { display: "flex", justifyContent: "flex-start", marginBottom: 20 } }, h(Eyebrow, { num: "// 02" }, "Definition")),
            h("div", { style: { fontFamily: "Poppins", fontWeight: 700, fontSize: "clamp(16px,1.8vw,22px)", letterSpacing: "-.01em", color: "var(--ink)", marginBottom: 8 } }, "Wir nennen es"),
            h("h2", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontWeight: 500, fontSize: "clamp(34px,4.4vw,58px)", lineHeight: 1.0, margin: 0, color: "var(--ink)" } }, "Beyond Marketing"),
            h("div", { style: { display: "flex", alignItems: "center", gap: 14, marginTop: 16, color: "var(--muted)", fontFamily: "Poppins", fontSize: 14, flexWrap: "wrap" } },
              h("span", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: 18, color: "var(--ink-dim)" } }, "/bɪˈjɒnd ˈmɑːkɪtɪŋ/"),
              h("span", { style: { width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" } }),
              h("span", null, "Substantiv"),
              h("span", { style: { width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" } }),
              h("span", null, "team::mt")),
            h("p", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontSize: "clamp(19px,2vw,27px)", lineHeight: 1.42, color: "var(--ink)", maxWidth: 560, marginTop: 26, marginBottom: 0 } },
              h("span", { style: { color: "var(--accent)", fontWeight: 600, fontFamily: "Poppins", fontSize: "0.62em", marginRight: 12, verticalAlign: "2px" } }, "1."),
              "Marketing, das mit KI über alle Kanäle hinweg denkt — 360°, immer aktiv, in Echtzeit messbar."),
            h("p", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: 16, color: "var(--ink-dim)", maxWidth: 520, marginTop: 14, marginBottom: 0 } }, "„Sie machen kein Marketing von gestern mehr — Sie machen Beyond Marketing.“")),
          h("div", { className: "bm-divider", "aria-hidden": "true", style: { alignSelf: "stretch", width: 1, minHeight: 220, background: "linear-gradient(to bottom, transparent, var(--accent), transparent)", boxShadow: "0 0 12px color-mix(in srgb,var(--accent) 55%, transparent)" } }),
          h("div", null,
            h("h3", { style: { fontSize: "clamp(30px,4vw,56px)", lineHeight: 1.04, textWrap: "balance", margin: 0 } }, "Sind Sie ", h("span", { style: { color: "var(--accent)" } }, "bereit?")),
            h("p", { style: { color: "var(--ink-dim)", fontSize: 16, lineHeight: 1.5, maxWidth: 390, marginTop: 18 } }, "Ein 10-Minuten-Gespräch genügt, um zu sehen, wo KI in Ihrem Marketing den größten Hebel setzt."),
            h("div", { style: { display: "flex", gap: 14, flexWrap: "wrap", marginTop: 30 } },
              h("button", { className: "btn btn-cta", onClick: onBook }, "Termin vereinbaren ", h(Icon, { name: "arrow", size: 16 }))),
            h("button", { onClick: goIndex, style: { display: "inline-flex", alignItems: "center", gap: 8, marginTop: 18, padding: 0, background: "none", border: "none", cursor: "pointer", fontFamily: "Poppins", fontWeight: 600, fontSize: 15, color: "var(--accent)" } }, "Dann fangen wir hier an", h(Icon, { name: "arrow", size: 16 }))))))),
    h("div", { ref: idxRef, style: { position: "absolute", inset: 0, zIndex: 7, display: "flex", alignItems: "center", justifyContent: "center", padding: "10vh 5vw", opacity: 0, transform: "translateX(60vw)", pointerEvents: "none" } },
      h("div", { className: "wrap", style: { maxWidth: 980, margin: "0 auto", width: "100%" } },
        h("div", { style: { display: "flex", justifyContent: "flex-start" } }, h(Eyebrow, { num: "// Leistungen" }, "Was wir tun")),
        h("h2", { style: { fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", textWrap: "balance", letterSpacing: "-.01em", maxWidth: 760, marginTop: 10, marginBottom: "clamp(20px,3vw,36px)" } }, "Fünf Hebel, ein Ziel: ", h("span", { style: { color: "var(--accent)" } }, "sichtbares Marketing.")),
        h("div", null, CHAPTERS.map((d) => h("div", { key: d.num, className: "lidx-row" },
          h("span", { className: "lidx-num" }, d.num.replace("// ", "")),
          h("span", { className: "lidx-name", style: { display: "flex", alignItems: "center", gap: "clamp(12px,1.4vw,18px)" } },
            h("img", { src: d.img, alt: "", "aria-hidden": "true", style: { width: "clamp(40px,3.6vw,56px)", height: "auto", flex: "none", filter: "drop-shadow(0 6px 16px color-mix(in srgb,var(--accent) 34%, transparent))" } }),
            d.eyebrow),
          h("span", { className: "lidx-go" }, h(Icon, { name: "arrow", size: 20 }))))),
        leistungenHref ? h("a", { href: leistungenHref, className: "btn btn-cta", style: { display: "inline-flex", alignItems: "center", gap: 10, marginTop: "clamp(24px,3vw,38px)", textDecoration: "none" } }, "Alle Leistungen ansehen ", h(Icon, { name: "arrow", size: 16 })) : null) ),
    h("video", { ref: videoRef, src: "assets/glass-logo.mp4", muted: true, playsInline: true, preload: "metadata", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1, background: "#fff", opacity: 0, transform: "translateY(10%) scale(0.7)", transformOrigin: "center", filter: "brightness(1.16) contrast(1.06) saturate(1.12)", WebkitMaskImage: "radial-gradient(ellipse 60% 62% at 50% 50%, #000 46%, rgba(0,0,0,0) 90%)", maskImage: "radial-gradient(ellipse 60% 62% at 50% 50%, #000 46%, rgba(0,0,0,0) 90%)" } }),
    h("div", { ref: scanRef, "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "calc(50% + 10vh)", transform: "translate(-50%,-50%)", width: "min(58vh,54vw)", height: "min(58vh,54vw)", zIndex: 6, opacity: 0, pointerEvents: "none", willChange: "opacity" } },
      h("div", { ref: scanFillRef, "aria-hidden": "true", style: { position: "absolute", left: 0, right: 0, top: 0, height: "0%", overflow: "hidden", background: "linear-gradient(180deg, color-mix(in srgb,var(--accent) 14%, transparent), color-mix(in srgb,var(--accent) 4%, transparent))" } },
        h("div", { style: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(color-mix(in srgb,var(--accent) 32%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--accent) 32%,transparent) 1px,transparent 1px)", backgroundSize: "30px 30px", opacity: .5 } })),
      h("div", { ref: scanBeamRef, "aria-hidden": "true", style: { position: "absolute", left: "-3%", right: "-3%", top: "0%", height: 2, opacity: 0, background: "linear-gradient(90deg, transparent, var(--accent) 18%, var(--accent) 82%, transparent)", boxShadow: "0 0 20px 3px color-mix(in srgb,var(--accent) 78%, transparent)" } }),
      h("div", { style: { position: "absolute", top: 0, left: 0, width: 20, height: 20, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" } }),
      h("div", { style: { position: "absolute", top: 0, right: 0, width: 20, height: 20, borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" } }),
      h("div", { style: { position: "absolute", bottom: 0, left: 0, width: 20, height: 20, borderBottom: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" } }),
      h("div", { style: { position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderBottom: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" } }),
      h("div", { style: { position: "absolute", left: "50%", bottom: "-12%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 10, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--accent)", whiteSpace: "nowrap" } },
        h("span", { style: { width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" } }),
        h("span", null, "Vermessung"),
        h("span", { ref: scanReadRef, style: { fontWeight: 700, fontVariantNumeric: "tabular-nums" } }, "0%"))),
    h("svg", { style: { position: "absolute", inset: 0, zIndex: 2, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }, "aria-hidden": "true" },
      channels.map((_, i) => h("line", { key: i, ref: (el) => lineRefs.current[i] = el, x1: "0", y1: "0", x2: "0", y2: "0", style: { stroke: "var(--accent)", strokeWidth: 1.2, opacity: 0, filter: "drop-shadow(0 0 5px color-mix(in srgb,var(--accent) 70%, transparent))" } }))),
    channels.map((_, i) => h("div", { key: "d" + i, ref: (el) => dotRefs.current[i] = el, "aria-hidden": "true", style: { position: "absolute", left: 0, top: 0, zIndex: 3, opacity: 0, pointerEvents: "none" } },
      h("span", { className: "glass-dot", style: { position: "absolute", left: 0, top: 0, width: 9, height: 9, borderRadius: "50%", transform: "translate(-50%,-50%)", background: "var(--accent)", boxShadow: "0 0 12px 2px color-mix(in srgb,var(--accent) 75%, transparent)" } }),
      h("span", { className: "glass-dot-ring", style: { position: "absolute", left: 0, top: 0, width: 9, height: 9, borderRadius: "50%", transform: "translate(-50%,-50%)", boxShadow: "0 0 0 1.5px color-mix(in srgb,var(--accent) 65%, transparent)" } }))),
    channels.map(([ic, ch, be], i) => h("div", { key: ch, ref: (el) => labelRefs.current[i] = el, style: { position: "absolute", left: 0, top: 0, zIndex: 4, width: "clamp(190px,22vw,290px)", opacity: 0, willChange: "left, top, opacity" } },
      h("div", { style: { fontFamily: "Poppins", fontWeight: 600, fontSize: 11, letterSpacing: ".26em", textTransform: "uppercase", color: "var(--muted)" } }, ch),
      h("div", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: "clamp(21px,2.2vw,30px)", lineHeight: 1.16, color: "var(--ink)", marginTop: 6 } }, be)))));
}
const LABOR_DEMOS = [
  { tag: "Landingpage", prompt: "Schreib eine Headline für eine Persona-Landingpage — Zielgruppe: B2B-Entscheider.",
    out: "Marketing, das Ihre Zahlen schon kennt.\n\nEine Landingpage, die genau Ihre Entscheider abholt — vom ersten Scrollen bis zur gebuchten Demo." },
  { tag: "LinkedIn", prompt: "Formuliere einen LinkedIn-Post-Opener für eine Marketingleiterin.",
    out: "„Wir posten viel. Aber wirkt das eigentlich?\u201c\n\nDie ehrliche Antwort meines Teams hat mich letzte Woche überrascht — drei Dinge, die wir ab sofort anders machen." },
  { tag: "Automatisierung", prompt: "Entwirf einen Automatisierungs-Flow für Lead-Nurturing.",
    out: "1 · Lead füllt das Formular aus\n2 · KI qualifiziert & taggt in Echtzeit\n3 · Personalisierte E-Mail-Sequenz startet\n4 · Übergabe an den Vertrieb beim Kaufsignal" }];
const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

function LiveConsole() {
  const tagRef = useRef(null), promptRef = useRef(null), outRef = useRef(null), caretRef = useRef(null), badgeRef = useRef(null), shimRef = useRef(null);
  const dotsRef = useRef([]);
  const runRef = useRef(null), idxRef = useRef(0);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, cancelled = false, i = 0, phase = "think", pStart = 0;
    const CPS = 40, THINK = 520, HOLD = 2600;
    const setDots = k0 => dotsRef.current.forEach((d, k) => { if (d) { d.style.background = k === k0 ? "var(--accent)" : "var(--line-strong)"; d.style.width = k === k0 ? "20px" : "7px"; } });
    const generating = on => {
      if (shimRef.current) shimRef.current.style.opacity = on ? "1" : "0";
      if (caretRef.current) caretRef.current.style.display = on ? "inline-block" : "none";
      if (badgeRef.current) badgeRef.current.style.opacity = on ? "0" : "1";
    };
    const startDemo = idx => {
      i = idx; phase = "think"; pStart = performance.now();
      const d = LABOR_DEMOS[i];
      setDots(i);
      if (tagRef.current) tagRef.current.textContent = d.tag;
      if (promptRef.current) promptRef.current.textContent = d.prompt;
      if (outRef.current) outRef.current.textContent = "";
      generating(true);
      if (reduce) { if (outRef.current) outRef.current.textContent = d.out; generating(false); phase = "hold"; }
    };
    const frame = now => {
      if (cancelled) return;
      const d = LABOR_DEMOS[i], el = now - pStart;
      if (!reduce) {
        if (phase === "think") { if (el >= THINK) { phase = "type"; pStart = now; } }
        else if (phase === "type") {
          const n = Math.floor(el * CPS / 1000);
          if (outRef.current) outRef.current.textContent = d.out.slice(0, Math.min(n, d.out.length));
          if (n >= d.out.length) { generating(false); phase = "hold"; pStart = now; }
        } else if (phase === "hold") { if (el >= HOLD) startDemo((i + 1) % LABOR_DEMOS.length); }
      } else {
        if (el >= HOLD + 1900) startDemo((i + 1) % LABOR_DEMOS.length);
      }
      raf = requestAnimationFrame(frame);
    };
    runRef.current = () => startDemo((i + 1) % LABOR_DEMOS.length);
    const onVis = () => { if (!document.hidden && !cancelled) startDemo(i); };
    document.addEventListener("visibilitychange", onVis);
    startDemo(0);
    raf = requestAnimationFrame(frame);
    return () => { cancelled = true; cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", onVis); };
  }, []);
  const onGenerate = () => { if (runRef.current) runRef.current(); };
  const dot = red => ({ width: 9, height: 9, borderRadius: "50%", background: red ? "var(--accent)" : "var(--line-strong)" });
  return h("div", { style: { position: "relative", borderRadius: 7, overflow: "hidden", background: "linear-gradient(180deg, rgba(22,30,52,.66), rgba(9,14,28,.62))", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 30px 90px rgba(0,0,0,.5), 0 0 60px color-mix(in srgb,var(--accent) 12%, transparent)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" } },
    h("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: "1px solid var(--line)" } },
      h("span", { style: { display: "flex", gap: 7 } }, h("span", { style: dot(true) }), h("span", { style: dot(false) }), h("span", { style: dot(false) })),
      h("span", { style: { fontFamily: mono, fontSize: 12, letterSpacing: ".14em", color: "var(--muted)", textTransform: "uppercase" } }, "KI-Labor · Live"),
      h("span", { ref: tagRef, style: { marginLeft: "auto", fontFamily: mono, fontSize: 11.5, letterSpacing: ".06em", color: "var(--accent)", padding: "4px 11px", borderRadius: 999, boxShadow: "inset 0 0 0 1px color-mix(in srgb,var(--accent) 42%, transparent)" } }, "Landingpage")),
    h("div", { style: { display: "flex", gap: 10, padding: "16px 18px 12px", alignItems: "flex-start", borderBottom: "1px solid color-mix(in srgb,var(--line) 60%, transparent)" } },
      h("span", { style: { color: "var(--accent)", fontFamily: mono, fontSize: 14, lineHeight: 1.5 } }, "›"),
      h("span", { ref: promptRef, style: { fontFamily: mono, fontSize: "clamp(12.5px,1.4vw,13.5px)", color: "var(--ink-dim)", lineHeight: 1.55 } }, "…")),
    h("div", { style: { position: "relative", padding: "16px 18px 18px", minHeight: "clamp(168px,24vh,220px)" } },
      h("span", { ref: outRef, style: { fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.58, color: "var(--ink)", whiteSpace: "pre-wrap" } }),
      h("span", { ref: caretRef, className: "labor-caret", "aria-hidden": "true", style: { display: "inline-block", width: 9, height: "1.05em", marginLeft: 2, transform: "translateY(2px)", background: "var(--accent)", boxShadow: "0 0 10px color-mix(in srgb,var(--accent) 70%, transparent)" } }),
      h("span", { ref: shimRef, className: "labor-scan", "aria-hidden": "true", style: { position: "absolute", left: 0, right: 0, top: 0, height: "46%", opacity: 0, transition: "opacity .4s ease", pointerEvents: "none", background: "linear-gradient(180deg, transparent, color-mix(in srgb,var(--accent) 16%, transparent) 55%, transparent)" } }),
      h("span", { ref: badgeRef, style: { position: "absolute", right: 16, bottom: 13, opacity: 0, transition: "opacity .45s ease", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: mono, fontSize: 12, letterSpacing: ".04em", color: "var(--accent)" } }, "fertig ", h(Icon, { name: "check", size: 13, stroke: 2.6 }))),
    h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px", borderTop: "1px solid var(--line)" } },
      h("span", { style: { display: "flex", gap: 7, alignItems: "center" } },
        [0, 1, 2].map(k => h("span", { key: k, ref: el => dotsRef.current[k] = el, style: { width: k === 0 ? 20 : 7, height: 7, borderRadius: 999, background: k === 0 ? "var(--accent)" : "var(--line-strong)", transition: "width .35s ease, background .35s ease" } }))),
      h("button", { className: "btn btn-ghost", onClick: onGenerate, style: { padding: "10px 18px", fontSize: 13.5 } }, "Live generieren ", h(Icon, { name: "bolt", size: 15 }))));
}

function KiLaborSection({ onBook }) {
  const sr = useScanReveal(2600);
  const proof = [["video", "Live-Demos statt Folien"], ["target", "Use Cases statt Theorie"], ["check", "100% Nachvollziehbarkeit"]];
  return h("section", { id: "labor", className: "mt-band", style: { position: "relative", padding: "clamp(80px,11vw,150px) 0", overflow: "hidden", background: "linear-gradient(180deg,#0a1020,#05070e)" }, ref: sr.ref },
    h(HazardEdge, { thin: true, animate: true, style: { position: "absolute", top: 0, left: 0, right: 0 } }),
    h(ScanFrame, null),
    sr.playing && h("span", { className: "scan-reveal-line play", key: sr.run, "aria-hidden": "true" }),
    h("div", { className: "wrap", style: { position: "relative", zIndex: 1 } },
      h("div", { className: "scan-reveal-content" + (sr.playing ? " play" : ""), key: sr.run, style: { "--scan-dur": "2600ms", opacity: sr.reduce ? 1 : sr.run > 0 ? undefined : 0 } },
        h("div", { className: "labor-grid", style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "clamp(30px,4.5vw,68px)", alignItems: "center" } },
          h("div", null,
            h(Eyebrow, { num: "// 03" }, "KI-Labor"),
            h("h2", { style: { fontSize: "clamp(30px,4.4vw,54px)", textWrap: "balance", lineHeight: 1.04, marginTop: 6 } }, "Hier wird KI ", h("span", { style: { color: "var(--accent)" } }, "sofort greifbar.")),
            h("p", { className: "lead", style: { fontSize: "clamp(17px,1.9vw,21px)", maxWidth: 460, marginTop: 18, marginBottom: 26 } }, "Keine Folien — eine offene Konsole. Wir geben einen echten Marketing-Auftrag, Sie sehen die Antwort live entstehen."),
            h("ul", { style: { listStyle: "none", padding: 0, margin: "0 0 30px", display: "grid", gap: 13 } },
              proof.map(([ic, t]) => h("li", { key: t, style: { display: "flex", alignItems: "center", gap: 13, fontFamily: "Poppins", fontWeight: 500, fontSize: "clamp(14px,1.5vw,15.5px)", color: "var(--ink)" } },
                h("span", { style: { flex: "none", width: 38, height: 38, borderRadius: 2, display: "grid", placeItems: "center", color: "var(--accent)", boxShadow: "inset 0 0 0 1px var(--line-strong)" } }, h(Icon, { name: ic, size: 18 })), t))),
            h("button", { className: "btn btn-cta", onClick: onBook }, "Gespräch anfragen ", h(Icon, { name: "arrow", size: 16 }))),
          h(LiveConsole, null)))),
    h(HazardEdge, { thin: true, animate: true, style: { position: "absolute", bottom: 0, left: 0, right: 0 } }));
}

/* ===================== Leistungen — alternierende Feature-Zeilen ===================== */
const gp = { position: "relative", borderRadius: 8, padding: 22, background: "var(--glass)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 24px 60px rgba(20,40,70,.10)", overflow: "hidden" };
const gpDark = { ...gp, background: "rgba(12,20,38,.55)" };
const monoLbl = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 11.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)" };

function GlasIcon({ kind }) {
  const wrap = { width: 54, height: 54, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", color: "var(--accent)", background: "linear-gradient(160deg, rgba(255,255,255,.18), rgba(255,255,255,.04))", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 10px 26px rgba(20,40,70,.16)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" };
  const c = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
  let inner;
  if (kind === "lupe") inner = h("svg", c, h("circle", { cx: "10.5", cy: "10.5", r: "6" }), h("path", { d: "M14.8 14.8 20 20" }));
  else if (kind === "laptop") inner = h("svg", c, h("rect", { x: "4", y: "5", width: "16", height: "11", rx: "1.5" }), h("path", { d: "M2.5 19h19" }));
  else if (kind === "linkedin") inner = h(Icon, { name: "linkedin", size: 26 });
  else if (kind === "quote") inner = h("span", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontSize: 40, lineHeight: 1, marginTop: 14 } }, "\u201c");
  else inner = h("span", { style: { fontFamily: "Poppins", fontWeight: 700, fontSize: 24 } }, "@");
  return h("span", { style: wrap }, inner);
}

function MiniConsole({ text }) {
  const outRef = useRef(null), caretRef = useRef(null), shimRef = useRef(null);
  useEffect(() => {
    const el = outRef.current; if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = text; if (caretRef.current) caretRef.current.style.display = "none"; if (shimRef.current) shimRef.current.style.opacity = "0"; return; }
    let raf = 0, start = 0, started = false, cancelled = false; const CPS = 42;
    const inView = () => { const r = el.getBoundingClientRect(), vw = window.innerWidth || 1, vh = window.innerHeight || 1; const cx = r.left + r.width / 2, cy = r.top + r.height / 2; return cx > vw * 0.1 && cx < vw * 0.9 && cy > 0 && cy < vh; };
    const frame = now => {
      if (cancelled) return;
      if (!started && inView()) { started = true; start = now; if (shimRef.current) shimRef.current.style.opacity = "1"; }
      if (started) {
        const n = Math.floor((now - start) * CPS / 1000);
        el.textContent = text.slice(0, Math.min(n, text.length));
        if (n >= text.length) { if (caretRef.current) caretRef.current.style.display = "none"; if (shimRef.current) shimRef.current.style.opacity = "0"; return; }
      }
      raf = requestAnimationFrame(frame);
    };
    el.textContent = ""; raf = requestAnimationFrame(frame);
    return () => { cancelled = true; if (raf) cancelAnimationFrame(raf); };
  }, [text]);
  return h("div", { style: { position: "relative" } },
    h("span", { ref: outRef, style: { fontFamily: "Poppins", fontWeight: 500, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.5, color: "var(--ink)", whiteSpace: "pre-wrap" } }),
    h("span", { ref: caretRef, className: "labor-caret", "aria-hidden": "true", style: { display: "inline-block", width: 8, height: "1.05em", marginLeft: 2, transform: "translateY(2px)", background: "var(--accent)", boxShadow: "0 0 10px color-mix(in srgb,var(--accent) 70%, transparent)" } }),
    h("span", { ref: shimRef, className: "labor-scan", "aria-hidden": "true", style: { position: "absolute", left: 0, right: 0, top: 0, height: "62%", opacity: 0, pointerEvents: "none", background: "linear-gradient(180deg, transparent, color-mix(in srgb,var(--accent) 15%, transparent) 55%, transparent)" } }));
}

function AuditVisual() {
  const rows = [["Sichtbarkeit", 72], ["Kanal-Abdeckung", 58], ["SEO-Score", 64], ["Automatisierung", 41]];
  const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  return h("div", { style: { ...gp, position: "relative", overflow: "hidden", padding: 0 } },
    h("div", { "aria-hidden": "true", style: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--line-strong) 1px, transparent 1px), linear-gradient(90deg, var(--line-strong) 1px, transparent 1px)", backgroundSize: "26px 26px", opacity: 0.45, WebkitMaskImage: "radial-gradient(circle at 50% 38%, #000 55%, transparent 92%)", maskImage: "radial-gradient(circle at 50% 38%, #000 55%, transparent 92%)" } }),
    h("span", { className: "audit-scan", "aria-hidden": "true", style: { position: "absolute", left: 0, right: 0, top: 0, height: 56, zIndex: 1, pointerEvents: "none", background: "linear-gradient(180deg, color-mix(in srgb,var(--accent) 22%, transparent), transparent)", borderTop: "1.5px solid var(--accent)", boxShadow: "0 0 18px color-mix(in srgb,var(--accent) 45%, transparent)" } }),
    h("div", { style: { position: "relative", zIndex: 2, padding: 22 } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 } },
        h("span", { className: "audit-blink", style: { width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" } }),
        h("span", { style: { fontFamily: mono, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink)" } }, "Diagnose-Scan"),
        h("span", { style: { marginLeft: "auto", fontFamily: mono, fontSize: 12, letterSpacing: ".1em", color: "var(--accent)" } }, "● live")),
      h("svg", { viewBox: "0 0 320 48", width: "100%", height: "46", preserveAspectRatio: "none", "aria-hidden": "true", style: { display: "block", marginBottom: 18, overflow: "visible" } },
        h("polyline", { points: "0,24 60,24 78,24 88,8 100,40 112,24 150,24 168,24 178,14 190,34 202,24 320,24", fill: "none", stroke: "var(--accent)", strokeWidth: "2", strokeLinejoin: "round", strokeLinecap: "round", style: { filter: "drop-shadow(0 0 6px color-mix(in srgb,var(--accent) 60%, transparent))" } })),
      h("div", { style: { display: "grid", gap: 13 } },
        rows.map(([label, val]) => h("div", { key: label },
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 } },
            h("span", { style: { fontFamily: mono, fontSize: 12.5, letterSpacing: ".04em", color: "var(--ink-dim)" } }, label),
            h("span", { style: { fontFamily: mono, fontWeight: 700, fontSize: 13, color: "var(--accent)" } }, h(CountUp, { to: val, suffix: "%" }))),
          h("div", { style: { position: "relative", height: 10, borderRadius: 2, background: "repeating-linear-gradient(90deg, var(--line-strong) 0 7px, transparent 7px 11px)" } },
            h("div", { style: { position: "absolute", left: 0, top: 0, bottom: 0, width: val + "%", borderRadius: 2, background: "repeating-linear-gradient(90deg, var(--accent) 0 7px, color-mix(in srgb,var(--accent) 30%, transparent) 7px 11px)", boxShadow: "0 0 12px color-mix(in srgb,var(--accent) 40%, transparent)" } })))) ),
      h("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 18, fontFamily: mono, fontSize: 12, color: "var(--ink)" } },
        h(Icon, { name: "check", size: 14, stroke: 2.6 }), h("span", null, "Befund: ", h("span", { style: { color: "var(--accent)" } }, "4 Hebel"), " mit Sofortwirkung"))));
}
function GeoVisual() {
  return h("div", { style: gp },
    h("div", { style: { display: "flex", gap: 10, alignItems: "flex-start", paddingBottom: 14, borderBottom: "1px solid var(--line)" } },
      h("span", { style: { color: "var(--accent)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 14 } }, "\u203a"),
      h("span", { style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "clamp(12.5px,1.4vw,13.5px)", color: "var(--ink-dim)", lineHeight: 1.5 } }, "Welche Agentur macht KI-Marketing für den B2B-Mittelstand?")),
    h("p", { style: { fontSize: "clamp(15px,1.7vw,17px)", lineHeight: 1.6, color: "var(--ink)", marginTop: 14, marginBottom: 14 } }, "Für KI-gestütztes B2B-Marketing wird unter anderem ", h("strong", { style: { color: "var(--accent)", background: "color-mix(in srgb,var(--accent) 12%, transparent)", padding: "1px 6px", borderRadius: 4 } }, "team::mt"), " genannt — mit 360°-Ansatz über Website, LinkedIn, SEO und Automatisierung."),
    h("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
      ["Quelle: team-mt.de", "zitiert in KI-Antwort", "Position 1"].map(t => h("span", { key: t, style: { fontFamily: "Poppins", fontSize: 11.5, padding: "5px 11px", borderRadius: 999, color: "var(--ink-dim)", boxShadow: "inset 0 0 0 1px var(--line-strong)" } }, t))));
}
function LinkedInVisual() {
  const stats = [["Impressions", 14800, ""], ["Profilaufrufe", 740, ""], ["Interaktion", 5, "%"]];
  return h("div", { style: gp },
    h("div", { style: { display: "flex", alignItems: "center", gap: 13, marginBottom: 18 } },
      h("span", { style: { width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(160deg, color-mix(in srgb,var(--accent) 18%, var(--glass)), var(--glass))", boxShadow: "inset 0 0 0 1px var(--glass-line)", display: "grid", placeItems: "center", color: "var(--accent)" } }, h(Icon, { name: "linkedin", size: 22 })),
      h("div", null, h("div", { style: { fontFamily: "Poppins", fontWeight: 700, fontSize: 16 } }, "team::mt"), h("div", { style: { color: "var(--muted)", fontSize: 13 } }, "KI-Marketing · B2B")),
      h("span", { style: { marginLeft: "auto", fontFamily: "Poppins", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--accent)" } }, "stark")),
    h("div", { style: { display: "grid", gap: 13 } },
      stats.map(([label, to, suf]) => h("div", { key: label },
        h("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 } }, h("span", { style: { color: "var(--ink-dim)" } }, label), h("span", { style: { fontFamily: "Poppins", fontWeight: 700, color: "var(--ink)" } }, h(CountUp, { to, suffix: suf }))),
        h("div", { style: { height: 5, borderRadius: 9, background: "rgba(140,190,230,.16)", overflow: "hidden" } }, h("div", { style: { height: "100%", width: label === "Interaktion" ? "62%" : label === "Profilaufrufe" ? "48%" : "82%", background: "var(--accent)", borderRadius: 9 } }))))));
}
function LandingVisual() {
  return h("div", { style: gp },
    h("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "0 0 13px", borderBottom: "1px solid var(--line)", marginBottom: 16 } },
      h("span", { style: { display: "flex", gap: 6 } }, h("span", { style: { width: 9, height: 9, borderRadius: "50%", background: "var(--accent)" } }), h("span", { style: { width: 9, height: 9, borderRadius: "50%", background: "var(--line-strong)" } }), h("span", { style: { width: 9, height: 9, borderRadius: "50%", background: "var(--line-strong)" } })),
      h("span", { style: monoLbl }, "Persona · CMO Mittelstand")),
    h(MiniConsole, { text: "Endlich Marketing, das Ihre Quartalszahlen kennt.\n\nEine Landingpage, die genau Ihre Entscheider abholt — vom ersten Klick bis zur Demo." }));
}
function SocialVisual() {
  return h("div", { style: gp },
    h("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "0 0 13px", borderBottom: "1px solid var(--line)", marginBottom: 16 } },
      h("span", { style: { color: "var(--accent)", fontFamily: "Poppins", fontWeight: 700, fontSize: 16 } }, "@"),
      h("span", { style: monoLbl }, "Social · Auto-Draft")),
    h(MiniConsole, { text: "„Wir posten viel — aber wirkt das überhaupt?\u201c\n\nDrei Dinge, die wir ab sofort anders machen 👇" }),
    h("div", { style: { display: "flex", gap: 8, alignItems: "center", marginTop: 18, flexWrap: "wrap" } },
      ["Idee", "Entwurf", "Freigabe", "Post"].map((s, i) => h(React.Fragment, { key: s },
        h("span", { style: { fontFamily: "Poppins", fontWeight: 600, fontSize: 12.5, padding: "6px 12px", borderRadius: 999, color: i === 3 ? "var(--cta-ink, #fff)" : "var(--ink-dim)", background: i === 3 ? "var(--accent)" : "rgba(140,190,230,.05)", boxShadow: "inset 0 0 0 1px " + (i === 3 ? "var(--accent)" : "var(--line-strong)") } }, s),
        i < 3 && h("span", { style: { color: "var(--accent)", display: "inline-flex" } }, h(Icon, { name: "arrow", size: 14 }))))));
}

const CHAPTERS = [
  { img: "assets/leistungen/audit.png", num: "// 01", eyebrow: "KI-Werkstatt-Audit", visual: AuditVisual,
    title: "Wir prüfen Unternehmen und Marketing auf Herz und Nieren.",
    sub: "Ein ehrlicher Diagnose-Scan über Ihr gesamtes Marketing — datenbasiert und ohne Schönfärberei.",
    result: "Ergebnis: ein klarer Maßnahmenplan, wo KI sofort wirkt.", cta: "Audit anfragen" },
  { img: "assets/leistungen/geo.png", num: "// 02", eyebrow: "GEO-Check", visual: GeoVisual,
    title: "Wirst du von KI-Antworten zitiert?",
    sub: "Generative Suche entscheidet, wer genannt wird. Wir prüfen, ob Ihre Marke in KI-Antworten auftaucht — und wie Sie dort hinkommen.",
    result: "Ergebnis: Ihre Sichtbarkeit in der KI-Suche, schwarz auf weiß.", cta: "GEO-Check starten" },
  { img: "assets/leistungen/linkedin.png", num: "// 03", eyebrow: "LinkedIn-Check", visual: LinkedInVisual,
    title: "Wie stark ist dein LinkedIn-Auftritt?",
    sub: "Ihr lautester B2B-Kanal im Quick-Check: Positionierung, Reichweite und die Hebel, die wirklich Wirkung bringen.",
    result: "Ergebnis: konkrete Stellschrauben für mehr Reichweite.", cta: "LinkedIn prüfen lassen" },
  { img: "assets/leistungen/landingpage.png", num: "// 04", eyebrow: "KI-Landingpages", visual: LandingVisual,
    title: "Landingpages auf Personas zugeschnitten — live in 5 Tagen.",
    sub: "Jede Zielgruppe bekommt ihre eigene Seite. Die KI textet, gestaltet und optimiert — Sie gehen in Tagen live, nicht in Monaten.",
    result: "Ergebnis: persona-genaue Seiten in Tagen statt Monaten.", cta: "Landingpage starten" },
  { img: "assets/leistungen/social.png", num: "// 05", eyebrow: "Social-Media-Automatisierung", visual: SocialVisual,
    title: "Social-Content automatisiert — von der Idee zum Post.",
    sub: "Aus einem Impuls wird ein fertiger Beitrag: getextet, gestaltet, eingeplant. Ihr Kanal läuft, ohne Sie auszubremsen.",
    result: "Ergebnis: ein Kanal, der läuft, ohne Sie auszubremsen.", cta: "Social automatisieren" }];

const PERSONA_TXT = "Endlich Marketing, das Ihre Quartalszahlen kennt.\n\nEine Landingpage, die genau Ihre Entscheider abholt — vom ersten Klick bis zur gebuchten Demo.";
const SOCIAL_TXT = "„Wir posten viel — aber wirkt das überhaupt?\u201c\n\nDrei Dinge, die wir ab sofort anders machen 👇";

function ChapterContent({ d, onBook }) {
  return h(React.Fragment, null,
    h("img", { "data-inflow": "true", src: d.img, alt: "", className: "prozess-float", style: { width: "clamp(66px,6.5vw,90px)", height: "auto", display: "block", marginBottom: 14, filter: "drop-shadow(0 12px 26px color-mix(in srgb,var(--accent) 40%, transparent))" } }),
    h(Eyebrow, { num: d.num }, d.eyebrow),
    h("h2", { style: { fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(28px,3.6vw,48px)", lineHeight: 1.05, letterSpacing: "-.01em", textWrap: "balance" } }, d.title),
    h("p", { className: "lead", style: { fontSize: "clamp(16px,1.8vw,20px)", marginTop: 16, maxWidth: 480 } }, d.sub),
    h("div", { style: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 24 } },
      h("button", { className: "btn btn-cta", onClick: onBook }, d.cta, " ", h(Icon, { name: "arrow", size: 16 })),
      h("span", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: "clamp(15px,1.7vw,18px)", color: "var(--accent)" } }, d.result)));
}

function LeistungChapter({ d, flip, onBook }) {
  const stageRef = useRef(null), iconRef = useRef(null), lightRef = useRef(null), flashRef = useRef(null), contentRef = useRef(null), titleRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [rev, setRev] = useState(false);
  const Vis = d.visual;
  useEffect(() => {
    const compute = () => {
      const wide = window.matchMedia("(min-width: 901px)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      setEnabled(wide && !coarse && !PRM() && !!(window.gsap && window.ScrollTrigger));
    };
    compute(); window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  useEffect(() => {
    if (!enabled) return;
    const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    const stage = stageRef.current; if (!stage || !gsap || !ScrollTrigger) return;
    if (d.video && iconRef.current && iconRef.current.play) { try { const pr = iconRef.current.play(); if (pr && pr.then) pr.then(function () { try { iconRef.current.pause(); } catch (e) {} }).catch(function () {}); else iconRef.current.pause(); } catch (e) {} }
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let revLocal = false;
    const paint = p => {
      const e = clamp(p / 0.35, 0, 1);
      const dk = clamp((p - 0.35) / 0.20, 0, 1);
      const c = clamp((p - 0.55) / 0.40, 0, 1);
      let scale, dx = 0, dy = 0;
      if (e < 1) {
        scale = 0.14 + 0.86 * easeOut(e);
      } else {
        const k = easeIO(dk);
        let tgtScale = 0.12, tdx = 0, tdy = 0;
        const inflow = stage.querySelector("[data-inflow]");
        const baseW = iconRef.current ? iconRef.current.offsetWidth : 0;
        if (inflow && baseW) {
          const ir = inflow.getBoundingClientRect(), srt = stage.getBoundingClientRect();
          tdx = ir.left + ir.width / 2 - (srt.left + srt.width / 2);
          tdy = ir.top + ir.height / 2 - (srt.top + srt.height / 2);
          tgtScale = ir.width / baseW;
        }
        scale = 1 + (tgtScale - 1) * k;
        dx = tdx * k; dy = tdy * k;
      }
      if (iconRef.current) {
        iconRef.current.style.opacity = (clamp(e / 0.1, 0, 1) * (1 - c)).toFixed(3);
        iconRef.current.style.transform = "translate(calc(-50% + " + dx.toFixed(1) + "px), calc(-50% + " + dy.toFixed(1) + "px)) scale(" + scale.toFixed(3) + ")";
        if (d.video && iconRef.current.duration) { const tt = clamp(p / 0.85, 0, 1) * (iconRef.current.duration - 0.05); if (Math.abs((iconRef.current.currentTime || 0) - tt) > 0.03) { try { iconRef.current.currentTime = tt; } catch (e) {} } }
      }
      if (titleRef.current) {
        const tv = clamp((e - 0.45) / 0.55, 0, 1) * (1 - dk) * (1 - c);
        titleRef.current.style.opacity = tv.toFixed(3);
        titleRef.current.style.transform = "translate(-50%, " + (26 + (1 - clamp(e, 0, 1)) * 6).toFixed(1) + "vh)";
      }
      if (lightRef.current) {
        const lp = (1 - clamp(e / 0.5, 0, 1)) * (0.5 + 0.5 * clamp(e / 0.12, 0, 1));
        lightRef.current.style.opacity = lp.toFixed(3);
      }
      if (flashRef.current) {
        const f = Math.sin(clamp(e, 0, 1) * Math.PI);
        flashRef.current.style.opacity = (f * 0.8).toFixed(3);
        flashRef.current.style.transform = "translate(-50%,-50%) scale(" + (0.55 + 1.1 * e).toFixed(3) + ")";
      }
      if (contentRef.current) {
        contentRef.current.style.opacity = c.toFixed(3);
        contentRef.current.style.transform = "translateY(" + ((1 - c) * 24).toFixed(1) + "px)";
        contentRef.current.style.pointerEvents = c > 0.6 ? "auto" : "none";
      }
      const want = p > 0.55;
      if (want !== revLocal) { revLocal = want; setRev(want); }
    };
    let maxP = 0;
    const st = ScrollTrigger.create({
      trigger: stage, start: "top top",
      end: () => "+=" + window.innerHeight * (d.video ? 4.2 : 1.35),
      pin: true, pinSpacing: true,
      onUpdate: self => { const p = self.progress; if (p > maxP) maxP = p; paint(maxP >= 0.95 ? 1 : maxP); } });
    paint(0);
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 450); window.addEventListener("load", refresh);
    return () => { clearTimeout(t); window.removeEventListener("load", refresh); st.kill(); ScrollTrigger.refresh(); };
  }, [enabled]);

  if (!enabled) {
    return h("section", { id: "leistung-" + d.num.replace("// ", ""), className: "sec-pad grid-bg", style: { borderTop: "1px solid var(--line)" } },
      h("div", { className: "wrap", style: { display: "flex", flexWrap: "wrap", gap: "clamp(28px,4vw,64px)", alignItems: "center", flexDirection: flip ? "row-reverse" : "row" } },
        h("div", { style: { flex: "1 1 360px", maxWidth: 520 } },
          h(ChapterContent, { d, onBook })),
        h("div", { style: { flex: "1 1 400px", maxWidth: 540, width: "100%" } }, h(Vis, null))));
  }

  return h("section", { id: "leistung-" + d.num.replace("// ", ""), className: "grid-bg", style: { borderTop: "1px solid var(--line)" } },
    h("div", { ref: stageRef, style: { position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center" } },
      h("div", { ref: lightRef, "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "60vmin", height: "60vmin", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle, #fff 0%, rgba(255,255,255,.7) 18%, transparent 60%)", filter: "blur(8px)", opacity: 0, zIndex: 1, pointerEvents: "none" } }),
      h("div", { ref: flashRef, "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", width: "72vmin", height: "72vmin", transform: "translate(-50%,-50%)", borderRadius: "50%", opacity: 0, zIndex: 2, pointerEvents: "none", mixBlendMode: "screen", background: "conic-gradient(from 0deg, transparent, color-mix(in srgb,var(--accent) 55%, transparent), #fff, color-mix(in srgb,var(--accent) 55%, transparent), transparent)", filter: "blur(14px)" } }),
      d.video ? h("video", { ref: iconRef, src: d.video, muted: true, playsInline: true, preload: "metadata", "aria-label": d.eyebrow, style: { position: "absolute", left: "50%", top: "50%", width: "min(72vh,66vw)", height: "auto", transformOrigin: "center", transform: "translate(-50%,-50%) scale(0.14)", opacity: 0, zIndex: 4, pointerEvents: "none", filter: "brightness(1.42) contrast(1.12) saturate(1.2) drop-shadow(0 24px 50px color-mix(in srgb,var(--accent) 28%, transparent))", willChange: "transform, opacity", WebkitMaskImage: "radial-gradient(ellipse 82% 82% at 50% 50%, #000 64%, rgba(0,0,0,0) 94%)", maskImage: "radial-gradient(ellipse 82% 82% at 50% 50%, #000 64%, rgba(0,0,0,0) 94%)" } }) : h("img", { ref: iconRef, src: d.img, alt: d.eyebrow, style: { position: "absolute", left: "50%", top: "50%", width: "min(72vh,66vw)", height: "auto", transformOrigin: "center", transform: "translate(-50%,-50%) scale(0.14)", opacity: 0, zIndex: 4, pointerEvents: "none", filter: "drop-shadow(0 30px 60px color-mix(in srgb,var(--accent) 36%, transparent))", willChange: "transform, opacity" } }),
      h("div", { ref: titleRef, "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", zIndex: 5, transform: "translate(-50%, 32vh)", textAlign: "center", opacity: 0, pointerEvents: "none", willChange: "opacity, transform" } },
        h("div", { style: { fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: "clamp(13px,1.4vw,17px)", letterSpacing: ".02em", color: "var(--muted)", marginBottom: 6 } }, d.num.replace("// ", "")),
        h("div", { style: { fontFamily: "Poppins", fontWeight: 700, fontSize: "clamp(26px,3.6vw,52px)", letterSpacing: "-.015em", color: "var(--ink)", lineHeight: 1.04 } },
          (function(){ var t = d.eyebrow, i = Math.max(t.lastIndexOf("-"), t.lastIndexOf(" ")); var a = i > 0 ? t.slice(0, i + 1) : t, b = i > 0 ? t.slice(i + 1) : ""; return b ? [a, h("span", { key: "r", style: { color: "var(--accent)" } }, b)] : t; })())),
      rev && h("span", { className: "scan-reveal-line play", key: "line-" + d.num, "aria-hidden": "true" }),
      h("div", { className: "wrap", style: { position: "relative", zIndex: 3, width: "100%" } },
        h("div", { ref: contentRef, style: { opacity: 0, width: "100%", willChange: "opacity, transform" } },
          h("div", { style: { display: "flex", flexWrap: "wrap", gap: "clamp(28px,4vw,64px)", alignItems: "center", flexDirection: flip ? "row-reverse" : "row" } },
            h("div", { style: { flex: "1 1 360px", maxWidth: 520 } }, h(ChapterContent, { d, onBook })),
            h("div", { style: { flex: "1 1 400px", maxWidth: 540, width: "100%" } }, rev && h(Vis, null)))))));
}

/* Statischer Leistungs-Index („Was wir tun") für die Leistungen-Unterseite.
   Nutzt dieselben CHAPTERS-Daten; Zeilen springen zum jeweiligen Kapitel. */
function LeistungsIndex() {
  return h("section", { className: "sec-pad grid-bg", style: { borderTop: "1px solid var(--line)" } },
    h("div", { className: "wrap", style: { maxWidth: 980, margin: "0 auto" } },
      h("div", { style: { display: "flex", justifyContent: "flex-start" } }, h(Eyebrow, { num: "// Leistungen" }, "Was wir tun")),
      h("h2", { style: { fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", textWrap: "balance", letterSpacing: "-.01em", maxWidth: 760, marginTop: 10, marginBottom: "clamp(20px,3vw,36px)" } }, "F\u00fcnf Hebel, ein Ziel: ", h("span", { style: { color: "var(--accent)" } }, "sichtbares Marketing.")),
      h("div", null, CHAPTERS.map((d) => { const cid = "leistung-" + d.num.replace("// ", ""); return h("a", { key: d.num, href: "#" + cid, onClick: e => { e.preventDefault(); scrollToId(cid); }, className: "lidx-row", style: { cursor: "pointer" } },
        h("span", { className: "lidx-num" }, d.num.replace("// ", "")),
        h("span", { className: "lidx-name", style: { display: "flex", alignItems: "center", gap: "clamp(12px,1.4vw,18px)" } },
          h("img", { src: d.img, alt: "", "aria-hidden": "true", style: { width: "clamp(40px,3.6vw,56px)", height: "auto", flex: "none", filter: "drop-shadow(0 6px 16px color-mix(in srgb,var(--accent) 34%, transparent))" } }),
          d.eyebrow),
        h("span", { className: "lidx-go" }, h(Icon, { name: "arrow", size: 20 }))); }))));
}

let __lidxShown = false;
function LeistungenSection({ onBook }) {
  return h(React.Fragment, null,
    h("div", { id: "leistungen" }),
    CHAPTERS.map((d, i) => h(LeistungChapter, { key: d.num, d, flip: i % 2 === 1, onBook })));
}

function PaketIcon({ kind }) {
  const c = { width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
  if (kind === "crane") return h("svg", c, h("path", { d: "M6 21V5M6 5h13M6 5 4 9h4z" }), h("path", { d: "M18 5v5" }), h("path", { d: "M16.7 10h2.6l-1.3 2.2z" }));
  if (kind === "lupe") return h("svg", c, h("circle", { cx: "10.5", cy: "10.5", r: "6" }), h("path", { d: "M14.8 14.8 20 20" }));
  return h("svg", Object.assign({}, c, { fill: "currentColor", stroke: "none" }), h("path", { d: "M9 7.2v9.6l8-4.8z" }));
}

function PaketCard({ kind, title, body, points, cta, onBook }) {
  const cardRef = useRef(null), glowRef = useRef(null), iconRef = useRef(null);
  const reduce = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onMove = e => {
    const el = cardRef.current; if (!el || reduce()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * 8, ry = (px - 0.5) * 10;
    el.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
    if (glowRef.current) glowRef.current.style.background = "radial-gradient(240px circle at " + (px * 100).toFixed(1) + "% " + (py * 100).toFixed(1) + "%, color-mix(in srgb,var(--accent) 20%, transparent), transparent 62%)";
    if (iconRef.current) iconRef.current.style.transform = "translateX(-50%) translateY(-50%) translateZ(42px) rotateX(" + (-rx).toFixed(2) + "deg) rotateY(" + (-ry).toFixed(2) + "deg)";
  };
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
    if (glowRef.current) glowRef.current.style.background = "transparent";
    if (iconRef.current) iconRef.current.style.transform = "translateX(-50%) translateY(-50%)";
  };
  return h("div", { style: { position: "relative", paddingTop: 40, height: "100%" } },
    h("div", { ref: iconRef, style: { position: "absolute", left: "50%", top: 0, transform: "translateX(-50%) translateY(-50%)", zIndex: 3, width: 76, height: 76, borderRadius: "50%", display: "grid", placeItems: "center", color: "var(--accent)", background: "linear-gradient(160deg, rgba(255,255,255,.92), rgba(255,255,255,.55))", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 18px 40px rgba(20,40,70,.20), 0 0 0 6px color-mix(in srgb,var(--accent) 7%, transparent)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", transition: "transform .3s cubic-bezier(.2,.8,.2,1)" } }, h(PaketIcon, { kind })),
    h("div", { ref: cardRef, onMouseMove: onMove, onMouseLeave: onLeave, style: { position: "relative", overflow: "hidden", borderRadius: 7, padding: "56px 28px 30px", background: "var(--glass)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 24px 60px rgba(20,40,70,.10)", transformStyle: "preserve-3d", transition: "transform .45s cubic-bezier(.2,.8,.2,1), box-shadow .4s", height: "100%", display: "flex", flexDirection: "column", textAlign: "center" } },
      h("div", { ref: glowRef, "aria-hidden": "true", style: { position: "absolute", inset: 0, pointerEvents: "none", background: "transparent", transition: "background .25s" } }),
      h("h3", { style: { fontSize: 22, marginBottom: 10 } }, title),
      h("p", { style: { color: "var(--ink-dim)", fontSize: 14.5, lineHeight: 1.55, margin: "0 auto", maxWidth: 286 } }, body),
      h("ul", { style: { listStyle: "none", padding: 0, margin: "20px 0 26px", display: "grid", gap: 10, textAlign: "left" } },
        points.map(p => h("li", { key: p, style: { display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--ink)" } }, h("span", { style: { color: "var(--accent)", flex: "none", display: "inline-flex" } }, h(Icon, { name: "check", size: 15, stroke: 2.4 })), p))),
      h("button", { className: "btn btn-cta", style: { marginTop: "auto", width: "100%" }, onClick: onBook }, cta, " ", h(Icon, { name: "arrow", size: 15 }))));
}

function DreiPaketeSection({ onBook }) {
  return h("section", { id: "pakete", className: "sec-pad grid-bg" },
    h("div", { className: "wrap", style: { position: "relative", zIndex: 1 } },
      h(Reveal, { style: { textAlign: "center", marginBottom: 64, maxWidth: 760, marginLeft: "auto", marginRight: "auto" } },
        h("div", { style: { display: "flex", justifyContent: "center" } }, h(Eyebrow, { num: "// 04" }, "Pakete")),
        h("h2", { style: { fontSize: "clamp(30px,4.4vw,52px)", textWrap: "balance" } }, "Klar geschnürt. ", h("span", { style: { color: "var(--accent)" } }, "Sofort startklar."))),
      h("div", { className: "capgrid", style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 } },
        h(Reveal, null, h(PaketCard, { kind: "crane", title: "Persona-Landingpage", cta: "Mit der Landingpage starten", onBook, body: "Eine zielgruppengenaue Landingpage — mit KI von Briefing bis Go-Live.", points: ["In 5 Tagen live", "KI-getextet & gestaltet", "Conversion-optimiert"] })),
        h(Reveal, { delay: 90 }, h(PaketCard, { kind: "lupe", title: "SEO-Package", cta: "Jetzt Wettbewerber überholen", onBook, body: "Damit Sie gefunden werden, wo Ihre Kunden suchen — und wo KI-Suche antwortet.", points: ["Technik, Content & Struktur", "Sichtbar in der KI-Suche", "Mehr organische Reichweite"] })),
        h(Reveal, { delay: 180 }, h(PaketCard, { kind: "play", title: "LinkedIn Creator Package", cta: "LinkedIn sichtbar machen", onBook, body: "Content, der Ihre Expertise sichtbar macht und kontinuierlich Reichweite aufbaut.", points: ["Vom Profil bis zum Redaktionsplan", "Content mit System", "Kontinuierliche Reichweite"] })))));
}

function CountUp({ to, prefix = "", suffix = "", dur = 1500 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.textContent = prefix + "0" + suffix;
    if (reduce) { el.textContent = prefix + to.toLocaleString("de-DE") + suffix; return; }
    let raf = 0, startT = 0, cancelled = false, ran = false;
    const run = now => {
      if (cancelled) return;
      if (!startT) startT = now;
      const p = Math.min(1, (now - startT) / dur);
      el.textContent = prefix + Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString("de-DE") + suffix;
      if (p >= 1) { raf = 0; return; }
      raf = requestAnimationFrame(run);
    };
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting && !ran) { ran = true; raf = requestAnimationFrame(run); } });
    }, { threshold: 0.15 });
    io.observe(el);
    // Sicherheitsnetz: falls der Observer nicht greift, sp\u00e4testens nach kurzer Zeit z\u00e4hlen
    const fallbackId = setTimeout(() => { if (!ran) { ran = true; raf = requestAnimationFrame(run); } }, 1200);
    return () => { cancelled = true; if (raf) cancelAnimationFrame(raf); clearTimeout(fallbackId); io.disconnect(); };
  }, []);
  return h("span", { ref }, prefix + "0" + suffix);
}

function ProzessToken({ form }) {
  const stage = { position: "relative", width: "clamp(208px,30vmin,300px)", height: "clamp(208px,30vmin,300px)", flex: "none" };
  const glass = { position: "absolute", inset: 0, borderRadius: "clamp(18px,3.4vmin,30px)", background: "linear-gradient(150deg, var(--glass), color-mix(in srgb,var(--glass) 40%, transparent))", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 28px 70px rgba(0,0,0,.16)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflow: "hidden" };
  const center = { position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--accent)" };
  if (form === "analyse") {
    return h("div", { className: "prozess-float", style: stage },
      h("div", { style: glass },
        h("div", { "aria-hidden": "true", style: { position: "absolute", left: "22%", top: "26%", width: "56%", height: "56%", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, color-mix(in srgb,var(--accent) 60%, transparent), transparent 70%)", filter: "blur(17px)", opacity: 0.7 } }),
        h("div", { "aria-hidden": "true", style: { position: "absolute", inset: 0, backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" } })),
      h("div", { style: center }, h(Icon, { name: "scan", size: 64, stroke: 1.3 })));
  }
  if (form === "strategie") {
    return h("div", { className: "prozess-float", style: stage },
      h("div", { style: Object.assign({}, glass, { boxShadow: "inset 0 0 0 1.5px color-mix(in srgb,var(--accent) 45%, var(--glass-line)), 0 28px 70px rgba(0,0,0,.16)" }) },
        h("div", { "aria-hidden": "true", style: { position: "absolute", inset: "16%", backgroundImage: "linear-gradient(var(--line-strong) 1px, transparent 1px), linear-gradient(90deg, var(--line-strong) 1px, transparent 1px)", backgroundSize: "calc(100%/4) calc(100%/4)", opacity: 0.6 } }),
        h("div", { "aria-hidden": "true", style: { position: "absolute", inset: "16%", boxShadow: "inset 0 0 0 1px color-mix(in srgb,var(--accent) 35%, transparent)" } })),
      h("div", { style: center }, h(Icon, { name: "target", size: 62, stroke: 1.4 })));
  }
  if (form === "umsetzung") {
    const card = i => ({ position: "absolute", left: "50%", top: "50%", width: "62%", height: "30%", borderRadius: "clamp(8px,1.6vmin,14px)", background: "linear-gradient(150deg, color-mix(in srgb,var(--accent) 14%, var(--glass)), var(--glass))", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 10px 24px rgba(0,0,0,.16)", transform: "translate(-50%,-50%) translateY(" + (i * 26 - 26) + "px) rotate(" + (i - 1) * 1.5 + "deg)" });
    return h("div", { className: "prozess-float", style: stage },
      h("div", { style: glass }),
      h("div", { style: card(2), "aria-hidden": "true" }),
      h("div", { style: card(1), "aria-hidden": "true" }),
      h("div", { style: Object.assign(card(0), { display: "grid", placeItems: "center", color: "var(--accent)" }) }, h(Icon, { name: "bolt", size: 28 })),
      h("div", { style: { position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%) rotate(-90deg)", color: "var(--accent)", opacity: 0.85 } }, h(Icon, { name: "arrow", size: 26 })));
  }
  return h("div", { className: "prozess-float", style: stage },
    h("div", { style: Object.assign({}, glass, { background: "linear-gradient(150deg, color-mix(in srgb,var(--accent) 24%, var(--glass)), color-mix(in srgb,var(--accent) 8%, var(--glass)))", boxShadow: "inset 0 0 0 1px color-mix(in srgb,var(--accent) 40%, var(--glass-line)), 0 28px 80px color-mix(in srgb,var(--accent) 22%, transparent)" }) },
      h("span", { className: "prozess-gloss", "aria-hidden": "true", style: { position: "absolute", top: "-30%", left: 0, width: "40%", height: "160%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent)" } })),
    h("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 } },
      h("span", { style: { color: "var(--accent)", transform: "rotate(-90deg)" } }, h(Icon, { name: "arrow", size: 30, stroke: 2.2 })),
      h("span", { className: "display", style: { fontSize: "clamp(34px,5vw,52px)", color: "var(--accent)", lineHeight: 1 } }, h(CountUp, { to: 38, prefix: "+", suffix: "%" })),
      h("span", { style: { fontFamily: "Poppins", fontWeight: 500, fontSize: 13, letterSpacing: ".04em", color: "var(--ink-dim)" } }, "Conversion")));
}

function ProzessStation({ num, label, title, body, form }) {
  const sr = useScanReveal(2200);
  return h("section", { className: "grid-bg", style: { position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", borderTop: "1px solid var(--line)" }, ref: sr.ref },
    sr.playing && h("span", { className: "scan-reveal-line play", key: sr.run, "aria-hidden": "true" }),
    h("div", { className: "wrap", style: { position: "relative", zIndex: 1, width: "100%" } },
      h("div", { className: "scan-reveal-content" + (sr.playing ? " play" : ""), key: sr.run, style: { "--scan-dur": "2200ms", opacity: sr.reduce ? 1 : sr.run > 0 ? undefined : 0 } },
        h("div", { className: "prozess-grid", style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: "clamp(28px,5vw,72px)", alignItems: "center", justifyItems: "center" } },
          h(ProzessToken, { form }),
          h("div", { style: { maxWidth: 440 } },
            h(Eyebrow, { num }, label),
            h("h2", { style: { fontSize: "clamp(30px,4.2vw,52px)", textWrap: "balance", lineHeight: 1.05, marginTop: 6 } }, title),
            h("p", { className: "lead", style: { fontSize: "clamp(17px,1.9vw,21px)", marginTop: 16 } }, body))))));
}

function SoArbeitenWir() {
  return h(HorizontalScroll, { labels: ["Analyse", "Strategie", "Umsetzung", "Optimierung"], hid: "prozess", gkey: "__hscrollProc" },
    h(ProzessStation, { num: "// 01", label: "Analyse", form: "analyse", title: "Erst verstehen, dann handeln.", body: "Wir prüfen Sichtbarkeit, Kanäle und Potenziale — datenbasiert und ohne Schönfärberei." }),
    h(ProzessStation, { num: "// 02", label: "Strategie", form: "strategie", title: "Ein klarer 360°-Plan.", body: "Aus den Erkenntnissen werden Prioritäten, Kanäle und Botschaften — scharf umrissen." }),
    h(ProzessStation, { num: "// 03", label: "Umsetzung", form: "umsetzung", title: "Aus Plan wird Asset.", body: "Content, Kampagnen und Automatisierungen — mit KI schneller produziert und ausgespielt." }),
    h(ProzessStation, { num: "// 04", label: "Optimierung", form: "optimierung", title: "Messen. Lernen. Steigern.", body: "Wir justieren laufend nach — Marketing, das mit jeder Woche messbar besser wird." }));
}

function MtCell({ value, unit }) {
  return h("div", { className: "mt-module" }, h("div", { className: "mt-num" }, value), h("div", { className: "mt-unit" }, unit));
}
function VertrauenSection({ onBook }) {
  const sr = useScanReveal(2200);
  return h("section", { id: "team", className: "grid-bg", style: { position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden", padding: "clamp(90px,12vw,160px) 0" }, ref: sr.ref },
    h(ScanFrame, null),
    sr.playing && h("span", { className: "scan-reveal-line play", key: sr.run, "aria-hidden": "true" }),
    h("div", { className: "wrap", style: { position: "relative", zIndex: 2, textAlign: "center", maxWidth: 920, marginLeft: "auto", marginRight: "auto" } },
      h("div", { className: "scan-reveal-content" + (sr.playing ? " play" : ""), key: sr.run, style: { "--scan-dur": "2200ms", opacity: sr.reduce ? 1 : sr.run > 0 ? undefined : 0 } },
        h("div", { style: { display: "flex", justifyContent: "center" } }, h(Eyebrow, { num: "// 06" }, "Team & Erfahrung")),
        h("h2", { style: { fontSize: "clamp(32px,5vw,60px)", lineHeight: 1.04, marginBottom: 42, textWrap: "balance" } }, "Erfahrung, die ", h("span", { style: { color: "var(--accent)" } }, "Zukunft möglich macht.")),
        h("div", { className: "mt-modules mt-band-light", style: { marginBottom: 46 } },
          h(MtCell, { value: h(CountUp, { to: 33 }), unit: "Jahre B2B" }),
          h(MtCell, { value: h("span", { className: "mt-flip", style: { display: "inline-block" } }, "360°"), unit: "alle Kanäle" }),
          h(MtCell, { value: h(CountUp, { to: 5 }), unit: "Tage bis live" }),
          h("div", { className: "mt-module", style: { display: "grid", placeItems: "center", minWidth: 92 } },
            h("span", { style: { color: "var(--accent)", display: "inline-flex", transform: "rotate(-90deg)" } }, h(Icon, { name: "arrow", size: 34, stroke: 2.2 })),
            h("div", { className: "mt-unit", style: { marginTop: 11 } }, "Wachstum"))),
        h("div", { style: { fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(24px,3.4vw,42px)", lineHeight: 1.1, letterSpacing: "-.01em", textWrap: "balance", maxWidth: 760, margin: "0 auto 34px" } }, "Innovation braucht Mut. ", h("span", { style: { color: "var(--accent)" } }, "Wir bringen ihn mit.")),
        h("div", { style: { display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" } },
          h("button", { className: "btn btn-cta", onClick: onBook }, "Termin vereinbaren ", h(Icon, { name: "arrow", size: 16 })),
          h("a", { className: "btn btn-ghost", href: "https://team-mt.de", target: "_blank", rel: "noopener noreferrer" }, "team-mt.de")))));
}

const tmtInp = { background: "rgba(140,190,230,.05)", border: "1px solid var(--line-strong)", borderRadius: 2, padding: "12px 14px", color: "var(--ink)", fontFamily: "Poppins", fontSize: 14, outline: "none", minWidth: 0, maxWidth: "100%" };
const BOOK_TIMES = ["09:00", "09:30", "10:00", "10:30", "15:00", "15:30"];
const BOOK_CAP = 1;
const DOW = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MON = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
function nextBusinessDays(n) {
  const out = [], base = new Date(); base.setHours(0, 0, 0, 0);
  let i = 0;
  while (out.length < n && i < 60) {
    i++; const x = new Date(base); x.setDate(base.getDate() + i);
    const wd = x.getDay(); if (wd !== 2 && wd !== 3 && wd !== 4) continue;
    const iso = x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
    out.push({ iso, dow: DOW[wd], dom: x.getDate(), mon: MON[x.getMonth()] });
  }
  return out;
}
function ErstgesprachBooking() {
  const dates = React.useMemo(() => nextBusinessDays(8), []);
  const live = !!(window.KIWBooking && window.KIWBooking.configured && window.KIWBooking.configured());
  const [selDate, setSelDate] = useState(dates[0] ? dates[0].iso : null);
  const [selTime, setSelTime] = useState(null);
  const [avail, setAvail] = useState(null);
  const [taken, setTaken] = useState({});
  const [form, setForm] = useState({ name: "", email: "", company: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const refreshAvail = React.useCallback(() => {
    if (!live) return;
    (async () => {
      try {
        const rows = await window.KIWBooking.loadAvailability(selDate);
        setAvail((rows || []).reduce((m, r) => { m[r.label] = r; return m; }, {}));
      } catch (e) { setError("Verfügbarkeit konnte nicht geladen werden. Bitte Seite neu laden."); }
    })();
  }, [selDate, live]);
  useEffect(() => {
    let on = true;
    if (!live) return;
    setAvail(null);
    (async () => {
      try {
        const rows = await window.KIWBooking.loadAvailability(selDate);
        if (on) setAvail((rows || []).reduce((m, r) => { m[r.label] = r; return m; }, {}));
      } catch (e) { if (on) setError("Verfügbarkeit konnte nicht geladen werden. Bitte Seite neu laden."); }
    })();
    return () => { on = false; };
  }, [selDate, live]);
  const slotRow = t => live && avail ? avail[t] || null : null;
  const remaining = t => {
    if (!live) return BOOK_CAP - (taken[selDate + "|" + t] || 0);
    if (!avail) return null;
    const r = avail[t];
    if (!r) return 0;
    if (r.is_available === false) return 0;
    return r.remaining != null ? r.remaining : 0;
  };
  const valid = selDate && selTime && form.name.trim() && /\S+@\S+\.\S+/.test(form.email);
  const selLabel = () => { const d = dates.find(x => x.iso === selDate); return d ? d.dow + " " + d.dom + ". " + d.mon : ""; };
  async function submit() {
    if (!valid || submitting) return;
    setError(null); setSubmitting(true);
    try {
      if (live) {
        const row = avail && avail[selTime];
        if (!row || row.slot_id == null) { setError("Dieser Termin ist nicht mehr verfügbar."); setSelTime(null); return; }
        const r = await window.KIWBooking.bookSlot(selDate, row.slot_id, form.name.trim(), form.email.trim(), form.company.trim(), form.note.trim());
        if (r === "ok") { setDone(true); refreshAvail(); }
        else if (r === "full") { setError("Dieser Termin ist gerade belegt. Bitte wählen Sie einen anderen."); setSelTime(null); refreshAvail(); }
        else setError("Dieser Termin ist nicht mehr verfügbar.");
      } else {
        const k = selDate + "|" + selTime;
        if (BOOK_CAP - (taken[k] || 0) <= 0) setError("Belegt — bitte anderen Termin wählen.");
        else { setTaken(m => ({ ...m, [k]: (m[k] || 0) + 1 })); setDone(true); }
      }
    } catch (e) { setError("Buchung fehlgeschlagen. Bitte versuchen Sie es erneut."); }
    finally { setSubmitting(false); }
  }
  const shell = { position: "relative", borderRadius: 7, background: "var(--glass)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 30px 80px rgba(20,40,70,.12)", overflow: "hidden" };
  if (done) {
    return h("div", { style: shell },
      h("div", { style: { textAlign: "center", padding: "58px 26px" } },
        h("div", { style: { width: 62, height: 62, margin: "0 auto 20px", borderRadius: "50%", display: "grid", placeItems: "center", color: "var(--accent)", boxShadow: "inset 0 0 0 1px var(--accent), 0 0 30px color-mix(in srgb,var(--accent) 22%, transparent)" } }, h(Icon, { name: "check", size: 28, stroke: 2.4 })),
        h("h3", { style: { fontSize: 23, marginBottom: 10 } }, "Termin angefragt"),
        h("p", { style: { color: "var(--ink-dim)", fontSize: 15, maxWidth: 360, margin: "0 auto" } }, selLabel() + " · " + selTime + " Uhr — wir bestätigen Ihr Erstgespräch per E-Mail."),
        h("button", { className: "btn btn-ghost", style: { marginTop: 24 }, onClick: () => { setDone(false); setSelTime(null); setForm({ name: "", email: "", company: "", note: "" }); refreshAvail(); } }, "Weiteren Termin wählen")));
  }
  return h("div", { style: shell },
    h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--line)" } },
      h("span", { style: { display: "flex", alignItems: "center", gap: 10, color: "var(--accent)" } }, h(Icon, { name: "cal", size: 18 }), h("span", { style: { fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "var(--ink)" } }, "Erstgespräch · 30 Min")),
      h("span", { style: { fontFamily: "Poppins", fontSize: 11, letterSpacing: ".18em", color: "var(--muted)", textTransform: "uppercase" } }, "kostenlos · remote")),
    h("div", { style: { padding: 22 } },
      h("div", { style: { fontFamily: "Poppins", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 11 } }, "1 · Tag wählen"),
      h("div", { style: { display: "flex", gap: 9, overflowX: "auto", paddingBottom: 6, marginBottom: 20 } },
        dates.map(d => {
          const sel = d.iso === selDate;
          return h("button", { key: d.iso, onClick: () => { setSelDate(d.iso); setSelTime(null); setError(null); }, style: { flex: "none", width: 62, padding: "10px 0", borderRadius: 4, cursor: "pointer", textAlign: "center", background: sel ? "var(--accent)" : "rgba(140,190,230,.05)", color: sel ? "var(--cta-ink, #fff)" : "var(--ink-dim)", border: "1px solid " + (sel ? "var(--accent)" : "var(--line-strong)"), transition: "all .2s" } },
            h("span", { style: { display: "block", fontFamily: "Poppins", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", opacity: .8 } }, d.dow),
            h("span", { style: { display: "block", fontFamily: "Poppins", fontWeight: 700, fontSize: 19, lineHeight: 1.1 } }, d.dom),
            h("span", { style: { display: "block", fontSize: 10.5, opacity: .7 } }, d.mon));
        })),
      h("div", { style: { fontFamily: "Poppins", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 11 } }, "2 · Uhrzeit wählen"),
      h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9, marginBottom: 20 } },
        BOOK_TIMES.map(t => {
          const rem = remaining(t), full = rem != null && rem <= 0, sel = t === selTime;
          return h("button", { key: t, disabled: full, onClick: () => { setSelTime(t); setError(null); }, title: full ? "Belegt" : rem != null ? rem + " frei" : "", style: { padding: "11px 6px", borderRadius: 4, cursor: full ? "not-allowed" : "pointer", fontFamily: "Poppins", fontWeight: 600, fontSize: 14, background: full ? "rgba(140,190,230,.03)" : sel ? "var(--accent)" : "rgba(140,190,230,.05)", color: full ? "var(--muted)" : sel ? "var(--cta-ink, #fff)" : "var(--ink-dim)", border: "1px solid " + (sel ? "var(--accent)" : "var(--line-strong)"), transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 } },
            t,
            full ? h("span", { style: { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase" } }, "belegt") :
              h("span", { style: { display: "flex", gap: 3 }, "aria-hidden": "true" }, Array.from({ length: BOOK_CAP }).map((_, i) => h("span", { key: i, style: { width: 5, height: 5, borderRadius: "50%", background: rem == null || i < rem ? sel ? "var(--cta-ink, #fff)" : "var(--accent)" : "rgba(140,190,230,.3)" } }))));
        })),
      h("div", { style: { display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr", marginBottom: 10 } },
        h("input", { placeholder: "Name", "aria-label": "Name", value: form.name, onChange: e => setForm({ ...form, name: e.target.value }), style: tmtInp }),
        h("input", { placeholder: "Unternehmen", "aria-label": "Unternehmen", value: form.company, onChange: e => setForm({ ...form, company: e.target.value }), style: tmtInp })),
      h("input", { placeholder: "E-Mail", "aria-label": "E-Mail", type: "email", value: form.email, onChange: e => setForm({ ...form, email: e.target.value }), style: { ...tmtInp, width: "100%", marginBottom: 16 } }),
      error && h("div", { role: "alert", style: { display: "flex", gap: 9, alignItems: "flex-start", color: "var(--accent)", fontSize: 13, marginBottom: 14 } }, h(Icon, { name: "cone", size: 15 }), h("span", null, error)),
      h("button", { className: "btn btn-cta", style: { width: "100%", opacity: valid && !submitting ? 1 : .45, pointerEvents: valid && !submitting ? "auto" : "none" }, onClick: submit }, submitting ? "Wird angefragt …" : h(React.Fragment, null, "Termin anfragen ", h(Icon, { name: "arrow", size: 16 }))),
      h("p", { style: { textAlign: "center", color: "var(--muted)", fontSize: 12, marginTop: 14, marginBottom: 0 } }, live ? "Echtzeit-Verfügbarkeit · Bestätigung per E-Mail" : "Wöchentlich wiederkehrende Termine · Bestätigung per E-Mail")));
}
function BookingSection() {
  return h("section", { id: "kontakt", className: "sec-pad" },
    h("div", { className: "wrap bookgrid", style: { display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" } },
      h(Reveal, null,
        h(Eyebrow, { num: "// 07" }, "Erstgespräch"),
        h("h2", { style: { fontSize: "clamp(32px,4.6vw,56px)", marginBottom: 20, textWrap: "balance" } }, "Lernen wir uns ", h("span", { style: { color: "var(--accent)" } }, "kennen.")),
        h("p", { className: "lead", style: { fontSize: 17, marginBottom: 30, maxWidth: 440 } }, "30 Minuten, unverbindlich: Sie schildern Ihre Ziele, wir zeigen den schnellsten Hebel mit KI. Wählen Sie einfach einen Tag und eine Uhrzeit."),
        h("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 } },
          [["target", "360°-Blick über alle Kanäle"], ["bolt", "KI-gestützt, schneller umgesetzt"], ["check", "Messbar statt Bauchgefühl"]].map(([ic, tx]) => h("li", { key: tx, style: { display: "flex", gap: 14, alignItems: "center", color: "var(--ink)", fontSize: 15.5 } },
            h("span", { style: { width: 38, height: 38, flex: "none", borderRadius: 2, display: "grid", placeItems: "center", color: "var(--accent)", boxShadow: "inset 0 0 0 1px var(--line-strong)" } }, h(Icon, { name: ic, size: 18 })), tx)))),
      h(Reveal, { delay: 120 }, h(ErstgesprachBooking, null))));
}
function GumballScrollSection() {
  const wrapRef = useRef(null), vidRef = useRef(null);
  useEffect(() => {
    const wrap = wrapRef.current, v = vidRef.current; if (!wrap || !v) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let dur = 0;
    const onMeta = () => { dur = v.duration || 0; };
    v.addEventListener("loadedmetadata", onMeta); if (v.duration) dur = v.duration;
    try { const pr = v.play(); if (pr && pr.then) pr.then(function () { try { v.pause(); } catch (e) {} }).catch(function () {}); else v.pause(); } catch (e) {}
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const tv = r.height - window.innerHeight;
      const p = tv > 0 ? Math.min(1, Math.max(0, -r.top / tv)) : 0;
      if (dur) { const tt = p * (dur - 0.05); if (Math.abs((v.currentTime || 0) - tt) > 0.02) { try { v.currentTime = tt; } catch (e) {} } }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    if (window.__lenis && window.__lenis.on) window.__lenis.on("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (window.__lenis && window.__lenis.off) window.__lenis.off("scroll", onScroll); v.removeEventListener("loadedmetadata", onMeta); };
  }, []);
  return h("section", { ref: wrapRef, style: { position: "relative", height: "300vh", background: "#fff", borderTop: "1px solid var(--line)" } },
    h("div", { style: { position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#fff" } },
      h("video", { ref: vidRef, src: "assets/leistungen/social.mp4", muted: true, playsInline: true, preload: "metadata", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" } })));
}
function AbschlussCTA({ onBook }) {
  return h("section", { style: { position: "relative", overflow: "hidden", padding: "clamp(96px,14vw,180px) 0", borderTop: "1px solid var(--line)" } },
    h("div", { "aria-hidden": "true", style: { position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" } },
      h("span", { className: "cta-blob cta-blob1", style: { left: "50%", top: "50%", width: "46vmax", height: "46vmax", background: "radial-gradient(circle, color-mix(in srgb,var(--accent) 60%, transparent), transparent 70%)" } }),
      h("span", { className: "cta-blob cta-blob2", style: { left: "50%", top: "50%", width: "38vmax", height: "38vmax", background: "radial-gradient(circle, color-mix(in srgb,var(--accent) 40%, transparent), transparent 70%)" } }),
      h("span", { className: "cta-blob cta-blob3", style: { left: "50%", top: "50%", width: "30vmax", height: "30vmax", background: "radial-gradient(circle, color-mix(in srgb,#2a6fdb 40%, transparent), transparent 70%)" } })),
    h(Reveal, { className: "wrap", style: { position: "relative", zIndex: 1, textAlign: "center", maxWidth: 820, marginLeft: "auto", marginRight: "auto" } },
      h("h2", { style: { fontSize: "clamp(34px,5.4vw,68px)", lineHeight: 1.02, textWrap: "balance", marginBottom: 30 } }, "Bereit für Marketing, ", h("span", { style: { color: "var(--accent)" } }, "das mehr kann?")),
      h("div", { style: { display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" } },
        h("button", { className: "btn btn-cta", onClick: onBook }, "Termin vereinbaren ", h(Icon, { name: "arrow", size: 16 })),
        h("button", { className: "btn btn-ghost", onClick: onBook }, "KI-Werkstatt anfragen"))));
}

/* ===================== Herkunft / „Seit 1993" — Bridge zur Mutter-Agentur ===================== */
function HerkunftSection() {
  const nodes = [
    { y: "1993", t: "Gr\u00fcndung", s: "B2B-Marketing in Rosenheim \u2014 Strategie, Print & Klassik." },
    { y: "Digital & Print", t: "Web & Sichtbarkeit", s: "Von Print zu Websites, SEO und Content \u2014 der Sprung ins Digitale." },
    { y: "Social Marketing", t: "LinkedIn & Bewegtbild", s: "Reichweite \u00fcber Social Media, Video und Fotografie." },
    { y: "360\u00b0-Full-Service", t: "Umfassende Betreuung ", s: "Zwei Standorte, Rosenheim & K\u00f6ln \u2014 alle Kan\u00e4le aus einer Hand." },
    { y: "Beyond Marketing", t: "Heute ", s: "Marketing wird KI-f\u00e4hig \u2014 die n\u00e4chste Stufe.", hot: true }
  ];
  const services = [
    ["Strategie, Content & PR", "https://www.team-mt.de/leistungen/strategie-content-pr-markenkommunikation/"],
    ["LinkedIn Marketing", "https://www.team-mt.de/leistungen/linkedin-marketing/"],
    ["Video Creation & Fotografie", "https://www.team-mt.de/leistungen/video-creation/"],
    ["Webentwicklung & Design", "https://www.team-mt.de/leistungen/webdevelopment-webdesign/"],
    ["GEO & Generative Search", "https://www.team-mt.de/leistungen/geo-generative-search/"],
    ["Performance Marketing", "https://www.team-mt.de/leistungen/performance-marketing-agentur/"]
  ];
  const chip = e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--accent)"; };
  const unchip = e => { e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--line)"; };
  const trackRef = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(true); return; }
    let done = false;
    function cleanup() { try { io && io.disconnect(); } catch (e) {} window.removeEventListener("scroll", reveal, true); window.removeEventListener("resize", reveal); clearInterval(poll); }
    function reveal() {
      if (done) return;
      const node = trackRef.current; if (!node) return;
      const r = node.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.top < (window.innerHeight || 800) * 0.85) { done = true; setShown(true); cleanup(); }
    }
    let io = null;
    try {
      io = new IntersectionObserver(function (ents) { ents.forEach(function (e) { if (e.isIntersecting) { done = true; setShown(true); cleanup(); } }); }, { threshold: 0.2 });
      if (trackRef.current) io.observe(trackRef.current);
    } catch (e) {}
    window.addEventListener("scroll", reveal, true);
    window.addEventListener("resize", reveal);
    const poll = setInterval(reveal, 250);
    reveal();
    return cleanup;
  }, []);
  return h("section", { className: "sec-pad grid-bg", style: { borderTop: "1px solid var(--line)" } },
    h(Reveal, { className: "wrap", style: { maxWidth: 980, marginLeft: "auto", marginRight: "auto" } },
      h(Eyebrow, { num: "// Seit 1993" }, "Die Agentur hinter Beyond Marketing"),
      h("h2", { style: { fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.04, letterSpacing: "-.02em", textWrap: "balance", marginTop: 14, marginBottom: 18, maxWidth: 760 } }, "33 Jahre Marketing. ", h("span", { style: { color: "var(--accent)" } }, "Ein neues Kapitel.")),
      h("p", { className: "lead", style: { maxWidth: 660, marginBottom: "clamp(40px,5vw,62px)" } }, "Beyond Marketing ist kein Start-up-Experiment, sondern die n\u00e4chste Stufe von team::mt \u2014 einer B2B-Marketing-Agentur, die seit 1993 mit Unternehmen w\u00e4chst. Vom Printkatalog \u00fcber digitale Kampagnen bis zur KI."),
      h("div", { ref: trackRef, style: { position: "relative", marginBottom: "clamp(40px,5vw,62px)" } },
        h("div", { "aria-hidden": "true", className: "kiw-tl-line", style: { position: "absolute", left: 5, top: 6, bottom: 6, width: 2, background: "linear-gradient(180deg, var(--line-strong), var(--accent))", transformOrigin: "top center", transform: shown ? "scaleY(1)" : "scaleY(0)", transition: "transform 1.2s cubic-bezier(.2,.8,.2,1)", animation: shown ? "kiwLinePulse 2.8s ease-in-out infinite" : "none" } }),
        nodes.map((n, i) => h("div", { key: i, style: { position: "relative", display: "flex", gap: 18, paddingBottom: i === nodes.length - 1 ? 0 : "clamp(22px,3vw,34px)", opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(16px)", transition: "opacity .55s ease " + (0.3 + i * 0.16) + "s, transform .6s cubic-bezier(.2,.8,.2,1) " + (0.3 + i * 0.16) + "s" } },
          h("div", { style: { flex: "none", width: 12, display: "flex", justifyContent: "center", paddingTop: 4 } },
            h("div", { "aria-hidden": "true", className: n.hot ? "kiw-tl-dot" : null, style: { width: 12, height: 12, borderRadius: "50%", background: n.hot ? "var(--accent)" : "var(--bg-0)", boxShadow: n.hot ? "0 0 0 4px color-mix(in srgb,var(--accent) 26%, transparent)" : "inset 0 0 0 2px var(--accent)", transform: shown ? "scale(1)" : "scale(0)", transition: "transform .5s cubic-bezier(.34,1.56,.64,1) " + (0.35 + i * 0.16) + "s", animation: (shown && n.hot) ? "kiwDotPulse 2.8s ease-in-out infinite" : "none" } })),
          h("div", { style: { flex: "1 1 auto", paddingLeft: 10 } },
            h("div", { style: { fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(18px,2.2vw,22px)", lineHeight: 1.15, letterSpacing: "-.01em", color: n.hot ? "var(--accent)" : "var(--ink)" } }, n.y),
            h("div", { style: { fontFamily: "Poppins", fontWeight: 600, fontSize: 13.5, marginTop: 6, color: "var(--ink-dim)" } }, n.t),
            h("div", { style: { fontSize: 14, lineHeight: 1.5, color: "var(--muted)", marginTop: 6, maxWidth: 580 } }, n.s))))),
      h("div", { style: { fontFamily: "Poppins", fontSize: 12.5, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 } }, "Mehr als KI \u2014 das ganze Haus"),
      h("div", { style: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: "clamp(34px,4vw,48px)" } },
        services.map(([label, href]) => h("a", { key: href, href: href, target: "_blank", rel: "noopener noreferrer", style: { display: "inline-flex", alignItems: "center", padding: "9px 15px", borderRadius: 999, fontFamily: "Poppins", fontWeight: 500, fontSize: 13.5, color: "var(--ink)", background: "var(--glass)", boxShadow: "inset 0 0 0 1px var(--line)", transition: "color .2s, box-shadow .2s" }, onMouseEnter: chip, onMouseLeave: unchip }, label))),
      h("a", { className: "btn btn-cta", href: "https://www.team-mt.de", target: "_blank", rel: "noopener noreferrer", style: { display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" } }, "Die ganze Agentur entdecken \u2014 team-mt.de ", h(Icon, { name: "arrow", size: 16 }))));
}

const tmtFHead = { fontFamily: "Poppins", fontSize: 11.5, letterSpacing: ".24em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 18 };
function SiteFooter({ onBook }) {
  return h("footer", { style: { position: "relative", borderTop: "1px solid var(--line)", paddingTop: 64, paddingBottom: 48 } },
    h("div", { className: "wrap" },
      h("div", { className: "footgrid", style: { display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 40, alignItems: "start", marginBottom: 54 } },
        h("div", null,
          h("div", { style: { display: "flex", alignItems: "center", gap: 14, marginBottom: 16 } },
            h("img", { src: "assets/logo-wordmark.jpg", alt: "team::mt", style: { height: 26, width: "auto", display: "block", mixBlendMode: "multiply" } }),
            h("span", { style: { fontFamily: "Poppins", fontWeight: 600, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--accent)", padding: "5px 10px", borderRadius: 999, boxShadow: "inset 0 0 0 1px color-mix(in srgb,var(--accent) 42%, transparent)" } }, "Seit 1993")),
          h("p", { style: { color: "var(--muted)", fontSize: 14, maxWidth: 320, margin: 0 } }, "KI-Marketing-Agentur aus Rosenheim & Köln. 33 Jahre B2B-Erfahrung, neu gedacht mit KI und 360°-Blick über alle Kanäle."),
          h("a", { href: "https://www.team-mt.de", target: "_blank", rel: "noopener noreferrer", style: { display: "inline-flex", alignItems: "center", gap: 7, marginTop: 16, fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "var(--ink)", transition: "color .2s" }, onMouseEnter: e => e.currentTarget.style.color = "var(--accent)", onMouseLeave: e => e.currentTarget.style.color = "var(--ink)" }, "Die ganze Agentur: team-mt.de ", h(Icon, { name: "arrow", size: 14 }))),
        h("div", null,
          h("div", { style: tmtFHead }, "Navigation"),
          [["Startseite", "#/"], ["Ansatz", "#/ansatz"], ["Leistungen", "#/leistungen"], ["Team", "#/team"]].map(([l, href]) => h("a", { key: href, href: href, style: { display: "block", color: "var(--ink-dim)", fontSize: 14.5, marginBottom: 12 } }, l))),
        h("div", null,
          h("div", { style: tmtFHead }, "Kontakt"),
          h("p", { style: { color: "var(--ink-dim)", fontSize: 14, marginTop: 0, marginBottom: 18 } }, "Lassen Sie uns über Ihr Marketing sprechen."),
          h("button", { className: "btn btn-cta", onClick: onBook }, "Gespräch anfragen ", h(Icon, { name: "arrow", size: 16 })))),
      h(NeonDivider, null),
      h("div", { style: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 22, color: "var(--muted)", fontSize: 12.5, fontFamily: "Poppins", letterSpacing: ".05em" } },
        h("span", null, "© 2026 team::mt"),
        h("span", null, "KI-Marketing-Agentur · Rosenheim & Köln"))));
}

/* ----------------------------- Team-Unterseite ----------------------------- */
const TEAM_MEMBERS = [
  { n: "Martina Manich", r: "CEO & Gr\u00fcnderin", sub: "Dipl. Wirtschaftsinf.", li: "https://www.linkedin.com/in/martina-manich-b2b-marketing/", img: "assets/team/martina.jpg" },
  { n: "Katja Limbrunner", r: "Stellv. Gesch\u00e4ftsf\u00fchrung", li: "https://www.linkedin.com/in/katja-thomas/", img: "assets/team/katja.avif" },
  { n: "Moritz Freese", r: "Art Director", li: "https://www.linkedin.com/in/moritz-freese-691074214/", img: "assets/team/moritz.jpg" },
  { n: "Marius Brinschwitz", r: "Video Expert & Projektmanager", li: "https://www.linkedin.com/in/marius-brinschwitz/", img: "assets/team/marius.jpg" },
  { n: "Joelle Lenz", r: "Marketing Managerin", li: "https://www.linkedin.com/in/joelle-lenz-38b963183/", img: "assets/team/joelle.avif" },
  { n: "Eva Reiske", r: "Marketing Managerin", li: "https://www.linkedin.com/in/evareiske/", img: "assets/team/eva.jpg" },
  { n: "Doris Bremer", r: "Assistenz der Gesch\u00e4ftsleitung", img: "assets/team/doris.jpg" },
  { n: "Anzhelika Balzer", r: "Performance Marketing Managerin", li: "https://www.linkedin.com/in/anzhelika-balzer-270945370", img: "assets/team/anzhelika.avif" },
  { n: "Ulrike Zenker", r: "Performance Marketing Managerin", li: "https://www.linkedin.com/in/ulrike-zenker", img: "assets/team/ulrike.avif" },
  { n: "Marcel Richtfeld", r: "Video Creator", img: "assets/team/marcel.avif" }
];
const TEAM_VALUES = [
  ["spark", "Innovation", "Immer einen Schritt voraus."],
  ["chart", "Nachhaltigkeit", "Langfristige L\u00f6sungen f\u00fcr eine bessere Zukunft."],
  ["target", "Teamspirit", "Gemeinsam stark, immer auf Augenh\u00f6he."],
  ["check", "Kundenn\u00e4he", "Ihre Herausforderungen sind unser Antrieb."]
];
const TEAM_TESTI = [
  ["Mit team::mt haben wir den kreativen und zuverl\u00e4ssigen Partner gefunden, der die Branche bestens kennt und dieselbe Sprache spricht. Die Zusammenarbeit ist v\u00f6llig unkompliziert und macht richtig Spa\u00df.", "Luise Babl", "Software Factory \u00b7 Marketing Managerin"],
  ["In 20 Jahren haben wir mehrere Agenturen probiert und mit Frau Manich und ihrem Team endlich jemanden gefunden, der unsere Anforderungen versteht \u2014 schnell, flexibel und gut.", "Dr. Rainer Stetter", "ITQ GmbH \u00b7 CEO"],
  ["Mit team::mt haben wir nicht nur eine Marketingagentur, sondern einen echten Sparringspartner. Das tiefe Branchenverst\u00e4ndnis schafft Vertrauen und Zusammenarbeit auf Augenh\u00f6he.", "Michael Moeller", "gbo datacomp GmbH \u00b7 CEO"]
];
function teamInitials(n) { const p = n.trim().split(/\s+/); return (((p[0] || "")[0] || "") + ((p[p.length - 1] || "")[0] || "")).toUpperCase(); }

function TeamMemberCard({ m }) {
  return h("div", { style: { position: "relative" } },
    h("div", { style: { position: "relative", aspectRatio: "3 / 4", borderRadius: 7, overflow: "hidden", background: "linear-gradient(160deg, var(--bg-1), var(--bg-2))", boxShadow: "inset 0 0 0 1px var(--line)", display: "grid", placeItems: "center" } },
      m.img ? h("img", { src: m.img, alt: m.n, loading: "lazy", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 16%" } }) : h(React.Fragment, null,
        h("div", { "aria-hidden": "true", style: { position: "absolute", inset: 0, opacity: .6, backgroundImage: "repeating-linear-gradient(135deg, color-mix(in srgb,var(--accent) 9%, transparent) 0 2px, transparent 2px 12px)" } }),
        h("span", { style: { position: "relative", fontFamily: "Poppins", fontWeight: 700, fontSize: "clamp(32px,3.4vw,50px)", letterSpacing: ".03em", color: "color-mix(in srgb,var(--accent) 60%, var(--ink-dim))" } }, teamInitials(m.n)),
        h("span", { style: { position: "absolute", bottom: 10, left: 12, fontFamily: mono, fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--muted)" } }, "Portr\u00e4t"))),
    h("div", { style: { marginTop: 14 } },
      h("div", { style: { fontFamily: "Poppins", fontWeight: 600, fontSize: 17, letterSpacing: "-.01em" } }, m.n),
      h("div", { style: { color: "var(--ink-dim)", fontSize: 14, marginTop: 3 } }, m.r),
      m.sub ? h("div", { style: { color: "var(--muted)", fontSize: 12.5, marginTop: 2 } }, m.sub) : null,
      m.li ? h("a", { href: m.li, target: "_blank", rel: "noopener noreferrer", style: { display: "inline-flex", alignItems: "center", gap: 8, marginTop: 11, fontFamily: "Poppins", fontWeight: 500, fontSize: 13, color: "var(--ink-dim)", transition: "color .2s" }, onMouseEnter: e => e.currentTarget.style.color = "var(--accent)", onMouseLeave: e => e.currentTarget.style.color = "var(--ink-dim)" },
        h("span", { "aria-hidden": "true", style: { display: "inline-grid", placeItems: "center", width: 22, height: 22, borderRadius: 4, background: "var(--accent)", color: "#fff", fontFamily: "Poppins", fontWeight: 700, fontSize: 12, lineHeight: 1 } }, "in"),
        "LinkedIn") : null));
}

/* Statischer Intro-Hero f\u00fcr die Ansatz-Seite, damit sofort Inhalt sichtbar ist
   (die cinematische 360\u00b0-Section blendet erst beim Scrollen ein). */
function AnsatzHero() {
  return h("section", { className: "grid-bg mglow", style: { position: "relative", overflow: "hidden", minHeight: "82vh", display: "flex", alignItems: "center", paddingTop: "clamp(120px,14vh,180px)", paddingBottom: "clamp(56px,8vw,96px)", borderBottom: "1px solid var(--line)" } },
    h("div", { className: "wrap teamgrid", style: { position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: "clamp(28px,4vw,60px)", alignItems: "center" } },
      h("div", null,
        h(Eyebrow, { num: "// Unser Ansatz" }, "Beyond Marketing"),
        h("h1", { style: { fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(40px,6vw,84px)", lineHeight: 1.0, letterSpacing: "-.025em", textWrap: "balance", marginTop: 18 } }, "Marketing, neu gedacht \u2014 ", h("span", { style: { color: "var(--accent)" } }, "360\u00b0 mit KI.")),
        h("p", { className: "lead", style: { maxWidth: 540, marginTop: 22 } }, "Aus Kan\u00e4len, Daten und KI machen wir ein System, das immer aktiv ist und in Echtzeit messbar \u2014 von der ersten Idee bis zur Conversion."),
        h("div", { style: { display: "flex", alignItems: "center", gap: 13, marginTop: "clamp(36px,5vw,56px)", color: "var(--muted)", fontFamily: "Poppins", fontSize: 12.5, letterSpacing: ".22em", textTransform: "uppercase" } },
          h("span", { "aria-hidden": "true", style: { display: "inline-block", width: 1, height: 36, background: "linear-gradient(var(--accent), transparent)" } }),
          "Weiter scrollen")),
      h("div", { style: { display: "flex", justifyContent: "center", alignItems: "center" } },
        h("img", { src: "assets/ansatz-arrow.png", alt: "", "aria-hidden": "true", className: "prozess-float", style: { width: "clamp(210px,28vw,380px)", height: "auto", filter: "drop-shadow(0 30px 52px color-mix(in srgb,var(--accent) 40%, transparent))" } }))));
}

function TeamSeite({ onBook }) {
  const hero = h("section", { className: "grid-bg mglow", style: { position: "relative", overflow: "hidden", paddingTop: "clamp(132px,15vh,190px)", paddingBottom: "clamp(56px,8vw,96px)", borderBottom: "1px solid var(--line)" } },
    h("div", { className: "wrap teamgrid", style: { position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.02fr .98fr", gap: "clamp(32px,4.5vw,64px)", alignItems: "center" } },
      h("div", null,
        h(Eyebrow, { num: "// team::mt" }, "Lernen Sie uns kennen"),
        h("h1", { style: { fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(36px,5vw,72px)", lineHeight: 1.03, letterSpacing: "-.02em", textWrap: "balance", marginTop: 18 } }, "Das Team hinter ", h("span", { style: { color: "var(--accent)" } }, "Ihrem Erfolg.")),
        h("p", { className: "lead", style: { maxWidth: 520, marginTop: 20 } }, "Individuelle Stärken, kreative Lösungen und 33+ Jahre Erfahrung — gemeinsam unschlagbar."),
        h("div", { style: { display: "flex", gap: 14, flexWrap: "wrap", marginTop: 30 } },
          h("button", { className: "btn btn-cta", onClick: onBook }, "Kontakt aufnehmen ", h(Icon, { name: "arrow", size: 16 }))),
        h("div", { style: { display: "flex", flexWrap: "wrap", gap: "clamp(22px,3vw,46px)", marginTop: "clamp(32px,4.5vw,50px)" } },
          [["33+", "Jahre Erfahrung"], ["10", "Expert:innen"], ["2", "Standorte · Rosenheim & Köln"]].map(([k, v]) => h("div", { key: v },
            h("div", { style: { fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(30px,3.6vw,50px)", lineHeight: 1, color: "var(--accent)" } }, k),
            h("div", { style: { color: "var(--ink-dim)", fontSize: 13.5, marginTop: 7, fontFamily: "Poppins" } }, v))))),
      h("div", { style: { position: "relative", aspectRatio: "4 / 3", borderRadius: 12, overflow: "hidden", background: "linear-gradient(160deg, var(--bg-1), var(--bg-2))", boxShadow: "inset 0 0 0 1px var(--line), 0 40px 90px rgba(20,40,70,.16)" } },
        h("img", { src: "assets/team/group.avif", alt: "Das Team von team::mt", fetchpriority: "high", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" } }),
        h("div", { "aria-hidden": "true", style: { position: "absolute", top: 14, left: 14, width: 26, height: 26, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" } }),
        h("div", { "aria-hidden": "true", style: { position: "absolute", bottom: 14, right: 14, width: 26, height: 26, borderBottom: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" } }))));

  const manifesto = h("section", { className: "sec-pad grid-bg" },
    h("div", { className: "wrap", style: { maxWidth: 820 } },
      h(Eyebrow, { num: "// Unser team::mt" }, "Wer wir sind"),
      h("h2", { style: { fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(28px,3.6vw,48px)", lineHeight: 1.06, letterSpacing: "-.01em", textWrap: "balance", marginTop: 14, marginBottom: 24 } }, "Alleine ist man stark — ", h("span", { style: { color: "var(--accent)" } }, "gemeinsam unschlagbar.")),
      h("p", { className: "lead", style: { marginBottom: 16, maxWidth: 740 } }, "Seit über 33 Jahren sind wir mit voller Begeisterung am Markt — immer mit einem klaren Ziel: echten Mehrwert für unsere Kunden schaffen."),
      h("p", { className: "lead", style: { marginBottom: 16, maxWidth: 740 } }, "Im B2B-Marketing setzen wir auf Strategien, die wirken — kombiniert mit Storytelling, klaren Nutzenargumenten und einer Prise Witz und Emotion. Unser Kunde steht stets im Mittelpunkt."),
      h("p", { className: "lead", style: { marginBottom: 28, maxWidth: 740 } }, "Neue Herausforderungen und digitale Projekte treiben uns an. Wir liefern Lösungen, die greifen — persönlich, zuverlässig und leidenschaftlich."),
      h("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
        h("div", { style: { width: 3, height: 42, background: "var(--accent)", borderRadius: 2 } }),
        h("div", null,
          h("div", { style: { fontFamily: "Poppins", fontWeight: 700, fontSize: 17 } }, "Martina Manich"),
          h("div", { style: { color: "var(--muted)", fontSize: 13.5 } }, "Gründerin team::mt")))));

  const werte = h("section", { className: "sec-pad grid-bg" },
    h("div", { className: "wrap" },
      h("div", { style: { textAlign: "center", maxWidth: 700, margin: "0 auto clamp(40px,5vw,64px)" } },
        h("div", { style: { display: "flex", justifyContent: "center" } }, h(Eyebrow, { num: "// \u00dcber team::mt" }, "Wof\u00fcr wir stehen")),
        h("h2", { style: { fontSize: "clamp(28px,4vw,48px)", marginTop: 12, textWrap: "balance" } }, "Werte, die uns ", h("span", { style: { color: "var(--accent)" } }, "antreiben."))),
      h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "clamp(18px,2.2vw,28px)" } },
        TEAM_VALUES.map(([ic, t, d]) => h("div", { key: t, style: { padding: "clamp(22px,2.4vw,30px)", borderRadius: 8, background: "var(--glass)", boxShadow: "inset 0 0 0 1px var(--glass-line)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" } },
          h("span", { style: { display: "inline-grid", placeItems: "center", width: 46, height: 46, borderRadius: 8, color: "var(--accent)", background: "color-mix(in srgb,var(--accent) 12%, transparent)", marginBottom: 18 } }, h(Icon, { name: ic, size: 22 })),
          h("div", { style: { fontFamily: "Poppins", fontWeight: 700, fontSize: 19, marginBottom: 7 } }, t),
          h("p", { style: { color: "var(--ink-dim)", fontSize: 14.5, lineHeight: 1.5, margin: 0 } }, d))))));

  const koepfe = h("section", { className: "sec-pad grid-bg mglow" },
    h("div", { className: "wrap" },
      h("div", { style: { maxWidth: 760, marginBottom: "clamp(40px,5vw,64px)" } },
        h(Eyebrow, { num: "// Lernen Sie uns kennen" }, "Das Team"),
        h("h2", { style: { fontSize: "clamp(28px,4vw,48px)", marginTop: 12, textWrap: "balance" } }, "Die K\u00f6pfe hinter ", h("span", { style: { color: "var(--accent)" } }, "team::mt."))),
      h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "clamp(22px,2.6vw,36px)" } },
        TEAM_MEMBERS.map((m) => h(TeamMemberCard, { key: m.n, m: m })))));

  const testi = h("section", { className: "sec-pad grid-bg" },
    h("div", { className: "wrap" },
      h("div", { style: { textAlign: "center", maxWidth: 700, margin: "0 auto clamp(40px,5vw,60px)" } },
        h("div", { style: { display: "flex", justifyContent: "center" } }, h(Eyebrow, { num: "// Kundenstimmen" }, "Das sagen unsere Kunden")),
        h("h2", { style: { fontSize: "clamp(28px,4vw,48px)", marginTop: 12, textWrap: "balance" } }, "Zusammenarbeit auf ", h("span", { style: { color: "var(--accent)" } }, "Augenh\u00f6he."))),
      h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(20px,2.4vw,30px)" } },
        TEAM_TESTI.map(([q, n, r]) => h("figure", { key: n, style: { margin: 0, padding: "clamp(26px,2.6vw,34px)", borderRadius: 8, background: "var(--glass)", boxShadow: "inset 0 0 0 1px var(--glass-line)", display: "flex", flexDirection: "column", gap: 16 } },
          h("span", { "aria-hidden": "true", style: { fontFamily: '"EB Garamond", Georgia, serif', fontSize: 46, lineHeight: .5, color: "var(--accent)" } }, "\u201d"),
          h("blockquote", { style: { margin: 0, fontFamily: '"EB Garamond", Georgia, serif', fontSize: "clamp(17px,1.5vw,20px)", lineHeight: 1.5, color: "var(--ink)" } }, q),
          h("figcaption", { style: { marginTop: "auto" } },
            h("div", { style: { fontFamily: "Poppins", fontWeight: 600, fontSize: 15 } }, n),
            h("div", { style: { color: "var(--muted)", fontSize: 13 } }, r)))))));

  return h(React.Fragment, null, hero, manifesto, h(ScanCut, null), werte, h(ScanCut, null), koepfe, h(ScanCut, null), testi);
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
      wheelMultiplier: 0.96,
      touchMultiplier: 1.44,
      smoothWheel: true
    });
    window.__lenis = lenis;
    // Schnelleres Zurückscrollen: beim Hochscrollen bekommt jeder Wheel-Schritt mehr Weg,
    // damit die langen gepinnten Abschnitte rückwärts zügiger durchlaufen werden.
    const DOWN_WHEEL = 0.96, UP_WHEEL = 1.6;
    const onWheelDir = e => { const vs = lenis.virtualScroll; if (vs && vs.options) vs.options.wheelMultiplier = e.deltaY < 0 ? UP_WHEEL : DOWN_WHEEL; };
    window.addEventListener("wheel", onWheelDir, { capture: true, passive: true });
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
      window.removeEventListener("wheel", onWheelDir, { capture: true });
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
  const goBook = useCallback(() => scrollToId("kontakt"), []);
  const goBookFocus = useCallback(() => {
    scrollToId("kontakt");
    setTimeout(() => {
      const el = document.querySelector("#kontakt input");
      if (el) try {
        el.focus({
          preventScroll: true
        });
      } catch (e) {
        el.focus();
      }
    }, 650);
  }, []);
  const route = getRoute();
  if (route === "ansatz" || route === "leistungen" || route === "team") {
    const subs = {
      ansatz: [h(AnsatzHero, { key: "ah" }), h(ScanCut, { key: "s0" }), h(GlassRing360, { key: "g", onBook: goBook, leistungenHref: "#/leistungen" }), h(ScanCut, { key: "s1" }), h(SoArbeitenWir, { key: "p" }), h(ScanCut, { key: "s2" }), h(BookingSection, { key: "b" })],
      leistungen: [h(LeistungsIndex, { key: "li" }), h(LeistungenSection, { key: "ls", onBook: goBook }), h(ScanCut, { key: "s1" }), h(DreiPaketeSection, { key: "pk", onBook: goBook }), h(ScanCut, { key: "s2" }), h(BookingSection, { key: "b" })],
      team: [h(TeamSeite, { key: "tm", onBook: goBook }), h(ScanCut, { key: "s2" }), h(HerkunftSection, { key: "hk" }), h(ScanCut, { key: "s3" }), h(BookingSection, { key: "b" })]
    };
    const sub = subs[route];
    return h(React.Fragment, null,
      h(TopBar, { onBook: goBook, route: route }),
      h("main", null, sub),
      h(SiteFooter, { onBook: goBook }),
      h(GlobalScanCursor, null),
      h(TweaksPanel, null,
        h(TweakSection, { label: "Farben" }),
        h(TweakColor, { label: "Leitfarbe", value: t.accentPair, options: [["#db0a30", "#06d6a0"], ["#e23a2e", "#06d6a0"], ["#c81d4a", "#1fb6ff"], ["#0a8d83", "#12a06a"]], onChange: v => setTweak("accentPair", v) }),
        h(TweakColor, { label: "CTA-Farbe", value: t.cta, options: ["#db0a30", "#e23a2e", "#ff5a3c", "#c20029"], onChange: v => setTweak("cta", v) })));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, h(HeroBootReveal, null), /*#__PURE__*/React.createElement(TopBar, {
    onBook: goBook,
    route: route
  }), /*#__PURE__*/React.createElement(Hero, {
    tweaks: t,
    onBook: goBook
  }), h(GlassRing360, { onBook: goBook }), h(ScanCut, null), h(LeistungsIndex, null), h(LeistungenSection, { onBook: goBook }), h(ScanCut, null), h(DreiPaketeSection, {
    onBook: goBook
  }), h(ScanCut, null), h(BookingSection, null), h(ScanCut, null), h(HerkunftSection, null), h(ScanCut, null), h(AbschlussCTA, { onBook: goBook }), h(SiteFooter, {
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
(function () {
  var __r0 = getRoute();
  window.addEventListener("hashchange", function () { if (getRoute() !== __r0) { try { window.scrollTo(0, 0); } catch (e) {} window.location.reload(); } });
})();
ReactDOM.createRoot(document.getElementById("app")).render(/*#__PURE__*/React.createElement(App, null));
})();
