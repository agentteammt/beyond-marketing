/* sections.jsx — presentational building blocks for the KI-Werkstatt page.
   All components are exported to window at the bottom for use by app.jsx. */
const { useState, useEffect, useRef } = React;

/* ----------------------------- icons ----------------------------- */
function Icon({ name, size = 24, stroke = 1.6 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  const P = {
    scan: <g><path d="M3 8V5a2 2 0 0 1 2-2h3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3"/><circle cx="12" cy="12" r="3.2"/><path d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21"/></g>,
    linkedin: <g><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v.01M11.5 17v-4a2 2 0 0 1 4 0v4M11.5 17v-7"/></g>,
    video: <g><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></g>,
    bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6z"/>,
    share: <g><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.1 10.9 15.9 7M8.1 13.1 15.9 17"/></g>,
    check: <path d="m4 12 5 5L20 6"/>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
    cal: <g><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></g>,
    pin: <g><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></g>,
    clock: <g><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></g>,
    drag: <g><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/><circle cx="12" cy="12" r="2.4"/></g>,
    spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>,
    target: <g><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/></g>,
    chart: <g><path d="M4 20V4M4 20h16"/><path d="M8 16l3-4 3 2 4-6"/></g>,
    cone: <g><path d="M5 20h14"/><path d="M8.5 20 11 4h2l2.5 16Z"/><path d="M9.4 13h5.2M8.6 17h6.8"/></g>,
    sign: <g><path d="M12 3.5 21.5 20H2.5L12 3.5Z"/><path d="M12 9.5v4.2M12 16.8v.2"/></g>,
    helmet: <g><path d="M3.5 18h17"/><path d="M6 18a6 6 0 0 1 12 0"/><path d="M10 6.5h4V11"/></g>,
  };
  return <svg {...common} aria-hidden="true">{P[name] || null}</svg>;
}

/* --------------------------- reveal --------------------------- */
function Reveal({ children, delay = 0, as = "div", className = "", style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const reveal = () => el.classList.add("in");
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { reveal(); return; }

    // instant reveal for anything already in (or near) the viewport — robust against
    // IntersectionObserver not firing in backgrounded/throttled frames.
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 800) * 0.92 && r.bottom > 0;
    };
    if (inView()) { setTimeout(reveal, delay); return; }

    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { setTimeout(reveal, delay); io.unobserve(el); } });
    }, { threshold: 0.16 });
    io.observe(el);
    // failsafe: if still hidden shortly after load, reveal if visible
    const fs = setTimeout(() => { if (!el.classList.contains("in") && inView()) reveal(); }, 1400);
    return () => { io.disconnect(); clearTimeout(fs); };
  }, [delay]);
  const Tag = as;
  return <Tag ref={ref} className={"reveal " + className} style={style}>{children}</Tag>;
}

/* --------------------------- atoms --------------------------- */
function Eyebrow({ children, num }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
      <span className="eyebrow">{children}</span>
      {num && <span className="kicker-num">{num}</span>}
    </div>
  );
}

function NeonDivider() {
  return <div aria-hidden="true" style={{ height: 1, width: "100%", background: "linear-gradient(90deg,transparent,var(--line-strong) 40%,var(--accent) 50%,var(--line-strong) 60%,transparent)", opacity: 0.5 }} />;
}

/* --------------------------- capability card --------------------------- */
function CapabilityCard({ icon, title, body, tag, flagship }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", padding: "30px 28px 32px", borderRadius: 3,
        background: flagship
          ? "linear-gradient(160deg, color-mix(in srgb,var(--accent) 9%, var(--bg-2)) 0%, var(--bg-1) 70%)"
          : "var(--glass)",
        backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        boxShadow: hover
          ? "inset 0 0 0 1px var(--accent), 0 0 calc(40px*var(--glow)) color-mix(in srgb,var(--accent) 22%, transparent)"
          : "inset 0 0 0 1px var(--glass-line)",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s",
        height: "100%", display: "flex", flexDirection: "column",
      }}>
      {flagship && <span style={{ position: "absolute", top: 16, right: 16, fontFamily: "Poppins", fontSize: 10.5, letterSpacing: ".22em", color: "var(--accent)", textTransform: "uppercase" }}>Live-Check</span>}
      <div style={{
        width: 50, height: 50, borderRadius: 2, display: "grid", placeItems: "center", color: "var(--accent)",
        boxShadow: "inset 0 0 0 1px var(--line-strong)", background: "rgba(120,200,220,.05)", marginBottom: 22,
      }}>
        <Icon name={icon} size={26} />
      </div>
      <h3 style={{ fontSize: 21, marginBottom: 10 }}>{title}</h3>
      <p style={{ color: "var(--ink-dim)", fontSize: 14.5, margin: 0, flex: 1 }}>{body}</p>
      {tag && <div style={{ marginTop: 18, fontFamily: "Poppins", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)" }}>{tag}</div>}
    </div>
  );
}

