// Magnet feedback handler.
// Validates input and forwards to the configured email recipient.
//
// NOTE: Email delivery via Lovable's transactional email infrastructure is
// activated once an email sending domain is verified for this project.
// Until then, this function logs the submission server-side and returns
// success so the form UX works end-to-end. Once the domain is set up, swap
// the TODO block to call `send-transactional-email`.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RECIPIENT = "adam@mabbly.com";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

interface FeedbackBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  slug?: unknown;
}

function validate(body: FeedbackBody) {
  const errors: Record<string, string> = {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : null;

  if (!name) errors.name = "Required";
  if (name.length > 100) errors.name = "Max 100 chars";
  if (!email) errors.email = "Required";
  if (email.length > 255) errors.email = "Max 255 chars";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email";
  if (!message) errors.message = "Required";
  if (message.length > 2000) errors.message = "Max 2000 chars";

  return { errors, data: { name, email, message, slug } };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: FeedbackBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { errors, data } = validate(body);
  if (Object.keys(errors).length > 0) {
    return json({ error: "Validation failed", fields: errors }, 400);
  }

  const subject = `New magnet feedback from ${data.name}`;
  const textBody = [
    `From: ${data.name} <${data.email}>`,
    data.slug ? `Slug: ${data.slug}` : null,
    `Submitted: ${new Date().toISOString()}`,
    "",
    "Feedback:",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  // Try to deliver via Lovable's transactional email function if available.
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (SUPABASE_URL && SERVICE_KEY) {
    try {
      const resp = await fetch(
        `${SUPABASE_URL}/functions/v1/send-transactional-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
          body: JSON.stringify({
            to: RECIPIENT,
            subject,
            text: textBody,
            reply_to: data.email,
          }),
        },
      );
      if (resp.ok) {
        console.log("submit-feedback: email dispatched", { slug: data.slug });
        return json({ success: true });
      }
      // 404 = function not yet scaffolded; log and continue gracefully.
      console.warn(
        "submit-feedback: transactional email not delivered",
        resp.status,
        await resp.text(),
      );
    } catch (e) {
      console.warn("submit-feedback: transactional email failed", e);
    }
  }

  // Fallback, log the feedback so it's recoverable from edge function logs.
  console.log("submit-feedback received", {
    name: data.name,
    email: data.email,
    slug: data.slug,
    message: data.message,
  });

  return json({ success: true });
});
