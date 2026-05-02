// Slot 03 — ReceiptsStrip.
//
// First-quarter editorial moment: named firms with quantified results.
// "Receipts beat claims." Light editorial pacing — cream ground, ink text,
// warm gold for stat callouts, mint hairline borders.
//
// Numbers are sourced from existing surfaces (AuthorityStrip stats,
// WarStory's Madcraft outcome) so this strip never fabricates a figure.
// Firms without a hard number get a neutral context line.

const RECEIPTS = [
  {
    firm: "AArete",
    result: "$125M",
    context: "Revenue scaled as CMO",
  },
  {
    firm: "A.T. Kearney",
    result: "$1.2B",
    context: "From $250M, as practitioner",
  },
  {
    firm: "Madcraft",
    result: "$400K",
    context: "Reactivated in 7 minutes",
  },
  {
    firm: "SPR",
    result: "Anchor",
    context: "Long-term GTM partner",
  },
  {
    firm: "Workiva",
    result: "Anchor",
    context: "GTM advisory engagement",
  },
];

export default function ReceiptsStrip() {
  return (
    <section
      id="receipts"
      className="px-6 md:px-10"
      style={{
        background: "#FBF8F4",
        borderTop: "1px solid rgba(15, 30, 29, 0.08)",
        borderBottom: "1px solid rgba(15, 30, 29, 0.08)",
        paddingTop: "clamp(72px, 10vw, 128px)",
        paddingBottom: "clamp(72px, 10vw, 128px)",
      }}
    >
      <style>{`
        .rcpt-grid {
          display: grid;
          gap: 0;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          border-top: 1px solid #D5DEC2;
        }
        @media (min-width: 640px) {
          .rcpt-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1024px) {
          .rcpt-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        }
        .rcpt-cell {
          padding: 36px 28px 32px;
          border-bottom: 1px solid #D5DEC2;
          border-right: 1px solid #D5DEC2;
          transition: background 220ms ease;
        }
        .rcpt-cell:last-child { border-right: 1px solid #D5DEC2; }
        @media (max-width: 639px) {
          .rcpt-cell { border-right: none; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .rcpt-cell:nth-child(2n) { border-right: none; }
        }
        @media (min-width: 1024px) {
          .rcpt-cell:last-child { border-right: none; }
        }
        .rcpt-cell:hover {
          background: #EDF5EC;
        }
      `}</style>

      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ maxWidth: 760, margin: "0 auto 56px", textAlign: "center" }}>
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
              background: "linear-gradient(90deg, #A8923A, #C4AC4A)",
              margin: "18px auto 28px",
              animation: "growRule 0.8s ease both",
            }}
          />
          <h2
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 500,
              color: "#0F1E1D",
              lineHeight: 1.0,
              letterSpacing: "-0.035em",
              margin: "0 0 18px",
            }}
          >
            Receipts beat claims.
          </h2>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: "clamp(17px, 1.6vw, 20px)",
              lineHeight: 1.55,
              color: "rgba(15, 30, 29, 0.66)",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Five named firms. Hard outcomes. The same playbook now in the book.
          </p>
        </div>

        <ul
          className="rcpt-grid"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {RECEIPTS.map((r) => (
            <li key={r.firm} className="rcpt-cell">
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(15, 30, 29, 0.5)",
                  margin: "0 0 18px",
                  fontWeight: 500,
                }}
              >
                {r.firm}
              </p>
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: "clamp(28px, 2.6vw, 36px)",
                  fontWeight: 700,
                  color: "#A8923A",
                  margin: "0 0 10px",
                  lineHeight: 1.0,
                  letterSpacing: "-0.025em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {r.result}
              </p>
              <p
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "rgba(15, 30, 29, 0.66)",
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
