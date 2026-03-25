import { useState } from "react";

const ApplySection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    firm: "",
    role: "",
    firmType: "",
    revenue: "",
    employees: "",
    challenge: "",
    source: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputClasses = "w-full font-sans text-sm text-white outline-none rounded-lg transition-colors duration-200";
  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "14px 18px",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10,
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: "0.14em",
    display: "block",
    marginBottom: 8,
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#B8933A";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
  };

  return (
    <section
      id="apply"
      className="px-6 py-20 md:px-20 md:py-28 bg-soft-navy"
      style={{
        borderTop: "3px solid #B8933A",
      }}
    >
      <div className="max-w-[700px] mx-auto stagger-children">
        <span className="font-mono uppercase tracking-[0.2em] text-gold scroll-reveal" style={{ fontSize: 10 }}>
          Apply for a Research Session
        </span>

        <h2
          className="font-display font-black text-white mt-5 scroll-reveal"
          style={{ fontSize: "clamp(40px, 5vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          We Are Selecting 50 Firms.
        </h2>

        <p className="font-serif italic text-gold mt-3 scroll-reveal" style={{ fontSize: 28 }}>
          Applications close when sessions are full.
        </p>

        <p className="font-sans mt-5 scroll-reveal" style={{ fontSize: 16, lineHeight: 1.75, maxWidth: 560, color: "rgba(255,255,255,0.7)" }}>
          We review every application personally before confirming a session. We are prioritizing firms between $5M and $100M in revenue with an active business development or marketing function where the managing partner is genuinely involved in growth decisions. If your firm is outside this profile, we will let you know within 48 hours.
        </p>

        <p className="font-serif italic mt-4 scroll-reveal" style={{ fontSize: 16, color: "#5A6A7A" }}>
          If your firm has ever wondered why every GTM playbook you have tried was built for someone else, this research session is the answer.
        </p>

        <p className="font-mono text-gold mt-4 mb-10 scroll-reveal" style={{ fontSize: 11, letterSpacing: "0.12em" }}>
          46 of 50 sessions remaining · Research open March 2026 · Manuscript enters final draft Q3 2026
        </p>

        <div className="flex flex-col gap-5 scroll-reveal">
          <div>
            <label style={labelStyle}>Full Name</label>
            <input className={inputClasses} style={inputStyle} placeholder="Your full name" value={form.name} onChange={(e) => update("name", e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>Firm Name</label>
            <input className={inputClasses} style={inputStyle} placeholder="Name of your professional services firm" value={form.firm} onChange={(e) => update("firm", e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>Your Role</label>
            <select className={`${inputClasses} custom-select`} style={inputStyle} value={form.role} onChange={(e) => update("role", e.target.value)} onFocus={handleFocus} onBlur={handleBlur}>
              <option value="">Select your role</option>
              <option>Managing Partner or CEO</option>
              <option>CMO or VP of Marketing</option>
              <option>Head of Business Development</option>
              <option>Partner</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Firm Type</label>
            <select className={`${inputClasses} custom-select`} style={inputStyle} value={form.firmType} onChange={(e) => update("firmType", e.target.value)} onFocus={handleFocus} onBlur={handleBlur}>
              <option value="">Select firm type</option>
              <option>Management Consulting or Advisory</option>
              <option>Financial Advisory or Wealth Management</option>
              <option>Legal Services</option>
              <option>Staffing and Talent Advisory</option>
              <option>Research and Analytics</option>
              <option>Specialized B2B Agency</option>
              <option>Other Professional Services</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Firm Revenue (Annual)</label>
            <select className={`${inputClasses} custom-select`} style={inputStyle} value={form.revenue} onChange={(e) => update("revenue", e.target.value)} onFocus={handleFocus} onBlur={handleBlur}>
              <option value="">Select revenue range</option>
              <option>$5M to $15M</option>
              <option>$15M to $50M</option>
              <option>$50M to $100M</option>
              <option>Over $100M</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Number of Employees</label>
            <select className={`${inputClasses} custom-select`} style={inputStyle} value={form.employees} onChange={(e) => update("employees", e.target.value)} onFocus={handleFocus} onBlur={handleBlur}>
              <option value="">Select range</option>
              <option>Under 25</option>
              <option>25 to 100</option>
              <option>100 to 250</option>
              <option>250 to 500</option>
              <option>Over 500</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>What is your biggest GTM or BD challenge right now?</label>
            <textarea
              rows={4}
              placeholder="Be specific. The more context you give us, the more useful the research session will be for your firm and for the book."
              className={inputClasses}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.challenge}
              onChange={(e) => update("challenge", e.target.value)}
              onFocus={handleFocus as any}
              onBlur={handleBlur as any}
            />
          </div>
          <div>
            <label style={labelStyle}>How did you hear about this research?</label>
            <input className={inputClasses} style={inputStyle} placeholder="LinkedIn, podcast, email, referral from..." value={form.source} onChange={(e) => update("source", e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          {submitted ? (
            <p className="font-serif italic text-sage text-center mt-6" style={{ fontSize: 20 }}>
              Application received. We will review it personally and respond within 48 hours.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => {
                const body = [
                  `Full Name: ${form.name}`,
                  `Firm Name: ${form.firm}`,
                  `Role: ${form.role}`,
                  `Firm Type: ${form.firmType}`,
                  `Annual Revenue: ${form.revenue}`,
                  `Employees: ${form.employees}`,
                  `Biggest GTM/BD Challenge: ${form.challenge}`,
                  `How they heard about us: ${form.source}`,
                ].join("\n");
                window.location.href = `mailto:adam@mabbly.com?subject=${encodeURIComponent("Research Session Application")}&body=${encodeURIComponent(body)}`;
                setSubmitted(true);
              }}
              className="w-full font-sans font-bold cursor-pointer border-none rounded-full transition-all duration-200 hover:scale-[1.01] hover:bg-[#C9A845] mt-2"
              style={{
                background: "#B8933A",
                color: "#0D1117",
                fontSize: 16,
                padding: 18,
              }}
            >
              Apply for a Research Session
            </button>
          )}

          <p className="font-sans italic mt-3 text-center" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            Free. 60 minutes with Adam and Richard. No pitch. No sales deck. Just the research.
          </p>
          <span className="font-mono block text-center" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
            Prefer to book directly? calendly.com/adam-fridman/30min
          </span>
        </div>

        <p className="font-serif italic text-center mt-16 scroll-reveal" style={{ fontSize: 22, color: "rgba(255,255,255,0.5)" }}>
          The revenue your firm needs is in the relationships you already earned.
        </p>
      </div>
    </section>
  );
};

export default ApplySection;
