import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useClientTheme } from "@/hooks/useClientTheme";
import { NAV_VERTICAL_LINKS } from "@/content/verticals";

type Props = {
  forYourFirmHref?: string;
  addYourFirmHref?: string;
  addYourFirmLabel?: string;
  /**
   * When provided (i.e. on a microsite page via MagnetShell), the right-edge
   * CTA renders "Book a Walkthrough →" and calls this handler instead of
   * linking to addYourFirmHref. The visual treatment stays cream/orange to
   * keep the nav consistent with the rest of the site.
   */
  onBookWalkthrough?: () => void;
};

const ArrowSvg = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M2 7h10m0 0L8 3m4 4l-4 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Names the brand pipeline sometimes extracts that we know are wrong (third-
 * party assets, generic alt text, the prospect being Mabbly itself). When the
 * extracted name is one of these we drop the name in the pill and rely on the
 * logo or the "My Map" fallback.
 */
const KNOWN_BAD_COMPANY_NAMES = new Set([
  "griffith foods",
  "griffith",
  "untitled",
  "image",
  "logo",
  "home",
  "mabbly",
]);

function cleanName(name: string | null | undefined): string | null {
  if (!name) return null;
  const k = name.trim();
  if (!k) return null;
  if (KNOWN_BAD_COMPANY_NAMES.has(k.toLowerCase())) return null;
  return k;
}

const RECENT_KEY = "magnet:my_slugs";
const LEGACY_KEY = "magnet:my_slug";

function readRecentSlugs(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((s): s is string => typeof s === "string" && !!s);
      }
    }
    const legacy = localStorage.getItem(LEGACY_KEY);
    return legacy ? [legacy] : [];
  } catch {
    return [];
  }
}

type PillProps = {
  slug: string;
  active: boolean;
  variant: "nav" | "menu";
  onClick?: () => void;
};

function MyMicrositePill({ slug, active, variant, onClick }: PillProps) {
  const theme = useClientTheme(slug);
  const logo = theme.logoUrl;
  const name = cleanName(theme.companyName);
  const className =
    variant === "nav"
      ? `vnav-mine${active ? " vnav-mine--active" : ""}`
      : `vnav-menu-row${active ? " vnav-menu-row--active" : ""}`;

  return (
    <a
      className={className}
      href={`/m/${slug}`}
      aria-label={
        active
          ? `Your ${name ?? "microsite"} (current)`
          : `Enter your ${name ?? "microsite"}`
      }
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      {logo ? (
        <img
          src={logo}
          alt=""
          className="vnav-mine-logo"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <span className="vnav-mine-dot" aria-hidden />
      )}
      <span className="vnav-mine-label">{name ?? "My Map"}</span>
      {active ? (
        <span className="vnav-mine-status" aria-hidden>•</span>
      ) : (
        <span className="vnav-mine-arrow" aria-hidden>→</span>
      )}
    </a>
  );
}

