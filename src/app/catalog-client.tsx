"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { WhatsAppFAB } from "@/components/whatsapp-fab";
import { ProductCard } from "@/components/product-card";
import { CategoryChips } from "@/components/category-chips";
import { STORE } from "@/lib/config";
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

      {/* Hero */}
      <section
        className="border-b"
        style={{
          borderColor: "var(--color-line)",
          background: "linear-gradient(0deg, var(--color-bg), var(--color-bg)), repeating-linear-gradient(135deg, transparent 0 22px, rgba(232,147,12,.05) 22px 24px)",
        }}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-6 px-4 py-8 flex-wrap">
          <div>
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full"
              style={{ background: "var(--color-amber-soft)", color: "var(--color-amber)" }}
            >
              ● Tomamos pedidos por WhatsApp
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-[44px] leading-none uppercase mt-3">
              Todo para tu obra,
              <br />
              en un solo lugar
            </h1>
            <p className="mt-3 max-w-lg text-base" style={{ color: "var(--color-ink-soft)" }}>
              Mirá el catálogo con precios de referencia, armá tu pedido y enviánoslo por WhatsApp. Te confirmamos stock, precio final y envío al toque.
            </p>
          </div>

          <div
            className="rounded-[14px] p-5 min-w-[230px] border"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-line)",
              boxShadow: "0 1px 2px rgba(30,25,18,.06),0 8px 24px rgba(30,25,18,.07)",
            }}
          >
            <h3 className="font-display font-bold text-base uppercase tracking-wide">¿Cómo comprar?</h3>
            <ul className="mt-3 space-y-2.5 text-sm" style={{ color: "var(--color-ink-soft)" }}>
              {["Elegí productos y tocá \"Agregar\"", "Revisá tu pedido en el carrito", "Enviá por WhatsApp y coordinamos"].map((step) => (
                <li key={step} className="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0" style={{ color: "var(--color-wsp)" }}>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Category chips */}
      <CategoryChips categories={categories} active={activeCat} onSelect={setActiveCat} />

      {/* Product grid */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-7">
          <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
            <h2 className="font-display font-bold text-xl uppercase">{activeCatName}</h2>
            <span className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 rounded-[14px] border-2 border-dashed"
              style={{ borderColor: "var(--color-line-strong)", color: "var(--color-ink-soft)" }}
            >
              No encontramos productos.
              <br />
              Probá con otra palabra o categoría.
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Floating & drawers */}
      <WhatsAppFAB onOpenCart={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
