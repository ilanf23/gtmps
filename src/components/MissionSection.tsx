import scienceOfStoryCover from "@/assets/science-of-story-cover.png";

const MissionSection = () => {
  return (
    <section
      id="mission"
      className="px-6 py-20 md:px-20 md:py-28 bg-warm-white"
    >
      <div className="max-w-[1080px] mx-auto stagger-children">
        {/* Eyebrow */}
        <div className="scroll-reveal">
          <span className="font-mono uppercase tracking-[0.2em] text-gold" style={{ fontSize: 10 }}>
            Why This Book Exists
          </span>
        </div>

        {/* Headline */}
        <h2
          className="font-display font-black text-text-dark mt-5 scroll-reveal"
          style={{ fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: 780 }}
        >
          Professional services firms deserve marketing as sophisticated as the work they sell. Nobody built them a growth engine. Until now.
        </h2>

        {/* Body */}
        <div className="scroll-reveal" style={{ maxWidth: 620 }}>
          <p className="font-sans text-text-body mt-7" style={{ fontSize: 16, lineHeight: 1.8 }}>
            Every GTM framework built in the last 40 years was designed for product companies launching to strangers. Professional services firms have been borrowing those playbooks and wondering why they do not work. The Dead Zone, the 96% of every CRM that is dormant, earned, and going to waste, exists because no GTM system was built for how PS firms actually win. Through reputation. Relationships. The right message at the right moment.
          </p>
          <p className="font-sans text-text-body mt-4" style={{ fontSize: 16, lineHeight: 1.8 }}>
            GTM for Professional Services is the first system built from scratch for this reality. Not theory. Not research from the outside. GTM for Professional Services is the first system built from scratch for this reality. Not theory. Not research from the outside. Fifty Discovery Sessions with marketing, BD leaders & managing partners who are living this problem right now. Their situations shape the chapters. The chapters become the framework. The framework changes how an entire industry grows. this problem right now. Their situations shape the chapters. The chapters become the framework. The framework changes how an entire industry grows.
          </p>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {[
            {
              num: "01",
              title: "The Problem Has a Name.",
              body: "The Dead Zone is not bad luck or a difficult market. It is the predictable result of applying the wrong GTM architecture to a relationship driven business. This book names it, quantifies it, and replaces it entirely.",
            },
            {
              num: "02",
              title: "The Window Is 12 to 18 Months.",
              body: "The professional services GTM space is wide open right now. Firms that modernize their growth motion before this space gets crowded will own their market position for the next decade. Firms that wait will spend the decade catching up.",
            },
            {
              num: "03",
              title: "The Research Is Happening Now.",
              body: "Every managing partner who participates shapes a chapter. The first 50 sessions define the book. 46 spots remain. Applications close when sessions are full and the manuscript enters final draft.",
            },
          ].map((pillar) => (
            <div key={pillar.num} className="glass-card-light rounded-xl p-8 scroll-reveal">
              <span className="font-display font-black text-gold" style={{ fontSize: 36 }}>
                {pillar.num}
              </span>
              <h3 className="font-sans font-semibold text-text-dark mt-3" style={{ fontSize: 17 }}>
                {pillar.title}
              </h3>
              <p className="font-sans text-text-body mt-3" style={{ fontSize: 14, lineHeight: 1.7 }}>
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        {/* Callout box */}
        <div
          className="mt-14 scroll-reveal rounded-xl flex flex-col sm:flex-row items-start gap-6"
          style={{
            background: "#F5F0E8",
            padding: "28px 32px",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          <a
            href="https://www.amazon.com/Science-Story-Brand-Reflection-Culture/dp/0999876503"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <img
              src={scienceOfStoryCover}
              alt="The Science of Story book cover"
              className="rounded-md shadow-md"
              style={{ width: 80 }}
            />
          </a>
          <div>
            <p className="font-sans" style={{ fontSize: 15, lineHeight: 1.75, color: "#1a1a1a" }}>
              This is the same research model Adam used for The Science of Story. 500 interviews, 100 podcast episodes, one book that changed how brands think about narrative. GTM for Professional Services applies the same method to the problem professional services firms have never had a framework to solve.
            </p>
            <a
              href="https://www.amazon.com/Science-Story-Brand-Reflection-Culture/dp/0999876503"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-gold inline-block mt-3 hover:underline"
              style={{ fontSize: 12, letterSpacing: "0.05em" }}
            >
              View on Amazon →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
