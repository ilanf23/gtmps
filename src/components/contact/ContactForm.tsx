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

const MONO =
  "'Mabbly Repro Mono', 'JetBrains Mono', 'IBM Plex Mono', monospace";
const DISPLAY =
  "'Mabbly Repro', 'Inter Tight', 'Arial Black', 'Helvetica Neue', sans-serif";
const BODY = "'Inter', 'Inter Tight', sans-serif";

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
      <div
        style={{
          padding: "8px 4px",
        }}
      >
        <p
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#BF461A",
            fontWeight: 700,
            margin: "0 0 14px",
          }}
        >
          Message received
        </p>
        <h3
          style={{
            fontFamily: DISPLAY,
            fontSize: 28,
            lineHeight: 1.15,
            color: "#0F1E1D",
            margin: "0 0 12px",
            fontWeight: 900,
            letterSpacing: "-0.015em",
          }}
        >
          Thanks. We will be in touch.
        </h3>
        <p
          style={{
            fontFamily: BODY,
            fontSize: 16,
            lineHeight: 1.6,
            color: "rgba(15, 30, 29, 0.72)",
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
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(15, 30, 29, 0.6)",
    fontWeight: 700,
    marginBottom: 10,
    display: "block",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#FFFFFF",
    border: "1px solid #E5E0CF",
    borderRadius: 8,
    padding: "13px 14px",
    color: "#0F1E1D",
    fontFamily: BODY,
    fontSize: 15,
    outline: "none",
    transition: "border-color 200ms ease, box-shadow 200ms ease",
  };
  const errStyle: React.CSSProperties = {
    fontFamily: BODY,
    fontSize: 12,
    color: "#BF461A",
    marginTop: 6,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ marginBottom: 22 }}>
        <label htmlFor="contact-name" style={labelStyle}>Name</label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          maxLength={120}
          {...register("name")}
          style={inputStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#BF461A";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(191, 70, 26, 0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E5E0CF";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {errors.name && <p style={errStyle}>{errors.name.message}</p>}
      </div>

      <div style={{ marginBottom: 22 }}>
        <label htmlFor="contact-email" style={labelStyle}>Email</label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          maxLength={320}
          {...register("email")}
          style={inputStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#BF461A";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(191, 70, 26, 0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E5E0CF";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {errors.email && <p style={errStyle}>{errors.email.message}</p>}
      </div>

      <div style={{ marginBottom: 28 }}>
        <label htmlFor="contact-message" style={labelStyle}>Message</label>
        <textarea
          id="contact-message"
          rows={6}
          maxLength={2000}
          {...register("message")}
          style={{ ...inputStyle, resize: "vertical", minHeight: 150, fontFamily: BODY }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#BF461A";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(191, 70, 26, 0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E5E0CF";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {errors.message && <p style={errStyle}>{errors.message.message}</p>}
      </div>

      {submitError && (
        <p style={{ ...errStyle, marginBottom: 16, fontSize: 13 }}>{submitError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: 11,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          padding: "14px 26px",
          borderRadius: 999,
          border: "none",
          background: "#BF461A",
          color: "#F5F1E8",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.6 : 1,
          transition: "transform 180ms ease, background 180ms ease",
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting) e.currentTarget.style.background = "#A53A14";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#BF461A";
        }}
      >
        {isSubmitting ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
