import { MapPin, Phone, Clock } from "lucide-react";
import { STORE } from "@/lib/config";
import { buildGeneralURL } from "@/lib/whatsapp";
import { LogoIcon } from "./logo";

export function Footer() {
  return (
    <footer id="footer" className="mt-auto" style={{ background: "var(--color-navy)" }}>
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-8 px-4 py-10">
        {/* Marca */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <LogoIcon size={48} />
            <span className="font-display font-extrabold text-lg uppercase tracking-wide text-white">
              <span style={{ color: "var(--color-accent)" }}>Asís</span> Materiales
            </span>
          </div>
          <p className="text-sm text-white/65">
            Materiales para la construcción, corralón y ferretería.
            Atención personalizada y envíos a la zona.
          </p>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-3" style={{ color: "var(--color-accent)" }}>
            Contacto
          </h4>
          <div className="flex flex-col gap-2.5 text-sm text-white/75">
            <a
              href={buildGeneralURL()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 no-underline hover:text-white transition-colors"
              style={{ color: "inherit" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-accent)" }}>
                <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .8-.2 1.4Z" />
              </svg>
              WhatsApp: {STORE.phone}
            </a>
            <span className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-accent)" }} />
              Tel: {STORE.phoneAlt}
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.address + ", " + STORE.city + ", " + STORE.province + ", Argentina")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 no-underline hover:text-white transition-colors"
              style={{ color: "inherit" }}
            >
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-accent)" }} />
              {STORE.address}, {STORE.province}
            </a>
            <a
              href={STORE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 no-underline hover:text-white transition-colors"
              style={{ color: "inherit" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-accent)" }}>
                <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4a3.9 3.9 0 0 1-1.4-.9c-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2M12 0C8.7 0 8.3 0 7 .1 5.7.1 4.8.3 4 .6c-.9.3-1.6.7-2.3 1.4C1 2.7.6 3.4.3 4.3.1 5 0 5.9 0 7.1 0 8.4 0 8.7 0 12s0 3.6.1 4.9c.1 1.3.3 2.1.6 2.9.3.9.7 1.6 1.4 2.3.7.7 1.4 1.1 2.3 1.4.8.3 1.6.5 2.9.5C8.4 24 8.7 24 12 24s3.6 0 4.9-.1c1.3-.1 2.1-.3 2.9-.6.9-.3 1.6-.7 2.3-1.4.7-.7 1.1-1.4 1.4-2.3.3-.8.5-1.6.5-2.9.1-1.3.1-1.6.1-4.9s0-3.6-.1-4.9c-.1-1.3-.3-2.1-.6-2.9-.3-.9-.7-1.6-1.4-2.3C21.3 1.3 20.6.9 19.7.6 18.9.3 18.1.1 16.8.1 15.6 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z" />
              </svg>
              @asismateriales
            </a>
          </div>
        </div>

        {/* Horarios */}
        <div>
          <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-3" style={{ color: "var(--color-accent)" }}>
            Horarios
          </h4>
          <div className="flex flex-col gap-1.5 text-sm text-white/75">
            <span className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 shrink-0" style={{ color: "var(--color-accent)" }} />
              {STORE.hours.weekdays}
            </span>
            <span className="ml-[26px]">{STORE.hours.saturday}</span>
            <span className="ml-[26px]">{STORE.hours.sunday}</span>
          </div>
        </div>
      </div>

      <div className="border-t text-center text-xs py-3 text-white/40" style={{ borderColor: "rgba(255,255,255,.1)" }}>
        {STORE.name} © {new Date().getFullYear()} — Todos los derechos reservados
      </div>
    </footer>
  );
}
