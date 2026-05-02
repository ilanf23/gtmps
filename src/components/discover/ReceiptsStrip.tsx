// Slot 03 — ReceiptsStrip.
//
// First-quarter editorial moment: named firms with quantified results.
// "Receipts beat claims." Pulled into the first quarter per audit
// feedback-round-1 §B.1.9 (homepage IA re-rank).
//
// Numbers are sourced from existing surfaces (AuthorityStrip stats,
// WarStory's Madcraft outcome) so this strip never fabricates a figure.
// Firms without a hard number get a neutral context line; the editorial
// payoff comes from the firm name itself, not the gloss.

const RECEIPTS = [
  {
    firm: "AArete",
    result: "$125M",
    context: "Revenue as CMO",
  },
  {
    firm: "A.T. Kearney",
    result: "$250M → $1.2B",
    context: "Scaled as practitioner",
  },
  {
    firm: "Madcraft",
    result: "$400K in 7 min",
    context: "Dead Zone reactivation",
  },
  {
    firm: "SPR",
    result: "Long-term partner",
    context: "Relationship Revenue OS, applied",
  },
  {
    firm: "Workiva",
    result: "Anchor engagement",
    context: "GTM advisory partner",
  },
];

export default function ReceiptsStrip() {
  return (
    <section
      id="receipts"
      className="px-6 md:px-10"
      style={{
        background: "#08070a",
        borderTop: "1px solid rgba(168, 146, 58,0.1)",
        borderBottom: "1px solid rgba(168, 146, 58,0.1)",
        paddingTop: "clamp(64px, 9vw, 112px)",
        paddingBottom: "clamp(64px, 9vw, 112px)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#A8923A",
            margin: 0,
            fontWeight: 500,
          }}
        >
          03 · Receipts
        </p>
        <div
          aria-hidden
          style={{
            width: 44,
            height: 2,
            background: "linear-gradient(90deg, #A8923A, rgba(168, 146, 58,0.3))",
            margin: "18px 0 28px",
            animation: "growRule 0.8s ease both",
          }}
        />
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5.5vw, 56px)",
            fontWeight: 400,
            color: "#EDF5EC",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: "0 0 16px",
            maxWidth: 760,
          }}
        >
          Receipts beat claims.
        </h2>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: "clamp(16px, 1.4vw, 18px)",
            lineHeight: 1.6,
            color: "rgba(237, 245, 236,0.7)",
            margin: "0 0 56px",
            maxWidth: 640,
            fontWeight: 400,
          }}
        >
          Five named firms. Hard outcomes. The same playbook now in the book.
        </p>

        <ul
          className="rs-grid"
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <style>{`
            @media (min-width: 640px) {
              .rs-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            }
            @media (min-width: 1024px) {
              .rs-grid { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; gap: 14px !important; }
            }
            .rs-card {
              transition: border-color 220ms ease, background 220ms ease, transform 220ms ease;
            }
            .rs-card:hover {
              border-color: rgba(168, 146, 58,0.55) !important;
              background: rgba(255,255,255,0.04) !important;
              transform: translateY(-2px);
            }
          `}</style>
          {RECEIPTS.map((r) => (
            <li
              key={r.firm}
              className="rs-card"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(168, 146, 58,0.18)",
                borderRadius: 4,
                padding: "22px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minHeight: 148,
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(168, 146, 58,0.85)",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {r.firm}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#EDF5EC",
                  margin: "auto 0 4px",
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                }}
              >
                {r.result}
              </p>
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "rgba(237, 245, 236,0.55)",
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {r.context}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
