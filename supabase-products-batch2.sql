-- ============================================
-- Batch 2: New categories + 25 products
-- ============================================

-- New categories
INSERT INTO public.categories (name, sort_order) VALUES
  ('Áridos y Agregados', 8),
  ('Premoldeados', 9),
  ('Aditivos e Impermeabilizantes', 10),
  ('Instalaciones', 11);

-- Products: Hierros (use same image for all sizes)
-- Category: "Hierros y Alambres"
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
VALUES
  ('Hierro del 4.2 mm x 12 mts', 0, 'barra',
    (SELECT id FROM public.categories WHERE name = 'Hierros y Alambres'),
    '/products/hierro-construccion-varillas.jpg', true, false, 100),
  ('Hierro del 6 mm x 12 mts', 0, 'barra',
    (SELECT id FROM public.categories WHERE name = 'Hierros y Alambres'),
    '/products/hierro-construccion-varillas.jpg', true, false, 101),
  ('Hierro del 8 mm x 12 mts', 0, 'barra',
    (SELECT id FROM public.categories WHERE name = 'Hierros y Alambres'),
    '/products/hierro-construccion-varillas.jpg', true, false, 102),
  ('Hierro del 10 mm x 12 mts', 0, 'barra',
    (SELECT id FROM public.categories WHERE name = 'Hierros y Alambres'),
    '/products/hierro-construccion-varillas.jpg', true, false, 103),
  ('Hierro del 12 mm x 12 mts', 0, 'barra',
    (SELECT id FROM public.categories WHERE name = 'Hierros y Alambres'),
    '/products/hierro-construccion-varillas.jpg', true, false, 104);

-- Products: Alambre Fardo
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
VALUES
  ('Alambre Fardo N17 x kg', 0, 'kg',
    (SELECT id FROM public.categories WHERE name = 'Hierros y Alambres'),
    '/products/alambre-fardo-n17.jpg', true, false, 105);

-- Products: Mallas
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
VALUES
  ('Malla Sima 15x25 4.2mm (2x5 mts)', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Hierros y Alambres'),
    '/products/malla-sima-15x25x42.jpg', true, false, 106),
  ('Malla Sima 15x25 6mm (2.40x6 mts)', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Hierros y Alambres'),
    '/products/malla-sima-15x25x6.jpg', true, false, 107);

-- Products: Áridos
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
VALUES
  ('Arena Ripiosa por m³', 0, 'm³',
    (SELECT id FROM public.categories WHERE name = 'Áridos y Agregados'),
    '/products/arena-ripiosa.jpg', true, false, 200),
  ('Ripio Triturado por m³', 0, 'm³',
    (SELECT id FROM public.categories WHERE name = 'Áridos y Agregados'),
    '/products/ripio-triturado.jpg', true, false, 201),
  ('Arena Gruesa por m³', 0, 'm³',
    (SELECT id FROM public.categories WHERE name = 'Áridos y Agregados'),
    '/products/arena-gruesa-fina.jpg', true, false, 202),
  ('Arena Fina por m³', 0, 'm³',
    (SELECT id FROM public.categories WHERE name = 'Áridos y Agregados'),
    '/products/arena-gruesa-fina.jpg', true, false, 203);

-- Products: Premoldeados
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
VALUES
  ('Pilar Monofásico', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Premoldeados'),
    '/products/pilar-monofasico.jpg', true, false, 300),
  ('Poste Esquinero Olímpico x 3 mts', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Premoldeados'),
    '/products/poste-esquinero-olimpico.jpg', true, false, 301),
  ('Poste Olímpico Intermedio x 3 mts', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Premoldeados'),
    '/products/poste-olimpico-intermedio.jpg', true, false, 302),
  ('Poste Puntal x 2.45 mts', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Premoldeados'),
    '/products/poste-puntal-245.jpg', true, false, 303),
  ('Poste Tensor Olímpico x 3 mts', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Premoldeados'),
    '/products/poste-tensor-olimpico.jpg', true, false, 304);

-- Products: Aditivos e Impermeabilizantes (Weber)
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
VALUES
  ('Ceresita Hidrófugo en Pasta Weber 1 kg', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Aditivos e Impermeabilizantes'),
    '/products/ceresita-hidrofugo-1kg.jpg', true, false, 400),
  ('Ceresita Hidrófugo en Pasta Weber 4 kg', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Aditivos e Impermeabilizantes'),
    '/products/ceresita-hidrofugo-4kg.jpg', true, false, 401),
  ('Ceresita Hidrófugo en Pasta Weber 10 kg', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Aditivos e Impermeabilizantes'),
    '/products/ceresita-hidrofugo-10kg.jpg', true, false, 402),
  ('Ceresita Hidrófugo en Pasta Weber 20 kg', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Aditivos e Impermeabilizantes'),
    '/products/ceresita-hidrofugo-20kg.jpg', true, false, 403),
  ('Tacurú Aditivo Plástico Multiuso Weber 1 kg', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Aditivos e Impermeabilizantes'),
    '/products/tacuru-aditivo-1kg.jpg', true, false, 404),
  ('Tacurú Aditivo Plástico Multiuso Weber 4 kg', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Aditivos e Impermeabilizantes'),
    '/products/tacuru-aditivo-4kg.jpg', true, false, 405),
  ('Tacurú Aditivo Plástico Multiuso Weber 10 kg', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Aditivos e Impermeabilizantes'),
    '/products/tacuru-aditivo-10kg.jpg', true, false, 406);

-- Products: Instalaciones
INSERT INTO public.products (name, price, unit, category_id, image_url, in_stock, featured, sort_order)
VALUES
  ('Gabinete Medidor de Gas', 0, 'unidad',
    (SELECT id FROM public.categories WHERE name = 'Instalaciones'),
    '/products/gabinete-medidor-gas.jpg', true, false, 500);
