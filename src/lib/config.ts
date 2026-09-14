export const STORE = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || "Asís Materiales",
  tagline: process.env.NEXT_PUBLIC_STORE_TAGLINE || "Ferretería & Corralón",
  wspNumber: process.env.NEXT_PUBLIC_WSP_NUMBER || "5492664369625",
  phone: "2664-369625",
  phoneAlt: "2651-426322",
  address: "Centenario s/n, San Francisco del Monte de Oro",
  city: "San Francisco del Monte de Oro",
  province: "San Luis",
  postalCode: "5705",
  country: "Argentina",
  instagram: "https://www.instagram.com/asismateriales/",
  facebook: "https://www.facebook.com/AsisMateriales/",
  hours: {
    weekdays: "Lunes a Viernes: 8:00 a 13:00 / 15:00 a 19:00",
    saturday: "Sábados: 9:00 a 13:00",
    sunday: "Domingos: cerrado",
  },
};

export function formatPrice(n: number): string {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}
