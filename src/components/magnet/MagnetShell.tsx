import { ReactNode, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useClientTheme } from "@/hooks/useClientTheme";
import { themeStyle } from "@/lib/clientTheme";
import { openCalendlyPopup, prewarmCalendly } from "@/lib/calendly";
import Footer from "@/components/Footer";
import VerticalNavBar from "@/components/VerticalLanding/VerticalNavBar";

interface MagnetShellProps {
  children: ReactNode;
  /** Optional override slug - used by /book where there is no :slug param */
  slug?: string;
  /** Optional visitor first name passed into Calendly prefill */
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
 * Shared layout for the 4-page magnet microsite (/m/:slug, /chat, /read,
 * /feedback) plus /book. Renders the cream homepage nav at the top - same
 * chrome as /discover - and lets the microsite body re-skin to client colors
 * via `data-ms-themed` and the override sheet in `styles/microsite-theme.css`.
 *
 * The nav itself stays cream; only the body reflects the client palette.
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

  // Warm Calendly assets the moment the microsite mounts so the popup opens
  // instantly when the user clicks "Book a Walkthrough" in the nav.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const idle = (window as unknown as {
      requestIdleCallback?: (cb: () => void) => number;
    }).requestIdleCallback;
    if (idle) idle(() => prewarmCalendly());
    else window.setTimeout(() => prewarmCalendly(), 200);
  }, []);

  // Record this slug in the visitor's recent-microsites list so the global
  // nav can surface a "Your Map" link on subsequent pages, even when the
  // visitor lands on /m/:slug directly without going through /assess.
  useEffect(() => {
    if (!slug) return;
    try {
      const RECENT_KEY = "magnet:my_slugs";
      const LEGACY_KEY = "magnet:my_slug";
      const MAX_RECENT = 10;
      let existing: string[] = [];
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          existing = parsed.filter((s) => typeof s === "string" && s);
        }
      } else {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) existing = [legacy];
      }
      const next = [slug, ...existing.filter((s) => s !== slug)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      localStorage.setItem(LEGACY_KEY, slug);
    } catch {
      /* private mode / storage disabled - non-fatal */
    }
  }, [slug]);

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

  // Inject the client font as a CSS variable for the override sheet to consume.
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
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 < 0.5;
  })();

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-clip"
      data-ms-themed
      data-ms-dark={isDarkBg ? "" : undefined}
      data-ms-font={theme.fontFamily ? "" : undefined}
      style={wrapperStyle}
    >
      <VerticalNavBar
        forYourFirmHref="/discover#industries"
        addYourFirmHref="/discover#hero"
        onBookWalkthrough={handleBookClick}
      />

      <main className="flex-1 flex flex-col">{children}</main>

      <Footer />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        /* Anchored sub-scrolls inside long microsite pages still need offset
           below the sticky cream nav (~56px). */
        [id^="v10-section-"] { scroll-margin-top: 72px; }
      `}</style>
    </div>
  );
}
