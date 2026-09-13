import { MapPin, Phone, Clock } from "lucide-react";
import { STORE } from "@/lib/config";
import { buildGeneralURL } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer id="footer" className="mt-auto" style={{ background: "var(--color-brand)", color: "var(--color-brand-ink)" }}>
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-8 px-4 py-10">
        {/* Marca */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: "var(--color-amber)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#23211d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M3 21h18" /><path d="M5 21V10l7-5 7 5v11" /><path d="M9 21v-6h6v6" />
              </svg>
            </span>
            <span className="font-display font-extrabold text-lg uppercase tracking-wide">
              {STORE.name}
            </span>
          </div>
          <p className="text-sm opacity-75">
            Materiales para la construcción, corralón y ferretería.
            Atención personalizada y envíos a la zona.
          </p>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="font-display font-bold text-base uppercase tracking-wider mb-3" style={{ color: "var(--color-amber)" }}>
            Contacto
          </h4>
          <div className="flex flex-col gap-2 text-sm opacity-80">
            <a
              href={buildGeneralURL()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 no-underline hover:opacity-100"
              style={{ color: "inherit" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-amber)" }}>
                <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .8-.2 1.4Z" />
              </svg>
              WhatsApp: completar número
            </a>
            <span className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-amber)" }} />
              Tel: completar teléfono
            </span>
            <span className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-amber)" }} />
              Completar dirección
            </span>
          </div>
        </div>

        {/* Horarios */}
        <div>
          <h4 className="font-display font-bold text-base uppercase tracking-wider mb-3" style={{ color: "var(--color-amber)" }}>
            Horarios
          </h4>
          <div className="flex flex-col gap-1 text-sm opacity-80">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" style={{ color: "var(--color-amber)" }} />
              Lunes a Viernes: 8 a 18 hs
            </span>
            <span className="ml-6">Sábados: 8 a 13 hs</span>
            <span className="ml-6">Domingos: cerrado</span>
          </div>
        </div>
      </div>

      <div className="border-t text-center text-xs py-3 opacity-50" style={{ borderColor: "rgba(255,255,255,.14)" }}>
        {STORE.name} © {new Date().getFullYear()} — Todos los derechos reservados
      </div>
    </footer>
  );
}
