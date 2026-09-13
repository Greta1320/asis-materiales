export const STORE = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || "Asís Materiales",
  tagline: process.env.NEXT_PUBLIC_STORE_TAGLINE || "Corralón & Construcción",
  wspNumber: process.env.NEXT_PUBLIC_WSP_NUMBER || "5490000000000",
};

export function formatPrice(n: number): string {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}
