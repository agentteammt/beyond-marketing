(function () {
"use strict";
function send(name, params) {
try { if (window.gtag) window.gtag("event", name, params || {}); } catch (e) { }
}
window.beyondTrack = send;
function slug(s) {
return String(s || "").toLowerCase()
.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function once(key) {
try {
if (sessionStorage.getItem("beyond_" + key)) return false;
sessionStorage.setItem("beyond_" + key, "1");
return true;
} catch (e) { return true; }
}
function sectionOf(el) {
var s = el.closest ? el.closest("section[id]") : null;
if (s && s.id) return s.id;
if (el.closest && el.closest("header")) return "header";
if (el.closest && el.closest("footer")) return "footer";
return "page";
}
document.addEventListener("click", function (e) {
var t = e.target;
if (!t || !t.closest) return;
var el = t.closest("[data-beyond-event]");
if (el) {
send(el.getAttribute("data-beyond-event"), {
click_text: (el.textContent || "").trim().slice(0, 80),
click_classes: String(el.className || ""),
click_location: sectionOf(el)
});
return;
}
if (t.closest("[data-beyond-skip]")) return;
var a = t.closest('a[href*="team-mt.de"]');
if (a) {
a.classList.add("beyond-track-out-teammt");
send("Beyond_Outbound_TeamMT", {
link_url: a.href,
click_location: sectionOf(a)
});
return;
}
var btn = t.closest(".btn-cta, .btn-ghost");
if (btn) {
btn.classList.add("beyond-track-cta-auto");
send("Beyond_CTA_" + slug(sectionOf(btn)), {
click_text: (btn.textContent || "").trim().slice(0, 80),
click_classes: String(btn.className || ""),
click_location: sectionOf(btn)
});
}
}, true);
var MARKS = [
[30, "Beyond_Engagement_30s"],
[60, "Beyond_Engagement_1min"],
[120, "Beyond_Engagement_2min"],
[240, "Beyond_Engagement_4min"]
];
var activeSec = 0;
setInterval(function () {
if (document.visibilityState !== "visible") return;
activeSec++;
for (var i = 0; i < MARKS.length; i++) {
if (activeSec === MARKS[i][0] && once(MARKS[i][1])) {
send(MARKS[i][1], { engagement_seconds: MARKS[i][0] });
}
}
}, 1000);
var THRESHOLDS = [
[30, "Beyond_Scroll_30"],
[50, "Beyond_Scroll_50"],
[75, "Beyond_Scroll_75"],
[90, "Beyond_Scroll_90"]
];
function routeKey() { return ((location.pathname || "/").replace(/\.html$/i, "").replace(/[^a-z]/gi, "") || "home"); }
function checkScroll() {
var doc = document.documentElement;
var max = (doc.scrollHeight || 0) - window.innerHeight;
if (max < 200) return;
var pct = (window.scrollY || doc.scrollTop || 0) / max * 100;
for (var i = 0; i < THRESHOLDS.length; i++) {
if (pct >= THRESHOLDS[i][0] && once(THRESHOLDS[i][1] + "_" + routeKey())) {
send(THRESHOLDS[i][1], {
percent_scrolled: THRESHOLDS[i][0],
page_route: (location.pathname || "/") + (location.hash || "")
});
}
}
}
window.addEventListener("scroll", checkScroll, { passive: true });
window.addEventListener("load", function () {
if (window.__lenis && window.__lenis.on) {
try { window.__lenis.on("scroll", checkScroll); } catch (e) { }
}
});
})();
