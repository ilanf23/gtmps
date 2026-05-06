import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MagnetShell from "@/components/magnet/MagnetShell";

const STEPS = [
  {
    n: "01",
    title: "You talk. We listen.",
    body: "We want to hear how business is actually coming in - not the pitch version.",
  },
  {
    n: "02",
    title: "We map your Five Orbits live.",
    body: "You'll see exactly where your relationship revenue is sitting and why it's not converting.",
  },
  {
    n: "03",
    title: "We identify your Dead Zone.",
    body: "A real number. The revenue that's already yours - sitting silent in your CRM.",
  },
  {
    n: "04",
    title: "You leave with a starting layer.",
    body: "One clear answer: where to begin. No ambiguity. No homework.",
  },
];

const QUOTES = [
  {
    text: "We hadn't touched 60% of our past clients in over two years. The Dead Zone session alone was worth the hour.",
    attr: "Managing Partner, Midwest Consulting Firm",
  },
  {
    text: "Adam mapped our orbits in real time. We knew exactly what to do by the end of the call.",
    attr: "Founder, $12M Professional Services Firm",
  },
  {
    text: "We stopped cold outbound the next day. The warm reactivation alone added $400K in pipeline.",
    attr: "Partner, Growth Advisory Firm",
  },
];

export default function MagnetBook() {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <MagnetShell>
      <div className="max-w-2xl mx-auto px-6 w-full">
        {/* SECTION 1: HEADER */}
        <section className="pt-20 pb-12">
          <p className="text-[#A8923A] text-xs uppercase tracking-widest">
            A 30-MINUTE CONVERSATION
          </p>
          <h1 className="text-4xl font-bold mt-4 max-w-lg leading-tight">
            This isn't a sales call. It's your GTM map session.
          </h1>
          <p className="text-base opacity-60 mt-5 max-w-lg leading-relaxed">
            Adam has run this session with managing partners at firms from $5M
            to $80M. You'll leave with a clear picture of which orbit is
            leaking, which layer to start, and what to stop doing.
          </p>
        </section>

        {/* SECTION 2: WHAT TO EXPECT */}
        <section className="py-14 border-t border-black/10">
          <p className="text-[#A8923A] text-xs uppercase tracking-widest mb-10">
            WHAT HAPPENS ON THE CALL
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="text-3xl font-bold text-black/10 leading-none">
                  {s.n}
                </p>
                <p className="text-sm font-semibold mt-2">{s.title}</p>
                <p className="text-sm opacity-50 mt-1 leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: SOCIAL PROOF */}
        <section className="py-10 border-t border-black/10">
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="border-l-2 border-[#A8923A]/40 pl-5 py-2 mb-6 last:mb-0"
            >
              <p className="text-sm opacity-70 italic leading-relaxed">
                {q.text}
              </p>
              <p className="text-xs opacity-40 mt-2 uppercase tracking-wider">
                {q.attr}
              </p>
            </div>
          ))}
        </section>

        {/* SECTION 4: CALENDLY EMBED */}
        <section className="py-14 border-t border-black/10">
          <p className="text-[#A8923A] text-xs uppercase tracking-widest mb-8">
            CHOOSE A TIME
          </p>
          <div
            className="calendly-inline-widget w-full"
            data-url="https://calendly.com/richard-mabbly?hide_gdpr_banner=1&background_color=FBF8F4&text_color=1C1008&primary_color=B8933A"
            style={{ minWidth: "320px", height: "700px" }}
          />
        </section>

        {/* SECTION 5: FOOTER STRIP */}
        <section className="py-12 border-t border-black/10">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <p className="text-sm opacity-30">
              © Mabbly · Relationship Revenue OS
            </p>
            <div className="flex flex-wrap gap-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-xs opacity-30 hover:opacity-60 underline transition-opacity"
              >
                Back to your breakdown
              </button>
              <a
                href="https://mabbly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs opacity-30 hover:opacity-60 underline transition-opacity"
              >
                mabbly.com
              </a>
            </div>
          </div>
        </section>
      </div>
    </MagnetShell>
  );
}
