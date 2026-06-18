/* supabase.js — Anbindung der Werkstatt-Buchung an Supabase.
   Liest Zugangsdaten aus window.KIW_SUPABASE (siehe index.html) und spricht
   genau zwei Postgres-RPC-Funktionen über die REST-API an:
     - get_availability()  -> [{ slot_id, label, remaining }]
     - book_slot(p_slot_id, p_name, p_email, p_company, p_note)
                            -> 'ok' | 'full' | 'invalid_slot'
   Ohne hinterlegten Zugang bleibt KIWBooking.configured() === false
   und die Buchung läuft im lokalen Demo-Modus. */
(function () {
  function cfg() { return window.KIW_SUPABASE || {}; }
  function base() { return String(cfg().url || "").replace(/\/+$/, ""); }
  function configured() { var c = cfg(); return !!(c.url && c.anonKey); }

  function headers() {
    var c = cfg();
    return {
      "apikey": c.anonKey,
      "Authorization": "Bearer " + c.anonKey,
      "Content-Type": "application/json",
    };
  }

  async function rpc(name, body) {
    var res = await fetch(base() + "/rest/v1/rpc/" + name, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body || {}),
    });
    var data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    if (!res.ok) {
      var msg = (data && (data.message || data.error || data.hint)) || ("HTTP " + res.status);
      var err = new Error(msg); err.status = res.status; err.data = data;
      throw err;
    }
    return data;
  }

  // -> [{ slot_id, label, remaining }]  (oder null wenn nicht konfiguriert)
  async function loadAvailability() {
    if (!configured()) return null;
    var rows = await rpc("get_availability", {});
    return Array.isArray(rows) ? rows : [];
  }

  // -> 'ok' | 'full' | 'invalid_slot'
  async function bookSlot(slotId, name, email, company, note) {
    if (!configured()) throw new Error("not-configured");
    var result = await rpc("book_slot", {
      p_slot_id: slotId,
      p_name: name,
      p_email: email,
      p_company: company || null,
      p_note: note || null,
    });
    // RPC kann den String direkt oder als JSON-String liefern
    if (typeof result === "string") return result;
    if (result && typeof result.book_slot === "string") return result.book_slot;
    return String(result);
  }

  window.KIWBooking = { configured: configured, loadAvailability: loadAvailability, bookSlot: bookSlot };
})();
