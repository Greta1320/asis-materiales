import type { CartItem } from "./types";

const WSP_NUMBER = process.env.NEXT_PUBLIC_WSP_NUMBER || "5490000000000";
const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Asís Materiales";

function formatPrice(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-AR");
}

export function buildWhatsAppURL(items: CartItem[]): string {
  if (items.length === 0) return "";

  let msg = `¡Hola *${STORE_NAME}*! 👷 Quiero consultar por este pedido:\n\n`;
  let total = 0;

  items.forEach(({ product, qty }) => {
    const subtotal = product.price * qty;
    total += subtotal;
    msg += `• ${qty} × ${product.name} — ${formatPrice(subtotal)}\n`;
  });

  msg += `\n*Total de referencia: ${formatPrice(total)}*\n\n`;
  msg += `Mi nombre: \nZona de entrega / retiro en corralón: \nForma de pago: `;

  return `https://wa.me/${WSP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function buildInquiryURL(productName: string): string {
  const msg = `¡Hola *${STORE_NAME}*! Quiero consultar por: *${productName}*.\n¿Tienen stock? ¿Cuál es el precio actualizado?`;
  return `https://wa.me/${WSP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function buildGeneralURL(): string {
  const msg = `¡Hola *${STORE_NAME}*! Quiero hacer una consulta.`;
  return `https://wa.me/${WSP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
