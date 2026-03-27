const DefinitionBanner = () => {
  return (
    <section
      className="px-6 py-16 md:py-20"
      style={{ background: "#2a2520" }}
    >
      <div className="max-w-[800px] mx-auto text-center">
        <div
          className="mx-auto mb-6 scroll-reveal"
          style={{ width: 60, height: 1, background: "var(--gold)" }}
        />
        <p
          className="font-mono uppercase tracking-widest mb-8 scroll-reveal"
          style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em" }}
        >
          THE DEFINITION THAT CHANGES EVERYTHING
        </p>
        <p
          className="scroll-reveal"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
            lineHeight: 1.6,
            color: "rgba(255,245,230,0.85)",
          }}
        >
          GTM for professional services is not a plan for entering a new market.
          It is a system for activating the one you already own.
        </p>
      </div>
    </section>
  );
};

export default DefinitionBanner;
