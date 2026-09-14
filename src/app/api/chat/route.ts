import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerSupabase } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

const SYSTEM_PROMPT = `Sos el asistente virtual de Asís Materiales, una ferretería y corralón de materiales para la construcción ubicado en San Francisco del Monte de Oro, San Luis, Argentina.

DATOS DEL LOCAL:
- Dirección: Centenario s/n, San Francisco del Monte de Oro, San Luis (CP 5705)
- WhatsApp: 2664-369625
- Teléfono alternativo: 2651-426322
- Horarios: Lunes a Viernes 8:00 a 13:00 y 15:00 a 19:00 | Sábados 9:00 a 13:00 | Domingos cerrado
- Medios de pago: Efectivo, Transferencia, Débito, Mercado Pago
- Envíos a domicilio disponibles (consultar zona y costo por WhatsApp)

REGLAS:
1. Respondé siempre en español argentino, de forma amigable y concisa (máximo 2-3 oraciones).
2. Si te mandan una foto de un material, identificalo y decí si lo tenemos en el catálogo con nombre y precio.
3. Si no reconocés el producto o no está en el catálogo, sugerí que consulten por WhatsApp al 2664-369625.
4. Si preguntan por stock, precios o disponibilidad: respondé con la info del catálogo si la tenés, sino decí "Consultá stock actualizado por WhatsApp".
5. Si preguntan algo fuera del rubro (no relacionado a construcción/ferretería), redirigí amablemente: "Soy el asistente de Asís Materiales, solo puedo ayudarte con materiales de construcción y ferretería."
6. Nunca inventes precios ni productos que no estén en el catálogo.
7. Usá emojis con moderación (máximo 1-2 por mensaje).

CATÁLOGO ACTUAL:
{{CATALOG}}`;

async function buildCatalogContext(): Promise<string> {
  try {
    const supabase = await createServerSupabase();
    const { data: products } = await supabase
      .from("products")
      .select("name, price, unit, in_stock, categories(name)")
      .order("sort_order");

    if (!products || products.length === 0) {
      return `Cemento Portland CPC40 x 25kg — Avellaneda: $6.732/bolsa
Hidralit Cemento de Albañilería x 25kg: $5.655/bolsa
Cal Hidrat Extra x 25kg — Avellaneda: $4.480/bolsa
Cerámico Cerramiento 18x18x33: $675/unidad
Cerámico Cerramiento 12x18x33: $580/unidad
Cerámico Cerramiento 8x18x33: $480/unidad
Cerámico Doble Muro Termoeficiente 18x18x33: $850/unidad
Cerámico Portante 18x19x33: $920/unidad
Cerámico Portante 12x19x33: $780/unidad
Ladrillo Visto: $350/unidad
Hierro de Construcción — Barra x 12m: $6.003/barra
Alambre de Atar y Encofrar: $4.200/kg
Alambre Galvanizado: $5.100/kg
Block P-15: $420/unidad
Bloque Liso 19x19x39 Tabique: $550/unidad
Pegamento Cerámico Mapei Keraflor Plus x 25kg: $12.500/bolsa
Revoque Fino Mapei Planitop x 20kg: $9.800/bolsa
Aislante Espuma Aluminizado 10mm x 20mts: $45.900/rollo
Vigueta Pretensada (2.00 a 6.00 mts): $15.800/metro`;
    }

    return products
      .map((p) => {
        const cat = (p.categories as unknown as { name: string } | null)?.name || "";
        const stock = p.in_stock ? "" : " [SIN STOCK]";
        return `${p.name} (${cat}): $${Math.round(p.price).toLocaleString("es-AR")}/${p.unit}${stock}`;
      })
      .join("\n");
  } catch {
    return "(catálogo no disponible — sugerir WhatsApp para consultas)";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, image, history } = body as {
      message: string;
      image?: string;
      history?: { role: string; text: string }[];
    };

    if (!message && !image) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({
        reply: "El asistente está temporalmente fuera de servicio. Consultá por WhatsApp al 2664-369625. 📱",
      });
    }

    const catalog = await buildCatalogContext();
    const systemPrompt = SYSTEM_PROMPT.replace("{{CATALOG}}", catalog);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chatHistory = (history || []).map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.text }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Sistema: " + systemPrompt }] },
        { role: "model", parts: [{ text: "Entendido. Soy el asistente de Asís Materiales. ¿En qué puedo ayudarte?" }] },
        ...chatHistory,
      ],
    });

    const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [];

    if (message) {
      parts.push({ text: message });
    }

    if (image) {
      const base64Match = image.match(/^data:(.+);base64,(.+)$/);
      if (base64Match) {
        parts.push({
          inlineData: {
            mimeType: base64Match[1],
            data: base64Match[2],
          },
        });
        if (!message) {
          parts.push({ text: "¿Qué material es este? ¿Lo tienen?" });
        }
      }
    }

    const result = await chat.sendMessage(parts);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json({
      reply: "Ups, hubo un error. Intentá de nuevo o consultá por WhatsApp al 2664-369625. 📱",
    });
  }
}
