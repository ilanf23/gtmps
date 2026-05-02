import { ReactNode, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useClientTheme } from "@/hooks/useClientTheme";
import { themeStyle } from "@/lib/clientTheme";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";
import { openCalendlyPopup, prewarmCalendly } from "@/lib/calendly";
import Footer from "@/components/Footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Wayfinder sections — single source of truth for the top-nav scrollspy,
 * dropdown menu, and progress hairline. IDs match the v10-section-N anchors
 * rendered by each section component (PersonalizedHeader, FiveOrbitsViz, …).
 */
const SECTIONS: ReadonlyArray<{ id: string; num: string; label: string }> = [
  { id: "v10-section-1", num: "01", label: "Your Research Profile" },
  { id: "v10-section-2", num: "02", label: "Five Orbits" },
  { id: "v10-section-3", num: "03", label: "Core Analysis" },
  { id: "v10-section-4", num: "04", label: "Proof" },
  { id: "v10-section-5", num: "05", label: "Skip Ahead" },
  { id: "v10-section-6", num: "06", label: "Why Research Matters" },
  { id: "v10-section-7", num: "07", label: "In Their Words" },
  { id: "v10-section-8", num: "08", label: "Book Adam" },
  { id: "v10-section-9", num: "09", label: "Highest-Leverage Move" },
  { id: "v10-section-10", num: "10", label: "Deeper Findings" },
  { id: "v10-section-11", num: "11", label: "Manuscript" },
];

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

  // Document scroll progress (0..1) drives the gold hairline at the bottom of
  // the nav. `scrolled` toggles the elevated "past-the-fold" treatment.
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      setProgress(Math.max(0, Math.min(1, window.scrollY / max)));
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Active section via IntersectionObserver scrollspy over the v10 anchors.
  // Section components mount asynchronously after the slug data resolves, so
  // we retry until at least one anchor exists, then attach the observer.
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let retry = 0;
    let io: IntersectionObserver | null = null;
    const visible = new Map<Element, number>();

    const setup = () => {
      if (cancelled) return;
      const elements = SECTIONS
        .map((s) => document.getElementById(s.id))
        .filter((el): el is HTMLElement => el !== null);
      if (elements.length === 0) {
        if (retry++ < 40) window.setTimeout(setup, 250);
        return;
      }
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              visible.set(entry.target, entry.intersectionRatio);
            } else {
              visible.delete(entry.target);
            }
          }
          if (visible.size === 0) return;
          let bestEl: Element | null = null;
          let bestRatio = -1;
          for (const [el, ratio] of visible) {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestEl = el;
            }
          }
          if (!bestEl) return;
          const idx = SECTIONS.findIndex(
            (s) => s.id === (bestEl as HTMLElement).id,
          );
          if (idx >= 0) setActiveIndex(idx);
        },
        {
          rootMargin: "-25% 0px -55% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        },
      );
      elements.forEach((el) => io!.observe(el));
    };

    setup();
    return () => {
      cancelled = true;
      io?.disconnect();
    };
  }, []);

  const handleJumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Defer one frame so Radix's dropdown close + focus-restore on the trigger
    // doesn't interrupt the smooth scroll. Without this, the trigger's focus()
    // call fires the browser's scroll-into-view algorithm and the page never
    // moves.
    requestAnimationFrame(() => {
      el.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    });
  };

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
      className="min-h-screen flex flex-col overflow-x-clip"
      data-ms-themed
      data-ms-dark={isDarkBg ? "" : undefined}
      data-ms-font={theme.fontFamily ? "" : undefined}
      style={wrapperStyle}
    >
      {/* Top nav — Editorial Wayfinder Bar */}
      <header
        data-wayfinder
        data-scrolled={scrolled ? "" : undefined}
        className="sticky top-0 z-40"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          backgroundColor: scrolled
            ? `color-mix(in srgb, var(--brand-bg, ${theme.background}) 88%, #ffffff)`
            : `color-mix(in srgb, var(--brand-bg, ${theme.background}) 78%, #ffffff)`,
          color: `var(--brand-bg-fg, ${theme.text})`,
          backdropFilter: scrolled
            ? "blur(20px) saturate(140%)"
            : "blur(12px) saturate(130%)",
          WebkitBackdropFilter: scrolled
            ? "blur(20px) saturate(140%)"
            : "blur(12px) saturate(130%)",
          borderBottom: scrolled
            ? `1px solid color-mix(in srgb, var(--brand-bg-fg, ${theme.text}) 14%, transparent)`
            : `1px solid ${theme.border}`,
          transition:
            "background-color 200ms ease, backdrop-filter 200ms ease, border-color 200ms ease",
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3 sm:gap-4">
          {/* ─── Left: brand wordmark (logo / client × Mabbly / fallback) ─── */}
          <div className="flex items-center gap-3 min-w-0 shrink-0">
            <Link
              to="/"
              aria-label="Mabbly home"
              className="flex items-center gap-3 min-w-0 transition-opacity hover:opacity-80"
            >
              {(() => {
                const safeName = isBadName(theme.companyName) ? null : theme.companyName;
                const showLogo = Boolean(theme.logoUrl) && !isBadName(theme.companyName);

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
                          className="hidden md:inline text-[11px] uppercase tracking-[0.28em] font-semibold"
                          style={{ color: `var(--brand-bg-fg, ${theme.text})` }}
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
                      className="text-[11px] uppercase tracking-[0.32em] font-semibold truncate"
                      style={{ color: `var(--brand-bg-fg, ${theme.text})` }}
                    >
                      {safeName}
                    </span>
                  );
                }

                return (
                  <span
                    className="text-[11px] uppercase tracking-[0.32em] font-semibold"
                    style={{ color: MABBLY_GOLD }}
                  >
                    Mabbly · GTM
                  </span>
                );
              })()}
            </Link>

            {/* "× Mabbly" credential — verified non-Mabbly client + logo only. */}
            {theme.logoUrl &&
              !isBadName(theme.companyName) &&
              (theme.companyName ?? "").trim().toLowerCase() !== "mabbly" && (
                <>
                  <span
                    className="hidden sm:inline h-4 w-px"
                    style={{ backgroundColor: `var(--brand-bg-fg, ${theme.border})`, opacity: 0.2 }}
                    aria-hidden
                  />
                  <a
                    href="https://mabbly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline text-[10px] uppercase tracking-[0.32em] font-semibold transition-opacity hover:opacity-80"
                    style={{ color: MABBLY_GOLD }}
                  >
                    × Mabbly
                  </a>
                </>
              )}
          </div>

          {/* ─── Center: live section eyebrow → wayfinder dropdown ─── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`Section ${SECTIONS[activeIndex].num}: ${SECTIONS[activeIndex].label}. Open section menu.`}
                className="wayfinder-eyebrow group hidden sm:inline-flex absolute left-1/2 -translate-x-1/2 items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10.5px] uppercase tracking-[0.18em] font-medium max-w-[44vw] md:max-w-[40vw] transition-opacity hover:opacity-100 focus:outline-none"
                style={{
                  color: `var(--brand-bg-fg, ${theme.text})`,
                  opacity: 0.85,
                }}
              >
                <span
                  className="tabular-nums font-semibold"
                  style={{ color: MABBLY_GOLD }}
                >
                  {SECTIONS[activeIndex].num}
                </span>
                <span aria-hidden style={{ opacity: 0.45 }}>·</span>
                <span className="truncate">{SECTIONS[activeIndex].label}</span>
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 12 12"
                  aria-hidden
                  className="shrink-0 transition-transform group-data-[state=open]:rotate-180"
                  style={{ opacity: 0.5 }}
                >
                  <path
                    d="M2 4l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              sideOffset={10}
              onCloseAutoFocus={(e) => e.preventDefault()}
              className="wayfinder-menu w-[min(92vw,360px)] p-1.5"
              style={{
                backgroundColor: `color-mix(in srgb, var(--brand-bg, ${theme.background}) 92%, #ffffff)`,
                color: `var(--brand-bg-fg, ${theme.text})`,
                borderColor: `color-mix(in srgb, var(--brand-bg-fg, ${theme.text}) 16%, transparent)`,
              }}
            >
              <DropdownMenuLabel
                className="font-mono uppercase tracking-[0.22em] text-[10px] font-medium px-2 py-1.5"
                style={{ opacity: 0.55 }}
              >
                Jump to section
              </DropdownMenuLabel>
              <DropdownMenuSeparator
                style={{
                  backgroundColor: `var(--brand-bg-fg, ${theme.border})`,
                  opacity: 0.12,
                }}
              />
              {SECTIONS.map((s, i) => {
                const isActive = i === activeIndex;
                return (
                  <DropdownMenuItem
                    key={s.id}
                    onSelect={() => handleJumpTo(s.id)}
                    aria-current={isActive ? "location" : undefined}
                    className="wayfinder-item flex items-center gap-3 px-2.5 py-2 rounded-sm cursor-pointer focus:outline-none"
                    style={{
                      color: `var(--brand-bg-fg, ${theme.text})`,
                    }}
                  >
                    <span
                      className="font-mono text-[10px] tabular-nums tracking-[0.14em] font-semibold w-5"
                      style={{
                        color: isActive ? MABBLY_GOLD : `var(--brand-bg-fg, ${theme.text})`,
                        opacity: isActive ? 1 : 0.5,
                      }}
                    >
                      {s.num}
                    </span>
                    <span
                      className="text-[13px] flex-1 truncate"
                      style={{
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {s.label}
                    </span>
                    {isActive ? (
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: MABBLY_GOLD }}
                      />
                    ) : null}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ─── Right: mobile compact wayfinder + solid CTA ─── */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile-only compact section indicator (sm:hidden) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Section ${SECTIONS[activeIndex].num} of ${SECTIONS.length}. Open section menu.`}
                  className="wayfinder-eyebrow sm:hidden inline-flex items-center gap-1 px-2 h-8 min-h-[32px] rounded-full font-mono text-[10px] uppercase tracking-[0.16em] font-semibold focus:outline-none"
                  style={{
                    color: `var(--brand-bg-fg, ${theme.text})`,
                    backgroundColor: `color-mix(in srgb, var(--brand-bg-fg, ${theme.text}) 8%, transparent)`,
                  }}
                >
                  <span style={{ color: MABBLY_GOLD }} className="tabular-nums">
                    {SECTIONS[activeIndex].num}
                  </span>
                  <span aria-hidden style={{ opacity: 0.45 }}>/</span>
                  <span aria-hidden style={{ opacity: 0.7 }} className="tabular-nums">
                    {SECTIONS.length}
                  </span>
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 12 12"
                    aria-hidden
                    style={{ opacity: 0.6, marginLeft: 2 }}
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="wayfinder-menu w-[min(92vw,320px)] p-1.5"
                style={{
                  backgroundColor: `color-mix(in srgb, var(--brand-bg, ${theme.background}) 92%, #ffffff)`,
                  color: `var(--brand-bg-fg, ${theme.text})`,
                  borderColor: `color-mix(in srgb, var(--brand-bg-fg, ${theme.text}) 16%, transparent)`,
                }}
              >
                <DropdownMenuLabel
                  className="font-mono uppercase tracking-[0.22em] text-[10px] font-medium px-2 py-1.5"
                  style={{ opacity: 0.55 }}
                >
                  Jump to section
                </DropdownMenuLabel>
                <DropdownMenuSeparator
                  style={{
                    backgroundColor: `var(--brand-bg-fg, ${theme.border})`,
                    opacity: 0.12,
                  }}
                />
                {SECTIONS.map((s, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <DropdownMenuItem
                      key={s.id}
                      onSelect={() => handleJumpTo(s.id)}
                      aria-current={isActive ? "location" : undefined}
                      className="wayfinder-item flex items-center gap-3 px-2.5 py-2 rounded-sm cursor-pointer focus:outline-none"
                      style={{ color: `var(--brand-bg-fg, ${theme.text})` }}
                    >
                      <span
                        className="font-mono text-[10px] tabular-nums tracking-[0.14em] font-semibold w-5"
                        style={{
                          color: isActive ? MABBLY_GOLD : `var(--brand-bg-fg, ${theme.text})`,
                          opacity: isActive ? 1 : 0.5,
                        }}
                      >
                        {s.num}
                      </span>
                      <span
                        className="text-[13px] flex-1 truncate"
                        style={{ fontWeight: isActive ? 600 : 400 }}
                      >
                        {s.label}
                      </span>
                      {isActive ? (
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: MABBLY_GOLD }}
                        />
                      ) : null}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {firstName ? (
              <p
                className="hidden lg:block text-[10px] uppercase tracking-[0.24em] font-mono"
                style={{
                  color: `var(--brand-bg-fg, ${theme.textMuted})`,
                  opacity: 0.6,
                }}
              >
                For {firstName}
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleBookClick}
              onMouseEnter={() => prewarmCalendly()}
              className="wayfinder-cta inline-flex items-center gap-2 h-9 sm:h-10 min-h-[40px] px-3.5 sm:px-5 rounded-full text-[11px] sm:text-[12.5px] font-semibold tracking-[0.08em] uppercase transition-all hover:translate-y-[-1px] focus:outline-none whitespace-nowrap shrink-0"
              style={{
                backgroundColor: `var(--brand-accent, ${theme.accent})`,
                color: theme.accentForeground,
                boxShadow: scrolled
                  ? `0 6px 18px -6px color-mix(in srgb, var(--brand-accent, ${theme.accent}) 60%, transparent)`
                  : `0 2px 8px -3px color-mix(in srgb, var(--brand-accent, ${theme.accent}) 50%, transparent)`,
              }}
            >
              <span className="hidden sm:inline">Book a Walkthrough</span>
              <span className="sm:hidden">Book</span>
              <span aria-hidden className="text-[1.1em] leading-none">→</span>
            </button>
          </div>

          {/* Progress hairline (Mabbly gold) — fills 0% → 100% across the page */}
          <div
            aria-hidden
            className="wayfinder-progress absolute bottom-0 left-0 h-px"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: MABBLY_GOLD,
              boxShadow: `0 0 6px 0 color-mix(in srgb, ${MABBLY_GOLD} 60%, transparent)`,
            }}
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <Footer />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Anchor offset so jump-to-section lands below the sticky 56px nav. */
        [id^="v10-section-"] { scroll-margin-top: 72px; }

        /* ── Wayfinder nav ──────────────────────────────────────────────── */
        .wayfinder-progress {
          transition: width 140ms linear;
          will-change: width;
        }
        .wayfinder-eyebrow:hover { opacity: 1; }
        .wayfinder-eyebrow:focus-visible,
        .wayfinder-cta:focus-visible {
          outline: 2px solid var(--brand-accent, ${MABBLY_GOLD});
          outline-offset: 3px;
          border-radius: 9999px;
        }
        .wayfinder-eyebrow:hover {
          background-color: color-mix(in srgb, var(--brand-bg-fg, currentColor) 8%, transparent);
        }
        .wayfinder-cta:hover {
          background-color: color-mix(in srgb, var(--brand-accent, ${MABBLY_GOLD}) 88%, #000000);
        }
        .wayfinder-item[data-highlighted] {
          background-color: color-mix(in srgb, var(--brand-accent, ${MABBLY_GOLD}) 14%, transparent);
          outline: none;
        }
        .wayfinder-item:focus-visible {
          outline: 2px solid var(--brand-accent, ${MABBLY_GOLD});
          outline-offset: -2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .wayfinder-progress { transition: none; }
          .wayfinder-cta { transition: none !important; }
          .wayfinder-cta:hover { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
