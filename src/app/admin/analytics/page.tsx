"use client";

import { useEffect, useState } from "react";
import { BarChart3, Monitor, Smartphone, TrendingUp, Eye, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DayStat {
  date: string;
  count: number;
}

interface PageStat {
  path: string;
  count: number;
}

export default function AdminAnalytics() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(0);
  const [week, setWeek] = useState(0);
  const [month, setMonth] = useState(0);
  const [total, setTotal] = useState(0);
  const [desktopPct, setDesktopPct] = useState(0);
  const [dailyStats, setDailyStats] = useState<DayStat[]>([]);
  const [topPages, setTopPages] = useState<PageStat[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString();

    const [todayRes, weekRes, monthRes, totalRes] = await Promise.all([
      supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
      supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
      supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
      supabase.from("page_views").select("id", { count: "exact", head: true }),
    ]);

    setToday(todayRes.count || 0);
    setWeek(weekRes.count || 0);
    setMonth(monthRes.count || 0);
    setTotal(totalRes.count || 0);

    const { data: recentViews } = await supabase
      .from("page_views")
      .select("path, device, created_at")
      .gte("created_at", monthStart)
      .order("created_at", { ascending: false })
      .limit(1000);

    if (recentViews && recentViews.length > 0) {
      const desktopCount = recentViews.filter((v) => v.device === "desktop").length;
      setDesktopPct(Math.round((desktopCount / recentViews.length) * 100));

      const byDay: Record<string, number> = {};
      const byPage: Record<string, number> = {};

      recentViews.forEach((v) => {
        const day = v.created_at.slice(0, 10);
        byDay[day] = (byDay[day] || 0) + 1;
        byPage[v.path] = (byPage[v.path] || 0) + 1;
      });

      const days = Object.entries(byDay)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-14);
      setDailyStats(days);

      const pages = Object.entries(byPage)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
      setTopPages(pages);
    }

    setLoading(false);
  }

  const maxDaily = Math.max(...dailyStats.map((d) => d.count), 1);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6" style={{ color: "var(--color-accent)" }} />
        <h1 className="font-display font-bold text-2xl uppercase tracking-wide">Analytics</h1>
      </div>

      {loading ? (
        <div className="text-center py-16" style={{ color: "var(--color-ink-soft)" }}>Cargando estadísticas...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Hoy", value: today, icon: Eye, color: "#22c55e" },
              { label: "Última semana", value: week, icon: TrendingUp, color: "#3b82f6" },
              { label: "Último mes", value: month, icon: Globe, color: "#8b5cf6" },
              { label: "Total", value: total, icon: BarChart3, color: "var(--color-accent)" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>
                    {kpi.label}
                  </span>
                </div>
                <p className="font-display font-bold text-3xl tabular-nums">{kpi.value.toLocaleString("es-AR")}</p>
                <p className="text-xs mt-1" style={{ color: "var(--color-ink-soft)" }}>visitas</p>
              </div>
            ))}
          </div>

          {/* Device split */}
          <div
            className="rounded-xl border p-4 mb-6"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-ink-soft)" }}>
              Dispositivos (último mes)
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" style={{ color: "#3b82f6" }} />
                <span className="text-sm font-medium">Desktop {desktopPct}%</span>
              </div>
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "var(--color-surface-2)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${desktopPct}%`, background: "#3b82f6" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" style={{ color: "#22c55e" }} />
                <span className="text-sm font-medium">Mobile {100 - desktopPct}%</span>
              </div>
            </div>
          </div>

          {/* Daily chart */}
          <div
            className="rounded-xl border p-4 mb-6"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--color-ink-soft)" }}>
              Visitas por día (últimos 14 días)
            </p>
            {dailyStats.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: "var(--color-ink-soft)" }}>
                Sin datos todavía. Las visitas se empiezan a registrar desde ahora.
              </p>
            ) : (
              <div className="flex items-end gap-1.5" style={{ height: 140 }}>
                {dailyStats.map((d) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-medium tabular-nums" style={{ color: "var(--color-ink-soft)" }}>
                      {d.count}
                    </span>
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{
                        height: `${Math.max((d.count / maxDaily) * 100, 4)}px`,
                        background: "var(--color-accent)",
                        minHeight: 4,
                      }}
                    />
                    <span className="text-[9px] tabular-nums" style={{ color: "var(--color-ink-soft)" }}>
                      {d.date.slice(8)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top pages */}
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-ink-soft)" }}>
              Páginas más visitadas (último mes)
            </p>
            {topPages.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: "var(--color-ink-soft)" }}>Sin datos todavía.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {topPages.map((p, i) => (
                  <div key={p.path} className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold text-white shrink-0"
                      style={{ background: i < 3 ? "var(--color-accent)" : "var(--color-ink-soft)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium truncate">{p.path === "/" ? "Inicio" : p.path}</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: "var(--color-accent)" }}>
                      {p.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
