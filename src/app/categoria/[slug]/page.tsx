import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { createPublicSupabase } from "@/lib/supabase/public";
import { STORE, formatPrice } from "@/lib/config";
import { slugify } from "@/lib/slug";
import { SiteChrome } from "@/components/site-chrome";
import type { Category, Product } from "@/lib/types";

export const revalidate = 3600;

const SITE = "https://asismateriales.com";

async function getData() {
  try {
    const supabase = createPublicSupabase();
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("products").select("*, categories(*)").order("sort_order"),
    ]);
    return { categories: (cats as Category[]) || [], products: (prods as Product[]) || [] };
  } catch {
    return { categories: [], products: [] };
  }
}

export async function generateStaticParams() {
  const { categories } = await getData();
  return categories.map((c) => ({ slug: slugify(c.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { categories, products } = await getData();
  const cat = categories.find((c) => slugify(c.name) === slug);
  if (!cat) return { title: "Categoría no encontrada" };

  const count = products.filter((p) => p.category_id === cat.id).length;
  // Layout's title template appends " | Asís Materiales"
  const title = `${cat.name} en ${STORE.city}`;
  const description =
    `${count} producto${count !== 1 ? "s" : ""} de ${cat.name.toLowerCase()} con precio y stock. ` +
    `Corralón y ferretería en ${STORE.city}, ${STORE.province}. Envíos a domicilio y pedidos por WhatsApp.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/categoria/${slug}` },
    openGraph: {
      title: `${cat.name} en ${STORE.city} | ${STORE.name}`,
      description,
      url: `${SITE}/categoria/${slug}`,
      type: "website",
    },
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { categories, products } = await getData();
  const cat = categories.find((c) => slugify(c.name) === slug);
  if (!cat) notFound();

  const items = products.filter((p) => p.category_id === cat.id);
  const otras = categories.filter((c) => c.id !== cat.id);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: cat.name,
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE}/producto/${slugify(p.name)}`,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
      { "@type": "ListItem", position: 2, name: cat.name, item: `${SITE}/categoria/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <SiteChrome categories={categories}>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <nav className="flex items-center gap-1.5 text-sm mb-5" style={{ color: "var(--color-ink-soft)" }}>
          <Link href="/" className="no-underline hover:underline" style={{ color: "inherit" }}>Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span style={{ color: "var(--color-ink)" }}>{cat.name}</span>
        </nav>

        <header className="mb-6">
          <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-wide">
            {cat.name}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink-soft)" }}>
            {items.length} producto{items.length !== 1 ? "s" : ""} · Corralón en {STORE.city}, {STORE.province}
          </p>
        </header>

        {items.length === 0 ? (
          <p className="py-16 text-center rounded-2xl border-2 border-dashed" style={{ borderColor: "var(--color-line-strong)", color: "var(--color-ink-soft)" }}>
            Todavía no hay productos en esta categoría.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <Link
                key={p.id}
                href={`/producto/${slugify(p.name)}`}
                className="rounded-xl border overflow-hidden no-underline transition-shadow hover:shadow-md"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-line)", color: "inherit" }}
              >
                {p.image_url && (
                  <Image src={p.image_url} alt={p.name} width={280} height={200} className="w-full h-40 object-contain" />
                )}
                <div className="p-3">
                  <h2 className="text-sm font-medium leading-snug line-clamp-2">{p.name}</h2>
                  {p.price > 0 ? (
                    <p className="mt-1.5 font-bold tabular-nums" style={{ color: "var(--color-accent)" }}>
                      {formatPrice(p.price)}
                      <span className="text-xs font-normal ml-1" style={{ color: "var(--color-ink-soft)" }}>/{p.unit}</span>
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs" style={{ color: "var(--color-ink-soft)" }}>Consultar precio</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Otras categorías — enlaces internos para Google */}
        {otras.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display font-bold text-lg uppercase tracking-wide mb-4">Otras categorías</h2>
            <div className="flex flex-wrap gap-2">
              {otras.map((c) => (
                <Link
                  key={c.id}
                  href={`/categoria/${slugify(c.name)}`}
                  className="rounded-full px-4 py-2 text-sm font-semibold no-underline border"
                  style={{ background: "var(--color-surface)", borderColor: "var(--color-line)", color: "var(--color-ink)" }}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      </SiteChrome>
    </>
  );
}
