"use client";

import { Camera } from "lucide-react";
import { STORE } from "@/lib/config";
import { buildGeneralURL } from "@/lib/whatsapp";

export function GallerySection() {
  return (
    <section className="border-t" style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}>
      <div className="mx-auto max-w-7xl px-4 py-10 text-center">
        <Camera className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--color-accent)" }} />
        <h2 className="font-display font-bold text-lg uppercase tracking-wide mb-2">
          Obras de nuestros clientes
        </h2>
        <p className="text-sm max-w-md mx-auto mb-5" style={{ color: "var(--color-ink-soft)" }}>
          Mostrá tu obra terminada y participá de nuestra galería.
          Mandanos las fotos por WhatsApp y la publicamos acá.
        </p>
        <a
          href={buildGeneralURL("Hola! Quiero compartir fotos de mi obra para la galería.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-sm no-underline transition-all duration-150"
          style={{ background: "var(--color-navy)", color: "#fff" }}
        >
          <Camera className="w-4 h-4" />
          Enviar mis fotos
        </a>
        <p className="text-[11px] mt-4" style={{ color: "var(--color-ink-soft)" }}>
          Próximamente: galería con fotos de obras reales de {STORE.name}.
        </p>
      </div>
    </section>
  );
}
