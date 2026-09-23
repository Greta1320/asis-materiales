"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";
import { WhatsAppFAB } from "./whatsapp-fab";
import { LogoIcon } from "./logo";
import type { Category } from "@/lib/types";

/** Header + footer for the standalone SEO pages (producto / categoria). */
export function SiteChrome({
  categories,
  children,
}: {
  categories: Category[];
  children: React.ReactNode;
}) {
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40" style={{ background: "var(--color-surface)" }}>
        <div style={{ background: "var(--color-navy)", color: "#fff" }} className="text-xs">
          <div className="mx-auto max-w-7xl px-4 py-2">
            <span className="tracking-wide">
              🚚 Envíos a domicilio · 🕗 Lun a Vie 8–13 / 15–19 · Sáb 9–13 ·{" "}
              <b style={{ color: "var(--color-accent)" }}>Confirmá stock por WhatsApp</b>
            </span>
          </div>
        </div>

        <div className="border-b" style={{ borderColor: "var(--color-line)" }}>
          <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
            <Link href="/" className="flex items-center no-underline shrink-0">
              <LogoIcon size={42} />
            </Link>

            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-semibold no-underline"
              style={{ color: "var(--color-ink-soft)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Ver todo el catálogo
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative w-12 h-12 grid place-items-center rounded-xl border-2 ml-auto shrink-0"
              style={{ borderColor: "var(--color-line)", background: "var(--color-surface)", color: "var(--color-ink)" }}
              title="Ver pedido"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span
                  className="absolute -top-2 -right-2 min-w-[22px] h-[22px] rounded-full grid place-items-center text-xs font-bold px-1 text-white"
                  style={{ background: "var(--color-accent)" }}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {children}

      <Footer categories={categories} />

      <WhatsAppFAB onOpenCart={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