/* --------------------------- flagship check block --------------------------- */
function CheckBlock({ index, kicker, title, lead, points, img, alt, reverse, accent2 }) {
  return (
    <Reveal className="checkblock" style={{
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,5vw,72px)", alignItems: "center",
    }}>
      <div style={{ order: reverse ? 2 : 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 18 }}>
          <span className="display" style={{ fontSize: 13, letterSpacing: ".3em", color: accent2 ? "var(--accent-2)" : "var(--accent)" }}>{kicker}</span>
          <span className="kicker-num">{index}</span>
        </div>
        <h2 style={{ fontSize: "clamp(28px,3.4vw,44px)", marginBottom: 18, textWrap: "balance" }}>{title}</h2>
        <p style={{ color: "var(--ink-dim)", fontSize: 16.5, marginBottom: 26, maxWidth: 460 }}>{lead}</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
          {points.map((p, i) => (
            <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ flex: "none", marginTop: 2, color: accent2 ? "var(--accent-2)" : "var(--accent)" }}><Icon name="check" size={18} stroke={2.2} /></span>
              <span style={{ color: "var(--ink)", fontSize: 15 }}>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ order: reverse ? 1 : 2, position: "relative" }}>
        <div style={{
          position: "relative", borderRadius: 4, overflow: "hidden",
          boxShadow: "inset 0 0 0 1px var(--glass-line), 0 30px 80px rgba(0,0,0,.5)",
        }}>
          <img src={img} alt={alt} loading="lazy" style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", display: "block" }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(5,6,10,.55))" }} />
          {/* HUD corner ticks */}
          {[["top:14px;left:14px", "border-top:1px solid var(--accent);border-left:1px solid var(--accent)"],
            ["top:14px;right:14px", "border-top:1px solid var(--accent);border-right:1px solid var(--accent)"],
            ["bottom:14px;left:14px", "border-bottom:1px solid var(--accent);border-left:1px solid var(--accent)"],
            ["bottom:14px;right:14px", "border-bottom:1px solid var(--accent);border-right:1px solid var(--accent)"]].map((c, i) => (
            <span key={i} aria-hidden="true" style={cornerStyle(c[0], c[1])} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
function cornerStyle(pos, border) {
  const o = { position: "absolute", width: 22, height: 22, opacity: 0.85 };
  pos.split(";").forEach((kv) => { const [k, v] = kv.split(":"); o[k.trim()] = v.trim(); });
  border.split(";").forEach((kv) => { const [k, v] = kv.split(":"); o[k.replace(/-([a-z])/g, (m, g) => g.toUpperCase()).trim()] = v.trim(); });
  return o;
}

/* --------------------------- process step --------------------------- */
function StepRow({ num, title, body, icon, last }) {
  return (
    <Reveal style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 56, height: 56, flex: "none", borderRadius: "50%", display: "grid", placeItems: "center",
          fontFamily: "Poppins", fontWeight: 600, fontSize: 18, color: "var(--accent)",
          boxShadow: "inset 0 0 0 1px var(--accent)", background: "rgba(120,200,220,.04)",
        }}>{num}</div>
        {!last && <div style={{ flex: 1, width: 1, marginTop: 8, background: "linear-gradient(var(--line-strong),transparent)" }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : 44 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, color: "var(--accent)" }}>
          <Icon name={icon} size={20} />
          <h3 style={{ fontSize: 22, color: "var(--ink)" }}>{title}</h3>
        </div>
        <p style={{ color: "var(--ink-dim)", fontSize: 15.5, margin: 0, maxWidth: 560 }}>{body}</p>
      </div>
    </Reveal>
  );
}

/* --------------------------- Stand section: live check cards --------------------------- */
function LiveBadge({ label = "LIVE", color }) {
  return (
    <span className="live-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Poppins", fontWeight: 600, fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: color || "var(--accent)" }}>
      <span className="live-dot" style={color ? { background: color } : null} /> {label}
    </span>
  );
}

function ScanBar({ label }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
        <span style={{ fontFamily: "Poppins", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--accent)" }}>{label}</span>
        <span style={{ display: "inline-flex", gap: 4 }}>
          {[0, 0.2, 0.4].map((d, i) => <i key={i} className="proc-dot" style={{ width: 4, height: 4, borderRadius: 9, background: "var(--accent)", display: "inline-block", animationDelay: d + "s" }} />)}
        </span>
      </div>
      <div className="scanbar-track"><div className="scanbar-seg" /></div>
    </div>
  );
}

/* Große, präsente Scan-Konsole — dominantes Visual der Check-Panels */
function BigScan({ label, cols = 44 }) {
  return (
    <div className="bigscan" role="img" aria-label={label}>
      <div className="bigscan-grid" aria-hidden="true" />
      <div className="bigscan-head">
        <span className="bigscan-label">{label}</span>
        <span className="bigscan-readout">
          <span style={{ display: "inline-flex", gap: 5 }}>
            {[0, 0.2, 0.4].map((d, i) => <i key={i} className="proc-dot" style={{ width: 5, height: 5, borderRadius: 9, background: "var(--accent)", display: "inline-block", animationDelay: d + "s" }} />)}
          </span>
          Analysiert
        </span>
      </div>
      <div className="bigscan-cols" aria-hidden="true">
        {Array.from({ length: cols }).map((_, i) => (
          <span key={i} className="bigscan-col" style={{ animationDelay: ((i % 11) * 0.13 + (i % 3) * 0.07).toFixed(2) + "s" }} />
        ))}
      </div>
      <div className="bigscan-sweep" aria-hidden="true" />
      <div className="bigscan-track" aria-hidden="true"><div className="bigscan-seg" /></div>
    </div>
  );
}

