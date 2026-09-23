"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, HardHat, Camera } from "lucide-react";
import { buildGeneralURL } from "@/lib/whatsapp";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  from: "bot" | "user";
  text: string;
  image?: string;
  buttons?: QuickButton[];
}

interface QuickButton {
  label: string;
  emoji: string;
  value: string;
}

interface ClientInfo {
  phone: string;
  name: string;
  localidad: string;
}

const QUICK_BUTTONS: QuickButton[] = [
  { label: "Precios y stock", emoji: "💰", value: "Quiero consultar precios y stock" },
  { label: "Envíos", emoji: "🚚", value: "¿Hacen envíos a domicilio?" },
  { label: "Formas de pago", emoji: "💳", value: "¿Qué formas de pago aceptan?" },
  { label: "Horarios", emoji: "🕗", value: "¿Cuáles son los horarios de atención?" },
  { label: "Calculadora de obra", emoji: "🧮", value: "Necesito ayuda para calcular materiales para mi obra" },
  { label: "Hablar con asesor", emoji: "👷", value: "__whatsapp__" },
];

const CLIENT_STORAGE_KEY = "asis_client";

function getStoredClient(): ClientInfo | null {
  try {
    const raw = localStorage.getItem(CLIENT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeClient(client: ClientInfo) {
  try {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(client));
  } catch {}
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [registrationStep, setRegistrationStep] = useState<"idle" | "name" | "localidad" | "done">("idle");
  const [pendingName, setPendingName] = useState("");
  const [awaitingPhone, setAwaitingPhone] = useState(false);
  const pendingConsulta = useRef<string>("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<{ role: string; text: string }[]>([]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const stored = getStoredClient();
    if (stored) {
      setClient(stored);
      setRegistrationStep("done");
    }
  }, []);

  const addMessage = useCallback((msg: Omit<Message, "id">) => {
    setMessages((prev) => [...prev, { ...msg, id: Date.now().toString() + Math.random() }]);
  }, []);

  function initChat() {
    const stored = getStoredClient();
    if (stored) {
      setClient(stored);
      setRegistrationStep("done");
      setMessages([
        {
          id: "welcome",
          from: "bot",
          text: `¡Hola ${stored.name}! 👋 Soy el asistente de Asís Materiales.\n\n¿En qué te puedo ayudar?`,
          buttons: QUICK_BUTTONS,
        },
      ]);
    } else {
      setRegistrationStep("name");
      setMessages([
        {
          id: "welcome",
          from: "bot",
          text: "¡Hola! 👋 Soy el asistente de Asís Materiales.\n\nPara brindarte una mejor atención, ¿cómo te llamás?",
        },
      ]);
    }
    historyRef.current = [];
  }

  function handleOpen() {
    setOpen(true);
    if (messages.length === 0) initChat();
  }

  async function registerClient(phone: string, name: string, localidad: string) {
    const info: ClientInfo = { phone, name, localidad };
    setClient(info);
    storeClient(info);
    setRegistrationStep("done");

    try {
      const supabase = createClient();
      await supabase.from("clients").upsert({ phone, name, localidad }, { onConflict: "phone" });
    } catch {}
  }

  function hasRealPhone(c: ClientInfo | null): boolean {
    return !!c?.phone && !c.phone.startsWith("web_");
  }

  async function saveConsulta(pregunta: string, telefono: string) {
    try {
      const supabase = createClient();
      await supabase.from("consultas").insert({
        pregunta,
        nombre: client?.name || null,
        telefono,
        localidad: client?.localidad || null,
      });
      if (client && !hasRealPhone(client)) {
        const updated = { ...client, phone: telefono };
        setClient(updated);
        storeClient(updated);
        await supabase.from("clients").upsert({ ...updated }, { onConflict: "phone" });
      }
    } catch {}
  }

  /** Ask for a phone so Franco can answer, or save straight away if we already have one. */
  function startConsulta(pregunta: string) {
    pendingConsulta.current = pregunta;

    if (hasRealPhone(client)) {
      saveConsulta(pregunta, client!.phone);
      addMessage({
        from: "bot",
        text: "Listo, ya le pasé tu consulta a Franco. Te va a contactar al número que tenemos. 📩",
        buttons: [
          { label: "Otra consulta", emoji: "🔄", value: "__menu__" },
          { label: "Escribir por WhatsApp", emoji: "👷", value: "__whatsapp__" },
        ],
      });
      return;
    }

    setAwaitingPhone(true);
    addMessage({
      from: "bot",
      text: "¿Me dejás tu número de teléfono así Franco te contacta? 📱\n\nSi preferís, escribinos directo por WhatsApp.",
      buttons: [{ label: "Mejor por WhatsApp", emoji: "👷", value: "__whatsapp__" }],
    });
  }

  async function sendToAI(userMessage: string, imageBase64?: string) {
    setTyping(true);

    historyRef.current.push({ role: "user", text: userMessage });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          image: imageBase64,
          history: historyRef.current.slice(-10),
        }),
      });

      const data = await res.json();
      const reply = data.reply || "Disculpá, no pude procesar tu consulta. Probá de nuevo o consultá por WhatsApp.";

      historyRef.current.push({ role: "assistant", text: reply });

      addMessage({
        from: "bot",
        text: reply,
        buttons: data.needsConsulta
          ? [{ label: "Hablar con asesor", emoji: "👷", value: "__whatsapp__" }]
          : [
              { label: "Otra consulta", emoji: "🔄", value: "__menu__" },
              { label: "Que me contacte Franco", emoji: "📩", value: "__consulta__" },
              { label: "Hablar con asesor", emoji: "👷", value: "__whatsapp__" },
            ],
      });

      if (data.needsConsulta) startConsulta(userMessage);
    } catch {
      addMessage({
        from: "bot",
        text: "Ups, hubo un error de conexión. Intentá de nuevo o consultá por WhatsApp al 2664-369625. 📱",
      });
    } finally {
      setTyping(false);
    }
  }

  function handleButton(btn: QuickButton) {
    if (btn.value === "__whatsapp__") {
      window.open(buildGeneralURL(), "_blank");
      return;
    }
    if (btn.value === "__menu__") {
      addMessage({
        from: "bot",
        text: "¿En qué más te puedo ayudar? 👇",
        buttons: QUICK_BUTTONS,
      });
      return;
    }
    if (btn.value === "__consulta__") {
      const ultima = [...historyRef.current].reverse().find((h) => h.role === "user");
      addMessage({ from: "user", text: `${btn.emoji} ${btn.label}` });
      startConsulta(ultima?.text || "El cliente pidió que lo contacten desde el chat.");
      return;
    }
    addMessage({ from: "user", text: `${btn.emoji} ${btn.label}` });
    sendToAI(btn.value);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");

    if (awaitingPhone) {
      addMessage({ from: "user", text });
      const digits = text.replace(/\D/g, "");
      if (digits.length < 8) {
        addMessage({
          from: "bot",
          text: "Ese número no parece completo. Mandámelo con característica, por ejemplo 2664369625. 📱",
          buttons: [{ label: "Mejor por WhatsApp", emoji: "👷", value: "__whatsapp__" }],
        });
        return;
      }
      setAwaitingPhone(false);
      saveConsulta(pendingConsulta.current, digits);
      addMessage({
        from: "bot",
        text: "¡Gracias! Ya le pasé tu consulta a Franco junto con tu número. Te va a contactar. 📩",
        buttons: [
          { label: "Otra consulta", emoji: "🔄", value: "__menu__" },
          { label: "Escribir por WhatsApp", emoji: "👷", value: "__whatsapp__" },
        ],
      });
      return;
    }

    if (registrationStep === "name") {
      addMessage({ from: "user", text });
      setPendingName(text);
      setRegistrationStep("localidad");
      addMessage({
        from: "bot",
        text: `¡Mucho gusto, ${text}! 🙌\n¿De qué localidad sos? (ej: San Francisco, Luján, etc.)`,
      });
      return;
    }

    if (registrationStep === "localidad") {
      addMessage({ from: "user", text });
      const phone = `web_${Date.now()}`;
      registerClient(phone, pendingName, text);
      addMessage({
        from: "bot",
        text: `¡Listo, ${pendingName}! Ya te registré. 💪\n\nAhora podés consultarme lo que necesites sobre materiales, precios, stock, o mandarme una foto de lo que buscás.`,
        buttons: QUICK_BUTTONS,
      });
      return;
    }

    addMessage({ from: "user", text });
    sendToAI(text);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      addMessage({ from: "bot", text: "La imagen es muy pesada (máx 4MB). Intentá con una más chica." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      addMessage({ from: "user", text: "📷 Foto enviada", image: base64 });
      sendToAI("Identificá este material o producto de la foto. ¿Lo tienen en el catálogo?", base64);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  }

  return (
    <>
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 text-white font-medium text-[13px] transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: "var(--color-navy)", boxShadow: "var(--shadow-md)" }}
          aria-label="Abrir asistente de ayuda"
        >
          <HardHat className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
          ¿Te ayudamos?
        </button>
      )}

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
              <p className="text-white/60 text-xs">
                {typing ? "Escribiendo..." : "Respuestas con IA"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-lg grid place-items-center border-0 text-white/70 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,.1)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ background: "var(--color-surface-2)" }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.from === "user" ? "items-end" : "items-start"}`}>
                {msg.image && (
                  <div className="max-w-[75%] rounded-xl overflow-hidden mb-1">
                    <img src={msg.image} alt="Foto enviada" className="w-full h-auto max-h-40 object-cover" />
                  </div>
                )}
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
                        key={btn.value + btn.label}
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

          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 px-3 py-3 border-t shrink-0"
            style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
            />
            {registrationStep === "done" && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-9 h-9 rounded-xl grid place-items-center border-0 transition-all"
                style={{ background: "var(--color-surface-2)", color: "var(--color-ink-soft)" }}
                title="Enviar foto de material"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                registrationStep === "name"
                  ? "Tu nombre..."
                  : registrationStep === "localidad"
                    ? "Tu localidad..."
                    : "Escribí tu consulta…"
              }
              className="flex-1 bg-transparent border-0 outline-none text-sm px-1"
              style={{ color: "var(--color-ink)" }}
              disabled={typing}
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
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
