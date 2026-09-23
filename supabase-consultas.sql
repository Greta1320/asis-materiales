-- ============================================================
-- Consultas del asistente + limpieza de datos de prueba
-- ============================================================
-- Seguro de correr más de una vez.
-- ============================================================


-- ── 1. Tabla de consultas ──
create table if not exists public.consultas (
  id uuid primary key default gen_random_uuid(),
  pregunta text not null,
  nombre text,
  telefono text,
  localidad text,
  estado text not null default 'pendiente',   -- pendiente | respondida
  created_at timestamptz not null default now()
);

alter table public.consultas enable row level security;

-- Cualquiera puede dejar una consulta desde el chat
drop policy if exists "Público puede dejar consulta" on public.consultas;
create policy "Público puede dejar consulta"
  on public.consultas for insert with check (true);

-- Solo el admin las lee y las gestiona
drop policy if exists "Admin ve consultas" on public.consultas;
create policy "Admin ve consultas"
  on public.consultas for select using (auth.role() = 'authenticated');

drop policy if exists "Admin actualiza consultas" on public.consultas;
create policy "Admin actualiza consultas"
  on public.consultas for update using (auth.role() = 'authenticated');

drop policy if exists "Admin borra consultas" on public.consultas;
create policy "Admin borra consultas"
  on public.consultas for delete using (auth.role() = 'authenticated');

create index if not exists consultas_estado_idx on public.consultas (estado, created_at desc);


-- ── 2. Limpieza de datos de prueba ──
-- Los 5 pedidos y los 4 clientes cargados durante el desarrollo aparecen
-- en Analytics como si fueran ventas reales. Esto los borra.
-- OJO: si ya entró algún pedido de verdad, NO corras este bloque.

delete from public.orders;
delete from public.clients where phone like 'web\_%';


-- ── Verificación ──
select
  (select count(*) from public.consultas) as consultas,
  (select count(*) from public.orders)    as pedidos,
  (select count(*) from public.clients)   as clientes;
