import PepperAnimatedCounter from "../pepper/PepperAnimatedCounter";

export default function SPRPilotLookback() {
  return (
    <div className="space-y-14">
      {/* Dark Hero */}
      <section
        className="relative rounded-2xl overflow-hidden text-center py-16 px-8"
        style={{
          background: "linear-gradient(135deg, #1A1A2E 0%, #0D0D1A 100%)",
          boxShadow: "0 20px 60px rgba(26,26,46,0.3)",
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0, left: "50%", transform: "translateX(-50%)",
            width: "80%", height: "100%",
            background: "radial-gradient(ellipse at top, rgba(198,93,62,0.1) 0%, transparent 60%)",
          }}
        />
        <div className="relative space-y-4">
          <div
            className="text-[clamp(56px,8vw,96px)] font-bold leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#C65D3E",
              textShadow: "0 0 40px rgba(198,93,62,0.3)",
            }}
          >
            ~<PepperAnimatedCounter end={7} suffix="%" />
          </div>
          <p className="text-white/60 text-lg">reply rate across enterprise IT contacts</p>
          <p className="text-white/40 text-sm max-w-[500px] mx-auto">
            43 emails sent. 3 replies. Every message passed through three human reviewers.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { num: 150, suffix: "", label: "Dormant contacts across 4 ICPs", prefix: "~" },
          { num: 43, suffix: "", label: "Emails with three layer review" },
          { num: 3, suffix: "", label: "Replies restarting real conversations" },
          { num: 7, suffix: "%", label: "Reply rate (industry cold average: 1 to 3%)", prefix: "~" },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-xl p-6 text-center"
            style={{ background: "white", border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}
          >
            <div className="text-[32px] font-bold text-[#C65D3E] leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
              {s.prefix || ""}<PepperAnimatedCounter end={s.num} suffix={s.suffix} />
            </div>
            <p className="text-[12px] text-[#6B6560] mt-2 leading-relaxed">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Team Workflow */}
      <section className="space-y-8">
        <div className="space-y-3">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C65D3E]">The System</span>
          <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Team Workflow
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Brian Chorba", role: "Contact Enrichment", desc: "Enriched every contact via ZoomInfo and NeverBounce before outreach." },
            { name: "Kristen Rosa", role: "Content Review", desc: "Reviewed and edited every AI generated sequence. Ensured brand voice accuracy." },
            { name: "Kyle Gams", role: "Final Approval", desc: "Applied relationship knowledge as final filter. Approved, rejected, or edited each message." },
            { name: "Rebecca Butman", role: "Executive Sponsor", desc: "Coordinated pilot, set strategy, connected teams." },
          ].map((person, i) => (
            <div key={i} className="relative">
              <div
                className="rounded-xl p-6"
                style={{ background: "white", border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}
              >
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#C65D3E] mb-2">{person.role}</div>
                <h4 className="font-semibold text-[#2D2A26] text-[15px]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {person.name}
                </h4>
                <p className="text-[12px] text-[#6B6560] mt-2 leading-relaxed">{person.desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 text-[#C65D3E] text-lg z-10">&rarr;</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Kristin Quote */}
      <div
        className="relative max-w-[720px]"
        style={{
          padding: "28px 32px",
          borderRadius: "12px",
          background: "rgba(196,167,71,0.03)",
          border: "1px solid rgba(196,167,71,0.1)",
        }}
      >
        <div className="flex gap-5">
          <div className="w-1 shrink-0 rounded-full self-stretch" style={{ background: "linear-gradient(180deg, #C4A747, rgba(196,167,71,0.3))" }} />
          <div>
            <blockquote className="text-[17px] italic leading-[1.7] text-[#4A4540]" style={{ fontFamily: "'Playfair Display', serif" }}>
              It's the signal that's making it personalized, really. Your guys' signal is the personalization piece. It's smarter now, it's connecting based on that signal.
            </blockquote>
            <footer className="mt-4 text-[12px] text-[#A09890] tracking-wide">
              <span className="font-semibold text-[#6B6560]">Kristen Rosa</span>, Creative & Content Manager
            </footer>
          </div>
        </div>
      </div>

      {/* Two Phase */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl p-7 relative overflow-hidden" style={{ background: "white", border: "1px solid rgba(221,213,204,0.5)" }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "#C65D3E" }} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C65D3E]">Phase 1</span>
          <h3 className="text-[18px] font-bold text-[#2D2A26] mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Observation Sessions
          </h3>
          <p className="text-sm text-[#6B6560] mt-3 leading-relaxed">
            Kyle reviewed pre approved messages while Mabbly identified UX improvements.
          </p>
        </div>
        <div className="rounded-xl p-7 relative overflow-hidden" style={{ background: "white", border: "1px solid rgba(198,93,62,0.15)", boxShadow: "0 8px 30px rgba(198,93,62,0.06)" }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #C65D3E, #C4A747)" }} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C65D3E]">Phase 2</span>
          <h3 className="text-[18px] font-bold text-[#2D2A26] mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Kyle Queue
          </h3>
          <p className="text-sm text-[#6B6560] mt-3 leading-relaxed">
            Marketing pre approves content. Kyle gets a clean queue. Approve or reject in seconds.
          </p>
        </div>
      </section>

      {/* What Made It Land */}
      <section className="space-y-5">
        <h3 className="text-lg font-semibold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          What Made It Land
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            "Signals tied to enterprise IT trends",
            "SPR's own content matched to ICPs",
            "Kyle's personal relationship knowledge",
            "Three human reviewers before every send",
          ].map((item) => (
            <div
              key={item}
              className="rounded-xl p-5 flex items-center gap-3"
              style={{ background: "rgba(74,103,65,0.03)", border: "1px solid rgba(74,103,65,0.1)" }}
            >
              <span className="w-2 h-2 rounded-full bg-[#4A6741] shrink-0" />
              <span className="text-[14px] text-[#2D2A26]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Accenture Callout */}
      <section
        className="relative rounded-2xl p-6 sm:p-9 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #C65D3E, #A84D32)", boxShadow: "0 20px 60px rgba(198,93,62,0.25)" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, rgba(255,255,255,0.1) 0%, transparent 60%)" }} />
        <div className="relative">
          <h3 className="text-[20px] font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Accenture Reply
          </h3>
          <p className="leading-[1.8] text-white/90 text-[15px] max-w-[640px]">
            One reply came from an Accenture contact. A firm 10x SPR's size. The signal caught a leadership move. The proof was an SPR case study. Kyle's context sealed it. One conversation that validated the entire thesis.
          </p>
        </div>
      </section>

      {/* Adoption Signal */}
      <div
        className="relative max-w-[720px] mx-auto text-center"
        style={{
          padding: "28px 32px",
          borderRadius: "12px",
          background: "rgba(198,93,62,0.03)",
          border: "1px solid rgba(198,93,62,0.1)",
        }}
      >
        <p className="text-[17px] italic text-[#4A4540] leading-[1.7]" style={{ fontFamily: "'Playfair Display', serif" }}>
          "Kyle kept sending after the pilot officially ended."
        </p>
        <footer className="mt-3 text-[12px] text-[#A09890]">
          <span className="font-semibold text-[#6B6560]">Rebecca Butman</span>
        </footer>
      </div>
    </div>
  );
}
