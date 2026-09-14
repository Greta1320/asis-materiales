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

-- 7. Datos iniciales de categorías (las del catálogo actual)
insert into public.categories (name, sort_order) values
  ('Cemento y Cal', 1),
  ('Cerámicos', 2),
  ('Hierros y Alambres', 3),
  ('Bloques de Cemento', 4),
  ('Pegamentos y Revoques', 5),
  ('Aislantes y Techos', 6),
  ('Estructuras', 7);
