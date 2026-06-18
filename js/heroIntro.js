/* AUTO-GENERIERT aus heroIntro.jsx — NICHT direkt bearbeiten (Quelle: heroIntro.jsx, dann neu kompilieren). */
;(function(){
/* heroIntro.jsx — reusable cinematic hero entry-animation logic.
   Exports to window: HERO_INTRO_TIMING, heroEaseOutCubic, useHeroIntro, Typewriter.

   ┌──────────────────────────────────────────────────────────────────┐
   │  TIMING & EASING — alles hier anpassen.                            │
   │  approachMs   : Dauer des Kamera-Anflugs (Skalierung/Blur/Tiefe).  │
   │  igniteMs     : Zeitfenster, in dem die Neon-Bänder zünden.        │
   │  ribbonStagger: Versatz zwischen den Bändern (Schritt 3).          │
   │  typeSpeedMs  : ms pro Zeichen beim Typewriter (Schritt 4).        │
   │  ctaFadeMs    : Einblendzeit der CTAs/Event-Daten.                 │
   │  easing       : CSS-Easing (Ease-Out, „langsames Ankommen").       │
   │  Der Typewriter startet bei  approachMs + igniteMs*0.4.            │
   └──────────────────────────────────────────────────────────────────┘ */
const HERO_INTRO_TIMING = {
  desktop: {
    approachMs: 1600,
    igniteMs: 760,
    ribbonStaggerMs: 120,
    typeSpeedMs: 34,
    ctaFadeMs: 440,
    parallax: 1,
    // Stärke der Tiefen-Parallaxe beim Anflug (0..1)
    easing: "cubic-bezier(.16,.84,.3,1)"
  },
  // Mobile/Touch: kürzer, weniger Parallaxe, Performance vor Effekt
  mobile: {
    approachMs: 950,
    igniteMs: 460,
    ribbonStaggerMs: 90,
    typeSpeedMs: 24,
    ctaFadeMs: 320,
    parallax: 0.35,
    easing: "cubic-bezier(.16,.84,.3,1)"
  }
};

// JS-Pendant zum CSS-Ease-Out (für die WebGL-Kameraanimation in hero3d.js)
function heroEaseOutCubic(t) {
  t = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - t, 3);
}

/* useHeroIntro — orchestriert die Sequenz, einmalig pro Session.
   Rückgabe: { active, phase, skip, mobile, reduce, timing }
   phase: "approach" → "type" → "done"  (bei active=false direkt "done"). */
function useHeroIntro() {
  const R = React;
  const reduce = R.useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const mobile = R.useRef(window.matchMedia && window.matchMedia("(pointer: coarse), (max-width: 700px)").matches).current;
  // läuft bei jedem Laden/Refresh (nur reduced-motion überspringt komplett)
  const active = false;
  const timing = mobile ? HERO_INTRO_TIMING.mobile : HERO_INTRO_TIMING.desktop;
  const [phase, setPhase] = R.useState(active ? "approach" : "done");
  const skip = R.useCallback(() => {
    setPhase("done");
  }, []);
  R.useEffect(() => {
    if (!active) return;
    const textStart = timing.approachMs + Math.round(timing.igniteMs * 0.4);
    const t = setTimeout(() => setPhase(p => p === "done" ? p : "type"), textStart);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [active]);

  // skip listeners: only while the intro is actually running (detach once done)
  R.useEffect(() => {
    if (!active || phase === "done") return;
    const onSkip = () => skip();
    const armed = setTimeout(() => {
      window.addEventListener("keydown", onSkip);
      window.addEventListener("pointerdown", onSkip);
    }, 400);
    return () => {
      clearTimeout(armed);
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("pointerdown", onSkip);
    };
    // eslint-disable-next-line
  }, [active, phase]);
  return {
    active,
    phase,
    skip,
    mobile,
    reduce,
    timing
  };
}

/* Typewriter — tippt `lead` + (farbige) `accent`-Zeile zeichenweise ein.
   play: tippen aktiv · done: sofort vollständig (kein Caret). */
function Typewriter({
  lead,
  accent,
  speed = 34,
  play,
  done,
  onDone
}) {
  const R = React;
  const full = accent ? lead + "\n" + accent : lead;
  const [n, setN] = R.useState(done ? full.length : 0);
  const doneRef = R.useRef(false);
  R.useEffect(() => {
    if (done) {
      setN(full.length);
      return;
    }
    if (!play) {
      setN(0);
      return;
    }
    let i = 0;
    setN(0);
    doneRef.current = false;
    const id = setInterval(() => {
      i++;
      setN(i);
      if (i >= full.length) {
        clearInterval(id);
        if (!doneRef.current) {
          doneRef.current = true;
          onDone && onDone();
        }
      }
    }, speed);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, [play, done]);
  const typed = full.slice(0, n);
  const nl = typed.indexOf("\n");
  const line1 = nl === -1 ? typed : typed.slice(0, nl);
  const line2 = nl === -1 ? "" : typed.slice(nl + 1);
  const typing = !done && play && n < full.length;
  const caretOnLine1 = typing && nl === -1;
  const caretOnLine2 = typing && nl !== -1;
  const Caret = () => /*#__PURE__*/React.createElement("span", {
    className: "tw-caret",
    "aria-hidden": "true"
  }, "\u258D");
  return /*#__PURE__*/React.createElement("h1", {
    "aria-label": lead + (accent ? " " + accent : ""),
    style: {
      fontSize: "clamp(40px,7vw,88px)",
      marginBottom: 8,
      minHeight: accent ? "1.96em" : "0.95em",
      lineHeight: "0.85"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "clamp(40px,14vw,75px)"
    }
  }, line1, caretOnLine1 ? /*#__PURE__*/React.createElement(Caret, null) : null), accent ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)",
      textShadow: "0 0 calc(50px*var(--glow)) color-mix(in srgb,var(--accent) 55%, transparent)",
      fontSize: "clamp(40px,14vw,75px)",
      lineHeight: "0.88"
    }
  }, line2, caretOnLine2 ? /*#__PURE__*/React.createElement(Caret, null) : null)) : null);
}
Object.assign(window, {
  HERO_INTRO_TIMING,
  heroEaseOutCubic,
  useHeroIntro,
  Typewriter
});
})();
