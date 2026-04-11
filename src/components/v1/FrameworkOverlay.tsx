const stages = [
  { num: "01", name: "Discover", tag: "Intelligence", note: "Free · Always" },
  { num: "02", name: "Prove", tag: "Credibility", note: "Sprint · Free <$200K" },
  { num: "03", name: "Design", tag: "Architecture", note: "Paid · Engagement begins" },
  { num: "04", name: "Activate", tag: "Execution", note: "Paid · All channels live" },
  { num: "05", name: "Compound", tag: "Intelligence", note: "Retained · AI layer active", isCompound: true },
];

const orbits = [
  { num: "01 · Core", name: "Proof", desc: "Best stories" },
  { num: "02 · Active", name: "Current", desc: "Active clients" },
  { num: "03 · Dead Zone", name: "Dormant", desc: "Highest ROI layer", isDead: true },
  { num: "04 · Adjacent", name: "Warm", desc: "Referral network" },
  { num: "05 · Gravity", name: "New", desc: "ICP matched market" },
];

const FrameworkOverlay = ({ visible }: { visible: boolean }) => {
  return (
    <div
      className="absolute left-1/2 z-30 w-full"
      style={{
        maxWidth: 720,
        bottom: "100%",
        marginBottom: 12,
        transform: "translateX(-50%)",
        opacity: visible ? 1 : 0,
        scale: visible ? "1" : "0.96",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.3s ease, scale 0.3s ease",
      }}
    >
      <div
        className="rounded-lg overflow-hidden pointer-events-auto"
        style={{
          background: "hsl(var(--cream))",
          border: "1px solid rgba(184,147,58,0.25)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1)",
          padding: "36px 40px 28px",
        }}
      >
        <p
          className="font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: 4, color: "#D85A30", marginBottom: 8, fontWeight: 600 }}
        >
          THE RROS PROCESS™
        </p>
        <h3
          className="font-serif"
          style={{ fontSize: 28, fontWeight: 600, color: "#1A0A00", lineHeight: 1.1, marginBottom: 5 }}
        >
          The Relationship Revenue OS
        </h3>
        <p
          className="font-sans uppercase"
          style={{ fontSize: 10.5, letterSpacing: 2, color: "var(--gold)", marginBottom: 28 }}
        >
          GTM FOR PROFESSIONAL SERVICES &nbsp;·&nbsp; MABBLY &nbsp;·&nbsp; SIGNAL ACTIVATED GROWTH
        </p>

        <div className="grid grid-cols-5 gap-1" style={{ marginBottom: 5 }}>
          {stages.map((s, i) => (
            <div
              key={s.num}
              className="rounded text-center relative"
              style={{
                background: s.isCompound ? "#100600" : "#281200",
                padding: "14px 6px 12px",
                outline: s.isCompound ? "0.5px solid rgba(184,146,42,0.35)" : "none",
                outlineOffset: -1,
              }}
            >
              {i > 0 && (
                <span
                  className="absolute"
                  style={{ left: -7, top: "50%", transform: "translateY(-58%)", color: "#D85A30", fontSize: 15, zIndex: 2 }}
                >
                  ›
                </span>
              )}
              <span className="block font-sans" style={{ fontSize: 8, color: "var(--gold)", letterSpacing: 0.8, opacity: 0.65, marginBottom: 5 }}>
                {s.num}
              </span>
              <span className="block font-sans" style={{ fontSize: 16, fontWeight: 600, color: "#F5EDD8", letterSpacing: 0.3, marginBottom: 3 }}>
                {s.name}
              </span>
              <span className="block font-sans" style={{ fontSize: 8.5, color: "#D4AE5A", marginBottom: 6 }}>
                {s.tag}
              </span>
              <span className="block font-sans" style={{ fontSize: 7.5, color: "rgba(245,237,216,0.28)" }}>
                {s.note}
              </span>
            </div>
          ))}
        </div>

        <p
          className="font-sans uppercase"
          style={{ fontSize: 8, fontWeight: 500, letterSpacing: 2.5, color: "#7A5810", marginTop: 18, marginBottom: 7 }}
        >
          YOUR RELATIONSHIP UNIVERSE &nbsp;·&nbsp; FIVE ORBITS
        </p>

        <div className="grid grid-cols-5 gap-1" style={{ marginBottom: 8 }}>
          {orbits.map((o) => (
            <div
              key={o.num}
              className="rounded-full text-center"
              style={{
                padding: "8px 5px",
                background: o.isDead ? "#D85A30" : "rgba(245,237,216,0.12)",
                border: o.isDead ? "0.5px solid #D85A30" : "0.5px solid rgba(184,146,42,0.55)",
              }}
            >
              <span
                className="block font-sans"
                style={{ fontSize: 7.5, fontWeight: 500, color: o.isDead ? "rgba(255,220,200,0.8)" : "#7A5810", marginBottom: 2 }}
              >
                {o.num}
              </span>
              <span
                className="block font-sans"
                style={{ fontSize: 12, fontWeight: 600, color: o.isDead ? "#fff" : "#1A0A00" }}
              >
                {o.name}
              </span>
              <span
                className="block font-sans"
                style={{ fontSize: 7.5, color: o.isDead ? "rgba(255,220,200,0.75)" : "#7A5810", marginTop: 1 }}
              >
                {o.desc}
              </span>
            </div>
          ))}
        </div>

        <div className="rounded text-center" style={{ background: "#1A0A00", padding: "11px 18px" }}>
          <span
            className="font-sans uppercase"
            style={{ fontSize: 11.5, fontWeight: 500, letterSpacing: 2.5, color: "#F0E6D0" }}
          >
            SIGNAL &nbsp;+&nbsp; PROOF &nbsp;+&nbsp; CONTEXT &nbsp;=&nbsp; RESPONSE, NOT PITCH
          </span>
        </div>
      </div>
    </div>
  );
};

export default FrameworkOverlay;
