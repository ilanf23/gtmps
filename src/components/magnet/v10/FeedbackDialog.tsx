// In-page feedback dialog used by Section 3 (Core) and Section 4 (Proof).
// Replaces the previous /m/:slug/feedback navigation with a modal that
// posts to the same submit-feedback edge function.

import { useEffect, useState } from "react";
import { z } from "zod";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const feedbackSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(1, "Please share your feedback").max(2000),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug?: string;
  /** Optional context line (e.g. "Section 3 · Your Core") shown above the form. */
  context?: string;
  primary?: string;
}

export default function FeedbackDialog({
  open,
  onOpenChange,
  slug,
  context,
  primary = "#A8923A",
}: Props) {
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

  // Reset state whenever the dialog reopens.
  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setErrors({});
    }
  }, [open]);

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
      const payload = {
        ...parsed.data,
        slug: slug ?? null,
        message: context ? `[${context}] ${parsed.data.message}` : parsed.data.message,
      };
      const { error } = await supabase.functions.invoke("submit-feedback", {
        body: payload,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error("Feedback submit error", err);
      toast({
        title: "Couldn't send your feedback",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#EDF5EC] text-[#0F1E1D] border border-black/10 rounded-none">
        {submitted ? (
          <div className="py-8 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                backgroundColor: `${primary}26`,
                border: `1px solid ${primary}66`,
              }}
            >
              <Check className="w-6 h-6" style={{ color: primary }} />
            </div>
            <p
              className="text-xs uppercase tracking-[0.32em] mb-3"
              style={{ color: primary }}
            >
              Received
            </p>
            <h2 className="text-2xl font-semibold mb-3">
              Thanks. Adam reads every one.
            </h2>
            <p className="text-[#0F1E1D]/60 leading-relaxed">
              If your note needs a reply, you'll hear back at{" "}
              <span className="text-[#0F1E1D]/80">{email}</span>.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              {context ? (
                <p
                  className="text-[11px] uppercase tracking-[0.28em] font-semibold mb-1"
                  style={{ color: primary }}
                >
                  {context}
                </p>
              ) : null}
              <DialogTitle className="text-2xl font-semibold leading-tight">
                What worked. What didn't. What's missing.
              </DialogTitle>
              <DialogDescription className="text-[#0F1E1D]/70">
                Direct line to Adam. Every note is read.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2" noValidate>
              <div>
                <label
                  htmlFor="fbd-name"
                  className="block text-xs uppercase tracking-wider text-[#0F1E1D]/60 mb-2"
                >
                  Your name
                </label>
                <input
                  id="fbd-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  disabled={submitting}
                  className="w-full bg-white border border-black/10 text-[#0F1E1D] placeholder:text-black/30 px-3 py-2.5 text-sm rounded focus:outline-none focus:border-[#A8923A]/50 transition-colors"
                  placeholder="Jane Smith"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="fbd-email"
                  className="block text-xs uppercase tracking-wider text-[#0F1E1D]/60 mb-2"
                >
                  Email
                </label>
                <input
                  id="fbd-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  disabled={submitting}
                  className="w-full bg-white border border-black/10 text-[#0F1E1D] placeholder:text-black/30 px-3 py-2.5 text-sm rounded focus:outline-none focus:border-[#A8923A]/50 transition-colors"
                  placeholder="jane@firm.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="fbd-message"
                  className="block text-xs uppercase tracking-wider text-[#0F1E1D]/60 mb-2"
                >
                  Feedback
                </label>
                <textarea
                  id="fbd-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  disabled={submitting}
                  rows={5}
                  className="w-full bg-white border border-black/10 text-[#0F1E1D] placeholder:text-black/30 px-3 py-2.5 text-sm rounded focus:outline-none focus:border-[#A8923A]/50 transition-colors resize-y"
                  placeholder="What stood out? What was confusing? What would have made this more useful?"
                />
                <div className="flex justify-between mt-1.5">
                  <p className="text-xs text-red-500">{errors.message}</p>
                  <p className="text-xs text-black/30">{message.length}/2000</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="self-start font-semibold uppercase tracking-wider text-sm px-8 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{ backgroundColor: primary, color: "#0F1E1D" }}
              >
                {submitting ? "Sending…" : "Send feedback"}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
