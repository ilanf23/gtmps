export default function SPRContentEngine() {
  return (
    <div className="space-y-20">
      {/* Header */}
      <section className="max-w-[820px] space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">Before We Ask, We Give</span>
        </div>
        <h2
          className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Your Content Engine,
          <br />
          Already Running<span style={{ color: "#C65D3E" }}>.</span>
        </h2>
        <p className="text-[#6B6560] text-lg leading-relaxed max-w-[640px]">
          SPR loses to competitors on one axis: Thought Leadership. Your case study library is strong. Your publishing cadence is not. Slalom and Perficient produce weekly thought leadership. SPR produces sporadically. The gap is not ideas. The gap is bandwidth.
        </p>
      </section>

      {/* LinkedIn Post */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{ background: "white", border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 12px 40px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-4 sm:px-7 py-4 flex flex-wrap items-center gap-2 sm:gap-3"
          style={{
            background: "linear-gradient(135deg, rgba(0,119,181,0.04), rgba(243,237,230,0.6))",
            borderBottom: "1px solid rgba(221,213,204,0.3)",
          }}
        >
          <span className="text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded" style={{ background: "#0077B5", color: "white" }}>
            LinkedIn
          </span>
          <span className="text-[13px] text-[#2D2A26] font-medium">Kyle Gams</span>
          <span className="text-[11px] text-[#A09890] ml-1">Managing Director at SPR</span>
          <span className="text-[11px] text-[#4A6741] sm:ml-auto">Ready to publish</span>
        </div>
        <div className="p-4 sm:p-7">
          <div className="text-[#2D2A26] leading-[1.8] space-y-4 text-[14px] sm:text-[15px]">
            <p className="font-semibold text-[16px]">The 59,000 contact problem nobody talks about</p>
            <p>I have been in enterprise technology consulting for over a decade. My CRM has thousands of contacts. People I have built real relationships with. Solved real problems for.</p>
            <p>Here is what I recently realized: the vast majority of those relationships have gone quiet. Not because the trust disappeared. Because nobody had a system to maintain it.</p>
            <p>We started a small experiment. Took 150 dormant contacts. Used real signals (job changes, funding rounds, tech announcements) to find a reason to reconnect. Attached our own case studies as proof we could help with what they were facing right now.</p>
            <p>43 emails. 3 replies. One of them turned into a real conversation with a firm 10x our size.</p>
            <p>The contacts are already in your CRM. The trust is already built. You do not need more leads. You need a system that reminds the right people you exist.</p>
            <p className="italic" style={{ color: "#6B6560" }}>
              What is sitting in YOUR Dead Zone?
            </p>
          </div>
        </div>
      </section>

      {/* Blog Post */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{ background: "white", border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 12px 40px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-4 sm:px-7 py-4 flex flex-wrap items-center gap-2 sm:gap-3"
          style={{
            background: "linear-gradient(135deg, rgba(198,93,62,0.04), rgba(243,237,230,0.6))",
            borderBottom: "1px solid rgba(221,213,204,0.3)",
          }}
        >
          <span className="text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded" style={{ background: "#C65D3E", color: "white" }}>Blog</span>
          <span className="text-[13px] text-[#2D2A26] font-medium">Rebecca Butman</span>
          <span className="text-[11px] text-[#A09890] ml-1">Draft outline</span>
        </div>
        <div className="p-4 sm:p-7 space-y-6">
          <h3 className="text-[22px] font-bold text-[#2D2A26] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Why Professional Services Firms Keep Borrowing the Wrong Growth Playbook
          </h3>
          {[
            { num: "1", title: "The vocabulary problem" },
            { num: "2", title: "The wall between marketing and revenue" },
            { num: "3", title: "The dormancy illusion" },
            { num: "4", title: "What we learned from a small pilot" },
            { num: "5", title: "What changes when you have a system" },
          ].map((s) => (
            <div key={s.num} className="flex gap-5 items-start">
              <span
                className="text-[28px] font-bold text-[#C65D3E] shrink-0 w-8 leading-none"
                style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 15px rgba(198,93,62,0.1)" }}
              >
                {s.num}
              </span>
              <h4 className="font-semibold text-[#2D2A26] text-[15px] self-center">{s.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Did We Get This Right? */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-[clamp(26px,3.5vw,36px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Did we get this right?
          </h2>
          <p className="text-[#6B6560] text-lg">This is a mirror, not a proposal.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            "Of the 10 BDMs, who are the next 2 to 3 most likely to adopt after Kyle?",
            "What is the actual average engagement size for the contacts in Kyle's Dead Zone?",
            "Which Anderson firms are most likely to pilot first after July 1?",
            "What proof points should be in the shared library first?",
          ].map((q, i) => (
            <div
              key={i}
              className="rounded-xl p-6 flex gap-5 transition-all duration-300"
              style={{
                background: "white",
                border: "1px solid rgba(221,213,204,0.5)",
                borderLeft: "4px solid #C65D3E",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <span className="text-[32px] font-bold text-[#C65D3E] shrink-0 leading-none" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 15px rgba(198,93,62,0.1)" }}>
                {i + 1}
              </span>
              <p className="text-[14px] text-[#2D2A26] leading-relaxed self-center">{q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Request */}
      <section
        className="rounded-xl p-7 space-y-4"
        style={{ background: "rgba(251,248,244,0.7)", border: "1px solid rgba(221,213,204,0.5)" }}
      >
        <h4 className="font-semibold text-[#2D2A26] text-[16px]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Before the MAP Review, we would love to know:
        </h4>
        <ol className="text-[13px] text-[#6B6560] space-y-2 list-decimal list-inside leading-relaxed">
          <li>CRM export of 10,000 working contacts</li>
          <li>BDM to contact ownership mapping</li>
          <li>Last touch date per contact</li>
          <li>Average deal size by ICP segment</li>
        </ol>
      </section>

      {/* CTA */}
      <section className="text-center space-y-5 py-4">
        <a
          href="mailto:adam@mabbly.com"
          className="relative overflow-hidden font-semibold px-12 py-5 rounded-xl text-lg transition-all duration-300 cursor-pointer inline-block no-underline"
          style={{
            background: "linear-gradient(135deg, #C65D3E, #A84D32)",
            color: "white",
            boxShadow: "0 8px 30px rgba(198,93,62,0.25), 0 2px 8px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(198,93,62,0.35), 0 4px 12px rgba(0,0,0,0.15)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(198,93,62,0.25), 0 2px 8px rgba(0,0,0,0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Schedule 15 Min MAP Review
        </a>
        <p className="text-[13px] text-[#A09890]">adam@mabbly.com</p>

        <footer className="text-center space-y-3 pt-10 relative">
          <div className="w-16 h-px mx-auto" style={{ background: "linear-gradient(90deg, transparent, #DDD5CC, transparent)" }} />
          <p className="text-[13px] text-[#6B6560] italic mt-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Prepared within 24 hours of Discovery Session. It gives before it asks.
          </p>
          <p className="text-[11px] text-[#A09890] tracking-wide">
            discover.mabbly.com/spr
          </p>
        </footer>
      </section>
    </div>
  );
}
