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
    date: "2026-06-25", // ISO-Datum, geht 1:1 an Supabase
    dateLabel: "Do · 25. Juni 2026",
    slotMinutes: 10,
    capacity: 3, // wie oft jeder Slot vergeben werden kann
    blocks: [
    { label: "Früher Nachmittag", start: "13:15", end: "14:15" },
    { label: "Später Nachmittag", start: "15:30", end: "16:30" }]

  },
  marquee: ["GEO-Check", "LinkedIn-Check", "KI-Videos", "KI-Automatisierung", "Social-Media-Content", "360°-KI-Marketing", "Live an Stand 14"]
};

/* ==================== TWEAK-DEFAULTS ==================== */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentPair": ["#1fe6d2", "#46ff9e"],
  "cta": "#ff2f86",
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
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="#top" onClick={(e) => {e.preventDefault();smoothScrollTo(0);}} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="assets/logo.png" alt="KI-Werkstatt" style={{ width: 30, height: 30 }} />
          <span className="display" style={{ fontSize: 16, letterSpacing: ".02em" }}>KI-Werkstatt</span>
        </a>
        <div className="topbar-right" style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div className="tik-lockup tik-badge" style={{ gap: 11 }}>
            <span className="tik-lockup-lbl" style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>Live auf dem</span>
            <img src="assets/tik-logo-white.png" alt="Tag der Industriekommunikation" style={{ height: 24, width: "auto", display: "block" }} />
          </div>
          <span className="tik-lockup-div" style={{ width: 1, height: 26, background: "var(--line-strong)" }} />
          <button className="btn btn-cta topbar-cta" style={{ padding: "11px 20px", fontSize: 14 }} onClick={onBook}>Slot sichern</button>
        </div>
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

  const ev = CONTENT.event;
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
          <div className="eyebrow" style={Object.assign({ marginBottom: 26 }, fade(eyebrowShow, 0))}>Jetzt mitmachen</div>
          {intro.active ?
          <Typewriter lead={CONTENT.claimLead} accent={CONTENT.claimAccent} speed={T.typeSpeedMs} play={typing} done={textDone} onDone={intro.skip} /> :
          <h1 aria-label={CONTENT.claimLead + " " + CONTENT.claimAccent} style={{ fontSize: "clamp(40px,7vw,88px)", lineHeight: 0.98, marginBottom: 8 }}>{CONTENT.claimLead}<br /><span style={{ color: "var(--accent)", textShadow: "0 0 calc(50px*var(--glow)) color-mix(in srgb,var(--accent) 55%, transparent)" }}>{CONTENT.claimAccent}</span></h1>}
          <p style={{ ...Object.assign({ fontSize: "clamp(16px,2.1vw,21px)", color: "var(--ink-dim)", maxWidth: 540, margin: "20px 0 0", fontWeight: 300 }, fade(textDone, 0)), fontSize: "20px", fontFamily: '"EB Garamond", Garamond, "Times New Roman", serif', fontStyle: "italic", fontWeight: 400, lineHeight: 1.45 }}>{CONTENT.claimSub}</p>
          <div style={Object.assign({ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 38 }, fade(textDone, 120))}>
            <button className="btn btn-cta" onClick={onBook}>Werkstatt-Slot sichern <Icon name="arrow" size={16} /></button>
            <button className="btn btn-ghost" onClick={() => scrollToId("checks")}>Was wir checken</button>
          </div>
          <div style={Object.assign({ display: "flex", gap: 26, flexWrap: "wrap", marginTop: 42, color: "var(--ink-dim)" }, fade(textDone, 240))}>
            <Meta icon="cal" label={ev.dateLong} />
            <Meta icon="pin" label={ev.place} />
            <Meta icon="target" label={ev.eventName} />
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
function HorizontalScroll({ labels, children }) {
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
    const wrap = wrapRef.current, track = trackRef.current;
    if (wrap) wrap.dataset.enabled = enabled ? "1" : "0";
    if (!enabled || !wrap || !track || !window.gsap || !window.ScrollTrigger) {
      if (track) track.style.transform = "";
      return;
    }
    const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    const distance = () => Math.max(1, track.scrollWidth - window.innerWidth);

    const paint = (p) => {
      if (fillRef.current) fillRef.current.style.width = (p * 100).toFixed(2) + "%";
      const active = Math.round(p * (count - 1));
      labelRefs.current.forEach((el, i) => { if (el) el.style.color = i === active ? "var(--accent)" : "var(--muted)"; });
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
        scrub: true,            // follow scroll 1:1 — Lenis' lerp is the only smoothing layer
        anticipatePin: 1,       // pre-arm the pin so the boundary transition stays seamless
        invalidateOnRefresh: true,
        onUpdate: (self) => paint(self.progress),
        onRefresh: (self) => paint(self.progress),
      },
    });

    window.__hscroll = { st: tween.scrollTrigger, count };
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
    return <div id="hwrap" ref={wrapRef} data-enabled="0">{children}</div>;
  }
  return (
    <section id="hwrap" ref={wrapRef} data-enabled="1" style={{ height: "100vh", overflow: "hidden", position: "relative" }}>
      <div ref={trackRef} style={{ display: "flex", height: "100%", width: "max-content", willChange: "transform" }}>
        {React.Children.map(children, (ch, i) =>
        <div key={i} style={{ flex: "0 0 100vw", width: "100vw", height: "100%", position: "relative", overflow: "hidden" }}>{ch}</div>
        )}
      </div>
      <div style={{ position: "absolute", bottom: 22, left: 0, right: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: 11, pointerEvents: "none" }}>
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

  const goBook = useCallback(() => scrollToId("book"), []);
  const goBookFocus = useCallback(() => {
    scrollToId("book");
    setTimeout(() => {const el = document.querySelector("#book input");if (el) try {el.focus({ preventScroll: true });} catch (e) {el.focus();}}, 650);
  }, []);

  return (
    <React.Fragment>
      <TopBar onBook={goBook} />
      <Hero tweaks={t} onBook={goBook} />
      <HorizontalScroll labels={["GEO-Check", "LinkedIn", "Demos", "Countdown"]}>
        <GeoCheckSection onBook={goBook} />
        <LinkedInCheckSection onBook={goBook} />
        <DemosSection onBook={goBook} />
        <MissionTimer eventDate="2026-06-25T09:00:00" eventEndDate="2026-06-25T18:00:00" place="Fürstenfeldbruck" freeSlots={18} brand={CONTENT.brand} onBook={goBookFocus} />
      </HorizontalScroll>
      <ScanCut />
      <AblaufSection />
      <ScanCut />
      <TrustStrip />
      <BookSection onBookFired={() => {}} />
      <ScanCut />
      <MissionControlSection onBook={goBook} />
      <ScanCut />
      <QuickBook event={CONTENT.event} onBook={goBook} />
      <Marquee items={CONTENT.marquee} />
      <BandSection />
      <BaustellenschildGenerator variant="section" />
      <EventFooter event={CONTENT.event} logo="assets/logo.png" onBookClick={goBook} />
      <StickyCTA onBook={goBook} />
      <GlobalScanCursor />

      <TweaksPanel>
        <TweakSection label="Farben" />
        <TweakColor label="Leitfarbe" value={t.accentPair}
        options={[["#1fe6d2", "#46ff9e"], ["#36d3ff", "#7af6e0"], ["#19e3a5", "#7dff5a"], ["#3ad6ff", "#48e0c8"]]}
        onChange={(v) => setTweak("accentPair", v)} />
        <TweakColor label="CTA-Farbe" value={t.cta}
        options={["#ff2f86", "#ffae3b", "#ff6a4d", "#ff4d6d"]}
        onChange={(v) => setTweak("cta", v)} />
        <TweakSection label="Hero" />
        <TweakRadio label="Hero-Stil" value={t.heroStyle} options={["Overall", "Mond", "Station", "Parallax"]} onChange={(v) => setTweak("heroStyle", v)} />
        <TweakRadio label="Intensität" value={t.intensity} options={["Ruhig", "Standard", "Maximal"]} onChange={(v) => setTweak("intensity", v)} />
      </TweaksPanel>
    </React.Fragment>);

}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);