import { useState } from "react";
import bookCover from "@/assets/book-cover.png";
import FrameworkOverlay from "./FrameworkOverlay";

const BookSection = () => {
  const [showFramework, setShowFramework] = useState(false);
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


  return (
    <section id="book" className="px-6 py-20 md:px-20 md:py-28 bg-cream">
      <div className="max-w-[1080px] mx-auto stagger-children text-center">
        <span className="font-mono uppercase tracking-[0.2em] text-gold scroll-reveal" style={{ fontSize: 10 }}>
          The Framework
        </span>

        <h2
          className="font-display font-black text-text-dark mt-5 scroll-reveal"
          style={{ fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          GTM for Professional Services
        </h2>

        <p className="font-serif italic text-gold mt-3 scroll-reveal" style={{ fontSize: 32 }}>
          The Relationship Revenue OS
        </p>

        <p className="font-sans mt-4 mx-auto scroll-reveal" style={{ fontSize: 15, color: "rgba(13,17,23,0.6)", textAlign: "center", maxWidth: 600, marginBottom: 32 }}>
          The first GTM system built for the market you already own. Not for finding strangers. For activating relationships.
        </p>

        {/* Book display */}
        <div
          className="relative mx-auto mt-12 mb-4 flex flex-col items-center"
          
        >
          {/* Gold glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: 420,
              height: 420,
              background: "radial-gradient(circle, rgba(184,147,58,0.14) 0%, rgba(184,147,58,0) 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -55%)",
              animation: "glowPulse 4s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />

          {/* Flanking gold rules */}
          <div className="absolute top-1/2 left-0 right-0 flex items-center justify-center pointer-events-none" style={{ transform: "translateY(-20px)" }}>
            <div style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, rgba(184,147,58,0.4))" }} />
            <div style={{ width: "300px" }} />
            <div style={{ width: 60, height: 1, background: "linear-gradient(to left, transparent, rgba(184,147,58,0.4))" }} />
          </div>

          {/* Hero book */}
          <div className="book-reveal-container" style={{ perspective: 1200 }}>
            <img
              src={bookCover}
              alt="GTM for Professional Services"
              className="book-hero-reveal"
              style={{
                width: 220,
                maxWidth: "60vw",
                aspectRatio: "2/3",
                objectFit: "cover",
                borderRadius: 6,
                transform: "rotateY(-6deg)",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.25), 0 40px 80px rgba(0,0,0,0.18), -6px 0 20px rgba(0,0,0,0.12)",
                animation: "bookFloat 5s ease-in-out infinite",
              }}
            />
          </div>

          {/* Reflection */}
          <div
            className="pointer-events-none overflow-hidden mx-auto"
            style={{
              width: 220,
              maxWidth: "60vw",
              height: 60,
              marginTop: -2,
            }}
          >
            <img
              src={bookCover}
              alt=""
              aria-hidden="true"
              style={{
                width: "100%",
                aspectRatio: "2/3",
                objectFit: "cover",
                borderRadius: 6,
                transform: "scaleY(-1) rotateY(-6deg)",
                opacity: 0.12,
                maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 80%)",
                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 80%)",
              }}
            />
          </div>

          {/* Edition label */}
          <span
            className="font-mono mt-4"
            style={{ fontSize: 9, color: "rgba(184,147,58,0.5)", letterSpacing: "0.18em", textTransform: "uppercase" }}
          >
            First Edition · Q2 2026
          </span>

          {/* Framework trigger + overlay wrapper */}
          <div className="relative w-full flex flex-col items-center">
            <FrameworkOverlay visible={showFramework} />
            <button
              className="font-sans mt-4 cursor-pointer transition-colors duration-200"
              style={{
                fontSize: 13,
                color: "var(--gold)",
                background: "none",
                border: "none",
                letterSpacing: "0.04em",
              }}
              onClick={() => setShowFramework((v) => !v)}
            >
              See Our Framework →
            </button>
          </div>
        </div>

        {/* Pull quote */}
        <p
          className="font-serif italic text-text-dark text-center mx-auto mt-14 scroll-reveal"
          style={{ fontSize: 26, maxWidth: 580 }}
        >
          "Your next client already knows you. The problem is you have no system to reach them."
        </p>

        {/* Content cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-14">
          {chapters.map((ch) => (
            <div
              key={ch.num}
              className="glass-card-light rounded-xl text-left p-8 scroll-reveal"
            >
              <span className="font-display font-black text-gold" style={{ fontSize: 42 }}>
                {ch.num}
              </span>
              <h3 className="font-sans font-semibold text-text-dark mt-2" style={{ fontSize: 16 }}>
                {ch.title}
              </h3>
              <p
                className="font-sans text-text-body mt-3"
                style={{ fontSize: 14, lineHeight: 1.65 }}
              >
                {ch.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BookSection;
