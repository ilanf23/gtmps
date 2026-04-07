export default function SPRPathForward() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="max-w-[820px] space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">Path Forward</span>
        </div>
        <h2
          className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          You proved it works with 1 sender and 150 contacts<span style={{ color: "#C65D3E" }}>.</span>
        </h2>
        <p className="text-[#6B6560] text-lg max-w-[640px]">
          Here are three ways to scale it across 10.
        </p>
      </section>

      {/* 10 Senders */}
      <section className="space-y-5">
        <h3 className="text-lg font-semibold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          The 10 Senders
        </h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {[
            "Kyle Gams", "Tom Ryan", "Doug", "BDM 4", "BDM 5",
            "BDM 6", "BDM 7", "BDM 8", "BDM 9", "BDM 10",
          ].map((name, i) => (
            <div key={i} className="text-center">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto flex items-center justify-center text-[11px] font-bold"
                style={{
                  background: i < 3 ? "linear-gradient(135deg, #C65D3E, #A84D32)" : "rgba(221,213,204,0.4)",
                  color: i < 3 ? "white" : "#A09890",
                }}
              >
                {name.split(" ").map(w => w[0]).join("")}
              </div>
              <p className="text-[9px] sm:text-[10px] text-[#6B6560] mt-1.5 leading-tight">{name}</p>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-[#A09890] italic">
          All 10 senders included in every option. The difference is relationships per sender and Mabbly's support level.
        </p>
      </section>

      {/* Three Options */}
      <section className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Option A */}
          <div
            className="rounded-xl p-7 relative overflow-hidden"
            style={{ background: "white", border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A09890]">Option A</span>
            <h3 className="text-[20px] font-bold text-[#2D2A26] mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Activate
            </h3>
            <p className="text-[13px] text-[#6B6560] italic mt-1">Kyle proved it. Now scale the playbook.</p>
            <div className="text-[28px] font-bold text-[#C65D3E] mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              $1,199<span className="text-[14px] text-[#A09890] font-normal">/mo</span>
            </div>
            <p className="text-[10px] text-[#A09890] mt-1">founding rate</p>
            <ul className="text-[12px] text-[#6B6560] space-y-2 mt-5">
              {["10 senders", "2,500 total relationships (~250 per sender)", "Weekly signal scans", "Self service content review (Kristin continues internally)", "Brian manages enrichment", "Monthly Mabbly check in", "2 week onboarding per sender"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#C65D3E] mt-0.5">&#8226;</span>{item}
                </li>
              ))}
            </ul>
            <p className="text-[12px] text-[#2D2A26] mt-5 font-medium italic">
              The system Kyle proved, replicated across 10 people. Your team runs it.
            </p>
          </div>

          {/* Option B */}
          <div
            className="rounded-xl p-7 relative overflow-hidden"
            style={{
              background: "white",
              border: "2px solid rgba(198,93,62,0.3)",
              boxShadow: "0 8px 30px rgba(198,93,62,0.08)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #C65D3E, #C4A747)" }} />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C65D3E]">Option B</span>
              <span className="text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded" style={{ background: "rgba(198,93,62,0.1)", color: "#C65D3E" }}>
                Recommended
              </span>
            </div>
            <h3 className="text-[20px] font-bold text-[#2D2A26] mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Activate + Accelerate
            </h3>
            <p className="text-[13px] text-[#6B6560] italic mt-1">Scale the playbook. Accelerate the content.</p>
            <div className="text-[28px] font-bold text-[#C65D3E] mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              ~$3,949<span className="text-[14px] text-[#A09890] font-normal">/mo</span>
            </div>
            <ul className="text-[12px] text-[#6B6560] space-y-2 mt-5">
              {["10 senders", "5,000 total relationships (~500 per sender)", "Daily signal scans", "Mabbly manages content review (replaces Kristin's manual review at scale)", "Mabbly manages enrichment (replaces Brian's manual process)", "Dedicated CSM + weekly strategy call + QBR", "1 week accelerated onboarding", "2 thought leadership pieces/month in SPR voice"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#C65D3E] mt-0.5">&#8226;</span>{item}
                </li>
              ))}
            </ul>
            {/* Kristin callout */}
            <div className="rounded-lg p-4 mt-5" style={{ background: "rgba(196,167,71,0.04)", border: "1px solid rgba(196,167,71,0.12)" }}>
              <p className="text-[11px] text-[#6B6560] italic leading-relaxed">
                During the pilot, Kristin said the signal is the personalization piece. She is right. But reviewing every sequence for 10 senders is not sustainable for one person. This option frees Kristin to focus on creative strategy while Mabbly handles volume review.
              </p>
            </div>
            <p className="text-[12px] text-[#2D2A26] mt-4 font-medium italic">
              Everything in A plus Mabbly takes over the work Kristin and Brian do manually. Plus 2 published pieces per month.
            </p>
          </div>

          {/* Option C */}
          <div
            className="rounded-xl p-7 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1A1A2E, #0D0D1A)",
              boxShadow: "0 12px 40px rgba(26,26,46,0.2)",
            }}
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C4A747]">Option C</span>
            <h3 className="text-[20px] font-bold text-white mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Activate + Accelerate + Anderson
            </h3>
            <p className="text-[13px] text-white/50 italic mt-1">Build the GTM infrastructure Anderson doesn't have.</p>
            <div className="text-[28px] font-bold text-[#C4A747] mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              $7.5K&ndash;$12K<span className="text-[14px] text-white/40 font-normal">/mo</span>
            </div>
            <p className="text-[10px] text-white/30 mt-1">custom</p>
            <ul className="text-[12px] text-white/60 space-y-2 mt-5">
              {["10 SPR senders + phased Anderson rollout", "10,000+ relationships (SPR + acquired firms)", "Real time signal scans", "Mabbly managed everything", "Dedicated team (CSM + Content Strategist + Enrichment Analyst)", "4 thought leadership pieces/month", "Anderson GTM Blueprint: SPR becomes the template for 10 firms"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#C4A747] mt-0.5">&#8226;</span>{item}
                </li>
              ))}
            </ul>
            {/* Richard quote */}
            <div className="rounded-lg p-4 mt-5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[11px] text-white/50 italic leading-relaxed">
                "GTM is already a very complicated thing. Imagine when you have two companies coming together, trying to get a GTM to work. It is so layered now and so convoluted."
              </p>
              <p className="text-[10px] text-white/30 mt-2">Richard Ashbaugh</p>
            </div>
            <p className="text-[12px] text-white/70 mt-4 font-medium italic">
              SPR does not just get a tool. SPR becomes the GTM center of excellence for the entire Anderson portfolio.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-y-6">
        <h3 className="text-[clamp(22px,3vw,30px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Side by Side
        </h3>
        <div
          className="overflow-x-auto rounded-xl"
          style={{ border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
        >
          <table className="w-full text-sm border-collapse min-w-[600px]">
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #1A1A2E, #0D0D1A)" }}>
                <th className="text-left p-4 font-semibold text-white/70 text-[12px]">Feature</th>
                <th className="text-center p-4 font-semibold text-white/50 text-[12px]">A: Activate</th>
                <th className="text-center p-4 font-bold text-[#C65D3E] text-[12px]">B: Accelerate</th>
                <th className="text-center p-4 font-semibold text-[#C4A747] text-[12px]">C: Anderson</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Senders", "10", "10", "10 + firms"],
                ["Relationships", "2,500", "5,000", "10,000+"],
                ["Signal frequency", "Weekly", "Daily", "Real time"],
                ["Content review", "Internal", "Mabbly", "Mabbly"],
                ["Enrichment", "Internal", "Mabbly", "Full service"],
                ["Thought leadership", "None", "2/mo", "4/mo"],
                ["Anderson rollout", "None", "None", "\u2713"],
                ["Support", "Monthly", "Weekly + QBR", "Dedicated team"],
                ["Investment", "$1,199/mo", "~$3,949/mo", "$7.5K\u2013$12K/mo"],
              ].map((row, i) => (
                <tr
                  key={i}
                  style={{
                    background: i % 2 === 0 ? "white" : "rgba(251,248,244,0.5)",
                    borderBottom: "1px solid rgba(221,213,204,0.3)",
                  }}
                >
                  <td className="p-4 font-medium text-[#2D2A26] text-[13px]">{row[0]}</td>
                  <td className="p-4 text-center text-[13px] text-[#6B6560]">{row[1]}</td>
                  <td className="p-4 text-center text-[13px] text-[#2D2A26] font-medium" style={{ background: "rgba(198,93,62,0.03)" }}>{row[2]}</td>
                  <td className="p-4 text-center text-[13px] text-[#6B6560]">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* The Close */}
      <section
        className="relative rounded-2xl p-8 sm:p-12 overflow-hidden text-center"
        style={{ background: "linear-gradient(135deg, #C65D3E, #A84D32)", boxShadow: "0 20px 60px rgba(198,93,62,0.25)" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, rgba(255,255,255,0.1) 0%, transparent 60%)" }} />
        <div className="relative space-y-6 max-w-[640px] mx-auto">
          <p className="text-white/90 text-[16px] sm:text-[18px] leading-[1.7]" style={{ fontFamily: "'Playfair Display', serif" }}>
            You have 90 days before the Anderson acquisition closes. The question is not whether to scale. Kyle already proved the system works. The question is: does SPR walk into July 1 as one of ten acquired firms, or as the firm that brought the growth engine?
          </p>
          <a
            href="mailto:adam@mabbly.com"
            className="font-semibold px-12 py-5 rounded-xl text-lg transition-all duration-300 cursor-pointer inline-block no-underline"
            style={{
              background: "white",
              color: "#C65D3E",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.2)";
            }}
          >
            Schedule MAP Review with Adam
          </a>
          <p className="text-white/50 text-[13px]">adam@mabbly.com</p>
        </div>
      </section>
    </div>
  );
}
