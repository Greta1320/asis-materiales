import Image from "next/image";

export function LogoIcon({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo-icon.jpg"
      alt="Asís Materiales"
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
      style={{ objectFit: "cover" }}
      priority
    />
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
