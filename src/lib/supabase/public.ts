import { createClient } from "@supabase/supabase-js";

// Cookie-less client for public, cacheable reads (SEO pages, sitemap).
// Using the cookie-based server client here would force dynamic rendering.
export function createPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
