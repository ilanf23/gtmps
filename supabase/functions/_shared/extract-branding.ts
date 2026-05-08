// Lightweight, dependency-free brand extractor.
// Fetches a website's HTML and (optionally) its first inline/linked CSS,
// then derives a usable brand profile: logo, accent color, background,
// text color, font family.
//
// Handles modern shadcn/Tailwind setups where colors are stored as raw HSL
// triplets in CSS variables (`--background: 0 0% 4%`) and consumed via
// `hsl(var(--background))`.

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
  const m = s.match(/rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)/i);
  if (!m) return null;
  const [r, g, b] = [m[1], m[2], m[3]].map((n) => Math.max(0, Math.min(255, parseInt(n, 10))));
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}

/**
 * Convert an HSL color expression to hex.
 * Accepts:
 *   - `hsl(0, 100%, 50%)`           (legacy comma form)
 *   - `hsl(0 100% 50%)`             (modern space form)
 *   - `hsla(0 100% 50% / 0.5)`      (alpha is dropped)
 *   - `0 100% 50%`                  (raw shadcn/Tailwind triplet)
 *   - `0 0% 4%`                     (background in shadcn projects)
 * Returns null when the input is not parseable.
 */
function hslStringToHex(input: string): string | null {
  if (!input) return null;
  // Strip a leading hsl()/hsla() wrapper if present.
  const wrapped = input.trim().match(/^hsla?\(\s*([^)]+)\s*\)$/i);
  const inner = wrapped ? wrapped[1] : input.trim();
  // Drop "/ alpha" suffix.
  const noAlpha = inner.split("/")[0].trim();
  // Split on commas OR whitespace.
  const parts = noAlpha
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 3);
  if (parts.length < 3) return null;

  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1].replace("%", "")) / 100;
  const l = parseFloat(parts[2].replace("%", "")) / 100;
  if (!isFinite(h) || !isFinite(s) || !isFinite(l)) return null;
  if (s < 0 || s > 1.0001 || l < 0 || l > 1.0001) return null;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp < 5) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const m = l - c / 2;
  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);
  return "#" + [r, g, b].map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0")).join("");
}

/**
 * Parse any color string we know how to handle. Try hex, rgb, hsl, then
 * bare HSL triplet. Returns hex or null.
 */
