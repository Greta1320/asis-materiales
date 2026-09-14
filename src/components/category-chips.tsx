"use client";

import type { Category } from "@/lib/types";

interface CategoryChipsProps {
  categories: Category[];
  active: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryChips({ categories, active, onSelect }: CategoryChipsProps) {
  return (
    <nav
      className="sticky z-30 border-b"
      style={{ top: "105px", background: "var(--color-bg)", borderColor: "var(--color-line)" }}
    >
      <div className="mx-auto max-w-7xl flex gap-2 overflow-x-auto px-4 py-3 scrollbar-thin">
        <ChipButton active={active === null} onClick={() => onSelect(null)}>
          Todos
        </ChipButton>
        {categories.map((cat) => (
          <ChipButton key={cat.id} active={active === cat.id} onClick={() => onSelect(cat.id)}>
            {cat.name}
          </ChipButton>
        ))}
      </div>
    </nav>
  );
}

function ChipButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold border transition-all duration-150 ${
        active ? "" : "hover:bg-[var(--color-surface-2)]"
      }`}
      style={{
        background: active ? "var(--color-navy)" : "var(--color-surface)",
        color: active ? "#fff" : "var(--color-ink)",
        borderColor: active ? "var(--color-navy)" : "var(--color-line)",
      }}
    >
      {children}
    </button>
  );
}
