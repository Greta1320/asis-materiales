"use client";

import { useState, useMemo } from "react";
import { Calculator, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/config";
import type { Product } from "@/lib/types";

interface MaterialReq {
  match: string;
  perUnit: number;
}

const OBRA_TYPES = [
  {
    id: "pared",
    label: "Pared",
    icon: "🧱",
    desc: "Pared de ladrillo cerámico hueco con mortero",
    materials: [
      { match: "Cerámico Cerramiento 18x18x33", perUnit: 16 },
      { match: "Cemento Portland", perUnit: 0.5 },
      { match: "Cal Hidrat", perUnit: 0.3 },
    ] as MaterialReq[],
  },
  {
    id: "contrapiso",
    label: "Contrapiso",
    icon: "🏗️",
    desc: "Contrapiso de hormigón pobre (10 cm espesor)",
    materials: [
      { match: "Cemento Portland", perUnit: 0.8 },
      { match: "Cal Hidrat", perUnit: 0.2 },
    ] as MaterialReq[],
  },
  {
    id: "revoque",
    label: "Revoque",
    icon: "🪣",
    desc: "Revoque grueso + fino sobre pared",
    materials: [
      { match: "Cemento Portland", perUnit: 0.4 },
      { match: "Cal Hidrat", perUnit: 0.3 },
      { match: "Revoque Fino", perUnit: 0.5 },
    ] as MaterialReq[],
  },
  {
    id: "techo",
    label: "Losa",
    icon: "🏠",
    desc: "Losa con viguetas pretensadas",
    materials: [
      { match: "Vigueta", perUnit: 0.33 },
      { match: "Cemento Portland", perUnit: 1.2 },
      { match: "Hierro", perUnit: 0.15 },
    ] as MaterialReq[],
  },
];

export function ObraCalculator({ products }: { products: Product[] }) {
  const { add } = useCart();
  const [typeId, setTypeId] = useState("pared");
  const [area, setArea] = useState("");
  const [added, setAdded] = useState(false);

  const type = OBRA_TYPES.find((t) => t.id === typeId)!;
  const m2 = Math.max(0, parseFloat(area) || 0);

  const results = useMemo(() => {
    if (m2 <= 0) return [];
    return type.materials
      .map((mat) => {
        const product = products.find((p) => p.name.includes(mat.match));
        if (!product) return null;
        return { product, qty: Math.ceil(mat.perUnit * m2) };
      })
      .filter(Boolean) as { product: Product; qty: number }[];
  }, [type, m2, products]);

  const total = results.reduce((s, r) => s + r.product.price * r.qty, 0);

  function addAll() {
    results.forEach((r) => add(r.product, r.qty));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <section className="border-t" style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center gap-2 justify-center mb-1">
          <Calculator className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
          <h2 className="font-display font-bold text-lg uppercase tracking-wide">
            Calculá los materiales para tu obra
          </h2>
        </div>
        <p className="text-center text-sm mb-6" style={{ color: "var(--color-ink-soft)" }}>
          Elegí el tipo de trabajo, ingresá los metros y agregá todo al pedido.
        </p>

        <div className="max-w-xl mx-auto">
          {/* Type tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {OBRA_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTypeId(t.id); setAdded(false); }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold border transition-all duration-150 cursor-pointer"
                style={{
                  background: typeId === t.id ? "var(--color-navy)" : "var(--color-surface)",
                  color: typeId === t.id ? "#fff" : "var(--color-ink)",
                  borderColor: typeId === t.id ? "var(--color-navy)" : "var(--color-line)",
                }}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          <p className="text-center text-xs mb-4" style={{ color: "var(--color-ink-soft)" }}>{type.desc}</p>

          {/* Input */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <label className="text-sm font-medium">Superficie:</label>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              step="1"
              value={area}
              onChange={(e) => { setArea(e.target.value); setAdded(false); }}
              placeholder="0"
              className="w-24 text-center rounded-lg border px-3 py-2 text-lg font-bold tabular-nums"
              style={{ borderColor: "var(--color-line)", background: "var(--color-surface)", color: "var(--color-ink)" }}
              aria-label="Superficie en metros cuadrados"
            />
            <span className="text-sm font-medium" style={{ color: "var(--color-ink-soft)" }}>m²</span>
          </div>

          {/* Results */}
          {m2 > 0 && results.length > 0 && (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}>
              <div className="divide-y" style={{ "--tw-divide-color": "var(--color-line)" } as React.CSSProperties}>
                {results.map((r) => (
                  <div key={r.product.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-bold tabular-nums text-base shrink-0" style={{ color: "var(--color-accent)" }}>
                        {r.qty}×
                      </span>
                      <span className="truncate" style={{ color: "var(--color-ink)" }}>{r.product.name}</span>
                    </div>
                    <span className="font-semibold tabular-nums shrink-0">{formatPrice(r.product.price * r.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}>
                <span className="font-bold text-sm">Total estimado</span>
                <span className="font-display font-bold text-xl tabular-nums">{formatPrice(total)}</span>
              </div>

              <div className="px-4 py-3">
                <button
                  onClick={addAll}
                  disabled={added}
                  className="w-full flex items-center justify-center gap-2 rounded-lg py-3 font-bold text-sm text-white border-0 cursor-pointer transition-all duration-150"
                  style={{ background: added ? "var(--color-accent)" : "var(--color-navy)" }}
                >
                  {added ? <><Check className="w-4 h-4" /> Agregado al pedido</> : <><ShoppingCart className="w-4 h-4" /> Agregar todo al pedido</>}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-[11px] mt-4" style={{ color: "var(--color-ink-soft)" }}>
            Cantidades aproximadas. Confirmamos exactas y precios por WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}
