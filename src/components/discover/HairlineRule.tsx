interface Props {
  variant?: "gold" | "ink";
  double?: boolean;
  vertical?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const HairlineRule = ({ variant = "gold", double, vertical, className = "", style }: Props) => {
  if (vertical) {
    const color =
      variant === "gold"
        ? "linear-gradient(to bottom, transparent, rgba(184,147,58,0.45), transparent)"
        : "linear-gradient(to bottom, transparent, rgba(0,0,0,0.16), transparent)";
    return (
      <span
        aria-hidden
        className={className}
        style={{ display: "inline-block", width: 1, height: "100%", background: color, ...style }}
      />
    );
  }

  if (double) {
    return (
      <div
        aria-hidden
        className={className}
        style={{
          height: 5,
          borderTop: `1px solid ${variant === "gold" ? "rgba(184,147,58,0.55)" : "rgba(0,0,0,0.18)"}`,
          borderBottom: `1px solid ${variant === "gold" ? "rgba(184,147,58,0.55)" : "rgba(0,0,0,0.18)"}`,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`${variant === "gold" ? "hairline-rule-gold" : "hairline-rule-ink"} ${className}`}
      style={style}
    />
  );
};

export default HairlineRule;
