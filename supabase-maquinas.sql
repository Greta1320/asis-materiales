-- ============================================================
-- Máquinas + Hidrófugos Sika
-- ============================================================
-- Precios en 0: los carga el dueño desde el admin.
-- Seguro de correr más de una vez (NOT EXISTS en todo).
-- ============================================================


-- ── Categoría nueva: Máquinas ──
INSERT INTO public.categories (name, sort_order)
SELECT 'Máquinas', 14
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'Máquinas');


-- ── Máquinas (7) ──
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
SELECT m.nombre, 0, 'unidad',
       (SELECT id FROM public.categories WHERE name = 'Máquinas'),
       m.img, true, false, m.orden
FROM (VALUES
  ('Compresor Facsa 100 Lts Monofásico',      '/products/compresor-facsa-100lts.jpg',     800),
  ('Cortacésped Autopropulsada Belarra 6 HP', '/products/cortacesped-belarra-6hp.jpg',    801),
  ('Cortacésped Shimura 146cc',               '/products/cortacesped-shimura-146cc.jpg',  802),
  ('Generador Belarra 7 HP',                  '/products/generador-belarra-7hp.jpg',      803),
  ('Generador Belarra 7 HP 3,0 kW',           '/products/generador-belarra-7hp-30kw.jpg', 804),
  ('Generador Belarra 15 HP',                 '/products/generador-belarra-15hp.jpg',     805),
  ('Motobomba Shimura SH-GWP50 2" 7 HP',      '/products/motobomba-shimura-7hp.jpg',      806)
) AS m(nombre, img, orden)
WHERE NOT EXISTS (SELECT 1 FROM public.products x WHERE x.name = m.nombre);


-- ── Hidrófugos Sika (4) → categoría ya existente ──
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
SELECT h.nombre, 0, 'unidad',
       (SELECT id FROM public.categories WHERE name = 'Aditivos e Impermeabilizantes'),
       h.img, true, false, h.orden
FROM (VALUES
  ('Hidrófugo Sika 1 x 1 Lt',   '/products/hidrofugo-sika-1lt.jpg',   407),
  ('Hidrófugo Sika 1 x 5 Lts',  '/products/hidrofugo-sika-5lts.jpg',  408),
  ('Hidrófugo Sika 1 x 10 Lts', '/products/hidrofugo-sika-10lts.jpg', 409),
  ('Hidrófugo Sika 1 x 20 Lts', '/products/hidrofugo-sika-20lts.jpg', 410)
) AS h(nombre, img, orden)
WHERE NOT EXISTS (SELECT 1 FROM public.products x WHERE x.name = h.nombre);


-- ── Verificación ──
SELECT p.name, p.price, c.name AS categoria, p.sort_order
FROM public.products p
LEFT JOIN public.categories c ON c.id = p.category_id
WHERE p.sort_order BETWEEN 800 AND 806 OR p.name LIKE 'Hidrófugo Sika%'
ORDER BY p.sort_order;
