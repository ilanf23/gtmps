import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { captureLead } from "@/lib/leadCapture";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
  email: z.string().trim().email("Enter a valid email").max(320),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message is too long"),
});

type FormValues = z.infer<typeof schema>;

const DISPLAY =
  "'Mabbly Repro', 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif";
const MONO =
  "'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', monospace";
const BODY = "'Inter', 'Inter Tight', sans-serif";

type FieldKey = "name" | "email" | "message";

const FIELDS: { key: FieldKey; label: string; index: string; placeholder: string }[] = [
  { key: "name", label: "Name", index: "01", placeholder: "Jane Doe" },
  { key: "email", label: "Email Address", index: "02", placeholder: "jane@firm.com" },
  { key: "message", label: "Message", index: "03", placeholder: "What is on your mind?" },
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const tokens = values.name.trim().split(/\s+/);
    const first_name = tokens[0] ?? null;
    const last_name = tokens.length > 1 ? tokens.slice(1).join(" ") : null;
    const res = await captureLead({
      source: "contact",
      email: values.email,
      first_name,
      last_name,
      message: values.message,
    });
    if (!res.ok) {
      setSubmitError("Something went wrong. Please try again or email us directly.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#BF461A",
            fontWeight: 700,
            margin: "0 0 18px",
          }}
        >
          Message received
        </p>
        <h3
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(36px, 4vw, 56px)",
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            color: "#0F1E1D",
            margin: "0 0 16px",
            fontWeight: 900,
          }}
        >
          Thanks. We will be in touch.
        </h3>
        <p
          style={{
            fontFamily: BODY,
            fontSize: 18,
            lineHeight: 1.55,
            color: "rgba(15, 30, 29, 0.7)",
            margin: 0,
          }}
        >
          Expect a reply within one business day.
        </p>
      </div>
    );
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#BF461A",
    fontWeight: 700,
    display: "block",
    marginBottom: 14,
  };
  const indexStyle: React.CSSProperties = {
    color: "rgba(15, 30, 29, 0.22)",
    marginLeft: 10,
    fontWeight: 500,
  };
  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid #E5E0D8",
    padding: "12px 0",
    color: "#0F1E1D",
    fontFamily: BODY,
    fontSize: 22,
    fontWeight: 500,
    outline: "none",
    transition: "border-color 220ms ease",
  };
  const errStyle: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: "0.08em",
    color: "#BF461A",
    marginTop: 10,
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderBottomColor = "#BF461A";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderBottomColor = "#E5E0D8";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {FIELDS.map((f) => {
        const isMessage = f.key === "message";
        const err = errors[f.key]?.message;
        return (
          <div key={f.key} style={{ marginBottom: 44 }}>
            <label htmlFor={`contact-${f.key}`} style={labelStyle}>
              {f.label}
              <span style={indexStyle}>/ {f.index}</span>
            </label>
            {isMessage ? (
              <textarea
                id={`contact-${f.key}`}
                rows={4}
                maxLength={2000}
                placeholder={f.placeholder}
                {...register("message")}
                style={{ ...inputBase, resize: "none", lineHeight: 1.4 }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            ) : (
              <input
                id={`contact-${f.key}`}
                type={f.key === "email" ? "email" : "text"}
                autoComplete={f.key === "email" ? "email" : "name"}
                maxLength={f.key === "email" ? 320 : 120}
                placeholder={f.placeholder}
                {...register(f.key)}
                style={inputBase}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            )}
            {err && <p style={errStyle}>{err}</p>}
          </div>
        );
      })}

      {submitError && (
        <p style={{ ...errStyle, fontSize: 12, marginBottom: 16 }}>{submitError}</p>
      )}

      <div style={{ paddingTop: 12 }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "20px 40px",
            background: "#BF461A",
            color: "#FBF9F6",
            border: "none",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.6 : 1,
            overflow: "hidden",
            transition: "background 200ms ease",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) e.currentTarget.style.background = "#0F1E1D";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#BF461A";
          }}
        >
          <span style={{ position: "relative", zIndex: 1 }}>
            {isSubmitting ? "Sending…" : "Send Message"}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: "relative", zIndex: 1 }}
            aria-hidden
          >
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </form>
  );
}
