"use client";

import { ShoppingCart, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { STORE } from "@/lib/config";
import { LogoIcon } from "./logo";

interface HeaderProps {
  onOpenCart: () => void;
  search: string;
  onSearch: (v: string) => void;
}

export function Header({ onOpenCart, search, onSearch }: HeaderProps) {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40" style={{ background: "var(--color-surface)" }}>
      {/* Barra superior navy */}
      <div style={{ background: "var(--color-navy)", color: "#fff" }} className="text-xs">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 px-4 py-2 flex-wrap">
          <span className="flex items-center gap-1.5 tracking-wide">
            🚚 Envíos a domicilio · 🕗 Lun a Vie 8–13 / 15–19 · Sáb 9–13 ·{" "}
            <b style={{ color: "var(--color-accent)" }}>Confirmá stock por WhatsApp</b>
          </span>
          <span className="hidden sm:flex gap-4 text-white/75">
            <Link href="#footer" className="hover:text-white transition-colors no-underline" style={{ color: "inherit" }}>Ubicación</Link>
            <Link href="/login" className="hover:text-white transition-colors no-underline" style={{ color: "inherit" }}>Admin</Link>
          </span>
        </div>
      </div>

      {/* Header principal */}
      <div className="border-b" style={{ borderColor: "var(--color-line)" }}>
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3 flex-wrap">
          {/* Logo */}
          <Link href="/" className="flex items-center no-underline shrink-0">
            <LogoIcon size={42} />
          </Link>

          {/* Buscador */}
          <label
            className="flex-1 flex items-center gap-2 rounded-xl px-3 min-w-[140px] border-2 transition-colors focus-within:border-[var(--color-accent)]"
            style={{ background: "var(--color-surface-2)", borderColor: "var(--color-line)" }}
          >
            <Search className="w-5 h-5 shrink-0" style={{ color: "var(--color-ink-soft)" }} />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="¿Qué necesitás para tu obra?"
              className="bg-transparent border-0 outline-none w-full py-3 text-[15px]"
              style={{ color: "var(--color-ink)" }}
              aria-label="Buscar productos"
            />
          </label>

          {/* Acciones */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCart}
              className="relative w-12 h-12 grid place-items-center rounded-xl border-2 transition-all hover:border-[var(--color-accent)] hover:shadow-sm"
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
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden w-12 h-12 grid place-items-center rounded-xl border-2"
              style={{ borderColor: "var(--color-line)", background: "var(--color-surface)", color: "var(--color-ink)" }}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-b px-4 py-3 flex gap-4 text-sm" style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}>
          <Link href="#footer" style={{ color: "var(--color-ink-soft)" }}>Ubicación</Link>
          <Link href="/login" style={{ color: "var(--color-ink-soft)" }}>Admin</Link>
        </div>
      )}
    </header>
  );
}
