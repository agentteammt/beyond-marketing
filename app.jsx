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

const INTENSITY_MAP = { "Ruhig": 0.6, "Standard": 1, "Maximal": 1.35 };

/* ----------------------------------------------------------------- */
const { useState, useEffect, useRef, useCallback } = React;

/* Register ScrollTrigger immediately (before any effect runs) so the pinned
   horizontal section can build its trigger regardless of effect ordering. */
if (window.gsap && window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

const PRM = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Single programmatic-scroll path: route through Lenis when it's running so
   button/nav jumps share the same momentum curve as the wheel. */
function smoothScrollTo(top) {
  top = Math.max(0, top);
  if (window.__lenis && !PRM()) { window.__lenis.scrollTo(top, { lock: false }); return; }
  window.scrollTo({ top, behavior: PRM() ? "auto" : "smooth" });
}

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

/* ----------------------------- Top bar ----------------------------- */
function TopBar({ onBook }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onS = () => setSolid(window.scrollY > 40);
    onS();window.addEventListener("scroll", onS, { passive: true });
    return () => window.removeEventListener("scroll", onS);
  }, []);
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "background .4s, box-shadow .4s, backdrop-filter .4s",
      background: solid ? "color-mix(in srgb, var(--bg-0) 78%, transparent)" : "transparent",
      backdropFilter: solid ? "blur(12px)" : "none", WebkitBackdropFilter: solid ? "blur(12px)" : "none",
      boxShadow: solid ? "0 1px 0 var(--line)" : "none"
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, gap: 20 }}>
        <a href="#top" onClick={(e) => {e.preventDefault();smoothScrollTo(0);}} style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <img src="assets/logo-wordmark.jpg" alt="team::mt" style={{ height: 21, width: "auto", display: "block", mixBlendMode: "multiply" }} />
        </a>
        <nav className="topnav" style={{ display: "flex", alignItems: "center", gap: 30, fontFamily: "Poppins", fontSize: 14, fontWeight: 500, color: "var(--ink-dim)" }}>
          {[["Ansatz", "ansatz"], ["KI-Labor", "labor"], ["Pakete", "pakete"], ["Team", "team"]].map(([label, id]) =>
          <a key={id} href={"#" + id} onClick={(e) => {e.preventDefault();scrollToId(id);}} style={{ transition: "color .2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-dim)"}>{label}</a>
          )}
        </nav>
        <button className="btn btn-cta topbar-cta" style={{ padding: "11px 20px", fontSize: 14 }} onClick={onBook}>Gespräch anfragen</button>
      </div>
    </header>);

}