function FlagshipCheckCard({ index, title, body, img, alt, scanLabel, accent2 }) {
  const [hover, setHover] = useState(false);
  const root = Object.assign(
    { position: "relative", borderRadius: 4, overflow: "hidden", minHeight: 446, display: "flex", flexDirection: "column",
      transform: hover ? "translateY(-6px)" : "none", transition: "transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s",
      boxShadow: hover
        ? "inset 0 0 0 1px var(--accent), 0 26px 64px rgba(0,0,0,.55), 0 0 calc(54px*var(--glow)) color-mix(in srgb,var(--accent) 24%, transparent)"
        : "inset 0 0 0 1px var(--glass-line), 0 16px 40px rgba(0,0,0,.4)" },
    accent2 ? { "--accent": "var(--accent-2)" } : {}
  );
  const corners = [["top:16px;left:16px", "border-top:1px solid var(--accent);border-left:1px solid var(--accent)"],
    ["top:16px;right:16px", "border-top:1px solid var(--accent);border-right:1px solid var(--accent)"],
    ["bottom:16px;left:16px", "border-bottom:1px solid var(--accent);border-left:1px solid var(--accent)"],
    ["bottom:16px;right:16px", "border-bottom:1px solid var(--accent);border-right:1px solid var(--accent)"]];
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={root}>
      <img src={img} alt={alt} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.9, transform: hover ? "scale(1.07)" : "scale(1)", transition: "transform .7s ease" }} />
      <div className="scanline" />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,6,10,.32) 0%, rgba(5,6,10,.5) 42%, rgba(5,6,10,.93) 100%)" }} />
      {corners.map((c, i) => <span key={i} aria-hidden="true" style={cornerStyle(c[0], c[1])} />)}
      <div style={{ position: "relative", zIndex: 2, padding: "26px 28px 28px", marginTop: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <LiveBadge color="var(--accent)" /><span className="kicker-num">{index}</span>
        </div>
        <h3 style={{ fontSize: "clamp(24px,2.7vw,33px)", textWrap: "balance", color: "#fff" }}>{title}</h3>
        <p style={{ color: "var(--ink-dim)", fontSize: 14.5, margin: 0, maxWidth: 430 }}>{body}</p>
        <ScanBar label={scanLabel} />
      </div>
    </div>
  );
}

function DemoCard({ icon, title, body }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "relative", padding: "26px 24px", borderRadius: 3, background: "var(--glass)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        boxShadow: hover ? "inset 0 0 0 1px var(--accent), 0 0 calc(36px*var(--glow)) color-mix(in srgb,var(--accent) 18%, transparent)" : "inset 0 0 0 1px var(--glass-line)",
        transform: hover ? "translateY(-4px)" : "none", transition: "transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s", display: "flex", flexDirection: "column", gap: 13, height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ width: 46, height: 46, borderRadius: 2, display: "grid", placeItems: "center", color: "var(--accent)", boxShadow: "inset 0 0 0 1px var(--line-strong)", background: "rgba(120,200,220,.05)" }}><Icon name={icon} size={24} /></span>
      </div>
      <h4 style={{ fontSize: 19, fontFamily: "Poppins", fontWeight: 600 }}>{title}</h4>
      <p style={{ color: "var(--ink-dim)", fontSize: 14, margin: 0, flex: 1 }}>{body}</p>
      <div style={{ display: "flex", gap: 5, alignItems: "center", color: "var(--accent)", fontFamily: "Poppins", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase" }}>
        {[0, 0.2, 0.4].map((d, i) => <span key={i} className="proc-dot" style={{ width: 5, height: 5, borderRadius: 9, background: "currentColor", animationDelay: d + "s" }} />)}
        <span style={{ marginLeft: 6 }}>Live am Stand</span>
      </div>
    </div>
  );
}

function ConeFloat({ style, size = 38, delay = 0 }) {
  return <div className="cone-float" aria-hidden="true" style={Object.assign({ position: "absolute", color: "var(--caution)", opacity: 0.5, animationDelay: delay + "s", pointerEvents: "none" }, style)}><Icon name="cone" size={size} /></div>;
}

/* blinking neon corner markers framing a panel */
function ScanFrame() {
  return (
    <React.Fragment>
      <span className="scan-corner tl" aria-hidden="true" />
      <span className="scan-corner tr" aria-hidden="true" />
      <span className="scan-corner bl" aria-hidden="true" />
      <span className="scan-corner br" aria-hidden="true" />
    </React.Fragment>
  );
}

/* useScanReveal — einmaliger Scan→Decrypt→Badge-Effekt, wenn ein Panel sichtbar wird.
   Liefert { ref, run, playing, badging, reduce, replay }. Darstellung via CSS-Klassen. */
function useScanReveal(durMs) {
  durMs = durMs || 640;
  const reduce = useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const ref = useRef(null);
  const [run, setRun] = useState(0);
  const [badging, setBadging] = useState(false);
  const timers = useRef([]);
  const replay = React.useCallback(() => {
    timers.current.forEach(clearTimeout); timers.current = [];
    if (reduce) { setRun((r) => r + 1); return; }
    setBadging(false);
    setRun((r) => r + 1);
    timers.current.push(setTimeout(() => setBadging(true), Math.round(durMs * 0.78)));
    timers.current.push(setTimeout(() => setBadging(false), Math.round(durMs * 0.78) + 440));
  }, [reduce, durMs]);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let done = false;
    const inView = () => { const r = el.getBoundingClientRect(); return r.top < (window.innerHeight || 800) && r.bottom > 0; };
    const fire = () => { if (done) return; done = true; replay(); io.disconnect(); clearTimeout(fs); };
    // Sektionen können höher als der Viewport sein (v. a. mobil) -> niedriger
    // Schwellwert, sonst werden 55% nie erreicht und die Inhalte bleiben unsichtbar.
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio > 0.1) fire();
    }), { threshold: [0, 0.1, 0.55] });
    io.observe(el);
    // Failsafe: falls der Observer (gedrosselt / zu hohe Sektion) nicht feuert.
    const fs = setTimeout(() => { if (!done && inView()) fire(); }, 1600);
    return () => { io.disconnect(); clearTimeout(fs); timers.current.forEach(clearTimeout); };
  }, [replay]);
  return { ref, run, playing: run > 0 && !reduce, badging, reduce, replay };
}

