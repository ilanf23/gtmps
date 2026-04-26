import { ReactNode, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useClientTheme } from "@/hooks/useClientTheme";
import { themeStyle } from "@/lib/clientTheme";
import Footer from "@/components/Footer";

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

  // When no slug is present (e.g. /book), tabs link to base routes that won't
  // resolve — we hide the slug-scoped tabs and show only the base brand strip.
  const hasSlug = Boolean(slug);

  const tabs = hasSlug
    ? [
        { to: `/m/${slug}`, label: "MAP", end: true },
        { to: `/m/${slug}/chat`, label: "Talk to the Book" },
        { to: `/m/${slug}/read`, label: "Read" },
        { to: `/m/${slug}/feedback`, label: "Feedback" },
      ]
    : [];

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
      className="min-h-screen flex flex-col"
      data-ms-themed
      data-ms-dark={isDarkBg ? "" : undefined}
      data-ms-font={theme.fontFamily ? "" : undefined}
      style={wrapperStyle}
    >
      {/* Top nav */}
      <header
        className="sticky top-0 z-40 backdrop-blur"
        style={{
          backgroundColor: theme.background,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand: client logo first (prominent), then a small "by Mabbly" mark */}
          <div className="flex items-center gap-3 shrink-0">
            {theme.logoUrl ? (
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-3"
                aria-label={theme.companyName ?? "Client"}
              >
                <img
                  src={theme.logoUrl}
                  alt={theme.companyName ? `${theme.companyName} logo` : "Client logo"}
                  className="h-7 w-auto max-w-[160px] object-contain"
                  loading="lazy"
                  onLoad={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    const w = img.naturalWidth;
                    const h = img.naturalHeight;
                    if (!w || !h) return;
                    const ratio = w / h;
                    // Hide anything that isn't shaped like a logo —
                    // banners (>5:1) and tall portraits (<1:2) are out.
                    if (ratio > 5 || ratio < 0.5) {
                      img.style.display = "none";
                    }
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                {theme.companyName ? (
                  <span
                    className="hidden md:inline text-xs uppercase tracking-[0.28em] font-semibold"
                    style={{ color: theme.text }}
                  >
                    {theme.companyName}
                  </span>
                ) : null}
              </a>
            ) : theme.companyName ? (
              <span
                className="text-xs uppercase tracking-[0.32em] font-semibold"
                style={{ color: theme.text }}
              >
                {theme.companyName}
              </span>
            ) : (
              <span
                className="text-xs uppercase tracking-[0.32em] font-semibold"
                style={{ color: theme.accent }}
              >
                Mabbly · GTM
              </span>
            )}

            {/* "× Mabbly" credential — only show when client branding is present */}
            {(theme.logoUrl || theme.companyName) && (
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
                  className="hidden sm:inline text-[10px] uppercase tracking-[0.32em]"
                  style={{ color: theme.textMuted }}
                >
                  × Mabbly
                </a>
              </>
            )}
          </div>

          {/* Tabs */}
          {tabs.length > 0 && (
            <nav
              className="flex-1 overflow-x-auto no-scrollbar"
              aria-label="Magnet sections"
            >
              <ul className="flex items-center gap-1 sm:gap-2 justify-start sm:justify-center min-w-max sm:min-w-0">
                {tabs.map((t) => (
                  <li key={t.to}>
                    <NavLink
                      to={t.to}
                      end={t.end}
                      className={({ isActive }) =>
                        cn(
                          "relative inline-flex items-center px-3 sm:px-4 h-14 text-xs sm:text-sm uppercase tracking-wider transition-colors whitespace-nowrap",
                        )
                      }
                      style={({ isActive }) => ({
                        color: isActive ? theme.text : theme.textMuted,
                      })}
                    >
                      {({ isActive }) => (
                        <>
                          <span>{t.label}</span>
                          {isActive && (
                            <span
                              className="absolute left-2 right-2 bottom-0 h-[2px]"
                              style={{ backgroundColor: theme.accent }}
                              aria-hidden
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Visitor name */}
          {firstName ? (
            <p
              className="hidden sm:block text-xs shrink-0"
              style={{ color: theme.textMuted }}
            >
              {firstName}
            </p>
          ) : (
            <span className="hidden sm:block w-12 shrink-0" aria-hidden />
          )}
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
