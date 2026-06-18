/* hero3d.js — KI-Werkstatt WebGL hero (vanilla three.js, r128)
   Exposes window.KIWHero = { supported(), init(mountEl, cfg) -> api }
   api = { setConfig(cfg), setScroll(progress0to1), destroy() }
   Robust: bails to false from init() if anything throws, so React can fall back. */
(function () {
  "use strict";
  const PRM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function supported() {
    try {
      if (!window.THREE) return false;
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch (e) { return false; }
  }

  function radialSprite(THREE, color, size) {
    const cv = document.createElement("canvas"); cv.width = cv.height = 128;
    const g = cv.getContext("2d");
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, color); grd.addColorStop(0.25, color);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(cv);
    const mat = new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
    const s = new THREE.Sprite(mat); s.scale.set(size, size, 1);
    return s;
  }

  function panelTexture(THREE, accentHex) {
    const cv = document.createElement("canvas"); cv.width = 256; cv.height = 512;
    const g = cv.getContext("2d");
    g.fillStyle = "#0a1322"; g.fillRect(0, 0, 256, 512);
    g.fillStyle = "#0e1c33";
    for (let y = 0; y < 512; y += 64) for (let x = 0; x < 256; x += 64) {
      g.fillRect(x + 4, y + 4, 56, 56);
    }
    g.strokeStyle = accentHex; g.globalAlpha = 0.5; g.lineWidth = 2;
    for (let y = 0; y <= 512; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(256, y); g.stroke(); }
    for (let x = 0; x <= 256; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 512); g.stroke(); }
    g.globalAlpha = 1;
    const t = new THREE.CanvasTexture(cv); t.anisotropy = 4; return t;
  }

  function init(mount, cfg) {
    let THREE;
    try {
      THREE = window.THREE;
      if (!THREE || !supported()) return false;

      const state = {
        accent: cfg.accent || "#1fe6d2",
        accent2: cfg.accent2 || "#46ff9e",
        cta: cfg.cta || "#ff2f86",
        intensity: cfg.intensity == null ? 1 : cfg.intensity,
        mode: cfg.mode || "image",
        intro: cfg.intro || null,
        scroll: 0,
      };

      const W = () => mount.clientWidth || window.innerWidth;
      const H = () => mount.clientHeight || window.innerHeight;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setSize(W(), H());
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab;touch-action:pan-y";
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(46, W() / H(), 0.1, 200);
      camera.position.set(0, 0.6, 13);

      // soft environment so metals catch a cool reflection
      try {
        const eg = document.createElement("canvas"); eg.width = 64; eg.height = 32;
        const ec = eg.getContext("2d");
        const lg = ec.createLinearGradient(0, 0, 0, 32);
        lg.addColorStop(0, "#0b1a2e"); lg.addColorStop(0.5, "#101a2c"); lg.addColorStop(1, "#05060a");
        ec.fillStyle = lg; ec.fillRect(0, 0, 64, 32);
        ec.fillStyle = "rgba(80,200,210,0.5)"; ec.fillRect(40, 2, 16, 6);
        const envTex = new THREE.CanvasTexture(eg); envTex.mapping = THREE.EquirectangularReflectionMapping;
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromEquirectangular(envTex).texture;
        envTex.dispose();
      } catch (e) { /* non-fatal */ }

      // ---- lights ----
      scene.add(new THREE.AmbientLight(0x2a3a55, 0.7));
      const hemi = new THREE.HemisphereLight(0x88c8ff, 0x0a0f1f, 0.5); scene.add(hemi);
      const key = new THREE.DirectionalLight(0xcfe8ff, 1.1); key.position.set(4, 6, 6); scene.add(key);
      const rimA = new THREE.PointLight(new THREE.Color(state.accent), 2.4, 60); rimA.position.set(-7, 2, 4); scene.add(rimA);
      const rimB = new THREE.PointLight(new THREE.Color(state.cta), 2.0, 60); rimB.position.set(7, -3, 2); scene.add(rimB);

      // ---- starfield (two parallax layers) ----
      function makeStars(count, spread, sizeP, colorMix) {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const cA = new THREE.Color(state.accent), cW = new THREE.Color(0xeaf6ff), cM = new THREE.Color(state.cta);
        for (let i = 0; i < count; i++) {
          pos[i * 3] = (Math.random() - 0.5) * spread;
          pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
          pos[i * 3 + 2] = -Math.random() * spread * 0.9 - 4;
          const r = Math.random();
          const c = r > 0.92 ? cM : (r > 0.78 ? cA : cW);
          col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
        const mat = new THREE.PointsMaterial({ size: sizeP, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
        return new THREE.Points(geo, mat);
      }
      const starsFar = makeStars(900, 90, 0.18); scene.add(starsFar);
      const starsNear = makeStars(380, 60, 0.32); scene.add(starsNear);

      // ---- neon data ribbons ----
      const ribbons = new THREE.Group(); scene.add(ribbons);
      function ribbon(color, yoff, phase, amp) {
        const pts = [];
        for (let i = 0; i <= 60; i++) {
          const t = i / 60;
          pts.push(new THREE.Vector3(
            (t - 0.5) * 34,
            yoff + Math.sin(t * Math.PI * 3 + phase) * amp,
            -6 + Math.cos(t * Math.PI * 2 + phase) * 5
          ));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        const geo = new THREE.TubeGeometry(curve, 120, 0.06, 8, false);
        const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
        const m = new THREE.Mesh(geo, mat); m.userData = { phase, amp, yoff }; return m;
      }
      const rb1 = ribbon(state.accent, 1.2, 0, 2.2);
      const rb2 = ribbon(state.cta, -1.4, 1.6, 2.6);
      const rb3 = ribbon(state.accent2, 0.2, 3.0, 1.7);
      ribbons.add(rb1, rb2, rb3);

      // ---- centerpiece: constructed station OR floating photo panel ----
      let station = null, ringInner = null, winGlow = null, win = null, debris = null, imagePlane = null, imageShadow = null;
      const navLights = [];
      const metal = (c, m, r) => new THREE.MeshStandardMaterial({ color: c, metalness: m == null ? 0.75 : m, roughness: r == null ? 0.35 : r });

      if (state.mode === "station") {
      station = new THREE.Group(); scene.add(station);

      // central core
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 4.6, 24, 1), metal(0xb9c6d6, 0.85, 0.3));
      core.rotation.z = Math.PI / 2; station.add(core);
      // core bands
      for (const x of [-1.4, 0, 1.4]) {
        const band = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.18, 24), metal(0x6f7d8c, 0.7, 0.4));
        band.rotation.z = Math.PI / 2; band.position.x = x; station.add(band);
      }
      // habitat torus ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.38, 18, 60), metal(0xc7d2de, 0.8, 0.28));
      station.add(ring);
      ringInner = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.12, 12, 60), new THREE.MeshBasicMaterial({ color: new THREE.Color(state.accent), transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }));
      station.add(ringInner);
      // spokes
      for (let i = 0; i < 4; i++) {
        const sp = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.95, 0.14), metal(0x8390a0, 0.7, 0.4));
        sp.position.set(Math.cos(i * Math.PI / 2) * 1.45, Math.sin(i * Math.PI / 2) * 1.45, 0);
        sp.rotation.z = i * Math.PI / 2; station.add(sp);
      }
      // workshop pod with glowing window (the "Werkstatt")
      const pod = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.2, 1.5), metal(0xaab6c4, 0.7, 0.35));
      pod.position.set(2.6, 0, 0); station.add(pod);
      win = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.62), new THREE.MeshBasicMaterial({ color: new THREE.Color(state.accent), transparent: true, opacity: 0.85 }));
      win.position.set(3.46, 0.05, 0); win.rotation.y = Math.PI / 2; station.add(win);
      winGlow = radialSprite(THREE, state.accent, 2.6); winGlow.position.set(3.7, 0.05, 0); station.add(winGlow);

      // solar arrays
      const panelMat = new THREE.MeshStandardMaterial({ map: panelTexture(THREE, state.accent), metalness: 0.4, roughness: 0.6, emissive: new THREE.Color(state.accent), emissiveIntensity: 0.12 });
      function array(side) {
        const grp = new THREE.Group();
        const arm = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.1), metal(0x6f7d8c, 0.7, 0.4));
        arm.position.x = side * 1.9; grp.add(arm);
        for (const off of [-1.05, 1.05]) {
          const p = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.06, 2.0), panelMat);
          p.position.set(side * 4.2, off * 0, off * 1.15); grp.add(p);
        }
        return grp;
      }
      station.add(array(1), array(-1));

      // dish antenna
      const dish = new THREE.Mesh(new THREE.SphereGeometry(0.7, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2.3), metal(0xdfe7ef, 0.5, 0.5));
      dish.position.set(-0.4, 2.0, 0.4); dish.rotation.x = -0.5; station.add(dish);

      // blinking nav lights
      const navPositions = [[2.7, 0, 0], [-2.7, 0, 0], [0, 2.7, 0], [0, -2.7, 0], [3.46, 0.6, 0.4]];
      navPositions.forEach((p, i) => {
        const col = i % 2 ? state.cta : state.accent2;
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(col) }));
        dot.position.set(p[0], p[1], p[2]);
        const gl = radialSprite(THREE, col, 0.9); dot.add(gl);
        dot.userData = { phase: i * 1.3, glow: gl };
        station.add(dot); navLights.push(dot);
      });

      // floating debris / gears
      debris = new THREE.Group(); scene.add(debris);
      for (let i = 0; i < 10; i++) {
        const isGear = Math.random() > 0.5;
        const m = isGear
          ? new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.12, 8, 12), metal(0x8b97a6, 0.8, 0.4))
          : new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), metal(0x9aa6b5, 0.7, 0.5));
        const a = Math.random() * Math.PI * 2, r = 5 + Math.random() * 5;
        m.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 6, -2 - Math.random() * 6);
        m.userData = { spin: (Math.random() - 0.5) * 0.02, fy: Math.random() * Math.PI * 2 };
        debris.add(m);
      }

      station.rotation.x = -0.18;
      station.rotation.y = -0.5;
      } else {
        // ---- floating photo panel: the uploaded image as an interactive 3D layer ----
        // depth shadow plane: a darkened copy pushed back in z that parallaxes harder
        // than the photo, giving real stereoscopic layer separation on pointer move.
        imageShadow = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1, 1, 1),
          new THREE.MeshBasicMaterial({ color: 0x05080f, transparent: true, opacity: 0.55, depthWrite: false })
        );
        imageShadow.position.z = -2.4;
        scene.add(imageShadow);

        imagePlane = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1, 1, 1),
          new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide })
        );
        scene.add(imagePlane);
        imagePlane.userData.aspect = 1.79;
        new THREE.TextureLoader().load(cfg.imageUrl || "assets/hero-overalls.webp", (tex) => {
          if (THREE.SRGBColorSpace !== undefined) tex.colorSpace = THREE.SRGBColorSpace;
          try { tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); } catch (e) {}
          imagePlane.material.map = tex; imagePlane.material.needsUpdate = true;
          if (tex.image) imagePlane.userData.aspect = tex.image.width / tex.image.height;
          fitImagePlane();
        });
        // thread the live ribbons in front of and behind the photo for real depth
        rb1.position.z = 3.4; rb3.position.z = 2.6; rb2.position.z = -3.2;
      }

      // ---- cinematic entry animation (image hero, first load only) ----
      // Driven from the main loop; timings come from cfg.intro (set in app.jsx).
      let introActive = !!(state.intro && imagePlane);
      let introStart = 0;
      const introCfg = state.intro || {};
      if (introActive) {
        ribbons.children.forEach((rb) => { rb.material.opacity = 0; });
        imagePlane.material.opacity = 0.12;
        if (imageShadow) imageShadow.material.opacity = 0;
      }
      function endHeroIntro() {
        if (!introActive) return;
        introActive = false;
        if (imagePlane) { imagePlane.position.z = 0; imagePlane.material.opacity = 1; fitImagePlane(); }
        if (imageShadow) imageShadow.material.opacity = 0.55;
        renderer.domElement.style.filter = "";
      }

      // fit the photo plane to always cover the viewport (background-size:cover)
      function fitImagePlane() {
        if (!imagePlane) return;
        const dist = 13;
        const vH = 2 * dist * Math.tan((camera.fov * Math.PI / 180) / 2);
        const vW = vH * camera.aspect;
        const a = imagePlane.userData.aspect || 1.79;
        let h = vH * 1.16, w = h * a;
        if (w < vW * 1.16) { w = vW * 1.16; h = w / a; }
        imagePlane.userData.fitW = w; imagePlane.userData.fitH = h;
        if (!introActive) imagePlane.scale.set(w, h, 1);
        if (imageShadow) imageShadow.scale.set(w * 1.05, h * 1.05, 1);
      }
      fitImagePlane();

      // ---- interaction ----
      const baseRotY = state.mode === "station" ? -0.5 : 0;
      const baseRotX = state.mode === "station" ? -0.18 : 0;
      let targetRotY = baseRotY, targetRotX = baseRotX, curRotY = baseRotY, curRotX = baseRotX;
      let dragging = false, lastX = 0, lastY = 0, autoSpin = PRM ? 0 : 0.0016;
      let pointerX = 0, pointerY = 0;

      function onDown(e) {
        dragging = true; renderer.domElement.style.cursor = "grabbing";
        const p = e.touches ? e.touches[0] : e; lastX = p.clientX; lastY = p.clientY;
      }
      function onMove(e) {
        const p = e.touches ? e.touches[0] : e;
        const rect = mount.getBoundingClientRect();
        pointerX = ((p.clientX - rect.left) / rect.width - 0.5) * 2;
        pointerY = ((p.clientY - rect.top) / rect.height - 0.5) * 2;
        if (!dragging) return;
        const dx = p.clientX - lastX, dy = p.clientY - lastY;
        targetRotY += dx * (imagePlane ? 0.004 : 0.006); targetRotX += dy * (imagePlane ? 0.003 : 0.004);
        targetRotX = Math.max(-0.9, Math.min(0.9, targetRotX));
        if (imagePlane) { targetRotY = Math.max(-0.6, Math.min(0.6, targetRotY)); targetRotX = Math.max(-0.4, Math.min(0.4, targetRotX)); }
        lastX = p.clientX; lastY = p.clientY;
        if (e.touches && Math.abs(dx) > Math.abs(dy)) e.preventDefault();
      }
      function onUp() { dragging = false; renderer.domElement.style.cursor = "grab"; }

      renderer.domElement.addEventListener("mousedown", onDown);
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseup", onUp);
      renderer.domElement.addEventListener("touchstart", onDown, { passive: true });
      renderer.domElement.addEventListener("touchmove", onMove, { passive: false });
      renderer.domElement.addEventListener("touchend", onUp);

      // ---- resize ----
      function resize() {
        camera.aspect = W() / H(); camera.updateProjectionMatrix();
        renderer.setSize(W(), H());
        fitImagePlane();
      }
      const ro = new ResizeObserver(resize); ro.observe(mount);
      window.addEventListener("resize", resize);

      // ---- visibility / pause ----
      let visible = true;
      const io = new IntersectionObserver((ents) => { visible = ents[0].isIntersecting; }, { threshold: 0.01 });
      io.observe(mount);

      // ---- loop ----
      const clock = new THREE.Clock();
      let raf = 0, running = true;
      function tick() {
        if (!running) return;
        raf = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();
        if (!visible) return; // skip render off-screen

        const damp = PRM ? 1 : 0.07;
        curRotY += (targetRotY - curRotY) * damp;
        curRotX += (targetRotX - curRotX) * damp;

        if (station) {
          station.rotation.y = curRotY + (PRM ? 0 : t * autoSpin * 8);
          station.rotation.x = curRotX;
        }
        if (imagePlane) {
          // floating photo panel: stronger perspective tilt toward pointer (+ drag), gentle bob
          const ry = (PRM ? 0 : pointerX * 0.24) + curRotY;
          const rx = (PRM ? 0 : -pointerY * 0.18) + curRotX;
          imagePlane.rotation.y += (ry - imagePlane.rotation.y) * 0.07;
          imagePlane.rotation.x += (rx - imagePlane.rotation.x) * 0.07;
          imagePlane.position.x += ((PRM ? 0 : -pointerX * 0.6) - imagePlane.position.x) * 0.06;
          imagePlane.position.y += (((PRM ? 0 : pointerY * 0.42) + (PRM ? 0 : Math.sin(t * 0.5) * 0.14)) - imagePlane.position.y) * 0.06;
          if (imageShadow) {
            // shadow sits behind (z=-2.4) and parallaxes harder → real stereoscopic layer separation
            imageShadow.rotation.y = imagePlane.rotation.y;
            imageShadow.rotation.x = imagePlane.rotation.x;
            imageShadow.position.x += ((PRM ? 0 : -pointerX * 1.25) - imageShadow.position.x) * 0.06;
            imageShadow.position.y += (((PRM ? 0 : pointerY * 0.85) + (PRM ? 0 : Math.sin(t * 0.5 + 0.4) * 0.2)) - imageShadow.position.y) * 0.06;
          }
        }

        // camera parallax + scroll dolly
        if (!PRM) {
          const camPX = imagePlane ? pointerX * 0.6 : pointerX * 0.9;
          const camPY = imagePlane ? -pointerY * 0.4 : 0.6 - pointerY * 0.6;
          camera.position.x += (camPX - camera.position.x) * 0.04;
          camera.position.y += (camPY - camera.position.y) * 0.04;
        }
        const sc = state.scroll;
        camera.position.z = 13 - sc * (imagePlane ? 3.0 : 4.2);
        camera.lookAt(0, -sc * (imagePlane ? 0.5 : 1.2), 0);

        if (ringInner) ringInner.material.opacity = (0.45 + Math.sin(t * 2) * 0.2) * state.intensity;
        if (winGlow) winGlow.material.opacity = (0.7 + Math.sin(t * 1.7) * 0.25) * state.intensity;

        navLights.forEach((d) => {
          const b = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 3 + d.userData.phase));
          d.userData.glow.material.opacity = b * state.intensity;
        });

        // ribbons gentle flow
        ribbons.children.forEach((rb, i) => {
          rb.position.x = Math.sin(t * 0.2 + i) * 0.6;
          rb.material.opacity = (0.55 + 0.25 * Math.sin(t * 1.2 + i)) * Math.min(1.1, state.intensity);
        });

        // debris drift
        if (debris) debris.children.forEach((m) => {
          m.rotation.x += m.userData.spin; m.rotation.y += m.userData.spin * 0.7;
          m.position.y += Math.sin(t * 0.5 + m.userData.fy) * 0.002;
        });

        // starfield slow parallax
        starsFar.rotation.y = t * 0.005 + pointerX * 0.02;
        starsNear.rotation.y = t * 0.01 + pointerX * 0.05;
        starsNear.position.x = -pointerX * 0.6; starsNear.position.y = pointerY * 0.4;

        // ---- cinematic entry animation override ----
        if (introActive && imagePlane) {
          if (!introStart) introStart = performance.now();
          const elapsed = performance.now() - introStart;
          const approachMs = introCfg.approachMs || 1600;
          const igniteMs = introCfg.igniteMs || 760;
          const stagger = introCfg.ribbonStaggerMs || 120;
          const par = introCfg.parallax == null ? 1 : introCfg.parallax;
          const k = 1 - Math.pow(1 - Math.min(1, elapsed / approachMs), 3); // ease-out cubic
          // panel flies in from far + small + blurred + faint → final
          const sk = 0.34 + 0.66 * k;
          if (imagePlane.userData.fitW) imagePlane.scale.set(imagePlane.userData.fitW * sk, imagePlane.userData.fitH * sk, 1);
          imagePlane.position.z = -7 * (1 - k) * par;
          imagePlane.material.opacity = 0.12 + 0.88 * k;
          if (imageShadow) imageShadow.material.opacity = 0.55 * k;
          renderer.domElement.style.filter = "blur(" + (7 * (1 - k)).toFixed(2) + "px)";
          // parallax: stars drift in slightly slower than the panel
          starsNear.position.z = -5 * (1 - k) * par;
          // neon ribbons ignite staggered, with a brief flare peak
          ribbons.children.forEach((rb, i) => {
            const local = (elapsed - (approachMs * 0.5 + i * stagger)) / 300;
            let op = 0;
            if (local > 0) op = local < 0.4 ? (local / 0.4) * 1.3 : Math.max(0.7, 1.3 - ((local - 0.4) / 0.6) * 0.6);
            rb.material.opacity = op;
          });
          if (elapsed >= approachMs + igniteMs + 2 * stagger + 350) endHeroIntro();
        }

        renderer.render(scene, camera);
      }
      tick();

      // ---- api ----
      function setColorEverywhere() {
        rimA.color.set(state.accent); rimB.color.set(state.cta);
        if (ringInner) ringInner.material.color.set(state.accent);
        if (win) win.material.color.set(state.accent);
      }
      return {
        setScroll(p) { state.scroll = Math.max(0, Math.min(1, p)); },
        skipIntro() { endHeroIntro(); },
        setConfig(c) {
          if (c.accent) state.accent = c.accent;
          if (c.accent2) state.accent2 = c.accent2;
          if (c.cta) state.cta = c.cta;
          if (c.intensity != null) state.intensity = c.intensity;
          setColorEverywhere();
        },
        destroy() {
          running = false; cancelAnimationFrame(raf);
          ro.disconnect(); io.disconnect();
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
          window.removeEventListener("resize", resize);
          renderer.dispose();
          if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        },
      };
    } catch (err) {
      console.warn("KIWHero init failed, falling back:", err);
      return false;
    }
  }

  window.KIWHero = { supported, init, prefersReducedMotion: PRM };
})();
