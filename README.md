# Asís Materiales — Catálogo Web + Admin + WhatsApp

Sitio web para corralón de materiales de construcción.  
El dueño carga productos con foto y precio desde un panel admin, y los clientes arman pedidos que se envían por WhatsApp.

## Stack

- **Next.js 16** (App Router + TypeScript)
- **Supabase** (base de datos, auth, storage de fotos)
- **Tailwind CSS v4**
- **Lucide React** (iconos)

## Setup rápido

### 1. Crear proyecto en Supabase (gratis)

1. Ir a [supabase.com](https://supabase.com) → New Project
2. Copiar la **URL** y la **anon key** (Settings → API)
3. Ir a **SQL Editor** y pegar el contenido de `supabase-schema.sql` → Run
4. Ir a **Authentication → Users** → crear un usuario admin (email + contraseña)

### 2. Configurar las variables de entorno

Editar `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
NEXT_PUBLIC_WSP_NUMBER=549XXXXXXXXXX
NEXT_PUBLIC_STORE_NAME=Asís Materiales
NEXT_PUBLIC_STORE_TAGLINE=Corralón & Construcción
```

### 3. Instalar y correr

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

### 4. Deploy en Vercel (gratis)

```bash
npx vercel
```

O conectar el repo de GitHub en [vercel.com](https://vercel.com) → Import → configurar las env vars.

## Estructura

```
src/
├── app/
│   ├── page.tsx              # Catálogo público (SSR + datos demo)
│   ├── catalog-client.tsx    # Catálogo interactivo (cliente)
│   ├── login/page.tsx        # Login del admin
│   ├── admin/
│   │   ├── layout.tsx        # Layout del admin (sidebar + navbar mobile)
│   │   ├── page.tsx          # CRUD de productos (crear, editar, eliminar, fotos)
│   │   └── categories/       # CRUD de categorías
│   ├── layout.tsx            # Layout raíz (fonts + CartProvider)
│   └── globals.css           # Tokens de color + dark mode
├── components/
│   ├── header.tsx            # Header con buscador y carrito
│   ├── footer.tsx            # Footer con contacto
│   ├── product-card.tsx      # Tarjeta de producto
│   ├── category-chips.tsx    # Filtros de categoría
│   ├── cart-drawer.tsx       # Carrito lateral → WhatsApp
│   └── whatsapp-fab.tsx      # Botón flotante WhatsApp
├── lib/
│   ├── supabase/             # Clientes Supabase (browser, server, middleware)
│   ├── cart.tsx              # Estado del carrito (Context + localStorage)
│   ├── whatsapp.ts           # Generador de mensajes WhatsApp
│   ├── config.ts             # Config del negocio
│   └── types.ts              # TypeScript interfaces
└── middleware.ts              # Protección de rutas /admin
```

## Funcionalidades

### Público (clientes)
- ✅ Catálogo con fotos, precios y categorías
- ✅ Búsqueda de productos
- ✅ Filtro por categoría
- ✅ Carrito de pedidos → envío por WhatsApp
- ✅ Consulta de disponibilidad por WhatsApp
- ✅ Responsive (mobile + desktop)
- ✅ Dark mode automático

### Admin (dueño del corralón)
- ✅ Login protegido
- ✅ Crear / editar / eliminar productos
- ✅ Subir fotos desde el celular
- ✅ Marcar stock / sin stock
- ✅ Marcar productos destacados
- ✅ Crear / editar / eliminar categorías

### Próximos pasos (Fase 2)
- 🔲 Chatbot en la web que responda consultas en vivo
- 🔲 Importar productos por CSV
- 🔲 Notificaciones de pedidos
- 🔲 Analytics de productos más consultados
