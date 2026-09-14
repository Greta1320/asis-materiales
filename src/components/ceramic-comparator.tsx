"use client";

import { useState } from "react";
import { Layers, ChevronDown, ChevronUp } from "lucide-react";

interface CeramicType {
  name: string;
  size: string;
  use: string;
  resistance: string;
  transit: string;
  maintenance: string;
}

const CERAMICS: CeramicType[] = [
  { name: "Cerámico Esmaltado", size: "30×30 / 40×40", use: "Interior pisos y paredes", resistance: "Media", transit: "Bajo a medio", maintenance: "Fácil" },
  { name: "Porcellanato Pulido", size: "60×60", use: "Interior pisos premium", resistance: "Alta", transit: "Medio", maintenance: "Requiere sellado" },
  { name: "Porcellanato Mate", size: "60×60", use: "Interior / exterior", resistance: "Muy alta", transit: "Alto", maintenance: "Muy fácil" },
  { name: "Cerámico Exterior", size: "30×30 / 40×40", use: "Exterior antideslizante", resistance: "Alta", transit: "Alto", maintenance: "Fácil" },
  { name: "Revestimiento Pared", size: "30×45 / 30×60", use: "Paredes interiores", resistance: "Baja", transit: "No aplica", maintenance: "Muy fácil" },
  { name: "Cerámica Rústica", size: "40×40 / 50×50", use: "Interior / exterior rústico", resistance: "Alta", transit: "Alto", maintenance: "Fácil" },
];

const FIELDS: { key: keyof CeramicType; label: string }[] = [
  { key: "size", label: "Medidas comunes" },
  { key: "use", label: "Uso recomendado" },
  { key: "resistance", label: "Resistencia" },
  { key: "transit", label: "Tránsito" },
  { key: "maintenance", label: "Mantenimiento" },
];

export function CeramicComparator() {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-b" style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-2 border-0 bg-transparent cursor-pointer p-0"
          style={{ color: "var(--color-ink)" }}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
            <h2 className="font-display font-bold text-lg uppercase tracking-wide m-0">
              Comparador de cerámicos
            </h2>
          </div>
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {open && (
          <div className="mt-4 overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left py-2 px-3 font-semibold text-xs uppercase tracking-wide border-b" style={{ borderColor: "var(--color-line)", color: "var(--color-ink-soft)" }}>
                    Tipo
                  </th>
                  {FIELDS.map((f) => (
                    <th key={f.key} className="text-left py-2 px-3 font-semibold text-xs uppercase tracking-wide border-b" style={{ borderColor: "var(--color-line)", color: "var(--color-ink-soft)" }}>
                      {f.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CERAMICS.map((c, i) => (
                  <tr key={i} className="transition-colors" style={{ background: i % 2 === 0 ? "transparent" : "var(--color-surface-2)" }}>
                    <td className="py-2.5 px-3 font-semibold whitespace-nowrap">{c.name}</td>
                    {FIELDS.map((f) => (
                      <td key={f.key} className="py-2.5 px-3 whitespace-nowrap" style={{ color: "var(--color-ink-soft)" }}>
                        {c[f.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] mt-3 text-center" style={{ color: "var(--color-ink-soft)" }}>
              Consultanos por WhatsApp para asesoramiento personalizado según tu obra.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
