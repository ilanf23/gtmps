import { useEffect, useRef, useState } from "react";
import scienceOfStoryCover from "@/assets/science-of-story-cover.png";
import { Target, Clock, Users, Zap, TrendingUp, Layers } from "lucide-react";

const CountUpNumber = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1600;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const storyCards = [
  {
    icon: Target,
    accent: "The Problem",
    headline: "Every GTM framework was built for the wrong buyer.",
    body: "Every GTM system built in the last 40 years was designed for product companies launching to strangers. Professional services firms have been borrowing those playbooks and wondering why they do not work.",
  },
  {
    icon: Layers,
    accent: "The Dead Zone",
    headline: "96% of your CRM is dormant, earned, and going to waste.",
    body: "The Dead Zone exists because no GTM system was built for how PS firms actually win. Through reputation. Relationships. The right message at the right moment.",
  },
  {
    icon: Zap,
    accent: "The Shift",
    headline: "GTM for professional services is not about entering a new market.",
    body: "It is a system for activating the one you already own. That definition did not exist before this book. It does now.",
  },
  {
    icon: TrendingUp,
    accent: "The Method",
    headline: "Built from 50 Discovery Sessions with managing partners.",
    body: "Not theory. Not research from the outside. Their situations shape the chapters. The chapters become the framework. The framework changes how an entire industry grows.",
  },
];

const pillars = [
  {
    num: "01",
    icon: Target,
    title: "The Problem Has a Name.",
    body: "The Dead Zone is not bad luck or a difficult market. It is the predictable result of applying the wrong GTM architecture to a relationship driven business. This book names it, quantifies it, and replaces it entirely.",
    stat: { value: 96, suffix: "%", label: "of CRM contacts dormant" },
  },
  {
    num: "02",
    icon: Clock,
    title: "The Window Is 12 to 18 Months.",
    body: "The professional services GTM space is wide open right now. Firms that modernize their growth motion before this space gets crowded will own their market position for the next decade.",
    stat: { value: 12, suffix: "mo", label: "window to lead" },
  },
  {
    num: "03",
    icon: Users,
    title: "The Research Is Happening Now.",
    body: "Every managing partner who participates shapes a chapter. The first 50 sessions define the book. 46 spots remain. Applications close when sessions are full.",
    stat: { value: 46, suffix: "", label: "sessions remaining" },
  },
];

const MissionSection = () => {
  return (
    <section id="mission" className="px-6 py-20 md:px-20 md:py-28 bg-warm-white overflow-hidden">
      <div className="max-w-[1080px] mx-auto">
        {/* Header */}
        <div className="max-w-[780px]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold" />
              <span className="font-mono uppercase tracking-[0.2em] text-gold" style={{ fontSize: 10 }}>
                Why This Book Exists
              </span>
            </div>
          </div>

          <h2
            className="font-display font-black text-text-dark"
            style={{ fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          >
            Professional services firms deserve marketing as sophisticated as the work they sell.
          </h2>

          <p
            className="font-serif italic text-gold mt-4"
            style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
          >
            Nobody built them a growth engine. Until now.
          </p>
        </div>

        {/* Story cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-14 stagger-children">
          {storyCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.accent}
                className="group relative rounded-2xl p-8 scroll-reveal transition-all duration-300 hover:shadow-lg"
                style={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-8 right-8 h-px transition-all duration-300 group-hover:left-0 group-hover:right-0"
                  style={{ background: "linear-gradient(90deg, transparent, #B8933A, transparent)" }}
                />

                <div className="flex items-start gap-5">
                  <div
                    className="shrink-0 flex items-center justify-center rounded-xl transition-colors duration-300 group-hover:bg-gold/10"
                    style={{
                      width: 48,
                      height: 48,
                      background: "rgba(184,147,58,0.06)",
                    }}
                  >
                    <Icon size={22} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className="font-mono uppercase text-gold block mb-2"
                      style={{ fontSize: 10, letterSpacing: "0.14em" }}
                    >
                      {card.accent}
                    </span>
                    <h3
                      className="font-display font-bold text-text-dark"
                      style={{ fontSize: 19, lineHeight: 1.25 }}
                    >
                      {card.headline}
                    </h3>
                    <p
                      className="font-sans text-text-body mt-3"
                      style={{ fontSize: 14, lineHeight: 1.7 }}
                    >
                      {card.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-16">
          <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
          <span
            className="font-mono uppercase tracking-[0.2em]"
            style={{ fontSize: 9, color: "rgba(0,0,0,0.3)" }}
          >
            The Three Pillars
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
        </div>

        {/* Three pillars with animated stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="group relative rounded-2xl p-8 scroll-reveal transition-all duration-300 hover:shadow-lg"
                style={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                {/* Stat badge */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      width: 44,
                      height: 44,
                      background: "rgba(184,147,58,0.06)",
                    }}
                  >
                    <Icon size={20} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <div className="text-right">
                    <span className="font-display font-black text-gold block" style={{ fontSize: 28 }}>
                      <CountUpNumber target={pillar.stat.value} suffix={pillar.stat.suffix} />
                    </span>
                    <span
                      className="font-mono uppercase block"
                      style={{ fontSize: 8, color: "rgba(0,0,0,0.35)", letterSpacing: "0.1em" }}
                    >
                      {pillar.stat.label}
                    </span>
                  </div>
                </div>

                <h3 className="font-sans font-semibold text-text-dark" style={{ fontSize: 17 }}>
                  {pillar.title}
                </h3>
                <p className="font-sans text-text-body mt-3" style={{ fontSize: 14, lineHeight: 1.7 }}>
                  {pillar.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* Callout box */}
        <div
          className="mt-14 rounded-2xl flex flex-col sm:flex-row items-start gap-6"
          style={{
            background: "linear-gradient(135deg, #F5F0E8 0%, #EDE7DB 100%)",
            padding: "32px 36px",
            border: "1px solid rgba(184,147,58,0.15)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <a
            href="https://www.amazon.com/Science-Story-Brand-Reflection-Culture/dp/0999876503"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <img
              src={scienceOfStoryCover}
              alt="The Science of Story book cover"
              className="rounded-lg shadow-md"
              style={{ width: 80 }}
            />
          </a>
          <div>
            <span
              className="font-mono uppercase text-gold block mb-2"
              style={{ fontSize: 10, letterSpacing: "0.14em" }}
            >
              The Proven Research Model
            </span>
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