function parseAnyColor(value: string): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  // hex
  const hex = normalizeHex(trimmed);
  if (hex) return hex;
  // rgb()/rgba()
  if (/^rgba?\(/i.test(trimmed)) return rgbStringToHex(trimmed);
  // hsl()/hsla()
  if (/^hsla?\(/i.test(trimmed)) return hslStringToHex(trimmed);
  // Named colors we care about
  if (/^(black|#?000)$/i.test(trimmed)) return "#000000";
  if (/^(white|#?fff)$/i.test(trimmed)) return "#ffffff";
  // Bare HSL triplet (shadcn/Tailwind): "0 0% 4%"
  if (/^[\d.]+\s+[\d.]+%\s+[\d.]+%/i.test(trimmed)) return hslStringToHex(trimmed);
  return null;
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
  // hsl()/hsla(), including ones that wrap a var() like hsl(var(--primary))
  // Those will fail to parse and be skipped silently, which is correct.
  const hslMatches = text.match(/hsla?\([^)]+\)/gi) ?? [];
  for (const h of hslMatches) {
    const n = hslStringToHex(h);
    if (n) out.push(n);
  }
  return out;
}

function frequency(values: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
  return m;
}

// ---- CSS variables ----------------------------------------------------------

/**
 * Pull `--name: value;` declarations from `:root`, `html`, `body`, and any
 * dark-theme block (e.g. `[data-theme="dark"]`, `.dark`). Resolve each
 * value through every color parser we have. Variables that hold a `var(...)`
 * reference are followed up to two hops.
 */
function extractCssVariables(css: string): Record<string, string> {
  const map: Record<string, string> = {};
  const rawMap: Record<string, string> = {};

  const blockRegex = /(?::root|html|body|\.dark|\[data-theme=["']dark["']\])\s*\{([^}]+)\}/gi;
  let block: RegExpExecArray | null;
  while ((block = blockRegex.exec(css)) !== null) {
    const body = block[1];
    const declRegex = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
    let decl: RegExpExecArray | null;
    while ((decl = declRegex.exec(body)) !== null) {
      const name = decl[1].toLowerCase();
      const value = decl[2].trim();
      rawMap[name] = value;
    }
  }

  // Resolve. Two passes to chase one level of var() indirection.
  const resolveOne = (raw: string): string | null => {
    // Inline var() lookup: hsl(var(--background)) => raw value of --background
    const varRef = raw.match(/var\(\s*--([a-z0-9-]+)/i);
    if (varRef) {
      const target = rawMap[varRef[1].toLowerCase()];
      if (target) {
        // If the original wraps in hsl(var(...)), wrap the resolved value too.
        const wrap = raw.match(/^(hsla?|rgba?)\(/i);
        const wrapped = wrap ? `${wrap[1]}(${target})` : target;
        return parseAnyColor(wrapped) ?? parseAnyColor(target);
      }
      return null;
    }
    return parseAnyColor(raw);
  };

  for (const [name, raw] of Object.entries(rawMap)) {
    const hex = resolveOne(raw);
    if (hex) map[name] = hex;
  }
  return map;
}

// ---- Logo extraction --------------------------------------------------------

/**
 * Pull a `sizes` attribute (e.g. "96x96" or "any") from a <link> tag's full
 * match and return the largest dimension found, or 0 when missing.
 */
function parseIconSize(tagFragment: string): number {
  const m = tagFragment.match(/sizes=["']([^"']+)["']/i);
  if (!m) return 0;
  const dims = m[1].toLowerCase().match(/(\d+)x(\d+)/g);
  if (!dims) return m[1].includes("any") ? 9999 : 0;
  let max = 0;
  for (const d of dims) {
    const [w, h] = d.split("x").map((n) => parseInt(n, 10));
    max = Math.max(max, w, h);
  }
  return max;
}

/**
 * Look for an inline <svg> inside <header> or <nav>. Returns a data URL when
 * found and the SVG payload is small enough to embed safely.
 */
function findInlineHeaderSvg(html: string): string | null {
  // Take the first 20k chars after <header> or <nav> opening, without
  // requiring the closing tag (modern WP/React templates often have
  // 40k+ chars between header open and close).
  const openMatch = html.match(/<(header|nav)\b[^>]*>/i);
  if (!openMatch) return null;
  const start = (openMatch.index ?? 0) + openMatch[0].length;
  const slice = html.slice(start, start + 20_000);
  const svgMatch = slice.match(/<svg[\s\S]*?<\/svg>/i);
  if (!svgMatch) return null;
  const svg = svgMatch[0];
  if (svg.length > 25_000) return null;
  // Skip tiny icon SVGs (likely menu/search icons, not the brand mark).
  // Heuristic: a real logo svg usually has a viewBox wider than 40 units.
  const vb = svg.match(/viewBox=["']\s*[\d.\-]+\s+[\d.\-]+\s+([\d.]+)\s+([\d.]+)/i);
  if (vb) {
    const w = parseFloat(vb[1]);
    if (w < 40) return null;
  }
  // Encode as data URL.
  const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

/**
 * Validate a remote logo URL via HEAD: must be a logo-friendly content type
 * and small (<500KB). Returns the URL when OK, null when not.
 */
async function validateLogoAsset(url: string): Promise<string | null> {
  // Data URLs are produced by us, no network check needed.
  if (url.startsWith("data:")) return url;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4_000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MabblyBrandingBot/1.0; +https://mabbly.com)",
      },
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const ct = (res.headers.get("content-type") ?? "").toLowerCase();
    const allowed = [
      "image/svg+xml",
      "image/png",
      "image/webp",
      "image/x-icon",
      "image/vnd.microsoft.icon",
      "image/avif",
    ];
    // JPEG is intentionally excluded, real logos virtually never ship as JPEG,
    // and this is the format used by social-share photos.
    if (!allowed.some((a) => ct.includes(a))) return null;
    const len = parseInt(res.headers.get("content-length") ?? "0", 10);
    if (len && len > 500_000) return null;
    return url;
  } catch {
    return null;
  }
}

async function findLogoUrl(html: string, baseUrl: string): Promise<string | null> {
  // Domain root word, e.g. "mabbly" from "https://www.mabbly.com".
  // Used to disambiguate the brand's own logo from client-wall logos
  // (e.g. "Griffith-logo.svg" sitting on mabbly.com).
  let domainRoot = "";
  let baseHost = "";
  try {
    const host = new URL(baseUrl).hostname.replace(/^www\./, "");
    baseHost = host;
    domainRoot = (host.split(".")[0] ?? "").toLowerCase();
  } catch {
    /* ignore */
  }

  // Third-party SaaS hosts whose logos commonly appear in "works with" /
  // integrations / partners strips on prospect homepages. When a candidate
  // resolves to one of these hosts, it is almost never the prospect's own
  // brand mark — disqualify outright. (Narrio failure: a Zendesk integration
  // logo on narrio.app outscored the real narrio.svg.)
  const THIRD_PARTY_HOST_DENYLIST = [
    "zendesk.com", "intercom.com", "intercomcdn.com", "hubspot.com",
    "salesforce.com", "segment.com", "slack.com", "slack-edge.com",
    "zapier.com", "stripe.com", "shopify.com", "mailchimp.com",
    "atlassian.com", "atlassian.net", "asana.com", "monday.com",
    "notion.so", "gravatar.com", "linkedin.com", "twitter.com",
    "x.com", "facebook.com", "instagram.com", "youtube.com",
    "ytimg.com", "googleusercontent.com", "gstatic.com",
  ];

  const sameOrigin = (resolvedSrc: string): boolean => {
    if (!baseHost) return false;
    try {
      const h = new URL(resolvedSrc).hostname.replace(/^www\./, "");
      return h === baseHost || h.endsWith("." + baseHost) || baseHost.endsWith("." + h);
    } catch {
      return false;
    }
  };

  const isDenylistedHost = (resolvedSrc: string): boolean => {
    try {
      const h = new URL(resolvedSrc).hostname.toLowerCase();
      return THIRD_PARTY_HOST_DENYLIST.some((d) => h === d || h.endsWith("." + d));
    } catch {
      return false;
    }
  };

  // Slice the first 20k chars of markup after the opening <header>/<nav>.
  // Brand marks almost always sit at the top of the header. We do NOT
  // require finding </header> because modern templates routinely have
  // 40k+ chars (entire mega-menus, mobile drawers) between open and close.
  let headerSlice = "";
  const headerOpen = html.match(/<(header|nav)\b[^>]*>/i);
  if (headerOpen) {
    const start = (headerOpen.index ?? 0) + headerOpen[0].length;
    headerSlice = html.slice(start, start + 20_000);
  }

  // Negative-context phrases. If an <img> sits within ~400 chars of one of
  // these, it's almost certainly a client/partner logo, not the brand mark.
  const NEGATIVE_CONTEXT = /(client|partner|trusted by|our work|case stud|portfolio|testimonial|logo[\s-]?wall|brands? we|featured in|as seen|press)/i;

  // Decorative-purpose hints. When an <img>'s src/alt/class/id flags it as
  // a hero photo, headshot, banner, or background pattern, it is almost
  // never the brand mark, even if it sits in the header. The demotion is
  // strong enough to lose to any reasonable inline-SVG candidate.
  const DECORATIVE_HINT = /\b(hero|banner|background|bg[-_]|pattern|photo|headshot|portrait|team[-_]|people|cover|splash|illustration|avatar|profile)\b/i;

  type Candidate = {
    src: string;
    score: number;
    isData?: boolean;
    kind: "inline-svg" | "img" | "favicon-svg" | "mask-icon" | "apple-touch" | "sized-icon";
    hasLogoSignal?: boolean;
    inHeader?: boolean;
    domainMatch?: boolean;
  };
  const candidates: Candidate[] = [];

  // Walk every <img> tag, score it.
  const imgRe = /<img\b[^>]*>/gi;
  let im: RegExpExecArray | null;
  while ((im = imgRe.exec(html)) !== null) {
    const tag = im[0];
    const src = pickAttr(tag, /src=["']([^"']+)["']/i);
    if (!src) continue;
    const alt = (pickAttr(tag, /alt=["']([^"']*)["']/i) ?? "").toLowerCase();
    const cls = (pickAttr(tag, /class=["']([^"']*)["']/i) ?? "").toLowerCase();
    const idAttr = (pickAttr(tag, /id=["']([^"']*)["']/i) ?? "").toLowerCase();
    const srcLower = src.toLowerCase();
    const idx = im.index;
    const inHeader = headerSlice && html.indexOf(tag) >= 0
      ? headerSlice.includes(tag)
      : false;

    // Surrounding context (~400 chars before the tag).
    const ctxStart = Math.max(0, idx - 400);
    const surrounding = html.slice(ctxStart, idx).toLowerCase();
    const hasNegative = NEGATIVE_CONTEXT.test(surrounding) ||
      /client|partner|testimonial/.test(cls) ||
      /client|partner|testimonial/.test(idAttr);

    // Explicit logo signals on the tag itself.
    const hasLogoSignal =
      /\blogo\b/.test(alt) ||
      /\blogo\b/.test(cls) ||
      /\blogo\b/.test(idAttr) ||
      /[\/_-]logo[\._-]|\blogo\.(svg|png|webp)/i.test(srcLower);

    // Decorative signal (hero photo, headshot, banner, etc.). When set
    // without a competing logo signal, this image is almost certainly
    // not the brand mark.
    const hasDecorativeHint =
      DECORATIVE_HINT.test(srcLower) ||
      DECORATIVE_HINT.test(alt) ||
      DECORATIVE_HINT.test(cls) ||
      DECORATIVE_HINT.test(idAttr);

    let score = 0;
    if (inHeader) score += 12;
    if (hasLogoSignal) score += 9; // bumped from +5/+4 split, single signal
    if (domainRoot && domainRoot.length >= 3) {
      if (srcLower.includes(domainRoot)) score += 10;
      if (alt.includes(domainRoot)) score += 10;
    }
    // Filename mentioning OTHER company-ish words is a soft negative.
    // (We can't know every client name, but the negative-context check
    // catches most logo-wall placements.)
    if (hasNegative) score -= 15;
    // Decorative purpose drops the score below any reasonable real-logo
    // candidate. We only apply it when there is no explicit logo signal
    // (some sites legitimately use `team-logo.svg` for the brand mark).
    if (hasDecorativeHint && !hasLogoSignal) score -= 18;
    // Skip pure tracking pixels and tiny icons.
    if (/sprite|icon-|pixel|tracking|spacer|blank\.gif/.test(srcLower)) score -= 8;

    // Same-origin / cross-origin gating. We resolve the URL against baseUrl
    // so relative paths (the common case for the real brand mark) are
    // treated as same-origin.
    const resolvedForOriginCheck = resolveUrl(src, baseUrl);
    if (resolvedForOriginCheck) {
      if (isDenylistedHost(resolvedForOriginCheck)) {
        // Hard disqualify — third-party SaaS logo embedded on the page.
        score = 0;
      } else if (!sameOrigin(resolvedForOriginCheck)) {
        // Cross-origin: heavily penalize. Most legitimate logos are served
        // from the prospect's own domain or an asset subdomain.
        score -= 25;
      } else {
        // Same-origin bonus.
        score += 8;
      }
    }

    // Whole-token brand-name match in the basename (narrio.svg, narrio-logo.png).
    if (domainRoot && domainRoot.length >= 3) {
      const basename = srcLower.split("/").pop() ?? "";
      const tokenRe = new RegExp(`(^|[^a-z0-9])${domainRoot}([^a-z0-9]|$)`, "i");
      if (tokenRe.test(basename)) score += 6;
    }

    if (score > 0) {
      const resolvedHost = resolvedForOriginCheck
        ? sameOrigin(resolvedForOriginCheck)
        : true; // data: / inline candidates count as same-origin
      candidates.push({
        src,
        score,
        kind: "img",
        hasLogoSignal,
        inHeader: !!inHeader,
        domainMatch:
          !!(domainRoot && domainRoot.length >= 3 &&
            (srcLower.includes(domainRoot) || alt.includes(domainRoot))),
      });
      // Re-tag for downstream confidence gate.
      const last = candidates[candidates.length - 1];
      (last as Candidate & { _sameOrigin?: boolean })._sameOrigin = resolvedHost;
    }
  }

  // Inline <svg> inside header/nav — almost always the brand mark. Score
  // it above the maximum reachable <img> score (inHeader 12 + domain 10
  // + domain-in-alt 10 + logoSignal 9 = 41 in pathological cases, but in
  // practice domain-in-alt is rare alongside an inline SVG). Setting this
  // to 30 keeps inline SVG dominant against any <img> that scored on
  // circumstantial signals (header presence + domain hits) while still
  // allowing an explicit-logo <img> with multiple confirming signals to
  // win. This was the Mabbly bug: the real brand mark is inline SVG, but
  // an `<img>` with `mabbly` in its src outscored it 22 to 11.
  const inlineSvg = findInlineHeaderSvg(html);
  if (inlineSvg) candidates.push({ src: inlineSvg, score: 30, isData: true, kind: "inline-svg" });

  // SVG favicon — vector favicons are virtually always the real mark.
  const svgIconLink = (() => {
    const m = html.match(
      /<link[^>]+rel=["'][^"']*\bicon\b[^"']*["'][^>]+type=["']image\/svg\+xml["'][^>]+href=["']([^"']+)["']/i,
    ) || html.match(
      /<link[^>]+type=["']image\/svg\+xml["'][^>]+rel=["'][^"']*\bicon\b[^"']*["'][^>]+href=["']([^"']+)["']/i,
    );
    return m?.[1] ?? null;
  })();
  if (svgIconLink) candidates.push({ src: svgIconLink, score: 8, kind: "favicon-svg" });

  const maskIcon = pickAttr(
    html,
    /<link[^>]+rel=["']mask-icon["'][^>]+href=["']([^"']+)["']/i,
  );
  if (maskIcon) candidates.push({ src: maskIcon, score: 7, kind: "mask-icon" });

  const appleTouch = pickAttr(
    html,
    /<link[^>]+rel=["'](?:apple-touch-icon|apple-touch-icon-precomposed)["'][^>]+href=["']([^"']+)["']/i,
  );
  if (appleTouch) candidates.push({ src: appleTouch, score: 6, kind: "apple-touch" });

  const sizedIcon = (() => {
    const re = /<link[^>]+rel=["'][^"']*\bicon\b[^"']*["'][^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      const tag = m[0];
      const size = parseIconSize(tag);
      if (size >= 96) {
        const href = pickAttr(tag, /href=["']([^"']+)["']/i);
        if (href) return href;
      }
    }
    return null;
  })();
  if (sizedIcon) candidates.push({ src: sizedIcon, score: 5, kind: "sized-icon" });

  // og:image / twitter:image are deliberately NOT used — they are
  // landscape marketing photos, not logos.

  // Sort by score, highest first, deduped by URL.
  const seen = new Set<string>();
  const ranked = candidates
    .sort((a, b) => b.score - a.score)
    .filter((c) => {
      if (seen.has(c.src)) return false;
      seen.add(c.src);
      return true;
    });

  for (const c of ranked) {
    // Confidence gate: top candidate must have a positive logo signal.
    // Trusted kinds (inline SVG, favicon links) pass automatically.
    // <img> candidates must be same-origin AND carry at least one of:
    // explicit logo token, brand-name match, or header placement.
    const trustedKind =
      c.kind === "inline-svg" ||
      c.kind === "favicon-svg" ||
      c.kind === "mask-icon" ||
      c.kind === "apple-touch" ||
      c.kind === "sized-icon";
    if (!trustedKind) {
      const sameOrig = (c as Candidate & { _sameOrigin?: boolean })._sameOrigin;
      const positiveSignal = c.hasLogoSignal || c.domainMatch || c.inHeader;
      if (!sameOrig || !positiveSignal) {
        // Skip — not confident enough. Keep looking.
        continue;
      }
    }

    if (c.src.startsWith("data:")) {
      console.log("[extract-branding] logo selected", { kind: c.kind, score: c.score, source: "data-url" });
      return c.src;
    }
    const resolved = resolveUrl(c.src, baseUrl);
    if (!resolved) continue;
    const ok = await validateLogoAsset(resolved);
    if (ok) {
      console.log("[extract-branding] logo selected", { kind: c.kind, score: c.score, src: ok });
      return ok;
    }
  }
  console.log("[extract-branding] no confident logo found", { baseHost, candidateCount: ranked.length });
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

/**
 * Layered background detection. Returns a hex (or null) and the source label
 * for debugging.
 */
function detectBackground(
  html: string,
  css: string,
  vars: Record<string, string>,
  themeColor: string | null,
  neutralsByFreq: Array<[string, number]>,
): { color: string | null; source: string } {
  // 1. Theme-color meta, only trust as background when dark or saturated dark.
  if (themeColor) {
    const lum = relLuminance(themeColor);
    if (lum !== null && lum < 0.5) {
      return { color: themeColor, source: "meta:theme-color" };
    }
  }

  // 2. Inline style="background[...]" on <html> or <body>.
  const inlineBg = html.match(/<(?:html|body)[^>]*style=["'][^"']*background(?:-color)?\s*:\s*([^;"']+)/i);
  if (inlineBg) {
    const c = parseAnyColor(inlineBg[1]);
    if (c) return { color: c, source: "inline:body-style" };
  }

  // 3. CSS variable --background / --bg / --page-bg.
  for (const k of ["background", "bg", "page-bg", "color-background"]) {
    if (vars[k]) return { color: vars[k], source: `css-var:--${k}` };
  }

  // 4. body { background-color: ... }, resolve var() against vars map.
  const bodyBg = css.match(/body[^{]*\{[^}]*background(?:-color)?\s*:\s*([^;}\n]+)/i);
  if (bodyBg) {
    const raw = bodyBg[1].trim();
    const varRef = raw.match(/var\(\s*--([a-z0-9-]+)/i);
    if (varRef && vars[varRef[1].toLowerCase()]) {
      return { color: vars[varRef[1].toLowerCase()], source: "css:body+var" };
    }
    const c = parseAnyColor(raw);
    if (c) return { color: c, source: "css:body" };
  }

  // 5. html { background-color: ... }
  const htmlBg = css.match(/html[^{]*\{[^}]*background(?:-color)?\s*:\s*([^;}\n]+)/i);
  if (htmlBg) {
    const c = parseAnyColor(htmlBg[1]);
    if (c) return { color: c, source: "css:html" };
  }

  // 6. <meta name="color-scheme" content="dark"> → dark fallback.
  const colorScheme = pickAttr(html, /<meta[^>]+name=["']color-scheme["'][^>]+content=["']([^"']+)["']/i);
  if (colorScheme && /\bdark\b/i.test(colorScheme) && !/\blight\b/i.test(colorScheme)) {
    return { color: "#0a0a0a", source: "meta:color-scheme" };
  }

  // 7. body/html with class indicating dark mode.
  if (/<(?:html|body)[^>]+class=["'][^"']*\b(?:dark|theme-dark|bg-black)\b/i.test(html)) {
    return { color: "#0a0a0a", source: "class:dark" };
  }

  // 8. Light fallback from neutral frequency.
  for (const [hex] of neutralsByFreq) {
    if (isLightColor(hex)) return { color: hex, source: "freq:neutral-light" };
  }

  return { color: null, source: "none" };
}

function detectText(
  css: string,
  vars: Record<string, string>,
  neutralsByFreq: Array<[string, number]>,
  bg: string | null,
): { color: string | null; source: string } {
  // 1. CSS variable --foreground / --text / --body-text.
  for (const k of ["foreground", "text", "body-text", "text-primary", "color-text"]) {
    if (vars[k]) return { color: vars[k], source: `css-var:--${k}` };
  }
  // 2. body { color: ... }
  const bodyColor = css.match(/body[^{]*\{[^}]*[^-]color\s*:\s*([^;}\n]+)/i);
  if (bodyColor) {
    const raw = bodyColor[1].trim();
    const varRef = raw.match(/var\(\s*--([a-z0-9-]+)/i);
    if (varRef && vars[varRef[1].toLowerCase()]) {
      return { color: vars[varRef[1].toLowerCase()], source: "css:body+var" };
    }
    const c = parseAnyColor(raw);
    if (c) return { color: c, source: "css:body" };
  }
  // 3. Frequency neutral that contrasts with bg.
  if (bg) {
    const bgLum = relLuminance(bg);
    for (const [hex] of neutralsByFreq) {
      const lum = relLuminance(hex);
      if (lum === null || bgLum === null) continue;
      if (Math.abs(lum - bgLum) > 0.4) {
        return { color: hex, source: "freq:contrast" };
      }
    }
  }
  return { color: null, source: "none" };
}

function detectAccent(
  vars: Record<string, string>,
  themeColor: string | null,
  scored: Array<{ hex: string; score: number }>,
): { color: string | null; source: string } {
  // 1. CSS variable --primary / --accent / --brand.
  for (const k of ["primary", "accent", "brand", "brand-primary", "color-primary"]) {
    if (vars[k]) {
      const lum = relLuminance(vars[k]);
      const chr = chroma(vars[k]);
      // Reject if the var is actually just a neutral (some shadcn themes use
      // --primary as white on black). Fall through to next signal.
      if (lum !== null && (chr > 0.15 || (lum > 0.04 && lum < 0.95 && chr > 0))) {
        return { color: vars[k], source: `css-var:--${k}` };
      }
    }
  }
  // 2. Theme-color meta when saturated.
  if (themeColor && chroma(themeColor) > 0.15) {
    return { color: themeColor, source: "meta:theme-color" };
  }
  // 3. Frequency-scored accent.
  if (scored[0]) return { color: scored[0].hex, source: "freq:accent-score" };
  return { color: null, source: "none" };
}

// Derive a sentence-case firm name from the URL's domain root.
// "https://www.aarete.com" -> "Aarete", "foo-bar.co.uk" -> "Foo Bar".
function nameFromUrl(websiteUrl: string): string | null {
  try {
    const host = new URL(websiteUrl).hostname.replace(/^www\./, "");
    const root = host.split(".")[0] ?? "";
    if (!root) return null;
    return root
      .split("-")
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  } catch {
    return null;
  }
}

// Hostname-based logo fallback. Clearbit's public logo endpoint returns
// a transparent brand mark for most established domains. The frontend
// (FiveOrbitsViz) sets `logoOk = false` on <image> error, so a 404 here
// gracefully degrades to the "YOUR FIRM" SVG text fallback.
function logoFallbackFromUrl(websiteUrl: string): string | null {
  try {
    const host = new URL(websiteUrl).hostname.replace(/^www\./, "");
    return host ? `https://logo.clearbit.com/${host}` : null;
  } catch {
    return null;
  }
}

function profileFromUrlOnly(websiteUrl: string): BrandProfile {
  return {
    ...EMPTY,
    logoUrl: logoFallbackFromUrl(websiteUrl),
    companyName: nameFromUrl(websiteUrl),
  };
}

export async function extractBrandProfile(
  websiteUrl: string,
): Promise<BrandProfile> {
  if (!websiteUrl) return EMPTY;

  const html = await safeFetch(websiteUrl);
  // When the site is unreachable (Cloudflare bot block, timeout, JS-only
  // SPA returning empty markup), still produce a usable profile from the
  // URL alone so the microsite hero shows a real firm name and the orbit
  // center has a logo to attempt rather than the "YOUR FIRM" placeholder.
  if (!html) return profileFromUrlOnly(websiteUrl);

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

  // ---- CSS variables (resolve shadcn/Tailwind tokens) ----
  const vars = extractCssVariables(css);

  // ---- All raw colors, for frequency analysis ----
  const allColors = [...extractAllColors(html), ...extractAllColors(css)];
  // Inject resolved CSS variable values so frequency reflects "real" usage.
  for (const v of Object.values(vars)) allColors.push(v);
  const freq = frequency(allColors);

  // Theme/tile color signals.
  const themeColorRaw =
    pickAttr(
      html,
      /<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i,
    ) ||
    pickAttr(
      html,
      /<meta[^>]+name=["']msapplication-TileColor["'][^>]+content=["']([^"']+)["']/i,
    );
  const themeColor = themeColorRaw ? parseAnyColor(themeColorRaw) : null;

  // Score every color for "accent" likelihood.
  const scored: Array<{ hex: string; score: number; freq: number }> = [];
  for (const [hex, f] of freq.entries()) {
    const score = accentScore(hex, f);
    if (score > 0) scored.push({ hex, score, freq: f });
  }
  scored.sort((a, b) => b.score - a.score);

  // Neutrals by frequency, for fallbacks.
  const neutrals = [...freq.entries()]
    .filter(([h]) => chroma(h) < 0.15)
    .sort((a, b) => b[1] - a[1]);

  // ---- Layered detection ----
  const bg = detectBackground(html, css, vars, themeColor, neutrals);
  const txt = detectText(css, vars, neutrals, bg.color);
  const acc = detectAccent(vars, themeColor, scored);

  // ---- Logo, font, name ----
  const logoUrl = await findLogoUrl(html, websiteUrl);
  const fontFamily = findFontFamily(html, css);

  // Company name extraction priority:
  //   1. og:site_name
  //   2. og:title
  //   3. <meta name="application-name">
  //   4. <title>
  //   5. capitalized domain root (e.g. calliope.com → "Calliope")
  // Never return null when we can fall back to the host.
  const ogSiteName = pickAttr(
    html,
    /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
  );
  const ogTitle = pickAttr(
    html,
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
  );
  const applicationName = pickAttr(
    html,
    /<meta[^>]+name=["']application-name["'][^>]+content=["']([^"']+)["']/i,
  );
  const docTitle = pickAttr(html, /<title[^>]*>([^<]+)<\/title>/i);

  const cleanLabel = (s: string | null): string | null => {
    if (!s) return null;
    const head = s.split(/[|\u2014\u2013\-:]/)[0]?.trim();
    return head ? head.slice(0, 80) : null;
  };

  let companyName: string | null =
    cleanLabel(ogSiteName) ||
    cleanLabel(ogTitle) ||
    cleanLabel(applicationName) ||
    cleanLabel(docTitle);

  if (!companyName) {
    try {
      const host = new URL(websiteUrl).hostname.replace(/^www\./, "");
      const root = host.split(".")[0] ?? "";
      if (root) {
        companyName = root
          .split("-")
          .filter(Boolean)
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" ");
      }
    } catch {
      companyName = null;
    }
  }

  return {
    logoUrl: logoUrl ?? logoFallbackFromUrl(websiteUrl),
    brandColor: themeColor ?? acc.color,
    accentColor: acc.color,
    backgroundColor: bg.color,
    textColor: txt.color,
    fontFamily,
    companyName: companyName ?? nameFromUrl(websiteUrl),
    raw: {
      candidateColors: scored.slice(0, 8).map((s) => s.hex),
      sources: {
        theme_color: themeColor,
        background_source: bg.source,
        text_source: txt.source,
        accent_source: acc.source,
        css_vars_found: String(Object.keys(vars).length),
        css_chars: String(css.length),
      },
    },
  };
}
