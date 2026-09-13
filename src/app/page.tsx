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

// ============ Datos demo para desarrollo sin Supabase ============
const DEMO_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Cemento y Cal", sort_order: 1 },
  { id: "cat-2", name: "Hierros y Mallas", sort_order: 2 },
  { id: "cat-3", name: "Ladrillos y Bloques", sort_order: 3 },
  { id: "cat-4", name: "Áridos", sort_order: 4 },
  { id: "cat-5", name: "Maderas", sort_order: 5 },
  { id: "cat-6", name: "Herramientas", sort_order: 6 },
  { id: "cat-7", name: "Pisos y Revestimientos", sort_order: 7 },
  { id: "cat-8", name: "Electricidad", sort_order: 8 },
];

const DEMO_PRODUCTS: Product[] = [
  { id: "p1", name: "Cemento Holcim Fuerte x 25kg (ECOPlanet)", price: 6732, unit: "bolsa", category_id: "cat-1", image_url: null, in_stock: true, featured: true, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-1", name: "Cemento y Cal", sort_order: 1 } },
  { id: "p2", name: "Hercal Holcim Maestro x 25kg", price: 5655, unit: "bolsa", category_id: "cat-1", image_url: null, in_stock: true, featured: false, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-1", name: "Cemento y Cal", sort_order: 1 } },
  { id: "p3", name: "Cal Hidratada x 25kg", price: 4480, unit: "bolsa", category_id: "cat-1", image_url: null, in_stock: true, featured: false, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-1", name: "Cemento y Cal", sort_order: 1 } },
  { id: "p4", name: "Hierro Construcción 6mm — Barra x 12m", price: 6003, unit: "barra", category_id: "cat-2", image_url: null, in_stock: true, featured: true, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-2", name: "Hierros y Mallas", sort_order: 2 } },
  { id: "p5", name: "Malla Sima 15x25 Ø5mm 2,40 x 3,00m", price: 34666, unit: "panel", category_id: "cat-2", image_url: null, in_stock: true, featured: false, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-2", name: "Hierros y Mallas", sort_order: 2 } },
  { id: "p6", name: "Ladrillo Cerámico Hueco 8x18x33", price: 675, unit: "unidad", category_id: "cat-3", image_url: null, in_stock: true, featured: false, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-3", name: "Ladrillos y Bloques", sort_order: 3 } },
  { id: "p7", name: "Ladrillo Cerámico Hueco 12x18x33", price: 820, unit: "unidad", category_id: "cat-3", image_url: null, in_stock: true, featured: false, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-3", name: "Ladrillos y Bloques", sort_order: 3 } },
  { id: "p8", name: "Adoquín Holanda 20x10x6 — x m²", price: 24975, unit: "m²", category_id: "cat-3", image_url: null, in_stock: true, featured: false, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-3", name: "Ladrillos y Bloques", sort_order: 3 } },
  { id: "p9", name: "Arena Gruesa — Bolsón 1m³", price: 37647, unit: "bolsón", category_id: "cat-4", image_url: null, in_stock: true, featured: false, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-4", name: "Áridos", sort_order: 4 } },
  { id: "p10", name: "Arena Fina — Bolsón 1m³", price: 41200, unit: "bolsón", category_id: "cat-4", image_url: null, in_stock: true, featured: false, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-4", name: "Áridos", sort_order: 4 } },
  { id: "p11", name: "Piedra Partida 6-20 — Bolsón 1m³", price: 45900, unit: "bolsón", category_id: "cat-4", image_url: null, in_stock: false, featured: false, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-4", name: "Áridos", sort_order: 4 } },
  { id: "p12", name: "Viga Laminada Eucaliptus 3\" x 8\" — x metro", price: 20107, unit: "metro", category_id: "cat-5", image_url: null, in_stock: true, featured: false, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-5", name: "Maderas", sort_order: 5 } },
  { id: "p13", name: "Hormigonera 130lts Motor 1HP Weg", price: 562817, unit: "unidad", category_id: "cat-6", image_url: null, in_stock: true, featured: true, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-6", name: "Herramientas", sort_order: 6 } },
  { id: "p14", name: "Piso Flotante SPC Click Gris AC4 2,20m² x caja", price: 96575, unit: "caja", category_id: "cat-7", image_url: null, in_stock: true, featured: false, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-7", name: "Pisos y Revestimientos", sort_order: 7 } },
  { id: "p15", name: "Pilar de Luz Monofásico Simple Pesado c/Caja", price: 181895, unit: "unidad", category_id: "cat-8", image_url: null, in_stock: true, featured: false, sort_order: 0, created_at: "", updated_at: "", categories: { id: "cat-8", name: "Electricidad", sort_order: 8 } },
];
