export default function SPRProof() {
  return (
    <div className="space-y-14">
      {/* Header */}
      <section className="max-w-[820px] space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">The Proof</span>
        </div>
        <h2
          className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Your Proof Library Is Strong<span style={{ color: "#C65D3E" }}>.</span>
          <br />
          Your Publishing Cadence Is Not<span style={{ color: "#C65D3E" }}>.</span>
        </h2>
      </section>

      {/* Strength Cards */}
      <section className="grid sm:grid-cols-2 gap-4">
        {[
          {
            title: "Deep case study library",
            text: "Rebecca described using proof at three points in the sales cycle: capabilities discussions, proposal appendices, and verbal storytelling in initial conversations. The proof exists.",
          },
          {
            title: "Senior delivery team that sells",
            text: "SPR's delivery SMEs are the real closers. They understand client needs better than the sales team. Rebecca said marketing \"hitched its wagon to the delivery people\" for market intelligence, and it works.",
          },
          {
            title: "Flexible engagement model",
            text: "Clients can dictate the team makeup. Want to bring your own PM? Fine. Need a large team or a small one? Both work. Rebecca named this as a true differentiator clients love.",
          },
          {
            title: "Aligned leadership",
            text: "Sales, marketing, and technology leadership operate in lockstep. Strategic initiatives run in four month sprints. Doug approves quickly. This is rare.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl p-6 transition-all duration-300"
            style={{
              background: "rgba(74,103,65,0.03)",
              border: "1px solid rgba(74,103,65,0.12)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(74,103,65,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#4A6741]" />
              <h4 className="font-semibold text-[#2D2A26] text-[15px]" style={{ fontFamily: "'Playfair Display', serif" }}>
                {card.title}
              </h4>
            </div>
            <p className="text-[13px] text-[#6B6560] leading-relaxed">{card.text}</p>
          </div>
        ))}
      </section>

      {/* The One Gap */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #8B3A3A)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#8B3A3A]">The One Gap</span>
        </div>
        <div
          className="rounded-xl p-7"
          style={{ background: "rgba(139,58,58,0.02)", border: "1px solid rgba(139,58,58,0.1)", borderLeft: "4px solid #8B3A3A" }}
        >
          <p className="text-[15px] text-[#2D2A26] leading-[1.8]">
            The proof does not travel. SPR's case studies sit on the website. They get used when a BDM remembers to attach one to a conversation. There is no system that connects a specific piece of proof to a specific signal in a specific contact's world at the moment it would matter most.
          </p>
          <p className="text-[14px] text-[#6B6560] leading-[1.8] mt-4">
            Firms like Slalom and Perficient publish thought leadership weekly. SPR publishes sporadically. The gap is not quality or expertise. It is cadence and distribution.
          </p>
        </div>
      </section>

      {/* LinkedIn Post */}
      <section className="space-y-4">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">Draft Content</span>
          <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Giving Before Asking
          </h3>
        </div>
        <div
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ background: "#1B2A4A" }}>KG</div>
              <div>
                <span className="text-[13px] text-[#2D2A26] font-medium">Kyle Gams</span>
                <span className="text-[11px] text-[#A09890] ml-1 block sm:inline">Managing Director at SPR</span>
              </div>
            </div>
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
            <div className="mt-5 pt-4 flex items-center gap-4 text-[12px] text-[#A09890]" style={{ borderTop: "1px solid rgba(221,213,204,0.3)" }}>
              <span>👍 24</span>
              <span>💬 8 comments</span>
              <span>🔄 3 reposts</span>
            </div>
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
    </div>
  );
}
