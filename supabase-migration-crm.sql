-- ============================================================
-- MIGRACIÓN CRM — Ejecutar en SQL Editor de Supabase
-- Agrega: clients, orders, alerts, promos
-- ============================================================

-- Tabla de clientes (CRM por WhatsApp)
create table if not exists public.clients (
  id uuid default gen_random_uuid() primary key,
  phone text not null unique,
  name text,
  localidad text,
  created_at timestamptz default now()
);

-- Tabla de pedidos
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) on delete set null,
  items jsonb not null default '[]',
  total numeric(12,2) not null default 0,
  status text not null default 'enviado',
  created_at timestamptz default now()
);

-- Tabla de alertas (stock, promos, precios)
create table if not exists public.alerts (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) on delete cascade,
  type text not null check (type in ('stock', 'promo', 'price')),
  product_id uuid references public.products(id) on delete cascade,
  message text,
  notified boolean default false,
  created_at timestamptz default now()
);

-- Tabla de promociones
create table if not exists public.promos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  active boolean default true,
  created_at timestamptz default now()
);

-- Índices
create index if not exists idx_clients_phone on public.clients(phone);
create index if not exists idx_orders_client on public.orders(client_id);
create index if not exists idx_alerts_client on public.alerts(client_id);
create index if not exists idx_alerts_product on public.alerts(product_id);
create index if not exists idx_alerts_pending on public.alerts(notified) where notified = false;

-- RLS
alter table public.clients enable row level security;
alter table public.orders enable row level security;
alter table public.alerts enable row level security;
alter table public.promos enable row level security;

-- Clients policies
create policy "Público puede registrar cliente"
  on public.clients for insert with check (true);
create policy "Público puede ver clientes"
  on public.clients for select using (true);
create policy "Admin puede actualizar clientes"
  on public.clients for update using (auth.role() = 'authenticated');
create policy "Admin puede borrar clientes"
  on public.clients for delete using (auth.role() = 'authenticated');

-- Orders policies
create policy "Público puede crear pedidos"
  on public.orders for insert with check (true);
create policy "Público puede ver pedidos"
  on public.orders for select using (true);
create policy "Admin puede actualizar pedidos"
  on public.orders for update using (auth.role() = 'authenticated');
create policy "Admin puede borrar pedidos"
  on public.orders for delete using (auth.role() = 'authenticated');

-- Alerts policies
create policy "Público puede crear alertas"
  on public.alerts for insert with check (true);
create policy "Público puede ver alertas"
  on public.alerts for select using (true);
create policy "Admin puede actualizar alertas"
  on public.alerts for update using (auth.role() = 'authenticated');
create policy "Admin puede borrar alertas"
  on public.alerts for delete using (auth.role() = 'authenticated');

-- Promos policies
create policy "Público puede ver promos"
  on public.promos for select using (true);
create policy "Admin puede insertar promos"
  on public.promos for insert with check (auth.role() = 'authenticated');
create policy "Admin puede actualizar promos"
  on public.promos for update using (auth.role() = 'authenticated');
create policy "Admin puede borrar promos"
  on public.promos for delete using (auth.role() = 'authenticated');
