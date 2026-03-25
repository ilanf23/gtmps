import bookCover from "@/assets/book-cover.png";

const BookSection = () => {
  const chapters = [
    {
      num: "01",
      title: "Chapter One: The Dead Zone",
      body: "The named villain. The problem every PS firm lives and nobody has articulated clearly. The 96% of every CRM that is dormant, earned, and going to waste. This is where the book begins because this is where the money is hiding.",
    },
    {
      num: "02",
      title: "The Relationship Revenue OS",
      body: "Five orbits that map every relationship your firm has ever built. Five layers that activate them in sequence. The first GTM system built from scratch for how PS firms actually win.",
    },
    {
      num: "03",
      title: "Signal Activated Growth",
      body: "The methodology the OS runs on. Reaching the right person at the exact moment something relevant happened in their world. Not cold outreach. The right message at the right moment from someone they remember.",
    },
    {
      num: "04",
      title: "The Three Laws of Relationship Revenue",
      body: "Proof before pitch. Relationships before revenue. Signal before message. The three rules that govern every decision inside the framework and every engagement the research sessions validate.",
    },
  ];

  const milestones = [
    { label: "Research Open", date: "March 2026", pct: 0, filled: true },
    { label: "Sessions Close", date: "Q2 2026", pct: 33, filled: true },
    { label: "First Draft", date: "Q3 2026", pct: 66, filled: false },
    { label: "Published", date: "Q4 2026", pct: 100, filled: false },
  ];

  return (
    <section id="book" className="px-6 py-16 md:px-20 md:py-24" style={{ background: "#0D1117" }}>
      <div className="max-w-[1080px] mx-auto stagger-children text-center">
        <span className="font-mono uppercase tracking-[0.2em] text-gold scroll-reveal" style={{ fontSize: 9 }}>
          The Framework
        </span>

        <h2
          className="font-serif font-light text-white mt-4 scroll-reveal"
          style={{ fontSize: "clamp(36px, 4.5vw, 54px)", lineHeight: 1.08 }}
        >
          GTM for Professional Services
        </h2>

        <p className="font-serif italic text-gold mt-2 scroll-reveal" style={{ fontSize: 30 }}>
          The Relationship Revenue OS
        </p>

        {/* Book display */}
        <div className="relative mx-auto mt-10 scroll-reveal" style={{ maxWidth: 520, height: 280 }}>
          <img
            src={bookCover}
            alt="GTM for Professional Services"
            className="absolute"
            style={{
              width: 170,
              aspectRatio: "2/3",
              transform: "rotate(-3deg)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
              left: "10%",
              top: 0,
              zIndex: 2,
              objectFit: "cover",
            }}
          />
          <div
            className="absolute flex items-center justify-center"
            style={{
              width: 26,
              height: 255,
              background: "#B8933A",
              left: "50%",
              top: 5,
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          >
            <span
              className="font-mono text-ink"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 7, letterSpacing: "0.1em" }}
            >
              GTM FOR PROFESSIONAL SERVICES · FRIDMAN · ASHBAUGH
            </span>
          </div>
          <img
            src={bookCover}
            alt="GTM for Professional Services - Back"
            className="absolute"
            style={{
              width: 170,
              aspectRatio: "2/3",
              transform: "rotate(3deg)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
              right: "10%",
              top: 10,
              zIndex: 0,
              objectFit: "cover",
            }}
          />
        </div>

        {/* Pull quote */}
        <p
          className="font-serif italic text-white text-center mx-auto mt-12 scroll-reveal"
          style={{ fontSize: 24, maxWidth: 580 }}
        >
          "Your next client already knows you. The problem is you have no system to reach them."
        </p>

        {/* Content cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mt-12">
          {chapters.map((ch) => (
            <div
              key={ch.num}
              className="text-left transition-colors duration-150 scroll-reveal"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: 28,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(184,147,58,0.3)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
              }
            >
              <span className="font-serif font-light text-gold" style={{ fontSize: 38 }}>
                {ch.num}
              </span>
              <h3 className="font-sans font-semibold text-white mt-2" style={{ fontSize: 15 }}>
                {ch.title}
              </h3>
              <p
                className="font-sans mt-2"
                style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}
              >
                {ch.body}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <p
          className="font-mono uppercase text-center mt-14 mb-4 scroll-reveal"
          style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.16em" }}
        >
          PUBLICATION TIMELINE
        </p>
        <div className="relative mx-auto scroll-reveal" style={{ maxWidth: 680, height: 60 }}>
          <div
            className="absolute top-[28px] left-0 right-0"
            style={{ height: 2, background: "rgba(255,255,255,0.1)" }}
          />
          {milestones.map((m) => (
            <div
              key={m.label}
              className="absolute flex flex-col items-center"
              style={{ left: `${m.pct}%`, top: 0, transform: "translateX(-50%)" }}
            >
              <span className="font-mono text-center" style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
                {m.label}
              </span>
              <span
                className="rounded-full"
                style={{
                  width: 8,
                  height: 8,
                  background: m.filled ? "#B8933A" : "transparent",
                  border: m.filled ? "none" : "1.5px solid rgba(255,255,255,0.4)",
                }}
              />
              <span className="font-mono mt-1" style={{ fontSize: 8, color: "rgba(255,255,255,0.35)" }}>
                {m.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookSection;
