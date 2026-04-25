import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  attribution?: ReactNode;
  caption?: string;
  tone?: "dark" | "light";
  size?: "lg" | "xl";
}

const tones = {
  dark: { quote: "#F5F1E8", attr: "#B8933A", sub: "rgba(245,241,232,0.55)" },
  light: { quote: "#2D2A26", attr: "#8B7F3F", sub: "#6B6560" },
};

const PullQuote = ({ children, attribution, caption, tone = "dark", size = "lg" }: Props) => {
  const c = tones[tone];
  const fs =
    size === "xl"
      ? "clamp(28px, 3.2vw, 40px)"
      : "clamp(22px, 2.4vw, 32px)";
  return (
    <figure className="relative" style={{ paddingLeft: 0 }}>
      <span
        aria-hidden
        className="font-display absolute select-none pointer-events-none"
        style={{
          fontSize: 120,
          lineHeight: 1,
          color: "rgba(184,147,58,0.18)",
          left: -8,
          top: -28,
          fontWeight: 600,
        }}
      >
        “
      </span>
      <blockquote
        className="font-display relative"
        style={{
          color: c.quote,
          fontSize: fs,
          lineHeight: 1.4,
          fontWeight: 500,
          letterSpacing: "-0.012em",
          paddingLeft: 28,
          borderLeft: "2px solid rgba(184,147,58,0.65)",
        }}
      >
        {children}
      </blockquote>
      {(attribution || caption) && (
        <figcaption className="mt-5" style={{ paddingLeft: 30 }}>
          {attribution && (
            <span
              className="font-display font-semibold block"
              style={{ color: c.quote, fontSize: 14, letterSpacing: "0.01em" }}
            >
              {attribution}
            </span>
          )}
          {caption && (
            <span
              className="font-mono uppercase block mt-1.5"
              style={{ color: c.sub, fontSize: 10, letterSpacing: "0.18em" }}
            >
              {caption}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
};

export default PullQuote;
