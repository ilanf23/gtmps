import { ReactNode } from "react";
import { NavLink, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MagnetShellProps {
  children: ReactNode;
  /** Optional override slug — used by /book where there is no :slug param */
  slug?: string;
  /** Optional visitor first name shown on the right */
  firstName?: string | null;
}

/**
 * Shared navigation shell for the 4-page magnet microsite.
 * Wraps /m/:slug, /m/:slug/chat, /m/:slug/read, /m/:slug/feedback, and /book.
 */
export default function MagnetShell({ children, slug: slugProp, firstName }: MagnetShellProps) {
  const params = useParams<{ slug: string }>();
  const slug = slugProp ?? params.slug;

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
    <div className="min-h-screen bg-[#120D05] text-[#F5EFE0] flex flex-col">
      {/* Top nav */}
      <header
        className="sticky top-0 z-40 border-b border-white/10 bg-[#120D05]/95 backdrop-blur"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <a
            href="https://mabbly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 shrink-0"
          >
            <span className="text-[#B8933A] text-xs uppercase tracking-[0.32em] font-semibold">
              Mabbly · GTM
            </span>
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
                            ? "text-[#F5EFE0]"
                            : "text-[#F5EFE0]/50 hover:text-[#F5EFE0]/80",
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span>{t.label}</span>
                          {isActive && (
                            <span
                              className="absolute left-2 right-2 bottom-0 h-[2px] bg-[#B8933A]"
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
            <p className="hidden sm:block text-xs text-[#F5EFE0]/40 shrink-0">
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
