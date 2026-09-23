"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Check, Trash2, Phone, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Consulta {
  id: string;
  pregunta: string;
  nombre: string | null;
  telefono: string | null;
  localidad: string | null;
  estado: string;
  created_at: string;
}

export default function AdminConsultas() {
  const supabase = createClient();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"pendiente" | "todas">("pendiente");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("consultas")
      .select("*")
      .order("created_at", { ascending: false });
    setConsultas((data as Consulta[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function marcarRespondida(id: string) {
    await supabase.from("consultas").update({ estado: "respondida" }).eq("id", id);
    setConsultas((prev) => prev.map((c) => (c.id === id ? { ...c, estado: "respondida" } : c)));
  }

  async function borrar(id: string) {
    if (!confirm("¿Borrar esta consulta?")) return;
    await supabase.from("consultas").delete().eq("id", id);
    setConsultas((prev) => prev.filter((c) => c.id !== id));
  }

  function whatsappURL(c: Consulta) {
    const tel = (c.telefono || "").replace(/\D/g, "");
    const num = tel.startsWith("54") ? tel : `549${tel}`;
    const texto = encodeURIComponent(
      `Hola${c.nombre ? ` ${c.nombre}` : ""}! Te contacto de Asís Materiales por tu consulta:\n\n"${c.pregunta}"\n\n`
    );
    return `https://wa.me/${num}?text=${texto}`;
  }

  const pendientes = consultas.filter((c) => c.estado === "pendiente");
  const visibles = filtro === "pendiente" ? pendientes : consultas;

  return (
    <div className="p-4 sm:p-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl uppercase tracking-wide">Consultas</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-ink-soft)" }}>
            Preguntas que el asistente no pudo responder
          </p>
        </div>
        <div className="flex gap-2">
          {(["pendiente", "todas"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className="rounded-xl px-4 py-2 text-sm font-bold border-2 transition-colors"
              style={
                filtro === f
                  ? { background: "var(--color-accent)", borderColor: "var(--color-accent)", color: "#fff" }
                  : { background: "var(--color-surface)", borderColor: "var(--color-line-strong)", color: "var(--color-ink)" }
              }
            >
              {f === "pendiente" ? `Pendientes (${pendientes.length})` : "Todas"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--color-ink-soft)" }}>Cargando…</p>
      ) : visibles.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "var(--color-line-strong)", color: "var(--color-ink-soft)" }}
        >
          {filtro === "pendiente"
            ? "No hay consultas pendientes. 👌"
            : "Todavía nadie dejó una consulta."}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visibles.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border p-4"
              style={{
                background: "var(--color-surface)",
                borderColor: c.estado === "pendiente" ? "var(--color-accent)" : "var(--color-line)",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <MessageSquare className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                  {c.nombre || "Sin nombre"}
                  {c.estado === "respondida" && (
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(34,197,94,.15)", color: "#22c55e" }}
                    >
                      Respondida
                    </span>
                  )}
                </div>
                <span className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
                  {new Date(c.created_at).toLocaleString("es-AR", {
                    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--color-ink)" }}>
                “{c.pregunta}”
              </p>

              <div className="flex items-center gap-4 text-xs mb-3 flex-wrap" style={{ color: "var(--color-ink-soft)" }}>
                {c.telefono && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> {c.telefono}
                  </span>
                )}
                {c.localidad && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {c.localidad}
                  </span>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {c.telefono && (
                  <a
                    href={whatsappURL(c)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white no-underline"
                    style={{ background: "#25d366" }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .8-.2 1.4Z" />
                    </svg>
                    Responder por WhatsApp
                  </a>
                )}
                {c.estado === "pendiente" && (
                  <button
                    onClick={() => marcarRespondida(c.id)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold border-2"
                    style={{ background: "var(--color-surface)", borderColor: "var(--color-line-strong)", color: "var(--color-ink)" }}
                  >
                    <Check className="w-4 h-4" /> Marcar respondida
                  </button>
                )}
                <button
                  onClick={() => borrar(c.id)}
                  className="w-9 h-9 rounded-xl grid place-items-center border-0 ml-auto"
                  style={{ background: "var(--color-surface-2)", color: "#dc3232" }}
                  title="Borrar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
