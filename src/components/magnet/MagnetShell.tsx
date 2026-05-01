import { ReactNode, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useClientTheme } from "@/hooks/useClientTheme";
import { themeStyle } from "@/lib/clientTheme";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";
import { openCalendlyPopup, prewarmCalendly } from "@/lib/calendly";
import Footer from "@/components/Footer";

/**
 * Names extracted by the brand pipeline that we KNOW are wrong (third-party
 * assets, generic fallbacks, the prospect being Mabbly itself, etc.). Any of
 * these names are dropped — the header falls back to the neutral
 * "Mabbly · GTM" wordmark instead of pretending the prospect's firm is
 * something it isn't.
 */
const KNOWN_BAD_COMPANY_NAMES = new Set([
  "griffith foods",
  "griffith",
  "untitled",
  "image",
  "logo",
  "home",
  "mabbly", // never self-pair "Mabbly × Mabbly"
]);

function isBadName(name: string | null | undefined): boolean {
  if (!name) return false;
  const k = name.trim().toLowerCase();
  if (!k) return true;
  return KNOWN_BAD_COMPANY_NAMES.has(k);
}

interface MagnetShellProps {
  children: ReactNode;
  /** Optional override slug — used by /book where there is no :slug param */
  slug?: string;
  /** Optional visitor first name shown on the right */
  firstName?: string | null;
}

/**
 * Inject a Google Fonts stylesheet for the client's brand font (idempotent).
 * Only fires when the family is set. Does nothing for system or unknown fonts.
 */
