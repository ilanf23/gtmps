import { useState } from "react";
import { captureLead } from "@/lib/leadCapture";

export type NotifyVariant = "ai" | "com";

type NotifySignupProps = {
  variant: NotifyVariant;
  source: string;
  eyebrow?: string;
  headline: string;
  sub: string;
  buttonLabel: string;
  trust?: string;
};

const DEFAULT_TRUST = "No spam. Unsubscribe anytime.";

export default function NotifySignup({
  variant,
  source,
  eyebrow,
  headline,
  sub,
  buttonLabel,
  trust = DEFAULT_TRUST,
}: NotifySignupProps) {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");

  const brand = variant === "ai" ? "mabbly.ai" : "mabbly.com";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !firm.trim()) return;
    void captureLead({
      source: `notify_${variant}`,
      variant,
      first_name: firstName,
      last_name: lastName,
      email,
      firm,
    });
    setSubmitted(true);
  };

  const defaultEyebrow = variant === "ai" ? "MABBLY.AI · Signal" : "MABBLY.COM · Services";

  return (
    <div
      className={`ns-card ns-${variant}`}
      data-brand={brand}
      data-source={source}
    >
      <style>{`
        .ns-card {
          --ns-ink: #0F1E1D;
          --ns-cream: #F8F2E5;
          --ns-gold: #FFBA1A;
          --ns-rust: #BF461A;
          --ns-sage: #3D5A4A;
          --ns-radius: 18px;
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border-radius: var(--ns-radius);
          padding: 34px 36px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          min-height: 360px;
          box-sizing: border-box;
        }
        .ns-ai {
          background: #0F1E1D;
          color: #EDF5EC;
          border: 1px solid rgba(255, 186, 26, 0.22);
        }
        .ns-ai::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 80% at 0% 0%, rgba(255, 186, 26, 0.10) 0%, transparent 55%),
                      radial-gradient(120% 80% at 100% 100%, rgba(191, 70, 26, 0.14) 0%, transparent 55%);
          pointer-events: none;
          z-index: 0;
        }
        .ns-com {
          background: #F8F2E5;
          color: #0F1E1D;
          border: 1px solid rgba(61, 90, 74, 0.22);
        }
        .ns-com::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 80% at 100% 0%, rgba(61, 90, 74, 0.08) 0%, transparent 55%),
                      radial-gradient(120% 80% at 0% 100%, rgba(184, 147, 58, 0.10) 0%, transparent 55%);
          pointer-events: none;
          z-index: 0;
        }
        .ns-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 18px;
          height: 100%;
        }
        .ns-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 5px 12px;
          border-radius: 100px;
          font-family: 'DM Mono', 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          width: fit-content;
        }
        .ns-ai .ns-eyebrow {
          background: rgba(255, 186, 26, 0.10);
          border: 1px solid rgba(255, 186, 26, 0.40);
          color: #FFBA1A;
        }
        .ns-com .ns-eyebrow {
          background: rgba(61, 90, 74, 0.08);
          border: 1px solid rgba(61, 90, 74, 0.40);
          color: #3D5A4A;
        }
        .ns-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .ns-ai .ns-dot {
          background: #FFBA1A;
          box-shadow: 0 0 8px rgba(255, 186, 26, 0.7);
        }
        .ns-com .ns-dot {
          background: #3D5A4A;
        }
        .ns-headline {
          font-family: 'Inter Tight', system-ui, -apple-system, sans-serif;
          font-weight: 800;
          font-size: clamp(22px, 2.1vw, 28px);
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0;
          max-width: 28ch;
        }
        .ns-ai .ns-headline { color: #EDF5EC; }
        .ns-com .ns-headline { color: #0F1E1D; }
        .ns-sub {
          font-family: 'Cormorant Garamond', 'Iowan Old Style', Georgia, serif;
          font-style: italic;
          font-size: clamp(15px, 1.2vw, 17px);
          line-height: 1.5;
          margin: 0;
          max-width: 36ch;
        }
        .ns-ai .ns-sub { color: rgba(237, 245, 236, 0.72); }
        .ns-com .ns-sub { color: rgba(15, 30, 29, 0.66); }

        .ns-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 6px 0 0;
          margin-top: auto;
        }
        .ns-row {
          display: flex;
          gap: 10px;
        }
        .ns-input {
          display: block;
          font-family: 'DM Mono', 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 14px;
          padding: 0 14px;
          height: 46px;
          min-height: 46px;
          line-height: 46px;
          box-sizing: border-box;
          border-radius: 8px;
          outline: none;
          transition: border-color 200ms, background 200ms, box-shadow 200ms;
          width: 100%;
          min-width: 0;
          margin: 0;
          flex: 0 0 auto;
        }
        .ns-row .ns-input { flex: 1 1 0; }
        .ns-ai .ns-input {
          background: rgba(237, 245, 236, 0.06);
          border: 1.5px solid rgba(237, 245, 236, 0.18);
          color: #EDF5EC;
        }
        .ns-ai .ns-input::placeholder { color: rgba(237, 245, 236, 0.42); }
        .ns-ai .ns-input:focus {
          border-color: #BF461A;
          background: rgba(237, 245, 236, 0.10);
          box-shadow: 0 0 0 3px rgba(191, 70, 26, 0.18);
        }
        .ns-com .ns-input {
          background: #FFFFFF;
          border: 1.5px solid rgba(15, 30, 29, 0.16);
          color: #0F1E1D;
        }
        .ns-com .ns-input::placeholder { color: rgba(15, 30, 29, 0.40); }
        .ns-com .ns-input:focus {
          border-color: #3D5A4A;
          box-shadow: 0 0 0 3px rgba(61, 90, 74, 0.16);
        }
        .ns-submit {
          width: 100%;
          height: 48px;
          border-radius: 999px;
          border: 2px solid transparent;
          font-family: 'Mabbly Repro', 'Inter Tight', 'Arial Black', system-ui, sans-serif;
          font-weight: 900;
          font-size: 12px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 240ms, border-color 240ms, transform 240ms, box-shadow 240ms;
        }
        .ns-ai .ns-submit {
          background: #BF461A;
          color: #F8F2E5;
          border-color: #BF461A;
          box-shadow: 0 10px 24px -10px rgba(191, 70, 26, 0.5);
        }
        .ns-ai .ns-submit:hover {
          background: #0F1E1D;
          border-color: #0F1E1D;
          transform: translateY(-1px);
        }
        .ns-com .ns-submit {
          background: #0F1E1D;
          color: #F8F2E5;
          border-color: #0F1E1D;
          box-shadow: 0 10px 24px -10px rgba(15, 30, 29, 0.35);
        }
        .ns-com .ns-submit:hover {
          background: #3D5A4A;
          border-color: #3D5A4A;
          transform: translateY(-1px);
        }
        .ns-arrow { display: inline-block; transition: transform 280ms cubic-bezier(0.85, 0, 0.15, 1); }
        .ns-submit:hover .ns-arrow { transform: translateX(4px); }
        .ns-trust {
          font-family: 'DM Mono', 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 11px;
          letter-spacing: 0.04em;
          margin: 0;
          opacity: 0.6;
        }
        .ns-success {
          margin-top: auto;
          padding: 18px 20px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ns-ai .ns-success {
          background: rgba(41, 207, 157, 0.08);
          border: 1px solid rgba(41, 207, 157, 0.45);
        }
        .ns-com .ns-success {
          background: rgba(61, 90, 74, 0.08);
          border: 1px solid rgba(61, 90, 74, 0.45);
        }
        .ns-success-headline {
          font-family: 'Inter Tight', system-ui, -apple-system, sans-serif;
          font-weight: 800;
          font-size: 16px;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .ns-success-body {
          font-family: 'DM Mono', 'IBM Plex Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
          font-size: 12px;
          line-height: 1.5;
          margin: 0;
          opacity: 0.78;
        }
        @media (max-width: 540px) {
          .ns-card { padding: 28px 24px; min-height: 0; }
          .ns-row { flex-direction: column; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ns-submit:hover { transform: none; }
          .ns-submit:hover .ns-arrow { transform: none; }
        }
      `}</style>

      <div className="ns-inner">
        <h3 className="ns-headline">{headline}</h3>
        <p className="ns-sub">{sub}</p>

        {submitted ? (
          <div className="ns-success" role="status" aria-live="polite">
            <h4 className="ns-success-headline">You're on the list.</h4>
            <p className="ns-success-body">
              We'll be in touch. No spam, no resale.
            </p>
          </div>
        ) : (
          <form className="ns-form" onSubmit={handleSubmit} noValidate>
            <div className="ns-row">
              <input
                type="text"
                name="firstName"
                className="ns-input"
                placeholder="First name"
                aria-label="First name"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                name="lastName"
                className="ns-input"
                placeholder="Last name"
                aria-label="Last name"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <input
              type="email"
              name="email"
              className="ns-input"
              placeholder="Email address"
              aria-label="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              name="firm"
              className="ns-input"
              placeholder="Firm"
              aria-label="Firm"
              autoComplete="organization"
              value={firm}
              onChange={(e) => setFirm(e.target.value)}
              required
            />
            <button type="submit" className="ns-submit">
              {buttonLabel}
              <span className="ns-arrow" aria-hidden>→</span>
            </button>
            <p className="ns-trust">{trust}</p>
          </form>
        )}
      </div>
    </div>
  );
}
