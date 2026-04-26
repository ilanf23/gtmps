import { ReactNode } from "react";
import { NavLink, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MagnetShellProps {
  children: ReactNode;
  /** Optional override slug — used by /book where there is no :slug param */
  slug?: string;
  /** Optional visitor first name shown on the right */
  firstName?: string | null;
  /** Subtle co-branding pulled from the client's website during enrichment */
  clientLogoUrl?: string | null;
  clientBrandColor?: string | null;
  clientCompanyName?: string | null;
}

const GOLD = "#B8933A";

// Defensive guard — only accept a sensible hex color from the DB.
function safeColor(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed)
    ? trimmed
    : null;
}

/**
 * Shared navigation shell for the 4-page magnet microsite.
 * Wraps /m/:slug, /m/:slug/chat, /m/:slug/read, /m/:slug/feedback, and /book.
 */
export default function MagnetShell({
  children,
  slug: slugProp,
  firstName,
  clientLogoUrl,
  clientBrandColor,
  clientCompanyName,
}: MagnetShellProps) {
  const params = useParams<{ slug: string }>();
  const slug = slugProp ?? params.slug;

  const accent = safeColor(clientBrandColor) ?? GOLD;

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

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#1C1008] flex flex-col">
      {/* Top nav */}
      <header
        className="sticky top-0 z-40 border-b border-black/10 bg-[#FBF8F4]/95 backdrop-blur"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <a
            href="https://mabbly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 shrink-0"
          >
            <span className="text-[#B8933A] text-xs uppercase tracking-[0.32em] font-semibold">
              Mabbly · GTM
            </span>

            {clientLogoUrl ? (
              <>
                <span
                  className="h-4 w-px bg-[#1C1008]/15"
                  aria-hidden
                />
                <img
                  src={clientLogoUrl}
                  alt={clientCompanyName ? `${clientCompanyName} logo` : "Client logo"}
                  className="h-5 w-auto max-w-[110px] object-contain opacity-80"
                  loading="lazy"
                  onError={(e) => {
                    // Hide the logo (and its divider via the parent tweak) if it fails.
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </>
            ) : null}
          </a>

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
                          isActive
                            ? "text-[#1C1008]"
                            : "text-[#1C1008]/50 hover:text-[#1C1008]/80",
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span>{t.label}</span>
                          {isActive && (
                            <span
                              className="absolute left-2 right-2 bottom-0 h-[2px]"
                              style={{ backgroundColor: accent }}
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
            <p className="hidden sm:block text-xs text-[#1C1008]/40 shrink-0">
              {firstName}
            </p>
          ) : (
            <span className="hidden sm:block w-12 shrink-0" aria-hidden />
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
