"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";

export default function AdminCategories() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCategories((data as Category[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);

    if (editing) {
      await supabase.from("categories").update({ name: name.trim() }).eq("id", editing.id);
    } else {
      const maxSort = categories.reduce((m, c) => Math.max(m, c.sort_order), 0);
      await supabase.from("categories").insert({ name: name.trim(), sort_order: maxSort + 1 });
    }

    setSaving(false);
    setEditing(null);
    setName("");
    fetch();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta categoría? Los productos se quedan sin categoría.")) return;
    await supabase.from("categories").delete().eq("id", id);
    fetch();
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl">
      <h1 className="font-display font-bold text-2xl uppercase tracking-wide mb-6">Categorías</h1>

      {/* Formulario */}
      <div
        className="flex gap-2 mb-6 rounded-xl p-3 border"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={editing ? "Editar nombre…" : "Nueva categoría…"}
          className="flex-1 bg-transparent border-0 outline-none text-sm px-2"
          style={{ color: "var(--color-ink)" }}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold border-0 text-white disabled:opacity-50"
          style={{ background: "var(--color-wsp)" }}
        >
          <Plus className="w-3.5 h-3.5" />
          {editing ? "Guardar" : "Agregar"}
        </button>
        {editing && (
          <button
            onClick={() => { setEditing(null); setName(""); }}
            className="px-3 py-2 text-xs border-0 rounded-lg"
            style={{ background: "var(--color-surface-2)", color: "var(--color-ink-soft)" }}
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Lista */}
      {loading ? (
        <p style={{ color: "var(--color-ink-soft)" }}>Cargando…</p>
      ) : categories.length === 0 ? (
        <p style={{ color: "var(--color-ink-soft)" }}>No hay categorías todavía.</p>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}>
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t" : ""}`}
              style={{ borderColor: "var(--color-line)" }}
            >
              <span className="font-medium text-sm">{cat.name}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => { setEditing(cat); setName(cat.name); }}
                  className="w-8 h-8 rounded-lg grid place-items-center border-0"
                  style={{ background: "var(--color-surface-2)", color: "var(--color-ink)" }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="w-8 h-8 rounded-lg grid place-items-center border-0"
                  style={{ background: "var(--color-surface-2)", color: "#dc3232" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
