import { CatalogClient } from "./catalog-client";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types";

// Revalidar cada 60 segundos (ISR) para que los cambios del admin se vean rápido
export const revalidate = 60;

export default async function Home() {
  let categories: Category[] = [];
  let products: Product[] = [];

  try {
    const supabase = await createServerSupabase();

    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");

    const { data: prods } = await supabase
      .from("products")
      .select("*, categories(*)")
      .order("featured", { ascending: false })
      .order("sort_order")
      .order("created_at", { ascending: false });

    categories = (cats as Category[]) || [];
    products = (prods as Product[]) || [];
  } catch {
    // Sin Supabase configurado: usar datos demo
    categories = DEMO_CATEGORIES;
    products = DEMO_PRODUCTS;
  }

  // Si no hay datos de Supabase (no configurado todavía), cargar demo
  if (categories.length === 0 && products.length === 0) {
    categories = DEMO_CATEGORIES;
    products = DEMO_PRODUCTS;
  }

  return <CatalogClient categories={categories} products={products} />;
}

// ============ Datos demo — productos reales de Asís Materiales ============
const DEMO_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Cemento y Cal", sort_order: 1 },
  { id: "cat-2", name: "Cerámicos", sort_order: 2 },
  { id: "cat-3", name: "Hierros y Alambres", sort_order: 3 },
  { id: "cat-4", name: "Bloques de Cemento", sort_order: 4 },
  { id: "cat-5", name: "Pegamentos y Revoques", sort_order: 5 },
  { id: "cat-6", name: "Aislantes y Techos", sort_order: 6 },
  { id: "cat-7", name: "Estructuras", sort_order: 7 },
];

const p = (id: string, name: string, price: number, unit: string, catId: string, catName: string, img: string, featured = false, inStock = true): Product => ({
  id, name, price, unit, category_id: catId, image_url: `/products/${img}`, in_stock: inStock, featured, sort_order: 0, created_at: "", updated_at: "",
  categories: { id: catId, name: catName, sort_order: 0 },
});

const DEMO_PRODUCTS: Product[] = [
  // Cemento y Cal
  p("p1", "Cemento Portland CPC40 x 25kg — Avellaneda", 6732, "bolsa", "cat-1", "Cemento y Cal", "cemento-avellaneda-cpc40-25kg.jpg", true),
  p("p2", "Hidralit Cemento de Albañilería x 25kg", 5655, "bolsa", "cat-1", "Cemento y Cal", "hidralit-albanileria-25kg.jpg"),
  p("p3", "Cal Hidrat Extra x 25kg — Avellaneda", 4480, "bolsa", "cat-1", "Cemento y Cal", "cal-hidrat-extra-25kg.jpg"),
  // Cerámicos
  p("p4", "Cerámico Cerramiento 18x18x33", 675, "unidad", "cat-2", "Cerámicos", "ceramico-cerramiento-18x18x33.jpg", true),
  p("p5", "Cerámico Cerramiento 12x18x33", 580, "unidad", "cat-2", "Cerámicos", "ceramico-cerramiento-12x18x33.jpg"),
  p("p6", "Cerámico Cerramiento 8x18x33", 480, "unidad", "cat-2", "Cerámicos", "ceramico-cerramiento-8x18x33.jpg"),
  p("p7", "Cerámico Doble Muro Termoeficiente 18x18x33", 850, "unidad", "cat-2", "Cerámicos", "ceramico-doble-muro-18x18x33.jpg"),
  p("p8", "Cerámico Portante 18x19x33", 920, "unidad", "cat-2", "Cerámicos", "ceramico-portante-18x19x33.jpg"),
  p("p9", "Cerámico Portante 12x19x33", 780, "unidad", "cat-2", "Cerámicos", "ceramico-portante-12x19x33.jpg"),
  p("p10", "Ladrillo Visto", 350, "unidad", "cat-2", "Cerámicos", "ladrillo-visto.jpg"),
  // Hierros y Alambres
  p("p11", "Hierro de Construcción — Barra x 12m", 6003, "barra", "cat-3", "Hierros y Alambres", "hierro-construccion.jpg", true),
  p("p12", "Alambre de Atar y Encofrar", 4200, "kg", "cat-3", "Hierros y Alambres", "alambre-atar-encofrar.jpg"),
  p("p13", "Alambre Galvanizado", 5100, "kg", "cat-3", "Hierros y Alambres", "alambre-galvanizado.jpg"),
  // Bloques de Cemento
  p("p14", "Block P-15", 420, "unidad", "cat-4", "Bloques de Cemento", "block-p15.jpg"),
  p("p15", "Bloque Liso 19x19x39 Tabique", 550, "unidad", "cat-4", "Bloques de Cemento", "bloque-liso-19x19x39.jpg"),
  // Pegamentos y Revoques
  p("p16", "Pegamento Cerámico Mapei Keraflor Plus x 25kg", 12500, "bolsa", "cat-5", "Pegamentos y Revoques", "pegamento-ceramico-mapei-25kg.jpg"),
  p("p17", "Revoque Fino Mapei Planitop x 20kg", 9800, "bolsa", "cat-5", "Pegamentos y Revoques", "revoque-fino-mapei-20kg.jpg"),
  // Aislantes y Techos
  p("p18", "Aislante Espuma Aluminizado 10mm x 20mts", 45900, "rollo", "cat-6", "Aislantes y Techos", "aislante-espuma-aluminizado.jpg"),
  // Estructuras
  p("p19", "Vigueta Pretensada (2.00 a 6.00 mts)", 15800, "metro", "cat-7", "Estructuras", "vigueta-pretensada.jpg"),
];
