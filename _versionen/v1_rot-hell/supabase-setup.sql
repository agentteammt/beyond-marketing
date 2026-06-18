-- ============================================================================
-- KI-Werkstatt — Supabase-Setup für die Werkstatt-Buchung
-- ============================================================================
-- Dieses Skript im Supabase-Dashboard unter  SQL Editor  → "New query"
-- einfügen und ausführen. Es legt an:
--   • Tabelle  slots      (buchbare Termine + Kapazität)
--   • Tabelle  bookings   (eingegangene Reservierungen)
--   • Funktion get_availability()  -> [{ slot_id, label, remaining }]
--   • Funktion book_slot(...)      -> 'ok' | 'full' | 'invalid_slot'
--   • Row-Level-Security: direkter Tabellenzugriff gesperrt, der Zugriff
--     läuft ausschließlich über die beiden Funktionen (SECURITY DEFINER).
--
-- Das Frontend (supabase.js) ruft NUR diese zwei Funktionen über die
-- REST-API auf — mit dem öffentlichen anon-Key. Der anon-Key darf öffentlich
-- im Code stehen; der service_role-Key NIEMALS.
--
-- Das Skript ist idempotent: erneutes Ausführen ist gefahrlos. Die Slots
-- werden dabei NICHT überschrieben (siehe ON CONFLICT) — bestehende
-- Buchungen bleiben erhalten.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) Tabellen
-- ---------------------------------------------------------------------------
create table if not exists public.slots (
  slot_id   text primary key,                 -- z. B. '13:15'
  label     text not null,                     -- Anzeige-Label, z. B. '13:15'
  capacity  int  not null default 3,           -- Plätze pro Slot
  sort      int  not null default 0            -- Sortierreihenfolge
);

create table if not exists public.bookings (
  id         uuid primary key default gen_random_uuid(),
  slot_id    text not null references public.slots(slot_id) on delete cascade,
  name       text not null,
  email      text not null,
  company    text,
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists bookings_slot_id_idx on public.bookings(slot_id);

-- ---------------------------------------------------------------------------
-- 2) Row-Level-Security: Tabellen abriegeln
--    (keine Policies = kein direkter Zugriff über die REST-API;
--     der Zugriff erfolgt nur über die SECURITY-DEFINER-Funktionen unten)
-- ---------------------------------------------------------------------------
alter table public.slots    enable row level security;
alter table public.bookings enable row level security;

-- ---------------------------------------------------------------------------
-- 3) Verfügbarkeit lesen  ->  [{ slot_id, label, remaining }]
-- ---------------------------------------------------------------------------
create or replace function public.get_availability()
returns table (slot_id text, label text, remaining int)
language sql
security definer
set search_path = public
as $$
  select s.slot_id,
         s.label,
         greatest(s.capacity - count(b.id), 0)::int as remaining
  from public.slots s
  left join public.bookings b on b.slot_id = s.slot_id
  group by s.slot_id, s.label, s.capacity, s.sort
  order by s.sort, s.slot_id;
$$;

-- ---------------------------------------------------------------------------
-- 4) Slot buchen  ->  'ok' | 'full' | 'invalid_slot'
--    Sperrt die Slot-Zeile (FOR UPDATE), prüft die Kapazität atomar und
--    fügt die Buchung ein. Verhindert Überbuchung bei parallelen Anfragen.
-- ---------------------------------------------------------------------------
create or replace function public.book_slot(
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
  -- Slot existiert? Zeile sperren, damit die Zählung konsistent bleibt.
  select capacity into v_capacity
  from public.slots
  where slot_id = p_slot_id
  for update;

  if not found then
    return 'invalid_slot';
  end if;

  select count(*) into v_taken
  from public.bookings
  where slot_id = p_slot_id;

  if v_taken >= v_capacity then
    return 'full';
  end if;

  insert into public.bookings (slot_id, name, email, company, note)
  values (p_slot_id, p_name, p_email, p_company, p_note);

  return 'ok';
end;
$$;

-- ---------------------------------------------------------------------------
-- 5) Ausführungsrechte für die anonyme Rolle (anon) + eingeloggte (authenticated)
-- ---------------------------------------------------------------------------
grant execute on function public.get_availability()                              to anon, authenticated;
grant execute on function public.book_slot(text, text, text, text, text)         to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 6) Slots befüllen  (Tag der Industriekommunikation — 2 Fenster, 10-Min-Takt)
--    Fenster 1: 13:15 – 14:15   |   Fenster 2: 15:30 – 16:30
--    Kapazität je Slot: 3. Bestehende Slots werden NICHT überschrieben.
--    Zum kompletten Neusetzen vorher:  truncate public.bookings, public.slots;
-- ---------------------------------------------------------------------------
insert into public.slots (slot_id, label, capacity, sort) values
  ('13:15', '13:15', 3, 10),
  ('13:25', '13:25', 3, 20),
  ('13:35', '13:35', 3, 30),
  ('13:45', '13:45', 3, 40),
  ('13:55', '13:55', 3, 50),
  ('14:05', '14:05', 3, 60),
  ('15:30', '15:30', 3, 70),
  ('15:40', '15:40', 3, 80),
  ('15:50', '15:50', 3, 90),
  ('16:00', '16:00', 3, 100),
  ('16:10', '16:10', 3, 110),
  ('16:20', '16:20', 3, 120)
on conflict (slot_id) do nothing;

-- ---------------------------------------------------------------------------
-- 7) Schnelltest (optional)
-- ---------------------------------------------------------------------------
-- select * from public.get_availability();
-- select public.book_slot('13:15', 'Max Mustermann', 'max@example.com', 'ACME', 'Testbuchung');
