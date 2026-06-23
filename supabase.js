/* supabase.js — Anbindung der Werkstatt-Buchung an Supabase.
   Liest Zugangsdaten aus window.KIW_SUPABASE (siehe index.html).

   - loadAvailability(date)  -> RPC get_availability  (Body { p_date: "YYYY-MM-DD" })
                                liefert pro Slot { slot_id, label, remaining, is_available }
   - bookSlot(date, slotId, name, email, company, note)
                             -> Edge Function POST /functions/v1/book
                                (Body: date, slot_id, name, email, company, note)
                                status: "booked"        -> "ok"
                                        "already_booked" -> "full"
                                        "full"           -> "full"
                                        "invalid_slot"   -> "invalid"

   Beide Requests senden die Header  apikey  und  Authorization: Bearer <anonKey>.
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

  // -> [{ slot_id, label, remaining, is_available }]  (oder null wenn nicht konfiguriert)
  // date: ISO-Datum (YYYY-MM-DD) des gewünschten Tages
  async function loadAvailability(date) {
    if (!configured()) return null;
    var res = await fetch(base() + "/rest/v1/rpc/get_availability", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ p_date: date || null }),
    });
    var data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    if (!res.ok) {
      var msg = (data && (data.message || data.error || data.hint)) || ("HTTP " + res.status);
      var err = new Error(msg); err.status = res.status; err.data = data;
      throw err;
    }
    if (!Array.isArray(data)) return [];
    // Normalisieren auf { slot_id, label, remaining, is_available }.
    // Die RPC liefert start_time / capacity / booked — daraus werden label & remaining abgeleitet.
    return data.map(function (r) {
      var label = r.label != null ? r.label : (r.start_time != null ? String(r.start_time).slice(0, 5) : "");
      var remaining = r.remaining != null
        ? r.remaining
        : ((r.capacity != null ? r.capacity : 1) - (r.booked != null ? r.booked : 0));
      var isAvail = r.is_available != null ? r.is_available : (remaining > 0);
      return { slot_id: r.slot_id, label: label, remaining: remaining, is_available: isAvail };
    });
  }

  // -> 'ok' | 'full' | 'invalid'
  // date: ISO-Datum (YYYY-MM-DD), slotId: numerische slot_id des gewählten Slots
  async function bookSlot(date, slotId, name, email, company, note) {
    if (!configured()) throw new Error("not-configured");
    var res = await fetch(base() + "/functions/v1/book", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        date: date,
        slot_id: slotId,
        name: name,
        email: email,
        company: company || null,
        note: note || null,
      }),
    });
    var data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    var status = data && (data.status || data.result);
    if (status === "booked") return "ok";
    if (status === "already_booked" || status === "full") return "full";
    if (status === "invalid_slot") return "invalid";
    if (!res.ok) {
      var msg = (data && (data.message || data.error)) || ("HTTP " + res.status);
      var err = new Error(msg); err.status = res.status; err.data = data;
      throw err;
    }
    // Unbekannter Status: defensiv als "invalid" behandeln
    return "invalid";
  }

  window.KIWBooking = { configured: configured, loadAvailability: loadAvailability, bookSlot: bookSlot };
})();
