/**
 * Logo SVG de Asís Materiales
 * Replica el isotipo: "A" formada por ladrillos naranja sobre fondo azul marino
 */
export function LogoIcon({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      className={className}
      aria-label="Asís Materiales"
    >
      {/* Fondo azul marino */}
      <rect width="80" height="80" rx="14" fill="var(--color-navy, #0c2461)" />
      {/* Ladrillos — 3 filas formando la pata izquierda de la A */}
      <rect x="12" y="52" width="16" height="10" rx="1.5" fill="var(--color-accent, #f58220)" />
      <rect x="12" y="39" width="18" height="10" rx="1.5" fill="var(--color-accent, #f58220)" />
      <rect x="15" y="26" width="18" height="10" rx="1.5" fill="var(--color-accent, #f58220)" />
      {/* La "A" grande — triángulo derecho */}
      <path
        d="M36 14 L68 62 L50 62 L36 36 Z"
        fill="var(--color-accent, #f58220)"
      />
      {/* Barra horizontal de la A */}
      <rect x="30" y="44" width="22" height="8" rx="1.5" fill="var(--color-navy, #0c2461)" />
      {/* Texto MATERIALES */}
      <text
        x="40" y="73"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="8"
        fontFamily="Barlow Semi Condensed, Barlow, system-ui, sans-serif"
        fontWeight="600"
        letterSpacing="3"
      >
        MATERIALES
      </text>
    </svg>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={44} />
      <span className="font-display font-extrabold text-xl leading-none uppercase tracking-wide" style={{ color: "var(--color-ink)" }}>
        <span className="text-[22px]" style={{ color: "var(--color-accent)" }}>Asís</span>
        <br />
        <span className="text-[13px] font-bold tracking-[.22em]" style={{ color: "var(--color-ink-soft)" }}>
          Materiales
        </span>
      </span>
    </span>
  );
}
