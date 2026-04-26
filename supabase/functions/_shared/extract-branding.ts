// Lightweight, dependency-free brand extractor.
// Fetches a website's HTML and (optionally) its first inline/linked CSS,
// then derives a usable brand profile: logo, accent color, background,
// text color, font family.

export type BrandProfile = {
  logoUrl: string | null;
  brandColor: string | null;        // legacy: theme-color or primary tile color
  accentColor: string | null;       // best-guess primary brand accent
  backgroundColor: string | null;   // best-guess page background
  textColor: string | null;         // best-guess body text color
  fontFamily: string | null;        // primary heading/body font
  companyName: string | null;
  raw: {
    candidateColors: string[];
    sources: Record<string, string | null>;
  };
};

const EMPTY: BrandProfile = {
  logoUrl: null,
  brandColor: null,
  accentColor: null,
  backgroundColor: null,
  textColor: null,
  fontFamily: null,
  companyName: null,
  raw: { candidateColors: [], sources: {} },
};

function resolveUrl(maybeRelative: string, base: string): string | null {
  try {
    return new URL(maybeRelative, base).toString();
  } catch {
    return null;
  }
}

function pickAttr(html: string, regex: RegExp): string | null {
  const m = html.match(regex);
  return m && m[1] ? m[1].trim() : null;
}

function pickAllAttr(html: string, regex: RegExp): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  const r = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
  while ((m = r.exec(html)) !== null) {
    if (m[1]) out.push(m[1].trim());
  }
  return out;
}

// ---- Color helpers ----------------------------------------------------------

