// Detail view for one slug: full submission + breakdown + recent views/shares.
import { createClient } from "npm:@supabase/supabase-js@2";
import { opsCorsHeaders, opsJson, requireOpsAuth } from "../_shared/ops-auth.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: opsCorsHeaders });
  const authFail = requireOpsAuth(req);
  if (authFail) return authFail;

  try {
    const url = new URL(req.url);
    const slug = (url.searchParams.get("slug") ?? "").trim();
    if (!slug) return opsJson({ error: "missing slug" }, 400);

    const [submission, breakdown, views, shares, emails, booking] = await Promise.all([
      supabase.from("magnet_submissions").select("*").eq("slug", slug).maybeSingle(),
      supabase.from("magnet_breakdowns").select("*").eq("slug", slug).maybeSingle(),
      supabase.from("magnet_views").select("*").eq("slug", slug).order("viewed_at", { ascending: false }).limit(20),
      supabase.from("magnet_share_events").select("*").eq("slug", slug).order("created_at", { ascending: false }).limit(20),
      supabase.from("magnet_emails").select("*").eq("source_slug", slug).order("captured_at", { ascending: false }).limit(20),
      supabase.from("magnet_call_bookings").select("*").eq("slug", slug).maybeSingle(),
    ]);

    return opsJson({
      submission: submission.data,
      breakdown: breakdown.data,
      views: views.data ?? [],
      shares: shares.data ?? [],
      emails: emails.data ?? [],
      booking: booking.data,
    });
  } catch (e) {
    console.error("ops-microsite-detail error", e);
    return opsJson({ error: "internal error" }, 500);
  }
});
