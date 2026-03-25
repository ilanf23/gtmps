const ResultsSection = () => {
  const results = [
    { num: "$400K", label: "Deal closed from a 10 month dormant proposal. Reply in 7 minutes. Zero cold contact." },
    { num: "8.1%", label: "Reply rate vs 1.3% industry average. 37 signal activated messages to dormant contacts." },
    { num: "100%", label: "Reply rate from dormant reactivation when sender had personal context and precise signal. Two for two." },
    { num: "167%", label: "More qualified opportunities for Workiva after shifting from job title to challenge based outreach." },
    { num: "51%", label: "Lower cost per consultation. Lactation Network. Consultant network tripled in one year." },
    { num: "288%", label: "Lift in conversions for NoDoz through proof based content matched to audience intent." },
  ];

  return (
    <section className="px-6 py-16 md:px-20 md:py-24 bg-cream">
      <div className="max-w-[1080px] mx-auto">
        <p
          className="font-mono uppercase text-center mb-10 scroll-reveal"
          style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", letterSpacing: "0.16em" }}
        >
          RESULTS FROM THE SYSTEM THE BOOK DOCUMENTS
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 stagger-children">
          {results.map((r) => (
            <div
              key={r.num}
              className="glass-card-light rounded-xl text-center p-5 sm:p-8 scroll-reveal"
            >
              <span className="font-display font-black text-gold block text-4xl sm:text-5xl">
                {r.num}
              </span>
              <span
                className="font-sans text-text-body block mt-2"
                style={{ fontSize: 12, lineHeight: 1.55 }}
              >
                {r.label}
              </span>
            </div>
          ))}
        </div>

        <p
          className="font-sans text-center mt-10 scroll-reveal"
          style={{ fontSize: 14, color: "rgba(0,0,0,0.45)" }}
        >
          These are not projections. These are results from the system the book documents. They are reproducible. The framework explains why.
        </p>
      </div>
    </section>
  );
};

export default ResultsSection;
