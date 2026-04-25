interface Props {
  src: string;
  alt: string;
  className?: string;
  filterId?: string;
  /** Aspect ratio width/height. Default 4:5 (editorial). */
  ratio?: string;
}

/**
 * Renders a portrait through an SVG duotone filter (gold + ink).
 * The filter maps luminance to a gradient between #1A1410 (shadow) and #C9A845 (highlight).
 */
const DuotonePortrait = ({
  src,
  alt,
  className = "",
  filterId = "duotone-gold",
  ratio = "4 / 5",
}: Props) => (
  <div
    className={`relative overflow-hidden ${className}`}
    style={{
      aspectRatio: ratio,
      border: "1px solid rgba(184,147,58,0.45)",
      boxShadow: "0 24px 48px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(184,147,58,0.15) inset",
      background: "#0A0A0A",
    }}
  >
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id={filterId} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.33 0.33 0.33 0 0
              0.33 0.33 0.33 0 0
              0.33 0.33 0.33 0 0
              0    0    0    1 0"
          />
          <feComponentTransfer>
            {/* Map luminance to a gold gradient: shadow #1A1410, highlight #E8C76A */}
            <feFuncR tableValues="0.10 0.20 0.42 0.62 0.82 0.91" type="table" />
            <feFuncG tableValues="0.08 0.16 0.34 0.50 0.68 0.78" type="table" />
            <feFuncB tableValues="0.06 0.10 0.18 0.26 0.36 0.42" type="table" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>

    <img
      src={src}
      alt={alt}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: `url(#${filterId})`,
        display: "block",
      }}
    />

    {/* Paper grain overlay */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 320 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        opacity: 0.07,
        mixBlendMode: "overlay",
      }}
    />

    {/* Gold edge highlight on right + bottom — reads as foil stamp */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "linear-gradient(120deg, transparent 60%, rgba(232,199,106,0.12) 78%, transparent 88%)",
      }}
    />
  </div>
);

export default DuotonePortrait;