/* StatusStempel — Gummistempel, schlägt beim Sichtbarwerden einmalig auf. */
function StatusStempel({ label, sub, color }) {
  const reduce = useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const ref = useRef(null);
  const rot = useRef((Math.random() * 12 - 6)).current;
  const [slam, setSlam] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const el = ref.current; if (!el) return; let done = false;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !done) { done = true; setSlam(true); io.unobserve(el); }
    }), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const cls = "stamp" + (reduce ? " static" : (slam ? " slam" : ""));
  return (
    <div ref={ref} className={cls} style={{ "--stamp": color || "var(--caution)", "--rot": rot.toFixed(2) + "deg" }} aria-hidden="true">
      <span className="stamp-main">{label}</span>
      {sub ? <span className="stamp-sub">{sub}</span> : null}
    </div>
  );
}

/* ScanReplay — kleiner Replay-Button je Panel (zum Iterieren). */
function ScanReplay({ onClick }) {
  return <button className="scan-replay" onClick={onClick} aria-label="Scan-Effekt erneut abspielen" title="Scan-Effekt erneut abspielen"><Icon name="spark" size={13} /> Replay</button>;
}

/* global scan cursor: reticle + crosshair following the mouse across the whole page */
function GlobalScanCursor({ label = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const layer = ref.current; if (!layer) return;
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
    const ret = layer.querySelector(".scan-reticle");
    const vline = layer.querySelector(".scan-v");
    const hline = layer.querySelector(".scan-h");
    const lock = layer.querySelector(".scan-lock");
    const lockLbl = lock.querySelector(".lock-lbl");
    const lens = layer.querySelector(".invert-lens");
    const SEL = ".btn-cta, [data-lock]"; // Lock-on nur auf primäre CTAs — kein Zappen mehr
    let raf = 0, tx = window.innerWidth / 2, ty = window.innerHeight / 2, cx = tx, cy = ty, shown = false;
    let locked = null;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; if (!shown) { layer.style.opacity = "1"; lens.classList.add("show"); shown = true; } };
    const onLeave = (e) => { if (!e.relatedTarget && !e.toElement) { layer.style.opacity = "0"; lens.classList.remove("show"); shown = false; } };
    const onOver = (e) => {
      const t = e.target.closest && e.target.closest(SEL);
      if (t) { locked = t; lockLbl.textContent = (t.dataset && t.dataset.lock) || "Ziel erfasst"; }
    };
    const onOut = (e) => {
      if (!locked) return;
      const to = e.relatedTarget;
      if (!to || !(to.closest && to.closest(SEL))) locked = null;
    };
    const loop = () => {
      cx += (tx - cx) * 0.35; cy += (ty - cy) * 0.35;
      lens.style.transform = "translate(" + tx + "px," + ty + "px)";
      if (locked && document.contains(locked)) {
        lens.classList.add("lock");
        const r = locked.getBoundingClientRect();
        if (r.width && r.height) {
          layer.classList.add("locked");
          lock.style.left = r.left + "px"; lock.style.top = r.top + "px";
          lock.style.width = r.width + "px"; lock.style.height = r.height + "px";
          const lx = r.left + r.width / 2, ly = r.top + r.height / 2;
          vline.style.transform = "translateX(" + lx + "px)";
          hline.style.transform = "translateY(" + ly + "px)";
          ret.style.transform = "translate(" + (cx - 38) + "px," + (cy - 38) + "px)";
        }
      } else {
        if (locked) locked = null;
        lens.classList.remove("lock");
        layer.classList.remove("locked");
        ret.style.transform = "translate(" + (cx - 38) + "px," + (cy - 38) + "px)";
        vline.style.transform = "translateX(" + cx + "px)";
        hline.style.transform = "translateY(" + cy + "px)";
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseout", onLeave);
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onLeave);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);
  return (
    <div ref={ref} className="scan-cursor" aria-hidden="true">
      <div className="invert-lens" />
      <div className="scan-v" />
      <div className="scan-h" />
      <div className="scan-lock">
        <span className="cnr tl" /><span className="cnr tr" /><span className="cnr bl" /><span className="cnr br" />
        <span className="lock-lbl">Ziel erfasst</span>
      </div>
      <div className="scan-reticle">
        <div className="ring" />
        <div className="ring2" />
        <div className="ch h" />
        <div className="ch v" />
        <div className="dot" />
        {label ? <div className="lbl">{label}</div> : null}
      </div>
    </div>
  );
}

