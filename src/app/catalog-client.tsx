"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Truck, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { WhatsAppFAB } from "@/components/whatsapp-fab";
import { Chatbot } from "@/components/chatbot";
import { ProductCard } from "@/components/product-card";
import { CategoryChips } from "@/components/category-chips";
import { ObraCalculator } from "@/components/obra-calculator";
import { KitsSection } from "@/components/kits-section";
import { CeramicComparator } from "@/components/ceramic-comparator";
import { GallerySection } from "@/components/gallery-section";
import { buildGeneralURL } from "@/lib/whatsapp";
import type { Category, Product } from "@/lib/types";

interface Props {
  categories: Category[];
  products: Product[];
}

export function CatalogClient({ categories, products }: Props) {
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCat) list = list.filter((p) => p.category_id === activeCat);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.categories?.name || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, activeCat, search]);

  const activeCatName = activeCat
    ? categories.find((c) => c.id === activeCat)?.name || "Productos"
    : "Todos los productos";

  return (
    <>
      <Header onOpenCart={() => setCartOpen(true)} search={search} onSearch={setSearch} />

      {/* ── Hero ── */}
      <section style={{ background: "var(--color-navy)" }}>
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1fr_auto] items-center gap-8 px-4 py-10 sm:py-12">
          <div>
            <div className="mb-6">
              <Image
                src="/logo-full.png"
                alt="Asís Materiales"
                width={480}
                height={160}
                className="w-auto"
                style={{ maxHeight: 140, objectFit: "contain" }}
                priority
              />
            </div>
            <p className="font-display font-extrabold text-[22px] sm:text-[30px] uppercase tracking-widest text-white/90">
              Solución en Construcción
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/55 max-w-lg">
              Consultá materiales, armá tu pedido y coordiná la entrega de manera simple.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="#catalogo"
                className="inline-flex items-center rounded-lg px-5 py-2.5 font-bold text-sm text-white no-underline transition-colors"
                style={{ background: "var(--color-accent)" }}
              >
                Ver materiales
              </a>
              <a
                href={buildGeneralURL()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-bold text-sm text-white/75 no-underline border transition-colors hover:text-white hover:border-white/40"
                style={{ borderColor: "rgba(255,255,255,.18)" }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .8-.2 1.4Z" />
                </svg>
                Hablar con un asesor
              </a>
            </div>
          </div>

          {/* Steps card — desktop */}
          <div
            className="rounded-xl p-5 w-full max-w-[280px] hidden lg:block"
            style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}
          >
            <h3 className="font-display font-bold text-[11px] uppercase tracking-widest text-white/50 mb-4">
              ¿Cómo comprar?
            </h3>
            <ol className="space-y-3">
              {[
                "Elegí los materiales que necesitás",
                "Agregalos al pedido",
                "Enviánoslo por WhatsApp",
                "Confirmamos stock y entrega",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] leading-snug text-white/55">
                  <span
                    className="w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold shrink-0 text-white mt-px"
                    style={{ background: "var(--color-accent)" }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <div className="border-b" style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}>
        <div className="mx-auto max-w-7xl flex flex-wrap justify-center gap-x-8 gap-y-2 px-4 py-3 text-xs font-medium" style={{ color: "var(--color-ink-soft)" }}>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
            Stock confirmado
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
            Atención personalizada
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
            Envíos coordinados
          </span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" style={{ color: "var(--color-wsp)" }}>
              <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .8-.2 1.4Z" />
            </svg>
            Compra simple por WhatsApp
          </span>
        </div>
      </div>

      {/* Category chips */}
      <CategoryChips categories={categories} active={activeCat} onSelect={setActiveCat} />

      {/* ── Product grid ── */}
      <main id="catalogo" className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-baseline justify-between gap-3 mb-5">
            <h2 className="font-display font-bold text-lg uppercase tracking-wide">{activeCatName}</h2>
            <span className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 rounded-xl border-2 border-dashed"
              style={{ borderColor: "var(--color-line-strong)", color: "var(--color-ink-soft)" }}
            >
              No encontramos productos.
              <br />
              Probá con otra palabra o categoría.
            </div>
          )}
        </div>
      </main>

      {/* ── Kits ── */}
      <KitsSection products={products} />

      {/* ── Ceramic Comparator ── */}
      <CeramicComparator />

      {/* ── Calculator ── */}
      <ObraCalculator products={products} />

      {/* ── Gallery ── */}
      <GallerySection />

      <Footer />

      {/* Floating & drawers */}
      <WhatsAppFAB onOpenCart={() => setCartOpen(true)} />
      <Chatbot />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
