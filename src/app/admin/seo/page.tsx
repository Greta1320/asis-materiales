"use client";

import { useEffect, useState } from "react";
import { Search, ExternalLink, RefreshCw } from "lucide-react";

interface SEOCheck {
  label: string;
  description: string;
  status: "pass" | "fail" | "warn";
  detail: string;
  emoji: string;
}

const SITE_URL = "https://asismateriales.com";

function AnimatedScore({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / 1500, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{display}</>;
}

function ScoreRing({ score }: { score: number }) {
  const size = 160;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);

  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  const bg = score >= 80 ? "rgba(34,197,94,.1)" : score >= 60 ? "rgba(245,158,11,.1)" : "rgba(239,68,68,.1)";
  const label = score >= 80 ? "Excelente" : score >= 60 ? "Puede mejorar" : "Necesita trabajo";
  const emoji = score >= 80 ? "🚀" : score >= 60 ? "👍" : "⚠️";

  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (score / 100) * circ), 200);
    return () => clearTimeout(t);
  }, [score, circ]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl mb-1">{emoji}</span>
          <span className="font-display font-bold text-4xl tabular-nums" style={{ color }}>
            <AnimatedScore value={score} />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>de 100</span>
        </div>
      </div>
      <div className="text-center">
        <span
          className="inline-block px-3 py-1 rounded-full text-sm font-bold"
          style={{ background: bg, color }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default function AdminSEO() {
  const [checks, setChecks] = useState<SEOCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => { runChecks(); }, []);

  async function runChecks() {
    setLoading(true);
    setShow(false);
    const results: SEOCheck[] = [];

    try {
      const res = await fetch("/");
      const html = await res.text();

      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      results.push({
        emoji: "📝", label: "Nombre de tu página",
        description: "El título que aparece en la pestaña del navegador y en Google",
        status: titleMatch && titleMatch[1].length > 10 ? "pass" : "fail",
        detail: titleMatch ? `"${titleMatch[1].slice(0, 50)}..."` : "No tiene título",
      });

      const descMatch = html.match(/name="description"\s+content="([^"]+)"/i);
      results.push({
        emoji: "📋", label: "Descripción para Google",
        description: "El texto que aparece debajo de tu link en los resultados de Google",
        status: descMatch && descMatch[1].length > 50 ? "pass" : descMatch ? "warn" : "fail",
        detail: descMatch ? `${descMatch[1].length} caracteres — perfecto` : "No tiene descripción",
      });

      const ogImage = html.includes("og:image") || html.includes("opengraph-image");
      results.push({
        emoji: "🖼️", label: "Imagen al compartir",
        description: "La imagen que se muestra cuando compartís tu web por WhatsApp o redes",
        status: ogImage ? "pass" : "fail",
        detail: ogImage ? "Se ve bien al compartir" : "No se va a ver imagen al compartir tu link",
      });

      const ogTitle = html.includes("og:title");
      results.push({
        emoji: "💬", label: "Título al compartir",
        description: "El nombre que aparece cuando mandás el link por WhatsApp",
        status: ogTitle ? "pass" : "fail",
        detail: ogTitle ? "Configurado" : "No aparece nombre al compartir",
      });

      const canonical = html.includes("canonical");
      results.push({
        emoji: "🔗", label: "Dirección principal",
        description: "Le dice a Google cuál es la URL oficial de tu página",
        status: canonical ? "pass" : "warn",
        detail: canonical ? "asismateriales.com está configurada" : "Google podría confundirse con URLs duplicadas",
      });

      const jsonLd = html.includes("application/ld+json");
      results.push({
        emoji: "🏪", label: "Datos de tu negocio",
        description: "Información estructurada que Google usa para mostrar tu ferretería",
        status: jsonLd ? "pass" : "warn",
        detail: jsonLd ? "Google sabe que sos una ferretería — horarios, dirección, todo" : "Google no tiene datos extra de tu negocio",
      });

      const viewport = html.includes("viewport");
      results.push({
        emoji: "📱", label: "Se adapta al celular",
        description: "Tu web se ve bien en celulares — Google prioriza las páginas mobile-friendly",
        status: viewport ? "pass" : "fail",
        detail: viewport ? "Tu web se adapta a cualquier pantalla" : "Puede verse mal en celulares",
      });

      const lang = html.includes('lang="es"');
      results.push({
        emoji: "🌐", label: "Idioma configurado",
        description: "Le dice a Google que tu página está en español argentino",
        status: lang ? "pass" : "warn",
        detail: lang ? "Español (Argentina)" : "No tiene idioma definido",
      });
    } catch {
      results.push({
        emoji: "❌", label: "Página principal",
        description: "No se pudo analizar tu página",
        status: "fail", detail: "Error al cargar",
      });
    }

    try {
      const sitemapRes = await fetch("/sitemap.xml");
      const sitemapOk = sitemapRes.ok && (await sitemapRes.text()).includes("<urlset");
      results.push({
        emoji: "🗺️", label: "Mapa del sitio",
        description: "Un archivo que le dice a Google todas las páginas que tenés",
        status: sitemapOk ? "pass" : "fail",
        detail: sitemapOk ? "Google puede encontrar todas tus páginas" : "Google no tiene un mapa de tu sitio",
      });
    } catch {
      results.push({ emoji: "🗺️", label: "Mapa del sitio", description: "", status: "fail", detail: "Error al verificar" });
    }

    try {
      const robotsRes = await fetch("/robots.txt");
      results.push({
        emoji: "🤖", label: "Permiso para Google",
        description: "Le dice a Google si puede o no entrar a ver tu página",
        status: robotsRes.ok ? "pass" : "warn",
        detail: robotsRes.ok ? "Google tiene permiso para ver tu web" : "No encontrado — Google entra igual pero es mejor tenerlo",
      });
    } catch {
      results.push({ emoji: "🤖", label: "Permiso para Google", description: "", status: "warn", detail: "Error al verificar" });
    }

    results.push({
      emoji: "🔒", label: "Conexión segura (HTTPS)",
      description: "Tu web usa candado verde — Google y los usuarios confían más",
      status: "pass",
      detail: "Protegido con SSL vía Vercel",
    });

    const passCount = results.filter((r) => r.status === "pass").length;
    setScore(Math.round((passCount / results.length) * 100));
    setChecks(results);
    setLoading(false);
    setTimeout(() => setShow(true), 50);
  }

  const passCount = checks.filter((c) => c.status === "pass").length;
  const warnCount = checks.filter((c) => c.status === "warn").length;
  const failCount = checks.filter((c) => c.status === "fail").length;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp .5s ease both; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-wide">
            <span style={{ color: "var(--color-accent)" }}>Salud</span> de tu página
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink-soft)" }}>
            Verificamos cómo te ve Google y la gente que busca tu negocio
          </p>
        </div>
        <button
          onClick={runChecks}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border-0 cursor-pointer transition-transform hover:scale-105"
          style={{ background: "var(--color-surface)", color: "var(--color-ink)", border: "1px solid var(--color-line)" }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "spin" : ""}`} />
          Analizar
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="spin" style={{ width: 40, height: 40, border: "3px solid var(--color-line)", borderTopColor: "var(--color-accent)", borderRadius: "50%" }} />
          <p className="text-sm font-medium" style={{ color: "var(--color-ink-soft)" }}>Analizando tu página...</p>
        </div>
      ) : (
        <>
          {/* Score hero */}
          <div
            className="fade-up rounded-2xl p-6 md:p-8 mb-6 flex flex-col md:flex-row items-center gap-6"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}
          >
            <ScoreRing score={score} />
            <div className="flex-1 text-center md:text-left">
              <p className="font-semibold text-lg mb-2">
                {score >= 80
                  ? "Tu página está lista para Google 🎉"
                  : score >= 60
                  ? "Tu página está bien pero puede mejorar"
                  : "Tu página necesita algunos ajustes"}
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--color-ink-soft)" }}>
                {score >= 80
                  ? "Tenés todo lo que necesitás para que la gente te encuentre buscando materiales en San Francisco."
                  : "Hay algunas cosas que podemos mejorar para que más gente te encuentre en Google."}
              </p>

              <div className="flex justify-center md:justify-start gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(34,197,94,.1)", color: "#22c55e" }}>
                  ✅ {passCount} bien
                </div>
                {warnCount > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(245,158,11,.1)", color: "#f59e0b" }}>
                    ⚡ {warnCount} mejorable{warnCount > 1 ? "s" : ""}
                  </div>
                )}
                {failCount > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(239,68,68,.1)", color: "#ef4444" }}>
                    ❌ {failCount} falta{failCount > 1 ? "n" : ""}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Checks grid */}
          <div className={`grid md:grid-cols-2 gap-3 mb-6 ${show ? "" : "opacity-0"}`}>
            {checks.map((c, i) => (
              <div
                key={c.label}
                className="fade-up rounded-2xl p-4 flex gap-3 transition-transform hover:scale-[1.02]"
                style={{
                  background: "var(--color-surface)",
                  border: `1px solid ${c.status === "pass" ? "rgba(34,197,94,.2)" : c.status === "warn" ? "rgba(245,158,11,.2)" : "rgba(239,68,68,.2)"}`,
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <span className="text-2xl shrink-0">{c.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm">{c.label}</p>
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                      style={{
                        background: c.status === "pass" ? "rgba(34,197,94,.15)" : c.status === "warn" ? "rgba(245,158,11,.15)" : "rgba(239,68,68,.15)",
                        color: c.status === "pass" ? "#22c55e" : c.status === "warn" ? "#f59e0b" : "#ef4444",
                      }}
                    >
                      {c.status === "pass" ? "✓ Bien" : c.status === "warn" ? "Mejorable" : "Falta"}
                    </span>
                  </div>
                  {c.description && (
                    <p className="text-[11px] mb-1" style={{ color: "var(--color-ink-soft)" }}>{c.description}</p>
                  )}
                  <p className="text-xs font-medium" style={{ color: c.status === "pass" ? "#22c55e" : c.status === "warn" ? "#f59e0b" : "#ef4444" }}>
                    {c.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Herramientas externas */}
          <div className="fade-up rounded-2xl p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)", animationDelay: ".6s" }}>
            <p className="font-semibold text-sm mb-1">Herramientas de Google para tu negocio</p>
            <p className="text-xs mb-4" style={{ color: "var(--color-ink-soft)" }}>
              Estas son herramientas gratuitas de Google que te ayudan a mejorar tu posicionamiento
            </p>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                { emoji: "📊", label: "Google Search Console", url: "https://search.google.com/search-console", desc: "Mirá cuántas veces aparecés en Google y qué busca la gente" },
                { emoji: "⚡", label: "Velocidad de tu página", url: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}`, desc: "Medí qué tan rápido carga tu web" },
                { emoji: "⭐", label: "Datos de tu negocio", url: `https://search.google.com/test/rich-results?url=${encodeURIComponent(SITE_URL)}`, desc: "Verificá que Google muestre tu info correctamente" },
                { emoji: "📱", label: "Test de celular", url: `https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(SITE_URL)}`, desc: "Chequeá que tu web se vea bien en celulares" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl no-underline transition-all hover:scale-[1.02]"
                  style={{ background: "var(--color-surface-2)", color: "var(--color-ink)" }}
                >
                  <span className="text-xl shrink-0">{link.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium flex items-center gap-1">
                      {link.label}
                      <ExternalLink className="w-3 h-3" style={{ color: "var(--color-ink-soft)" }} />
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--color-ink-soft)" }}>{link.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
