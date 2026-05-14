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
          padding: "32px 28px",
          border: "1px solid rgba(168, 146, 58, 0.4)",
          borderRadius: 8,
          background: "rgba(168, 146, 58, 0.06)",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#A8923A",
            margin: "0 0 12px",
          }}
        >
          Message received
        </p>
        <h3
          style={{
            fontFamily: "var(--font-display, 'Inter Tight', sans-serif)",
            fontSize: 24,
            lineHeight: 1.2,
            color: "#EDF5EC",
            margin: "0 0 10px",
            fontWeight: 500,
          }}
        >
          Thanks. We will be in touch.
        </h3>
        <p
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15,
            lineHeight: 1.6,
            color: "rgba(237, 245, 236, 0.72)",
            margin: 0,
          }}
        >
          Expect a reply within one business day.
        </p>
      </div>
    );
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(237, 245, 236, 0.6)",
    marginBottom: 8,
    display: "block",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(237, 245, 236, 0.16)",
    borderRadius: 4,
    padding: "12px 14px",
    color: "#EDF5EC",
    fontFamily: "'Inter Tight', sans-serif",
    fontSize: 15,
    outline: "none",
    transition: "border-color 200ms ease, background 200ms ease",
  };
  const errStyle: React.CSSProperties = {
    fontFamily: "'Inter Tight', sans-serif",
    fontSize: 12,
    color: "#E5582B",
    marginTop: 6,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="contact-name" style={labelStyle}>Name</label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          maxLength={120}
          {...register("name")}
          style={inputStyle}
        />
        {errors.name && <p style={errStyle}>{errors.name.message}</p>}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="contact-email" style={labelStyle}>Email</label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          maxLength={320}
          {...register("email")}
          style={inputStyle}
        />
        {errors.email && <p style={errStyle}>{errors.email.message}</p>}
      </div>

      <div style={{ marginBottom: 24 }}>
        <label htmlFor="contact-message" style={labelStyle}>Message</label>
        <textarea
          id="contact-message"
          rows={6}
          maxLength={2000}
          {...register("message")}
          style={{ ...inputStyle, resize: "vertical", minHeight: 140, fontFamily: "'Inter Tight', sans-serif" }}
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
          fontFamily: "'Inter Tight', sans-serif",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.04em",
          padding: "13px 26px",
          borderRadius: 999,
          border: "none",
          background: "linear-gradient(135deg, #A8923A 0%, #C4AC4A 100%)",
          color: "#0F1E1D",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.6 : 1,
          transition: "transform 180ms ease, opacity 180ms ease",
        }}
      >
        {isSubmitting ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}