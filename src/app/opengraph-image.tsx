import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Asís Materiales — Ferretería y Corralón";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0c2461 0%, #1a3a7a 50%, #0c2461 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Icon */}
        <div
          style={{
            display: "flex",
            width: 100,
            height: 100,
            borderRadius: 20,
            background: "rgba(255,255,255,0.15)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="56"
            height="56"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21h18" />
            <path d="M5 21V10l7-5 7 5v11" />
            <path d="M9 21v-6h6v6" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#f58220",
              letterSpacing: "-1px",
            }}
          >
            ASÍS
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            MATERIALES
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.8)",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          Ferretería & Corralón
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 4,
            background: "#f58220",
            borderRadius: 2,
            marginBottom: 30,
          }}
        />

        {/* Location */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          San Francisco del Monte de Oro, San Luis
        </div>
      </div>
    ),
    { ...size }
  );
}
