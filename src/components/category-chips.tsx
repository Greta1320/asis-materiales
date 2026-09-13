"use client";

import type { Category } from "@/lib/types";

interface CategoryChipsProps {
  categories: Category[];
  active: string | null; // null = "Todos"
  onSelect: (id: string | null) => void;
}

export function CategoryChips({ categories, active, onSelect }: CategoryChipsProps) {
  return (
    <nav
      className="sticky z-30 border-b"
      style={{ top: "125px", background: "var(--color-bg)", borderColor: "var(--color-line)" }}
    >
      <div className="mx-auto max-w-7xl flex gap-2 overflow-x-auto px-4 py-3 scrollbar-thin">
        <button
          onClick={() => onSelect(null)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
            active === null ? "text-white" : ""
          }`}
          style={{
            background: active === null ? "var(--color-brand)" : "var(--color-surface)",
            color: active === null ? "var(--color-brand-ink)" : "var(--color-ink)",
            borderColor: active === null ? "var(--color-brand)" : "var(--color-line-strong)",
          }}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
              active === cat.id ? "text-white" : ""
            }`}
            style={{
              background: active === cat.id ? "var(--color-brand)" : "var(--color-surface)",
              color: active === cat.id ? "var(--color-brand-ink)" : "var(--color-ink)",
              borderColor: active === cat.id ? "var(--color-brand)" : "var(--color-line-strong)",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
