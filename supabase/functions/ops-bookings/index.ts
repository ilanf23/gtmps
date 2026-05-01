// Bookings list from magnet_call_bookings.
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
    const { data, error, count } = await supabase
      .from("magnet_call_bookings")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return opsJson({ rows: data ?? [], total: count ?? 0 });
  } catch (e) {
    console.error("ops-bookings error", e);
    return opsJson({ error: "internal error" }, 500);
  }
});
