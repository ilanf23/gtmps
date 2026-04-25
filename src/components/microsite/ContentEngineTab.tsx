import type { SiteData } from "@/types/microsite";

interface Props {
  data: SiteData["contentEngine"];
}

export default function ContentEngineTab({ data }: Props) {
  return (
    <div className="space-y-20">
      {/* Header */}
      <section className="max-w-[820px] space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, #C65D3E)" }} />
          <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#C65D3E]">{data.subtitle}</span>
        </div>
        <h2 className="text-[clamp(30px,4.5vw,48px)] font-bold text-[#2D2A26] leading-[1.05] tracking-[-0.02em]" style={{ fontFamily: "'Playfair Display', serif" }}>
          {data.headline.split("\n").map((line, i) => (
            <span key={i}>{i > 0 && <br />}{line}</span>
          ))}
          <span style={{ color: "#C65D3E" }}>.</span>
        </h2>
        <p className="text-[#6B6560] text-lg leading-relaxed max-w-[640px]">{data.description}</p>
        {data.cadenceNote && (
          <p className="text-[13px] text-[#A09890] leading-relaxed max-w-[560px]">{data.cadenceNote}</p>
        )}
      </section>

      {/* LinkedIn Post */}
      <section className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 12px 40px rgba(0,0,0,0.05)" }}>
        <div className="px-4 sm:px-7 py-4 flex flex-wrap items-center gap-2 sm:gap-3" style={{ background: "linear-gradient(135deg, rgba(0,119,181,0.04), rgba(243,237,230,0.6))", borderBottom: "1px solid rgba(221,213,204,0.3)" }}>
          <span className="text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded" style={{ background: "#0077B5", color: "white" }}>LinkedIn</span>
          <span className="text-[13px] text-[#2D2A26] font-medium">{data.linkedInPost.author}</span>
          <span className="text-[11px] text-[#4A6741] ml-1">· {data.linkedInPost.status}</span>
          <span className="text-[11px] text-[#A09890] sm:ml-auto font-mono">{data.linkedInPost.wordCount}</span>
        </div>
        <div className="p-4 sm:p-7">
          <div className="text-[#2D2A26] leading-[1.8] space-y-4 text-[14px] sm:text-[15px]">
            {data.linkedInPost.paragraphs.map((p, i) => {
              const isLast = i === data.linkedInPost.paragraphs.length - 1;
              return isLast && p.startsWith("*") ? (
                <p key={i} className="italic" style={{ color: "#6B6560" }}>{p.replace(/^\*|\*$/g, "")}</p>
              ) : (
                <p key={i}>{p}</p>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Post */}
      <section className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid rgba(221,213,204,0.5)", boxShadow: "0 12px 40px rgba(0,0,0,0.05)" }}>
        <div className="px-4 sm:px-7 py-4 flex flex-wrap items-center gap-2 sm:gap-3" style={{ background: "linear-gradient(135deg, rgba(198,93,62,0.04), rgba(243,237,230,0.6))", borderBottom: "1px solid rgba(221,213,204,0.3)" }}>
          <span className="text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded" style={{ background: "#C65D3E", color: "white" }}>Blog</span>
          <span className="text-[13px] text-[#2D2A26] font-medium">{data.blogPost.domain}</span>
          <span className="text-[11px] text-[#A09890] ml-1">· {data.blogPost.status}</span>
          <span className="text-[11px] text-[#A09890] sm:ml-auto font-mono">{data.blogPost.wordCount}</span>
        </div>
        <div className="p-4 sm:p-7 space-y-6">
          <h3 className="text-[22px] font-bold text-[#2D2A26] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {data.blogPost.title}
          </h3>
          {data.blogPost.sections.map((s) => (
            <div key={s.num} className="flex gap-5 items-start">
              <span className="text-[28px] font-bold text-[#C65D3E] shrink-0 w-8 leading-none" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 15px rgba(198,93,62,0.1)" }}>{s.num}</span>
              <div>
                <h4 className="font-semibold text-[#2D2A26] text-[15px]">{s.title}</h4>
                <p className="text-[13px] text-[#6B6560] mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why This Matters */}
      <section className="relative rounded-2xl p-6 sm:p-9 overflow-hidden" style={{ background: "linear-gradient(135deg, #C65D3E, #A84D32)", boxShadow: "0 20px 60px rgba(198,93,62,0.25)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, rgba(255,255,255,0.1) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
        <div className="relative">
          <h3 className="text-[22px] font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{data.whyThisMatters.title}</h3>
          <p className="leading-[1.8] text-white/90 text-[15px] max-w-[640px]">{data.whyThisMatters.text}</p>
        </div>
      </section>

      {/* Validation Questions */}
      <section className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-[clamp(26px,3.5vw,36px)] font-bold text-[#2D2A26]" style={{ fontFamily: "'Playfair Display', serif" }}>Did we get this right?</h2>
          <p className="text-[#6B6560] text-lg">This is a mirror, not a proposal.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {data.validationQuestions.map((q, i) => (
            <div key={i} className="rounded-xl p-6 flex gap-5 transition-all duration-300" style={{ background: "white", border: "1px solid rgba(221,213,204,0.5)", borderLeft: "4px solid #C65D3E", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
              <span className="text-[32px] font-bold text-[#C65D3E] shrink-0 leading-none" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 15px rgba(198,93,62,0.1)" }}>{i + 1}</span>
              <p className="text-[14px] text-[#2D2A26] leading-relaxed self-center">{q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Request */}
      <section className="rounded-xl p-7 space-y-4" style={{ background: "rgba(251,248,244,0.7)", border: "1px solid rgba(221,213,204,0.5)" }}>
        <h4 className="font-semibold text-[#2D2A26] text-[16px]" style={{ fontFamily: "'Playfair Display', serif" }}>{data.dataRequest.title}</h4>
        <ol className="text-[13px] text-[#6B6560] space-y-2 list-decimal list-inside leading-relaxed">
          {data.dataRequest.items.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      </section>

      {/* CTA */}
      <section className="text-center space-y-5 py-4">
        <button
          className="relative overflow-hidden font-semibold px-12 py-5 rounded-xl text-lg transition-all duration-300 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #C65D3E, #A84D32)", color: "white", boxShadow: "0 8px 30px rgba(198,93,62,0.25), 0 2px 8px rgba(0,0,0,0.1)" }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(198,93,62,0.35), 0 4px 12px rgba(0,0,0,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(198,93,62,0.25), 0 2px 8px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
          onClick={() => data.cta.buttonUrl && window.open(data.cta.buttonUrl, "_blank")}
        >
          {data.cta.buttonText}
        </button>
        <p className="text-[13px] text-[#A09890]">{data.cta.subtext}</p>
      </section>

      {/* Footer */}
      <footer className="text-center space-y-3 pt-10 relative">
        <div className="w-16 h-px mx-auto" style={{ background: "linear-gradient(90deg, transparent, #DDD5CC, transparent)" }} />
        <p className="text-[13px] text-[#6B6560] italic mt-6" style={{ fontFamily: "'Playfair Display', serif" }}>{data.footer.line1}</p>
        <p className="text-[11px] text-[#A09890] tracking-wide">{data.footer.line2}</p>
      </footer>
    </div>
  );
}
