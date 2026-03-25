import { useState } from "react";

const DeeperSection = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const articles = [
    {
      tag: "START HERE",
      title: "The Dead Zone. What It Is, What It Costs, and Why No GTM Playbook Has Solved It",
      body: "The founding premise of the book. Why every GTM framework built in the last 40 years was designed for the wrong buyer and what it costs PS firms every month they wait to fix it.",
    },
    {
      tag: "THE VILLAIN",
      title: "The Generic Sequence Is an Architecture Problem, Not a Writing Problem",
      body: "Why outreach fails in professional services firms and what Signal Activated Growth replaces it with. The difference is not the writing. It is the moment, the reason, and the proof behind every message.",
    },
    {
      tag: "THE DIAGNOSTIC",
      title: "The Spectrum. Where Does Your PS Firm Sit on the GTM Maturity Curve?",
      body: "The self assessment that every managing partner should run before doing anything else with their business development system. Zero infrastructure to fully optimized machine. Where does your firm actually sit today?",
    },
  ];

  return (
    <section id="deeper" className="px-6 py-16 md:px-20 md:py-24 bg-soft-navy">
      <div className="max-w-[1080px] mx-auto stagger-children">
        <span className="font-mono uppercase tracking-[0.2em] text-gold scroll-reveal" style={{ fontSize: 10 }}>
          For Managing Partners Who Want the Full Picture
        </span>

        <h2
          className="font-display font-black text-white mt-5 scroll-reveal"
          style={{ fontSize: "clamp(32px, 4vw, 50px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          The framework runs deep. So does the research behind it.
        </h2>

        <p className="font-sans mt-4 scroll-reveal" style={{ fontSize: 16, maxWidth: 560, color: "rgba(255,255,255,0.7)" }}>
          The research sessions are the entry point. For those who want to understand the full system before applying, these articles give you the intellectual foundation. Each article is a chapter preview published as the research progresses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {articles.map((a) => (
            <div
              key={a.tag}
              className="glass-card p-8 scroll-reveal"
            >
              <span className="font-mono uppercase text-gold block mb-3" style={{ fontSize: 10 }}>
                {a.tag}
              </span>
              <h3 className="font-display font-bold text-white" style={{ fontSize: 20, lineHeight: 1.2 }}>
                {a.title}
              </h3>
              <p className="font-sans mt-3" style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.6)" }}>
                {a.body}
              </p>
              <a href="#" className="font-mono uppercase text-gold block mt-4 hover:underline" style={{ fontSize: 10 }}>
                READ THE ARTICLE →
              </a>
            </div>
          ))}
        </div>

        {/* Email capture */}
        <div
          className="mt-10 flex flex-col md:flex-row items-start md:items-center gap-5 scroll-reveal rounded-lg"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "32px 40px",
          }}
        >
          <div className="flex-1">
            <span className="font-mono uppercase text-gold" style={{ fontSize: 10 }}>
              GET ARTICLES AS THEY PUBLISH
            </span>
            <p className="font-sans mt-1.5" style={{ fontSize: 14, color: "rgba(255,255,255,0.55)" }}>
              Each article is a chapter preview. New articles publish weekly as research sessions complete.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full md:w-auto">
            {subscribed ? (
              <span className="font-serif italic text-sage" style={{ fontSize: 16 }}>
                Subscribed. Watch your inbox.
              </span>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@firm.com"
                  className="font-sans flex-1 md:w-56 outline-none rounded-full sm:rounded-l-full sm:rounded-r-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    padding: "12px 20px",
                    color: "white",
                    fontSize: 14,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#B8933A")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")}
                />
                <button
                  onClick={() => email && setSubscribed(true)}
                  className="font-sans font-semibold rounded-full sm:rounded-r-full sm:rounded-l-none hover:bg-[#C9A845] transition-colors duration-200"
                  style={{
                    background: "#B8933A",
                    color: "#0D1117",
                    fontSize: 13,
                    padding: "12px 24px",
                  }}
                >
                  Subscribe
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeeperSection;
