"use client";

import { useEffect, useState } from "react";
import { Megaphone, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Promo {
  id: string;
  title: string;
  message: string;
  active: boolean;
  created_at: string;
}

export default function AdminPromos() {
  const supabase = createClient();
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", message: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPromos();
  }, []);

  async function loadPromos() {
    setLoading(true);
    const { data } = await supabase
      .from("promos")
      .select("*")
      .order("created_at", { ascending: false });
    setPromos(data || []);
    setLoading(false);
  }

  async function createPromo() {
    if (!form.title.trim() || !form.message.trim()) return;
    setSaving(true);
    await supabase.from("promos").insert({
      title: form.title.trim(),
      message: form.message.trim(),
      active: true,
    });
    setForm({ title: "", message: "" });
    setModal(false);
    setSaving(false);
    loadPromos();
  }

  async function toggleActive(promo: Promo) {
    await supabase.from("promos").update({ active: !promo.active }).eq("id", promo.id);
    setPromos((prev) =>
      prev.map((p) => (p.id === promo.id ? { ...p, active: !p.active } : p))
    );
  }

  async function deletePromo(id: string) {
    if (!confirm("¿Eliminar esta promo?")) return;
    await supabase.from("promos").delete().eq("id", id);
    setPromos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Megaphone className="w-6 h-6" style={{ color: "var(--color-accent)" }} />
        <h1 className="font-display font-bold text-2xl uppercase tracking-wide">Promociones</h1>
        <button
          onClick={() => setModal(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-sm border-0 transition-all hover:brightness-110"
          style={{ background: "var(--color-accent)" }}
        >
          <Plus className="w-4 h-4" /> Nueva promo
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16" style={{ color: "var(--color-ink-soft)" }}>
          Cargando promos...
        </div>
      ) : promos.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--color-ink-soft)" }}>
          <p className="text-3xl mb-3">📢</p>
          <p className="font-medium">No hay promociones cargadas.</p>
          <p className="text-sm mt-1">Creá una promo y los clientes que pidieron aviso serán notificados.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {promos.map((p) => (
            <div
              key={p.id}
              className="flex items-start gap-4 rounded-xl border px-4 py-3"
              style={{
                borderColor: "var(--color-line)",
                background: "var(--color-surface)",
                opacity: p.active ? 1 : 0.6,
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">{p.title}</p>
                  <span
                    className="px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase"
                    style={{
                      background: p.active ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)",
                      color: p.active ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {p.active ? "Activa" : "Inactiva"}
                  </span>
                </div>
                <p className="text-xs whitespace-pre-line" style={{ color: "var(--color-ink-soft)" }}>
                  {p.message}
                </p>
                <p className="text-[10px] mt-1" style={{ color: "var(--color-ink-soft)" }}>
                  {new Date(p.created_at).toLocaleDateString("es-AR")}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleActive(p)}
                  className="w-8 h-8 rounded-lg grid place-items-center border-0 bg-transparent transition-colors"
                  style={{ color: p.active ? "#22c55e" : "var(--color-ink-soft)" }}
                  title={p.active ? "Desactivar" : "Activar"}
                >
                  {p.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => deletePromo(p.id)}
                  className="w-8 h-8 rounded-lg grid place-items-center border-0 bg-transparent"
                  style={{ color: "var(--color-ink-soft)" }}
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center" style={{ background: "rgba(10,14,24,.55)" }}>
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: "var(--color-surface)", boxShadow: "var(--shadow-lg)" }}
          >
            <h2 className="font-display font-bold text-lg uppercase mb-4">Nueva Promo</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Título (ej: Oferta en cemento)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none"
                style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}
              />
              <textarea
                placeholder="Mensaje de la promo..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl border-2 text-sm outline-none resize-none"
                style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setModal(false); setForm({ title: "", message: "" }); }}
                className="flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm"
                style={{ borderColor: "var(--color-line)", background: "transparent", color: "var(--color-ink)" }}
              >
                Cancelar
              </button>
              <button
                onClick={createPromo}
                disabled={saving || !form.title.trim() || !form.message.trim()}
                className="flex-1 py-2.5 rounded-xl border-0 text-white font-semibold text-sm disabled:opacity-40"
                style={{ background: "var(--color-accent)" }}
              >
                {saving ? "Guardando..." : "Crear promo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
