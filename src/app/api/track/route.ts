import { createServerSupabase } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();
    if (!path) return NextResponse.json({ ok: false }, { status: 400 });

    const ua = req.headers.get("user-agent") || "";
    const device = /mobile|android|iphone/i.test(ua) ? "mobile" : "desktop";

    const supabase = await createServerSupabase();
    await supabase.from("page_views").insert({ path, referrer: referrer || null, device });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
