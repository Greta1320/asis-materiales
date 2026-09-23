-- ============================================================
-- Duplicados pedidos por el dueño (misma foto, distinto nombre)
-- ============================================================
-- Cada INSERT copia foto, categoría, unidad y flags del producto
-- original. El precio queda en 0 para que lo cargue el dueño desde
-- el admin (una vigueta de 6m no vale lo mismo que una de 2m).
--
-- Es seguro correrlo más de una vez: el NOT EXISTS evita duplicar.
-- ============================================================


-- ── Cámaras Sépticas (faltan 300 y 1000; ya están 500 y 800) ──
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
SELECT 'Cámara Séptica Rotar 300lts', 0, unit, category_id, image_url, in_stock, featured, 605
FROM public.products WHERE name = 'Cámara Séptica Rotar 500lts'
  AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Cámara Séptica Rotar 300lts');

INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
SELECT 'Cámara Séptica Rotar 1000lts', 0, unit, category_id, image_url, in_stock, featured, 606
FROM public.products WHERE name = 'Cámara Séptica Rotar 500lts'
  AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Cámara Séptica Rotar 1000lts');


-- ── Base para Tanque (la existente es la chica) ──
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
SELECT 'Base para Tanque Grande', 0, unit, category_id, image_url, in_stock, featured, 608
FROM public.products WHERE name = 'Base para Tanque 350-600lts'
  AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Base para Tanque Grande');


-- ── Viguetas Pretensadas 2,20 → 6,00 mts (de a 20cm) ──
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
SELECT 'Vigueta Pretensada x ' || m.medida || 'mts', 0, p.unit, p.category_id, p.image_url, p.in_stock, p.featured, m.orden
FROM public.products p
CROSS JOIN (VALUES
  ('2,20', 61), ('2,40', 62), ('2,60', 63), ('2,80', 64), ('3,00', 65),
  ('3,20', 66), ('3,40', 67), ('3,60', 68), ('3,80', 69), ('4,00', 70),
  ('4,20', 71), ('4,40', 72), ('4,60', 73), ('4,80', 74), ('5,00', 75),
  ('5,20', 76), ('5,40', 77), ('5,60', 78), ('5,80', 79), ('6,00', 80)
) AS m(medida, orden)
WHERE p.name = 'Vigueta Pretensada x 2,00mts'
  AND NOT EXISTS (
    SELECT 1 FROM public.products x
    WHERE x.name = 'Vigueta Pretensada x ' || m.medida || 'mts'
  );


-- ── Alambre Galvanizado N14 / N16 / N20 (ya está el N12) ──
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
SELECT 'Alambre Galvanizado N' || g.n, 0, p.unit, p.category_id, p.image_url, p.in_stock, p.featured, g.orden
FROM public.products p
CROSS JOIN (VALUES ('14', 23), ('16', 24), ('20', 25)) AS g(n, orden)
WHERE p.name = 'Alambre Galvanizado N12'
  AND NOT EXISTS (
    SELECT 1 FROM public.products x WHERE x.name = 'Alambre Galvanizado N' || g.n
  );


-- ── Pilares (ya está el Monofásico Subterráneo) ──
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
SELECT t.nombre, 0, p.unit, p.category_id, p.image_url, p.in_stock, p.featured, t.orden
FROM public.products p
CROSS JOIN (VALUES
  ('Pilar Monofásico Aéreo',      301),
  ('Pilar Trifásico Subterraneo', 302),
  ('Pilar Trifásico Aéreo',       303)
) AS t(nombre, orden)
WHERE p.name = 'Pilar Monofásico Subterraneo'
  AND NOT EXISTS (SELECT 1 FROM public.products x WHERE x.name = t.nombre);


-- ============================================================
-- OJO — Alambre de Atar N14: NO lo incluí porque ya existe
-- "Alambre Encofrar N14" ($5.600). Si el dueño confirma que es
-- otro producto distinto, descomentá esto:
-- ============================================================
-- INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
-- SELECT 'Alambre de Atar N14', 0, unit, category_id, image_url, in_stock, featured, 21
-- FROM public.products WHERE name = 'Alambre Fardo N17'
--   AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Alambre de Atar N14');


-- ── Verificación: contar lo que quedó ──
SELECT name, price, sort_order FROM public.products
WHERE name LIKE 'Vigueta%' OR name LIKE 'Alambre Galvanizado%'
   OR name LIKE 'Pilar%' OR name LIKE '%Séptica%' OR name LIKE '%Septica%'
   OR name LIKE 'Base para Tanque%'
ORDER BY sort_order;