function normalizeHex(hex: string): string | null {
  let h = hex.trim().toLowerCase();
  if (!h.startsWith("#")) h = "#" + h;
  if (/^#[0-9a-f]{3}$/.test(h)) {
    h = "#" + h.slice(1).split("").map((c) => c + c).join("");
  }
  if (/^#[0-9a-f]{6}$/.test(h)) return h;
  if (/^#[0-9a-f]{8}$/.test(h)) return h.slice(0, 7); // drop alpha
  return null;
}

function rgbStringToHex(s: string): string | null {
  const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return null;
  const [r, g, b] = [m[1], m[2], m[3]].map((n) => Math.max(0, Math.min(255, parseInt(n, 10))));
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = normalizeHex(hex);
  if (!h) return null;
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  };
}

function relLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const srgb = [rgb.r, rgb.g, rgb.b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function chroma(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  return (max - min) / 255;
}

// Score a color for "brand accent" likelihood: avoid black/white/grays,
// prefer saturated colors.
function accentScore(hex: string, frequency: number): number {
  const lum = relLuminance(hex);
  const chr = chroma(hex);
  if (lum === null) return 0;
  // Penalize near-black, near-white, and grays heavily.
  if (chr < 0.15) return 0;
  if (lum < 0.04 || lum > 0.95) return 0;
  // Sweet spot luminance for accents (mid-range).
  const lumScore = 1 - Math.abs(lum - 0.45) * 1.2;
  return frequency * (chr * 1.5 + Math.max(0, lumScore));
}

function isLightColor(hex: string): boolean {
  const lum = relLuminance(hex);
  return lum !== null && lum > 0.6;
}

// ---- Color extraction -------------------------------------------------------

function extractAllColors(text: string): string[] {
  const out: string[] = [];
  // Hex
  const hexMatches = text.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
  for (const h of hexMatches) {
    const n = normalizeHex(h);
    if (n) out.push(n);
  }
  // rgb()/rgba()
  const rgbMatches = text.match(/rgba?\([^)]+\)/gi) ?? [];
  for (const r of rgbMatches) {
    const n = rgbStringToHex(r);
    if (n) out.push(n);
  }
  return out;
}

function frequency(values: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
  return m;
}

// ---- Logo extraction --------------------------------------------------------

function findLogoUrl(html: string, baseUrl: string): string | null {
  // Priority: explicit logo <img> > apple-touch-icon > og:image > svg logo
  const candidates = [
    pickAttr(
      html,
      /<img[^>]+(?:alt|class|id)=["'][^"']*\blogo\b[^"']*["'][^>]*src=["']([^"']+)["']/i,
    ),
    pickAttr(
      html,
      /<img[^>]+src=["']([^"']+)["'][^>]+(?:alt|class|id)=["'][^"']*\blogo\b[^"']*["']/i,
    ),
    pickAttr(
      html,
      /<link[^>]+rel=["'](?:apple-touch-icon|apple-touch-icon-precomposed)["'][^>]+href=["']([^"']+)["']/i,
    ),
    pickAttr(
      html,
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    ),
    pickAttr(
      html,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    ),
  ].filter((v): v is string => Boolean(v));

  for (const c of candidates) {
    const resolved = resolveUrl(c, baseUrl);
    if (resolved) return resolved;
  }
  return null;
}

// ---- Font extraction --------------------------------------------------------

function findFontFamily(html: string, css: string): string | null {
  // Google Fonts <link>
  const gf = pickAttr(
    html,
    /<link[^>]+href=["']https:\/\/fonts\.googleapis\.com\/css2?\?family=([^&"']+)/i,
  );
  if (gf) {
    const family = decodeURIComponent(gf.split(":")[0]).replace(/\+/g, " ");
    if (family) return family;
  }
  // CSS body { font-family: ... }
  const cssMatch = css.match(/font-family\s*:\s*([^;}\n]+)/i);
  if (cssMatch) {
    const first = cssMatch[1].split(",")[0].trim().replace(/^["']|["']$/g, "");
    if (first && !/^(inherit|initial|unset|sans-serif|serif|monospace)$/i.test(first)) {
      return first;
    }
  }
  return null;
}

// ---- Main extractor ---------------------------------------------------------

async function safeFetch(url: string, timeoutMs = 8_000): Promise<string> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MabblyBrandingBot/1.0; +https://mabbly.com)",
        Accept: "text/html,text/css,*/*;q=0.5",
      },
    });
    clearTimeout(t);
    if (!res.ok) return "";
    return (await res.text()).slice(0, 400_000);
  } catch {
    return "";
  }
}

export async function extractBrandProfile(
  websiteUrl: string,
): Promise<BrandProfile> {
  if (!websiteUrl) return EMPTY;

  const html = await safeFetch(websiteUrl);
  if (!html) return EMPTY;

  // Pull first 2 stylesheet hrefs and fetch them too (best-effort).
  const cssHrefs = pickAllAttr(
    html,
    /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi,
  ).slice(0, 2);

  const cssTexts = await Promise.all(
    cssHrefs.map((h) => {
      const abs = resolveUrl(h, websiteUrl);
      return abs ? safeFetch(abs, 5_000) : Promise.resolve("");
    }),
  );

  // Inline <style> blocks
  const inlineStyles = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) ?? [])
    .map((b) => b.replace(/<\/?style[^>]*>/gi, ""))
    .join("\n");

  const css = [inlineStyles, ...cssTexts].join("\n").slice(0, 600_000);

  // ---- Colors ----
  const allColors = [...extractAllColors(html), ...extractAllColors(css)];
  const freq = frequency(allColors);

  // Theme/tile colors are high-confidence brand color signals.
  const themeColorRaw =
    pickAttr(
      html,
      /<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i,
    ) ||
    pickAttr(
      html,
      /<meta[^>]+name=["']msapplication-TileColor["'][^>]+content=["']([^"']+)["']/i,
    );

  const themeColor = themeColorRaw ? normalizeHex(themeColorRaw) : null;

  // Score every color for "accent" likelihood.
  const scored: Array<{ hex: string; score: number; freq: number }> = [];
  for (const [hex, f] of freq.entries()) {
    const score = accentScore(hex, f);
    if (score > 0) scored.push({ hex, score, freq: f });
  }
  scored.sort((a, b) => b.score - a.score);

  const accentColor = themeColor ?? (scored[0]?.hex ?? null);

  // Background and text guesses based on most common neutrals.
  const neutrals = [...freq.entries()]
    .filter(([h]) => chroma(h) < 0.15)
    .sort((a, b) => b[1] - a[1]);

  let backgroundColor: string | null = null;
  let textColor: string | null = null;
  for (const [hex] of neutrals) {
    if (!backgroundColor && isLightColor(hex)) backgroundColor = hex;
    if (!textColor && !isLightColor(hex)) textColor = hex;
    if (backgroundColor && textColor) break;
  }

  // CSS body declarations override neutrals if present.
  const bodyBg = css.match(/body[^{]*\{[^}]*background(?:-color)?\s*:\s*([^;}\n]+)/i);
  if (bodyBg) {
    const fromBody = normalizeHex(bodyBg[1]) ?? rgbStringToHex(bodyBg[1]);
    if (fromBody) backgroundColor = fromBody;
  }
  const bodyColor = css.match(/body[^{]*\{[^}]*[^-]color\s*:\s*([^;}\n]+)/i);
  if (bodyColor) {
    const fromBody = normalizeHex(bodyColor[1]) ?? rgbStringToHex(bodyColor[1]);
    if (fromBody) textColor = fromBody;
  }

  // ---- Logo, font, name ----
  const logoUrl = findLogoUrl(html, websiteUrl);
  const fontFamily = findFontFamily(html, css);

  const siteName =
    pickAttr(
      html,
      /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
    ) || pickAttr(html, /<title[^>]*>([^<]+)<\/title>/i);

  const companyName = siteName
    ? siteName.split(/[|\u2014\u2013\-:]/)[0].trim().slice(0, 80)
    : null;

  return {
    logoUrl,
    brandColor: themeColor ?? accentColor,
    accentColor,
    backgroundColor,
    textColor,
    fontFamily,
    companyName,
    raw: {
      candidateColors: scored.slice(0, 8).map((s) => s.hex),
      sources: {
        theme_color: themeColor,
        css_chars: String(css.length),
      },
    },
  };
}
