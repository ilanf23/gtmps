const Footer = () => {
  return (
    <>
      {/* Closing CTA band */}
      <section className="px-6 py-20 md:px-20 md:py-28 text-center bg-cream">
        <h2
          className="font-display font-black text-text-dark scroll-reveal"
          style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          Ready to Rethink How Your Firm Grows?
        </h2>
        <p className="font-sans text-text-body mt-5 mx-auto scroll-reveal" style={{ fontSize: 16, maxWidth: 480 }}>
          46 research sessions remain. The book enters final draft when they are complete. Apply now to shape a chapter.
        </p>
        <a
          href="#apply"
          className="inline-block font-sans font-bold rounded-full transition-all duration-200 hover:scale-[1.02] hover:bg-[#C9A845] mt-8 scroll-reveal"
          style={{ background: "#B8933A", color: "#0D1117", padding: "16px 48px", fontSize: 16 }}
        >
          Apply for a Research Session
        </a>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 md:px-12 bg-soft-navy" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-[1080px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="font-display font-bold text-white" style={{ fontSize: 18 }}>
              mabbly
            </span>
            <span className="font-sans block mt-1" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              GTM for the market you already own.
            </span>
          </div>

          <div className="flex gap-6">
            {[
              { label: "mabbly.com", href: "https://mabbly.com" },
              { label: "mabbly.ai", href: "https://mabbly.ai" },
              { label: "Podcast →", href: "https://www.youtube.com/@SignalActivatedGrowth" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-sans text-sm transition-colors duration-200 hover:text-white"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="md:text-right">
            <span className="font-sans block" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
              GTM for Professional Services © 2026 Mabbly LLC
            </span>
            <span className="font-sans block mt-0.5" style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
              discover.mabbly.com
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
