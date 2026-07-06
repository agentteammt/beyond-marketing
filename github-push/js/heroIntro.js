;(function(){
const HERO_INTRO_TIMING = {
desktop: {
approachMs: 1600,
igniteMs: 760,
ribbonStaggerMs: 120,
typeSpeedMs: 34,
ctaFadeMs: 440,
parallax: 1,
easing: "cubic-bezier(.16,.84,.3,1)"
},
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
function heroEaseOutCubic(t) {
t = Math.min(1, Math.max(0, t));
return 1 - Math.pow(1 - t, 3);
}
function useHeroIntro() {
const R = React;
const reduce = R.useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
const mobile = R.useRef(window.matchMedia && window.matchMedia("(pointer: coarse), (max-width: 700px)").matches).current;
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
}, [active]);
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
}, [play, done]);
const typed = full.slice(0, n);
const nl = typed.indexOf("\n");
const line1 = nl === -1 ? typed : typed.slice(0, nl);
const line2 = nl === -1 ? "" : typed.slice(nl + 1);
const typing = !done && play && n < full.length;
const caretOnLine1 = typing && nl === -1;
const caretOnLine2 = typing && nl !== -1;
const Caret = () => React.createElement("span", {
className: "tw-caret",
"aria-hidden": "true"
}, "\u258D");
return React.createElement("h2", {
"aria-label": lead + (accent ? " " + accent : ""),
style: {
fontSize: "clamp(40px,7vw,88px)",
marginBottom: 8,
minHeight: accent ? "1.96em" : "0.95em",
lineHeight: "0.85"
}
}, React.createElement("span", {
style: {
fontSize: "clamp(40px,14vw,75px)"
}
}, line1, caretOnLine1 ? React.createElement(Caret, null) : null), accent ? React.createElement(React.Fragment, null, React.createElement("br", null), React.createElement("span", {
style: {
color: "var(--accent)",
textShadow: "0 0 calc(50px*var(--glow)) color-mix(in srgb,var(--accent) 55%, transparent)",
fontSize: "clamp(40px,14vw,75px)",
lineHeight: "0.88"
}
}, line2, caretOnLine2 ? React.createElement(Caret, null) : null)) : null);
}
Object.assign(window, {
HERO_INTRO_TIMING,
heroEaseOutCubic,
useHeroIntro,
Typewriter
});
})();
