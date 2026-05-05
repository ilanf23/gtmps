const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BOT_UA = /facebookexternalhit|linkedinbot|slackbot|twitterbot|whatsapp|telegrambot|discordbot|googlebot|bingbot|applebot/i;

const HTML = (origin: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Pepper Group. Market Activation Profile | Mabbly</title>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="Pepper Group. Market Activation Profile | Mabbly"/>
  <meta property="og:description" content="A personalized market activation profile prepared for Tim Padgett &amp; George Couris by Mabbly."/>
  <meta property="og:image" content="${origin}/og-pepper-group.jpg"/>
  <meta property="og:url" content="${origin}/pepper-group"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="Pepper Group. Market Activation Profile | Mabbly"/>
  <meta name="twitter:description" content="A personalized market activation profile prepared for Tim Padgett &amp; George Couris by Mabbly."/>
  <meta name="twitter:image" content="${origin}/og-pepper-group.jpg"/>
</head>
<body>
  <p>Redirecting…</p>
  <script>window.location.replace("${origin}/pepper-group");</script>
</body>
</html>`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const ua = req.headers.get('user-agent') || '';
  const origin = req.headers.get('x-forwarded-host')
    ? `https://${req.headers.get('x-forwarded-host')}`
    : 'https://relationship-revenue-os.lovable.app';

  if (BOT_UA.test(ua)) {
    return new Response(HTML(origin), {
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      status: 200,
    });
  }

  return new Response(null, {
    status: 302,
    headers: { ...corsHeaders, Location: `${origin}/pepper-group` },
  });
});
