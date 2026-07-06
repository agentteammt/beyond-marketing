;(function(){
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
useState,
useEffect,
useRef
} = React;
function Icon({
name,
size = 24,
stroke = 1.6
}) {
const common = {
width: size,
height: size,
viewBox: "0 0 24 24",
fill: "none",
stroke: "currentColor",
strokeWidth: stroke,
strokeLinecap: "round",
strokeLinejoin: "round"
};
const P = {
scan: React.createElement("g", null, React.createElement("path", {
d: "M3 8V5a2 2 0 0 1 2-2h3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M21 16v3a2 2 0 0 1-2 2h-3"
}), React.createElement("circle", {
cx: "12",
cy: "12",
r: "3.2"
}), React.createElement("path", {
d: "M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21"
})),
linkedin: React.createElement("g", null, React.createElement("rect", {
x: "3",
y: "3",
width: "18",
height: "18",
rx: "2"
}), React.createElement("path", {
d: "M7 10v7M7 7v.01M11.5 17v-4a2 2 0 0 1 4 0v4M11.5 17v-7"
})),
video: React.createElement("g", null, React.createElement("rect", {
x: "3",
y: "6",
width: "13",
height: "12",
rx: "2"
}), React.createElement("path", {
d: "m16 10 5-3v10l-5-3z"
})),
bolt: React.createElement("path", {
d: "M13 2 4 14h6l-1 8 9-12h-6z"
}),
share: React.createElement("g", null, React.createElement("circle", {
cx: "6",
cy: "12",
r: "2.4"
}), React.createElement("circle", {
cx: "18",
cy: "6",
r: "2.4"
}), React.createElement("circle", {
cx: "18",
cy: "18",
r: "2.4"
}), React.createElement("path", {
d: "M8.1 10.9 15.9 7M8.1 13.1 15.9 17"
})),
check: React.createElement("path", {
d: "m4 12 5 5L20 6"
}),
arrow: React.createElement("path", {
d: "M5 12h14M13 6l6 6-6 6"
}),
cal: React.createElement("g", null, React.createElement("rect", {
x: "3",
y: "4",
width: "18",
height: "17",
rx: "2"
}), React.createElement("path", {
d: "M3 9h18M8 2v4M16 2v4"
})),
pin: React.createElement("g", null, React.createElement("path", {
d: "M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"
}), React.createElement("circle", {
cx: "12",
cy: "10",
r: "2.4"
})),
clock: React.createElement("g", null, React.createElement("circle", {
cx: "12",
cy: "12",
r: "9"
}), React.createElement("path", {
d: "M12 7v5l3.5 2"
})),
drag: React.createElement("g", null, React.createElement("path", {
d: "M12 2v6M12 16v6M2 12h6M16 12h6"
}), React.createElement("circle", {
cx: "12",
cy: "12",
r: "2.4"
})),
spark: React.createElement("path", {
d: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"
}),
target: React.createElement("g", null, React.createElement("circle", {
cx: "12",
cy: "12",
r: "9"
}), React.createElement("circle", {
cx: "12",
cy: "12",
r: "5"
}), React.createElement("circle", {
cx: "12",
cy: "12",
r: "1.4"
})),
chart: React.createElement("g", null, React.createElement("path", {
d: "M4 20V4M4 20h16"
}), React.createElement("path", {
d: "M8 16l3-4 3 2 4-6"
})),
cone: React.createElement("g", null, React.createElement("path", {
d: "M5 20h14"
}), React.createElement("path", {
d: "M8.5 20 11 4h2l2.5 16Z"
}), React.createElement("path", {
d: "M9.4 13h5.2M8.6 17h6.8"
})),
sign: React.createElement("g", null, React.createElement("path", {
d: "M12 3.5 21.5 20H2.5L12 3.5Z"
}), React.createElement("path", {
d: "M12 9.5v4.2M12 16.8v.2"
})),
helmet: React.createElement("g", null, React.createElement("path", {
d: "M3.5 18h17"
}), React.createElement("path", {
d: "M6 18a6 6 0 0 1 12 0"
}), React.createElement("path", {
d: "M10 6.5h4V11"
}))
};
return React.createElement("svg", _extends({}, common, {
"aria-hidden": "true"
}), P[name] || null);
}
function Reveal({
children,
delay = 0,
as = "div",
className = "",
style = {}
}) {
const ref = useRef(null);
useEffect(() => {
const el = ref.current;
if (!el) return;
const reveal = () => el.classList.add("in");
if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
reveal();
return;
}
const inView = () => {
const r = el.getBoundingClientRect();
return r.top < (window.innerHeight || 800) * 0.92 && r.bottom > 0;
};
if (inView()) {
setTimeout(reveal, delay);
return;
}
const io = new IntersectionObserver(ents => {
ents.forEach(e => {
if (e.isIntersecting) {
setTimeout(reveal, delay);
io.unobserve(el);
}
});
}, {
threshold: 0.16
});
io.observe(el);
const fs = setTimeout(() => {
if (!el.classList.contains("in") && inView()) reveal();
}, 1400);
return () => {
io.disconnect();
clearTimeout(fs);
};
}, [delay]);
const Tag = as;
return React.createElement(Tag, {
ref: ref,
className: "reveal " + className,
style: style
}, children);
}
function Eyebrow({
children,
num
}) {
return React.createElement("div", {
style: {
display: "flex",
alignItems: "center",
gap: 16,
marginBottom: 22
}
}, React.createElement("span", {
className: "eyebrow"
}, children), num && React.createElement("span", {
className: "kicker-num"
}, num));
}
function NeonDivider() {
return React.createElement("div", {
"aria-hidden": "true",
style: {
height: 1,
width: "100%",
background: "linear-gradient(90deg,transparent,var(--line-strong) 40%,var(--accent) 50%,var(--line-strong) 60%,transparent)",
opacity: 0.5
}
});
}
function CapabilityCard({
icon,
title,
body,
tag,
flagship
}) {
const [hover, setHover] = useState(false);
return React.createElement("div", {
onMouseEnter: () => setHover(true),
onMouseLeave: () => setHover(false),
style: {
position: "relative",
padding: "30px 28px 32px",
borderRadius: 3,
background: flagship ? "linear-gradient(160deg, color-mix(in srgb,var(--accent) 9%, var(--bg-2)) 0%, var(--bg-1) 70%)" : "var(--glass)",
backdropFilter: "blur(8px)",
WebkitBackdropFilter: "blur(8px)",
boxShadow: hover ? "inset 0 0 0 1px var(--accent), 0 0 calc(40px*var(--glow)) color-mix(in srgb,var(--accent) 22%, transparent)" : "inset 0 0 0 1px var(--glass-line)",
transform: hover ? "translateY(-4px)" : "none",
transition: "transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s",
height: "100%",
display: "flex",
flexDirection: "column"
}
}, flagship && React.createElement("span", {
style: {
position: "absolute",
top: 16,
right: 16,
fontFamily: "Poppins",
fontSize: 10.5,
letterSpacing: ".22em",
color: "var(--accent)",
textTransform: "uppercase"
}
}, "Live-Check"), React.createElement("div", {
style: {
width: 50,
height: 50,
borderRadius: 2,
display: "grid",
placeItems: "center",
color: "var(--accent)",
boxShadow: "inset 0 0 0 1px var(--line-strong)",
background: "rgba(120,200,220,.05)",
marginBottom: 22
}
}, React.createElement(Icon, {
name: icon,
size: 26
})), React.createElement("h3", {
style: {
fontSize: 21,
marginBottom: 10
}
}, title), React.createElement("p", {
style: {
color: "var(--ink-dim)",
fontSize: 14.5,
margin: 0,
flex: 1
}
}, body), tag && React.createElement("div", {
style: {
marginTop: 18,
fontFamily: "Poppins",
fontSize: 12,
letterSpacing: ".14em",
textTransform: "uppercase",
color: "var(--muted)"
}
}, tag));
}
function CheckBlock({
index,
kicker,
title,
lead,
points,
img,
alt,
reverse,
accent2
}) {
return React.createElement(Reveal, {
className: "checkblock",
style: {
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: "clamp(28px,5vw,72px)",
alignItems: "center"
}
}, React.createElement("div", {
style: {
order: reverse ? 2 : 1
}
}, React.createElement("div", {
style: {
display: "flex",
alignItems: "baseline",
gap: 16,
marginBottom: 18
}
}, React.createElement("span", {
className: "display",
style: {
fontSize: 13,
letterSpacing: ".3em",
color: accent2 ? "var(--accent-2)" : "var(--accent)"
}
}, kicker), React.createElement("span", {
className: "kicker-num"
}, index)), React.createElement("h2", {
style: {
fontSize: "clamp(28px,3.4vw,44px)",
marginBottom: 18,
textWrap: "balance"
}
}, title), React.createElement("p", {
className: "lead",
style: {
color: "var(--ink-dim)",
fontSize: 16.5,
marginBottom: 26,
maxWidth: 460
}
}, lead), React.createElement("ul", {
style: {
listStyle: "none",
padding: 0,
margin: 0,
display: "grid",
gap: 14
}
}, points.map((p, i) => React.createElement("li", {
key: i,
style: {
display: "flex",
gap: 14,
alignItems: "flex-start"
}
}, React.createElement("span", {
style: {
flex: "none",
marginTop: 2,
color: accent2 ? "var(--accent-2)" : "var(--accent)"
}
}, React.createElement(Icon, {
name: "check",
size: 18,
stroke: 2.2
})), React.createElement("span", {
style: {
color: "var(--ink)",
fontSize: 15
}
}, p))))), React.createElement("div", {
style: {
order: reverse ? 1 : 2,
position: "relative"
}
}, React.createElement("div", {
style: {
position: "relative",
borderRadius: 4,
overflow: "hidden",
boxShadow: "inset 0 0 0 1px var(--glass-line), 0 30px 80px rgba(0,0,0,.5)"
}
}, React.createElement("img", {
src: img,
alt: alt,
loading: "lazy",
style: {
width: "100%",
aspectRatio: "16/10",
objectFit: "cover",
display: "block"
}
}), React.createElement("div", {
"aria-hidden": "true",
style: {
position: "absolute",
inset: 0,
background: "linear-gradient(180deg, transparent 55%, rgba(5,6,10,.55))"
}
}), [["top:14px;left:14px", "border-top:1px solid var(--accent);border-left:1px solid var(--accent)"], ["top:14px;right:14px", "border-top:1px solid var(--accent);border-right:1px solid var(--accent)"], ["bottom:14px;left:14px", "border-bottom:1px solid var(--accent);border-left:1px solid var(--accent)"], ["bottom:14px;right:14px", "border-bottom:1px solid var(--accent);border-right:1px solid var(--accent)"]].map((c, i) => React.createElement("span", {
key: i,
"aria-hidden": "true",
style: cornerStyle(c[0], c[1])
})))));
}
function cornerStyle(pos, border) {
const o = {
position: "absolute",
width: 22,
height: 22,
opacity: 0.85
};
pos.split(";").forEach(kv => {
const [k, v] = kv.split(":");
o[k.trim()] = v.trim();
});
border.split(";").forEach(kv => {
const [k, v] = kv.split(":");
o[k.replace(/-([a-z])/g, (m, g) => g.toUpperCase()).trim()] = v.trim();
});
return o;
}
function StepRow({
num,
title,
body,
icon,
last
}) {
return React.createElement(Reveal, {
style: {
display: "grid",
gridTemplateColumns: "auto 1fr",
gap: 24,
position: "relative"
}
}, React.createElement("div", {
style: {
display: "flex",
flexDirection: "column",
alignItems: "center"
}
}, React.createElement("div", {
style: {
width: 56,
height: 56,
flex: "none",
borderRadius: "50%",
display: "grid",
placeItems: "center",
fontFamily: "Poppins",
fontWeight: 600,
fontSize: 18,
color: "var(--accent)",
boxShadow: "inset 0 0 0 1px var(--accent)",
background: "rgba(120,200,220,.04)"
}
}, num), !last && React.createElement("div", {
style: {
flex: 1,
width: 1,
marginTop: 8,
background: "linear-gradient(var(--line-strong),transparent)"
}
})), React.createElement("div", {
style: {
paddingBottom: last ? 0 : 44
}
}, React.createElement("div", {
style: {
display: "flex",
alignItems: "center",
gap: 12,
marginBottom: 10,
color: "var(--accent)"
}
}, React.createElement(Icon, {
name: icon,
size: 20
}), React.createElement("h3", {
style: {
fontSize: 22,
color: "var(--ink)"
}
}, title)), React.createElement("p", {
style: {
color: "var(--ink-dim)",
fontSize: 15.5,
margin: 0,
maxWidth: 560
}
}, body)));
}
function LiveBadge({
label = "LIVE",
color
}) {
return React.createElement("span", {
className: "live-badge",
style: {
display: "inline-flex",
alignItems: "center",
gap: 8,
fontFamily: "Poppins",
fontWeight: 600,
fontSize: 11,
letterSpacing: ".22em",
textTransform: "uppercase",
color: color || "var(--accent)"
}
}, React.createElement("span", {
className: "live-dot",
style: color ? {
background: color
} : null
}), " ", label);
}
function ScanBar({
label
}) {
return React.createElement("div", null, React.createElement("div", {
style: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 9
}
}, React.createElement("span", {
style: {
fontFamily: "Poppins",
fontSize: 11,
letterSpacing: ".14em",
textTransform: "uppercase",
color: "var(--accent)"
}
}, label), React.createElement("span", {
style: {
display: "inline-flex",
gap: 4
}
}, [0, 0.2, 0.4].map((d, i) => React.createElement("i", {
key: i,
className: "proc-dot",
style: {
width: 4,
height: 4,
borderRadius: 9,
background: "var(--accent)",
display: "inline-block",
animationDelay: d + "s"
}
})))), React.createElement("div", {
className: "scanbar-track"
}, React.createElement("div", {
className: "scanbar-seg"
})));
}
function BigScan({
label,
cols = 44
}) {
return React.createElement("div", {
className: "bigscan",
role: "img",
"aria-label": label
}, React.createElement("div", {
className: "bigscan-grid",
"aria-hidden": "true"
}), React.createElement("div", {
className: "bigscan-head"
}, React.createElement("span", {
className: "bigscan-label"
}, label), React.createElement("span", {
className: "bigscan-readout"
}, React.createElement("span", {
style: {
display: "inline-flex",
gap: 5
}
}, [0, 0.2, 0.4].map((d, i) => React.createElement("i", {
key: i,
className: "proc-dot",
style: {
width: 5,
height: 5,
borderRadius: 9,
background: "var(--accent)",
display: "inline-block",
animationDelay: d + "s"
}
}))), "Analysiert")), React.createElement("div", {
className: "bigscan-cols",
"aria-hidden": "true"
}, Array.from({
length: cols
}).map((_, i) => React.createElement("span", {
key: i,
className: "bigscan-col",
style: {
animationDelay: (i % 11 * 0.13 + i % 3 * 0.07).toFixed(2) + "s"
}
}))), React.createElement("div", {
className: "bigscan-sweep",
"aria-hidden": "true"
}), React.createElement("div", {
className: "bigscan-track",
"aria-hidden": "true"
}, React.createElement("div", {
className: "bigscan-seg"
})));
}
function FlagshipCheckCard({
index,
title,
body,
img,
alt,
scanLabel,
accent2
}) {
const [hover, setHover] = useState(false);
const root = Object.assign({
position: "relative",
borderRadius: 4,
overflow: "hidden",
"--ink-dim": "#cdd9ea",
minHeight: 446,
display: "flex",
flexDirection: "column",
transform: hover ? "translateY(-6px)" : "none",
transition: "transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s",
boxShadow: hover ? "inset 0 0 0 1px var(--accent), 0 26px 64px rgba(0,0,0,.55), 0 0 calc(54px*var(--glow)) color-mix(in srgb,var(--accent) 24%, transparent)" : "inset 0 0 0 1px var(--glass-line), 0 16px 40px rgba(0,0,0,.4)"
}, accent2 ? {
"--accent": "var(--accent-2)"
} : {});
const corners = [["top:16px;left:16px", "border-top:1px solid var(--accent);border-left:1px solid var(--accent)"], ["top:16px;right:16px", "border-top:1px solid var(--accent);border-right:1px solid var(--accent)"], ["bottom:16px;left:16px", "border-bottom:1px solid var(--accent);border-left:1px solid var(--accent)"], ["bottom:16px;right:16px", "border-bottom:1px solid var(--accent);border-right:1px solid var(--accent)"]];
return React.createElement("div", {
onMouseEnter: () => setHover(true),
onMouseLeave: () => setHover(false),
style: root
}, React.createElement("img", {
src: img,
alt: alt,
loading: "lazy",
style: {
position: "absolute",
inset: 0,
width: "100%",
height: "100%",
objectFit: "cover",
opacity: 0.9,
transform: hover ? "scale(1.07)" : "scale(1)",
transition: "transform .7s ease"
}
}), React.createElement("div", {
className: "scanline"
}), React.createElement("div", {
"aria-hidden": "true",
style: {
position: "absolute",
inset: 0,
background: "linear-gradient(180deg, rgba(5,6,10,.32) 0%, rgba(5,6,10,.5) 42%, rgba(5,6,10,.93) 100%)"
}
}), corners.map((c, i) => React.createElement("span", {
key: i,
"aria-hidden": "true",
style: cornerStyle(c[0], c[1])
})), React.createElement("div", {
style: {
position: "relative",
zIndex: 2,
padding: "26px 28px 28px",
marginTop: "auto",
display: "flex",
flexDirection: "column",
gap: 14
}
}, React.createElement("div", {
style: {
display: "flex",
justifyContent: "space-between",
alignItems: "center"
}
}, React.createElement(LiveBadge, {
color: "var(--accent)"
}), React.createElement("span", {
className: "kicker-num"
}, index)), React.createElement("h3", {
style: {
fontSize: "clamp(24px,2.7vw,33px)",
textWrap: "balance",
color: "#fff"
}
}, title), React.createElement("p", {
style: {
color: "var(--ink-dim)",
fontSize: 14.5,
margin: 0,
maxWidth: 430
}
}, body), React.createElement(ScanBar, {
label: scanLabel
})));
}
function DemoCard({
icon,
title,
body
}) {
const [hover, setHover] = useState(false);
return React.createElement("div", {
onMouseEnter: () => setHover(true),
onMouseLeave: () => setHover(false),
style: {
position: "relative",
padding: "26px 24px",
borderRadius: 3,
background: "var(--glass)",
backdropFilter: "blur(8px)",
WebkitBackdropFilter: "blur(8px)",
boxShadow: hover ? "inset 0 0 0 1px var(--accent), 0 0 calc(36px*var(--glow)) color-mix(in srgb,var(--accent) 18%, transparent)" : "inset 0 0 0 1px var(--glass-line)",
transform: hover ? "translateY(-4px)" : "none",
transition: "transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s",
display: "flex",
flexDirection: "column",
gap: 13,
height: "100%"
}
}, React.createElement("div", {
style: {
display: "flex",
justifyContent: "space-between",
alignItems: "center"
}
}, React.createElement("span", {
style: {
width: 46,
height: 46,
borderRadius: 2,
display: "grid",
placeItems: "center",
color: "var(--accent)",
boxShadow: "inset 0 0 0 1px var(--line-strong)",
background: "rgba(120,200,220,.05)"
}
}, React.createElement(Icon, {
name: icon,
size: 24
}))), React.createElement("h4", {
style: {
fontSize: 19,
fontFamily: "Poppins",
fontWeight: 600
}
}, title), React.createElement("p", {
style: {
color: "var(--ink-dim)",
fontSize: 14,
margin: 0,
flex: 1
}
}, body), React.createElement("div", {
style: {
display: "flex",
gap: 5,
alignItems: "center",
color: "var(--accent)",
fontFamily: "Poppins",
fontSize: 11,
letterSpacing: ".12em",
textTransform: "uppercase"
}
}, [0, 0.2, 0.4].map((d, i) => React.createElement("span", {
key: i,
className: "proc-dot",
style: {
width: 5,
height: 5,
borderRadius: 9,
background: "currentColor",
animationDelay: d + "s"
}
})), React.createElement("span", {
style: {
marginLeft: 6
}
}, "Live am Stand")));
}
function ConeFloat({
style,
size = 38,
delay = 0
}) {
return React.createElement("div", {
className: "cone-float",
"aria-hidden": "true",
style: Object.assign({
position: "absolute",
color: "var(--caution)",
opacity: 0.5,
animationDelay: delay + "s",
pointerEvents: "none"
}, style)
}, React.createElement(Icon, {
name: "cone",
size: size
}));
}
function ScanFrame() {
return React.createElement(React.Fragment, null, React.createElement("span", {
className: "scan-corner tl",
"aria-hidden": "true"
}), React.createElement("span", {
className: "scan-corner tr",
"aria-hidden": "true"
}), React.createElement("span", {
className: "scan-corner bl",
"aria-hidden": "true"
}), React.createElement("span", {
className: "scan-corner br",
"aria-hidden": "true"
}));
}
function useScanReveal(durMs) {
durMs = durMs || 640;
const reduce = useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
const ref = useRef(null);
const [run, setRun] = useState(0);
const [badging, setBadging] = useState(false);
const timers = useRef([]);
const replay = React.useCallback(() => {
timers.current.forEach(clearTimeout);
timers.current = [];
if (reduce) {
setRun(r => r + 1);
return;
}
setBadging(false);
setRun(r => r + 1);
timers.current.push(setTimeout(() => setBadging(true), Math.round(durMs * 0.78)));
timers.current.push(setTimeout(() => setBadging(false), Math.round(durMs * 0.78) + 440));
}, [reduce, durMs]);
useEffect(() => {
const el = ref.current;
if (!el) return;
let done = false;
const inView = () => {
const r = el.getBoundingClientRect();
return r.top < (window.innerHeight || 800) && r.bottom > 0;
};
const fire = () => {
if (done) return;
done = true;
replay();
io.disconnect();
clearTimeout(fs);
};
const io = new IntersectionObserver(es => es.forEach(e => {
if (e.isIntersecting && e.intersectionRatio > 0.1) fire();
}), {
threshold: [0, 0.1, 0.55]
});
io.observe(el);
const fs = setTimeout(() => {
if (!done && inView()) fire();
}, 1600);
return () => {
io.disconnect();
clearTimeout(fs);
timers.current.forEach(clearTimeout);
};
}, [replay]);
return {
ref,
run,
playing: run > 0 && !reduce,
badging,
reduce,
replay
};
}
function StatusStempel({
label,
sub,
color
}) {
const reduce = useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
const ref = useRef(null);
const rot = useRef(Math.random() * 12 - 6).current;
const [slam, setSlam] = useState(false);
useEffect(() => {
if (reduce) return;
const el = ref.current;
if (!el) return;
let done = false;
const io = new IntersectionObserver(es => es.forEach(e => {
if (e.isIntersecting && !done) {
done = true;
setSlam(true);
io.unobserve(el);
}
}), {
threshold: 0.6
});
io.observe(el);
return () => io.disconnect();
}, []);
const cls = "stamp" + (reduce ? " static" : slam ? " slam" : "");
return React.createElement("div", {
ref: ref,
className: cls,
style: {
"--stamp": color || "var(--caution)",
"--rot": rot.toFixed(2) + "deg"
},
"aria-hidden": "true"
}, React.createElement("span", {
className: "stamp-main"
}, label), sub ? React.createElement("span", {
className: "stamp-sub"
}, sub) : null);
}
function ScanReplay({
onClick
}) {
return React.createElement("button", {
className: "scan-replay",
onClick: onClick,
"aria-label": "Scan-Effekt erneut abspielen",
title: "Scan-Effekt erneut abspielen"
}, React.createElement(Icon, {
name: "spark",
size: 13
}), " Replay");
}
function GlobalScanCursor({
label = ""
}) {
const ref = useRef(null);
useEffect(() => {
const layer = ref.current;
if (!layer) return;
if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
const ret = layer.querySelector(".scan-reticle");
const vline = layer.querySelector(".scan-v");
const hline = layer.querySelector(".scan-h");
const lock = layer.querySelector(".scan-lock");
const lockLbl = lock.querySelector(".lock-lbl");
const lens = layer.querySelector(".invert-lens");
const SEL = ".btn-cta, [data-lock]"; 
let raf = 0,
tx = window.innerWidth / 2,
ty = window.innerHeight / 2,
cx = tx,
cy = ty,
shown = false;
let locked = null;
const onMove = e => {
tx = e.clientX;
ty = e.clientY;
if (!shown) {
layer.style.opacity = "1";
lens.classList.add("show");
shown = true;
}
};
const onLeave = e => {
if (!e.relatedTarget && !e.toElement) {
layer.style.opacity = "0";
lens.classList.remove("show");
shown = false;
}
};
const onOver = e => {
const t = e.target.closest && e.target.closest(SEL);
if (t) {
locked = t;
lockLbl.textContent = t.dataset && t.dataset.lock || "Ziel erfasst";
}
};
const onOut = e => {
if (!locked) return;
const to = e.relatedTarget;
if (!to || !(to.closest && to.closest(SEL))) locked = null;
};
const loop = () => {
cx += (tx - cx) * 0.35;
cy += (ty - cy) * 0.35;
lens.style.transform = "translate(" + tx + "px," + ty + "px)";
if (locked && document.contains(locked)) {
lens.classList.add("lock");
const r = locked.getBoundingClientRect();
if (r.width && r.height) {
layer.classList.add("locked");
lock.style.left = r.left + "px";
lock.style.top = r.top + "px";
lock.style.width = r.width + "px";
lock.style.height = r.height + "px";
const lx = r.left + r.width / 2,
ly = r.top + r.height / 2;
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
window.addEventListener("mousemove", onMove, {
passive: true
});
document.addEventListener("mouseout", onLeave);
document.addEventListener("mouseover", onOver, {
passive: true
});
document.addEventListener("mouseout", onOut, {
passive: true
});
raf = requestAnimationFrame(loop);
return () => {
cancelAnimationFrame(raf);
window.removeEventListener("mousemove", onMove);
document.removeEventListener("mouseout", onLeave);
document.removeEventListener("mouseover", onOver);
document.removeEventListener("mouseout", onOut);
};
}, []);
return React.createElement("div", {
ref: ref,
className: "scan-cursor",
"aria-hidden": "true"
}, React.createElement("div", {
className: "invert-lens"
}), React.createElement("div", {
className: "scan-v"
}), React.createElement("div", {
className: "scan-h"
}), React.createElement("div", {
className: "scan-lock"
}, React.createElement("span", {
className: "cnr tl"
}), React.createElement("span", {
className: "cnr tr"
}), React.createElement("span", {
className: "cnr bl"
}), React.createElement("span", {
className: "cnr br"
}), React.createElement("span", {
className: "lock-lbl"
}, "Ziel erfasst")), React.createElement("div", {
className: "scan-reticle"
}, React.createElement("div", {
className: "ring"
}), React.createElement("div", {
className: "ring2"
}), React.createElement("div", {
className: "ch h"
}), React.createElement("div", {
className: "ch v"
}), React.createElement("div", {
className: "dot"
}), label ? React.createElement("div", {
className: "lbl"
}, label) : null));
}
function ScanLayer({
label = "SCAN"
}) {
const ref = useRef(null);
useEffect(() => {
const layer = ref.current;
if (!layer) return;
const section = layer.parentElement;
if (!section) return;
if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
const ret = layer.querySelector(".scan-reticle");
const vline = layer.querySelector(".scan-v");
const hline = layer.querySelector(".scan-h");
const onMove = e => {
const r = section.getBoundingClientRect();
const x = e.clientX - r.left,
y = e.clientY - r.top;
layer.style.opacity = "1";
ret.style.transform = "translate(" + (x - 38) + "px," + (y - 38) + "px)";
vline.style.transform = "translateX(" + x + "px)";
hline.style.transform = "translateY(" + y + "px)";
};
const onLeave = () => {
layer.style.opacity = "0";
};
section.addEventListener("mousemove", onMove);
section.addEventListener("mouseleave", onLeave);
return () => {
section.removeEventListener("mousemove", onMove);
section.removeEventListener("mouseleave", onLeave);
};
}, []);
return React.createElement("div", {
ref: ref,
className: "scan-layer",
"aria-hidden": "true"
}, React.createElement("div", {
className: "scan-v"
}), React.createElement("div", {
className: "scan-h"
}), React.createElement("div", {
className: "scan-reticle"
}, React.createElement("div", {
className: "ring"
}), React.createElement("div", {
className: "ring2"
}), React.createElement("div", {
className: "ch h"
}), React.createElement("div", {
className: "ch v"
}), React.createElement("div", {
className: "dot"
}), React.createElement("div", {
className: "lbl"
}, label)));
}
function HazardEdge({
thin,
animate,
style
}) {
return React.createElement("div", {
"aria-hidden": "true",
className: "hazard hazard-edge" + (thin ? " thin" : "") + (animate ? " animate" : ""),
style: style
});
}
function QuickBook({
event,
onBook
}) {
const chips = ["13:15", "13:45", "15:30", "16:00"];
return React.createElement("div", {
style: {
position: "relative",
background: "linear-gradient(180deg, var(--bg-1), var(--bg-2))"
}
}, React.createElement(HazardEdge, {
animate: true
}), React.createElement("div", {
className: "wrap qb-grid",
style: {
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: 28,
padding: "22px 28px",
flexWrap: "wrap"
}
}, React.createElement("div", {
style: {
display: "flex",
alignItems: "center",
gap: 18
}
}, React.createElement("span", {
style: {
flex: "none",
width: 46,
height: 46,
borderRadius: 2,
display: "grid",
placeItems: "center",
color: "var(--caution)",
boxShadow: "inset 0 0 0 1px color-mix(in srgb,var(--caution) 50%, transparent)",
background: "color-mix(in srgb,var(--caution) 8%, transparent)"
}
}, React.createElement(Icon, {
name: "cone",
size: 24
})), React.createElement("div", null, React.createElement("div", {
className: "caution-tag"
}, "Werkstatt ge\xF6ffnet \xB7 ", event.dateShort, " \xB7 ", event.booth), React.createElement("div", {
className: "display",
style: {
fontSize: "clamp(18px,2.4vw,24px)",
marginTop: 4
}
}, "In 10 Minuten zum KI-Befund."))), React.createElement("div", {
style: {
display: "flex",
alignItems: "center",
gap: 10,
flexWrap: "wrap"
}
}, React.createElement("span", {
style: {
fontFamily: "Poppins",
fontSize: 12,
letterSpacing: ".14em",
textTransform: "uppercase",
color: "var(--muted)",
marginRight: 2
},
className: "qb-hide"
}, "Freie Slots"), chips.map(c => React.createElement("button", {
key: c,
onClick: onBook,
style: {
padding: "9px 14px",
borderRadius: 2,
cursor: "pointer",
fontFamily: "Poppins",
fontWeight: 500,
fontSize: 13.5,
color: "var(--ink)",
background: "rgba(140,190,230,.05)",
border: "1px solid var(--line-strong)",
transition: "all .2s"
},
onMouseEnter: e => {
e.currentTarget.style.borderColor = "var(--accent)";
e.currentTarget.style.color = "var(--accent)";
},
onMouseLeave: e => {
e.currentTarget.style.borderColor = "var(--line-strong)";
e.currentTarget.style.color = "var(--ink)";
}
}, c)), React.createElement("button", {
className: "btn btn-cta",
style: {
padding: "12px 22px",
fontSize: 14
},
onClick: onBook
}, "Slot sichern ", React.createElement(Icon, {
name: "arrow",
size: 16
})))), React.createElement(HazardEdge, {
thin: true,
animate: true
}));
}
function Marquee({
items
}) {
const row = [...items, ...items];
return React.createElement("div", {
"aria-hidden": "true",
style: {
overflow: "hidden",
borderTop: "1px solid var(--line)",
borderBottom: "1px solid var(--line)",
padding: "16px 0",
maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)"
}
}, React.createElement("div", {
style: {
display: "inline-flex",
gap: 0,
whiteSpace: "nowrap",
animation: "kiwmarq 34s linear infinite"
}
}, row.map((it, i) => React.createElement("span", {
key: i,
style: {
display: "inline-flex",
alignItems: "center",
gap: 22,
paddingRight: 22,
fontFamily: "Poppins",
fontSize: 15,
letterSpacing: ".04em",
color: i % 2 ? "var(--ink)" : "var(--muted)"
}
}, it, React.createElement("span", {
style: {
color: "var(--accent)",
fontSize: 8
}
}, "\u25C6")))), React.createElement("style", null, `@keyframes kiwmarq{to{transform:translateX(-50%)}}@media (prefers-reduced-motion: reduce){[style*="kiwmarq"]{animation:none!important}}`));
}
function BookingEmbed({
calendlyUrl,
booking,
event,
onBookClick
}) {
const mountRef = useRef(null);
const [loaded, setLoaded] = useState(false);
useEffect(() => {
if (!calendlyUrl) return;
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://assets.calendly.com/assets/external/widget.css";
document.head.appendChild(link);
const s = document.createElement("script");
s.src = "https://assets.calendly.com/assets/external/widget.js";
s.async = true;
s.onload = () => setLoaded(true);
document.body.appendChild(s);
return () => {
try {
document.head.removeChild(link);
document.body.removeChild(s);
} catch (e) {}
};
}, [calendlyUrl]);
if (calendlyUrl) {
return React.createElement("div", {
className: "calendly-inline-widget",
"data-url": calendlyUrl,
style: {
minWidth: 320,
height: 680,
borderRadius: 4,
overflow: "hidden",
boxShadow: "inset 0 0 0 1px var(--glass-line)"
},
ref: mountRef
});
}
return React.createElement(MockBooking, {
booking: booking,
event: event,
onBookClick: onBookClick
});
}
function toMin(hhmm) {
const [h, m] = hhmm.split(":").map(Number);
return h * 60 + m;
}
function fromMin(min) {
const h = Math.floor(min / 60),
m = min % 60;
return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}
function buildBlocks(booking) {
const step = booking.slotMinutes || 10;
return (booking.blocks || []).map(b => {
const slots = [];
for (let t = toMin(b.start); t + step <= toMin(b.end); t += step) slots.push(fromMin(t));
return {
label: b.label,
slots
};
});
}
function CapDots({
free,
total,
selected
}) {
const lit = selected ? "var(--cta-ink)" : "var(--accent)";
return React.createElement("span", {
style: {
display: "flex",
gap: 3,
marginTop: 6,
justifyContent: "center"
},
"aria-hidden": "true"
}, Array.from({
length: total
}).map((_, i) => React.createElement("span", {
key: i,
style: {
width: 5,
height: 5,
borderRadius: "50%",
background: i < free ? lit : selected ? "color-mix(in srgb,var(--cta-ink) 28%,transparent)" : "rgba(140,190,230,.30)",
boxShadow: i < free && !selected ? "0 0 5px var(--accent)" : "none"
}
})));
}
function labelHour(label) {
const m = String(label || "").match(/(\d{1,2}):(\d{2})/);
return m ? parseInt(m[1], 10) : null;
}
function labelMin(label) {
const m = String(label || "").match(/(\d{1,2}):(\d{2})/);
return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : null;
}
function groupAvailability(items, booking) {
const defs = booking && booking.blocks || [];
const groups = defs.map(b => ({
label: b.label,
start: toMin(b.start),
end: toMin(b.end),
items: []
}));
const rest = {
label: "Weitere Slots",
items: []
};
(items || []).forEach(it => {
const min = labelMin(it.label);
const g = min != null && groups.find(gr => min >= gr.start && min < gr.end) || null;
(g || rest).items.push(it);
});
if (rest.items.length) groups.push(rest);
return groups.filter(g => g.items.length).map(g => ({
label: g.label,
items: g.items.slice().sort((a, b) => String(a.label).localeCompare(String(b.label)))
}));
}
function MockBooking({
booking,
event,
onBookClick
}) {
const cfg = booking || {
date: "2026-06-25",
dateLabel: "25. Juni 2026",
slotMinutes: 10,
capacity: 3,
blocks: []
};
const cap = cfg.capacity || 3;
const live = !!(window.KIWBooking && window.KIWBooking.configured && window.KIWBooking.configured());
const demoAvail = React.useMemo(() => {
const out = [];
buildBlocks(cfg).forEach(b => b.slots.forEach(s => out.push({
slot_id: s,
label: s,
remaining: cap
})));
return out;
}, [cfg, cap]);
const [avail, setAvail] = useState(live ? null : demoAvail);
const [selected, setSelected] = useState(null); 
const [form, setForm] = useState({
name: "",
email: "",
company: "",
note: ""
});
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
if (!live) {
setLoading(false);
return;
}
(async () => {
try {
await refresh();
} catch (e) {
if (on) setError("Verfügbarkeit konnte nicht geladen werden. Bitte Seite neu laden.");
} finally {
if (on) setLoading(false);
}
})();
return () => {
on = false;
};
}, [live, refresh]);
const groups = React.useMemo(() => groupAvailability(avail, cfg), [avail, cfg]);
const slotById = id => (avail || []).find(s => s.slot_id === id) || null;
const valid = selected != null && form.name.trim() && /\S+@\S+\.\S+/.test(form.email);
async function submit() {
if (!valid || submitting) return;
setError(null);
setSubmitting(true);
try {
let result = "ok";
if (live) {
result = await window.KIWBooking.bookSlot(selected, form.name.trim(), form.email.trim(), form.company.trim(), form.note.trim());
} else {
const cur = slotById(selected);
if (!cur || cur.remaining <= 0) result = "full";else setAvail(a => a.map(s => s.slot_id === selected ? {
...s,
remaining: s.remaining - 1
} : s));
}
if (result === "ok") {
try {
await refresh();
} catch (e) {} 
onBookClick && onBookClick();
setDone(true);
} else if (result === "full") {
setError("Slot leider ausgebucht. Bitte wählen Sie einen anderen.");
try {
await refresh();
} catch (e) {}
setSelected(null);
} else {
setError("Dieser Slot ist nicht mehr verfügbar. Bitte aktualisieren Sie die Auswahl.");
try {
await refresh();
} catch (e) {}
setSelected(null);
}
} catch (err) {
setError("Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.");
} finally {
setSubmitting(false);
}
}
if (done) {
return React.createElement("div", {
style: mockShell
}, React.createElement("div", {
style: {
textAlign: "center",
padding: "60px 24px"
}
}, React.createElement("div", {
style: {
width: 64,
height: 64,
margin: "0 auto 22px",
borderRadius: "50%",
display: "grid",
placeItems: "center",
color: "var(--accent)",
boxShadow: "inset 0 0 0 1px var(--accent), 0 0 calc(40px*var(--glow)) color-mix(in srgb,var(--accent) 30%,transparent)"
}
}, React.createElement(Icon, {
name: "check",
size: 30,
stroke: 2.4
})), React.createElement("h3", {
style: {
fontSize: 24,
marginBottom: 10
}
}, "Slot gebucht"), React.createElement("p", {
style: {
color: "var(--ink-dim)",
maxWidth: 360,
margin: "0 auto",
fontSize: 15
}
}, cfg.dateLabel, ", ", slotById(selected) && slotById(selected).label || "", " Uhr \u2014 wir best\xE4tigen Ihren Werkstatt-Slot per E-Mail. Bis bald an ", event && event.booth || "Stand 14", "."), React.createElement("button", {
className: "btn btn-ghost",
style: {
marginTop: 26
},
onClick: () => {
setDone(false);
setSelected(null);
setForm({
name: "",
email: "",
company: "",
note: ""
});
}
}, "Weiteren Slot buchen")));
}
return React.createElement("div", {
style: mockShell
}, React.createElement(HazardEdge, {
thin: true,
animate: true
}), React.createElement("div", {
style: {
display: "flex",
alignItems: "center",
justifyContent: "space-between",
padding: "18px 22px",
borderBottom: "1px solid var(--line)"
}
}, React.createElement("div", {
style: {
display: "flex",
alignItems: "center",
gap: 10,
color: "var(--accent)"
}
}, React.createElement(Icon, {
name: "cal",
size: 18
}), React.createElement("span", {
style: {
fontFamily: "Poppins",
fontWeight: 600,
fontSize: 14,
color: "var(--ink)"
}
}, "Werkstatt-Slot \xB7 ", cfg.dateLabel)), React.createElement("span", {
style: {
fontFamily: "Poppins",
fontSize: 11.5,
letterSpacing: ".18em",
color: "var(--muted)",
textTransform: "uppercase"
}
}, cfg.slotMinutes, " Min \xB7 ", event && event.booth || "Stand 14")), React.createElement("div", {
style: {
padding: "22px"
}
}, loading ? React.createElement("div", {
style: {
display: "flex",
alignItems: "center",
gap: 10,
color: "var(--muted)",
fontSize: 13,
fontFamily: "Poppins",
letterSpacing: ".04em",
padding: "10px 0 22px"
}
}, React.createElement("span", {
className: "live-dot"
}), " Verf\xFCgbarkeit wird geladen \u2026") : React.createElement("div", {
style: {
marginBottom: 18
}
}, groups.length === 0 && React.createElement("div", {
style: {
color: "var(--muted)",
fontSize: 13,
padding: "6px 0 18px"
}
}, "Aktuell sind keine Slots verf\xFCgbar."), groups.map((b, bi) => React.createElement("div", {
key: bi,
style: {
marginBottom: bi < groups.length - 1 ? 18 : 0
}
}, React.createElement("div", {
style: {
fontFamily: "Poppins",
fontSize: 11,
letterSpacing: ".2em",
textTransform: "uppercase",
color: "var(--muted)",
marginBottom: 10
}
}, b.label, " \xB7 ", b.items[0].label, "\u2013", b.items[b.items.length - 1].label), React.createElement("div", {
style: {
display: "grid",
gridTemplateColumns: "repeat(auto-fill,minmax(76px,1fr))",
gap: 10
}
}, b.items.map(it => {
const free = Math.max(0, it.remaining | 0);
const full = free <= 0;
const sel = it.slot_id === selected;
return React.createElement("button", {
key: it.slot_id,
disabled: full,
onClick: () => {
setSelected(it.slot_id);
setError(null);
},
title: full ? "Ausgebucht" : free + " von " + cap + " frei",
style: {
...slotBtn(sel, full),
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 0
}
}, React.createElement("span", {
style: {
fontFamily: "Poppins",
fontWeight: 600,
fontSize: 14
}
}, it.label), full ? React.createElement("span", {
style: {
fontSize: 9.5,
letterSpacing: ".12em",
textTransform: "uppercase",
marginTop: 5,
opacity: .85
}
}, "voll") : React.createElement(CapDots, {
free: Math.min(free, cap),
total: cap,
selected: sel
}));
}))))), React.createElement("div", {
style: {
display: "grid",
gap: 10,
gridTemplateColumns: "1fr 1fr",
marginBottom: 10
}
}, React.createElement("input", {
placeholder: "Name",
"aria-label": "Name",
value: form.name,
onChange: e => setForm({
...form,
name: e.target.value
}),
style: inp
}), React.createElement("input", {
placeholder: "Unternehmen",
"aria-label": "Unternehmen",
value: form.company,
onChange: e => setForm({
...form,
company: e.target.value
}),
style: inp
})), React.createElement("input", {
placeholder: "E-Mail",
"aria-label": "E-Mail",
type: "email",
value: form.email,
onChange: e => setForm({
...form,
email: e.target.value
}),
style: {
...inp,
width: "100%",
marginBottom: 10
}
}), React.createElement("textarea", {
placeholder: "Notiz / Anliegen (optional)",
"aria-label": "Notiz / Anliegen",
value: form.note,
onChange: e => setForm({
...form,
note: e.target.value
}),
rows: 2,
style: {
...inp,
width: "100%",
marginBottom: 16,
resize: "vertical",
minHeight: 44,
fontFamily: "Sora,sans-serif"
}
}), error && React.createElement("div", {
role: "alert",
style: {
display: "flex",
gap: 9,
alignItems: "flex-start",
color: "var(--cta)",
fontSize: 13,
marginBottom: 14,
lineHeight: 1.4
}
}, React.createElement(Icon, {
name: "cone",
size: 15
}), React.createElement("span", null, error)), React.createElement("button", {
className: "btn btn-cta",
style: {
width: "100%",
opacity: valid && !submitting ? 1 : 0.45,
pointerEvents: valid && !submitting ? "auto" : "none"
},
onClick: submit
}, submitting ? "Wird gebucht …" : React.createElement(React.Fragment, null, "Slot sichern ", React.createElement(Icon, {
name: "arrow",
size: 16
}))), React.createElement("p", {
style: {
textAlign: "center",
color: "var(--muted)",
fontSize: 12,
marginTop: 14,
marginBottom: 0
}
}, live ? React.createElement(React.Fragment, null, "Jeder Slot ist ", cap, "\xD7 verf\xFCgbar \xB7 Echtzeit-Buchung \xFCber Supabase") : React.createElement(React.Fragment, null, "Demo-Modus \xB7 Supabase-Zugang in ", React.createElement("code", {
style: {
color: "var(--accent)"
}
}, "window.KIW_SUPABASE"), " (index.html) eintragen")), React.createElement("div", {
style: {
marginTop: 18,
paddingTop: 16,
borderTop: "1px solid var(--line)",
display: "flex",
justifyContent: "center"
}
}, React.createElement("div", {
className: "tik-badge",
style: {
gap: 12
}
}, React.createElement("span", {
style: {
fontFamily: "Poppins",
fontWeight: 600,
fontSize: 10,
letterSpacing: ".22em",
textTransform: "uppercase",
color: "var(--muted)",
whiteSpace: "nowrap"
}
}, "Ihr Werkstatt-Slot auf dem"), React.createElement("img", {
src: "assets/tik-logo-white.png",
alt: "Tag der Industriekommunikation – KI-Werkstatt der KI Marketing Agentur team::mt",
style: {
height: 22,
width: "auto",
display: "block",
opacity: .95
}
})))));
}
function EventFooter({
event,
logo,
onBookClick
}) {
return React.createElement("footer", {
style: {
position: "relative",
borderTop: "1px solid var(--line)",
paddingTop: 64,
paddingBottom: 48,
marginTop: 0
}
}, React.createElement("div", {
className: "wrap"
}, React.createElement("div", {
style: {
display: "grid",
gridTemplateColumns: "1.3fr 1fr 1fr",
gap: 40,
alignItems: "start",
marginBottom: 54
},
className: "footgrid"
}, React.createElement("div", null, React.createElement("img", {
src: logo,
alt: "KI-Werkstatt – Live-Format der KI Marketing Agentur team::mt",
style: {
width: 46,
height: 46,
marginBottom: 18
}
}), React.createElement("div", {
className: "display",
style: {
fontSize: 22,
marginBottom: 8
}
}, "KI-Werkstatt"), React.createElement("p", {
style: {
color: "var(--muted)",
fontSize: 14,
maxWidth: 300,
margin: 0
}
}, "Quick-Check f\xFCr 360\xB0 KI-Marketing. Wir untersuchen Ihr Unternehmen auf KI-Tauglichkeit \u2014 direkt am Stand.")), React.createElement("div", null, React.createElement("div", {
style: fHead
}, "Event"), React.createElement(FRow, {
icon: "cal",
main: event.dateLong,
sub: event.eventName
}), React.createElement(FRow, {
icon: "pin",
main: event.place,
sub: event.booth
})), React.createElement("div", null, React.createElement("div", {
style: fHead
}, "Werkstatt-Slot"), React.createElement("p", {
style: {
color: "var(--ink-dim)",
fontSize: 14,
marginTop: 0
}
}, "10 Minuten. Konkretes Ergebnis. Kein Verkaufsgespr\xE4ch."), React.createElement("button", {
className: "btn btn-cta",
onClick: onBookClick
}, "Slot sichern ", React.createElement(Icon, {
name: "arrow",
size: 16
})))), React.createElement(NeonDivider, null), React.createElement("div", {
style: {
display: "flex",
justifyContent: "space-between",
flexWrap: "wrap",
gap: 12,
paddingTop: 22,
color: "var(--muted)",
fontSize: 12.5,
fontFamily: "Poppins",
letterSpacing: ".05em"
}
}, React.createElement("span", null, "\xA9 2026 KI-Werkstatt \xB7 ", event.eventName), React.createElement("span", null, event.dateLong, " \xB7 ", event.place, " \xB7 ", event.booth))));
}
function FRow({
icon,
main,
sub
}) {
return React.createElement("div", {
style: {
display: "flex",
gap: 12,
marginBottom: 16
}
}, React.createElement("span", {
style: {
color: "var(--accent)",
marginTop: 2
}
}, React.createElement(Icon, {
name: icon,
size: 18
})), React.createElement("div", null, React.createElement("div", {
style: {
fontSize: 14.5,
color: "var(--ink)"
}
}, main), React.createElement("div", {
style: {
fontSize: 12.5,
color: "var(--muted)"
}
}, sub)));
}
function nextWeekdays(n) {
const base = ["MI", "DO", "FR", "MO", "DI", "MI"];
const dom = ["24", "25", "26", "29", "30", "01"];
return Array.from({
length: n
}, (_, i) => ({
dow: base[i],
dom: dom[i],
label: `${base[i]} ${dom[i]}.06.`
}));
}
const mockShell = {
borderRadius: 4,
background: "var(--glass)",
backdropFilter: "blur(10px)",
WebkitBackdropFilter: "blur(10px)",
boxShadow: "inset 0 0 0 1px var(--glass-line), 0 30px 80px rgba(0,0,0,.45)",
overflow: "hidden"
};
const fHead = {
fontFamily: "Poppins",
fontSize: 11.5,
letterSpacing: ".24em",
textTransform: "uppercase",
color: "var(--accent)",
marginBottom: 18
};
const inp = {
background: "rgba(140,190,230,.05)",
border: "1px solid var(--line-strong)",
borderRadius: 2,
padding: "12px 14px",
color: "var(--ink)",
fontFamily: "Sora,sans-serif",
fontSize: 14,
outline: "none",
minWidth: 0,
maxWidth: "100%"
};
function chip(active) {
return {
flex: "none",
minWidth: 58,
padding: "10px 12px",
borderRadius: 2,
cursor: "pointer",
textAlign: "center",
color: active ? "var(--cta-ink)" : "var(--ink-dim)",
background: active ? "var(--accent)" : "rgba(140,190,230,.05)",
border: "1px solid " + (active ? "var(--accent)" : "var(--line-strong)"),
transition: "all .2s"
};
}
function timeChip(active) {
return {
padding: "11px 6px",
borderRadius: 2,
cursor: "pointer",
fontFamily: "Poppins",
fontWeight: 500,
fontSize: 14,
color: active ? "var(--cta-ink)" : "var(--ink-dim)",
background: active ? "var(--accent)" : "rgba(140,190,230,.05)",
border: "1px solid " + (active ? "var(--accent)" : "var(--line-strong)"),
transition: "all .2s"
};
}
function slotBtn(active, full) {
return {
padding: "9px 6px",
borderRadius: 2,
textAlign: "center",
transition: "all .2s",
cursor: full ? "not-allowed" : "pointer",
color: full ? "var(--muted)" : active ? "var(--cta-ink)" : "var(--ink-dim)",
background: full ? "rgba(140,190,230,.03)" : active ? "var(--accent)" : "rgba(140,190,230,.05)",
border: "1px solid " + (active ? "var(--accent)" : "var(--line-strong)"),
opacity: full ? 0.55 : 1
};
}
function ScanCut() {
const ref = useRef(null);
const reduce = useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
const [fire, setFire] = useState(false);
useEffect(() => {
if (reduce) return;
const el = ref.current;
if (!el) return;
const io = new IntersectionObserver(es => es.forEach(e => setFire(e.isIntersecting)), {
threshold: 0.55
});
io.observe(el);
return () => io.disconnect();
}, [reduce]);
return React.createElement("div", {
ref: ref,
className: "scancut" + (fire ? " fire" : ""),
"aria-hidden": "true"
}, React.createElement("span", {
className: "scancut-base"
}), React.createElement("span", {
className: "scancut-tick l"
}), React.createElement("span", {
className: "scancut-tick r"
}), React.createElement("span", {
className: "scancut-sweep"
}));
}
function TrustStrip({
items
}) {
const list = items || [{
icon: "spark",
text: "team::mt"
}, {
icon: "target",
text: "Agentur aus München"
}, {
icon: "check",
text: "250+ Projekte"
}];
return React.createElement("div", {
className: "truststrip",
role: "list"
}, list.map((it, i) => React.createElement(React.Fragment, {
key: i
}, i > 0 ? React.createElement("span", {
className: "truststrip-sep",
"aria-hidden": "true"
}) : null, React.createElement("span", {
className: "truststrip-item",
role: "listitem"
}, React.createElement(Icon, {
name: it.icon,
size: 15
}), " ", it.text))));
}
function GlitchImage({
src,
alt,
className,
style,
imgStyle
}) {
const istyle = imgStyle || {};
return React.createElement("div", {
className: "glitch" + (className ? " " + className : ""),
style: style
}, React.createElement("img", {
className: "glitch-base",
src: src,
alt: alt || "",
loading: "lazy",
style: istyle
}), React.createElement("img", {
className: "glitch-lay r",
src: src,
alt: "",
"aria-hidden": "true",
style: istyle
}), React.createElement("img", {
className: "glitch-lay c",
src: src,
alt: "",
"aria-hidden": "true",
style: istyle
}));
}
Object.assign(window, {
Icon,
Reveal,
Eyebrow,
NeonDivider,
CapabilityCard,
CheckBlock,
StepRow,
Marquee,
BookingEmbed,
MockBooking,
EventFooter,
HazardEdge,
QuickBook,
LiveBadge,
ScanBar,
BigScan,
FlagshipCheckCard,
DemoCard,
ConeFloat,
ScanFrame,
ScanLayer,
GlobalScanCursor,
ScanCut,
TrustStrip,
GlitchImage,
useScanReveal,
ScanReplay,
StatusStempel
});
})();
