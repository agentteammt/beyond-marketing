-- ============================================================================
-- team::mt — Supabase-Setup für die Erstgespräch-Buchung (WIEDERKEHRENDE Slots)
-- ============================================================================
-- Dieses Skript im Supabase-Dashboard unter  SQL Editor → "New query"
-- einfügen und ausführen. Es richtet wöchentlich wiederkehrende Termin-Slots
-- ein: die Tabelle `slots` enthält nur die UHRZEITEN (Vorlage), gebucht wird
-- pro DATUM. So gilt z. B. "09:00" an jedem Werktag erneut.
--
--   • Tabelle  slots      (wiederkehrende Uhrzeiten + Kapazität pro Tag)
--   • Tabelle  bookings   (Reservierungen, jetzt MIT booking_date)
--   • Funktion get_availability(p_date date) -> [{ slot_id, label, remaining }]
--   • Funktion book_slot(p_date, p_slot_id, ...) -> 'ok' | 'full' | 'invalid_slot'
--
-- Das Frontend (supabase.js) ruft NUR diese zwei Funktionen über die REST-API
-- mit dem öffentlichen anon-Key auf. Der service_role-Key NIEMALS ins Frontend.
--
-- Idempotent: erneutes Ausführen ist gefahrlos (ON CONFLICT / IF NOT EXISTS).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) Tabellen
-- ---------------------------------------------------------------------------
create table if not exists public.slots (
  slot_id   text primary key,                 -- Uhrzeit-Label, z. B. '09:00'
  label     text not null,                     -- Anzeige-Label, z. B. '09:00'
  capacity  int  not null default 2,           -- Plätze je Slot PRO TAG
  sort      int  not null default 0            -- Sortierreihenfolge
);

create table if not exists public.bookings (
  id           uuid primary key default gen_random_uuid(),
  booking_date date not null,                                       -- NEU: Datum des Termins
  slot_id      text not null references public.slots(slot_id) on delete cascade,
  name         text not null,
  email        text not null,
  company      text,
  note         text,
  created_at   timestamptz not null default now()
);

-- Falls die Tabelle aus einer früheren Version OHNE Datum existiert:
alter table public.bookings add column if not exists booking_date date;
-- Bestehende Zeilen ohne Datum auf heute setzen, dann NOT NULL erzwingen:
update public.bookings set booking_date = current_date where booking_date is null;
alter table public.bookings alter column booking_date set not null;

create index if not exists bookings_date_slot_idx on public.bookings(booking_date, slot_id);

-- ---------------------------------------------------------------------------
-- 2) Row-Level-Security: Tabellen abriegeln (Zugriff nur über die Funktionen)
-- ---------------------------------------------------------------------------
alter table public.slots    enable row level security;
alter table public.bookings enable row level security;

-- ---------------------------------------------------------------------------
-- 3) Verfügbarkeit für EINEN Tag lesen -> [{ slot_id, label, remaining }]
--    p_date = NULL -> heutiges Datum.
-- ---------------------------------------------------------------------------
create or replace function public.get_availability(p_date date default null)
returns table (slot_id text, label text, remaining int)
language sql
security definer
set search_path = public
as $$
  select s.slot_id,
         s.label,
         greatest(s.capacity - count(b.id), 0)::int as remaining
  from public.slots s
  left join public.bookings b
    on b.slot_id = s.slot_id
   and b.booking_date = coalesce(p_date, current_date)
  group by s.slot_id, s.label, s.capacity, s.sort
  order by s.sort, s.slot_id;
$$;

-- ---------------------------------------------------------------------------
-- 4) Slot an einem DATUM buchen -> 'ok' | 'full' | 'invalid_slot'
--    Sperrt die Slot-Zeile (FOR UPDATE) und zählt Buchungen für (Datum, Slot)
--    atomar — verhindert Überbuchung bei parallelen Anfragen.
-- ---------------------------------------------------------------------------
create or replace function public.book_slot(
  p_date    date,
  p_slot_id text,
  p_name    text,
  p_email   text,
  p_company text default null,
  p_note    text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity int;
  v_taken    int;
begin
  if p_date is null then
    return 'invalid_slot';
  end if;

  -- Slot (Uhrzeit-Vorlage) existiert? Zeile sperren für konsistente Zählung.
  select capacity into v_capacity
  from public.slots
  where slot_id = p_slot_id
  for update;

  if not found then
    return 'invalid_slot';
  end if;

  select count(*) into v_taken
  from public.bookings
  where slot_id = p_slot_id
    and booking_date = p_date;

  if v_taken >= v_capacity then
    return 'full';
  end if;

  insert into public.bookings (booking_date, slot_id, name, email, company, note)
  values (p_date, p_slot_id, p_name, p_email, p_company, p_note);

  return 'ok';
end;
$$;

-- ---------------------------------------------------------------------------
-- 5) Ausführungsrechte für anon + authenticated
-- ---------------------------------------------------------------------------
grant execute on function public.get_availability(date)                                to anon, authenticated;
grant execute on function public.book_slot(date, text, text, text, text, text)         to anon, authenticated;

-- Alte Signaturen aus der Event-Version entfernen (falls vorhanden):
drop function if exists public.get_availability();
drop function if exists public.book_slot(text, text, text, text, text);

-- ---------------------------------------------------------------------------
-- 6) Wiederkehrende Uhrzeiten befüllen (Vormittag + Nachmittag, je Tag gültig)
--    Kapazität je Slot/Tag: 2. Bestehende Slots werden NICHT überschrieben.
-- ---------------------------------------------------------------------------
insert into public.slots (slot_id, label, capacity, sort) values
  ('09:00', '09:00', 2, 10),
  ('10:00', '10:00', 2, 20),
  ('11:00', '11:00', 2, 30),
  ('14:00', '14:00', 2, 40),
  ('15:00', '15:00', 2, 50),
  ('16:00', '16:00', 2, 60)
on conflict (slot_id) do nothing;

-- ---------------------------------------------------------------------------
-- 7) Schnelltest (optional)
-- ---------------------------------------------------------------------------
-- select * from public.get_availability(current_date + 1);
-- select public.book_slot(current_date + 1, '09:00', 'Max Mustermann', 'max@example.com', 'ACME', 'Testbuchung');