function useGoogleFont(family: string | null) {
  useEffect(() => {
    if (!family) return;
    const id = `ms-gfont-${family.replace(/\s+/g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }, [family]);
}

/**
 * Shared navigation shell for the 4-page magnet microsite.
 * Wraps /m/:slug, /m/:slug/chat, /m/:slug/read, /m/:slug/feedback, and /book.
 *
 * Pulls the client theme from the breakdown row so EVERY tab — Map, Talk to
 * the Book, Read, Feedback — re-skins to the client's branding the moment
 * enrichment writes it. The `data-ms-themed` attribute on the wrapper
 * activates the rule set in `styles/microsite-theme.css`, which remaps every
 * hardcoded Mabbly color used by the inner components to the client tokens.
 */
export default function MagnetShell({
  children,
  slug: slugProp,
  firstName,
}: MagnetShellProps) {
  const params = useParams<{ slug: string }>();
  const slug = slugProp ?? params.slug;
  const theme = useClientTheme(slug);
  useGoogleFont(theme.fontFamily);

  // Warm Calendly assets (script + stylesheet) the moment the microsite mounts
  // so that by the time the user clicks "Book" or scrolls to the inline widget,
  // the network round-trips are already done. Saves ~5-10s of perceived load.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const idle = (window as unknown as {
      requestIdleCallback?: (cb: () => void) => number;
    }).requestIdleCallback;
    if (idle) idle(() => prewarmCalendly());
    else window.setTimeout(() => prewarmCalendly(), 200);
  }, []);

  const handleBookClick = () => {
    openCalendlyPopup({
      slug: slug ?? "",
      firmName: theme.companyName ?? null,
      firstName,
      primary: theme.accent,
      background: theme.background,
      text: theme.text,
    });
  };

  // Inject the font as a CSS variable for the override sheet to consume.
  const wrapperStyle: React.CSSProperties = {
    ...themeStyle(theme),
    ...(theme.fontFamily ? { ["--ms-font" as never]: `"${theme.fontFamily}"` } : {}),
  };

  // Detect a dark client background so the override sheet can strengthen
  // borders, surfaces and prose contrast under [data-ms-themed][data-ms-dark].
  const isDarkBg = (() => {
    const m = theme.background.match(/^#([0-9a-f]{6})$/i);
    if (!m) return false;
    const r = parseInt(m[1].slice(0, 2), 16);
    const g = parseInt(m[1].slice(2, 4), 16);
    const b = parseInt(m[1].slice(4, 6), 16);
    // Quick perceptual luminance check.
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5;
  })();

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      data-ms-themed
      data-ms-dark={isDarkBg ? "" : undefined}
      data-ms-font={theme.fontFamily ? "" : undefined}
      style={wrapperStyle}
    >
      {/* Top nav */}
      <header
        className="sticky top-0 z-40 backdrop-blur"
        style={{
          // Lighten the header by mixing the brand background with white so it
          // sits a touch above the body without losing brand identity.
          backgroundColor: `color-mix(in srgb, var(--brand-bg, ${theme.background}) 78%, #ffffff)`,
          color: `var(--brand-bg-fg, ${theme.text})`,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand: client logo first (prominent), then a small "by Mabbly" mark */}
          <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
            {(() => {
              const safeName = isBadName(theme.companyName) ? null : theme.companyName;
              const showLogo = Boolean(theme.logoUrl) && !isBadName(theme.companyName);
              const isSelfMabbly = (theme.companyName ?? "").trim().toLowerCase() === "mabbly";

              if (showLogo) {
                return (
                  <div
                    className="flex items-center gap-3"
                    aria-label={safeName ?? "Client"}
                  >
                    <img
                      src={theme.logoUrl!}
                      alt={safeName ? `${safeName} logo` : "Client logo"}
                      className="h-7 w-auto max-w-[160px] object-contain"
                      loading="lazy"
                      onLoad={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        const w = img.naturalWidth;
                        const h = img.naturalHeight;
                        if (!w || !h) return;
                        const ratio = w / h;
                        if (ratio > 5 || ratio < 0.5) {
                          img.style.display = "none";
                        }
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    {safeName ? (
                      <span
                        className="hidden md:inline text-xs uppercase tracking-[0.28em] font-semibold"
                        style={{ color: theme.text }}
                      >
                        {safeName}
                      </span>
                    ) : null}
                  </div>
                );
              }

              if (safeName) {
                return (
                  <span
                    className="text-xs uppercase tracking-[0.32em] font-semibold truncate"
                    style={{ color: theme.text }}
                  >
                    {safeName}
                  </span>
                );
              }

              return (
                <span
                  className="text-xs uppercase tracking-[0.32em] font-semibold"
                  style={{ color: MABBLY_GOLD }}
                >
                  Mabbly · GTM
                </span>
              );
            })()}

            {/* "× Mabbly" credential — ONLY when we have a verified non-Mabbly,
                non-blocked client identity AND a logo to pair it with. */}
            {theme.logoUrl &&
              !isBadName(theme.companyName) &&
              (theme.companyName ?? "").trim().toLowerCase() !== "mabbly" && (
                <>
                  <span
                    className="hidden sm:inline h-4 w-px"
                    style={{ backgroundColor: theme.border }}
                    aria-hidden
                  />
                  <a
                    href="https://mabbly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline text-[10px] uppercase tracking-[0.32em] font-semibold"
                    style={{ color: MABBLY_GOLD }}
                  >
                    × Mabbly
                  </a>
                </>
              )}
          </div>

          {/* (Spacer removed — brand block uses flex-1) */}

          {/* Single conversion CTA */}
          <button
            type="button"
            onClick={handleBookClick}
            className="inline-flex items-center gap-1.5 sm:gap-2 h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] px-3 sm:px-5 text-[11px] sm:text-sm font-semibold tracking-wide uppercase transition-opacity hover:opacity-90 shrink-0 whitespace-nowrap"
            style={{
              backgroundColor: `var(--brand-bg, ${theme.background})`,
              color: `var(--brand-bg-fg, #fff)`,
              border: `1px solid var(--brand-bg-fg, rgba(255,255,255,0.25))`,
            }}
          >
            <span className="hidden sm:inline">Book a Walkthrough</span>
            <span className="sm:hidden">Book</span>
            <span aria-hidden>→</span>
          </button>

          {firstName ? (
            <p
              className="hidden md:block text-xs shrink-0"
              style={{ color: `var(--brand-bg-fg, ${theme.textMuted})`, opacity: 0.75 }}
            >
              {firstName}
            </p>
          ) : null}
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <Footer />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
