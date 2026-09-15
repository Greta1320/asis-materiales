"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { STORE } from "@/lib/config";
import { LogoIcon } from "@/components/logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="min-h-screen grid place-items-center px-4" style={{ background: "var(--color-bg)" }}>
      <div
        className="w-full max-w-sm rounded-2xl p-8 border"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-line)",
          boxShadow: "0 1px 2px rgba(30,25,18,.06),0 8px 24px rgba(30,25,18,.07)",
        }}
      >
        <div className="text-center mb-6">
          <span className="inline-block mb-3">
            <LogoIcon size={56} />
          </span>
          <h1 className="font-display font-bold text-xl uppercase tracking-wide">
            <span style={{ color: "var(--color-accent)" }}>Asís</span> Materiales
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink-soft)" }}>Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--color-ink-soft)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl px-3 py-3 text-sm border outline-none transition-colors focus:border-[var(--color-accent)]"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-line)", color: "var(--color-ink)" }}
              placeholder="admin@asismateriales.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide" style={{ color: "var(--color-ink-soft)" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl px-3 py-3 text-sm border outline-none transition-colors focus:border-[var(--color-accent)]"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-line)", color: "var(--color-ink)" }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 font-bold text-sm uppercase tracking-wide border-0 transition-opacity disabled:opacity-50"
            style={{ background: "var(--color-brand)", color: "var(--color-brand-ink)" }}
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="text-xs text-center mt-5" style={{ color: "var(--color-ink-soft)" }}>
          ¿No tenés cuenta? Pedile al desarrollador que te la cree en Supabase.
        </p>
      </div>
    </div>
  );
}
