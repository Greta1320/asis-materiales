"use client";

import { Plus, Check } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/config";
import { buildInquiryURL } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  const { add, getQty } = useCart();
  const qty = getQty(product.id);
  const categoryName = product.categories?.name || "General";

  return (
    <article
      className="rounded-[14px] overflow-hidden flex flex-col border transition-all hover:-translate-y-0.5"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-line)",
        boxShadow: "0 1px 2px rgba(30,25,18,.06), 0 8px 24px rgba(30,25,18,.07)",
      }}
    >
      {/* Thumbnail */}
      <div className="aspect-square relative grid place-items-center overflow-hidden" style={{ background: "var(--color-surface-2)" }}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <span className="text-5xl opacity-50">📦</span>
        )}
        <span
          className="absolute top-2 left-2 text-[11px] font-semibold tracking-wide uppercase px-2 py-1 rounded-md"
          style={{ background: "rgba(36,40,48,.88)", color: "#fff" }}
        >
          {categoryName}
        </span>
        {!product.in_stock && (
          <span
            className="absolute top-2 right-2 text-[11px] font-bold tracking-wide uppercase px-2 py-1 rounded-md"
            style={{ background: "rgba(220,50,50,.9)", color: "#fff" }}
          >
            Sin stock
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <h3 className="font-semibold text-[14.5px] leading-tight">{product.name}</h3>

        <div className="mt-auto flex items-end justify-between gap-1">
          <div>
            <span className="font-display font-bold text-xl tabular-nums leading-none">
              <span className="text-xs font-semibold" style={{ color: "var(--color-ink-soft)" }}>$</span>
              {Math.round(product.price).toLocaleString("es-AR")}
            </span>
          </div>
          <span className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
            × {product.unit}
          </span>
        </div>

        {product.in_stock ? (
          <button
            onClick={() => add(product)}
            className="w-full flex items-center justify-center gap-2 rounded-xl text-white font-semibold text-sm py-2.5 border-0 transition-colors"
            style={{ background: qty > 0 ? "var(--color-amber)" : "var(--color-wsp)" }}
          >
            {qty > 0 ? (
              <>
                <Check className="w-4 h-4" /> En el pedido ({qty})
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Agregar
              </>
            )}
          </button>
        ) : (
          <a
            href={buildInquiryURL(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold text-sm py-2.5 border no-underline"
            style={{ borderColor: "var(--color-line-strong)", color: "var(--color-ink-soft)" }}
          >
            Consultar disponibilidad
          </a>
        )}
      </div>
    </article>
  );
}
