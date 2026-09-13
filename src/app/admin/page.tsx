"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon, Search } from "lucide-react";
import NextImage from "next/image";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/config";
import type { Category, Product } from "@/lib/types";

export default function AdminProducts() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "unidad",
    category_id: "",
    in_stock: true,
    featured: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*, categories(*)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setProducts((prods as Product[]) || []);
    setCategories((cats as Category[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function openNew() {
    setEditing(null);
    setForm({ name: "", price: "", unit: "unidad", category_id: categories[0]?.id || "", in_stock: true, featured: false });
    setFile(null);
    setPreview(null);
    setModal(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      price: String(p.price),
      unit: p.unit,
      category_id: p.category_id || "",
      in_stock: p.in_stock,
      featured: p.featured,
    });
    setFile(null);
    setPreview(p.image_url);
    setModal(true);
  }

  async function handleSave() {
    if (!form.name || !form.price) return alert("Completá nombre y precio.");
    setSaving(true);

    let image_url = editing?.image_url || null;

    // Subir foto si hay una nueva
    if (file) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("products").upload(path, file, { upsert: true });
      if (upErr) {
        alert("Error subiendo la foto: " + upErr.message);
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("products").getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      unit: form.unit || "unidad",
      category_id: form.category_id || null,
      in_stock: form.in_stock,
      featured: form.featured,
      image_url,
    };

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { alert("Error: " + error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { alert("Error: " + error.message); setSaving(false); return; }
    }

    setSaving(false);
    setModal(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchData();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }

  const filtered = search
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <div className="p-4 sm:p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl uppercase tracking-wide">Productos</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-ink-soft)" }}>
            {products.length} producto{products.length !== 1 ? "s" : ""} cargados
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold border-0 text-white"
          style={{ background: "var(--color-wsp)" }}
        >
          <Plus className="w-4 h-4" /> Nuevo producto
        </button>
      </div>

      {/* Buscador */}
      <label
        className="flex items-center gap-2 rounded-xl px-3 mb-4 border max-w-md"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}
      >
        <Search className="w-4 h-4 shrink-0" style={{ color: "var(--color-ink-soft)" }} />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto…"
          className="bg-transparent border-0 outline-none w-full py-2.5 text-sm"
          style={{ color: "var(--color-ink)" }}
        />
      </label>

      {/* Lista */}
      {loading ? (
        <p style={{ color: "var(--color-ink-soft)" }}>Cargando…</p>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "var(--color-line-strong)", color: "var(--color-ink-soft)" }}
        >
          {products.length === 0
            ? "Todavía no hay productos. Tocá \"Nuevo producto\" para empezar."
            : "No se encontraron resultados."}
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--color-surface)", borderColor: "var(--color-line)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--color-surface-2)" }}>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>Producto</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>Precio</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell" style={{ color: "var(--color-ink-soft)" }}>Categoría</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell" style={{ color: "var(--color-ink-soft)" }}>Stock</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t" style={{ borderColor: "var(--color-line)" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg shrink-0 overflow-hidden grid place-items-center" style={{ background: "var(--color-surface-2)" }}>
                          {p.image_url ? (
                            <NextImage src={p.image_url} alt="" width={40} height={40} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5" style={{ color: "var(--color-ink-soft)" }} />
                          )}
                        </div>
                        <span className="font-medium leading-tight">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums font-semibold whitespace-nowrap">
                      {formatPrice(p.price)}<span className="font-normal text-xs ml-1" style={{ color: "var(--color-ink-soft)" }}>/{p.unit}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell" style={{ color: "var(--color-ink-soft)" }}>
                      {p.categories?.name || "—"}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: p.in_stock ? "var(--color-amber-soft)" : "rgba(220,50,50,.12)",
                          color: p.in_stock ? "var(--color-amber)" : "#dc3232",
                        }}
                      >
                        {p.in_stock ? "En stock" : "Sin stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="w-8 h-8 rounded-lg grid place-items-center border-0"
                          style={{ background: "var(--color-surface-2)", color: "var(--color-ink)" }}
                          title="Editar"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="w-8 h-8 rounded-lg grid place-items-center border-0"
                          style={{ background: "var(--color-surface-2)", color: "#dc3232" }}
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== MODAL ===== */}
      {modal && (
        <>
          <div className="fixed inset-0 z-50" style={{ background: "rgba(15,13,10,.5)" }} onClick={() => setModal(false)} />
          <div
            className="fixed z-[60] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(460px,94vw)] max-h-[90vh] overflow-auto rounded-2xl"
            style={{ background: "var(--color-surface)", boxShadow: "0 20px 60px rgba(0,0,0,.35)" }}
          >
            <header className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--color-line)" }}>
              <h3 className="font-display font-bold text-lg uppercase">
                {editing ? "Editar producto" : "Nuevo producto"}
              </h3>
              <button
                onClick={() => setModal(false)}
                className="w-8 h-8 rounded-lg grid place-items-center text-xl leading-none"
                style={{ background: "var(--color-surface-2)", color: "var(--color-ink)" }}
              >
                ×
              </button>
            </header>

            <div className="p-5 flex flex-col gap-4">
              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: "var(--color-ink-soft)" }}>Nombre del producto</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Cemento Avellaneda x 50kg"
                  className="rounded-xl px-3 py-3 text-sm border outline-none"
                  style={{ background: "var(--color-surface-2)", borderColor: "var(--color-line)", color: "var(--color-ink)" }}
                />
              </div>

              {/* Precio + Unidad */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: "var(--color-ink-soft)" }}>Precio ($)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="6500"
                    className="rounded-xl px-3 py-3 text-sm border outline-none"
                    style={{ background: "var(--color-surface-2)", borderColor: "var(--color-line)", color: "var(--color-ink)" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold" style={{ color: "var(--color-ink-soft)" }}>Unidad</label>
                  <input
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="bolsa / m² / metro"
                    className="rounded-xl px-3 py-3 text-sm border outline-none"
                    style={{ background: "var(--color-surface-2)", borderColor: "var(--color-line)", color: "var(--color-ink)" }}
                  />
                </div>
              </div>

              {/* Categoría */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: "var(--color-ink-soft)" }}>Categoría</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="rounded-xl px-3 py-3 text-sm border outline-none"
                  style={{ background: "var(--color-surface-2)", borderColor: "var(--color-line)", color: "var(--color-ink)" }}
                >
                  <option value="">Sin categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                    className="w-4 h-4"
                  />
                  En stock
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Destacado
                </label>
              </div>

              {/* Foto */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: "var(--color-ink-soft)" }}>Foto del producto</label>
                <label
                  htmlFor="fImg"
                  className="rounded-xl border-2 border-dashed p-4 text-center cursor-pointer text-sm"
                  style={{ borderColor: "var(--color-line-strong)", color: "var(--color-ink-soft)" }}
                >
                  📷 Tocá para elegir una foto
                  <br />
                  <span className="text-xs">(desde el celular, sacás la foto y listo)</span>
                  {preview && (
                    <NextImage src={preview} alt="Preview" width={200} height={200} className="mx-auto mt-3 rounded-lg max-h-32 w-auto" />
                  )}
                </label>
                <input id="fImg" type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>

              {/* Guardar */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-xl py-3 font-bold text-sm uppercase tracking-wide border-0 transition-opacity disabled:opacity-50"
                style={{ background: "var(--color-brand)", color: "var(--color-brand-ink)" }}
              >
                {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
