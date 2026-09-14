"use client";

import { useEffect, useState } from "react";
import { Users, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/config";

interface Client {
  id: string;
  phone: string;
  name: string | null;
  localidad: string | null;
  created_at: string;
}

interface Order {
  id: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: string;
  created_at: string;
}

export default function AdminClients() {
  const supabase = createClient();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [orders, setOrders] = useState<Record<string, Order[]>>({});
  const [loadingOrders, setLoadingOrders] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    setClients(data || []);
    setLoading(false);
  }

  async function toggleOrders(clientId: string) {
    if (expandedClient === clientId) {
      setExpandedClient(null);
      return;
    }
    setExpandedClient(clientId);

    if (!orders[clientId]) {
      setLoadingOrders(clientId);
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      setOrders((prev) => ({ ...prev, [clientId]: data || [] }));
      setLoadingOrders(null);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6" style={{ color: "var(--color-accent)" }} />
        <h1 className="font-display font-bold text-2xl uppercase tracking-wide">Clientes</h1>
        <span
          className="ml-auto text-sm font-medium px-3 py-1 rounded-full"
          style={{ background: "var(--color-surface-2)", color: "var(--color-ink-soft)" }}
        >
          {clients.length} registrados
        </span>
      </div>

      {loading ? (
        <div className="text-center py-16" style={{ color: "var(--color-ink-soft)" }}>
          Cargando clientes...
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--color-ink-soft)" }}>
          <p className="text-3xl mb-3">👥</p>
          <p className="font-medium">Todavía no hay clientes registrados.</p>
          <p className="text-sm mt-1">Los clientes se registran cuando usan el asistente del sitio.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {clients.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
            >
              <button
                onClick={() => toggleOrders(c.id)}
                className="w-full flex items-center gap-4 px-4 py-3 border-0 bg-transparent text-left"
                style={{ color: "var(--color-ink)" }}
              >
                <div
                  className="w-10 h-10 rounded-full grid place-items-center text-white font-bold text-sm shrink-0"
                  style={{ background: "var(--color-navy)" }}
                >
                  {(c.name || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{c.name || "Sin nombre"}</p>
                  <p className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
                    {c.localidad || "Sin localidad"} &middot; {c.phone.startsWith("web_") ? "Registrado por web" : c.phone}
                  </p>
                </div>
                <span className="text-xs shrink-0" style={{ color: "var(--color-ink-soft)" }}>
                  {new Date(c.created_at).toLocaleDateString("es-AR")}
                </span>
                {expandedClient === c.id ? (
                  <ChevronUp className="w-4 h-4 shrink-0" style={{ color: "var(--color-ink-soft)" }} />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "var(--color-ink-soft)" }} />
                )}
              </button>

              {expandedClient === c.id && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--color-line)" }}>
                  {loadingOrders === c.id ? (
                    <p className="text-xs py-3" style={{ color: "var(--color-ink-soft)" }}>Cargando pedidos...</p>
                  ) : !orders[c.id] || orders[c.id].length === 0 ? (
                    <p className="text-xs py-3" style={{ color: "var(--color-ink-soft)" }}>Sin pedidos registrados.</p>
                  ) : (
                    <div className="flex flex-col gap-2 pt-3">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-ink-soft)" }}>
                        <ShoppingBag className="w-3 h-3 inline mr-1" />
                        Pedidos ({orders[c.id].length})
                      </p>
                      {orders[c.id].map((o) => (
                        <div
                          key={o.id}
                          className="rounded-lg p-3 text-xs"
                          style={{ background: "var(--color-surface-2)" }}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">
                              {new Date(o.created_at).toLocaleDateString("es-AR")} — {formatPrice(o.total)}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase"
                              style={{
                                background: o.status === "enviado" ? "rgba(245,130,32,.15)" : "rgba(34,197,94,.15)",
                                color: o.status === "enviado" ? "var(--color-accent)" : "#22c55e",
                              }}
                            >
                              {o.status}
                            </span>
                          </div>
                          <ul className="list-none p-0 m-0">
                            {o.items.map((item, i) => (
                              <li key={i} style={{ color: "var(--color-ink-soft)" }}>
                                {item.qty} x {item.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
