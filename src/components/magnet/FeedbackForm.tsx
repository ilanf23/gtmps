import { useState } from "react";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { identifyByEmail, track } from "@/lib/posthog";

const feedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ message: "Please enter your name" })
    .max(100, { message: "Name must be under 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email" })
    .max(255, { message: "Email must be under 255 characters" }),
  message: z
    .string()
    .trim()
    .nonempty({ message: "Please share your feedback" })
    .max(2000, { message: "Feedback must be under 2000 characters" }),
});

export default function FeedbackForm() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = feedbackSchema.safeParse({ name, email, message });
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof errors;
        if (field) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-feedback", {
        body: { ...parsed.data, slug: slug ?? null },
      });
      if (error) throw error;
      identifyByEmail(parsed.data.email, "feedback");
      track("feedback_submitted", { slug: slug ?? "" });
      setSubmitted(true);
    } catch (err) {
      console.error("Feedback submit error", err);
      track("feedback_submit_failed", {
        slug: slug ?? "",
        reason: err instanceof Error ? err.message : "unknown",
      });
      toast({
        title: "Couldn't send your feedback",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 rounded-full bg-[#A8923A]/15 border border-[#A8923A]/40 flex items-center justify-center mx-auto mb-6">
            <Check className="w-6 h-6 text-[#A8923A]" />
          </div>
          <p className="text-[#A8923A] text-xs uppercase tracking-[0.32em] mb-3">
            Received
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F1E1D] mb-3">
            Thanks. Adam reads every one.
          </h2>
          <p className="text-[#0F1E1D]/60 leading-relaxed">
            If your note needs a reply, you'll hear back at{" "}
            <span className="text-[#0F1E1D]/80">{email}</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-start justify-center px-4 sm:px-6 py-12 sm:py-20">
      <div className="w-full max-w-xl">
        <p className="text-[#A8923A] text-xs uppercase tracking-[0.32em] mb-3">
          Feedback
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#0F1E1D] mb-3 leading-tight">
          What worked. What didn't. What's missing.
        </h1>
        <p className="text-[#0F1E1D]/60 mb-10 leading-relaxed">
          Direct line to Adam. Every note is read.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div>
            <label
              htmlFor="fb-name"
              className="block text-xs uppercase tracking-wider text-[#0F1E1D]/60 mb-2"
            >
              Your name
            </label>
            <input
              id="fb-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              disabled={submitting}
              className="w-full bg-black/5 border border-black/10 text-[#0F1E1D] placeholder:text-black/30 px-3 py-2.5 text-sm rounded focus:outline-none focus:border-[#A8923A]/50 transition-colors"
              placeholder="Jane Smith"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="fb-email"
              className="block text-xs uppercase tracking-wider text-[#0F1E1D]/60 mb-2"
            >
              Email
            </label>
            <input
              id="fb-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              disabled={submitting}
              className="w-full bg-black/5 border border-black/10 text-[#0F1E1D] placeholder:text-black/30 px-3 py-2.5 text-sm rounded focus:outline-none focus:border-[#A8923A]/50 transition-colors"
              placeholder="jane@firm.com"
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="fb-message"
              className="block text-xs uppercase tracking-wider text-[#0F1E1D]/60 mb-2"
            >
              Feedback
            </label>
            <textarea
              id="fb-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              disabled={submitting}
              rows={6}
              className="w-full bg-black/5 border border-black/10 text-[#0F1E1D] placeholder:text-black/30 px-3 py-2.5 text-sm rounded focus:outline-none focus:border-[#A8923A]/50 transition-colors resize-y"
              placeholder="What stood out? What was confusing? What would have made this more useful?"
            />
            <div className="flex justify-between mt-1.5">
              <p className="text-xs text-red-400">{errors.message}</p>
              <p className="text-xs text-black/30">{message.length}/2000</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="self-start bg-[#A8923A] hover:bg-[#8F7C2F] text-[#0F1E1D] font-semibold uppercase tracking-wider text-sm px-8 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending…" : "Send feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
