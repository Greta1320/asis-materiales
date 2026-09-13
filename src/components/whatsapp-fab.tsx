"use client";

import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/config";

interface WhatsAppFABProps {
  onOpenCart: () => void;
}

export function WhatsAppFAB({ onOpenCart }: WhatsAppFABProps) {
  const { count, total } = useCart();

  return (
    <button
      onClick={onOpenCart}
      className="fixed bottom-5 right-5 z-40 rounded-full flex items-center gap-2 font-semibold text-[15px] text-white px-5 py-3.5 transition-transform hover:scale-105 active:scale-95"
      style={{ background: "var(--color-wsp)", boxShadow: "0 6px 20px rgba(0,0,0,.22)" }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .8-.2 1.4Z" />
      </svg>
      {count > 0 ? `Pedir · ${formatPrice(total)}` : "Pedir"}
    </button>
  );
}
