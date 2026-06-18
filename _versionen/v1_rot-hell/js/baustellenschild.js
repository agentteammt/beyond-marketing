/* AUTO-GENERIERT aus baustellenschild.jsx — NICHT direkt bearbeiten (Quelle: baustellenschild.jsx, dann neu kompilieren). */
;(function(){
/* baustellenschild.jsx — personalisierter Baustellenschild-Generator.
   Export (window): BaustellenschildGenerator.  Genutzt als variant="section" und "intro".

   ┌───────────────────────────────────────────────────────────────────┐
   │  ANPASSBARE KONSTANTEN                                              │
   │  SCHILD.template(firma) : Haupttext-Vorlage                        │
   │  SCHILD.subline         : kleine Fußzeile                          │
   │  SCHILD.colors          : Farben (Hazard/Akzent/BG/Ink)            │
   │  SCHILD.export          : PNG-Exportgröße                          │
   └───────────────────────────────────────────────────────────────────┘ */
const SCHILD = {
  placeholder: "Ihr Unternehmen",
  fallbackName: "IHR UNTERNEHMEN",
  template: firma => "Achtung – " + firma + " wird gerade KI-tauglich gemacht",
  subline: "KI-WERKSTATT · BAUSTELLE IM ORBIT · v1.0",
  shareText: "Mein Unternehmen wird gerade KI-tauglich gemacht — live an Stand 14 der KI-Werkstatt.",
  colors: {
    hazard: "#ffce2e",
    accent: "#1fe6d2",
    bg0: "#0e1626",
    bg1: "#070b16",
    ink: "#eaf6ff",
    muted: "#7e93ad"
  },
  export: {
    w: 1200,
    h: 760,
    scale: 1
  }
};

/* ---- Canvas-PNG-Export: zeichnet das Schild deterministisch (erst auf Klick) ---- */
function wrapLines(ctx, text, maxW) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}
function renderSchildPNG(firma) {
  const C = SCHILD.colors,
    W = SCHILD.export.w,
    H = SCHILD.export.h;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  // background panel
  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, C.bg0);
  bg.addColorStop(1, C.bg1);
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  // hazard border band
  const band = 30;
  g.save();
  g.beginPath();
  g.rect(0, 0, W, H);
  g.rect(band, band, W - 2 * band, H - 2 * band);
  g.clip("evenodd");
  g.fillStyle = "#11141c";
  g.fillRect(0, 0, W, H);
  g.strokeStyle = C.hazard;
  g.lineWidth = 22;
  for (let x = -H; x < W + H; x += 44) {
    g.beginPath();
    g.moveTo(x, -10);
    g.lineTo(x + H + 20, H + 10);
    g.stroke();
  }
  g.restore();
  // inner teal frame
  g.strokeStyle = "rgba(31,230,210,.55)";
  g.lineWidth = 3;
  g.strokeRect(band + 16, band + 16, W - 2 * (band + 16), H - 2 * (band + 16));
  // warning triangle
  const cx = W / 2,
    ty = 120;
  g.strokeStyle = C.hazard;
  g.lineWidth = 7;
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(cx, ty - 34);
  g.lineTo(cx + 40, ty + 34);
  g.lineTo(cx - 40, ty + 34);
  g.closePath();
  g.stroke();
  g.fillStyle = C.hazard;
  g.font = "bold 44px 'Poppins', sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("!", cx, ty + 8);
  // main text
  const name = (firma || SCHILD.fallbackName).toUpperCase();
  const full = ("Achtung – " + name + " wird gerade KI-tauglich gemacht").toUpperCase();
  g.font = "700 52px 'Poppins', sans-serif";
  g.textAlign = "center";
  g.textBaseline = "alphabetic";
  const lines = wrapLines(g, full, W - 220);
  const lh = 60;
  let y = H / 2 - (lines.length - 1) * lh / 2 + 6;
  for (const ln of lines) {
    // colour the company name teal where it appears
    g.fillStyle = ln.indexOf(name) !== -1 ? C.ink : C.ink;
    g.fillText(ln, cx, y);
    y += lh;
  }
  // subline
  g.fillStyle = C.muted;
  g.font = "600 19px 'Poppins', sans-serif";
  g.fillText(SCHILD.subline, cx, H - 70);
  // corner screws
  for (const [sx, sy] of [[band + 30, band + 30], [W - band - 30, band + 30], [band + 30, H - band - 30], [W - band - 30, H - band - 30]]) {
    const r = 9;
    const grd = g.createRadialGradient(sx - 3, sy - 3, 1, sx, sy, r);
    grd.addColorStop(0, "#cfd8e2");
    grd.addColorStop(.6, "#6b7682");
    grd.addColorStop(1, "#3a4350");
    g.fillStyle = grd;
    g.beginPath();
    g.arc(sx, sy, r, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgba(0,0,0,.5)";
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(sx - 5, sy - 3);
    g.lineTo(sx + 5, sy + 3);
    g.stroke();
  }
  return cv;
}

/* ---- Live-Schild (DOM-Vorschau) ---- */
function SchildPreview({
  firma,
  generating
}) {
  const name = (firma || SCHILD.fallbackName).toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    className: "schild" + (generating ? " gen" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "schild-frame"
  }, /*#__PURE__*/React.createElement("span", {
    className: "screw tl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "screw tr"
  }), /*#__PURE__*/React.createElement("span", {
    className: "screw bl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "screw br"
  }), /*#__PURE__*/React.createElement("div", {
    className: "schild-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "schild-ico"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sign",
    size: 34
  })), /*#__PURE__*/React.createElement("div", {
    className: "schild-main"
  }, "Achtung \u2013 ", /*#__PURE__*/React.createElement("span", {
    className: "hl"
  }, name), " wird gerade KI-tauglich gemacht"), /*#__PURE__*/React.createElement("div", {
    className: "schild-sub"
  }, SCHILD.subline)), generating && /*#__PURE__*/React.createElement("span", {
    className: "schild-scan",
    "aria-hidden": "true"
  })));
}
function BaustellenschildGenerator({
  variant
}) {
  const reduce = useRef(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const uid = useRef("bsg-" + Math.random().toString(36).slice(2, 7)).current;
  const [firma, setFirma] = useState("");
  const [generating, setGenerating] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const genTimer = useRef(null);

  // Einrast-/Scan-Effekt nach kurzer Tipp-Pause (nicht bei jedem Tastendruck Export!)
  const onChange = v => {
    setFirma(v);
    if (reduce) return;
    clearTimeout(genTimer.current);
    setGenerating(false);
    genTimer.current = setTimeout(() => {
      setGenerating(true);
      setTimeout(() => setGenerating(false), 950);
    }, 450);
  };
  useEffect(() => () => clearTimeout(genTimer.current), []);
  const download = () => {
    const cv = renderSchildPNG(firma); // PNG erst auf Klick rendern
    cv.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ki-werkstatt-schild" + (firma ? "-" + firma.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "") + ".png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, "image/png");
  };
  const share = async () => {
    const text = SCHILD.shareText;
    try {
      if (navigator.share) {
        // mit Bild teilen, wenn möglich
        try {
          const cv = renderSchildPNG(firma);
          const blob = await new Promise(res => cv.toBlob(res, "image/png"));
          const file = new File([blob], "ki-werkstatt-schild.png", {
            type: "image/png"
          });
          if (navigator.canShare && navigator.canShare({
            files: [file]
          })) {
            await navigator.share({
              title: "KI-Werkstatt",
              text,
              files: [file]
            });
            return;
          }
        } catch (e) {}
        await navigator.share({
          title: "KI-Werkstatt",
          text
        });
        return;
      }
      await navigator.clipboard.writeText(text);
      setShareMsg("In Zwischenablage kopiert ✓");
      setTimeout(() => setShareMsg(""), 2500);
    } catch (e) {
      setShareMsg("Teilen nicht verfügbar");
      setTimeout(() => setShareMsg(""), 2500);
    }
  };

  // DSGVO: nur mit aktiver Checkbox, kein Auto-Submit, keine Daten in URLs
  const sendMail = () => {
    if (!consent || !email) return;
    setSent(true);
  };
  const intro = variant === "intro";
  return /*#__PURE__*/React.createElement("section", {
    id: intro ? undefined : "schild",
    className: "sec-pad" + (intro ? " bsg-intro" : ""),
    style: intro ? {
      padding: "clamp(36px,5vw,60px) 0"
    } : undefined
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bsg-grid",
    style: {
      display: "grid",
      gridTemplateColumns: intro ? "1fr 1fr" : "1fr 1.1fr",
      gap: "clamp(28px,5vw,64px)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "caution-tag",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sign",
    size: 15
  }), " Baustellenschild-Generator"), !intro && /*#__PURE__*/React.createElement(Eyebrow, {
    num: "// 06"
  }, "Ihr pers\xF6nliches Warnschild"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: intro ? "clamp(24px,3.4vw,38px)" : "clamp(30px,4.2vw,52px)",
      marginBottom: 16,
      textWrap: "balance"
    }
  }, "Machen Sie Ihre Marke ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)"
    }
  }, "KI-tauglich"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--ink-dim)",
      fontSize: 16,
      marginBottom: 24,
      maxWidth: 440
    }
  }, "Firmennamen eingeben \u2014 Ihr Baustellenschild entsteht live. Zum Mitnehmen und Teilen."), /*#__PURE__*/React.createElement("label", {
    htmlFor: uid + "-firma",
    style: {
      display: "block",
      fontFamily: "Poppins",
      fontSize: 12,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--muted)",
      marginBottom: 8
    }
  }, "Ihr Unternehmen"), /*#__PURE__*/React.createElement("input", {
    id: uid + "-firma",
    value: firma,
    onChange: e => onChange(e.target.value),
    placeholder: SCHILD.placeholder,
    maxLength: 40,
    style: {
      width: "100%",
      background: "rgba(140,190,230,.05)",
      border: "1px solid var(--line-strong)",
      borderRadius: 2,
      padding: "14px 16px",
      color: "var(--ink)",
      fontFamily: "Poppins, sans-serif",
      fontSize: 16,
      outline: "none",
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-cta",
    onClick: download
  }, "Schild herunterladen ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow",
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: share
  }, "Teilen")), shareMsg && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontFamily: "Poppins",
      fontSize: 13,
      color: "var(--accent)"
    }
  }, shareMsg), !intro && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      paddingTop: 22,
      borderTop: "1px solid var(--line)"
    }
  }, !sent ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "email",
    "aria-label": "E-Mail (optional)",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "E-Mail (optional)",
    style: {
      flex: "1 1 220px",
      background: "rgba(140,190,230,.05)",
      border: "1px solid var(--line-strong)",
      borderRadius: 2,
      padding: "12px 14px",
      color: "var(--ink)",
      fontFamily: "Poppins, sans-serif",
      fontSize: 14,
      outline: "none"
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    style: {
      opacity: consent && email ? 1 : .45,
      pointerEvents: consent && email ? "auto" : "none"
    },
    onClick: sendMail
  }, "Schild + Slot zuschicken")), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      gap: 9,
      alignItems: "flex-start",
      color: "var(--muted)",
      fontSize: 12.5,
      cursor: "pointer",
      maxWidth: 460
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: consent,
    onChange: e => setConsent(e.target.checked),
    style: {
      marginTop: 2,
      accentColor: "var(--accent)"
    }
  }), /*#__PURE__*/React.createElement("span", null, "Freiwillig: Ja, schickt mir mein Schild und Infos zum Werkstatt-Slot. Jederzeit widerrufbar \u2014 keine Weitergabe an Dritte."))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "var(--accent)",
      fontFamily: "Poppins",
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 18,
    stroke: 2.4
  }), " Notiert \u2014 wir melden uns. (Demo: es werden keine Daten gesendet.)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(SchildPreview, {
    firma: firma,
    generating: generating && !reduce
  })))));
}
Object.assign(window, {
  BaustellenschildGenerator
});
})();
