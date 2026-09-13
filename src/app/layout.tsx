import type { Metadata } from "next";
import { Barlow, Barlow_Semi_Condensed } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowSC = Barlow_Semi_Condensed({
  variable: "--font-barlow-sc",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Asís Materiales — Corralón & Construcción",
    template: "%s | Asís Materiales",
  },
  description:
    "Catálogo de materiales para la construcción. Consultá precios, armá tu pedido y enviánoslo por WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${barlow.variable} ${barlowSC.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
