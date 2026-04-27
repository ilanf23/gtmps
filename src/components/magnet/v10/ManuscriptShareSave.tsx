// SECTION 11 — Manuscript anchor + Share + Save cards.

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MANUSCRIPT_INTRODUCTION } from "@/content/manuscriptQuotes";
import { trackMagnetEvent } from "@/lib/magnetAnalytics";
import { MABBLY_GOLD } from "@/lib/mabblyAnchors";

interface Props {
  slug: string;
  shareToken: string | null;
  vertical: string;
  customerName: string;
  fromName: string | null;
  primary: string;
  emailSubject: string;
  shareTemplate: string;
}

export default function ManuscriptShareSave({
  slug,
  shareToken,
  vertical,
  customerName,
  fromName,
  primary,
  emailSubject,
  shareTemplate,
}: Props) {
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const buildShareUrl = () => {
    const base = `${window.location.origin}/m/${slug}`;
    const params = new URLSearchParams();
    if (shareToken) params.set("share_id", shareToken);
    if (vertical && vertical !== "general") params.set("vertical", vertical);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const handleCopyShare = async () => {
    const url = buildShareUrl();
    const text = `${shareTemplate} ${url}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied — share it with your team.");
      trackMagnetEvent(slug, "share_click", { channel: "copy", vertical });
      await supabase
        .from("magnet_share_events")
        .insert({ slug, share_token: shareToken, channel: "copy" });
    } catch {
      toast.error("Couldn't copy. Long-press the URL bar to copy manually.");
    }
  };

  const handleEmailForward = async () => {
    const url = buildShareUrl();
    const subject = encodeURIComponent(`${emailSubject} — ${customerName}`);
    const body = encodeURIComponent(
      `${shareTemplate}\n\n${url}\n\n${
        fromName ? `— ${fromName}` : ""
      }`.trim()
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackMagnetEvent(slug, "share_click", { channel: "email", vertical });
    await supabase
      .from("magnet_share_events")
      .insert({ slug, share_token: shareToken, channel: "email" });
  };

  const submitSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailValue.trim();
    if (!trimmed.includes("@")) return;
    setEmailSending(true);
    trackMagnetEvent(slug, "save_submit", { vertical });
    const { error } = await supabase
      .from("magnet_map_emails")
      .insert({ slug, email: trimmed, vertical });
    setEmailSending(false);
    if (error) {
      toast.error("Couldn't save your email. Try again.");
      return;
    }
    setEmailSent(true);
  };

  return (
    <section
      id="v10-section-11"
      data-v10-section="11"
      className="py-16 md:py-24"
    >
      {/* Manuscript anchor */}
      <div className="flex items-center gap-2 mb-5">
        <span className="h-px w-6" style={{ backgroundColor: MABBLY_GOLD }} aria-hidden />
        <p
          className="text-[11px] uppercase tracking-[0.3em] font-semibold"
          style={{ color: MABBLY_GOLD }}
        >
          11 · Manuscript anchor
        </p>
      </div>

      <figure
        className="max-w-2xl mb-12 md:mb-16 pl-5"
        style={{ borderLeft: `2px solid ${MABBLY_GOLD}` }}
      >
        <blockquote
          className="text-xl md:text-2xl leading-snug italic"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          "{MANUSCRIPT_INTRODUCTION.text}"
        </blockquote>
        <figcaption className="text-[10px] uppercase tracking-[0.25em] mt-4 opacity-55">
          — {MANUSCRIPT_INTRODUCTION.attribution}
        </figcaption>
      </figure>

      {/* Share + Save cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* SHARE */}
        <div className="bg-[#FBF8F4] border border-black/10 p-5 md:p-6 flex flex-col">
          <p
            className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-2"
            style={{ color: primary }}
          >
            Share
          </p>
          <h3
            className="font-bold leading-tight text-xl mb-2"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Send this to your partner.
          </h3>
          <p className="text-sm opacity-75 mb-5 flex-1">
            If someone else at your firm should see this, they should. They will see your map,
            scores, and findings — with your name on it.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleEmailForward}
              className="h-12 min-h-[48px] px-5 font-semibold tracking-wide uppercase text-xs flex-1 border transition-colors hover:opacity-90"
              style={{
                backgroundColor: primary,
                color: "#120D05",
                borderColor: primary,
              }}
            >
              Email forward
            </button>
            <button
              type="button"
              onClick={handleCopyShare}
              className="h-12 min-h-[48px] px-5 font-semibold tracking-wide uppercase text-xs flex-1 border transition-colors hover:opacity-90"
              style={{
                color: primary,
                borderColor: primary,
                backgroundColor: "transparent",
              }}
            >
              Copy link
            </button>
          </div>
        </div>

        {/* SAVE */}
        <div className="bg-[#FBF8F4] border border-black/10 p-5 md:p-6 flex flex-col">
          <p
            className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-2"
            style={{ color: primary }}
          >
            Save
          </p>
          <h3
            className="font-bold leading-tight text-xl mb-2"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Email me this map.
          </h3>
          <p className="text-sm opacity-75 mb-5 flex-1">
            Save it for later. Re-take in 90 days. See how you have changed.
          </p>
          <button
            type="button"
            onClick={() => {
              trackMagnetEvent(slug, "save_click", { vertical });
              setEmailSent(false);
              setEmailValue("");
              setEmailOpen(true);
            }}
            className="h-12 min-h-[48px] px-5 font-semibold tracking-wide uppercase text-xs border transition-colors hover:opacity-90"
            style={{
              backgroundColor: primary,
              color: "#120D05",
              borderColor: primary,
            }}
          >
            Email me this map
          </button>
        </div>
      </div>

      {/* Save dialog */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="sm:max-w-md bg-[#FBF8F4] text-[#1C1008] border border-black/10 rounded-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold leading-tight">
              {emailSent ? "Sent." : emailSubject}
            </DialogTitle>
            <DialogDescription className="text-[#1C1008]/70">
              {emailSent
                ? `We'll send the ${customerName} map to ${emailValue.trim()} shortly. The map stays here either way.`
                : "We'll send a copy to your inbox. No newsletter, no follow-up sequence — just the map."}
            </DialogDescription>
          </DialogHeader>
          {!emailSent && (
            <form onSubmit={submitSaveEmail} className="space-y-4 pt-2">
              <input
                type="email"
                required
                autoFocus
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="you@yourfirm.com"
                className="w-full bg-white border border-black/10 text-[#1C1008] placeholder:text-black/30 focus:outline-none focus:ring-0 rounded-none h-12 px-4 text-base"
                style={{ borderColor: "rgba(0,0,0,0.15)" }}
              />
              <DialogFooter>
                <button
                  type="submit"
                  disabled={emailSending}
                  className="w-full h-12 font-semibold tracking-wide uppercase text-sm transition-opacity disabled:opacity-50 hover:opacity-90"
                  style={{
                    backgroundColor: primary,
                    color: "#120D05",
                  }}
                >
                  {emailSending ? "Saving…" : "Send map"}
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
