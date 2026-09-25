-- ============================================================
-- Herramientas eléctricas (+4)
-- ============================================================
-- Precios en 0: los carga Franco desde el admin.
-- Seguro de correr más de una vez (NOT EXISTS en todo).
-- ============================================================


-- ── Categoría nueva: Herramientas ──
INSERT INTO public.categories (name, sort_order)
SELECT 'Herramientas', 15
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Herramientas');


-- ── Productos (4) ──
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
SELECT h.nombre, 0, 'unidad',
       (SELECT id FROM public.categories WHERE name = 'Herramientas'),
       h.img, true, false, h.orden
FROM (VALUES
  ('Amoladora Black+Decker G720',        '/products/amoladora-black-decker-g720.jpg', 900),
  ('Amoladora Dogo 900W',                '/products/amoladora-dogo-900w.jpg',         901),
  ('Taladro Dogo 700W',                  '/products/taladro-dogo-700w.jpg',           902),
  ('Soldadora Inverter Dogo 200A',       '/products/soldadora-dogo-200a.jpg',         903)
) AS h(nombre, img, orden)
WHERE NOT EXISTS (SELECT 1 FROM public.products x WHERE x.name = h.nombre);


-- ── Verificación: tiene que dar 99 ──
SELECT COUNT(*) AS total_productos FROM public.products;
