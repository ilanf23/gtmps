interface Props {
  opacity?: number;
  className?: string;
  blendMode?: "normal" | "overlay" | "multiply" | "soft-light";
}

const noiseUrl =
  "data:image/svg+xml,%3Csvg viewBox='0 0 320 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.72  0 0 0 0 0.58  0 0 0 0 0.23  0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const PaperGrain = ({ opacity = 0.035, className = "", blendMode = "overlay" }: Props) => (
  <div
    aria-hidden
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      backgroundImage: `url("${noiseUrl}")`,
      opacity,
      mixBlendMode: blendMode,
    }}
  />
);

export default PaperGrain;
