import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Check, X, Truck, MessageSquare } from "lucide-react";
import { createPublicSupabase } from "@/lib/supabase/public";
import { STORE, formatPrice } from "@/lib/config";
import { slugify } from "@/lib/slug";
import { SiteChrome } from "@/components/site-chrome";
import type { Category, Product } from "@/lib/types";

export const revalidate = 3600;

const SITE = "https://asismateriales.com";

async function getData(): Promise<{ products: Product[]; categories: Category[] }> {
  try {
    const supabase = createPublicSupabase();
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*, categories(*)").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    return { products: (prods as Product[]) || [], categories: (cats as Category[]) || [] };
  } catch {
    return { products: [], categories: [] };
  }
}

async function findProduct(slug: string) {
  const { products, categories } = await getData();
  const product = products.find((p) => slugify(p.name) === slug) || null;
  return { product, products, categories };
}

export async function generateStaticParams() {
  const { products } = await getData();
  return products.map((p) => ({ slug: slugify(p.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await findProduct(slug);
  if (!product) return { title: "Producto no encontrado" };

  const cat = product.categories?.name || "Materiales";
  const precio = product.price > 0 ? ` — ${formatPrice(product.price)} por ${product.unit}` : "";
  // Layout's title template appends " | Asís Materiales"
  const title = product.name;
  const description =
    `${product.name}${precio}. ${cat} en ${STORE.city}, ${STORE.province}. ` +
    `Consultá stock y coordiná la entrega por WhatsApp con ${STORE.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/producto/${slug}` },
    openGraph: {
      title: `${product.name} | ${STORE.name}`,
      description,
      url: `${SITE}/producto/${slug}`,
      type: "website",
      images: product.image_url ? [{ url: `${SITE}${product.image_url}` }] : undefined,
    },
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product, products, categories } = await findProduct(slug);
  if (!product) notFound();

  const cat = product.categories?.name || null;
  const relacionados = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 8);

  const wspText = encodeURIComponent(
    `Hola! Quería consultar por: ${product.name}${product.price > 0 ? ` (${formatPrice(product.price)} por ${product.unit})` : ""}`
  );
  const wspUrl = `https://wa.me/${STORE.wspNumber}?text=${wspText}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image_url ? `${SITE}${product.image_url}` : undefined,
    description: `${product.name}${cat ? ` — ${cat}` : ""} disponible en ${STORE.name}, ${STORE.city}, ${STORE.province}.`,
    category: cat || undefined,
    brand: { "@type": "Brand", name: STORE.name },
    offers: {
      "@type": "Offer",
      url: `${SITE}/producto/${slug}`,
      priceCurrency: "ARS",
      ...(product.price > 0 ? { price: product.price } : {}),
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: STORE.name },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
      ...(cat
        ? [{ "@type": "ListItem", position: 2, name: cat, item: `${SITE}/categoria/${slugify(cat)}` }]
        : []),
      { "@type": "ListItem", position: cat ? 3 : 2, name: product.name, item: `${SITE}/producto/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <SiteChrome categories={categories}>
      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm mb-6 flex-wrap" style={{ color: "var(--color-ink-soft)" }}>
          <Link href="/" className="no-underline hover:underline" style={{ color: "inherit" }}>Inicio</Link>
          {cat && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/categoria/${slugify(cat)}`} className="no-underline hover:underline" style={{ color: "inherit" }}>
                {cat}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span style={{ color: "var(--color-ink)" }}>{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Foto */}
          <div
            className="rounded-2xl overflow-hidden border grid place-items-center"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}
          >
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
            ) : (
              <div className="py-24 text-sm" style={{ color: "var(--color-ink-soft)" }}>Sin foto</div>
            )}
          </div>

          {/* Info */}
          <div>
            {cat && (
              <Link
                href={`/categoria/${slugify(cat)}`}
                className="inline-block text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full no-underline mb-3"
                style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }}
              >
                {cat}
              </Link>
            )}

            <h1 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-wide leading-tight">
              {product.name}
            </h1>

            {product.price > 0 ? (
              <p className="mt-4 font-display font-bold text-4xl tabular-nums" style={{ color: "var(--color-accent)" }}>
                {formatPrice(product.price)}
                <span className="text-base font-normal ml-2" style={{ color: "var(--color-ink-soft)" }}>
                  por {product.unit}
                </span>
              </p>
            ) : (
              <p className="mt-4 text-lg font-semibold" style={{ color: "var(--color-ink-soft)" }}>
                Consultá el precio por WhatsApp
              </p>
            )}

            <div className="flex items-center gap-2 mt-3 text-sm font-semibold">
              {product.in_stock ? (
                <><Check className="w-4 h-4" style={{ color: "var(--color-accent)" }} /> <span>En stock</span></>
              ) : (
                <><X className="w-4 h-4 text-red-500" /> <span className="text-red-500">Sin stock — consultanos</span></>
              )}
            </div>

            <a
              href={wspUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mt-6 rounded-xl py-3.5 font-bold text-white no-underline"
              style={{ background: "var(--color-wsp, #25d366)" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .8-.2 1.4Z" />
              </svg>
              Consultar por WhatsApp
            </a>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full mt-2 rounded-xl py-3 font-bold text-sm no-underline border-2"
              style={{ borderColor: "var(--color-line-strong)", color: "var(--color-ink)" }}
            >
              Ver todo el catálogo
            </Link>

            <div className="mt-6 pt-5 border-t flex flex-col gap-2.5 text-sm" style={{ borderColor: "var(--color-line)", color: "var(--color-ink-soft)" }}>
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                Envíos a domicilio en {STORE.city} y la zona
              </span>
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                {STORE.hours.weekdays}
              </span>
            </div>
          </div>
        </div>

        {/* Relacionados */}
        {relacionados.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display font-bold text-lg uppercase tracking-wide mb-4">
              Más de {cat}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relacionados.map((r) => (
                <Link
                  key={r.id}
                  href={`/producto/${slugify(r.name)}`}
                  className="rounded-xl border overflow-hidden no-underline transition-shadow hover:shadow-md"
                  style={{ background: "var(--color-surface)", borderColor: "var(--color-line)", color: "inherit" }}
                >
                  {r.image_url && (
                    <Image src={r.image_url} alt={r.name} width={200} height={160} className="w-full h-32 object-contain" />
                  )}
                  <div className="p-3">
                    <p className="text-sm font-medium leading-snug line-clamp-2">{r.name}</p>
                    {r.price > 0 && (
                      <p className="mt-1 font-bold tabular-nums" style={{ color: "var(--color-accent)" }}>
                        {formatPrice(r.price)}
                      </p>
                    )}
                  </div>
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
