"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, HardHat } from "lucide-react";
import { buildGeneralURL } from "@/lib/whatsapp";

interface Message {
  id: string;
  from: "bot" | "user";
  text: string;
  buttons?: QuickButton[];
}

interface QuickButton {
  label: string;
  emoji: string;
  action: string; // key en RESPONSES, o "whatsapp"
}

// ====== BASE DE CONOCIMIENTO DEL BOT ======
const QUICK_BUTTONS: QuickButton[] = [
  { label: "Precios y stock", emoji: "💰", action: "precios" },
  { label: "Envíos", emoji: "🚚", action: "envios" },
  { label: "Formas de pago", emoji: "💳", action: "pagos" },
  { label: "Horarios", emoji: "🕗", action: "horarios" },
  { label: "Calculadora de obra", emoji: "🧮", action: "calculadora" },
  { label: "Hablar con un asesor", emoji: "👷", action: "whatsapp" },
];

const RESPONSES: Record<string, { text: string; followUp?: QuickButton[] }> = {
  precios: {
    text: "Los precios que ves en el catálogo son de referencia. Para confirmar precio actualizado y stock, lo mejor es que nos mandes tu lista por WhatsApp y te respondemos al toque.\n\n👉 Tip: podés armar tu pedido acá mismo y enviarlo con el botón verde del carrito.",
    followUp: [
      { label: "Consultar por WhatsApp", emoji: "💬", action: "whatsapp" },
      { label: "Otra consulta", emoji: "🔄", action: "menu" },
    ],
  },
  envios: {
    text: "¡Hacemos envíos a domicilio! 🚚\n\n• El costo depende de la zona y el volumen del pedido.\n• Coordinamos día y hora por WhatsApp.\n• También podés retirar en el corralón.\n\n¿Querés coordinar un envío?",
    followUp: [
      { label: "Coordinar envío", emoji: "📦", action: "whatsapp" },
      { label: "Otra consulta", emoji: "🔄", action: "menu" },
    ],
  },
  pagos: {
    text: "Aceptamos varias formas de pago:\n\n• 💵 Efectivo\n• 🏦 Transferencia bancaria\n• 💳 Tarjeta de débito\n• 📱 Mercado Pago\n\nPara pagos con tarjeta de crédito o cuotas, consultanos por WhatsApp.",
    followUp: [
      { label: "Consultar cuotas", emoji: "💳", action: "whatsapp" },
      { label: "Otra consulta", emoji: "🔄", action: "menu" },
    ],
  },
  horarios: {
    text: "📍 Nuestros horarios de atención:\n\n• Lunes a Viernes: 8:00 a 13:00 / 15:00 a 19:00\n• Sábados: 9:00 a 13:00\n• Domingos: cerrado\n\n📌 Centenario s/n, San Francisco del Monte de Oro, San Luis\n\n¡Te esperamos!",
    followUp: [
      { label: "Cómo llegar", emoji: "📍", action: "whatsapp" },
      { label: "Otra consulta", emoji: "🔄", action: "menu" },
    ],
  },
  calculadora: {
    text: "🧮 Calculadoras rápidas de obra:\n\n🧱 Ladrillos por m²:\n→ Hueco 18x18x33: ~16 unidades/m²\n→ Hueco 12x18x33: ~16 unidades/m²\n→ Común: ~65 unidades/m²\n\n🧱 Cemento por m³ de hormigón:\n→ ~8 bolsas de 50kg (o 16 de 25kg)\n\n🧱 Arena + piedra por m³:\n→ 0.65m³ arena gruesa + 0.65m³ piedra\n\n¿Necesitás que te calculemos para tu obra en particular?",
    followUp: [
      { label: "Calcular para mi obra", emoji: "📐", action: "whatsapp" },
      { label: "Otra consulta", emoji: "🔄", action: "menu" },
    ],
  },
  menu: {
    text: "¿En qué más te puedo ayudar? 👇",
  },
  fallback: {
    text: "¡Buena pregunta! Para darte una respuesta precisa, lo mejor es que hables con uno de nuestros asesores por WhatsApp. ¿Te paso?",
    followUp: [
      { label: "Sí, pasame", emoji: "👷", action: "whatsapp" },
      { label: "Ver opciones", emoji: "🔄", action: "menu" },
    ],
  },
};

