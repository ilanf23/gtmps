interface Props {
  n: string;
  tone?: "gold" | "ink" | "cream";
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const colors = {
  gold: "rgba(184,147,58,0.85)",
  ink: "rgba(20,18,16,0.6)",
  cream: "rgba(245,241,232,0.5)",
} as const;

const EditorialNumeral = ({ n, tone = "gold", size = 96, className = "", style }: Props) => (
  <span
    aria-hidden
    className={`font-display select-none pointer-events-none ${className}`}
    style={{
      fontSize: size,
      lineHeight: 0.85,
      letterSpacing: "-0.04em",
      color: colors[tone],
      fontWeight: 500,
      ...style,
    }}
  >
    {n}
  </span>
);

export default EditorialNumeral;
