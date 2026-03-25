const EpisodeSection = () => {
  return (
    <section id="episode" className="px-6 py-16 md:px-20 md:py-24 bg-soft-navy">
      <div className="max-w-[1080px] mx-auto stagger-children text-center">
        <span className="font-mono uppercase tracking-[0.2em] text-gold" style={{ fontSize: 10 }}>
          The Conversation That Started It All
        </span>

        <h2
          className="font-display font-black text-white mt-5"
          style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          The Episode That Named the Dead Zone
        </h2>

        <p
          className="font-sans mt-5 mx-auto"
          style={{ fontSize: 16, lineHeight: 1.75, maxWidth: 560, color: "rgba(255,255,255,0.7)" }}
        >
          This Signal Activated Growth episode is where the Dead Zone concept first took shape in public. The conversation between Adam and Richard where the vocabulary of PS GTM was born. Managing partners who listened said: that is exactly what we have been living with and nobody has named it until now.
        </p>

        {/* YouTube embed */}
        <div
          className="relative overflow-hidden mx-auto mt-10 scroll-reveal rounded-lg"
          style={{ paddingBottom: "56.25%", height: 0, maxWidth: 800, background: "#0f1822" }}
        >
          <iframe
            className="absolute top-0 left-0 w-full h-full border-none"
            src="https://www.youtube.com/embed/BqpmPsK8B4c"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Signal Activated Growth Episode"
          />
        </div>

        {/* Link pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 scroll-reveal">
          {[
            { label: "Signal Activated Growth Podcast →", href: "#" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-sm rounded-full transition-all duration-200 hover:border-gold hover:text-gold"
              style={{
                padding: "8px 20px",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EpisodeSection;
