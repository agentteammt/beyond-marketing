/* glassring.js — KI-Werkstatt 360° glass torus (vanilla three.js r128)
   Exposes window.KIWGlassRing = { supported(), init(mountEl, cfg) -> api }

   A premium, irregular glass torus, face-on, that spins continuously about its
   own axis (scroll-driven + gentle idle). The reveal of the 6 channel callouts is
   NOT driven by 3D geometry (that caused uneven/duplicated reveals) — the module
   only renders the glass and, each frame, reports the ring's on-screen centre +
   outer radius so the React layer can place callouts at fixed points around the
   rim and reveal them evenly, one at a time, straight from the scroll progress.

   api = { setProgress(p0to1), setAccent(hex), destroy() }
   cfg = { accent, onMetrics({cx, cy, r}) }   // cx,cy,r in CSS px relative to mount
*/
(function () {
  "use strict";
  const PRM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function supported() {
    try {
      if (!window.THREE || !THREE.MeshPhysicalMaterial) return false;
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch (e) { return false; }
  }

  function studioEnv(THREE, renderer, accent) {
    const cv = document.createElement("canvas"); cv.width = 512; cv.height = 256;
    const g = cv.getContext("2d");
    // high-contrast studio: dark surround + bright sky so glass shows crisp speculars
    const lg = g.createLinearGradient(0, 0, 0, 256);
    lg.addColorStop(0, "#ffffff"); lg.addColorStop(0.4, "#cfe0f2"); lg.addColorStop(0.52, "#23314a");
    lg.addColorStop(0.53, "#16202f"); lg.addColorStop(1, "#05080e");
    g.fillStyle = lg; g.fillRect(0, 0, 512, 256);
    // crisp window / softbox reflections (the glints that read as 'glass')
    g.fillStyle = "#ffffff";
    g.fillRect(70, 26, 54, 120); g.fillRect(150, 30, 18, 110);
    g.fillRect(300, 18, 120, 26); g.fillRect(360, 60, 70, 90);
    g.fillStyle = "rgba(255,255,255,0.55)"; g.fillRect(200, 40, 10, 84); g.fillRect(250, 50, 26, 60);
    // bright horizon line
    g.fillStyle = "rgba(255,255,255,0.9)"; g.fillRect(0, 128, 512, 2);
    // brand accent kiss
    g.fillStyle = accent; g.globalAlpha = 0.22; g.fillRect(440, 30, 50, 90); g.globalAlpha = 1;
    const tex = new THREE.CanvasTexture(cv); tex.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromEquirectangular(tex).texture;
    tex.dispose(); pmrem.dispose();
    return env;
  }

  function init(mount, cfg) {
    let THREE;
    try {
      THREE = window.THREE;
      if (!THREE || !supported()) return false;
      cfg = cfg || {};
      const onMetrics = typeof cfg.onMetrics === "function" ? cfg.onMetrics : function () {};
      const state = { accent: cfg.accent || "#db0a30", progress: 0, turns: cfg.turns == null ? 1 : cfg.turns };

      const W = () => mount.clientWidth || window.innerWidth;
      const H = () => mount.clientHeight || window.innerHeight;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(W(), H());
      if (THREE.sRGBEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.18;
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, W() / H(), 0.1, 100);
      camera.position.set(0, 0, 11);

      let env = null;
      try { env = studioEnv(THREE, renderer, state.accent); scene.environment = env; } catch (e) {}

      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 4); scene.add(key);
      const fill = new THREE.DirectionalLight(0xdfeaff, 0.7); fill.position.set(-4, -2, 3); scene.add(fill);
      const glint = new THREE.PointLight(0xffffff, 1.6, 40); glint.position.set(2, 3, 5); scene.add(glint);
      const rim = new THREE.PointLight(new THREE.Color(state.accent), 1.6, 40); rim.position.set(-3, 2, 3); scene.add(rim);

      const R = 1.42, tube = 0.46, OUTER = R + tube; // outer radius in world units
      const geo = new THREE.TorusGeometry(R, tube, 72, 360);
      try {
        const pos = geo.attributes.position;
        geo.computeVertexNormals();
        const nrm = geo.attributes.normal;
        const v = new THREE.Vector3(), n = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
          n.set(nrm.getX(i), nrm.getY(i), nrm.getZ(i));
          const a = Math.atan2(v.y, v.x);
          const d = 0.085 * Math.sin(a * 3 + 0.6) + 0.05 * Math.sin(a * 7 + 1.7) + 0.03 * Math.sin(a * 13 + 4.2) + 0.022 * Math.sin(v.z * 9 + a * 2);
          pos.setXYZ(i, v.x + n.x * d, v.y + n.y * d, v.z + n.z * d);
        }
        pos.needsUpdate = true; geo.computeVertexNormals();
      } catch (e) {}

      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0.0, roughness: 0.02, transmission: 1.0,
        ior: 1.52, reflectivity: 1.0, clearcoat: 1.0, clearcoatRoughness: 0.03, envMapIntensity: 2.4, transparent: true,
      });

      const group = new THREE.Group(); scene.add(group);
      const torus = new THREE.Mesh(geo, mat); group.add(torus);
      const coreMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(state.accent), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false });
      const core = new THREE.Mesh(new THREE.TorusGeometry(R, tube * 0.34, 24, 220), coreMat); group.add(core);

      function resize() { camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); }
      const ro = new ResizeObserver(resize); ro.observe(mount);
      window.addEventListener("resize", resize);

      let visible = true;
      const io = new IntersectionObserver((ents) => { visible = ents[0].isIntersecting; }, { threshold: 0.01 });
      io.observe(mount);

      const clock = new THREE.Clock();
      let raf = 0, running = true, curRot = 0;
      const pc = new THREE.Vector3(), pr = new THREE.Vector3();
      const TUMBLE = new THREE.Vector3(0.78, 0.66, 0.05).normalize(); // gekippte Achse: rollt nach unten + dreht um die eigene Achse

      function tick() {
        if (!running) return;
        raf = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();
        // kontinuierliche 3D-Drehung um eine gekippte Achse (face-on ↔ edge-on = echtes Volumen)
        const target = (PRM ? 0 : t * 0.14) + state.progress * state.turns * Math.PI * 2;
        curRot += (target - curRot) * 0.1;
        group.quaternion.setFromAxisAngle(TUMBLE, curRot);
        core.material.opacity = 0.1 + 0.05 * Math.sin(t * 1.4);
        if (visible) {
          const w = W(), h = H();
          // stabiler Label-Radius: fester Weltpunkt (NICHT am taumelnden Objekt) → Labels springen nicht
          pc.set(0, 0, 0).project(camera);
          pr.set(OUTER, 0, 0).project(camera);
          const cx = (pc.x * 0.5 + 0.5) * w, cy = (-pc.y * 0.5 + 0.5) * h;
          const rx = (pr.x * 0.5 + 0.5) * w;
          onMetrics({ cx: cx, cy: cy, r: Math.abs(rx - cx) });
          renderer.render(scene, camera);
        }
      }
      tick();

      return {
        setProgress(p) { state.progress = Math.max(0, Math.min(1, p)); },
        setAccent(hex) { try { state.accent = hex; rim.color.set(hex); core.material.color.set(hex); } catch (e) {} },
        destroy() {
          running = false; cancelAnimationFrame(raf);
          ro.disconnect(); io.disconnect();
          window.removeEventListener("resize", resize);
          try { geo.dispose(); mat.dispose(); core.geometry.dispose(); coreMat.dispose(); if (env) env.dispose(); } catch (e) {}
          renderer.dispose();
          if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
        },
      };
    } catch (err) {
      console.warn("KIWGlassRing init failed, falling back:", err);
      return false;
    }
  }

  window.KIWGlassRing = { supported, init, prefersReducedMotion: PRM };
})();
