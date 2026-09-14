-- ============================================================
-- ASÍS MATERIALES — Schema para Supabase
-- Ejecutar en SQL Editor de Supabase (supabase.com → tu proyecto → SQL Editor)
-- ============================================================

-- 1. Tabla de categorías
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 2. Tabla de productos
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric(12,2) not null default 0,
  unit text not null default 'unidad',        -- unidad, bolsa, m², metro, kg, etc.
  category_id uuid references public.categories(id) on delete set null,
  image_url text,                               -- URL de Supabase Storage
  in_stock boolean default true,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Índices
create index idx_products_category on public.products(category_id);
create index idx_products_stock on public.products(in_stock);
create index idx_products_featured on public.products(featured);

-- 4. Trigger para updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on public.products
  for each row execute function update_updated_at();

-- 5. Row Level Security
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Todos pueden LEER (catálogo público)
create policy "Público puede ver categorías"
  on public.categories for select using (true);

create policy "Público puede ver productos"
  on public.products for select using (true);

-- Solo usuarios autenticados (admin) pueden modificar
create policy "Admin puede insertar categorías"
  on public.categories for insert with check (auth.role() = 'authenticated');
create policy "Admin puede actualizar categorías"
  on public.categories for update using (auth.role() = 'authenticated');
create policy "Admin puede borrar categorías"
  on public.categories for delete using (auth.role() = 'authenticated');

create policy "Admin puede insertar productos"
  on public.products for insert with check (auth.role() = 'authenticated');
create policy "Admin puede actualizar productos"
  on public.products for update using (auth.role() = 'authenticated');
create policy "Admin puede borrar productos"
  on public.products for delete using (auth.role() = 'authenticated');

-- 6. Storage bucket para fotos de productos
insert into storage.buckets (id, name, public) values ('products', 'products', true);

-- Cualquiera puede VER las fotos (son públicas)
create policy "Público puede ver fotos"
  on storage.objects for select using (bucket_id = 'products');

-- Solo admin puede subir/borrar fotos
create policy "Admin puede subir fotos"
  on storage.objects for insert with check (
    bucket_id = 'products' and auth.role() = 'authenticated'
  );
create policy "Admin puede borrar fotos"
  on storage.objects for delete using (
    bucket_id = 'products' and auth.role() = 'authenticated'
  );

-- 7. Tabla de clientes (CRM por WhatsApp)
create table public.clients (
  id uuid default gen_random_uuid() primary key,
  phone text not null unique,
  name text,
  localidad text,
  created_at timestamptz default now()
);

-- 8. Tabla de pedidos
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) on delete set null,
  items jsonb not null default '[]',
  total numeric(12,2) not null default 0,
  status text not null default 'enviado',
  created_at timestamptz default now()
);

-- 9. Tabla de alertas (stock, promos, precios)
create table public.alerts (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.clients(id) on delete cascade,
  type text not null check (type in ('stock', 'promo', 'price')),
  product_id uuid references public.products(id) on delete cascade,
  message text,
  notified boolean default false,
  created_at timestamptz default now()
);

-- 10. Tabla de promociones
create table public.promos (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  active boolean default true,
  created_at timestamptz default now()
);

-- Índices CRM
create index idx_clients_phone on public.clients(phone);
create index idx_orders_client on public.orders(client_id);
create index idx_alerts_client on public.alerts(client_id);
create index idx_alerts_product on public.alerts(product_id);
create index idx_alerts_pending on public.alerts(notified) where notified = false;

-- RLS para tablas CRM
alter table public.clients enable row level security;
alter table public.orders enable row level security;
alter table public.alerts enable row level security;
alter table public.promos enable row level security;

-- Clientes: público puede registrarse, admin puede ver todo
create policy "Público puede registrar cliente"
  on public.clients for insert with check (true);
create policy "Público puede ver su propio perfil"
  on public.clients for select using (true);
create policy "Admin puede actualizar clientes"
  on public.clients for update using (auth.role() = 'authenticated');
create policy "Admin puede borrar clientes"
  on public.clients for delete using (auth.role() = 'authenticated');

-- Pedidos: público puede crear, admin puede ver/modificar
create policy "Público puede crear pedidos"
  on public.orders for insert with check (true);
create policy "Público puede ver pedidos"
  on public.orders for select using (true);
create policy "Admin puede actualizar pedidos"
  on public.orders for update using (auth.role() = 'authenticated');
create policy "Admin puede borrar pedidos"
  on public.orders for delete using (auth.role() = 'authenticated');

-- Alertas: público puede crear/ver, admin puede modificar
create policy "Público puede crear alertas"
  on public.alerts for insert with check (true);
create policy "Público puede ver alertas"
  on public.alerts for select using (true);
create policy "Admin puede actualizar alertas"
  on public.alerts for update using (auth.role() = 'authenticated');
create policy "Admin puede borrar alertas"
  on public.alerts for delete using (auth.role() = 'authenticated');

-- Promos: público puede ver activas, admin puede todo
create policy "Público puede ver promos"
  on public.promos for select using (true);
create policy "Admin puede insertar promos"
  on public.promos for insert with check (auth.role() = 'authenticated');
create policy "Admin puede actualizar promos"
  on public.promos for update using (auth.role() = 'authenticated');
create policy "Admin puede borrar promos"
  on public.promos for delete using (auth.role() = 'authenticated');

-- 11. Datos iniciales de categorías (las del catálogo actual)
insert into public.categories (name, sort_order) values
  ('Cemento y Cal', 1),
  ('Cerámicos', 2),
  ('Hierros y Alambres', 3),
  ('Bloques de Cemento', 4),
  ('Pegamentos y Revoques', 5),
  ('Aislantes y Techos', 6),
  ('Estructuras', 7);
