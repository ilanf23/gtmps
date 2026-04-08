function FieldLabel({ num, name, status }: { num: number; name: string; status: "complete" | "partial" | "incomplete" }) {
  const s = status === "complete"
    ? { background: "#C8963E", color: "#fff", border: "1px solid #C8963E" }
    : status === "partial"
    ? { background: "transparent", color: "#C8963E", border: "1px solid #C8963E" }
    : { background: "transparent", color: "#A09890", border: "1px solid #DDD5CC" };
  const label = status === "complete" ? "Complete" : status === "partial" ? "Partial" : "Incomplete";
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: "#A09890" }}>
        MAP FIELD {num}: {name}
      </span>
      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={s}>
        {label}
      </span>
    </div>
  );
}

export default function SPRTriggers() {
  return (
    <div className="space-y-12">
      {/* Primary Signal Type */}
      <section>
        <FieldLabel num={10} name="PRIMARY SIGNAL TYPE" status="partial" />
        <h2 className="text-[28px] md:text-[36px] font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
          What Creates a Reason to Reach Out
        </h2>

        <div className="space-y-4 mb-8">
          <p className="text-[14px] leading-relaxed" style={{ color: "#6B6560" }}>
            A signal is a publicly observable event that creates a reason to reach out. It is not a pitch. It is not a check-in. It is a specific, timely observation that demonstrates you are paying attention to someone's world.
          </p>
          <p className="text-[14px] leading-relaxed" style={{ color: "#6B6560" }}>
            For SPR, the primary signal type is executive movement. When a former client or contact moves to a new company, they inherit new technology challenges. They already trust SPR. The signal is the move. The outreach is the bridge.
          </p>
          <p className="text-[14px] leading-relaxed" style={{ color: "#6B6560" }}>
            Rebecca described how Kyle Gams already does this intuitively with about 150 contacts. The question is whether this can become a system that works across all 8,000 to 10,000 dormant relationships, not just the ones Kyle personally remembers.
          </p>
        </div>

        {/* Email Mockup */}
        <div className="rounded-xl overflow-hidden mb-6" style={{ border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 8px 30px rgba(0,0,0,0.06)" }}>
          <div className="px-6 py-3 flex items-center gap-3" style={{ background: "#f8f8f8", borderBottom: "1px solid rgba(221,213,204,0.5)" }}>
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#27CA40" }} />
            </div>
            <span className="text-[11px] font-medium" style={{ color: "#A09890" }}>New Message</span>
          </div>
          <div className="bg-white">
            <div className="px-6 py-2 text-[12px]" style={{ borderBottom: "1px solid rgba(221,213,204,0.3)" }}>
              <span style={{ color: "#A09890" }}>From: </span>
              <span style={{ color: "#2D2A26" }}>Kyle Gams</span>
            </div>
            <div className="px-6 py-2 text-[12px]" style={{ borderBottom: "1px solid rgba(221,213,204,0.3)" }}>
              <span style={{ color: "#A09890" }}>To: </span>
              <span style={{ color: "#2D2A26" }}>[Former CIO contact]</span>
            </div>
            <div className="px-6 py-2 text-[12px]" style={{ borderBottom: "1px solid rgba(221,213,204,0.3)" }}>
              <span style={{ color: "#A09890" }}>Subject: </span>
              <span style={{ color: "#2D2A26" }}>Saw the move to [New Company]. Quick thought on their modernization challenge.</span>
            </div>
            <div className="px-6 py-5 text-[13px] leading-relaxed" style={{ color: "#2D2A26" }}>
              <p className="mb-4">Hi [Name],</p>
              <p className="mb-4">
                Saw you moved to [New Company].{" "}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: "rgba(200,150,62,0.12)", color: "#C8963E" }}>SIGNAL</span>
                {" "}Congrats. That is a big platform.
              </p>
              <p className="mb-4">
                When we worked together at [Previous Company], your team was dealing with [specific technical challenge].{" "}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: "rgba(74,103,65,0.12)", color: "#4A6741" }}>PROOF</span>
                {" "}[New Company] just announced [relevant initiative], which usually means [specific modernization need].{" "}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: "rgba(198,93,62,0.12)", color: "#C65D3E" }}>CONTEXT</span>
              </p>
              <p className="mb-4">
                I have a quick thought on how teams in that position typically approach it. Worth 15 minutes?
              </p>
              <p>Kyle</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5 mb-4" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(221,213,204,0.4)" }}>
          <div className="space-y-2 text-[13px]" style={{ color: "#6B6560" }}>
            <p><strong style={{ color: "#C8963E" }}>Signal:</strong> The publicly observable event (job change, funding round, acquisition, product launch)</p>
            <p><strong style={{ color: "#4A6741" }}>Proof:</strong> The shared history that earns the right to reach out</p>
            <p><strong style={{ color: "#C65D3E" }}>Context:</strong> The specific challenge the new role likely creates</p>
          </div>
        </div>

        <p className="text-[12px] italic" style={{ color: "#A09890" }}>
          A complete signal strategy includes trigger definitions, monitoring tools, outreach templates, and response protocols. This field is partial because we have the concept but not the operational system.
        </p>
      </section>

      {/* Beachhead Segment */}
      <section>
        <FieldLabel num={6} name="BEACHHEAD SEGMENT" status="incomplete" />
        <h2 className="text-[24px] md:text-[30px] font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
          The One Segment to Win First
        </h2>
        <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(221,213,204,0.4)" }}>
          <p className="text-[14px] leading-relaxed mb-4" style={{ color: "#6B6560" }}>
            A beachhead segment is the single narrowest group of buyers where you can win repeatedly and build proof before expanding. SPR has not yet defined this. The Anderson acquisition complicates it because it adds new capabilities and new markets simultaneously.
          </p>
          <p className="text-[13px] font-medium mb-3" style={{ color: "#2D2A26" }}>Three questions to answer:</p>
          <ul className="space-y-2 text-[13px]" style={{ color: "#6B6560" }}>
            <li className="flex items-start gap-2"><span style={{ color: "#C8963E" }}>1.</span> Which industry vertical has SPR won the most in the last 24 months?</li>
            <li className="flex items-start gap-2"><span style={{ color: "#C8963E" }}>2.</span> Which of Anderson's segments overlaps most with SPR's existing wins?</li>
            <li className="flex items-start gap-2"><span style={{ color: "#C8963E" }}>3.</span> If you could only sell to one type of buyer for the next six months, who would it be?</li>
          </ul>
        </div>
      </section>

      {/* Competitive Landscape Signal */}
      <section>
        <FieldLabel num={12} name="COMPETITIVE LANDSCAPE SIGNAL" status="partial" />
        <h2 className="text-[24px] md:text-[30px] font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#2D2A26" }}>
          What Is Happening Around You
        </h2>
        <div className="space-y-4">
          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(221,213,204,0.4)" }}>
            <p className="text-[14px] leading-relaxed mb-4" style={{ color: "#6B6560" }}>
              The Anderson acquisition is the dominant landscape signal. It changes SPR's competitive position in three ways: expanded geographic reach, new service lines (particularly in data and AI), and a larger bench. But it also creates internal complexity. Rebecca described the tension: SPR has its own P&L targets, Anderson has a broader integration agenda, and the combined entity needs a unified market story.
            </p>
            <p className="text-[14px] leading-relaxed" style={{ color: "#6B6560" }}>
              The competitive landscape is not about who else is in the market. It is about what is changing in the market that creates openings or threats for SPR specifically.
            </p>
          </div>
          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(221,213,204,0.4)" }}>
            <h4 className="text-[12px] font-semibold mb-3" style={{ color: "#2D2A26" }}>What we still need</h4>
            <ul className="space-y-2 text-[13px]" style={{ color: "#6B6560" }}>
              <li className="flex items-start gap-2"><span style={{ color: "#C8963E" }}>•</span> Which competitors are SPR losing to most often, and why?</li>
              <li className="flex items-start gap-2"><span style={{ color: "#C8963E" }}>•</span> How does Anderson's competitive set differ from SPR's?</li>
              <li className="flex items-start gap-2"><span style={{ color: "#C8963E" }}>•</span> What market shifts (AI, cloud migration, modernization) are creating the most new demand?</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