const WELCOME: Message = {
  id: "welcome",
  from: "bot",
  text: "¡Hola! 👋 Soy el asistente de Asís Materiales.\n\n¿En qué te puedo ayudar?",
  buttons: QUICK_BUTTONS,
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  function addBotMessage(key: string) {
    const data = RESPONSES[key] || RESPONSES.fallback;
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          from: "bot",
          text: data.text,
          buttons: data.followUp || (key === "menu" ? QUICK_BUTTONS : undefined),
        },
      ]);
      setTyping(false);
    }, 600 + Math.random() * 400);
  }

  function handleButton(btn: QuickButton) {
    if (btn.action === "whatsapp") {
      window.open(buildGeneralURL(), "_blank");
      return;
    }
    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), from: "user", text: `${btn.emoji} ${btn.label}` },
    ]);
    addBotMessage(btn.action);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { id: Date.now().toString(), from: "user", text }]);

    // Simple keyword matching
    const q = text.toLowerCase();
    if (/precio|stock|cuant|cost/.test(q)) addBotMessage("precios");
    else if (/envi|envío|flete|domicilio|llegan/.test(q)) addBotMessage("envios");
    else if (/pago|tarjeta|transfer|mercado|cuota|efectivo/.test(q)) addBotMessage("pagos");
    else if (/hora|abren|cierr|sábado|domingo|lunes/.test(q)) addBotMessage("horarios");
    else if (/calcul|cuant.*ladrillo|cuant.*cement|m2|metro/.test(q)) addBotMessage("calculadora");
    else addBotMessage("fallback");
  }

  return (
    <>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 text-white font-medium text-[13px] transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: "var(--color-navy)", boxShadow: "var(--shadow-md)" }}
          aria-label="Abrir asistente de ayuda"
        >
          <HardHat className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
          ¿Te ayudamos?
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-5 left-5 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: "min(380px, calc(100vw - 40px))",
            height: "min(520px, calc(100vh - 120px))",
            background: "var(--color-surface)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--color-line)",
          }}
        >
          {/* Header */}
          <header
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ background: "var(--color-navy)" }}
          >
            <span
              className="w-9 h-9 rounded-full grid place-items-center text-white"
              style={{ background: "var(--color-accent)" }}
            >
              <HardHat className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">Asistente Asís</p>
              <p className="text-white/60 text-xs">Respuestas al instante</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-lg grid place-items-center border-0 text-white/70 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,.1)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ background: "var(--color-surface-2)" }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.from === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-line ${
                    msg.from === "user" ? "rounded-br-md" : "rounded-bl-md"
                  }`}
                  style={{
                    background: msg.from === "user" ? "var(--color-navy)" : "var(--color-surface)",
                    color: msg.from === "user" ? "#fff" : "var(--color-ink)",
                    boxShadow: msg.from === "bot" ? "0 1px 3px rgba(0,0,0,.06)" : "none",
                  }}
                >
                  {msg.text}
                </div>
                {msg.buttons && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.buttons.map((btn) => (
                      <button
                        key={btn.action + btn.label}
                        onClick={() => handleButton(btn)}
                        className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border-2 transition-all hover:border-[var(--color-accent)]"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-line)",
                          color: "var(--color-ink)",
                        }}
                      >
                        <span>{btn.emoji}</span> {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex items-start">
                <div
                  className="rounded-2xl rounded-bl-md px-4 py-3 text-sm"
                  style={{ background: "var(--color-surface)", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}
                >
                  <span className="flex gap-1">
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--color-accent)", animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--color-accent)", animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--color-accent)", animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 px-3 py-3 border-t shrink-0"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu consulta…"
              className="flex-1 bg-transparent border-0 outline-none text-sm px-1"
              style={{ color: "var(--color-ink)" }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl grid place-items-center border-0 text-white transition-all disabled:opacity-30"
              style={{ background: "var(--color-navy)" }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
