"use client";

import { ShoppingCart, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { STORE } from "@/lib/config";

interface HeaderProps {
  onOpenCart: () => void;
  search: string;
  onSearch: (v: string) => void;
}

export function Header({ onOpenCart, search, onSearch }: HeaderProps) {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b" style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}>
      {/* Barra superior */}
      <div style={{ background: "var(--color-brand)", color: "var(--color-brand-ink)" }} className="text-xs tracking-wide">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 px-4 py-2 flex-wrap">
          <span>
            🚚 Envíos a domicilio · 🕗 Lun a Vie 8–18 · Sáb 8–13 ·{" "}
            <b style={{ color: "var(--color-amber)" }}>Confirmá stock y precio por WhatsApp</b>
          </span>
          <span className="hidden sm:flex gap-3">
            <Link href="#footer" className="hover:underline" style={{ color: "inherit" }}>Ubicación</Link>
            <Link href="/login" className="hover:underline" style={{ color: "inherit" }}>Admin</Link>
          </span>
        </div>
      </div>

      {/* Header principal */}
      <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3 flex-wrap">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline shrink-0">
          <span
            className="w-11 h-11 rounded-xl grid place-items-center"
            style={{ background: "var(--color-amber)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#23211d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M3 21h18" /><path d="M5 21V10l7-5 7 5v11" /><path d="M9 21v-6h6v6" />
            </svg>
          </span>
          <span className="font-display font-extrabold text-xl leading-none uppercase tracking-wide" style={{ color: "var(--color-ink)" }}>
            {STORE.name.split(" ")[0]}
            <br />
            <span className="text-lg font-bold">{STORE.name.split(" ").slice(1).join(" ")}</span>
            <small className="block font-body font-semibold text-[10px] tracking-[.28em] uppercase" style={{ color: "var(--color-ink-soft)" }}>
              {STORE.tagline}
            </small>
          </span>
        </Link>

        {/* Buscador */}
        <label
          className="flex-1 flex items-center gap-2 rounded-xl px-3 min-w-[140px] border transition-colors focus-within:border-[var(--color-line-strong)]"
          style={{ background: "var(--color-surface-2)", borderColor: "var(--color-line)" }}
        >
          <Search className="w-5 h-5 shrink-0" style={{ color: "var(--color-ink-soft)" }} />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar cemento, hierro, ladrillos…"
            className="bg-transparent border-0 outline-none w-full py-3 text-[15px]"
            style={{ color: "var(--color-ink)" }}
          />
        </label>

        {/* Acciones */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCart}
            className="relative w-12 h-12 grid place-items-center rounded-xl border transition-colors hover:border-[var(--color-ink-soft)]"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface)", color: "var(--color-ink)" }}
            title="Ver pedido"
          >
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 rounded-full grid place-items-center text-xs font-bold px-1"
                style={{ background: "var(--color-amber)", color: "#23211d" }}
              >
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden w-12 h-12 grid place-items-center rounded-xl border"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface)", color: "var(--color-ink)" }}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t px-4 py-3 flex gap-4 text-sm" style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}>
          <Link href="#footer" style={{ color: "var(--color-ink-soft)" }}>Ubicación</Link>
          <Link href="/login" style={{ color: "var(--color-ink-soft)" }}>Admin</Link>
        </div>
      )}
    </header>
  );
}
