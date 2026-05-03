interface Props {
  className?: string;
  opacity?: number;
}

/**
 * Abstract topographic / contour map. Fits the "Build Your MAP" metaphor.
 * Pure SVG - no external assets.
 */
const TopographicBackground = ({ className = "", opacity = 0.08 }: Props) => (
  <svg
    aria-hidden
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    viewBox="0 0 1200 700"
    preserveAspectRatio="xMidYMid slice"
    style={{ opacity }}
  >
    <defs>
      <linearGradient id="topo-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(168, 146, 58,0)" />
        <stop offset="50%" stopColor="rgba(168, 146, 58,1)" />
        <stop offset="100%" stopColor="rgba(168, 146, 58,0)" />
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#topo-fade)" strokeWidth="1">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
        const r = 60 + i * 80;
        return (
          <ellipse
            key={i}
            cx={780 + i * 8}
            cy={340 + i * 6}
            rx={r}
            ry={r * 0.62}
            transform={`rotate(${-12 + i * 2} ${780 + i * 8} ${340 + i * 6})`}
          />
        );
      })}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const r = 50 + i * 60;
        return (
          <ellipse
            key={`b-${i}`}
            cx={220 - i * 10}
            cy={520 - i * 8}
            rx={r}
            ry={r * 0.7}
            transform={`rotate(${22 - i * 2} ${220 - i * 10} ${520 - i * 8})`}
          />
        );
      })}
    </g>
  </svg>
);

export default TopographicBackground;
