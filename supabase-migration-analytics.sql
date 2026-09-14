-- ============================================================
-- MIGRACIÓN ANALYTICS — Ejecutar en SQL Editor de Supabase
-- Agrega: page_views
-- ============================================================

create table if not exists public.page_views (
  id uuid default gen_random_uuid() primary key,
  path text not null,
  referrer text,
  device text,
  created_at timestamptz default now()
);

create index if not exists idx_page_views_path on public.page_views(path);
create index if not exists idx_page_views_date on public.page_views(created_at);

alter table public.page_views enable row level security;

create policy "Público puede registrar visitas"
  on public.page_views for insert with check (true);
create policy "Público puede ver visitas"
  on public.page_views for select using (true);
create policy "Admin puede borrar visitas"
  on public.page_views for delete using (auth.role() = 'authenticated');
