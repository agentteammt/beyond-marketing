/* React-Hooks als globale Bezeichner verfügbar machen.
   Reproduziert das Verhalten der früheren <script type="text/babel">-Dateien,
   in denen Hooks wie useState/useRef global sichtbar waren. Manche
   vorkompilierten Module (z. B. baustellenschild.js) nutzen Hooks ohne lokale
   Destrukturierung und erwarten sie daher global.
   Läuft per `defer` NACH react-dom und VOR den Komponenten-Skripten. */
(function () {
  var R = window.React;
  if (!R) { console.error("[hooks-global] React ist nicht geladen"); return; }
  var keys = ["useState", "useEffect", "useRef", "useCallback", "useMemo",
    "useLayoutEffect", "useContext", "useReducer", "useImperativeHandle",
    "useId", "useTransition", "useDeferredValue", "useSyncExternalStore",
    "forwardRef", "memo", "createContext", "Fragment"];
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (R[k] !== undefined && typeof window[k] === "undefined") window[k] = R[k];
  }
})();
