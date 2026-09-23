import type { MetadataRoute } from "next";
import { createPublicSupabase } from "@/lib/supabase/public";
import { slugify } from "@/lib/slug";
import type { Category, Product } from "@/lib/types";

const baseUrl = "https://www.asismateriales.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
  ];

  try {
    const supabase = createPublicSupabase();
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from("categories").select("name").order("sort_order"),
      supabase.from("products").select("name, updated_at").order("sort_order"),
    ]);

    const categorias: MetadataRoute.Sitemap = ((cats as Category[]) || []).map((c) => ({
      url: `${baseUrl}/categoria/${slugify(c.name)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const productos: MetadataRoute.Sitemap = ((prods as Product[]) || []).map((p) => ({
      url: `${baseUrl}/producto/${slugify(p.name)}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...home, ...categorias, ...productos];
  } catch {
    return home;
  }
}
