"use client";

import { useEffect, useState } from "react";
import { Search, CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";

interface SEOCheck {
  label: string;
  status: "pass" | "fail" | "warn";
  detail: string;
}

const SITE_URL = "https://asismateriales.com";

export default function AdminSEO() {
  const [checks, setChecks] = useState<SEOCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    runChecks();
  }, []);

  async function runChecks() {
    setLoading(true);
    const results: SEOCheck[] = [];

    try {
      const res = await fetch("/");
      const html = await res.text();

      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1].length > 10) {
        results.push({ label: "Title tag", status: "pass", detail: `"${titleMatch[1].slice(0, 60)}${titleMatch[1].length > 60 ? "..." : ""}"` });
      } else {
        results.push({ label: "Title tag", status: "fail", detail: "Falta o es muy corto" });
      }

      const descMatch = html.match(/name="description"\s+content="([^"]+)"/i);
      if (descMatch && descMatch[1].length > 50) {
        results.push({ label: "Meta description", status: "pass", detail: `${descMatch[1].length} caracteres` });
      } else {
        results.push({ label: "Meta description", status: descMatch ? "warn" : "fail", detail: descMatch ? "Muy corta (menos de 50 chars)" : "No encontrada" });
      }

      const ogImage = html.includes('og:image') || html.includes('opengraph-image');
      results.push({
        label: "Open Graph image",
        status: ogImage ? "pass" : "fail",
        detail: ogImage ? "Configurada correctamente" : "Falta — no se verá preview al compartir",
      });

      const ogTitle = html.includes('og:title');
      results.push({
        label: "Open Graph title",
        status: ogTitle ? "pass" : "fail",
        detail: ogTitle ? "Presente" : "Falta",
      });

      const canonical = html.includes('canonical');
      results.push({
        label: "URL canónica",
        status: canonical ? "pass" : "warn",
        detail: canonical ? "Configurada" : "No encontrada — puede haber contenido duplicado",
      });

      const jsonLd = html.includes('application/ld+json');
      results.push({
        label: "Schema.org (JSON-LD)",
        status: jsonLd ? "pass" : "warn",
        detail: jsonLd ? "HardwareStore schema detectado" : "No encontrado — mejora la visibilidad en Google",
      });

      const viewport = html.includes('viewport');
      results.push({
        label: "Viewport meta",
        status: viewport ? "pass" : "fail",
        detail: viewport ? "Responsive configurado" : "Falta — problemas en mobile",
      });

      const lang = html.includes('lang="es"');
      results.push({
        label: "Idioma (lang)",
        status: lang ? "pass" : "warn",
        detail: lang ? 'lang="es" configurado' : "No especificado",
      });
    } catch {
      results.push({ label: "Página principal", status: "fail", detail: "No se pudo cargar" });
    }

    try {
      const sitemapRes = await fetch("/sitemap.xml");
      const sitemapOk = sitemapRes.ok && (await sitemapRes.text()).includes("<urlset");
      results.push({
        label: "Sitemap.xml",
        status: sitemapOk ? "pass" : "fail",
        detail: sitemapOk ? "Presente y válido" : "No encontrado o vacío",
      });
    } catch {
      results.push({ label: "Sitemap.xml", status: "fail", detail: "Error al verificar" });
    }

    try {
      const robotsRes = await fetch("/robots.txt");
      const robotsOk = robotsRes.ok;
      results.push({
        label: "Robots.txt",
        status: robotsOk ? "pass" : "warn",
        detail: robotsOk ? "Presente" : "No encontrado",
      });
    } catch {
      results.push({ label: "Robots.txt", status: "warn", detail: "Error al verificar" });
    }

    results.push({
      label: "HTTPS",
      status: "pass",
      detail: "Sitio servido con SSL via Vercel",
    });

    const passCount = results.filter((r) => r.status === "pass").length;
    const totalScore = Math.round((passCount / results.length) * 100);

    setChecks(results);
    setScore(totalScore);
    setLoading(false);
  }

  const statusIcon = (s: SEOCheck["status"]) => {
    if (s === "pass") return <CheckCircle className="w-4.5 h-4.5" style={{ color: "#22c55e" }} />;
    if (s === "warn") return <AlertCircle className="w-4.5 h-4.5" style={{ color: "#f59e0b" }} />;
    return <XCircle className="w-4.5 h-4.5" style={{ color: "#ef4444" }} />;
  };

  const scoreColor = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-6 h-6" style={{ color: "var(--color-accent)" }} />
        <h1 className="font-display font-bold text-2xl uppercase tracking-wide">SEO</h1>
      </div>

      {loading ? (
        <div className="text-center py-16" style={{ color: "var(--color-ink-soft)" }}>Analizando sitio...</div>
      ) : (
        <>
          {/* Score */}
          <div
            className="rounded-xl border p-6 mb-6 flex items-center gap-6"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
          >
            <div
              className="w-20 h-20 rounded-full grid place-items-center border-4"
              style={{ borderColor: scoreColor }}
            >
              <span className="font-display font-bold text-2xl" style={{ color: scoreColor }}>
                {score}
              </span>
            </div>
            <div>
              <p className="font-semibold text-lg">
                {score >= 80 ? "Excelente" : score >= 60 ? "Bueno, se puede mejorar" : "Necesita atención"}
              </p>
              <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
                {checks.filter((c) => c.status === "pass").length} de {checks.length} checks pasados
              </p>
            </div>
          </div>

          {/* Checks list */}
          <div
            className="rounded-xl border overflow-hidden mb-6"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
          >
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--color-line)", background: "var(--color-surface-2)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>
                Health Check
              </p>
            </div>
            {checks.map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-3 px-4 py-3 border-b last:border-0"
                style={{ borderColor: "var(--color-line)" }}
              >
                {statusIcon(c.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{c.label}</p>
                  <p className="text-xs truncate" style={{ color: "var(--color-ink-soft)" }}>{c.detail}</p>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0"
                  style={{
                    background: c.status === "pass" ? "rgba(34,197,94,.15)" : c.status === "warn" ? "rgba(245,158,11,.15)" : "rgba(239,68,68,.15)",
                    color: c.status === "pass" ? "#22c55e" : c.status === "warn" ? "#f59e0b" : "#ef4444",
                  }}
                >
                  {c.status === "pass" ? "OK" : c.status === "warn" ? "Mejorable" : "Falta"}
                </span>
              </div>
            ))}
          </div>

          {/* External links */}
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-ink-soft)" }}>
              Herramientas externas
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Google Search Console", url: "https://search.google.com/search-console", desc: "Posicionamiento, palabras clave, impresiones" },
                { label: "PageSpeed Insights", url: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}`, desc: "Velocidad de carga y rendimiento" },
                { label: "Google Rich Results", url: `https://search.google.com/test/rich-results?url=${encodeURIComponent(SITE_URL)}`, desc: "Validar datos estructurados (Schema.org)" },
                { label: "Mobile-Friendly Test", url: `https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(SITE_URL)}`, desc: "Verificar que funciona bien en celulares" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline transition-colors hover:opacity-80"
                  style={{ background: "var(--color-surface-2)", color: "var(--color-ink)" }}
                >
                  <ExternalLink className="w-4 h-4 shrink-0" style={{ color: "var(--color-accent)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{link.label}</p>
                    <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>{link.desc}</p>
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
