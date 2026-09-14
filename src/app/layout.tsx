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
    default: "Asís Materiales — Ferretería y Corralón en San Francisco del Monte de Oro, San Luis",
    template: "%s | Asís Materiales",
  },
  description:
    "Ferretería y corralón de materiales para la construcción en San Francisco del Monte de Oro, San Luis. Cemento, hierro, ladrillos, áridos, pinturas, herramientas y más. Consultá precios y pedí por WhatsApp.",
  keywords: [
    "corralón", "materiales de construcción", "ferretería",
    "San Francisco del Monte de Oro", "San Luis", "Argentina",
    "cemento", "hierro", "ladrillos", "arena", "piedra",
    "pinturas", "herramientas", "caños", "sanitarios",
    "Asís Materiales", "corralón San Luis",
  ],
  authors: [{ name: "Asís Materiales" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Asís Materiales",
    title: "Asís Materiales — Ferretería y Corralón en San Francisco del Monte de Oro",
    description: "Materiales para la construcción, ferretería y corralón. Cemento, hierro, ladrillos, áridos, pinturas, herramientas. Pedí por WhatsApp.",
  },
  alternates: {
    canonical: "https://asismateriales.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HardwareStore",
  name: "Asís Materiales",
  description: "Ferretería y corralón de materiales para la construcción en San Francisco del Monte de Oro, San Luis.",
  url: "https://asismateriales.com",
  telephone: "+54-2664-369625",
  image: "https://asismateriales.com/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Centenario s/n",
    addressLocality: "San Francisco del Monte de Oro",
    addressRegion: "San Luis",
    postalCode: "5705",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -32.6,
    longitude: -66.12,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "13:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "15:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "13:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/asismateriales/",
    "https://www.facebook.com/AsisMateriales/",
  ],
  priceRange: "$$",
  currenciesAccepted: "ARS",
  paymentAccepted: "Efectivo, Transferencia, Débito, Mercado Pago",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${barlow.variable} ${barlowSC.variable} antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0c2461" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Asís Materiales" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
