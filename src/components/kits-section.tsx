"use client";

import { useState } from "react";
import { Package, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/config";
import type { Product } from "@/lib/types";

interface KitDef {
  id: string;
  name: string;
  icon: string;
  desc: string;
  items: { match: string; qty: number }[];
}

const KITS: KitDef[] = [
  {
    id: "pared-10",
    name: "Kit Pared 10 m²",
    icon: "🧱",
    desc: "Cerramiento de ladrillo cerámico con mortero",
    items: [
      { match: "Cerámico Cerramiento 18x18x33", qty: 160 },
      { match: "Cemento Portland", qty: 5 },
      { match: "Cal Hidrat", qty: 3 },
    ],
  },
  {
    id: "revoque-20",
    name: "Kit Revoque 20 m²",
    icon: "🪣",
    desc: "Revoque grueso y fino para paredes",
    items: [
      { match: "Cemento Portland", qty: 8 },
      { match: "Cal Hidrat", qty: 6 },
      { match: "Revoque Fino", qty: 10 },
    ],
  },
  {
    id: "contrapiso-15",
    name: "Kit Contrapiso 15 m²",
    icon: "🏗️",
    desc: "Contrapiso de hormigón pobre 10 cm",
    items: [
      { match: "Cemento Portland", qty: 12 },
      { match: "Cal Hidrat", qty: 3 },
    ],
  },
];

function resolveKit(kit: KitDef, products: Product[]) {
  const resolved: { product: Product; qty: number }[] = [];
  for (const item of kit.items) {
    const product = products.find((p) => p.name.includes(item.match));
    if (product) resolved.push({ product, qty: item.qty });
  }
  return resolved;
}

export function KitsSection({ products }: { products: Product[] }) {
  return (
    <section className="border-b" style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center gap-2 mb-1">
          <Package className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
          <h2 className="font-display font-bold text-lg uppercase tracking-wide">Kits para tu obra</h2>
        </div>
        <p className="text-sm mb-5" style={{ color: "var(--color-ink-soft)" }}>
          Pedidos frecuentes listos para agregar en un click.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {KITS.map((kit) => (
            <KitCard key={kit.id} kit={kit} products={products} />
          ))}
        </div>
      </div>
    </section>
  );
}

function KitCard({ kit, products }: { kit: KitDef; products: Product[] }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const resolved = resolveKit(kit, products);
  const total = resolved.reduce((s, r) => s + r.product.price * r.qty, 0);

  function handleAdd() {
    resolved.forEach((r) => add(r.product, r.qty));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  if (resolved.length === 0) return null;

  return (
    <div
      className="rounded-xl border p-4 flex flex-col transition-all duration-200 hover:shadow-md"
      style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{kit.icon}</span>
        <h3 className="font-display font-bold text-sm uppercase tracking-wide">{kit.name}</h3>
      </div>
      <p className="text-xs mb-3" style={{ color: "var(--color-ink-soft)" }}>{kit.desc}</p>

      <ul className="space-y-1 mb-3 text-[12px]" style={{ color: "var(--color-ink-soft)" }}>
        {resolved.map((r) => (
          <li key={r.product.id} className="flex justify-between gap-2">
            <span className="truncate">{r.qty}× {r.product.name}</span>
            <span className="shrink-0 tabular-nums">{formatPrice(r.product.price * r.qty)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2 border-t" style={{ borderColor: "var(--color-line)" }}>
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-xs font-medium" style={{ color: "var(--color-ink-soft)" }}>Total estimado</span>
          <span className="font-display font-bold text-lg tabular-nums">{formatPrice(total)}</span>
        </div>
        <button
          onClick={handleAdd}
          disabled={added}
          className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 font-semibold text-sm text-white border-0 cursor-pointer transition-all duration-150"
          style={{ background: added ? "var(--color-accent)" : "var(--color-navy)" }}
        >
          {added ? <><Check className="w-4 h-4" /> Agregado</> : <><ShoppingCart className="w-4 h-4" /> Agregar kit</>}
        </button>
      </div>
    </div>
  );
}
