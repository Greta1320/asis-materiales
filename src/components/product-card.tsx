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
      className="rounded-xl overflow-hidden flex flex-col border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-line)",
      }}
    >
      {/* Image — normalized container for varied product photos */}
      <div className="aspect-[4/3] relative overflow-hidden" style={{ background: "var(--color-surface-2)" }}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-3"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl opacity-30">📦</span>
          </div>
        )}
        <span
          className="absolute top-2 left-2 z-10 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded"
          style={{ background: "var(--color-navy)", color: "#fff" }}
        >
          {categoryName}
        </span>
        {!product.in_stock && (
          <span
            className="absolute top-2 right-2 z-10 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded"
            style={{ background: "rgba(220,50,50,.9)", color: "#fff" }}
          >
            Sin stock
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col p-4 flex-1">
        <h3
          className="font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5rem]"
          style={{ color: "var(--color-ink)" }}
        >
          {product.name}
        </h3>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline justify-between gap-2">
            <span
              className="font-display font-bold text-xl tabular-nums leading-none"
              style={{ color: "var(--color-ink)" }}
            >
              {formatPrice(product.price)}
            </span>
            <span className="text-[11px]" style={{ color: "var(--color-ink-soft)" }}>
              por {product.unit}
            </span>
          </div>

          {product.in_stock ? (
            <button
              onClick={() => add(product)}
              className="w-full flex items-center justify-center gap-2 rounded-lg text-sm font-semibold py-2.5 mt-3 border-0 cursor-pointer transition-all duration-150"
              style={{
                background: qty > 0 ? "var(--color-accent)" : "var(--color-navy)",
                color: "#fff",
              }}
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
              className="w-full flex items-center justify-center gap-2 rounded-lg text-sm font-semibold py-2.5 mt-3 border no-underline transition-colors"
              style={{ borderColor: "var(--color-line-strong)", color: "var(--color-ink-soft)" }}
            >
              Consultar disponibilidad
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