/* ----------------------------- Parallax fallback hero ----------------------------- */
function ParallaxHero({ img, intro, approachMs = 1600, easing = "ease-out" }) {
  const ref = useRef(null);
  const [arrived, setArrived] = useState(!intro);
  useEffect(() => {
    if (!intro) {setArrived(true);return;}
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {r2 = requestAnimationFrame(() => setArrived(true));});
    return () => {cancelAnimationFrame(r1);cancelAnimationFrame(r2);};
  }, [intro]);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5,y = e.clientY / window.innerHeight - 0.5;
      if (!ref.current) return;
      ref.current.querySelectorAll("[data-depth]").forEach((el) => {
        const d = parseFloat(el.dataset.depth);
        el.style.transform = `translate(${x * d * 40}px, ${y * d * 30}px) scale(1.06)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  const outerTransition = intro ? `transform ${approachMs}ms ${easing}, opacity ${approachMs}ms ${easing}, filter ${approachMs}ms ${easing}` : "none";
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", transform: arrived ? "scale(1)" : "scale(0.72)", filter: arrived ? "blur(0px)" : "blur(7px)", opacity: arrived ? 1 : 0.25, transition: outerTransition }}>
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        <img data-depth="0.6" src={img || "assets/hero-overalls.webp"} alt="" fetchpriority="high" decoding="async" style={{ position: "absolute", inset: "-4%", width: "108%", height: "108%", objectFit: "cover", transition: "transform .3s ease-out", opacity: 0.9 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 30% 30%, transparent 30%, rgba(5,6,10,.5) 70%, var(--bg-0)), linear-gradient(90deg, var(--bg-0) 8%, transparent 55%)" }} />
      </div>
    </div>);

}

/* ----------------------------- Hero ----------------------------- */
function Hero({ tweaks, onBook }) {
  const mountRef = useRef(null);
  const apiRef = useRef(null);
  const intro = useHeroIntro();
  const want3D = tweaks.heroStyle !== "Parallax";
  const heroMode = tweaks.heroStyle === "Station" ? "station" : "image";
  const heroImage = tweaks.heroStyle === "Mond" ? "assets/hero-moon.webp" : "assets/hero-overalls.webp";
  const [using3D, setUsing3D] = useState(false);

  // init / teardown hero engine
  useEffect(() => {
    if (!want3D) {if (apiRef.current) {apiRef.current.destroy();apiRef.current = null;}setUsing3D(false);return;}
    if (!window.KIWHero || !window.KIWHero.supported()) {setUsing3D(false);return;}
    const cfg = { accent: tweaks.accentPair[0], accent2: tweaks.accentPair[1], cta: tweaks.cta, intensity: INTENSITY_MAP[tweaks.intensity], mode: heroMode, imageUrl: heroImage,
      intro: intro.active && heroMode === "image" ? { approachMs: intro.timing.approachMs, igniteMs: intro.timing.igniteMs, ribbonStaggerMs: intro.timing.ribbonStaggerMs, parallax: intro.timing.parallax } : null };
    const api = window.KIWHero.init(mountRef.current, cfg);
    if (api) {apiRef.current = api;setUsing3D(true);} else {setUsing3D(false);}
    const onScroll = () => {
      if (!apiRef.current) return;
      const h = window.innerHeight;
      apiRef.current.setScroll(Math.min(1, window.scrollY / h));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {window.removeEventListener("scroll", onScroll);if (apiRef.current) {apiRef.current.destroy();apiRef.current = null;}};
    // eslint-disable-next-line
  }, [want3D, heroMode, heroImage]);

  // live config updates
  useEffect(() => {
    if (apiRef.current) apiRef.current.setConfig({ accent: tweaks.accentPair[0], accent2: tweaks.accentPair[1], cta: tweaks.cta, intensity: INTENSITY_MAP[tweaks.intensity] });
  }, [tweaks.accentPair, tweaks.cta, tweaks.intensity]);

  // when the intro is skipped or finishes, snap the WebGL scene to its final state
  useEffect(() => {
    if (intro.phase === "done" && apiRef.current && apiRef.current.skipIntro) apiRef.current.skipIntro();
  }, [intro.phase, using3D]);

  const T = intro.timing;
  const typing = intro.phase === "type";
  const textDone = intro.phase === "done";
  const eyebrowShow = intro.phase !== "approach";
  const fade = (show, delay) => ({ opacity: show ? 1 : 0, transform: show ? "none" : "translateY(14px)", transition: "opacity " + T.ctaFadeMs + "ms " + T.easing + " " + delay + "ms, transform " + T.ctaFadeMs + "ms " + T.easing + " " + delay + "ms", pointerEvents: show ? "auto" : "none" });
  return (
    <section id="top" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      {/* engine layer */}
      <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />
      {!using3D && <ParallaxHero img={heroImage} intro={intro.active} approachMs={T.approachMs} easing={T.easing} />}
      {/* readability scrim */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "linear-gradient(90deg, rgba(5,6,10,.82) 0%, rgba(5,6,10,.4) 42%, transparent 70%), linear-gradient(0deg, var(--bg-0) 2%, transparent 22%)" }} />

      <div className="wrap" style={{ position: "relative", zIndex: 2, paddingTop: 90, paddingBottom: 60 }}>
        <div style={{ maxWidth: 720 }}>
          <div className="eyebrow" style={Object.assign({ marginBottom: 26 }, fade(eyebrowShow, 0))}>KI Marketing Agentur · B2B</div>
          {intro.active ?
          <Typewriter lead={CONTENT.claimLead} accent={CONTENT.claimAccent} speed={T.typeSpeedMs} play={typing} done={textDone} onDone={intro.skip} /> :
          <h1 aria-label={CONTENT.claimLead + (CONTENT.claimAccent ? " " + CONTENT.claimAccent : "")} style={{ fontSize: "clamp(40px,7vw,88px)", lineHeight: 0.98, marginBottom: 8 }}><span style={{ color: "#db0830" }}>Beyond </span><span style={{ color: "#0e1b2e" }}>Marketing.</span>{CONTENT.claimAccent ? <React.Fragment><br /><span style={{ color: "var(--accent)", textShadow: "0 0 calc(50px*var(--glow)) color-mix(in srgb,var(--accent) 55%, transparent)" }}>{CONTENT.claimAccent}</span></React.Fragment> : null}</h1>}
          <p style={{ ...Object.assign({ fontSize: "clamp(16px,2.1vw,21px)", color: "var(--ink-dim)", maxWidth: 540, margin: "20px 0 0", fontWeight: 300 }, fade(textDone, 0)), fontSize: "20px", fontFamily: '"EB Garamond", Garamond, "Times New Roman", serif', fontStyle: "italic", fontWeight: 400, lineHeight: 1.45 }}>{CONTENT.claimSub}</p>
          <div style={Object.assign({ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 38 }, fade(textDone, 120))}>
            <button id="hero-cta-gespraech" className="btn btn-cta" onClick={(e) => { try { if (window.gtag) gtag("event", "Beyond_Hero_CTA", { click_id: "hero-cta-gespraech", click_text: "Gespräch anfragen", click_location: "hero", click_classes: "btn btn-cta", link_url: location.pathname }); } catch (err) {} onBook(e); }}>Gespräch anfragen <Icon name="arrow" size={16} /></button>
            <button className="btn btn-ghost" onClick={() => scrollToId("ansatz")}>Unser Ansatz</button>
          </div>
          <div style={Object.assign({ display: "flex", gap: 26, flexWrap: "wrap", marginTop: 42, color: "var(--ink-dim)" }, fade(textDone, 240))}>
            <Meta icon="target" label="360°-KI-Marketing" />
            <Meta icon="pin" label="München" />
            <Meta icon="spark" label="33 Jahre B2B-Erfahrung" />
          </div>
        </div>
      </div>

      {/* drag hint / scroll cue */}
      <div className="hero-draghint" style={{ position: "absolute", bottom: 26, left: 0, right: 0, zIndex: 2, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontFamily: "Poppins", fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase" }}>
          <Icon name={using3D ? "drag" : "spark"} size={16} />
          {using3D ? heroMode === "station" ? "Ziehen zum Drehen · Scrollen" : "Bewegen & Ziehen · Scrollen" : "Scrollen zum Entdecken"}
        </div>
      </div>
    </section>);

}
function Meta({ icon, label }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13.5, fontFamily: "Poppins" }}><span style={{ color: "var(--accent)" }}><Icon name={icon} size={17} /></span>{label}</span>;
}

function HeroBootReveal() {
  const reduce = useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const [gone, setGone] = useState(reduce);
  const rootRef = useRef(null), coverRef = useRef(null), beamWrapRef = useRef(null), beamRef = useRef(null), readRef = useRef(null);
  const finishedRef = useRef(false);
  useEffect(() => {
    if (reduce) return;
    const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/<>*+-";
    const BEAM_MS = 5500, HOLD = 520, EXIT = 560, SCRAMBLE = 460, STAGGER = 32;
    let raf = 0, start = performance.now(), cancelled = false, exitT = 0, chars = null, headCrossT = 0, headOrig = null;
    const ease = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
    const splitHead = () => {
      const h1 = document.querySelector("#top h1");
      if (!h1 || h1.dataset.kiwSplit) return;
      try {
        headOrig = h1.innerHTML;
        const words = [];
        [].slice.call(h1.children).forEach((cs) => {
          if (cs.tagName !== "SPAN") return;
          const color = cs.style.color || "";
          cs.textContent.split(/(\s+)/).forEach((part) => {
            if (!part || /^\s+$/.test(part)) return;
            words.push({ text: part, color: color });
          });
        });
        if (!words.length) return;
        h1.textContent = "";
        const allChars = [], wordEls = [];
        words.forEach((w, wi) => {
          if (wi > 0) h1.appendChild(document.createTextNode(" "));
          const we = document.createElement("span");
          we.style.color = w.color; we.style.whiteSpace = "pre";
          for (const c of w.text) { const s = document.createElement("span"); s.dataset.ch = c; s.textContent = c; we.appendChild(s); allChars.push(s); }
          h1.appendChild(we); wordEls.push(we);
        });
        wordEls.forEach((we) => { const w = we.getBoundingClientRect().width; we.style.display = "inline-block"; we.style.width = w.toFixed(2) + "px"; we.style.verticalAlign = "top"; });
        h1.dataset.kiwSplit = "1";
        chars = allChars;
      } catch (e) { chars = null; }
    };
    const frame = (now) => {
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
        if (ep >= 1) { cancelled = true; setGone(true); return; }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const skip = () => { if (!finishedRef.current) { finishedRef.current = true; exitT = performance.now(); } };
    const armed = setTimeout(() => { window.addEventListener("pointerdown", skip); window.addEventListener("keydown", skip); window.addEventListener("wheel", skip, { passive: true }); }, 520);
    return () => {
      cancelled = true; cancelAnimationFrame(raf); clearTimeout(armed);
      window.removeEventListener("pointerdown", skip); window.removeEventListener("keydown", skip); window.removeEventListener("wheel", skip);
      const h1r = document.querySelector("#top h1"); if (h1r && headOrig != null) { h1r.innerHTML = headOrig; delete h1r.dataset.kiwSplit; }
    };
  }, [reduce]);
  if (gone) return null;
  const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  return (
    <div ref={rootRef} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 9600, pointerEvents: "none", willChange: "opacity" }}>
      <div ref={coverRef} style={{ position: "absolute", inset: 0, background: "#f4f7fb", clipPath: "inset(0% 0 0 0)", WebkitClipPath: "inset(0% 0 0 0)" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "linear-gradient(rgba(18,38,66,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(18,38,66,.06) 1px,transparent 1px)", backgroundSize: "34px 34px" }} />
      </div>
      <div ref={beamWrapRef} style={{ position: "absolute", left: 0, right: 0, top: "0%", height: 0, zIndex: 4 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 140, background: "linear-gradient(180deg, color-mix(in srgb,var(--accent) 11%, transparent), transparent)", pointerEvents: "none" }} />
        <div ref={beamRef} style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, opacity: 0, background: "linear-gradient(90deg, transparent, var(--accent) 12%, var(--accent) 88%, transparent)", boxShadow: "0 0 22px 4px color-mix(in srgb,var(--accent) 75%, transparent)" }} />
        <div style={{ position: "absolute", left: "clamp(18px,5vw,60px)", right: "clamp(18px,5vw,60px)", top: 16, display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--muted)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 9px var(--accent)" }} />
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>team::mt</span>
          <span>System initialisieren</span>
          <span ref={readRef} style={{ marginLeft: "auto", fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "var(--ink-dim)" }}>0%</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 14, left: 14, width: 18, height: 18, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)", opacity: 0.55, zIndex: 5 }} />
      <div style={{ position: "absolute", top: 14, right: 14, width: 18, height: 18, borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)", opacity: 0.55, zIndex: 5 }} />
      <div style={{ position: "absolute", bottom: 14, left: 14, width: 18, height: 18, borderBottom: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)", opacity: 0.55, zIndex: 5 }} />
      <div style={{ position: "absolute", bottom: 14, right: 14, width: 18, height: 18, borderBottom: "2px solid var(--accent)", borderRight: "2px solid var(--accent)", opacity: 0.55, zIndex: 5 }} />
    </div>);
}

/* ----------------------------- Sections ----------------------------- */
/* ---- full-height live-check panel (GEO / LinkedIn) ---- */
function CheckPanel({ id, index, title, lead, points, img, alt, scanLabel, accent2, reticle, stamp, onBook }) {
  const sr = useScanReveal(2200);
  const root = Object.assign(
    { position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", borderTop: "1px solid var(--line)" },
    accent2 ? { "--accent": "var(--accent-2)" } : {}
  );
  return (
    <section id={id} style={root} ref={sr.ref}>
      <img src={img} alt={alt} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.12 }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 45%, transparent 30%, rgba(5,6,10,.6) 78%, var(--bg-0)), linear-gradient(0deg, var(--bg-0), transparent 22%, transparent 80%, var(--bg-0))" }} />
      <ConeFloat size={34} delay={0.6} style={{ bottom: "12%", right: "6%" }} />
      <ScanFrame />
      {sr.playing && <span className="scan-reveal-line play" key={sr.run} aria-hidden="true" />}
      {stamp && <div style={{ position: "absolute", zIndex: 4, right: "7%", top: "23%" }}><StatusStempel label={stamp.label} sub={stamp.sub} color={stamp.color} /></div>}
      <div className="wrap" style={{ position: "relative", zIndex: 2, paddingTop: 96, paddingBottom: 80, width: "100%" }}>
        <div className={"scan-reveal-content" + (sr.playing ? " play" : "") + (sr.badging ? " badging" : "")} key={sr.run} style={{ "--scan-dur": "2200ms", maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", opacity: sr.reduce ? 1 : sr.run > 0 ? undefined : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <LiveBadge color="var(--accent)" /><span className="kicker-num">{index}</span>
          </div>
          <h2 style={{ fontSize: "clamp(24px,3vw,40px)", lineHeight: 1.06, marginBottom: 12, color: "#fff", textWrap: "balance" }}>{title}</h2>
          <p style={{ color: "var(--ink-dim)", fontSize: 16, marginBottom: 30, maxWidth: 520 }}>{lead}</p>
          <BigScan label={scanLabel} />
          <button className="btn btn-cta" style={{ marginTop: 30 }} onClick={onBook}>Slot für diesen Check sichern <Icon name="arrow" size={16} /></button>
        </div>
      </div>
    </section>);

}

function GeoCheckSection({ onBook }) {
  return (
    <CheckPanel id="checks" index="// 01 · GEO-Check · live an Ihrer Domain"
    title="Findet die KI Ihr Unternehmen?"
    lead="Generative Suche entscheidet, wer genannt wird. Wir prüfen Ihre Website live vor Ort."
    points={["Sichtbar für KI", "Zitiert statt Wettbewerb", "Strukturlücken"]}
    img="assets/mechanic-screen.webp" alt="Mechaniker betrachtet auf einem Monitor eine im Weltraum schwebende KI-Visualisierung"
    scanLabel="GEO-Analyse läuft" reticle="GEO-SCAN" onBook={onBook} />);

}

function LinkedInCheckSection({ onBook }) {
  return (
    <CheckPanel id="linkedin" accent2 index="// 02 · LinkedIn-Check · live an Ihrem Profil"
    title="Ihr LinkedIn Profil im Quick-Check"
    lead="Ihr lautester B2B-Kanal — wir prüfen live, was Wirkung bringt und was verbessert werden kann."
    points={["Positionierung & Vertrauen", "Automatisierbare Reichweite", "Hebel, priorisiert"]}
    img="assets/mechanic-wrench.webp" alt="Mechaniker mit Schutzbrille biegt einen Schraubenschlüssel, aus dem farbige Lichtströme fließen"
    scanLabel="Profil-Scan läuft" reticle="LINKEDIN-SCAN" onBook={onBook} />);

}

/* ---- full-height demos + result CTA ---- */
function DemosSection({ onBook }) {
  const sr = useScanReveal(4000);
  return (
    <section id="stand" className="grid-bg" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", borderTop: "1px solid var(--line)" }} ref={sr.ref}>
      <ConeFloat size={28} delay={1.6} style={{ bottom: "18%", right: "6%" }} />
      <div aria-hidden="true" style={{ position: "absolute", top: 0, right: 0, width: 320, height: 320, opacity: 0.06, backgroundImage: "repeating-linear-gradient(45deg, var(--caution) 0 22px, transparent 22px 44px)", maskImage: "radial-gradient(circle at top right, #000, transparent 70%)", WebkitMaskImage: "radial-gradient(circle at top right, #000, transparent 70%)", pointerEvents: "none" }} />
      <ScanFrame />
      {sr.playing && <span className="scan-reveal-line play" key={sr.run} aria-hidden="true" />}
      <div className="wrap" style={{ position: "relative", zIndex: 1, width: "100%", paddingTop: 120, paddingBottom: 104 }}>
        <div className={"scan-reveal-content" + (sr.playing ? " play" : "")} key={sr.run} style={{ opacity: sr.reduce ? 1 : sr.run > 0 ? undefined : 0 }}>
        <Reveal>
          <Eyebrow num="// 03">KI zum Anfassen</Eyebrow>
          <h2 style={{ fontSize: "clamp(30px,4.6vw,56px)", maxWidth: 820, marginBottom: 72, textWrap: "balance" }}>Weitere <span style={{ color: "var(--accent)" }}>KI-Werkstatt-Impulse</span>.</h2>
        </Reveal>
        <Reveal delay={100}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28, marginBottom: 44 }} className="demogrid">
            <DemoCard icon="video" title="KI-Videos" body="Von Skript bis fertigem Clip: wie aus einer Produktidee in Minuten ein vorzeigbares Marketing-Video wird." />
            <DemoCard icon="bolt" title="KI-Automatisierung" body="Wiederkehrende Marketing-Abläufe, die sich selbst erledigen — vom Lead bis zum Reporting." />
            <DemoCard icon="share" title="Social-Media-Content" body="Automatisiert geplant, getextet und gestaltet: Content-Pipelines, die Ihren Kanal ohne Mehraufwand tragen." />
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: "linear-gradient(120deg, color-mix(in srgb,var(--cta) 12%, var(--bg-1)), var(--bg-1) 70%)", boxShadow: "inset 0 0 0 1px var(--glass-line)" }}>
            <HazardEdge thin animate />
            <div className="resultbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, padding: "28px 32px", flexWrap: "wrap" }}>
              <div style={{ maxWidth: 560 }}>
                <div className="caution-tag" style={{ marginBottom: 10 }}><Icon name="sign" size={15} /> Ergebnis zum Mitnehmen</div>
                <h3 style={{ fontSize: "clamp(22px,2.6vw,30px)", marginBottom: 6 }}>Ehrliche und konkret Tipps und Tricks für Ihren KI Alltag, jetzt anmelden.</h3>
                <p style={{ color: "var(--ink-dim)", fontSize: 15, margin: 0 }}>Status plus die nächsten sinnvollen Schritte für Ihr Marketing.</p>
              </div>
              <button className="btn btn-cta" onClick={onBook}>Slot sichern <Icon name="arrow" size={16} /></button>
            </div>
          </div>
        </Reveal>
        </div>
      </div>
    </section>);

}

/* ---- "Wer steht dahinter" — Mission Control (team::mt) ---- */
function MissionControlSection({ onBook }) {
  const sr = useScanReveal(2200);
  return (
    <section id="team" className="grid-bg" style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden" }} ref={sr.ref}>
      <HazardEdge animate style={{ position: "relative", zIndex: 3 }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(70% 60% at 50% 42%, color-mix(in srgb,var(--accent) 8%, transparent), transparent 70%), radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(5,6,10,.7))" }} />
      <ConeFloat size={30} delay={1.1} style={{ top: "16%", left: "7%" }} />
      <ScanFrame />
      {sr.playing && <span className="scan-reveal-line play" key={sr.run} aria-hidden="true" />}
      <div className="wrap" style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", paddingTop: 110, paddingBottom: 90 }}>
        <div className={"scan-reveal-content" + (sr.playing ? " play" : "")} key={sr.run} style={{ "--scan-dur": "2200ms", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 760, opacity: sr.reduce ? 1 : sr.run > 0 ? undefined : 0 }}>
          <div style={{ position: "relative" }}>
            <div className="mc-emblem" aria-hidden="true">
              <span className="mc-glow" />
              <span className="mc-ring r2" />
              <span className="mc-ring r1" />
              <span className="mc-ring r3" />
              <img className="mc-emblem-logo" src="assets/logo.png" alt="" />
            </div>
            <div className="mc-stamp" style={{ position: "absolute", right: 0, bottom: "10%", transform: "translateX(78%)", zIndex: 5 }}>
              <StatusStempel label="Werkstatt-Betreiber" sub="team::mt" color="var(--accent)" />
            </div>
          </div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>// Mission Control</div>
          <h2 style={{ fontSize: "clamp(30px,4.4vw,56px)", lineHeight: 1.05, marginBottom: 18, textWrap: "balance" }}>
            <span style={{ color: "var(--accent)" }}>team::mt</span> — das Team hinter der Werkstatt
          </h2>
          <p style={{ color: "var(--ink-dim)", fontSize: 17, lineHeight: 1.62, marginBottom: 18, maxWidth: 620 }}>
            Wir sind eine Marketing-Agentur aus München, die Marketing-Abteilungen KI-fähig macht — von Sichtbarkeit bis Automatisierung. Die KI-Werkstatt ist unser Stand, an dem wir genau das live zeigen.
          </p>
          <div className="display" style={{ fontSize: "clamp(18px,2.2vw,26px)", color: "var(--accent)", letterSpacing: ".01em", marginBottom: 34 }}>Beyond Marketing.</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <a className="btn btn-cta" href="https://team-mt.de" target="_blank" rel="noopener noreferrer">team-mt.de <Icon name="arrow" size={16} /></a>
          </div>
        </div>
      </div>
      <HazardEdge thin animate style={{ position: "relative", zIndex: 3 }} />
    </section>);

}

function BandSection() {
  return (
    <section data-glitch style={{ position: "relative", height: "min(62vh,520px)", display: "grid", placeItems: "center", overflow: "hidden", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <img src="assets/work-in-progress.webp" alt="Leuchtende 'Work in Progress'-Tafel mit Pylonen auf einer Metallplattform im Weltraum" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5, objectFit: "cover" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 80% at 50% 50%, transparent, rgba(5,6,10,.82)), linear-gradient(0deg, var(--bg-0), transparent 40%, transparent 60%, var(--bg-0))" }} />
      <Reveal className="wrap" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div className="caution-tag" style={{ marginBottom: 18 }}><Icon name="sign" size={16} /> Baustelle im Orbit</div>
        <h2 style={{ fontSize: "clamp(26px,4.2vw,52px)", maxWidth: 900, margin: "0 auto", textWrap: "balance" }}>
          KI ist kein Werkzeug für später.<br /><span style={{ color: "var(--accent)" }}>Es liegt schon auf Ihrer Werkbank.</span>
        </h2>
        <p style={{ color: "var(--ink-dim)", fontSize: 17, maxWidth: 560, margin: "22px auto 0" }}>Wir zeigen Ihnen am Stand, welche Teile davon sofort in Ihr Marketing passen.</p>
      </Reveal>
    </section>);

}

/* ---- horizontal pinned scroll for the four full-height panels (desktop only) ----
   Pinned + scrubbed via GSAP ScrollTrigger; the track slides left as the page
   scrolls down. All smoothing is supplied by the shared Lenis instance (lerp .08),
   so the horizontal glide trails the wheel with the same momentum as the rest of
   the page and never hard-snaps at the section boundaries. */
function HorizontalScroll({ labels, children, hid = "hwrap", gkey = "__hscroll" }) {
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
    const wrap = wrapRef.current, track = trackRef.current;
    if (wrap) wrap.dataset.enabled = enabled ? "1" : "0";
    if (!enabled || !wrap || !track || !window.gsap || !window.ScrollTrigger) {
      if (track) track.style.transform = "";
      return;
    }
    const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    const vw = () => window.innerWidth || 1;
    const panelX = (i) => -i * vw();
    // Verweil-/Gleit-Choreografie: jedes Panel steht erst volle Breite still (dwell),
    // dann gleitet der Track zum nächsten (slide).
    const DWELL = 1.0, SLIDE = 1.15;
    const total = count * DWELL + Math.max(0, count - 1) * SLIDE;
    const pinLen = () => total * (window.innerHeight || 1);

    const paint = (p) => {
      if (fillRef.current) fillRef.current.style.width = (p * 100).toFixed(2) + "%";
      const curX = gsap.getProperty(track, "x") || 0;
      const center = -curX / vw();
      const active = Math.min(count - 1, Math.max(0, Math.round(center)));
      labelRefs.current.forEach((el, i) => { if (el) el.style.color = i === active ? "var(--accent)" : "var(--muted)"; });
      if (stepRef.current) stepRef.current.textContent = ("0" + (active + 1)).slice(-2) + " / " + ("0" + count).slice(-2);
      // z-Tiefe: abgehendes Panel schrumpft + dunkelt, kommendes fährt heran
      const kids = track.children;
      for (let i = 0; i < kids.length; i++) {
        const d = Math.min(1, Math.abs(i - center));
        const el = kids[i];
        el.style.transformOrigin = "50% 50%";
        el.style.transform = "scale(" + (1 - d * 0.08).toFixed(4) + ")";
        el.style.opacity = (1 - d * 0.42).toFixed(3);
        el.style.filter = d > 0.02 ? "brightness(" + (1 - d * 0.24).toFixed(3) + ")" : "none";
      }
      // Panels hören auf den Fortschritt, um eigene Kino-Übergänge zu fahren (z. B. 360°-Titel → Radar)
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
        onUpdate: (self) => paint(self.progress),
        onRefresh: (self) => paint(self.progress),
      },
    });
    for (let i = 0; i < count; i++) {
      tween.to(track, { x: () => panelX(i), duration: DWELL, ease: "none" });
      if (i < count - 1) tween.to(track, { x: () => panelX(i + 1), duration: SLIDE, ease: "power2.inOut" });
    }

    window[gkey] = { st: tween.scrollTrigger, count, units: { dwell: DWELL, slide: SLIDE, total } };
    paint(0);

    // Entry-Effekt: beim Reinscrollen ins Horizontal-Scrollen steigt die Stage auf
    // und ein roter Scan-Beam wischt nach unten (eigene Approach-ScrollTrigger).
    const setEnter = (e) => {
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
      onUpdate: (self) => setEnter(self.progress),
      onRefresh: (self) => setEnter(self.progress)
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
    return <div id={hid} ref={wrapRef} data-enabled="0">{children}</div>;
  }
  return (
    <section id={hid} ref={wrapRef} data-enabled="1" style={{ height: "100vh", overflow: "hidden", position: "relative" }}>
      <div ref={stageRef} style={{ position: "relative", height: "100%", width: "100%", opacity: 1, willChange: "transform, opacity", transformOrigin: "50% 42%" }}>
        <div ref={trackRef} style={{ display: "flex", height: "100%", width: "max-content", willChange: "transform" }}>
          {React.Children.map(children, (ch, i) =>
          <div key={i} style={{ flex: "0 0 100vw", width: "100vw", height: "100%", position: "relative", overflow: "hidden" }}>{ch}</div>
          )}
        </div>
      </div>
      <div ref={beamRef} aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, transform: "translateY(-50%)", zIndex: 6, pointerEvents: "none", opacity: 0, background: "linear-gradient(90deg, transparent, var(--accent) 18%, var(--accent) 82%, transparent)", boxShadow: "0 0 22px 4px color-mix(in srgb,var(--accent) 55%, transparent)" }} />
      <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, zIndex: 5, display: count > 1 ? "flex" : "none", flexDirection: "column", alignItems: "center", gap: 11, pointerEvents: "none" }}>
        <span ref={stepRef} style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, letterSpacing: ".2em", color: "var(--accent)" }}>{"01 / " + ("0" + count).slice(-2)}</span>
        <div style={{ display: "flex", gap: 24 }}>
          {labels.map((l, i) =>
          <span key={i} ref={(el) => labelRefs.current[i] = el} style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: i === 0 ? "var(--accent)" : "var(--muted)", transition: "color .3s" }}>{l}</span>
          )}
        </div>
        <div style={{ width: 210, height: 2, background: "rgba(140,190,230,.18)", borderRadius: 2, overflow: "hidden" }}>
          <div ref={fillRef} style={{ height: "100%", width: "0%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }} />
        </div>
      </div>
    </section>);

}

function AblaufSection() {
  return (
    <section id="ablauf" className="sec-pad grid-bg theme-shift" data-theme-shift>
      <div className="wrap" style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "clamp(32px,6vw,90px)" }}>
        <div className="ablaufhead">
          <Reveal>
            <Eyebrow num="// 04">So läuft die Werkstatt ab</Eyebrow>
            <h2 style={{ fontSize: "clamp(30px,4.2vw,52px)", marginBottom: 22, textWrap: "balance" }}>10 Minuten. Ein klarer Befund. Kein Pitch.</h2>
            <p style={{ color: "var(--ink-dim)", fontSize: 16, marginBottom: 30 }}>Wir arbeiten an Ihrem echten Material. Sie gehen mit Erkenntnissen, nicht mit einem Flyer.</p>
            <button className="btn btn-cta" onClick={() => scrollToId("book")}>Slot sichern <Icon name="arrow" size={16} /></button>
          </Reveal>
        </div>
        <div>
          <StepRow num="1" icon="cal" title="Slot sichern" body="Über LinkedIn oder hier: Sie buchen Ihre 10 Minuten an Stand 14. Wir halten den Platz für Sie frei." />
          <StepRow num="2" icon="scan" title="Quick-Check vor Ort" body="Wir öffnen Ihre Website und Ihr LinkedIn-Profil und lassen GEO- und LinkedIn-Check live laufen." />
          <StepRow num="3" icon="spark" title="Live-Auswertung & Demos" body="Sie sehen Ihren Status sofort — und live, wie KI-Videos, Automatisierungen und Social-Content entstehen." />
          <StepRow num="4" icon="chart" title="Roadmap zum Mitnehmen" body="Priorisierte nächste Schritte für Ihr Marketing — konkret, ehrlich, ohne Verkaufsgespräch." last />
        </div>
      </div>
    </section>);

}

function BookSection({ onBookFired }) {
  return (
    <section id="book" className="sec-pad">
      <div style={{ position: "absolute", zIndex: 4, right: "6%", top: "8%" }} className="book-stamp"><StatusStempel label="Jetzt anmelden" color="var(--accent)" /></div>
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }}>
        <Reveal className="bookcopy">
          <div className="caution-tag" style={{ marginBottom: 14 }}><Icon name="cone" size={16} /> Begrenzte Plätze · Stand 14</div>
          <Eyebrow num="// 05">Werkstatt-Slot buchen</Eyebrow>
          <h2 style={{ fontSize: "clamp(32px,4.6vw,60px)", marginBottom: 20, textWrap: "balance" }}>Sichern Sie sich Ihre <span style={{ color: "var(--accent)" }}>10 Minuten</span>.</h2>
          <p style={{ color: "var(--ink-dim)", fontSize: 17, marginBottom: 30, maxWidth: 460 }}>Die Plätze an Stand 14 sind begrenzt. Wählen Sie einen Slot — wir bereiten Ihren Check vor.</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
            {[["clock", "Nur 10 Minuten Ihrer Messezeit"], ["target", "An Ihrem echten Webauftritt & Profil"], ["check", "Konkreter Befund statt Verkaufsgespräch"]].map(([ic, tx]) =>
            <li key={tx} style={{ display: "flex", gap: 14, alignItems: "center", color: "var(--ink)", fontSize: 15.5 }}>
                <span style={{ width: 38, height: 38, flex: "none", borderRadius: 2, display: "grid", placeItems: "center", color: "var(--accent)", boxShadow: "inset 0 0 0 1px var(--line-strong)" }}><Icon name={ic} size={18} /></span>{tx}
              </li>
            )}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <BookingEmbed calendlyUrl={CONTENT.CALENDLY_URL} booking={CONTENT.booking} event={CONTENT.event} onBookClick={onBookFired} />
        </Reveal>
      </div>
    </section>);

}

/* ----------------------------- Sticky mobile CTA ----------------------------- */
function StickyCTA({ onBook }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onS = () => setShow(window.scrollY > window.innerHeight * 0.28);
    window.addEventListener("scroll", onS, { passive: true });
    return () => window.removeEventListener("scroll", onS);
  }, []);
  return (
    <div className="sticky-cta" style={{
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 90, padding: "16px 16px calc(12px + env(safe-area-inset-bottom))",
      background: "color-mix(in srgb, var(--bg-0) 88%, transparent)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      transform: show ? "translateY(0)" : "translateY(110%)", transition: "transform .4s cubic-bezier(.2,.8,.2,1)"
    }}>
      <HazardEdge thin animate style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
      <button className="btn btn-cta" style={{ width: "100%" }} onClick={onBook}>Werkstatt-Slot sichern <Icon name="arrow" size={16} /></button>
    </div>);

}

/* =================================================================
   team::mt Sektionen (neuer Aufbau)
   ================================================================= */

/* kurze vertikale Überleit-Zeile (Hero -> Warum jetzt) */
function UeberleitBand() {
  return (
    <section style={{ position: "relative", padding: "clamp(58px,9vw,108px) 0" }}>
      <Reveal className="wrap" style={{ textAlign: "center", maxWidth: 920, marginLeft: "auto", marginRight: "auto" }}>
        <h2 style={{ fontSize: "clamp(26px,4vw,46px)", textWrap: "balance", lineHeight: 1.1 }}>
          Marketing verändert sich schneller als je zuvor.<br /><span style={{ color: "var(--accent)" }}>Wir sorgen dafür, dass Sie vorne bleiben.</span>
        </h2>
      </Reveal>
    </section>);

}

/* Horizontal-Panel 1 — Warum jetzt (#ansatz)
   Effekt am horizontalen Scrub-Fortschritt dieses Panels (Position im Pin),
   NICHT an einer vertikalen Sticky-Stage. */
function WarumJetztPanel() {
  const rootRef = useRef(null), bgRef = useRef(null), wipeRef = useRef(null), headRef = useRef(null), ebRef = useRef(null);
  const chipRefs = useRef([]);
  const chips = ["mehr Kanäle", "mehr Content", "mehr Geschwindigkeit", "mehr Messbarkeit"];
  useEffect(() => {
    const root = rootRef.current;if (!root) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = chipRefs.current.filter(Boolean);
    const meta = els.map((el, i) => {const cx = i - (els.length - 1) / 2;return { conv: -cx * 130, rot: cx * 6, seed: i * 1.7 };});
    // c = Klarheit (0..1), s = roher Slide des Panels (0 = mittig, 1 = ganz nach links raus)
    const apply = (c, s, t) => {
      const cc = Math.min(1, c / 0.55); // Chips zuerst (fertig bei 55% der Klarheit)
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
      if (bgRef.current) {bgRef.current.style.opacity = (inv * 0.85).toFixed(3);bgRef.current.style.transform = "scale(" + (1 + inv * 0.08).toFixed(3) + ")";}
      // Wisch an den rohen Slide gekoppelt: läuft nach rechts und leitet ins nächste Panel über
      if (wipeRef.current) {const w = Math.min(1, Math.max(0, s));wipeRef.current.style.opacity = Math.sin(Math.PI * w).toFixed(3);wipeRef.current.style.transform = "translateX(" + (-40 + w * 210).toFixed(1) + "%)";}
      if (headRef.current) {const hp = Math.min(1, Math.max(0, (c - 0.70) / 0.30));headRef.current.style.opacity = hp.toFixed(3);headRef.current.style.transform = "translateY(" + ((1 - hp) * 18).toFixed(1) + "px)";}
      if (ebRef.current) ebRef.current.style.opacity = (0.5 + 0.5 * c).toFixed(3);
    };
    const enabled = () => {const w = root.closest("#hwrap");return !!(w && w.dataset.enabled === "1");};
    let raf = 0;
    const loop = (t) => {
      const hs = window.__hscroll;
      if (reduce || !enabled()) apply(1, 1, t);
      else if (hs && hs.st && hs.units) {
        const p = hs.st.progress || 0;
        const U = hs.units;
        const p0End = U.dwell / U.total;
        const cFull = U.dwell * 0.6 / U.total;
        const c = Math.min(1, Math.max(0, p / cFull));
        const w = Math.min(1, Math.max(0, (p - p0End) / (U.slide / U.total)));
        apply(c, w, t);
      } else apply(0, 0, t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <section id="ansatz" ref={rootRef} className="grid-bg" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div ref={wipeRef} aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "46%", zIndex: 3, pointerEvents: "none", opacity: 0, background: "linear-gradient(90deg, transparent 0%, color-mix(in srgb,var(--accent) 16%, transparent) 45%, color-mix(in srgb,var(--accent) 55%, transparent) 74%, var(--accent) 90%, transparent 100%)", boxShadow: "0 0 70px color-mix(in srgb,var(--accent) 40%, transparent)" }} />
      <div className="wrap" style={{ position: "relative", zIndex: 2, paddingTop: 96, paddingBottom: 80, textAlign: "center", maxWidth: 1000, marginLeft: "auto", marginRight: "auto", width: "100%" }}>
        <div ref={ebRef} style={{ display: "flex", justifyContent: "center" }}><Eyebrow num="// 01">Warum jetzt</Eyebrow></div>
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 46, marginTop: 6 }}>
          {chips.map((c, i) =>
          <span key={c} ref={(el) => chipRefs.current[i] = el} style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 999, fontFamily: "Poppins", fontWeight: 500, fontSize: "clamp(14px,1.5vw,16px)", color: "var(--ink)", background: "var(--glass)", boxShadow: "inset 0 0 0 1px var(--glass-line)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", willChange: "transform, filter, opacity" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />{c}
              {i === 2 &&
            <img src="assets/hero-glass.png" alt="" aria-hidden="true" style={{ position: "absolute", right: -62, top: "50%", width: 104, transform: "translateY(-50%) rotate(-9deg)", filter: "drop-shadow(0 16px 26px rgba(219,10,48,.30))", pointerEvents: "none" }} />}
            </span>
          )}
        </div>
        <div ref={headRef} style={{ opacity: 0 }}>
          <h2 style={{ fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontWeight: 500, fontSize: "clamp(28px,4.4vw,54px)", textWrap: "balance", lineHeight: 1.12, maxWidth: 920, margin: "0 auto" }}>
            Marketing wird gerade neu definiert. <span style={{ color: "var(--accent)", fontStyle: "normal" }}>Mit oder ohne Sie.</span>
          </h2>
          <p className="lead" style={{ maxWidth: 640, margin: "18px auto 0" }}>Marketing-Abteilungen sollen mehr leisten, schneller liefern und gleichzeitig effizienter werden — mit denselben Teams. KI ist die einzige Antwort, die diese Gleichung auflöst. Sie trennt gerade zwei Lager: die, die ihre Schlagkraft vervielfachen, und die, die zusehen.</p>
        </div>
      </div>
    </section>);

}

/* Horizontal-Panel 2a — 360°-Titelkarte (#loesung)
   Gepinnte Titelkarte (#10): riesiges "360°" + "im KI-Marketing-Labor" + "Unsere Lösung".
   Beim Weiterswipen (Slide 2→3) verdichtet sich der Titel (#1): "360°" schrumpft Richtung
   Radar-Kern + löst sich auf, Headline/Subline zerfallen per Blur/Skew (Decrypt-Anmutung).
   Gefahren am echten Track-Fortschritt (hscroll:progress). Fallback: statische Titelkarte. */
function Kompass360Title() {
  const rootRef = useRef(null), bigRef = useRef(null), headRef = useRef(null), subRef = useRef(null), ebRef = useRef(null), hintRef = useRef(null);
  useEffect(() => {
    const cinematic = window.matchMedia("(min-width:901px)").matches && !window.matchMedia("(pointer:coarse)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !!(window.gsap && window.ScrollTrigger);
    if (!cinematic) return; // Fallback: statische Titelkarte
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
  return (
    <section ref={rootRef} className="grid-bg" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderTop: "1px solid var(--line)" }}>
      <div className="wrap" style={{ textAlign: "center", maxWidth: 1120, marginLeft: "auto", marginRight: "auto", width: "100%" }}>
        <div ref={ebRef} style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Eyebrow num="// 03">Unsere Lösung</Eyebrow></div>
        <div ref={bigRef} className="display" style={{ fontSize: "clamp(110px,25vw,400px)", lineHeight: 0.9, letterSpacing: "-.045em", color: "var(--accent)", willChange: "transform, opacity, filter" }}>360°</div>
        <h2 ref={headRef} style={{ fontSize: "clamp(28px,4.4vw,60px)", textWrap: "balance", lineHeight: 1.04, marginTop: 6, willChange: "opacity, filter, transform" }}>Wir nennen es <span style={{ color: "var(--accent)" }}>Beyond Marketing.</span></h2>
        <div ref={hintRef} style={{ marginTop: 16, color: "var(--muted)", fontFamily: "Poppins", fontSize: 13, letterSpacing: ".22em", textTransform: "uppercase" }}>360° · im KI-Marketing-Labor</div>
      </div>
    </section>);

}

/* Horizontal-Panel 2 — 360°-Radar / Kompass (#kompass)
   Glas-Kern in der Mitte, sechs Kanal-Knoten auf dem Ring. Ein roter Konus-Sweep
   dreht 360° (rAF); passiert er einen Knoten, springt dieser matt->klar, bekommt
   roten Rand + Nutzen-Text. Nach einer Runde: Puls + Kern "360° aktiv".
   Start via IntersectionObserver. Reduced-Motion/Mobil: sofort alle aktiv, kein Sweep. */
function KompassPanel() {
  const channels = [
    ["target", "Website", "Mehr Sichtbarkeit & Conversion"],
    ["linkedin", "LinkedIn", "Stärkere Positionierung"],
    ["scan", "SEO", "Mehr organische Reichweite"],
    ["share", "Content", "Schnellere Produktion"],
    ["chart", "Monitoring", "Datenbasierte Entscheidungen"],
    ["bolt", "Automatisierung", "Weniger manuelle Schleifen"]];
  const N = channels.length;
  const ANG = channels.map((_, i) => 12 + i * (360 / N)); // Knotenwinkel (Grad, im Uhrzeigersinn ab oben)
  const RR = 40; // Radius in % der Stage
  const pos = (i) => {const a = ANG[i] * Math.PI / 180;return { left: 50 + RR * Math.sin(a), top: 50 - RR * Math.cos(a) };};

  const secRef = useRef(null), coneRef = useRef(null), coreRef = useRef(null), coreLblRef = useRef(null), pulseRef = useRef(null), pulse2Ref = useRef(null), stageColRef = useRef(null);
  const nodeRefs = useRef([]);

  useEffect(() => {
    const sec = secRef.current;if (!sec) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia && window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;

    const activate = (i, instant) => {
      const el = nodeRefs.current[i];if (!el || el.dataset.on === "1") return;
      el.dataset.on = "1";
      if (instant) el.style.transition = "none";
      el.style.opacity = "1";el.style.filter = "blur(0px)";
      const disc = el.querySelector("[data-disc]");
      if (disc) {disc.style.boxShadow = "inset 0 0 0 1.5px var(--accent), 0 0 26px color-mix(in srgb,var(--accent) 38%, transparent)";disc.style.color = "var(--accent)";disc.style.background = "color-mix(in srgb,var(--accent) 12%, var(--glass))";}
      const ben = el.querySelector("[data-ben]");
      if (ben) {ben.style.opacity = "1";ben.style.transform = "translateY(0)";}
      const blip = el.querySelector("[data-blip]");
      if (blip && !instant) {blip.style.animation = "none";void blip.offsetWidth;blip.style.animation = "kompass-blip 720ms ease-out forwards";}
      if (!instant) {
        el.style.transform = el.dataset.base + " scale(1.16)";
        setTimeout(() => {if (el.dataset.on === "1") el.style.transform = el.dataset.base + " scale(1)";}, 360);
      }
    };
    const complete = (instant) => {
      if (coreRef.current) {coreRef.current.dataset.on = "1";if (!instant && !reduce) coreRef.current.classList.add("kompass-core-on");else coreRef.current.style.boxShadow = "inset 0 0 0 1px var(--accent), 0 0 56px color-mix(in srgb,var(--accent) 44%, transparent)";}
      if (coreLblRef.current) coreLblRef.current.innerHTML = '<span style="color:var(--accent)">360°</span> aktiv';
      if (pulseRef.current && !instant) {pulseRef.current.style.animation = "none";void pulseRef.current.offsetWidth;pulseRef.current.style.animation = "kompass-pulse 1000ms ease-out forwards";}
      if (pulse2Ref.current && !instant) {pulse2Ref.current.style.animation = "none";void pulse2Ref.current.offsetWidth;pulse2Ref.current.style.animation = "kompass-pulse 1200ms ease-out 160ms forwards";}
    };

    if (reduce || mobile) {
      for (let i = 0; i < N; i++) activate(i, true);
      complete(true);
      if (coneRef.current) coneRef.current.style.display = "none";
      return;
    }

    const SPEED = 360 / 4500; // Grad pro ms -> ~4,5s je Umdrehung (langsamer, bedeutungsvoller)
    let raf = 0, startT = 0, done = false, running = false;
    // Start, sobald der Panel-Mittelpunkt wirklich im Viewport liegt (horizontal + vertikal).
    // getBoundingClientRect spiegelt die Live-Transform des gepinnten Tracks; ein
    // Lade-Layout-Transient (Panel noch unter dem Fold) startet so nicht versehentlich.
    const inView = () => {
      const r = sec.getBoundingClientRect();
      const vw = window.innerWidth || 1, vh = window.innerHeight || 1;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      return cx > vw * 0.2 && cx < vw * 0.8 && cy > 0 && cy < vh;
    };
    const frame = (now) => {
      if (!running && inView()) {running = true;startT = now;}
      if (running) {
        const ang = (now - startT) * SPEED;
        if (coneRef.current) coneRef.current.style.transform = "translate(-50%,-50%) rotate(" + ang.toFixed(2) + "deg)";
        for (let i = 0; i < N; i++) if (ang >= ANG[i]) activate(i, false);
        if (!done && ang >= 372) {done = true;complete(false);}
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Radar fährt aus der Tiefe heran, während die Titelkarte (Panel davor) sich verdichtet (#1).
  useEffect(() => {
    const cinematic = window.matchMedia("(min-width:901px)").matches && !window.matchMedia("(pointer:coarse)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !!(window.gsap && window.ScrollTrigger);
    const stage = stageColRef.current;
    if (!cinematic || !stage) return;
    const apply = (center) => {
      const fromDepth = Math.max(0, Math.min(1, 2 - center)); // 1 = noch weit weg, 0 = angekommen
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

  return (
    <section id="kompass" ref={secRef} className="grid-bg" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", borderTop: "1px solid var(--line)", paddingTop: 90, paddingBottom: 70 }}>
      <div className="wrap kompass-grid" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(32px,5vw,76px)", alignItems: "center", justifyContent: "center", width: "100%" }}>
      <div style={{ position: "relative", zIndex: 2, flex: "1 1 380px", maxWidth: 540 }}>
        <Eyebrow num="// 02">Unser Ansatz</Eyebrow>
        <h2 style={{ fontSize: "clamp(26px,3.6vw,46px)", textWrap: "balance", lineHeight: 1.06, marginTop: 6 }}><span style={{ color: "var(--accent)" }}>360°</span> im KI-Marketing Labor statt Einzelmaßnahmen</h2>
        <p className="lead" style={{ fontSize: "clamp(16px,1.7vw,19px)", marginTop: 20 }}>Wir denken Marketing ganzheitlich: über Website, LinkedIn, SEO, Content, Monitoring und Automatisierung hinweg. So entstehen konsistente Botschaften, klare Prozesse und bessere Ergebnisse über alle Touchpoints hinweg.</p>
        <p className="lead" style={{ fontSize: "clamp(16px,1.7vw,19px)", marginTop: 16 }}>In unserem KI-Marketing Labor zeigen wir live, wie KI im Marketing konkret eingesetzt werden kann — von der Idee bis zur Umsetzung. Nicht als Buzzword, sondern als Arbeitsweise, die Zeit spart und Wirkung erhöht.</p>
      </div>

      {/* Radar-Stage */}
      <div ref={stageColRef} style={{ position: "relative", zIndex: 1, width: "clamp(300px,42vw,500px)", height: "clamp(300px,42vw,500px)", flex: "0 0 auto", willChange: "transform, opacity, filter" }}>
        {/* digitale Range-Ringe (gestrichelt / segmentiert) */}
        <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "80%", height: "80%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, color-mix(in srgb,var(--accent) 32%, transparent) 0 1.6deg, transparent 1.6deg 5deg)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0 48.4%, #000 48.8% 50%, transparent 50.4%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 0 48.4%, #000 48.8% 50%, transparent 50.4%)" }} />
        <div className="kompass-tick-rev" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "66%", height: "66%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, color-mix(in srgb,var(--accent) 26%, transparent) 0 9deg, transparent 9deg 16deg)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0 48%, #000 48.6% 50%, transparent 50.6%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 0 48%, #000 48.6% 50%, transparent 50.6%)" }} />
        <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "52%", height: "52%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, color-mix(in srgb,var(--accent) 24%, transparent) 0 1.2deg, transparent 1.2deg 6deg)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0 47.8%, #000 48.4% 50%, transparent 50.8%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 0 47.8%, #000 48.4% 50%, transparent 50.8%)" }} />

        {/* Crosshair */}
        <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "10%", bottom: "10%", width: 1, transform: "translateX(-50%)", background: "linear-gradient(to bottom, transparent, color-mix(in srgb,var(--accent) 14%, transparent) 18% 82%, transparent)" }} />
        <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "10%", right: "10%", height: 1, transform: "translateY(-50%)", background: "linear-gradient(to right, transparent, color-mix(in srgb,var(--accent) 14%, transparent) 18% 82%, transparent)" }} />

        {/* rotierender Tick-Ring (HUD) */}
        <div className="kompass-tick" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "86%", height: "86%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, color-mix(in srgb,var(--accent) 30%, transparent) 0deg 0.7deg, transparent 0.7deg 9deg)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0 46%, #000 47% 50%, transparent 51%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 0 46%, #000 47% 50%, transparent 51%)" }} />

        {/* ambiente Reichweiten-Pings */}
        <div className="kompass-ping" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "80%", height: "80%", transform: "translate(-50%,-50%) scale(.3)", borderRadius: "50%", boxShadow: "0 0 0 1px color-mix(in srgb,var(--accent) 40%, transparent)", opacity: 0, pointerEvents: "none" }} />
        <div className="kompass-ping d2" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "80%", height: "80%", transform: "translate(-50%,-50%) scale(.3)", borderRadius: "50%", boxShadow: "0 0 0 1px color-mix(in srgb,var(--accent) 40%, transparent)", opacity: 0, pointerEvents: "none" }} />

        {/* rotierender Konus-Sweep + Leitlinie */}
        <div ref={coneRef} aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "80%", height: "80%", transform: "translate(-50%,-50%) rotate(0deg)", transformOrigin: "50% 50%", willChange: "transform" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", filter: "blur(1.5px)", background: "conic-gradient(from 0deg, color-mix(in srgb,var(--accent) 52%, transparent) 0deg, color-mix(in srgb,var(--accent) 0%, transparent) 16deg, transparent 248deg, color-mix(in srgb,var(--accent) 30%, transparent) 360deg)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0 26%, #000 40%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 0 26%, #000 40%)" }} />
          {/* Leitkante */}
          <div style={{ position: "absolute", left: "50%", top: 0, width: 2, height: "50%", transform: "translateX(-50%)", transformOrigin: "bottom center", background: "linear-gradient(to top, transparent, var(--accent))", boxShadow: "0 0 12px color-mix(in srgb,var(--accent) 60%, transparent)" }} />
          {/* Komet-Punkt an der Leitkante (Ringrand) */}
          <div style={{ position: "absolute", left: "50%", top: 0, width: 12, height: 12, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 16px 2px color-mix(in srgb,var(--accent) 80%, transparent)" }} />
        </div>

        {/* Abschluss-Puls (Doppel-Ping) */}
        <div ref={pulseRef} aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "80%", height: "80%", transform: "translate(-50%,-50%) scale(.62)", borderRadius: "50%", boxShadow: "0 0 0 2px var(--accent)", opacity: 0, pointerEvents: "none" }} />
        <div ref={pulse2Ref} aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "80%", height: "80%", transform: "translate(-50%,-50%) scale(.62)", borderRadius: "50%", boxShadow: "0 0 0 1px color-mix(in srgb,var(--accent) 55%, transparent)", opacity: 0, pointerEvents: "none" }} />

        {/* Kern */}
        <div ref={coreRef} style={{ position: "absolute", left: "50%", top: "50%", width: "clamp(150px,27vmin,232px)", height: "clamp(150px,27vmin,232px)", transform: "translate(-50%,-50%)", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 4, background: "radial-gradient(circle at 50% 38%, color-mix(in srgb,var(--accent) 14%, var(--glass)), var(--glass))", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 20px 60px rgba(0,0,0,.14)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", zIndex: 4 }}>
          {/* rotierender Kern-Ring */}
          <div className="kompass-corering" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "118%", height: "118%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb,var(--accent) 55%, transparent) 40deg, transparent 90deg, transparent 360deg)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 0 48%, #000 50%)", maskImage: "radial-gradient(circle at 50% 50%, transparent 0 48%, #000 50%)", pointerEvents: "none" }} />
          <span ref={coreLblRef} className="display" style={{ fontSize: "clamp(22px,2.8vw,32px)", letterSpacing: ".005em", lineHeight: 1.05, color: "var(--ink)" }}><span style={{ color: "var(--accent)" }}>360°</span> Marketing</span>
        </div>

        {/* Kanal-Knoten */}
        {channels.map(([ic, ch, benefit], i) =>
        <div key={ch} ref={(el) => nodeRefs.current[i] = el} data-base="translate(-50%,-50%)" style={Object.assign({ left: pos(i).left + "%", top: pos(i).top + "%", zIndex: 5 }, matte)}>
            <div data-disc style={discBase}><Icon name={ic} size={26} /><div data-blip aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "100%", height: "100%", transform: "translate(-50%,-50%) scale(.25)", borderRadius: "50%", boxShadow: "0 0 0 2px var(--accent)", opacity: 0, pointerEvents: "none" }} /></div>
            <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "clamp(13px,1.5vw,15px)", marginTop: 10 }}>{ch}</div>
            <div data-ben style={{ fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: "clamp(12.5px,1.4vw,14.5px)", color: "var(--ink-dim)", marginTop: 3, lineHeight: 1.25, opacity: 0, transform: "translateY(4px)", transition: "opacity .5s ease .12s, transform .5s ease .12s" }}>{benefit}</div>
          </div>
        )}
      </div>
      </div>
    </section>);

}

/* Verbindungselement Abschnitt 2 (Unser Ansatz / 360°) → 3 (Glas-Sektion):
   echoendes „360°" + absteigende Leitlinie mit wanderndem Punkt, führt das Auge nach unten. */
function Bruecke360() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("on"); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) el.classList.add("on"); }), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="bruecke360" aria-hidden="true" style={{ position: "relative", height: "clamp(120px,19vh,210px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "var(--bg-0)" }}>
      <span className="display" style={{ fontSize: 17, letterSpacing: ".06em", color: "var(--accent)" }}>360°</span>
      <div className="bruecke-line" style={{ width: 1, height: "clamp(48px,9vh,92px)", background: "linear-gradient(to bottom, transparent, var(--accent))", position: "relative" }}>
        <span className="bruecke-dot" style={{ position: "absolute", left: "50%", top: 0, width: 8, height: 8, borderRadius: "50%", transform: "translate(-50%,-50%)", background: "var(--accent)", boxShadow: "0 0 12px 2px color-mix(in srgb,var(--accent) 75%, transparent)" }} />
      </div>
    </div>);

}

/* Beyond-Marketing-Abschnitt (#beyond) — Lexikon-Eintrag (#1) + Split-Frage/CTA (#3)
   Elemente blenden nach dem 3D-Objekt nacheinander ein (IntersectionObserver + Stagger). */
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
  const hid = (s) => ({ opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(20px)", filter: shown ? "none" : "blur(7px)", transition: "opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1), filter .7s ease", transitionDelay: s + "s" });
  return (
    <section id="beyond" ref={secRef} className="grid-bg" style={{ borderTop: "1px solid var(--line)", minHeight: "100vh", display: "flex", alignItems: "center", padding: "clamp(60px,10vh,120px) 0" }}>
      <div className="wrap" style={{ maxWidth: 1180, margin: "0 auto", width: "100%" }}>
        <div className="bm-split">
          <div>
            <div className="bm-r" style={{ display: "flex", justifyContent: "flex-start", marginBottom: 22, ...hid(0) }}><Eyebrow num="// 03">Definition</Eyebrow></div>
            <div className="bm-r" style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "clamp(16px,1.8vw,22px)", letterSpacing: "-.01em", color: "var(--ink)", marginBottom: 8, ...hid(0.12) }}>Wir nennen es</div>
            <h2 className="bm-r" style={{ fontFamily: '"EB Garamond", Georgia, serif', fontWeight: 500, fontSize: "clamp(34px,4.4vw,58px)", lineHeight: 1.0, margin: 0, color: "var(--ink)", ...hid(0.34) }}>Beyond Marketing</h2>
            <div className="bm-r" style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, color: "var(--muted)", fontFamily: "Poppins", fontSize: 14, flexWrap: "wrap", ...hid(0.56) }}>
              <span style={{ fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: 18, color: "var(--ink-dim)" }}>/bɪˈjɒnd ˈmɑːkɪtɪŋ/</span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" }} />
              <span>Substantiv</span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" }} />
              <span>team::mt</span>
            </div>
            <p className="bm-r" style={{ fontFamily: '"EB Garamond", Georgia, serif', fontSize: "clamp(19px,2vw,27px)", lineHeight: 1.42, color: "var(--ink)", maxWidth: 560, marginTop: 28, marginBottom: 0, ...hid(0.72) }}>
              <span style={{ color: "var(--accent)", fontWeight: 600, fontFamily: "Poppins", fontSize: "0.62em", marginRight: 12, verticalAlign: "2px" }}>1.</span>
              Marketing, das mit KI über alle Kanäle hinweg denkt — 360°, immer aktiv, in Echtzeit messbar.
            </p>
            <p className="bm-r" style={{ fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: 16, color: "var(--ink-dim)", maxWidth: 520, marginTop: 16, marginBottom: 0, ...hid(0.86) }}>„Sie machen kein Marketing von gestern mehr — Sie machen Beyond Marketing.“</p>
          </div>
          <div className="bm-divider bm-r" aria-hidden="true" style={{ alignSelf: "stretch", width: 1, minHeight: 220, background: "linear-gradient(to bottom, transparent, var(--accent), transparent)", boxShadow: "0 0 12px color-mix(in srgb,var(--accent) 55%, transparent)", ...hid(0.6) }} />
          <div>
            <h3 className="bm-r" style={{ fontSize: "clamp(30px,4vw,56px)", lineHeight: 1.04, textWrap: "balance", margin: 0, ...hid(0.98) }}>Sind Sie <span style={{ color: "var(--accent)" }}>bereit?</span></h3>
            <p className="bm-r" style={{ color: "var(--ink-dim)", fontSize: 16, lineHeight: 1.5, maxWidth: 390, marginTop: 18, ...hid(1.1) }}>Ein 10-Minuten-Gespräch genügt, um zu sehen, wo KI in Ihrem Marketing den größten Hebel setzt.</p>
            <div className="bm-r" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 32, ...hid(1.22) }}>
              <button className="btn btn-cta" onClick={onBook}>Termin vereinbaren <Icon name="arrow" size={16} /></button>
              <a className="btn btn-ghost" href="https://team-mt.de" target="_blank" rel="noopener noreferrer">team-mt.de</a>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* 360°-Glas-Ring (#loesung360) — WebGL-Glas-Torus, der beim Scrollen kontinuierlich rotiert.
   6 Kanal-Knoten reiten am äußeren Rand; pro Frame projiziert glassring.js sie auf den
   Screen und meldet die 1–2 auf der vorderen Flanke → Produkt-Callouts links/rechts mit
   kurzer Leitlinie + Puls-Punkt. Fallback (Mobil/kein WebGL/Reduced-Motion): statische Liste. */
function GlassRing360({ onBook }) {
  const channels = [
    ["spark", "Von Kampagnen", "zu Always-on-Systemen"],
    ["scan", "Von Google", "zu KI-Antworten"],
    ["bolt", "Von Handarbeit", "zu Automatisierung"],
    ["chart", "Von Bauchgefühl", "zu Echtzeit-Daten"],
    ["arrow", "Von Wochen", "zu Stunden"],
    ["target", "Von Masse", "zu Personalisierung"]];
  const N = channels.length;
  const wrapRef = useRef(null), videoRef = useRef(null), introRef = useRef(null), convRef = useRef(null), idxRef = useRef(null), headingRef = useRef(null), sheetRef = useRef(null), scanRef = useRef(null), scanBeamRef = useRef(null), scanFillRef = useRef(null), scanReadRef = useRef(null);
  const labelRefs = useRef([]), lineRefs = useRef([]), dotRefs = useRef([]);
  const [fallback, setFallback] = useState(false);
  const goIndex = () => { const wrap = wrapRef.current; if (!wrap) return; const top = wrap.getBoundingClientRect().top + window.scrollY; const travel = wrap.offsetHeight - window.innerHeight; const target = top + 0.97 * travel; if (window.__lenis && window.__lenis.scrollTo) window.__lenis.scrollTo(target, { duration: 1.4 }); else window.scrollTo({ top: target, behavior: "smooth" }); };

  useEffect(() => {
    const cinematic = window.matchMedia("(min-width:901px)").matches && !window.matchMedia("(pointer:coarse)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!cinematic) { setFallback(true); return; }
    const wrap = wrapRef.current, video = videoRef.current;
    if (!wrap || !video) { setFallback(true); return; }
    let dur = 5.79;
    const onMeta = () => { if (isFinite(video.duration) && video.duration > 0) dur = video.duration; };
    video.addEventListener("loadedmetadata", onMeta);
    // Feste Punkte rund um das Objekt (Screen-Koords, +y unten), abwechselnd rechts/links.
    const DIRS = [[0.82, -0.56, 1], [-0.82, -0.56, -1], [1, 0.05, 1], [-1, 0.05, -1], [0.82, 0.62, 1], [-0.82, 0.62, -1]];
    const GAP = 26;
    const sstep = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
    const revealOf = (lt, fin, fout) => (lt <= 0 || lt >= 1) ? 0 : sstep(0, fin || 0.3, lt) * (1 - sstep(1 - (fout || 0.3), 1, lt));
    const computeProg = () => { const r = wrap.getBoundingClientRect(); const tv = r.height - window.innerHeight; return tv > 0 ? Math.min(1, Math.max(0, -r.top / tv)) : 0; };
    const draw = () => {
      const p = computeProg();
      // Scroll treibt die Videozeit (Scrubbing)
      const rotT = Math.min(1, Math.max(0, (p - 0.42) / 0.36)); // Objekt dreht erst, wenn es lesbar ist
      if (isFinite(dur)) { const tt = rotT * (dur - 0.03); if (Math.abs(video.currentTime - tt) > 0.012) { try { video.currentTime = tt; } catch (e) {} } }
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2 + window.innerHeight * 0.10;
      const rad = Math.min(window.innerWidth * 0.27, window.innerHeight * 0.245);
      const innerR = Math.min(window.innerWidth, window.innerHeight) * 0.13; // Startpunkt am 3D-Objekt
      const ip = sstep(0.0, 0.18, p);                        // Intro: Blur-in, gestaffelt
      const introVis = Math.max(0, 1 - sstep(0.28, 0.37, p)); // (unbenutzt, Headline wird einzeln gesteuert)
      const videoIn = sstep(0.32, 0.42, p);                   // dann blurt das Objekt langsam auf
      const sp = Math.max(0, Math.min(1, (p - 0.44) / 0.36)); // Shift-Phase (50% langsamer)
      const af = sp < 0.28 ? (sp / 0.28) : 1 + (sp - 0.28) / 0.72 * (N - 1); // erster Begriff länger
      const conv = 0;                      // sechs Linien laufen zusammen
      const videoOut = sstep(0.82, 0.90, p);                  // Objekt verschwindet
      const textIn = sstep(0.865, 0.915, p);                    // Definition erscheint an gleicher Stelle
      const defSwipe = sstep(0.94, 0.972, p);                // Definition swipet links raus (steht ~30% länger)
      const idxIn = sstep(0.95, 0.99, p);                    // Index gleitet rechts herein (gleiche Stelle)
      if (videoRef.current) {
        videoRef.current.style.opacity = (videoIn * (1 - videoOut)).toFixed(3);
        const ob = Math.min(24, (1 - videoIn) * 24 + videoOut * 24);
        videoRef.current.style.filter = "brightness(1.16) contrast(1.06) saturate(1.12) blur(" + ob.toFixed(2) + "px)";
      }
      if (introRef.current) {
        const kids = introRef.current.children;          // 0 Eyebrow, 1 Chips, 2 Headline, 3 Text
        const ipHead = sstep(0.0, 0.126, p);             // Eyebrow + Chips 30% früher (Lead-in kürzer)
        const fadeOut = sstep(0.24, 0.32, p);            // Nebenelemente verschwinden
        const headOut = sstep(0.72, 0.80, p);            // Headline verschwindet zuletzt
        const toTop = sstep(0.30, 0.44, p);              // Headline wandert nach oben (= Überschrift)
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
          // Streaks fahren vom Label-Radius in die Mitte (Konvergenz)
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
    // Video „primen", damit der Seek-Bereich etabliert ist (sonst kein Scrubbing/Drehung)
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
    return (
      <section id="loesung360" className="sec-pad grid-bg" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap" style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow num="// 02">Unsere Lösung</Eyebrow></div>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", marginTop: 10, marginBottom: 40, textWrap: "balance" }}><span style={{ color: "var(--accent)" }}>360°</span> im KI-Marketing-Labor</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 40px", textAlign: "left" }}>
            {channels.map(([ic, ch, be]) =>
            <div key={ch} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ color: "var(--accent)", flex: "none", marginTop: 2 }}><Icon name={ic} size={22} /></span>
                <div><div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 17 }}>{ch}</div><div style={{ fontFamily: '"EB Garamond", Georgia, serif', fontSize: 18, color: "var(--ink-dim)", marginTop: 2 }}>{be}</div></div>
              </div>
            )}
          </div>
        </div>
      </section>);
  }

  return (
    <section id="loesung360" ref={wrapRef} className="grid-bg" style={{ position: "relative", height: "945vh", borderTop: "1px solid var(--line)" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
      <div ref={introRef} style={{ position: "absolute", inset: 0, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px", pointerEvents: "none" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><Eyebrow num="// 01">Warum Beyond</Eyebrow></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 26, maxWidth: 700 }}>
          {["mehr Kanäle", "mehr Content", "mehr Geschwindigkeit", "mehr Messbarkeit"].map((c) =>
          <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "10px 18px", borderRadius: 999, fontFamily: "Poppins", fontWeight: 500, fontSize: "clamp(13px,1.4vw,15px)", color: "var(--ink)", background: "var(--glass)", boxShadow: "inset 0 0 0 1px var(--glass-line)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />{c}</span>
          )}
        </div>
        <h2 style={{ fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontWeight: 500, fontSize: "clamp(28px,4.4vw,54px)", textWrap: "balance", lineHeight: 1.12, maxWidth: 900, margin: 0 }}>Marketing wird gerade neu definiert. <span style={{ color: "var(--accent)", fontStyle: "normal" }}>Mit Ihnen?</span></h2>
        <p className="lead" style={{ maxWidth: 640, margin: "18px auto 0" }}>Marketing-Abteilungen sollen mehr leisten, schneller liefern und gleichzeitig effizienter werden — mit denselben Teams. KI ist die einzige Antwort, die diese Gleichung auflöst. Sie trennt gerade zwei Lager: die, die ihre Schlagkraft vervielfachen, und die, die zusehen.</p>
      </div>
      <div ref={convRef} style={{ position: "absolute", inset: 0, zIndex: 7, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(40px,7vh,90px) 5vw", opacity: 0, pointerEvents: "none" }}>
        <div ref={sheetRef} style={{ position: "relative", width: "100%", maxWidth: 1080, margin: "0 auto", padding: "clamp(18px,2.6vh,34px) clamp(20px,2.8vw,44px) clamp(20px,2.6vh,34px)", background: "linear-gradient(180deg, rgba(255,255,255,.74), rgba(244,247,251,.6))", boxShadow: "inset 0 0 0 1px color-mix(in srgb,var(--accent) 36%, transparent), 0 34px 90px rgba(20,40,70,.14)", backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)", overflow: "hidden", willChange: "clip-path, opacity" }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.45, backgroundImage: "linear-gradient(color-mix(in srgb,var(--accent) 14%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--accent) 14%,transparent) 1px,transparent 1px)", backgroundSize: "34px 34px", WebkitMaskImage: "linear-gradient(180deg,#000,transparent 92%)", maskImage: "linear-gradient(180deg,#000,transparent 92%)" }} />
          <div aria-hidden="true" style={{ position: "absolute", top: 9, left: 9, width: 16, height: 16, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" }} />
          <div aria-hidden="true" style={{ position: "absolute", top: 9, right: 9, width: 16, height: 16, borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" }} />
          <div aria-hidden="true" style={{ position: "absolute", bottom: 9, left: 9, width: 16, height: 16, borderBottom: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" }} />
          <div aria-hidden="true" style={{ position: "absolute", bottom: 9, right: 9, width: 16, height: 16, borderBottom: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 11.5, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)", borderBottom: "1px solid color-mix(in srgb,var(--accent) 26%, transparent)", paddingBottom: 12, marginBottom: "clamp(14px,2.2vh,26px)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "var(--accent)", fontWeight: 600 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 9px var(--accent)" }} />Messprotokoll</span>
            <span>{"team::mt · Vermessung 100%"}</span>
          </div>
          <div className="wrap" style={{ position: "relative", maxWidth: 1100, margin: "0 auto", width: "100%", paddingLeft: 0, paddingRight: 0 }}>
          <div className="bm-split">
            <div>
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 20 }}><Eyebrow num="// 02">Definition</Eyebrow></div>
              <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "clamp(16px,1.8vw,22px)", letterSpacing: "-.01em", color: "var(--ink)", marginBottom: 8 }}>Wir nennen es</div>
              <h2 style={{ fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontWeight: 500, fontSize: "clamp(34px,4.4vw,58px)", lineHeight: 1.0, margin: 0, color: "var(--ink)" }}>Beyond Marketing</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, color: "var(--muted)", fontFamily: "Poppins", fontSize: 14, flexWrap: "wrap" }}>
                <span style={{ fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: 18, color: "var(--ink-dim)" }}>/bɪˈjɒnd ˈmɑːkɪtɪŋ/</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" }} />
                <span>Substantiv</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" }} />
                <span>team::mt</span>
              </div>
              <p style={{ fontFamily: '"EB Garamond", Georgia, serif', fontSize: "clamp(19px,2vw,27px)", lineHeight: 1.42, color: "var(--ink)", maxWidth: 560, marginTop: 26, marginBottom: 0 }}>
                <span style={{ color: "var(--accent)", fontWeight: 600, fontFamily: "Poppins", fontSize: "0.62em", marginRight: 12, verticalAlign: "2px" }}>1.</span>
                Marketing, das mit KI über alle Kanäle hinweg denkt — 360°, immer aktiv, in Echtzeit messbar.
              </p>
              <p style={{ fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: 16, color: "var(--ink-dim)", maxWidth: 520, marginTop: 14, marginBottom: 0 }}>„Sie machen kein Marketing von gestern mehr — Sie machen Beyond Marketing.“</p>
            </div>
            <div className="bm-divider" aria-hidden="true" style={{ alignSelf: "stretch", width: 1, minHeight: 220, background: "linear-gradient(to bottom, transparent, var(--accent), transparent)", boxShadow: "0 0 12px color-mix(in srgb,var(--accent) 55%, transparent)" }} />
            <div>
              <h3 style={{ fontSize: "clamp(30px,4vw,56px)", lineHeight: 1.04, textWrap: "balance", margin: 0 }}>Sind Sie <span style={{ color: "var(--accent)" }}>bereit?</span></h3>
              <p style={{ color: "var(--ink-dim)", fontSize: 16, lineHeight: 1.5, maxWidth: 390, marginTop: 18 }}>Ein 10-Minuten-Gespräch genügt, um zu sehen, wo KI in Ihrem Marketing den größten Hebel setzt.</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 30 }}>
                <button className="btn btn-cta" onClick={onBook}>Termin vereinbaren <Icon name="arrow" size={16} /></button>
              </div>
              <button onClick={goIndex} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 18, padding: 0, background: "none", border: "none", cursor: "pointer", fontFamily: "Poppins", fontWeight: 600, fontSize: 15, color: "var(--accent)" }}>Dann fangen wir hier an<Icon name="arrow" size={16} /></button>
            </div>
          </div>
          </div>
        </div>
      </div>
      <div ref={idxRef} style={{ position: "absolute", inset: 0, zIndex: 7, display: "flex", alignItems: "center", justifyContent: "center", padding: "10vh 5vw", opacity: 0, transform: "translateX(60vw)", pointerEvents: "none" }}>
        <div className="wrap" style={{ maxWidth: 980, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}><Eyebrow num="// Leistungen">Was wir tun</Eyebrow></div>
          <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(28px,4vw,48px)", textWrap: "balance", letterSpacing: "-.01em", maxWidth: 760, marginTop: 10, marginBottom: "clamp(20px,3vw,36px)" }}>Fünf Hebel, ein Ziel: <span style={{ color: "var(--accent)" }}>sichtbares Marketing.</span></h2>
          <div>
            {CHAPTERS.map((d) =>
            <div key={d.num} className="lidx-row">
                <span className="lidx-num">{d.num.replace("// ", "")}</span>
                <span className="lidx-name" style={{ display: "flex", alignItems: "center", gap: "clamp(12px,1.4vw,18px)" }}>
                  <img src={d.img} alt="" aria-hidden="true" style={{ width: "clamp(40px,3.6vw,56px)", height: "auto", flex: "none", filter: "drop-shadow(0 6px 16px color-mix(in srgb,var(--accent) 34%, transparent))" }} />
                  {d.eyebrow}
                </span>
                <span className="lidx-go"><Icon name="arrow" size={20} /></span>
              </div>
            )}
          </div>
        </div>
      </div>
      <video ref={videoRef} src="assets/glass-logo.mp4" muted playsInline preload="auto" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1, background: "#fff", opacity: 0, transform: "translateY(10%) scale(0.7)", transformOrigin: "center", filter: "brightness(1.16) contrast(1.06) saturate(1.12)", WebkitMaskImage: "radial-gradient(ellipse 60% 62% at 50% 50%, #000 46%, rgba(0,0,0,0) 90%)", maskImage: "radial-gradient(ellipse 60% 62% at 50% 50%, #000 46%, rgba(0,0,0,0) 90%)" }} />
      <div ref={scanRef} aria-hidden="true" style={{ position: "absolute", left: "50%", top: "calc(50% + 10vh)", transform: "translate(-50%,-50%)", width: "min(58vh,54vw)", height: "min(58vh,54vw)", zIndex: 6, opacity: 0, pointerEvents: "none", willChange: "opacity" }}>
        <div ref={scanFillRef} aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: "0%", overflow: "hidden", background: "linear-gradient(180deg, color-mix(in srgb,var(--accent) 14%, transparent), color-mix(in srgb,var(--accent) 4%, transparent))" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(color-mix(in srgb,var(--accent) 32%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--accent) 32%,transparent) 1px,transparent 1px)", backgroundSize: "30px 30px", opacity: 0.5 }} />
        </div>
        <div ref={scanBeamRef} aria-hidden="true" style={{ position: "absolute", left: "-3%", right: "-3%", top: "0%", height: 2, opacity: 0, background: "linear-gradient(90deg, transparent, var(--accent) 18%, var(--accent) 82%, transparent)", boxShadow: "0 0 20px 3px color-mix(in srgb,var(--accent) 78%, transparent)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 20, height: 20, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 20, height: 20, borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 20, height: 20, borderBottom: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderBottom: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" }} />
        <div style={{ position: "absolute", left: "50%", bottom: "-12%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 10, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--accent)", whiteSpace: "nowrap" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }} />
          <span>Vermessung</span>
          <span ref={scanReadRef} style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>0%</span>
        </div>
      </div>
      <svg style={{ position: "absolute", inset: 0, zIndex: 2, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }} aria-hidden="true">
        {channels.map((_, i) =>
        <line key={i} ref={(el) => lineRefs.current[i] = el} x1="0" y1="0" x2="0" y2="0" style={{ stroke: "var(--accent)", strokeWidth: 1.2, opacity: 0, filter: "drop-shadow(0 0 5px color-mix(in srgb,var(--accent) 70%, transparent))" }} />
        )}
      </svg>
      {channels.map((_, i) =>
      <div key={"d" + i} ref={(el) => dotRefs.current[i] = el} aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, zIndex: 3, opacity: 0, pointerEvents: "none" }}>
        <span className="glass-dot" style={{ position: "absolute", left: 0, top: 0, width: 9, height: 9, borderRadius: "50%", transform: "translate(-50%,-50%)", background: "var(--accent)", boxShadow: "0 0 12px 2px color-mix(in srgb,var(--accent) 75%, transparent)" }} />
        <span className="glass-dot-ring" style={{ position: "absolute", left: 0, top: 0, width: 9, height: 9, borderRadius: "50%", transform: "translate(-50%,-50%)", boxShadow: "0 0 0 1.5px color-mix(in srgb,var(--accent) 65%, transparent)" }} />
      </div>
      )}
      {channels.map(([ic, ch, be], i) =>
      <div key={ch} ref={(el) => labelRefs.current[i] = el} style={{ position: "absolute", left: 0, top: 0, zIndex: 4, width: "clamp(190px,22vw,290px)", opacity: 0, willChange: "left, top, opacity" }}>
        <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 11, letterSpacing: ".26em", textTransform: "uppercase", color: "var(--muted)" }}>{ch}</div>
        <div style={{ fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: "clamp(21px,2.2vw,30px)", lineHeight: 1.16, color: "var(--ink)", marginTop: 6 }}>{be}</div>
      </div>
      )}
      </div>
    </section>);

}

/* KI-Labor (#labor) — Maschinenraum: dunkles Glas + Live-Konsole */
const LABOR_DEMOS = [
  { tag: "Landingpage", prompt: "Schreib eine Headline für eine Persona-Landingpage — Zielgruppe: B2B-Entscheider.",
    out: "Marketing, das Ihre Zahlen schon kennt.\n\nEine Landingpage, die genau Ihre Entscheider abholt — vom ersten Scrollen bis zur gebuchten Demo." },
  { tag: "LinkedIn", prompt: "Formuliere einen LinkedIn-Post-Opener für eine Marketingleiterin.",
    out: "„Wir posten viel. Aber wirkt das eigentlich?\u201c\n\nDie ehrliche Antwort meines Teams hat mich letzte Woche überrascht — drei Dinge, die wir ab sofort anders machen." },
  { tag: "Automatisierung", prompt: "Entwirf einen Automatisierungs-Flow für Lead-Nurturing.",
    out: "1 · Lead füllt das Formular aus\n2 · KI qualifiziert & taggt in Echtzeit\n3 · Personalisierte E-Mail-Sequenz startet\n4 · Übergabe an den Vertrieb beim Kaufsignal" } ];
const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

function LiveConsole() {
  const tagRef = useRef(null), promptRef = useRef(null), outRef = useRef(null), caretRef = useRef(null), badgeRef = useRef(null), shimRef = useRef(null);
  const dotsRef = useRef([]);
  const runRef = useRef(null), idxRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, cancelled = false, i = 0, phase = "think", pStart = 0;
    const CPS = 40, THINK = 520, HOLD = 2600;
    const setDots = (k0) => dotsRef.current.forEach((d, k) => {if (d) {d.style.background = k === k0 ? "var(--accent)" : "var(--line-strong)";d.style.width = k === k0 ? "20px" : "7px";}});
    const generating = (on) => {
      if (shimRef.current) shimRef.current.style.opacity = on ? "1" : "0";
      if (caretRef.current) caretRef.current.style.display = on ? "inline-block" : "none";
      if (badgeRef.current) badgeRef.current.style.opacity = on ? "0" : "1";
    };
    const startDemo = (idx) => {
      i = idx;phase = "think";pStart = performance.now();
      const d = LABOR_DEMOS[i];
      setDots(i);
      if (tagRef.current) tagRef.current.textContent = d.tag;
      if (promptRef.current) promptRef.current.textContent = d.prompt;
      if (outRef.current) outRef.current.textContent = "";
      generating(true);
      if (reduce) {if (outRef.current) outRef.current.textContent = d.out;generating(false);phase = "hold";}
    };
    // zeitbasiertes Tippen via rAF (robust gegen setTimeout-Drosselung)
    const frame = (now) => {
      if (cancelled) return;
      const d = LABOR_DEMOS[i], el = now - pStart;
      if (!reduce) {
        if (phase === "think") {
          if (el >= THINK) {phase = "type";pStart = now;}
        } else if (phase === "type") {
          const n = Math.floor(el * CPS / 1000);
          if (outRef.current) outRef.current.textContent = d.out.slice(0, Math.min(n, d.out.length));
          if (n >= d.out.length) {generating(false);phase = "hold";pStart = now;}
        } else if (phase === "hold") {
          if (el >= HOLD) startDemo((i + 1) % LABOR_DEMOS.length);
        }
      } else {
        if (el >= HOLD + 1900) startDemo((i + 1) % LABOR_DEMOS.length);
      }
      raf = requestAnimationFrame(frame);
    };
    runRef.current = () => startDemo((i + 1) % LABOR_DEMOS.length);
    const onVis = () => {if (!document.hidden && !cancelled) startDemo(i);};
    document.addEventListener("visibilitychange", onVis);
    startDemo(0);
    raf = requestAnimationFrame(frame);
    return () => {cancelled = true;cancelAnimationFrame(raf);document.removeEventListener("visibilitychange", onVis);};
  }, []);

  const onGenerate = () => {if (runRef.current) runRef.current();};
  const dot = (red) => ({ width: 9, height: 9, borderRadius: "50%", background: red ? "var(--accent)" : "var(--line-strong)" });

  return (
    <div style={{ position: "relative", borderRadius: 7, overflow: "hidden", background: "linear-gradient(180deg, rgba(22,30,52,.66), rgba(9,14,28,.62))", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 30px 90px rgba(0,0,0,.5), 0 0 60px color-mix(in srgb,var(--accent) 12%, transparent)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
      {/* Topbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: "1px solid var(--line)" }}>
        <span style={{ display: "flex", gap: 7 }}><span style={dot(true)} /><span style={dot(false)} /><span style={dot(false)} /></span>
        <span style={{ fontFamily: mono, fontSize: 12, letterSpacing: ".14em", color: "var(--muted)", textTransform: "uppercase" }}>KI-Labor · Live</span>
        <span ref={tagRef} style={{ marginLeft: "auto", fontFamily: mono, fontSize: 11.5, letterSpacing: ".06em", color: "var(--accent)", padding: "4px 11px", borderRadius: 999, boxShadow: "inset 0 0 0 1px color-mix(in srgb,var(--accent) 42%, transparent)" }}>Landingpage</span>
      </div>
      {/* Prompt */}
      <div style={{ display: "flex", gap: 10, padding: "16px 18px 12px", alignItems: "flex-start", borderBottom: "1px solid color-mix(in srgb,var(--line) 60%, transparent)" }}>
        <span style={{ color: "var(--accent)", fontFamily: mono, fontSize: 14, lineHeight: 1.5 }}>›</span>
        <span ref={promptRef} style={{ fontFamily: mono, fontSize: "clamp(12.5px,1.4vw,13.5px)", color: "var(--ink-dim)", lineHeight: 1.55 }}>…</span>
      </div>
      {/* Output */}
      <div style={{ position: "relative", padding: "16px 18px 18px", minHeight: "clamp(168px,24vh,220px)" }}>
        <span ref={outRef} style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.58, color: "var(--ink)", whiteSpace: "pre-wrap" }} />
        <span ref={caretRef} className="labor-caret" aria-hidden="true" style={{ display: "inline-block", width: 9, height: "1.05em", marginLeft: 2, transform: "translateY(2px)", background: "var(--accent)", boxShadow: "0 0 10px color-mix(in srgb,var(--accent) 70%, transparent)" }} />
        <span ref={shimRef} className="labor-scan" aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: "46%", opacity: 0, transition: "opacity .4s ease", pointerEvents: "none", background: "linear-gradient(180deg, transparent, color-mix(in srgb,var(--accent) 16%, transparent) 55%, transparent)" }} />
        <span ref={badgeRef} style={{ position: "absolute", right: 16, bottom: 13, opacity: 0, transition: "opacity .45s ease", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: mono, fontSize: 12, letterSpacing: ".04em", color: "var(--accent)" }}>fertig <Icon name="check" size={13} stroke={2.6} /></span>
      </div>
      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px", borderTop: "1px solid var(--line)" }}>
        <span style={{ display: "flex", gap: 7, alignItems: "center" }}>
          {[0, 1, 2].map((k) => <span key={k} ref={(el) => dotsRef.current[k] = el} style={{ width: k === 0 ? 20 : 7, height: 7, borderRadius: 999, background: k === 0 ? "var(--accent)" : "var(--line-strong)", transition: "width .35s ease, background .35s ease" }} />)}
        </span>
        <button className="btn btn-ghost" onClick={onGenerate} style={{ padding: "10px 18px", fontSize: 13.5 }}>Live generieren <Icon name="bolt" size={15} /></button>
      </div>
    </div>);

}

function KiLaborSection({ onBook }) {
  const sr = useScanReveal(2600);
  const proof = [["video", "Live-Demos statt Folien"], ["target", "Use Cases statt Theorie"], ["check", "100% Nachvollziehbarkeit"]];
  return (
    <section id="labor" className="mt-band" style={{ position: "relative", padding: "clamp(80px,11vw,150px) 0", overflow: "hidden", background: "linear-gradient(180deg,#0a1020,#05070e)" }} ref={sr.ref}>
      <HazardEdge thin animate style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
      <ScanFrame />
      {sr.playing && <span className="scan-reveal-line play" key={sr.run} aria-hidden="true" />}
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className={"scan-reveal-content" + (sr.playing ? " play" : "")} key={sr.run} style={{ "--scan-dur": "2600ms", opacity: sr.reduce ? 1 : sr.run > 0 ? undefined : 0 }}>
          <div className="labor-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: "clamp(30px,4.5vw,68px)", alignItems: "center" }}>
            {/* Einleitung */}
            <div>
              <Eyebrow num="// 03">KI-Labor</Eyebrow>
              <h2 style={{ fontSize: "clamp(30px,4.4vw,54px)", textWrap: "balance", lineHeight: 1.04, marginTop: 6 }}>Hier wird KI <span style={{ color: "var(--accent)" }}>sofort greifbar.</span></h2>
              <p className="lead" style={{ fontSize: "clamp(17px,1.9vw,21px)", maxWidth: 460, marginTop: 18, marginBottom: 26 }}>Keine Folien — eine offene Konsole. Wir geben einen echten Marketing-Auftrag, Sie sehen die Antwort live entstehen.</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", display: "grid", gap: 13 }}>
                {proof.map(([ic, t]) =>
                <li key={t} style={{ display: "flex", alignItems: "center", gap: 13, fontFamily: "Poppins", fontWeight: 500, fontSize: "clamp(14px,1.5vw,15.5px)", color: "var(--ink)" }}>
                    <span style={{ flex: "none", width: 38, height: 38, borderRadius: 2, display: "grid", placeItems: "center", color: "var(--accent)", boxShadow: "inset 0 0 0 1px var(--line-strong)" }}><Icon name={ic} size={18} /></span>{t}
                  </li>
                )}
              </ul>
              <button className="btn btn-cta" onClick={onBook}>Gespräch anfragen <Icon name="arrow" size={16} /></button>
            </div>
            {/* Live-Konsole */}
            <LiveConsole />
          </div>
        </div>
      </div>
      <HazardEdge thin animate style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />
    </section>);

}

/* ===================== Leistungen — alternierende Feature-Zeilen ===================== */
const gp = { position: "relative", borderRadius: 8, padding: 22, background: "var(--glass)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 24px 60px rgba(20,40,70,.10)", overflow: "hidden" };
const gpDark = { ...gp, background: "rgba(12,20,38,.55)" };

function GlasIcon({ kind }) {
  const wrap = { width: 54, height: 54, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", color: "var(--accent)", background: "linear-gradient(160deg, rgba(255,255,255,.18), rgba(255,255,255,.04))", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 10px 26px rgba(20,40,70,.16)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" };
  const c = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
  let inner;
  if (kind === "lupe") inner = <svg {...c}><circle cx="10.5" cy="10.5" r="6" /><path d="M14.8 14.8 20 20" /></svg>;
  else if (kind === "laptop") inner = <svg {...c}><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2.5 19h19" /></svg>;
  else if (kind === "linkedin") inner = <Icon name="linkedin" size={26} />;
  else if (kind === "quote") inner = <span style={{ fontFamily: '"EB Garamond", Georgia, serif', fontSize: 40, lineHeight: 1, marginTop: 14 }}>“</span>;
  else inner = <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 24 }}>@</span>;
  return <span style={wrap}>{inner}</span>;
}

/* selbstschreibende Mini-Konsole (rAF, reduced-motion = Endzustand) */
function MiniConsole({ text }) {
  const outRef = useRef(null), caretRef = useRef(null), shimRef = useRef(null);
  useEffect(() => {
    const el = outRef.current;if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {el.textContent = text;if (caretRef.current) caretRef.current.style.display = "none";if (shimRef.current) shimRef.current.style.opacity = "0";return;}
    let raf = 0, start = 0, started = false, cancelled = false;const CPS = 42;
    const inView = () => {const r = el.getBoundingClientRect(), vw = window.innerWidth || 1, vh = window.innerHeight || 1;const cx = r.left + r.width / 2, cy = r.top + r.height / 2;return cx > vw * 0.1 && cx < vw * 0.9 && cy > 0 && cy < vh;};
    const frame = (now) => {
      if (cancelled) return;
      if (!started && inView()) {started = true;start = now;if (shimRef.current) shimRef.current.style.opacity = "1";}
      if (started) {
        const n = Math.floor((now - start) * CPS / 1000);
        el.textContent = text.slice(0, Math.min(n, text.length));
        if (n >= text.length) {if (caretRef.current) caretRef.current.style.display = "none";if (shimRef.current) shimRef.current.style.opacity = "0";return;}
      }
      raf = requestAnimationFrame(frame);
    };
    el.textContent = "";raf = requestAnimationFrame(frame);
    return () => {cancelled = true;if (raf) cancelAnimationFrame(raf);};
  }, [text]);
  return (
    <div style={{ position: "relative" }}>
      <span ref={outRef} style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 1.5, color: "var(--ink)", whiteSpace: "pre-wrap" }} />
      <span ref={caretRef} className="labor-caret" aria-hidden="true" style={{ display: "inline-block", width: 8, height: "1.05em", marginLeft: 2, transform: "translateY(2px)", background: "var(--accent)", boxShadow: "0 0 10px color-mix(in srgb,var(--accent) 70%, transparent)" }} />
      <span ref={shimRef} className="labor-scan" aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: "62%", opacity: 0, pointerEvents: "none", background: "linear-gradient(180deg, transparent, color-mix(in srgb,var(--accent) 15%, transparent) 55%, transparent)" }} />
    </div>);

}

const monoLbl = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 11.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)" };

function AuditVisual() {
  const rows = [["Sichtbarkeit", 72], ["Kanal-Abdeckung", 58], ["SEO-Score", 64], ["Automatisierung", 41]];
  const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  return (
    <div style={{ ...gp, position: "relative", overflow: "hidden", padding: 0 }}>
      {/* digitales Raster */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--line-strong) 1px, transparent 1px), linear-gradient(90deg, var(--line-strong) 1px, transparent 1px)", backgroundSize: "26px 26px", opacity: 0.45, WebkitMaskImage: "radial-gradient(circle at 50% 38%, #000 55%, transparent 92%)", maskImage: "radial-gradient(circle at 50% 38%, #000 55%, transparent 92%)" }} />
      {/* laufende Scan-Linie */}
      <span className="audit-scan" aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 56, zIndex: 1, pointerEvents: "none", background: "linear-gradient(180deg, color-mix(in srgb,var(--accent) 22%, transparent), transparent)", borderTop: "1.5px solid var(--accent)", boxShadow: "0 0 18px color-mix(in srgb,var(--accent) 45%, transparent)" }} />
      <div style={{ position: "relative", zIndex: 2, padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }} className="audit-blink" />
          <span style={{ fontFamily: mono, fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink)" }}>Diagnose-Scan</span>
          <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 12, letterSpacing: ".1em", color: "var(--accent)" }}>● live</span>
        </div>
        {/* EKG / Puls-Linie (digital) */}
        <svg viewBox="0 0 320 48" width="100%" height="46" preserveAspectRatio="none" aria-hidden="true" style={{ display: "block", marginBottom: 18, overflow: "visible" }}>
          <polyline points="0,24 60,24 78,24 88,8 100,40 112,24 150,24 168,24 178,14 190,34 202,24 320,24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px color-mix(in srgb,var(--accent) 60%, transparent))" }} />
        </svg>
        <div style={{ display: "grid", gap: 13 }}>
          {rows.map(([label, val]) =>
          <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                <span style={{ fontFamily: mono, fontSize: 12.5, letterSpacing: ".04em", color: "var(--ink-dim)" }}>{label}</span>
                <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 13, color: "var(--accent)" }}><CountUp to={val} suffix="%" /></span>
              </div>
              {/* segmentierte Digital-Bar */}
              <div style={{ position: "relative", height: 10, borderRadius: 2, background: "repeating-linear-gradient(90deg, var(--line-strong) 0 7px, transparent 7px 11px)" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: val + "%", borderRadius: 2, background: "repeating-linear-gradient(90deg, var(--accent) 0 7px, color-mix(in srgb,var(--accent) 30%, transparent) 7px 11px)", boxShadow: "0 0 12px color-mix(in srgb,var(--accent) 40%, transparent)" }} />
              </div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, fontFamily: mono, fontSize: 12, color: "var(--ink)" }}>
          <Icon name="check" size={14} stroke={2.6} /><span>Befund: <span style={{ color: "var(--accent)" }}>3 Hebel</span> mit Sofortwirkung</span>
        </div>
      </div>
    </div>);

}
function GeoVisual() {
  return (
    <div style={gp}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
        <span style={{ color: "var(--accent)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 14 }}>›</span>
        <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "clamp(12.5px,1.4vw,13.5px)", color: "var(--ink-dim)", lineHeight: 1.5 }}>Welche Agentur macht KI-Marketing für den B2B-Mittelstand?</span>
      </div>
      <p style={{ fontSize: "clamp(15px,1.7vw,17px)", lineHeight: 1.6, color: "var(--ink)", marginTop: 14, marginBottom: 14 }}>Für KI-gestütztes B2B-Marketing wird unter anderem <strong style={{ color: "var(--accent)", background: "color-mix(in srgb,var(--accent) 12%, transparent)", padding: "1px 6px", borderRadius: 4 }}>team::mt</strong> genannt — mit 360°-Ansatz über Website, LinkedIn, SEO und Automatisierung.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["Quelle: team-mt.de", "zitiert in KI-Antwort", "Position 1"].map((t) =>
        <span key={t} style={{ fontFamily: "Poppins", fontSize: 11.5, padding: "5px 11px", borderRadius: 999, color: "var(--ink-dim)", boxShadow: "inset 0 0 0 1px var(--line-strong)" }}>{t}</span>
        )}
      </div>
    </div>);

}
function LinkedInVisual() {
  const stats = [["Impressions", 18400, ""], ["Profilaufrufe", 920, ""], ["Interaktion", 6, "%"]];
  return (
    <div style={gp}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 18 }}>
        <span style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(160deg, color-mix(in srgb,var(--accent) 18%, var(--glass)), var(--glass))", boxShadow: "inset 0 0 0 1px var(--glass-line)", display: "grid", placeItems: "center", color: "var(--accent)" }}><Icon name="linkedin" size={22} /></span>
        <div><div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 16 }}>team::mt</div><div style={{ color: "var(--muted)", fontSize: 13 }}>KI-Marketing · B2B</div></div>
        <span style={{ marginLeft: "auto", fontFamily: "Poppins", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--accent)" }}>stark</span>
      </div>
      <div style={{ display: "grid", gap: 13 }}>
        {stats.map(([label, to, suf]) =>
        <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}><span style={{ color: "var(--ink-dim)" }}>{label}</span><span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--ink)" }}><CountUp to={to} suffix={suf} /></span></div>
            <div style={{ height: 5, borderRadius: 9, background: "rgba(140,190,230,.16)", overflow: "hidden" }}><div style={{ height: "100%", width: label === "Interaktion" ? "62%" : label === "Profilaufrufe" ? "48%" : "82%", background: "var(--accent)", borderRadius: 9 }} /></div>
          </div>
        )}
      </div>
    </div>);

}
function LandingVisual() {
  return (
    <div style={gp}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 0 13px", borderBottom: "1px solid var(--line)", marginBottom: 16 }}>
        <span style={{ display: "flex", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent)" }} /><span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--line-strong)" }} /><span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--line-strong)" }} /></span>
        <span style={monoLbl}>Persona · CMO Mittelstand</span>
      </div>
      <MiniConsole text={"Endlich Marketing, das Ihre Quartalszahlen kennt.\n\nEine Landingpage, die genau Ihre Entscheider abholt — vom ersten Klick bis zur Demo."} />
    </div>);

}
function SocialVisual() {
  return (
    <div style={gp}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 0 13px", borderBottom: "1px solid var(--line)", marginBottom: 16 }}>
        <span style={{ color: "var(--accent)", fontFamily: "Poppins", fontWeight: 700, fontSize: 16 }}>@</span>
        <span style={monoLbl}>Social · Auto-Draft</span>
      </div>
      <MiniConsole text={"„Wir posten viel — aber wirkt das überhaupt?\u201c\n\nDrei Dinge, die wir ab sofort anders machen 👇"} />
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 18, flexWrap: "wrap" }}>
        {["Idee", "Entwurf", "Freigabe", "Post"].map((s, i) =>
        <React.Fragment key={s}>
            <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 12.5, padding: "6px 12px", borderRadius: 999, color: i === 3 ? "var(--cta-ink, #fff)" : "var(--ink-dim)", background: i === 3 ? "var(--accent)" : "rgba(140,190,230,.05)", boxShadow: "inset 0 0 0 1px " + (i === 3 ? "var(--accent)" : "var(--line-strong)") }}>{s}</span>
            {i < 3 && <span style={{ color: "var(--accent)", display: "inline-flex" }}><Icon name="arrow" size={14} /></span>}
          </React.Fragment>
        )}
      </div>
    </div>);

}

const CHAPTERS = [
  { img: "assets/leistungen/audit.png", num: "// 01", eyebrow: "KI-Audit", visual: AuditVisual,
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

/* Inhaltsblock eines Kapitels (Phase 3) — gleiche Struktur in allen fünf */
function ChapterContent({ d, onBook }) {
  return (
    <React.Fragment>
      <img data-inflow src={d.img} alt="" className="prozess-float" style={{ width: "clamp(66px,6.5vw,90px)", height: "auto", display: "block", marginBottom: 14, filter: "drop-shadow(0 12px 26px color-mix(in srgb,var(--accent) 40%, transparent))" }} />
      <Eyebrow num={d.num}>{d.eyebrow}</Eyebrow>
      <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(28px,3.6vw,48px)", lineHeight: 1.05, letterSpacing: "-.01em", textWrap: "balance" }}>{d.title}</h2>
      <p className="lead" style={{ fontSize: "clamp(16px,1.8vw,20px)", marginTop: 16, maxWidth: 480 }}>{d.sub}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 24 }}>
        <button className="btn btn-cta" onClick={onBook}>{d.cta} <Icon name="arrow" size={16} /></button>
        <span style={{ fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: "clamp(15px,1.7vw,18px)", color: "var(--accent)" }}>{d.result}</span>
      </div>
    </React.Fragment>);

}

/* Ein gepinntes Vollbild-Kapitel mit Icon-Takeover (GSAP ScrollTrigger-Pin, 3-Phasen-Scrub) */
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
    compute();window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    const stage = stageRef.current;if (!stage || !gsap || !ScrollTrigger) return;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const easeIO = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let revLocal = false;
    const paint = (p) => {
      const e = clamp(p / 0.35, 0, 1); // Phase 1: Eingang / Refraktions-Aufbruch
      const dk = clamp((p - 0.35) / 0.20, 0, 1); // Phase 2: Andocken
      const c = clamp((p - 0.55) / 0.40, 0, 1); // Phase 3: Inhalt
      // Beim Verkleinern wandert das Intro-Icon schon zur finalen In-flow-Position (über der Eyebrow),
      // pixelgenau via getBoundingClientRect — danach nahtloser Cross-Fade auf das In-flow-Icon.
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
        dx = tdx * k;dy = tdy * k;
      }
      if (iconRef.current) {
        iconRef.current.style.opacity = (clamp(e / 0.1, 0, 1) * (1 - c)).toFixed(3);
        iconRef.current.style.transform = "translate(calc(-50% + " + dx.toFixed(1) + "px), calc(-50% + " + dy.toFixed(1) + "px)) scale(" + scale.toFixed(3) + ")";
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
      if (want !== revLocal) {revLocal = want;setRev(want);}
    };
    const st = ScrollTrigger.create({
      trigger: stage, start: "top top",
      end: () => "+=" + window.innerHeight * 1.35,
      pin: true, pinSpacing: true,
      onUpdate: (self) => paint(self.progress) });

    paint(0);
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 450);window.addEventListener("load", refresh);
    return () => {clearTimeout(t);window.removeEventListener("load", refresh);st.kill();ScrollTrigger.refresh();};
  }, [enabled]);

  // Mobil / Reduced-Motion: kein Pin/Takeover — Icon mittelgroß oben, Inhalt + Visual darunter (Endzustand)
  if (!enabled) {
    return (
      <section className="sec-pad grid-bg" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(28px,4vw,64px)", alignItems: "center", flexDirection: flip ? "row-reverse" : "row" }}>
          <div style={{ flex: "1 1 360px", maxWidth: 520 }}>
            <ChapterContent d={d} onBook={onBook} />
          </div>
          <div style={{ flex: "1 1 400px", maxWidth: 540, width: "100%" }}><Vis /></div>
        </div>
      </section>);

  }

  return (
    <section className="grid-bg" style={{ borderTop: "1px solid var(--line)" }}>
      <div ref={stageRef} style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
        {/* weißer Lichtpunkt (Phase 1) */}
        <div ref={lightRef} aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "60vmin", height: "60vmin", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle, #fff 0%, rgba(255,255,255,.7) 18%, transparent 60%)", filter: "blur(8px)", opacity: 0, zIndex: 1, pointerEvents: "none" }} />
        {/* Refraktions-/Brechungsblitz (Phase 1) */}
        <div ref={flashRef} aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "72vmin", height: "72vmin", transform: "translate(-50%,-50%)", borderRadius: "50%", opacity: 0, zIndex: 2, pointerEvents: "none", mixBlendMode: "screen", background: "conic-gradient(from 0deg, transparent, color-mix(in srgb,var(--accent) 55%, transparent), #fff, color-mix(in srgb,var(--accent) 55%, transparent), transparent)", filter: "blur(14px)" }} />
        {/* großes Glas-Icon (transparentes Bild) */}
        <img ref={iconRef} src={d.img} alt={d.eyebrow} style={{ position: "absolute", left: "50%", top: "50%", width: "min(72vh,66vw)", height: "auto", transformOrigin: "center", transform: "translate(-50%,-50%) scale(0.14)", opacity: 0, zIndex: 4, pointerEvents: "none", filter: "drop-shadow(0 30px 60px color-mix(in srgb,var(--accent) 36%, transparent))", willChange: "transform, opacity" }} />
        <div ref={titleRef} aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", zIndex: 5, transform: "translate(-50%, 32vh)", textAlign: "center", opacity: 0, pointerEvents: "none", willChange: "opacity, transform" }}>
          <div style={{ fontFamily: '"EB Garamond", Georgia, serif', fontStyle: "italic", fontSize: "clamp(13px,1.4vw,17px)", letterSpacing: ".02em", color: "var(--muted)", marginBottom: 6 }}>{d.num.replace("// ", "")}</div>
          <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "clamp(26px,3.6vw,52px)", letterSpacing: "-.015em", color: "var(--ink)", lineHeight: 1.04 }}>{(() => { const t = d.eyebrow, i = Math.max(t.lastIndexOf("-"), t.lastIndexOf(" ")); const a = i > 0 ? t.slice(0, i + 1) : t, b = i > 0 ? t.slice(i + 1) : ""; return b ? <React.Fragment>{a}<span style={{ color: "var(--accent)" }}>{b}</span></React.Fragment> : t; })()}</div>
        </div>
        {/* Scan-Linie beim Eintritt in Phase 3 */}
        {rev && <span className="scan-reveal-line play" key={"line-" + d.num} aria-hidden="true" />}
        {/* Inhalt (Phase 3) — Text + Visual, Seite alterniert */}
        <div className="wrap" style={{ position: "relative", zIndex: 3, width: "100%" }}>
          <div ref={contentRef} style={{ opacity: 0, width: "100%", willChange: "opacity, transform" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(28px,4vw,64px)", alignItems: "center", flexDirection: flip ? "row-reverse" : "row" }}>
              <div style={{ flex: "1 1 360px", maxWidth: 520 }}><ChapterContent d={d} onBook={onBook} /></div>
              <div style={{ flex: "1 1 400px", maxWidth: 540, width: "100%" }}>{rev && <Vis />}</div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

let __lidxShown = false;
function LeistungenSection({ onBook }) {
  return (
    <React.Fragment>
      <div id="leistungen" />
      {CHAPTERS.map((d, i) => <LeistungChapter key={d.num} d={d} flip={i % 2 === 1} onBook={onBook} />)}
    </React.Fragment>);

}

/* Drei Pakete (#pakete) */
function PaketIcon({ kind }) {
  const c = { width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
  if (kind === "crane") return <svg {...c}><path d="M6 21V5M6 5h13M6 5 4 9h4z" /><path d="M18 5v5" /><path d="M16.7 10h2.6l-1.3 2.2z" /></svg>;
  if (kind === "lupe") return <svg {...c}><circle cx="10.5" cy="10.5" r="6" /><path d="M14.8 14.8 20 20" /></svg>;
  return <svg {...c} fill="currentColor" stroke="none"><path d="M9 7.2v9.6l8-4.8z" /></svg>;
}

function PaketCard({ kind, title, body, points, cta, onBook }) {
  const cardRef = useRef(null), glowRef = useRef(null), iconRef = useRef(null);
  const reduce = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onMove = (e) => {
    const el = cardRef.current;if (!el || reduce()) return;
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
  return (
    <div style={{ position: "relative", paddingTop: 40, height: "100%" }}>
      <div ref={iconRef} style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%) translateY(-50%)", zIndex: 3, width: 76, height: 76, borderRadius: "50%", display: "grid", placeItems: "center", color: "var(--accent)", background: "linear-gradient(160deg, rgba(255,255,255,.92), rgba(255,255,255,.55))", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 18px 40px rgba(20,40,70,.20), 0 0 0 6px color-mix(in srgb,var(--accent) 7%, transparent)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", transition: "transform .3s cubic-bezier(.2,.8,.2,1)" }}>
        <PaketIcon kind={kind} />
      </div>
      <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave} style={{ position: "relative", overflow: "hidden", borderRadius: 7, padding: "56px 28px 30px", background: "var(--glass)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 24px 60px rgba(20,40,70,.10)", transformStyle: "preserve-3d", transition: "transform .45s cubic-bezier(.2,.8,.2,1), box-shadow .4s", height: "100%", display: "flex", flexDirection: "column", textAlign: "center" }}>
        <div ref={glowRef} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "transparent", transition: "background .25s" }} />
        <h3 style={{ fontSize: 22, marginBottom: 10 }}>{title}</h3>
        <p style={{ color: "var(--ink-dim)", fontSize: 14.5, lineHeight: 1.55, margin: "0 auto", maxWidth: 286 }}>{body}</p>
        <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 26px", display: "grid", gap: 10, textAlign: "left" }}>
          {points.map((p) =>
          <li key={p} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--ink)" }}><span style={{ color: "var(--accent)", flex: "none", display: "inline-flex" }}><Icon name="check" size={15} stroke={2.4} /></span>{p}</li>
          )}
        </ul>
        <button className="btn btn-cta" style={{ marginTop: "auto", width: "100%" }} onClick={onBook}>{cta} <Icon name="arrow" size={15} /></button>
      </div>
    </div>);

}

function DreiPaketeSection({ onBook }) {
  return (
    <section id="pakete" className="sec-pad grid-bg">
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <Reveal style={{ textAlign: "center", marginBottom: 64, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow num="// 04">Pakete</Eyebrow></div>
          <h2 style={{ fontSize: "clamp(30px,4.4vw,52px)", textWrap: "balance" }}>Klar geschnürt. <span style={{ color: "var(--accent)" }}>Sofort startklar.</span></h2>
        </Reveal>
        <div className="capgrid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26 }}>
          <Reveal><PaketCard kind="crane" title="Persona-Landingpage" cta="Mit der Landingpage starten" onBook={onBook}
            body="Eine zielgruppengenaue Landingpage — mit KI von Briefing bis Go-Live."
            points={["In 5 Tagen live", "KI-getextet & gestaltet", "Conversion-optimiert"]} /></Reveal>
          <Reveal delay={90}><PaketCard kind="lupe" title="SEO-Package" cta="Jetzt Wettbewerber überholen" onBook={onBook}
            body="Damit Sie gefunden werden, wo Ihre Kunden suchen — und wo KI-Suche antwortet."
            points={["Technik, Content & Struktur", "Sichtbar in der KI-Suche", "Mehr organische Reichweite"]} /></Reveal>
          <Reveal delay={180}><PaketCard kind="play" title="LinkedIn Creator Package" cta="LinkedIn sichtbar machen" onBook={onBook}
            body="Content, der Ihre Expertise sichtbar macht und kontinuierlich Reichweite aufbaut."
            points={["Vom Profil bis zum Redaktionsplan", "Content mit System", "Kontinuierliche Reichweite"]} /></Reveal>
        </div>
      </div>
    </section>);

}

/* So arbeiten wir (#prozess) — Scrollytelling-Schritte */
/* Zähler, der bei Sichtbarkeit hochläuft (rAF, getBoundingClientRect — funktioniert auch im gepinnten Scroll) */
function CountUp({ to, prefix = "", suffix = "", dur = 1500 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {el.textContent = prefix + to + suffix;return;}
    let raf = 0, startT = 0, started = false, cancelled = false;
    const inView = () => {
      const r = el.getBoundingClientRect(), vw = window.innerWidth || 1, vh = window.innerHeight || 1;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      return cx > vw * 0.12 && cx < vw * 0.88 && cy > 0 && cy < vh;
    };
    const frame = (now) => {
      if (cancelled) return;
      if (!started && inView()) {started = true;startT = now;}
      if (started) {
        const p = Math.min(1, (now - startT) / dur);
        el.textContent = prefix + Math.round(to * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p >= 1) {raf = 0;return;}
      }
      raf = requestAnimationFrame(frame);
    };
    el.textContent = prefix + "0" + suffix;
    raf = requestAnimationFrame(frame);
    return () => {cancelled = true;if (raf) cancelAnimationFrame(raf);};
  }, []);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

/* Glas-Token, der sich pro Station verwandelt */
function ProzessToken({ form }) {
  const stage = { position: "relative", width: "clamp(208px,30vmin,300px)", height: "clamp(208px,30vmin,300px)", flex: "none" };
  const glass = { position: "absolute", inset: 0, borderRadius: "clamp(18px,3.4vmin,30px)", background: "linear-gradient(150deg, var(--glass), color-mix(in srgb,var(--glass) 40%, transparent))", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 28px 70px rgba(0,0,0,.16)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflow: "hidden" };
  const center = { position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--accent)" };

  if (form === "analyse") {
    return (
      <div className="prozess-float" style={stage}>
        <div style={glass}>
          <div aria-hidden="true" style={{ position: "absolute", left: "22%", top: "26%", width: "56%", height: "56%", borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, color-mix(in srgb,var(--accent) 60%, transparent), transparent 70%)", filter: "blur(17px)", opacity: 0.7 }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }} />
        </div>
        <div style={center}><Icon name="scan" size={64} stroke={1.3} /></div>
      </div>);

  }
  if (form === "strategie") {
    return (
      <div className="prozess-float" style={stage}>
        <div style={Object.assign({}, glass, { boxShadow: "inset 0 0 0 1.5px color-mix(in srgb,var(--accent) 45%, var(--glass-line)), 0 28px 70px rgba(0,0,0,.16)" })}>
          <div aria-hidden="true" style={{ position: "absolute", inset: "16%", backgroundImage: "linear-gradient(var(--line-strong) 1px, transparent 1px), linear-gradient(90deg, var(--line-strong) 1px, transparent 1px)", backgroundSize: "calc(100%/4) calc(100%/4)", opacity: 0.6 }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: "16%", boxShadow: "inset 0 0 0 1px color-mix(in srgb,var(--accent) 35%, transparent)" }} />
        </div>
        <div style={center}><Icon name="target" size={62} stroke={1.4} /></div>
      </div>);

  }
  if (form === "umsetzung") {
    const card = (i) => ({ position: "absolute", left: "50%", top: "50%", width: "62%", height: "30%", borderRadius: "clamp(8px,1.6vmin,14px)", background: "linear-gradient(150deg, color-mix(in srgb,var(--accent) 14%, var(--glass)), var(--glass))", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 10px 24px rgba(0,0,0,.16)", transform: "translate(-50%,-50%) translateY(" + (i * 26 - 26) + "px) rotate(" + (i - 1) * 1.5 + "deg)" });
    return (
      <div className="prozess-float" style={stage}>
        <div style={glass} />
        <div style={card(2)} aria-hidden="true" />
        <div style={card(1)} aria-hidden="true" />
        <div style={Object.assign(card(0), { display: "grid", placeItems: "center", color: "var(--accent)" })}><Icon name="bolt" size={28} /></div>
        <div style={{ position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%) rotate(-90deg)", color: "var(--accent)", opacity: 0.85 }}><Icon name="arrow" size={26} /></div>
      </div>);

  }
  // optimierung
  return (
    <div className="prozess-float" style={stage}>
      <div style={Object.assign({}, glass, { background: "linear-gradient(150deg, color-mix(in srgb,var(--accent) 24%, var(--glass)), color-mix(in srgb,var(--accent) 8%, var(--glass)))", boxShadow: "inset 0 0 0 1px color-mix(in srgb,var(--accent) 40%, var(--glass-line)), 0 28px 80px color-mix(in srgb,var(--accent) 22%, transparent)" })}>
        <span className="prozess-gloss" aria-hidden="true" style={{ position: "absolute", top: "-30%", left: 0, width: "40%", height: "160%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent)" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <span style={{ color: "var(--accent)", transform: "rotate(-90deg)" }}><Icon name="arrow" size={30} stroke={2.2} /></span>
        <span className="display" style={{ fontSize: "clamp(34px,5vw,52px)", color: "var(--accent)", lineHeight: 1 }}><CountUp to={38} prefix="+" suffix="%" /></span>
        <span style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 13, letterSpacing: ".04em", color: "var(--ink-dim)" }}>Conversion</span>
      </div>
    </div>);

}

/* Eine Prozess-Station (Panel im HorizontalScroll), Inhalt via useScanReveal */
function ProzessStation({ num, label, title, body, form }) {
  const sr = useScanReveal(2200);
  return (
    <section className="grid-bg" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", borderTop: "1px solid var(--line)" }} ref={sr.ref}>
      {sr.playing && <span className="scan-reveal-line play" key={sr.run} aria-hidden="true" />}
      <div className="wrap" style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div className={"scan-reveal-content" + (sr.playing ? " play" : "")} key={sr.run} style={{ "--scan-dur": "2200ms", opacity: sr.reduce ? 1 : sr.run > 0 ? undefined : 0 }}>
          <div className="prozess-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: "clamp(28px,5vw,72px)", alignItems: "center", justifyItems: "center" }}>
            <ProzessToken form={form} />
            <div style={{ maxWidth: 440 }}>
              <Eyebrow num={num}>{label}</Eyebrow>
              <h2 style={{ fontSize: "clamp(30px,4.2vw,52px)", textWrap: "balance", lineHeight: 1.05, marginTop: 6 }}>{title}</h2>
              <p className="lead" style={{ fontSize: "clamp(17px,1.9vw,21px)", marginTop: 16 }}>{body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* So arbeiten wir (#prozess) — vier Prozess-Stationen im HorizontalScroll */
function SoArbeitenWir() {
  return (
    <HorizontalScroll labels={["Analyse", "Strategie", "Umsetzung", "Optimierung"]} hid="prozess" gkey="__hscrollProc">
      <ProzessStation num="// 01" label="Analyse" form="analyse" title="Erst verstehen, dann handeln." body="Wir prüfen Sichtbarkeit, Kanäle und Potenziale — datenbasiert und ohne Schönfärberei." />
      <ProzessStation num="// 02" label="Strategie" form="strategie" title="Ein klarer 360°-Plan." body="Aus den Erkenntnissen werden Prioritäten, Kanäle und Botschaften — scharf umrissen." />
      <ProzessStation num="// 03" label="Umsetzung" form="umsetzung" title="Aus Plan wird Asset." body="Content, Kampagnen und Automatisierungen — mit KI schneller produziert und ausgespielt." />
      <ProzessStation num="// 04" label="Optimierung" form="optimierung" title="Messen. Lernen. Steigern." body="Wir justieren laufend nach — Marketing, das mit jeder Woche messbar besser wird." />
    </HorizontalScroll>);

}

/* Vertrauen / Team (#team) — Kennzahl-Band (reuse .mt-module/.mt-flip) */
function MtCell({ value, unit }) {
  return (
    <div className="mt-module">
      <div className="mt-num">{value}</div>
      <div className="mt-unit">{unit}</div>
    </div>);

}
function VertrauenSection({ onBook }) {
  const sr = useScanReveal(2200);
  return (
    <section id="team" className="grid-bg" style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden", padding: "clamp(90px,12vw,160px) 0" }} ref={sr.ref}>
      <ScanFrame />
      {sr.playing && <span className="scan-reveal-line play" key={sr.run} aria-hidden="true" />}
      <div className="wrap" style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 920, marginLeft: "auto", marginRight: "auto" }}>
        <div className={"scan-reveal-content" + (sr.playing ? " play" : "")} key={sr.run} style={{ "--scan-dur": "2200ms", opacity: sr.reduce ? 1 : sr.run > 0 ? undefined : 0 }}>
          <div style={{ display: "flex", justifyContent: "center" }}><Eyebrow num="// 06">Team & Erfahrung</Eyebrow></div>
          <h2 style={{ fontSize: "clamp(32px,5vw,60px)", lineHeight: 1.04, marginBottom: 42, textWrap: "balance" }}>Erfahrung, die <span style={{ color: "var(--accent)" }}>Zukunft möglich macht.</span></h2>

          <div className="mt-modules mt-band-light" style={{ marginBottom: 46 }}>
            <MtCell value={<CountUp to={33} />} unit="Jahre B2B" />
            <MtCell value={<span className="mt-flip" style={{ display: "inline-block" }}>360°</span>} unit="alle Kanäle" />
            <MtCell value={<CountUp to={5} />} unit="Tage bis live" />
            <div className="mt-module" style={{ display: "grid", placeItems: "center", minWidth: 92 }}>
              <span style={{ color: "var(--accent)", display: "inline-flex", transform: "rotate(-90deg)" }}><Icon name="arrow" size={34} stroke={2.2} /></span>
              <div className="mt-unit" style={{ marginTop: 11 }}>Wachstum</div>
            </div>
          </div>

          <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(24px,3.4vw,42px)", lineHeight: 1.1, letterSpacing: "-.01em", textWrap: "balance", maxWidth: 760, margin: "0 auto 34px" }}>Innovation braucht Mut. <span style={{ color: "var(--accent)" }}>Wir bringen ihn mit.</span></div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn btn-cta" onClick={onBook}>Termin vereinbaren <Icon name="arrow" size={16} /></button>
            <a className="btn btn-ghost" href="https://team-mt.de" target="_blank" rel="noopener noreferrer">team-mt.de</a>
          </div>
        </div>
      </div>
    </section>);

}

/* Buchung (#kontakt) — wiederkehrende Erstgespräch-Slots: erst Datum, dann Uhrzeit */
const tmtInp = { background: "rgba(140,190,230,.05)", border: "1px solid var(--line-strong)", borderRadius: 2, padding: "12px 14px", color: "var(--ink)", fontFamily: "Poppins", fontSize: 14, outline: "none", minWidth: 0, maxWidth: "100%" };
const BOOK_TIMES = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const BOOK_CAP = 2;
const DOW = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MON = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
function nextBusinessDays(n) {
  const out = [], base = new Date();base.setHours(0, 0, 0, 0);
  let i = 0;
  while (out.length < n && i < 30) {
    i++;const x = new Date(base);x.setDate(base.getDate() + i);
    const wd = x.getDay();if (wd === 0 || wd === 6) continue;
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
  const [avail, setAvail] = useState(null); // live: { "09:00": remaining }
  const [taken, setTaken] = useState({});   // demo: "iso|time" -> gebucht
  const [form, setForm] = useState({ name: "", email: "", company: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let on = true;
    if (!live) return;
    setAvail(null);
    (async () => {
      try {
        const rows = await window.KIWBooking.loadAvailability(selDate);
        if (on) setAvail((rows || []).reduce((m, r) => {m[r.label] = r.remaining;return m;}, {}));
      } catch (e) {if (on) setError("Verfügbarkeit konnte nicht geladen werden. Bitte Seite neu laden.");}
    })();
    return () => {on = false;};
  }, [selDate, live]);

  const remaining = (t) => live ? avail ? avail[t] != null ? avail[t] : 0 : null : BOOK_CAP - (taken[selDate + "|" + t] || 0);
  const valid = selDate && selTime && form.name.trim() && /\S+@\S+\.\S+/.test(form.email);
  const selLabel = () => {const d = dates.find((x) => x.iso === selDate);return d ? d.dow + " " + d.dom + ". " + d.mon : "";};

  async function submit() {
    if (!valid || submitting) return;
    setError(null);setSubmitting(true);
    try {
      if (live) {
        const r = await window.KIWBooking.bookSlot(selDate, selTime, form.name.trim(), form.email.trim(), form.company.trim(), form.note.trim());
        if (r === "ok") setDone(true);else
        if (r === "full") {setError("Dieser Termin ist gerade belegt. Bitte wählen Sie einen anderen.");setSelTime(null);} else
        setError("Dieser Termin ist nicht mehr verfügbar.");
      } else {
        const k = selDate + "|" + selTime;
        if (BOOK_CAP - (taken[k] || 0) <= 0) setError("Belegt — bitte anderen Termin wählen.");else
        {setTaken((m) => ({ ...m, [k]: (m[k] || 0) + 1 }));setDone(true);}
      }
    } catch (e) {setError("Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.");} finally
    {setSubmitting(false);}
  }

  const shell = { position: "relative", borderRadius: 7, background: "var(--glass)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 30px 80px rgba(20,40,70,.12)", overflow: "hidden" };

  if (done) {
    return (
      <div style={shell}>
        <div style={{ textAlign: "center", padding: "58px 26px" }}>
          <div style={{ width: 62, height: 62, margin: "0 auto 20px", borderRadius: "50%", display: "grid", placeItems: "center", color: "var(--accent)", boxShadow: "inset 0 0 0 1px var(--accent), 0 0 30px color-mix(in srgb,var(--accent) 22%, transparent)" }}><Icon name="check" size={28} stroke={2.4} /></div>
          <h3 style={{ fontSize: 23, marginBottom: 10 }}>Termin angefragt</h3>
          <p style={{ color: "var(--ink-dim)", fontSize: 15, maxWidth: 360, margin: "0 auto" }}>{selLabel()} · {selTime} Uhr — wir bestätigen Ihr Erstgespräch per E-Mail.</p>
          <button className="btn btn-ghost" style={{ marginTop: 24 }} onClick={() => {setDone(false);setSelTime(null);setForm({ name: "", email: "", company: "", note: "" });}}>Weiteren Termin wählen</button>
        </div>
      </div>);

  }

  return (
    <div style={shell}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--accent)" }}><Icon name="cal" size={18} /><span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>Erstgespräch · 30 Min</span></span>
        <span style={{ fontFamily: "Poppins", fontSize: 11, letterSpacing: ".18em", color: "var(--muted)", textTransform: "uppercase" }}>kostenlos · remote</span>
      </div>
      <div style={{ padding: 22 }}>
        {/* Schritt 1 — Datum */}
        <div style={{ fontFamily: "Poppins", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 11 }}>1 · Tag wählen</div>
        <div style={{ display: "flex", gap: 9, overflowX: "auto", paddingBottom: 6, marginBottom: 20 }}>
          {dates.map((d) => {
            const sel = d.iso === selDate;
            return (
              <button key={d.iso} onClick={() => {setSelDate(d.iso);setSelTime(null);setError(null);}}
                style={{ flex: "none", width: 62, padding: "10px 0", borderRadius: 4, cursor: "pointer", textAlign: "center", background: sel ? "var(--accent)" : "rgba(140,190,230,.05)", color: sel ? "var(--cta-ink, #fff)" : "var(--ink-dim)", border: "1px solid " + (sel ? "var(--accent)" : "var(--line-strong)"), transition: "all .2s" }}>
                <span style={{ display: "block", fontFamily: "Poppins", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", opacity: .8 }}>{d.dow}</span>
                <span style={{ display: "block", fontFamily: "Poppins", fontWeight: 700, fontSize: 19, lineHeight: 1.1 }}>{d.dom}</span>
                <span style={{ display: "block", fontSize: 10.5, opacity: .7 }}>{d.mon}</span>
              </button>);

          })}
        </div>
        {/* Schritt 2 — Uhrzeit */}
        <div style={{ fontFamily: "Poppins", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 11 }}>2 · Uhrzeit wählen</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9, marginBottom: 20 }}>
          {BOOK_TIMES.map((t) => {
            const rem = remaining(t);const full = rem != null && rem <= 0;const sel = t === selTime;
            return (
              <button key={t} disabled={full} onClick={() => {setSelTime(t);setError(null);}} title={full ? "Belegt" : rem != null ? rem + " frei" : ""}
                style={{ padding: "11px 6px", borderRadius: 4, cursor: full ? "not-allowed" : "pointer", fontFamily: "Poppins", fontWeight: 600, fontSize: 14, background: full ? "rgba(140,190,230,.03)" : sel ? "var(--accent)" : "rgba(140,190,230,.05)", color: full ? "var(--muted)" : sel ? "var(--cta-ink, #fff)" : "var(--ink-dim)", border: "1px solid " + (sel ? "var(--accent)" : "var(--line-strong)"), transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                {t}
                {full ? <span style={{ fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase" }}>belegt</span> :
                <span style={{ display: "flex", gap: 3 }} aria-hidden="true">{Array.from({ length: BOOK_CAP }).map((_, i) => <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: rem == null || i < rem ? sel ? "var(--cta-ink, #fff)" : "var(--accent)" : "rgba(140,190,230,.3)" }} />)}</span>}
              </button>);

          })}
        </div>
        {/* Kontaktdaten */}
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr", marginBottom: 10 }}>
          <input placeholder="Name" aria-label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={tmtInp} />
          <input placeholder="Unternehmen" aria-label="Unternehmen" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={tmtInp} />
        </div>
        <input placeholder="E-Mail" aria-label="E-Mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ ...tmtInp, width: "100%", marginBottom: 16 }} />
        {error && <div role="alert" style={{ display: "flex", gap: 9, alignItems: "flex-start", color: "var(--accent)", fontSize: 13, marginBottom: 14 }}><Icon name="cone" size={15} /><span>{error}</span></div>}
        <button className="btn btn-cta" style={{ width: "100%", opacity: valid && !submitting ? 1 : .45, pointerEvents: valid && !submitting ? "auto" : "none" }} onClick={submit}>{submitting ? "Wird angefragt …" : <React.Fragment>Termin anfragen <Icon name="arrow" size={16} /></React.Fragment>}</button>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, marginTop: 14, marginBottom: 0 }}>{live ? "Echtzeit-Verfügbarkeit · Bestätigung per E-Mail" : "Wöchentlich wiederkehrende Termine · Bestätigung per E-Mail"}</p>
      </div>
    </div>);

}

function BookingSection() {
  return (
    <section id="kontakt" className="sec-pad">
      <div className="wrap bookgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }}>
        <Reveal>
          <Eyebrow num="// 07">Erstgespräch</Eyebrow>
          <h2 style={{ fontSize: "clamp(32px,4.6vw,56px)", marginBottom: 20, textWrap: "balance" }}>Lernen wir uns <span style={{ color: "var(--accent)" }}>kennen.</span></h2>
          <p className="lead" style={{ fontSize: 17, marginBottom: 30, maxWidth: 440 }}>30 Minuten, unverbindlich: Sie schildern Ihre Ziele, wir zeigen den schnellsten Hebel mit KI. Wählen Sie einfach einen Tag und eine Uhrzeit.</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
            {[["target", "360°-Blick über alle Kanäle"], ["bolt", "KI-gestützt, schneller umgesetzt"], ["check", "Messbar statt Bauchgefühl"]].map(([ic, tx]) =>
            <li key={tx} style={{ display: "flex", gap: 14, alignItems: "center", color: "var(--ink)", fontSize: 15.5 }}>
                <span style={{ width: 38, height: 38, flex: "none", borderRadius: 2, display: "grid", placeItems: "center", color: "var(--accent)", boxShadow: "inset 0 0 0 1px var(--line-strong)" }}><Icon name={ic} size={18} /></span>{tx}
              </li>
            )}
          </ul>
        </Reveal>
        <Reveal delay={120}><ErstgesprachBooking /></Reveal>
      </div>
    </section>);

}

/* Abschluss-CTA — Verlaufs-Blobs laufen hinter dem CTA zusammen */
function AbschlussCTA({ onBook }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "clamp(96px,14vw,180px) 0", borderTop: "1px solid var(--line)" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <span className="cta-blob cta-blob1" style={{ left: "50%", top: "50%", width: "46vmax", height: "46vmax", background: "radial-gradient(circle, color-mix(in srgb,var(--accent) 60%, transparent), transparent 70%)" }} />
        <span className="cta-blob cta-blob2" style={{ left: "50%", top: "50%", width: "38vmax", height: "38vmax", background: "radial-gradient(circle, color-mix(in srgb,var(--accent) 40%, transparent), transparent 70%)" }} />
        <span className="cta-blob cta-blob3" style={{ left: "50%", top: "50%", width: "30vmax", height: "30vmax", background: "radial-gradient(circle, color-mix(in srgb,#2a6fdb 40%, transparent), transparent 70%)" }} />
      </div>
      <Reveal className="wrap" style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
        <h2 style={{ fontSize: "clamp(34px,5.4vw,68px)", lineHeight: 1.02, textWrap: "balance", marginBottom: 30 }}>Bereit für Marketing, <span style={{ color: "var(--accent)" }}>das mehr kann?</span></h2>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn btn-cta" onClick={onBook}>Termin vereinbaren <Icon name="arrow" size={16} /></button>
          <button className="btn btn-ghost" onClick={onBook}>KI-Werkstatt anfragen</button>
        </div>
      </Reveal>
    </section>);

}

/* Footer (Agentur) */
const tmtFHead = { fontFamily: "Poppins", fontSize: 11.5, letterSpacing: ".24em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 18 };
function SiteFooter({ onBook }) {
  return (
    <footer style={{ position: "relative", borderTop: "1px solid var(--line)", paddingTop: 64, paddingBottom: 48 }}>
      <div className="wrap">
        <div className="footgrid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 40, alignItems: "start", marginBottom: 54 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
              <img src="assets/logo.png" alt="team::mt" style={{ width: 40, height: 40 }} />
              <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 20 }}>team<span style={{ color: "var(--accent)" }}>::</span>mt</span>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 320, margin: 0 }}>KI-Marketing-Agentur aus München. 33 Jahre B2B-Erfahrung, neu gedacht mit KI und 360°-Blick über alle Kanäle.</p>
          </div>
          <div>
            <div style={tmtFHead}>Navigation</div>
            {[["Ansatz", "ansatz"], ["KI-Labor", "labor"], ["Pakete", "pakete"], ["Team", "team"]].map(([l, id]) =>
            <a key={id} href={"#" + id} onClick={(e) => {e.preventDefault();scrollToId(id);}} style={{ display: "block", color: "var(--ink-dim)", fontSize: 14.5, marginBottom: 12 }}>{l}</a>
            )}
          </div>
          <div>
            <div style={tmtFHead}>Kontakt</div>
            <p style={{ color: "var(--ink-dim)", fontSize: 14, marginTop: 0, marginBottom: 18 }}>Lassen Sie uns über Ihr Marketing sprechen.</p>
            <button className="btn btn-cta" onClick={onBook}>Gespräch anfragen <Icon name="arrow" size={16} /></button>
          </div>
        </div>
        <NeonDivider />
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 22, color: "var(--muted)", fontSize: 12.5, fontFamily: "Poppins", letterSpacing: ".05em" }}>
          <span>© 2026 team::mt</span>
          <span>KI-Marketing-Agentur · München</span>
        </div>
      </div>
    </footer>);

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
    const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Calmer feel: lower lerp = longer, smoother glide; reduced wheel/touch
    // multipliers so each scroll input travels less and nothing feels frantic.
    const lenis = new window.Lenis({
      lerp: 0.06,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
      smoothWheel: true,
    });
    window.__lenis = lenis;

    if (ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000); // gsap ticker gives seconds, lenis wants ms
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
      setTimeout(() => {b.style.display = "none";}, 650);
    }, 250);
    return () => clearTimeout(id);
  }, []);

  // (2) headline typewriter — types each h2/.display in (like the hero H1) on first view
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const all = document.querySelectorAll("h2,.display");
    const els = [...all].filter((el) => !el.closest(".scan-reveal-content, #hwrap, .mt-band, [data-notype]"));
    if (!els.length) return;
    const typeIn = (el, speed) => {
      if (el.dataset.tw) return; el.dataset.tw = "1";
      const chars = [];
      (function walk(node) {
        [...node.childNodes].forEach((ch) => {
          if (ch.nodeType === 3) {
            const frag = document.createDocumentFragment();
            for (const c of ch.textContent) {
              const s = document.createElement("span");
              s.className = "tw-ch"; s.textContent = c;
              frag.appendChild(s); chars.push(s);
            }
            node.replaceChild(frag, ch);
          } else if (ch.nodeType === 1 && ch.tagName !== "BR") { walk(ch); }
        });
      })(el);
      if (!chars.length) return;
      const caret = document.createElement("span");
      caret.className = "tw-caret2"; caret.textContent = "▍"; caret.setAttribute("aria-hidden", "true");
      chars[0].before(caret);
      let i = 0;
      const step = () => {
        if (i < chars.length) {
          chars[i].classList.add("on");
          chars[i].after(caret);
          i++; setTimeout(step, speed);
        } else { caret.remove(); }
      };
      setTimeout(step, 90);
    };
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { typeIn(e.target, 26); io.unobserve(e.target); }
    }), { threshold: 0.3 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // (4) scroll-triggered dark->light section theme switch
  useEffect(() => {
    const els = document.querySelectorAll("[data-theme-shift]");
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle("lit", e.isIntersecting && e.intersectionRatio > 0.45));
    }, { threshold: [0, 0.45, 0.7, 1] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const goBook = useCallback(() => scrollToId("kontakt"), []);
  const goBookFocus = useCallback(() => {
    scrollToId("kontakt");
    setTimeout(() => {const el = document.querySelector("#kontakt input");if (el) try {el.focus({ preventScroll: true });} catch (e) {el.focus();}}, 650);
  }, []);

  return (
    <React.Fragment>
      <HeroBootReveal />
      <TopBar onBook={goBook} />
      <Hero tweaks={t} onBook={goBook} />
      <UeberleitBand />
      <GlassRing360 onBook={goBook} />
      <ScanCut />
      <LeistungenSection onBook={goBook} />
      <ScanCut />
      <DreiPaketeSection onBook={goBook} />
      <ScanCut />
      <SoArbeitenWir />
      <ScanCut />
      <VertrauenSection onBook={goBook} />
      <TrustStrip />
      <Marquee items={CONTENT.marquee} />
      <ScanCut />
      <KiLaborSection onBook={goBook} />
      <ScanCut />
      <BookingSection />
      <ScanCut />
      <AbschlussCTA onBook={goBook} />
      <SiteFooter onBook={goBook} />
      <StickyCTA onBook={goBook} />
      <GlobalScanCursor />

      <TweaksPanel>
        <TweakSection label="Farben" />
        <TweakColor label="Leitfarbe" value={t.accentPair}
        options={[["#db0a30", "#06d6a0"], ["#e23a2e", "#06d6a0"], ["#c81d4a", "#1fb6ff"], ["#0a8d83", "#12a06a"]]}
        onChange={(v) => setTweak("accentPair", v)} />
        <TweakColor label="CTA-Farbe" value={t.cta}
        options={["#db0a30", "#e23a2e", "#ff5a3c", "#c20029"]}
        onChange={(v) => setTweak("cta", v)} />
        <TweakSection label="Hero" />
        <TweakRadio label="Hero-Stil" value={t.heroStyle} options={["Overall", "Mond", "Station", "Parallax"]} onChange={(v) => setTweak("heroStyle", v)} />
        <TweakRadio label="Intensität" value={t.intensity} options={["Ruhig", "Standard", "Maximal"]} onChange={(v) => setTweak("intensity", v)} />
      </TweaksPanel>
    </React.Fragment>);

}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);