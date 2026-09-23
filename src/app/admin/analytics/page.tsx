"use client";

import { useEffect, useState, useRef } from "react";
import { Eye, TrendingUp, Globe, Smartphone, Monitor, Users, ArrowUpRight, ArrowDownRight, ShoppingCart, Package, Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/config";

interface DayStat { date: string; count: number }
interface PageStat { path: string; count: number }
interface OrderItem { qty: number; name: string; unit: string; price: number }
interface Order { id: string; items: OrderItem[]; total: number; created_at: string }
interface ProductStat { name: string; qty: number; unit: string; revenue: number }

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    if (diff === 0) return;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(tick);
      else ref.current = value;
    }
    requestAnimationFrame(tick);
  }, [value, duration]);

  return <>{display.toLocaleString("es-AR")}</>;
}

function CircleProgress({ pct, color, size = 90, stroke = 8 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (pct / 100) * circ), 100);
    return () => clearTimeout(t);
  }, [pct, circ]);

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}

const PAGE_NAMES: Record<string, string> = {
  "/": "Página principal",
  "/login": "Login",
  "/admin": "Panel admin",
};

export default function AdminAnalytics() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(0);
  const [yesterday, setYesterday] = useState(0);
  const [week, setWeek] = useState(0);
  const [month, setMonth] = useState(0);
  const [total, setTotal] = useState(0);
  const [desktopPct, setDesktopPct] = useState(0);
  const [dailyStats, setDailyStats] = useState<DayStat[]>([]);
  const [topPages, setTopPages] = useState<PageStat[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    setLoading(true);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString();

    const [todayRes, yesterdayRes, weekRes, monthRes, totalRes] = await Promise.all([
      supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
      supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", yesterdayStart).lt("created_at", todayStart),
      supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
      supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
      supabase.from("page_views").select("id", { count: "exact", head: true }),
    ]);

    setToday(todayRes.count || 0);
    setYesterday(yesterdayRes.count || 0);
    setWeek(weekRes.count || 0);
    setMonth(monthRes.count || 0);
    setTotal(totalRes.count || 0);

    const { data: recentViews } = await supabase
      .from("page_views")
      .select("path, device, created_at")
      .gte("created_at", monthStart)
      .order("created_at", { ascending: false })
      .limit(2000);

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

      setDailyStats(
        Object.entries(byDay)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-14)
      );
      setTopPages(
        Object.entries(byPage)
          .map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6)
      );
    }

    const { data: orderRows } = await supabase
      .from("orders")
      .select("id, items, total, created_at")
      .order("created_at", { ascending: false });
    setOrders((orderRows as Order[]) || []);

    setLoading(false);
    setTimeout(() => setShow(true), 50);
  }

  const maxDaily = Math.max(...dailyStats.map((d) => d.count), 1);
  const todayTrend = yesterday > 0 ? Math.round(((today - yesterday) / yesterday) * 100) : 0;
  const mobilePct = 100 - desktopPct;

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const facturado = orders.reduce((s, o) => s + (o.total || 0), 0);
  const ticketPromedio = orders.length ? Math.round(facturado / orders.length) : 0;

  const topProductos: ProductStat[] = Object.values(
    orders.reduce((acc: Record<string, ProductStat>, o) => {
      (o.items || []).forEach((it) => {
        const k = it.name;
        if (!acc[k]) acc[k] = { name: it.name, qty: 0, unit: it.unit, revenue: 0 };
        acc[k].qty += it.qty || 0;
        acc[k].revenue += (it.qty || 0) * (it.price || 0);
      });
      return acc;
    }, {})
  )
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 8);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .6; } }
        .fade-up { animation: fadeUp .6s ease both; }
        .fade-up-1 { animation-delay: .05s; }
        .fade-up-2 { animation-delay: .1s; }
        .fade-up-3 { animation-delay: .15s; }
        .fade-up-4 { animation-delay: .2s; }
        .fade-up-5 { animation-delay: .3s; }
        .fade-up-6 { animation-delay: .4s; }
        .bar-grow { animation: barGrow .8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .live-dot { animation: pulse 2s infinite; }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-wide flex items-center gap-2">
            <span style={{ color: "var(--color-accent)" }}>Tu sitio</span> en números
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink-soft)" }}>
            Mirá cuánta gente visita tu página y desde dónde
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "rgba(34,197,94,.15)", color: "#22c55e" }}>
          <span className="w-2 h-2 rounded-full live-dot" style={{ background: "#22c55e" }} />
          En vivo
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl h-32" style={{ background: "var(--color-surface)", animation: "pulse 1.5s infinite", animationDelay: `${i * .15}s` }} />
          ))}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 ${show ? "" : "opacity-0"}`}>
            {/* Hoy */}
            <div className="fade-up fade-up-1 rounded-2xl p-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0c2461, #1a3a8a)" }}>
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full" style={{ background: "rgba(245,130,32,.15)" }} />
              <Eye className="w-5 h-5 mb-2 text-white/60" />
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Hoy</p>
              <p className="font-display font-bold text-3xl text-white mt-1 tabular-nums">
                <AnimatedNumber value={today} />
              </p>
              {todayTrend !== 0 && (
                <div className="flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: todayTrend > 0 ? "#4ade80" : "#f87171" }}>
                  {todayTrend > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {todayTrend > 0 ? "+" : ""}{todayTrend}% vs ayer
                </div>
              )}
              <p className="text-white/40 text-[10px] mt-1">personas visitaron tu web</p>
            </div>

            {/* Semana */}
            <div className="fade-up fade-up-2 rounded-2xl p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}>
              <TrendingUp className="w-5 h-5 mb-2" style={{ color: "#3b82f6" }} />
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>Esta semana</p>
              <p className="font-display font-bold text-3xl mt-1 tabular-nums"><AnimatedNumber value={week} /></p>
              <p className="text-[10px] mt-1" style={{ color: "var(--color-ink-soft)" }}>últimos 7 días</p>
            </div>

            {/* Mes */}
            <div className="fade-up fade-up-3 rounded-2xl p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}>
              <Globe className="w-5 h-5 mb-2" style={{ color: "#8b5cf6" }} />
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>Este mes</p>
              <p className="font-display font-bold text-3xl mt-1 tabular-nums"><AnimatedNumber value={month} /></p>
              <p className="text-[10px] mt-1" style={{ color: "var(--color-ink-soft)" }}>últimos 30 días</p>
            </div>

            {/* Total */}
            <div className="fade-up fade-up-4 rounded-2xl p-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--color-accent), #e06a10)" }}>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full" style={{ background: "rgba(255,255,255,.1)" }} />
              <Users className="w-5 h-5 mb-2 text-white/70" />
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Total histórico</p>
              <p className="font-display font-bold text-3xl text-white mt-1 tabular-nums"><AnimatedNumber value={total} /></p>
              <p className="text-white/50 text-[10px] mt-1">desde que se activó</p>
            </div>
          </div>

          {/* Pedidos — KPIs de venta */}
          <div className={`grid grid-cols-3 gap-3 mb-6 ${show ? "" : "opacity-0"}`}>
            <div className="fade-up fade-up-2 rounded-2xl p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}>
              <ShoppingCart className="w-5 h-5 mb-2" style={{ color: "var(--color-accent)" }} />
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>Pedidos</p>
              <p className="font-display font-bold text-3xl mt-1 tabular-nums"><AnimatedNumber value={orders.length} /></p>
              <p className="text-[10px] mt-1" style={{ color: "var(--color-ink-soft)" }}>enviados por WhatsApp</p>
            </div>
            <div className="fade-up fade-up-3 rounded-2xl p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}>
              <Receipt className="w-5 h-5 mb-2" style={{ color: "#22c55e" }} />
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>Facturado</p>
              <p className="font-display font-bold text-2xl mt-1 tabular-nums whitespace-nowrap">{formatPrice(facturado)}</p>
              <p className="text-[10px] mt-1" style={{ color: "var(--color-ink-soft)" }}>suma de los pedidos</p>
            </div>
            <div className="fade-up fade-up-4 rounded-2xl p-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}>
              <Package className="w-5 h-5 mb-2" style={{ color: "#8b5cf6" }} />
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>Ticket promedio</p>
              <p className="font-display font-bold text-2xl mt-1 tabular-nums whitespace-nowrap">{formatPrice(ticketPromedio)}</p>
              <p className="text-[10px] mt-1" style={{ color: "var(--color-ink-soft)" }}>por pedido</p>
            </div>
          </div>

          {/* Gráfico de barras + dispositivos */}
          <div className={`grid md:grid-cols-3 gap-4 mb-6 ${show ? "" : "opacity-0"}`}>
            {/* Chart */}
            <div className="fade-up fade-up-5 md:col-span-2 rounded-2xl p-4 pb-2" style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-sm">Visitas por día</p>
                  <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>Últimos 14 días</p>
                </div>
              </div>
              {dailyStats.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-sm" style={{ color: "var(--color-ink-soft)" }}>
                  Las visitas se empiezan a registrar desde ahora.<br />Volvé mañana para ver el gráfico.
                </div>
              ) : (
                <div className="flex items-end gap-[3px] md:gap-1.5" style={{ height: 160 }}>
                  {dailyStats.map((d, i) => {
                    const pct = Math.max((d.count / maxDaily) * 100, 3);
                    const dayOfWeek = dayNames[new Date(d.date + "T12:00:00").getDay()];
                    const isToday = d.date === new Date().toISOString().slice(0, 10);
                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group" style={{ height: "100%" }}>
                        <span className="text-[10px] font-bold tabular-nums opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-accent)" }}>
                          {d.count}
                        </span>
                        <div className="w-full flex-1 flex items-end">
                          <div
                            className="w-full rounded-t-md bar-grow cursor-pointer relative"
                            style={{
                              height: `${pct}%`,
                              background: isToday ? "var(--color-accent)" : "var(--color-accent)",
                              opacity: isToday ? 1 : 0.5,
                              transformOrigin: "bottom",
                              animationDelay: `${i * 0.05 + 0.3}s`,
                            }}
                          >
                            {isToday && (
                              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap" style={{ background: "var(--color-accent)", color: "white" }}>
                                HOY: {d.count}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[9px] tabular-nums" style={{ color: isToday ? "var(--color-accent)" : "var(--color-ink-soft)", fontWeight: isToday ? 700 : 400 }}>
                          {dayOfWeek}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dispositivos */}
            <div className="fade-up fade-up-6 rounded-2xl p-4 flex flex-col items-center justify-center gap-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}>
              <p className="font-semibold text-sm self-start">Desde dónde te visitan</p>

              <div className="relative">
                <CircleProgress pct={mobilePct} color="#22c55e" size={110} stroke={10} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <CircleProgress pct={desktopPct} color="#3b82f6" size={80} stroke={8} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" style={{ color: "#22c55e" }} />
                </div>
              </div>

              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
                  <Smartphone className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
                  <span className="font-bold">{mobilePct}%</span>
                  <span style={{ color: "var(--color-ink-soft)" }}>Celular</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#3b82f6" }} />
                  <Monitor className="w-3.5 h-3.5" style={{ color: "#3b82f6" }} />
                  <span className="font-bold">{desktopPct}%</span>
                  <span style={{ color: "var(--color-ink-soft)" }}>Compu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Páginas */}
          <div className={`fade-up fade-up-6 rounded-2xl p-4 ${show ? "" : "opacity-0"}`} style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}>
            <p className="font-semibold text-sm mb-4">Páginas más visitadas</p>
            {topPages.length === 0 ? (
              <p className="text-sm py-6 text-center" style={{ color: "var(--color-ink-soft)" }}>Todavía no hay datos. Se empiezan a registrar desde ahora.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {topPages.map((p, i) => {
                  const barPct = topPages[0].count > 0 ? (p.count / topPages[0].count) * 100 : 0;
                  const name = PAGE_NAMES[p.path] || p.path;
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div key={p.path} className="relative rounded-xl overflow-hidden px-4 py-3" style={{ background: "var(--color-surface-2)" }}>
                      <div
                        className="absolute inset-y-0 left-0 rounded-xl"
                        style={{
                          width: `${barPct}%`,
                          background: i === 0 ? "rgba(245,130,32,.15)" : "rgba(245,130,32,.07)",
                          transition: "width 1s ease",
                        }}
                      />
                      <div className="relative flex items-center gap-3">
                        <span className="text-lg">{medals[i] || `#${i + 1}`}</span>
                        <span className="flex-1 text-sm font-medium truncate">{name}</span>
                        <span className="font-display font-bold text-lg tabular-nums" style={{ color: "var(--color-accent)" }}>
                          <AnimatedNumber value={p.count} duration={800} />
                        </span>
                        <span className="text-xs" style={{ color: "var(--color-ink-soft)" }}>visitas</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lo más pedido */}
          <div className={`fade-up fade-up-6 rounded-2xl p-4 mt-4 ${show ? "" : "opacity-0"}`} style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}>
            <p className="font-semibold text-sm">Lo más pedido</p>
            <p className="text-xs mb-4" style={{ color: "var(--color-ink-soft)" }}>Qué se llevan tus clientes, de todos los pedidos</p>
            {topProductos.length === 0 ? (
              <p className="text-sm py-6 text-center" style={{ color: "var(--color-ink-soft)" }}>
                Todavía no hay pedidos. Cuando alguien mande uno por WhatsApp aparece acá.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {topProductos.map((p, i) => {
                  const barPct = topProductos[0].qty > 0 ? (p.qty / topProductos[0].qty) * 100 : 0;
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div key={p.name} className="relative rounded-xl overflow-hidden px-4 py-3" style={{ background: "var(--color-surface-2)" }}>
                      <div
                        className="absolute inset-y-0 left-0 rounded-xl"
                        style={{ width: `${barPct}%`, background: i === 0 ? "rgba(245,130,32,.15)" : "rgba(245,130,32,.07)", transition: "width 1s ease" }}
                      />
                      <div className="relative flex items-center gap-3">
                        <span className="text-lg shrink-0">{medals[i] || `#${i + 1}`}</span>
                        <span className="flex-1 text-sm font-medium truncate">{p.name}</span>
                        <span className="text-xs whitespace-nowrap hidden sm:inline" style={{ color: "var(--color-ink-soft)" }}>
                          {formatPrice(p.revenue)}
                        </span>
                        <span className="font-display font-bold text-lg tabular-nums" style={{ color: "var(--color-accent)" }}>
                          <AnimatedNumber value={p.qty} duration={800} />
                        </span>
                        <span className="text-xs whitespace-nowrap" style={{ color: "var(--color-ink-soft)" }}>{p.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Últimos pedidos */}
          {orders.length > 0 && (
            <div className={`fade-up fade-up-6 rounded-2xl p-4 mt-4 ${show ? "" : "opacity-0"}`} style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}>
              <p className="font-semibold text-sm">Últimos pedidos</p>
              <p className="text-xs mb-4" style={{ color: "var(--color-ink-soft)" }}>Lo que armó cada cliente antes de mandarlo</p>
              <div className="flex flex-col gap-2">
                {orders.slice(0, 8).map((o) => (
                  <div key={o.id} className="rounded-xl px-4 py-3" style={{ background: "var(--color-surface-2)" }}>
                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                      <span className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
                        {new Date(o.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="font-display font-bold tabular-nums" style={{ color: "var(--color-accent)" }}>
                        {formatPrice(o.total)}
                      </span>
                    </div>
                    <p className="text-sm leading-snug">
                      {(o.items || []).map((it) => `${it.qty}× ${it.name}`).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
