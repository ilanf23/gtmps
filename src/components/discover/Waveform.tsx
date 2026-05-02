interface Props {
  bars?: number;
  className?: string;
  color?: string;
  height?: number;
}

/**
 * Static editorial waveform — a designed shape, not animated.
 * 30 bars of varying heights using a deterministic "song-like" envelope so
 * each render is identical and feels intentional, not random.
 */
const heights = [
  0.20, 0.32, 0.42, 0.34, 0.55, 0.68, 0.50, 0.72, 0.86, 0.62,
  0.42, 0.58, 0.78, 0.94, 0.74, 0.52, 0.38, 0.46, 0.66, 0.84,
  0.96, 0.72, 0.54, 0.36, 0.48, 0.62, 0.42, 0.30, 0.22, 0.16,
];

const Waveform = ({ className = "", color = "#A8923A", height = 80 }: Props) => (
  <div
    aria-hidden
    className={`flex items-center gap-[3px] ${className}`}
    style={{ height }}
  >
    {heights.map((h, i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          width: 3,
          height: `${Math.max(h * 100, 6)}%`,
          background: color,
          opacity: 0.55 + h * 0.45,
          borderRadius: 2,
        }}
      />
    ))}
  </div>
);

export default Waveform;
