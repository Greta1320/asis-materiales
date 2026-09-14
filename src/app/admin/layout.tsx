"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Tag, LogOut, Home } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { STORE } from "@/lib/config";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-bg)" }}>
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 flex flex-col max-md:hidden"
        style={{ background: "var(--color-navy)" }}
      >
        <div className="px-4 py-5 border-b" style={{ borderColor: "rgba(255,255,255,.1)" }}>
          <span className="font-display font-bold text-lg uppercase tracking-wide text-white">
            <span style={{ color: "var(--color-accent)" }}>Asís</span> Materiales
          </span>
          <span
            className="block text-[10px] font-semibold tracking-widest uppercase mt-0.5 px-1.5 py-0.5 rounded w-fit"
            style={{ background: "rgba(245,130,32,.15)", color: "var(--color-accent)" }}
          >
            Admin
          </span>
        </div>

        <nav className="flex-1 p-2 flex flex-col gap-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium no-underline transition-colors hover:bg-white/10"
            style={{ color: "rgba(255,255,255,.85)" }}
          >
            <Package className="w-4.5 h-4.5" /> Productos
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium no-underline transition-colors hover:bg-white/10"
            style={{ color: "rgba(255,255,255,.85)" }}
          >
            <Tag className="w-4.5 h-4.5" /> Categorías
          </Link>
        </nav>

        <div className="p-2 border-t flex flex-col gap-1" style={{ borderColor: "rgba(255,255,255,.1)" }}>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs no-underline hover:bg-white/10"
            style={{ color: "rgba(255,255,255,.5)" }}
          >
            <Home className="w-4 h-4" /> Ver tienda
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs bg-transparent border-0 hover:bg-white/10"
            style={{ color: "rgba(255,255,255,.5)" }}
          >
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Barra mobile */}
      <header
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex justify-around items-center py-2"
        style={{ background: "var(--color-navy)" }}
      >
        <Link href="/admin" className="flex flex-col items-center text-xs gap-1 no-underline" style={{ color: "rgba(255,255,255,.85)" }}>
          <Package className="w-5 h-5" /> Productos
        </Link>
        <Link href="/admin/categories" className="flex flex-col items-center text-xs gap-1 no-underline" style={{ color: "rgba(255,255,255,.85)" }}>
          <Tag className="w-5 h-5" /> Categorías
        </Link>
        <Link href="/" className="flex flex-col items-center text-xs gap-1 no-underline" style={{ color: "rgba(255,255,255,.5)" }}>
          <Home className="w-5 h-5" /> Tienda
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center text-xs gap-1 bg-transparent border-0" style={{ color: "rgba(255,255,255,.5)" }}>
          <LogOut className="w-5 h-5" /> Salir
        </button>
      </header>

      {/* Contenido */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">{children}</main>
    </div>
  );
}
