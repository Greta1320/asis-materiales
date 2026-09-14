"use client";

import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/config";
import { buildWhatsAppURL } from "@/lib/whatsapp";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, count, total, inc, dec, remove, clear } = useCart();
  const wspURL = buildWhatsAppURL(items);

  return (
    <>
      {/* Scrim */}
      <div
        className={`fixed inset-0 z-50 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(10,14,24,.55)" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Tu pedido"
        className={`fixed top-0 right-0 h-full z-[60] flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ width: "min(420px, 100%)", background: "var(--color-surface)", boxShadow: "var(--shadow-lg)" }}
      >
        {/* Head */}
        <header className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--color-line)" }}>
          <h3 className="font-display font-bold text-lg uppercase tracking-wide">Tu pedido</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg grid place-items-center transition-colors"
            style={{ background: "var(--color-surface-2)", color: "var(--color-ink)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {items.length === 0 ? (
            <div className="text-center py-16" style={{ color: "var(--color-ink-soft)" }}>
              <p className="text-3xl mb-3">🧱</p>
              <p className="font-medium">Todavía no agregaste productos.</p>
              <p className="text-sm mt-1">Elegí lo que necesitás y armá tu pedido.</p>
            </div>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-3 items-center py-3 border-b" style={{ borderColor: "var(--color-line)" }}>
                <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden grid place-items-center" style={{ background: "var(--color-surface-2)" }}>
                  {product.image_url ? (
                    <Image src={product.image_url} alt="" width={48} height={48} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate">{product.name}</p>
                  <p className="text-xs tabular-nums mt-0.5" style={{ color: "var(--color-ink-soft)" }}>
                    {formatPrice(product.price)} × {product.unit} · <b>{formatPrice(product.price * qty)}</b>
                  </p>
                </div>
                <div className="flex items-center rounded-lg border-2 overflow-hidden shrink-0" style={{ borderColor: "var(--color-line)" }}>
                  <button onClick={() => dec(product.id)} className="w-8 h-8 grid place-items-center border-0" style={{ background: "var(--color-surface-2)", color: "var(--color-ink)" }}>
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-bold tabular-nums">{qty}</span>
                  <button onClick={() => inc(product.id)} className="w-8 h-8 grid place-items-center border-0" style={{ background: "var(--color-surface-2)", color: "var(--color-ink)" }}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button onClick={() => remove(product.id)} className="p-1.5 rounded-lg border-0 bg-transparent" style={{ color: "var(--color-ink-soft)" }} title="Quitar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Foot */}
        <div className="px-5 py-4 border-t" style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm" style={{ color: "var(--color-ink-soft)" }}>Total de referencia</span>
            <span className="font-display font-bold text-2xl tabular-nums">{formatPrice(total)}</span>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--color-ink-soft)" }}>
            El precio final, stock y envío se confirman por WhatsApp.
          </p>
          {items.length > 0 && (
            <div className="flex flex-col gap-2">
              <a
                href={wspURL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl text-white font-bold text-base py-3.5 no-underline transition-all hover:brightness-110"
                style={{ background: "var(--color-wsp)" }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .8-.2 1.4Z" />
                </svg>
                Enviar pedido por WhatsApp
              </a>
              <button onClick={clear} className="text-xs text-center py-1 border-0 bg-transparent" style={{ color: "var(--color-ink-soft)" }}>
                Vaciar pedido
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
