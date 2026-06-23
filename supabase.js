/* supabase.js — Anbindung der Erstgespraech-Buchung an Supabase + Edge Function.
   Liest Zugangsdaten aus window.KIW_SUPABASE (siehe index.html).
   - loadAvailability(date) -> [{ slot_id, label, remaining, is_available }]
     ueber RPC get_availability(p_date). Liefert pro 30-Min-Slot Restkapazitaet.
   - bookSlot(date, slotId, name, email, company, note) -> 'ok' | 'full' | 'invalid_slot'
     ruft die Edge Function "book" auf, die die Buchung schreibt UND
     E-Mails (intern + Kundenbestaetigung mit .ics) ueber Resend verschickt.
   Ohne hinterlegten Zugang bleibt KIWBooking.configured() === false
   und die Buchung laeuft im lokalen Demo-Modus. */
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

  // "09:00:00" / "09:00" -> "09:00"
  function label(t) {
    if (t == null) return "";
    var s = String(t);
    var m = s.match(/^(\d{2}:\d{2})/);
    return m ? m[1] : s;
  }

  // -> [{ slot_id, label, remaining, is_available }] (oder null wenn nicht konfiguriert)
  // p_date: ISO-Datum (YYYY-MM-DD) des gewuenschten Tages
  // get_availability liefert { slot_id, start_time, capacity, booked, is_available }
  async function loadAvailability(date) {
    if (!configured()) return null;
    var rows = await rpc("get_availability", { p_date: date || null });
    if (!Array.isArray(rows)) return [];
    return rows.map(function (r) {
      var cap = r.capacity != null ? Number(r.capacity) : 1;
      var booked = r.booked != null ? Number(r.booked) : 0;
      var rem = r.is_available === false ? 0 : Math.max(0, cap - booked);
      return {
        slot_id: r.slot_id,
        label: label(r.start_time),
        remaining: rem,
        is_available: r.is_available !== false && rem > 0,
      };
    });
  }

  // -> 'ok' | 'full' | 'invalid_slot'
  // date: ISO-Datum (YYYY-MM-DD), slotId: numerische Slot-ID (bigint) aus loadAvailability
  // Buchung laeuft ueber die Edge Function "book" (schreibt Buchung + sendet E-Mails).
  async function bookSlot(date, slotId, name, email, company, note) {
    if (!configured()) throw new Error("not-configured");
    var c = cfg();
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
    var status = data && data.status;
    if (status === "booked") return "ok";
    if (status === "already_booked" || status === "full") return "full";
    if (status === "invalid_slot" || status === "not_found") return "invalid_slot";
    if (!res.ok) {
      var msg = (data && (data.error || data.message)) || ("HTTP " + res.status);
      var err = new Error(msg); err.status = res.status; err.data = data;
      throw err;
    }
    // Fallback: unbekannte, aber erfolgreiche Antwort als ok werten
    return "ok";
  }

  window.KIWBooking = { configured: configured, loadAvailability: loadAvailability, bookSlot: bookSlot };
})();