/* mouse-following scan reticle + crosshair guides (desktop pointer only) */
function ScanLayer({ label = "SCAN" }) {
  const ref = useRef(null);
  useEffect(() => {
    const layer = ref.current; if (!layer) return;
    const section = layer.parentElement; if (!section) return;
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
    const ret = layer.querySelector(".scan-reticle");
    const vline = layer.querySelector(".scan-v");
    const hline = layer.querySelector(".scan-h");
    const onMove = (e) => {
      const r = section.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      layer.style.opacity = "1";
      ret.style.transform = "translate(" + (x - 38) + "px," + (y - 38) + "px)";
      vline.style.transform = "translateX(" + x + "px)";
      hline.style.transform = "translateY(" + y + "px)";
    };
    const onLeave = () => { layer.style.opacity = "0"; };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => { section.removeEventListener("mousemove", onMove); section.removeEventListener("mouseleave", onLeave); };
  }, []);
  return (
    <div ref={ref} className="scan-layer" aria-hidden="true">
      <div className="scan-v" />
      <div className="scan-h" />
      <div className="scan-reticle">
        <div className="ring" />
        <div className="ring2" />
        <div className="ch h" />
        <div className="ch v" />
        <div className="dot" />
        <div className="lbl">{label}</div>
      </div>
    </div>
  );
}

/* --------------------------- construction hazard edge --------------------------- */
function HazardEdge({ thin, animate, style }) {
  return <div aria-hidden="true" className={"hazard hazard-edge" + (thin ? " thin" : "") + (animate ? " animate" : "")} style={style} />;
}

/* --------------------------- quick booking band --------------------------- */
function QuickBook({ event, onBook }) {
  const chips = ["13:15", "13:45", "15:30", "16:00"];
  return (
    <div style={{ position: "relative", background: "linear-gradient(180deg, var(--bg-1), var(--bg-2))" }}>
      <HazardEdge animate />
      <div className="wrap qb-grid" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, padding: "22px 28px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ flex: "none", width: 46, height: 46, borderRadius: 2, display: "grid", placeItems: "center", color: "var(--caution)", boxShadow: "inset 0 0 0 1px color-mix(in srgb,var(--caution) 50%, transparent)", background: "color-mix(in srgb,var(--caution) 8%, transparent)" }}><Icon name="cone" size={24} /></span>
          <div>
            <div className="caution-tag">Werkstatt geöffnet · {event.dateShort} · {event.booth}</div>
            <div className="display" style={{ fontSize: "clamp(18px,2.4vw,24px)", marginTop: 4 }}>In 10 Minuten zum KI-Befund.</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Poppins", fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)", marginRight: 2 }} className="qb-hide">Freie Slots</span>
          {chips.map((c) => (
            <button key={c} onClick={onBook} style={{ padding: "9px 14px", borderRadius: 2, cursor: "pointer", fontFamily: "Poppins", fontWeight: 500, fontSize: 13.5, color: "var(--ink)", background: "rgba(140,190,230,.05)", border: "1px solid var(--line-strong)", transition: "all .2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line-strong)"; e.currentTarget.style.color = "var(--ink)"; }}>{c}</button>
          ))}
          <button className="btn btn-cta" style={{ padding: "12px 22px", fontSize: 14 }} onClick={onBook}>Slot sichern <Icon name="arrow" size={16} /></button>
        </div>
      </div>
      <HazardEdge thin animate />
    </div>
  );
}