export default function VerticalNavBar({
  forYourFirmHref = "#verticals",
  addYourFirmHref = "#begin",
  addYourFirmLabel = "Add Your Firm",
  onBookWalkthrough,
}: Props) {
  const [mySlugs, setMySlugs] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [firmMenuOpen, setFirmMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firmMenuRef = useRef<HTMLDivElement | null>(null);
  const firmCloseTimer = useRef<number | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setMySlugs(readRecentSlugs());
  }, []);

  useEffect(() => {
    if (!menuOpen && !firmMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuOpen && menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
      if (firmMenuOpen && firmMenuRef.current && !firmMenuRef.current.contains(target)) {
        setFirmMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setFirmMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, firmMenuOpen]);

  const cancelFirmClose = () => {
    if (firmCloseTimer.current !== null) {
      window.clearTimeout(firmCloseTimer.current);
      firmCloseTimer.current = null;
    }
  };
  const scheduleFirmClose = () => {
    cancelFirmClose();
    firmCloseTimer.current = window.setTimeout(() => setFirmMenuOpen(false), 120);
  };

  const isActiveSlug = (slug: string) => pathname.startsWith(`/m/${slug}`);
  const activeSlug = mySlugs.find(isActiveSlug) ?? mySlugs[0] ?? null;
  const showCalendlyCta = !!onBookWalkthrough;

  return (
    <>
      <style>{CSS}</style>
      <nav className="vnav">
        <div className="vnav-inner">
          <a className="vnav-logo" href="/discover">
            Discover<span className="vnav-pip"> · </span>Mabbly
          </a>
          <div className="vnav-links">
            <div
              className="vnav-firm"
              ref={firmMenuRef}
              onMouseEnter={() => {
                cancelFirmClose();
                setFirmMenuOpen(true);
              }}
              onMouseLeave={scheduleFirmClose}
            >
              <button
                type="button"
                className="vnav-link vnav-firm-trigger"
                aria-haspopup="menu"
                aria-expanded={firmMenuOpen}
                onClick={() => setFirmMenuOpen((v) => !v)}
                onFocus={cancelFirmClose}
              >
                For Your Firm
                <span className="vnav-firm-caret" aria-hidden>▾</span>
              </button>
              {firmMenuOpen && (
                <div
                  className="vnav-firm-panel"
                  role="menu"
                  onMouseEnter={cancelFirmClose}
                  onMouseLeave={scheduleFirmClose}
                >
                  <div className="vnav-menu-heading">For Your Firm</div>
                  {NAV_VERTICAL_LINKS.map((item) => {
                    const href = `/${item.slug}`;
                    const active = pathname === href;
                    return (
                      <a
                        key={item.slug}
                        href={href}
                        role="menuitem"
                        className={`vnav-firm-row${active ? " vnav-firm-row--active" : ""}`}
                        onClick={() => setFirmMenuOpen(false)}
                      >
                        <span className="vnav-firm-row-label">{item.label}</span>
                        <span className="vnav-firm-row-arrow" aria-hidden>→</span>
                      </a>
                    );
                  })}
                  <a
                    href={forYourFirmHref}
                    role="menuitem"
                    className="vnav-firm-row vnav-firm-row--all"
                    onClick={() => setFirmMenuOpen(false)}
                  >
                    <span className="vnav-firm-row-label">See all verticals</span>
                    <span className="vnav-firm-row-arrow" aria-hidden>→</span>
                  </a>
                </div>
              )}
            </div>
            <a className="vnav-link" href="/awards">Awards</a>
            <a
              className="vnav-link"
              href="https://www.youtube.com/@GTMforPS"
              target="_blank"
              rel="noopener noreferrer"
            >
              Podcast
            </a>
            {mySlugs.length === 1 && (
              <MyMicrositePill
                slug={mySlugs[0]}
                active={isActiveSlug(mySlugs[0])}
                variant="nav"
              />
            )}
            {mySlugs.length >= 2 && activeSlug && (
              <div className="vnav-menu" ref={menuRef}>
                <button
                  type="button"
                  className={`vnav-mine vnav-mine--trigger${
                    isActiveSlug(activeSlug) ? " vnav-mine--active" : ""
                  }`}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <MyMicrositePillFace
                    slug={activeSlug}
                    active={isActiveSlug(activeSlug)}
                    count={mySlugs.length}
                  />
                </button>
                {menuOpen && (
                  <div className="vnav-menu-panel" role="menu">
                    <div className="vnav-menu-heading">Your Microsites</div>
                    {mySlugs.map((slug) => (
                      <MyMicrositePill
                        key={slug}
                        slug={slug}
                        active={isActiveSlug(slug)}
                        variant="menu"
                        onClick={() => setMenuOpen(false)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {showCalendlyCta ? (
              <button
                type="button"
                className="vnav-cta"
                onClick={onBookWalkthrough}
              >
                Book a Walkthrough
                <ArrowSvg />
              </button>
            ) : (
              <a className="vnav-cta" href={addYourFirmHref}>
                {addYourFirmLabel}
                <ArrowSvg />
              </a>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

function MyMicrositePillFace({
  slug,
  active,
  count,
}: {
  slug: string;
  active: boolean;
  count: number;
}) {
  const theme = useClientTheme(slug);
  const logo = theme.logoUrl;
  const name = cleanName(theme.companyName);
  return (
    <>
      {logo ? (
        <img
          src={logo}
          alt=""
          className="vnav-mine-logo"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <span className="vnav-mine-dot" aria-hidden />
      )}
      <span className="vnav-mine-label">{name ?? "My Maps"}</span>
      <span className="vnav-mine-count" aria-hidden>{count}</span>
      {active ? (
        <span className="vnav-mine-status" aria-hidden>•</span>
      ) : (
        <span className="vnav-mine-arrow" aria-hidden>▾</span>
      )}
    </>
  );
}

const CSS = `
.vnav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(248, 242, 229, 0.92);
  backdrop-filter: saturate(140%) blur(12px);
  -webkit-backdrop-filter: saturate(140%) blur(12px);
  border-bottom: 1px solid #E5E0CF;
  font-family: 'Inter', 'Inter Tight', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}
.vnav-inner {
  max-width: 1180px; margin: 0 auto; padding: 14px 32px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.vnav-logo {
  font-family: 'Mabbly Repro', 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif;
  font-weight: 900; font-size: 16px; letter-spacing: -0.02em;
  color: #0F1E1D; text-decoration: none;
}
.vnav-pip { color: #BF461A; }
.vnav-links { display: inline-flex; align-items: center; gap: 20px; }
.vnav-link {
  font-family: 'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace;
  font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
  font-weight: 600; color: #0F1E1D; text-decoration: none; padding-bottom: 1px;
  border-bottom: 1px solid transparent;
  transition: color 0.25s cubic-bezier(0.13, 0.28, 0.3, 1), border-color 0.25s cubic-bezier(0.13, 0.28, 0.3, 1);
}
.vnav-link:hover { color: #BF461A; border-bottom-color: #BF461A; }
.vnav-mine {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 5px 12px 5px 6px;
  border: 1px solid rgba(15, 30, 29, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  text-decoration: none; color: #0F1E1D;
  transition: border-color 0.25s cubic-bezier(0.13, 0.28, 0.3, 1), background 0.25s cubic-bezier(0.13, 0.28, 0.3, 1), transform 0.25s cubic-bezier(0.13, 0.28, 0.3, 1);
  max-width: 260px;
}
.vnav-mine:hover {
  border-color: #BF461A;
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-1px);
}
.vnav-mine--active {
  border-color: #BF461A;
  background: rgba(191, 70, 26, 0.08);
}
.vnav-mine--active:hover {
  background: rgba(191, 70, 26, 0.14);
  transform: none;
}
.vnav-mine--trigger {
  font: inherit; cursor: pointer;
}
.vnav-mine-logo {
  width: 22px; height: 22px; border-radius: 999px;
  object-fit: contain; background: #fff;
  border: 1px solid rgba(15, 30, 29, 0.08);
  flex-shrink: 0;
}
.vnav-mine-dot {
  width: 8px; height: 8px; border-radius: 999px;
  background: #BF461A; margin-left: 6px;
  flex-shrink: 0;
}
.vnav-mine-label {
  font-family: 'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  font-weight: 700;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 160px;
}
.vnav-mine-count {
  font-family: 'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace;
  font-size: 9px; font-weight: 700;
  padding: 1px 6px; border-radius: 999px;
  background: rgba(15, 30, 29, 0.08); color: #0F1E1D;
}
.vnav-mine-arrow {
  color: #BF461A; font-weight: 700; font-size: 11px;
  transition: transform 0.25s cubic-bezier(0.13, 0.28, 0.3, 1);
}
.vnav-mine-status {
  color: #BF461A; font-size: 14px; line-height: 1;
  animation: vnavPulse 1.8s ease-in-out infinite;
}
@keyframes vnavPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.vnav-mine:hover .vnav-mine-arrow { transform: translateX(2px); }

.vnav-menu { position: relative; display: inline-flex; }
.vnav-menu-panel {
  position: absolute; top: calc(100% + 8px); right: 0;
  min-width: 240px; max-width: 320px;
  background: #FBF7EC;
  border: 1px solid #E5E0CF;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(15, 30, 29, 0.12);
  padding: 8px;
  display: flex; flex-direction: column; gap: 2px;
  z-index: 110;
}
.vnav-menu-heading {
  font-family: 'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace;
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  font-weight: 700; color: #6B5F47;
  padding: 8px 10px 4px;
}
.vnav-menu-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  text-decoration: none; color: #0F1E1D;
  transition: background 0.2s cubic-bezier(0.13, 0.28, 0.3, 1);
}
.vnav-menu-row:hover { background: rgba(191, 70, 26, 0.08); }
.vnav-menu-row--active { background: rgba(191, 70, 26, 0.12); }
.vnav-menu-row--active:hover { background: rgba(191, 70, 26, 0.16); }
.vnav-menu-row .vnav-mine-label { max-width: 200px; flex: 1; }

.vnav-cta {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; background: #BF461A; color: #F8F2E5;
  border: 2px solid #BF461A; border-radius: 22px;
  font-family: 'Mabbly Repro', 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif;
  font-weight: 900; font-size: 10px; letter-spacing: 0.10em;
  text-transform: uppercase; text-decoration: none;
  cursor: pointer;
  transition: background 0.3s cubic-bezier(0.13, 0.28, 0.3, 1), border-color 0.3s cubic-bezier(0.13, 0.28, 0.3, 1), transform 0.3s cubic-bezier(0.13, 0.28, 0.3, 1);
}
.vnav-cta:hover { background: #0F1E1D; border-color: #0F1E1D; transform: translateY(-1px); }
.vnav-cta svg { transition: transform 0.3s cubic-bezier(0.13, 0.28, 0.3, 1); }
.vnav-cta:hover svg { transform: translateX(2px); }

.vnav-firm { position: relative; display: inline-flex; }
.vnav-firm-trigger {
  background: transparent; border: 0; cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0 0 1px;
  border-bottom: 1px solid transparent;
}
.vnav-firm-trigger:focus-visible { outline: 2px solid #BF461A; outline-offset: 4px; }
.vnav-firm-caret {
  font-size: 9px; line-height: 1;
  color: #BF461A;
  transition: transform 0.25s cubic-bezier(0.13, 0.28, 0.3, 1);
}
.vnav-firm-trigger[aria-expanded="true"] .vnav-firm-caret { transform: rotate(-180deg); }
.vnav-firm-panel {
  position: absolute; top: calc(100% + 12px); left: 50%;
  transform: translateX(-50%);
  min-width: 280px; max-width: 340px;
  background: #FBF7EC;
  border: 1px solid #E5E0CF;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(15, 30, 29, 0.12);
  padding: 8px;
  display: flex; flex-direction: column; gap: 2px;
  z-index: 110;
}
.vnav-firm-row {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none; color: #0F1E1D;
  transition: background 0.2s cubic-bezier(0.13, 0.28, 0.3, 1);
}
.vnav-firm-row:hover { background: rgba(191, 70, 26, 0.08); }
.vnav-firm-row--active { background: rgba(191, 70, 26, 0.12); }
.vnav-firm-row--active:hover { background: rgba(191, 70, 26, 0.16); }
.vnav-firm-row-label {
  font-family: 'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace;
  font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
  font-weight: 700;
}
.vnav-firm-row-arrow {
  color: #BF461A; font-weight: 700; font-size: 12px;
  transition: transform 0.2s cubic-bezier(0.13, 0.28, 0.3, 1);
}
.vnav-firm-row:hover .vnav-firm-row-arrow { transform: translateX(3px); }
.vnav-firm-row--all {
  margin-top: 4px;
  border-top: 1px solid #E5E0CF;
  border-radius: 0 0 8px 8px;
  padding-top: 12px;
}
.vnav-firm-row--all .vnav-firm-row-label { color: #6B5F47; }

@media (max-width: 980px) {
  .vnav-links > .vnav-link,
  .vnav-links > .vnav-firm { display: none; }
  .vnav-links > .vnav-mine,
  .vnav-links > .vnav-menu { display: inline-flex; }
}
`;
