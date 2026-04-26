// Streaming chat endpoint scoped to the GTM book content.
// Uses OpenAI gpt-4o-mini directly (per builder choice) with SSE streaming.
//
// Required secrets:
//   OPENAI_API_KEY

import { BOOK_CONTENT, BOOK_AVAILABLE } from "./_book-content.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return json({ error: "Missing messages" }, 400);
  }

  const messages: ChatMessage[] = [];
  for (const m of body.messages as unknown[]) {
    if (
      m &&
      typeof m === "object" &&
      ((m as ChatMessage).role === "user" ||
        (m as ChatMessage).role === "assistant") &&
      typeof (m as ChatMessage).content === "string"
    ) {
      messages.push({
        role: (m as ChatMessage).role,
        content: (m as ChatMessage).content.slice(0, 4000),
      });
    }
  }
  if (messages.length === 0) return json({ error: "No valid messages" }, 400);
  const trimmed = messages.slice(-20);

  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  if (!OPENAI_API_KEY) {
    console.error("book-chat: OPENAI_API_KEY missing");
    return json({ error: "Server not configured" }, 500);
  }

  let openaiResp: Response;
  try {
    openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 600,
        temperature: 0.5,
        stream: true,
        messages: [
          { role: "system", content: baseSystem },
          ...trimmed,
        ],
      }),
    });
  } catch (e) {
    console.error("book-chat: openai fetch failed", e);
    return json({ error: "AI request failed" }, 502);
  }

  if (openaiResp.status === 429) {
    return json({ error: "Rate limited, please try again." }, 429);
  }
  if (openaiResp.status === 402 || openaiResp.status === 403) {
    return json({ error: "Out of credits or unauthorized." }, 402);
  }
  if (!openaiResp.ok) {
    const t = await openaiResp.text();
    console.error("book-chat: openai error", openaiResp.status, t);
    return json({ error: "AI request failed" }, 502);
  }

  // Pass the SSE stream through to the client.
  return new Response(openaiResp.body, {
    headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
  });
});