/* --------------------------- marquee ticker --------------------------- */
function Marquee({ items }) {
  const row = [...items, ...items];
  return (
    <div aria-hidden="true" style={{ overflow: "hidden", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "16px 0", maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)" }}>
      <div style={{ display: "inline-flex", gap: 0, whiteSpace: "nowrap", animation: "kiwmarq 34s linear infinite" }}>
        {row.map((it, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 22, paddingRight: 22, fontFamily: "Poppins", fontSize: 15, letterSpacing: ".04em", color: i % 2 ? "var(--ink)" : "var(--muted)" }}>
            {it}<span style={{ color: "var(--accent)", fontSize: 8 }}>◆</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes kiwmarq{to{transform:translateX(-50%)}}@media (prefers-reduced-motion: reduce){[style*="kiwmarq"]{animation:none!important}}`}</style>
    </div>
  );
}

/* --------------------------- booking embed --------------------------- */
function BookingEmbed({ calendlyUrl, booking, event, onBookClick }) {
  const mountRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!calendlyUrl) return;
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js"; s.async = true;
    s.onload = () => setLoaded(true);
    document.body.appendChild(s);
    return () => { try { document.head.removeChild(link); document.body.removeChild(s); } catch (e) {} };
  }, [calendlyUrl]);

  if (calendlyUrl) {
    return <div className="calendly-inline-widget" data-url={calendlyUrl} style={{ minWidth: 320, height: 680, borderRadius: 4, overflow: "hidden", boxShadow: "inset 0 0 0 1px var(--glass-line)" }} ref={mountRef} />;
  }
  // fallback interactive slot picker (Supabase-backed when configured)
  return <MockBooking booking={booking} event={event} onBookClick={onBookClick} />;
}

/* Slot-Generator: baut 10-Min-Slots aus den konfigurierten Bl\u00f6cken */
function toMin(hhmm) { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; }
function fromMin(min) { const h = Math.floor(min / 60), m = min % 60; return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0"); }
function buildBlocks(booking) {
  const step = booking.slotMinutes || 10;
  return (booking.blocks || []).map((b) => {
    const slots = [];
    for (let t = toMin(b.start); t + step <= toMin(b.end); t += step) slots.push(fromMin(t));
    return { label: b.label, slots };
  });
}

/* Kapazit\u00e4ts-Punkte: freie Pl\u00e4tze leuchten, vergebene sind ged\u00e4mpft */
function CapDots({ free, total, selected }) {
  const lit = selected ? "var(--cta-ink)" : "var(--accent)";
  return (
    <span style={{ display: "flex", gap: 3, marginTop: 6, justifyContent: "center" }} aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i < free ? lit : (selected ? "color-mix(in srgb,var(--cta-ink) 28%,transparent)" : "rgba(140,190,230,.30)"), boxShadow: i < free && !selected ? "0 0 5px var(--accent)" : "none" }} />
      ))}
    </span>
  );
}

/* Parst die Stunde aus einem Slot-Label wie "12:00" / "17:50" */
function labelHour(label) { const m = String(label || "").match(/(\d{1,2}):(\d{2})/); return m ? parseInt(m[1], 10) : null; }
function labelMin(label) { const m = String(label || "").match(/(\d{1,2}):(\d{2})/); return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : null; }

/* Gruppiert die Verfügbarkeitsliste der DB in die konfigurierten Blöcke (Mittag/Nachmittag) */
function groupAvailability(items, booking) {
  const defs = (booking && booking.blocks) || [];
  const groups = defs.map((b) => ({ label: b.label, start: toMin(b.start), end: toMin(b.end), items: [] }));
  const rest = { label: "Weitere Slots", items: [] };
  (items || []).forEach((it) => {
    const min = labelMin(it.label);
    const g = (min != null && groups.find((gr) => min >= gr.start && min < gr.end)) || null;
    (g || rest).items.push(it);
  });
  if (rest.items.length) groups.push(rest);
  return groups.filter((g) => g.items.length).map((g) => ({
    label: g.label,
    items: g.items.slice().sort((a, b) => String(a.label).localeCompare(String(b.label))),
  }));
}

function MockBooking({ booking, event, onBookClick }) {
  const cfg = booking || { date: "2026-06-25", dateLabel: "25. Juni 2026", slotMinutes: 10, capacity: 3, blocks: [] };
  const cap = cfg.capacity || 3;
  const live = !!(window.KIWBooking && window.KIWBooking.configured && window.KIWBooking.configured());

  // Demo-Verfügbarkeit, falls kein Supabase-Zugang hinterlegt ist
  const demoAvail = React.useMemo(() => {
    const out = [];
    buildBlocks(cfg).forEach((b) => b.slots.forEach((s) => out.push({ slot_id: s, label: s, remaining: cap })));
    return out;
  }, [cfg, cap]);

  const [avail, setAvail] = useState(live ? null : demoAvail);
  const [selected, setSelected] = useState(null); // slot_id
  const [form, setForm] = useState({ name: "", email: "", company: "", note: "" });
  const [loading, setLoading] = useState(live);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const refresh = React.useCallback(async () => {
    if (!live) return;
    const rows = await window.KIWBooking.loadAvailability();
    setAvail(Array.isArray(rows) ? rows : []);
  }, [live]);

  useEffect(() => {
    let on = true;
    if (!live) { setLoading(false); return; }
    (async () => {
      try { await refresh(); }
      catch (e) { if (on) setError("Verfügbarkeit konnte nicht geladen werden. Bitte Seite neu laden."); }
      finally { if (on) setLoading(false); }
    })();
    return () => { on = false; };
  }, [live, refresh]);

  const groups = React.useMemo(() => groupAvailability(avail, cfg), [avail, cfg]);
  const slotById = (id) => (avail || []).find((s) => s.slot_id === id) || null;
  const valid = selected != null && form.name.trim() && /\S+@\S+\.\S+/.test(form.email);

  async function submit() {
    if (!valid || submitting) return;
    setError(null); setSubmitting(true);
    try {
      let result = "ok";
      if (live) {
        result = await window.KIWBooking.bookSlot(selected, form.name.trim(), form.email.trim(), form.company.trim(), form.note.trim());
      } else {
        const cur = slotById(selected);
        if (!cur || cur.remaining <= 0) result = "full";
        else setAvail((a) => a.map((s) => s.slot_id === selected ? { ...s, remaining: s.remaining - 1 } : s));
      }

      if (result === "ok") {
        try { await refresh(); } catch (e) {} // Verfügbarkeit (Punkte) nach Buchung live aktualisieren
        onBookClick && onBookClick();
        setDone(true);
      } else if (result === "full") {
        setError("Slot leider ausgebucht. Bitte wählen Sie einen anderen.");
        try { await refresh(); } catch (e) {}
        setSelected(null);
      } else { // invalid_slot o.Ä.
        setError("Dieser Slot ist nicht mehr verfügbar. Bitte aktualisieren Sie die Auswahl.");
        try { await refresh(); } catch (e) {}
        setSelected(null);
      }
    } catch (err) {
      setError("Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally { setSubmitting(false); }
  }

  if (done) {
    return (
      <div style={mockShell}>
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ width: 64, height: 64, margin: "0 auto 22px", borderRadius: "50%", display: "grid", placeItems: "center", color: "var(--accent)", boxShadow: "inset 0 0 0 1px var(--accent), 0 0 calc(40px*var(--glow)) color-mix(in srgb,var(--accent) 30%,transparent)" }}>
            <Icon name="check" size={30} stroke={2.4} />
          </div>
          <h3 style={{ fontSize: 24, marginBottom: 10 }}>Slot gebucht</h3>
          <p style={{ color: "var(--ink-dim)", maxWidth: 360, margin: "0 auto", fontSize: 15 }}>
            {cfg.dateLabel}, {(slotById(selected) && slotById(selected).label) || ""} Uhr — wir bestätigen Ihren Werkstatt-Slot per E-Mail. Bis bald an {(event && event.booth) || "Stand 14"}.
          </p>
          <button className="btn btn-ghost" style={{ marginTop: 26 }} onClick={() => { setDone(false); setSelected(null); setForm({ name: "", email: "", company: "", note: "" }); }}>Weiteren Slot buchen</button>
        </div>
      </div>
    );
  }

  return (
    <div style={mockShell}>
      <HazardEdge thin animate />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--accent)" }}>
          <Icon name="cal" size={18} /><span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>Werkstatt-Slot · {cfg.dateLabel}</span>
        </div>
        <span style={{ fontFamily: "Poppins", fontSize: 11.5, letterSpacing: ".18em", color: "var(--muted)", textTransform: "uppercase" }}>{cfg.slotMinutes} Min · {(event && event.booth) || "Stand 14"}</span>
      </div>
      <div style={{ padding: "22px" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: 13, fontFamily: "Poppins", letterSpacing: ".04em", padding: "10px 0 22px" }}>
            <span className="live-dot" /> Verfügbarkeit wird geladen …
          </div>
        ) : (
          <div style={{ marginBottom: 18 }}>
            {groups.length === 0 && (
              <div style={{ color: "var(--muted)", fontSize: 13, padding: "6px 0 18px" }}>Aktuell sind keine Slots verfügbar.</div>
            )}
            {groups.map((b, bi) => (
              <div key={bi} style={{ marginBottom: bi < groups.length - 1 ? 18 : 0 }}>
                <div style={{ fontFamily: "Poppins", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>
                  {b.label} · {b.items[0].label}–{b.items[b.items.length - 1].label}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(76px,1fr))", gap: 10 }}>
                  {b.items.map((it) => {
                    const free = Math.max(0, it.remaining | 0); const full = free <= 0; const sel = it.slot_id === selected;
                    return (
                      <button key={it.slot_id} disabled={full} onClick={() => { setSelected(it.slot_id); setError(null); }}
                        title={full ? "Ausgebucht" : free + " von " + cap + " frei"}
                        style={{ ...slotBtn(sel, full), display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                        <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14 }}>{it.label}</span>
                        {full ? <span style={{ fontSize: 9.5, letterSpacing: ".12em", textTransform: "uppercase", marginTop: 5, opacity: .85 }}>voll</span>
                              : <CapDots free={Math.min(free, cap)} total={cap} selected={sel} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr", marginBottom: 10 }}>
          <input placeholder="Name" aria-label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inp} />
          <input placeholder="Unternehmen" aria-label="Unternehmen" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={inp} />
        </div>
        <input placeholder="E-Mail" aria-label="E-Mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ ...inp, width: "100%", marginBottom: 10 }} />
        <textarea placeholder="Notiz / Anliegen (optional)" aria-label="Notiz / Anliegen" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={2} style={{ ...inp, width: "100%", marginBottom: 16, resize: "vertical", minHeight: 44, fontFamily: "Sora,sans-serif" }} />

        {error && (
          <div role="alert" style={{ display: "flex", gap: 9, alignItems: "flex-start", color: "var(--cta)", fontSize: 13, marginBottom: 14, lineHeight: 1.4 }}>
            <Icon name="cone" size={15} /><span>{error}</span>
          </div>
        )}

        <button
          className="btn btn-cta"
          style={{ width: "100%", opacity: valid && !submitting ? 1 : 0.45, pointerEvents: valid && !submitting ? "auto" : "none" }}
          onClick={submit}>
          {submitting ? "Wird gebucht …" : <React.Fragment>Slot sichern <Icon name="arrow" size={16} /></React.Fragment>}
        </button>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, marginTop: 14, marginBottom: 0 }}>
          {live
            ? <React.Fragment>Jeder Slot ist {cap}× verfügbar · Echtzeit-Buchung über Supabase</React.Fragment>
            : <React.Fragment>Demo-Modus · Supabase-Zugang in <code style={{ color: "var(--accent)" }}>window.KIW_SUPABASE</code> (index.html) eintragen</React.Fragment>}
        </p>
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "center" }}>
          <div className="tik-badge" style={{ gap: 12 }}>
            <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>Ihr Werkstatt-Slot auf dem</span>
            <img src="assets/tik-logo-white.png" alt="Tag der Industriekommunikation" style={{ height: 22, width: "auto", display: "block", opacity: .95 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- footer --------------------------- */
function EventFooter({ event, logo, onBookClick }) {
  return (
    <footer style={{ position: "relative", borderTop: "1px solid var(--line)", paddingTop: 64, paddingBottom: 48, marginTop: 0 }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 40, alignItems: "start", marginBottom: 54 }} className="footgrid">
          <div>
            <img src={logo} alt="KI-Werkstatt Logo" style={{ width: 46, height: 46, marginBottom: 18 }} />
            <div className="display" style={{ fontSize: 22, marginBottom: 8 }}>KI-Werkstatt</div>
            <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 300, margin: 0 }}>Quick-Check für 360° KI-Marketing. Wir untersuchen Ihr Unternehmen auf KI-Tauglichkeit — direkt am Stand.</p>
          </div>
          <div>
            <div style={fHead}>Event</div>
            <FRow icon="cal" main={event.dateLong} sub={event.eventName} />
            <FRow icon="pin" main={event.place} sub={event.booth} />
          </div>
          <div>
            <div style={fHead}>Werkstatt-Slot</div>
            <p style={{ color: "var(--ink-dim)", fontSize: 14, marginTop: 0 }}>10 Minuten. Konkretes Ergebnis. Kein Verkaufsgespräch.</p>
            <button className="btn btn-cta" onClick={onBookClick}>Slot sichern <Icon name="arrow" size={16} /></button>
          </div>
        </div>
        <NeonDivider />
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 22, color: "var(--muted)", fontSize: 12.5, fontFamily: "Poppins", letterSpacing: ".05em" }}>
          <span>© 2026 KI-Werkstatt · {event.eventName}</span>
          <span>{event.dateLong} · {event.place} · {event.booth}</span>
        </div>
      </div>
    </footer>
  );
}
function FRow({ icon, main, sub }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      <span style={{ color: "var(--accent)", marginTop: 2 }}><Icon name={icon} size={18} /></span>
      <div><div style={{ fontSize: 14.5, color: "var(--ink)" }}>{main}</div><div style={{ fontSize: 12.5, color: "var(--muted)" }}>{sub}</div></div>
    </div>
  );
}

/* --------------------------- helpers / styles --------------------------- */
function nextWeekdays(n) {
  // mock: anchor around the event day in June 2026
  const base = ["MI", "DO", "FR", "MO", "DI", "MI"];
  const dom = ["24", "25", "26", "29", "30", "01"];
  return Array.from({ length: n }, (_, i) => ({ dow: base[i], dom: dom[i], label: `${base[i]} ${dom[i]}.06.` }));
}
const mockShell = { borderRadius: 4, background: "var(--glass)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "inset 0 0 0 1px var(--glass-line), 0 30px 80px rgba(0,0,0,.45)", overflow: "hidden" };
const fHead = { fontFamily: "Poppins", fontSize: 11.5, letterSpacing: ".24em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 18 };
const inp = { background: "rgba(140,190,230,.05)", border: "1px solid var(--line-strong)", borderRadius: 2, padding: "12px 14px", color: "var(--ink)", fontFamily: "Sora,sans-serif", fontSize: 14, outline: "none", minWidth: 0, maxWidth: "100%" };
function chip(active) { return { flex: "none", minWidth: 58, padding: "10px 12px", borderRadius: 2, cursor: "pointer", textAlign: "center", color: active ? "var(--cta-ink)" : "var(--ink-dim)", background: active ? "var(--accent)" : "rgba(140,190,230,.05)", border: "1px solid " + (active ? "var(--accent)" : "var(--line-strong)"), transition: "all .2s" }; }
function timeChip(active) { return { padding: "11px 6px", borderRadius: 2, cursor: "pointer", fontFamily: "Poppins", fontWeight: 500, fontSize: 14, color: active ? "var(--cta-ink)" : "var(--ink-dim)", background: active ? "var(--accent)" : "rgba(140,190,230,.05)", border: "1px solid " + (active ? "var(--accent)" : "var(--line-strong)"), transition: "all .2s" }; }
function slotBtn(active, full) {
  return {
    padding: "9px 6px", borderRadius: 2, textAlign: "center", transition: "all .2s",
    cursor: full ? "not-allowed" : "pointer",
    color: full ? "var(--muted)" : active ? "var(--cta-ink)" : "var(--ink-dim)",
    background: full ? "rgba(140,190,230,.03)" : active ? "var(--accent)" : "rgba(140,190,230,.05)",
    border: "1px solid " + (active ? "var(--accent)" : "var(--line-strong)"),
    opacity: full ? 0.55 : 1,
  };
}

/* cinematic scan-cut divider between vertical sections (fires sweep on enter) */
function ScanCut() {
  const ref = useRef(null);
  const reduce = useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const [fire, setFire] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => setFire(e.isIntersecting)), { threshold: 0.55 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);
  return (
    <div ref={ref} className={"scancut" + (fire ? " fire" : "")} aria-hidden="true">
      <span className="scancut-base" />
      <span className="scancut-tick l" />
      <span className="scancut-tick r" />
      <span className="scancut-sweep" />
    </div>
  );
}

/* dezenter Trust-Streifen */
function TrustStrip({ items }) {
  const list = items || [
    { icon: "spark", text: "team::mt" },
    { icon: "target", text: "Agentur aus München" },
    { icon: "check", text: "250+ Projekte" },
  ];
  return (
    <div className="truststrip" role="list">
      {list.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <span className="truststrip-sep" aria-hidden="true" /> : null}
          <span className="truststrip-item" role="listitem"><Icon name={it.icon} size={15} /> {it.text}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

/* RGB-Shift / chromatic-aberration glitch image (hover) */
function GlitchImage({ src, alt, className, style, imgStyle }) {
  const istyle = imgStyle || {};
  return (
    <div className={"glitch" + (className ? " " + className : "")} style={style}>
      <img className="glitch-base" src={src} alt={alt || ""} loading="lazy" style={istyle} />
      <img className="glitch-lay r" src={src} alt="" aria-hidden="true" style={istyle} />
      <img className="glitch-lay c" src={src} alt="" aria-hidden="true" style={istyle} />
    </div>
  );
}

Object.assign(window, { Icon, Reveal, Eyebrow, NeonDivider, CapabilityCard, CheckBlock, StepRow, Marquee, BookingEmbed, MockBooking, EventFooter, HazardEdge, QuickBook, LiveBadge, ScanBar, BigScan, FlagshipCheckCard, DemoCard, ConeFloat, ScanFrame, ScanLayer, GlobalScanCursor, ScanCut, TrustStrip, GlitchImage, useScanReveal, ScanReplay, StatusStempel });
