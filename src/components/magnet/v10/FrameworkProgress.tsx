// FrameworkProgress - horizontal stepped indicator for the five-layer
// RROS framework: DISCOVER → PROVE → DESIGN → ACTIVATE → COMPOUND.
// Replaces the existing static stats row inside the orbit/system sections.
//
// Spec: §3.9 of the audit. Light editorial register; current-stage in
// brand-accent, completed stages in ink, upcoming in muted ink.

interface Props {
  /** Index of the buyer's current stage (0-4). */
  currentStage?: number;
  /** Brand accent for the active node. */
  primary?: string;
  /** Optional subhead caption above the row. */
  caption?: string;
}

const STAGES = ["Discover", "Prove", "Design", "Activate", "Compound"];

export default function FrameworkProgress({
  currentStage = 1,
  primary = "#A8923A",
  caption,
}: Props) {
  const clamped = Math.max(0, Math.min(STAGES.length - 1, currentStage));

  return (
    <figure data-testid="framework-progress" className="w-full" style={{ margin: 0 }}>
      {caption && (
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(15, 30, 29, 0.55)",
            margin: "0 0 16px",
            fontWeight: 500,
          }}
        >
          {caption}
        </p>
      )}

      <div
        className="relative w-full"
        style={{
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        {/* Track */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 28,
            left: 16,
            right: 16,
            height: 2,
            background: "rgba(15, 30, 29, 0.08)",
            borderRadius: 1,
          }}
        />
        {/* Filled track up to current stage */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 28,
            left: 16,
            width: `calc(${(clamped / (STAGES.length - 1)) * 100}% - 32px * ${clamped / (STAGES.length - 1)})`,
            height: 2,
            background: `var(--brand-accent, ${primary})`,
            borderRadius: 1,
            transition: "width 480ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        <ol
          className="relative flex items-start"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            justifyContent: "space-between",
          }}
        >
          {STAGES.map((s, i) => {
            const isCurrent = i === clamped;
            const isCompleted = i < clamped;
            const dotBg = isCurrent
              ? `var(--brand-accent, ${primary})`
              : isCompleted
                ? "#0F1E1D"
                : "#FBF8F4";
            const dotBorder = isCurrent || isCompleted
              ? `var(--brand-accent, ${primary})`
              : "rgba(15, 30, 29, 0.2)";
            const labelColor = isCurrent
              ? "#0F1E1D"
              : "rgba(15, 30, 29, 0.5)";
            const labelWeight = isCurrent ? 600 : 500;
            return (
              <li
                key={s}
                aria-current={isCurrent ? "step" : undefined}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  flex: "0 0 auto",
                  minWidth: 64,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: isCurrent ? 16 : 12,
                    height: isCurrent ? 16 : 12,
                    borderRadius: 999,
                    background: dotBg,
                    border: `2px solid ${dotBorder}`,
                    marginTop: isCurrent ? 20 : 22,
                    transition: "all 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                    boxShadow: isCurrent
                      ? `0 0 0 4px color-mix(in srgb, var(--brand-accent, ${primary}) 12%, transparent)`
                      : undefined,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: labelColor,
                    fontWeight: labelWeight,
                    whiteSpace: "nowrap",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} · {s}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </figure>
  );
}
