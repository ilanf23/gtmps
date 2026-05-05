import { useState, useEffect, useRef } from "react";
import { track } from "@/lib/posthog";

interface Props {
  buttonText: string;
  buttonUrl: string;
  label?: string;
  micrositeSlug?: string;
}

export default function StickyBottomCTA({ buttonText, buttonUrl, label = "15-min MAP Review", micrositeSlug }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const triggerRef = useRef<boolean>(false);

  useEffect(() => {
    // Check sessionStorage for dismissal
    if (sessionStorage.getItem("stickyCtaDismissed") === "1") {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      // Show after scrolling 500px (past hero + key numbers)
      const shouldShow = window.scrollY > 500;
      if (shouldShow !== triggerRef.current) {
        triggerRef.current = shouldShow;
        setVisible(shouldShow);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("stickyCtaDismissed", "1");
  };

  if (dismissed) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 transition-all duration-500"
      style={{
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="max-w-[1200px] mx-auto px-4 sm:px-6"
        style={{
          background: "rgba(251,248,244,0.95)",
          backdropFilter: "blur(16px) saturate(1.4)",
          WebkitBackdropFilter: "blur(16px) saturate(1.4)",
          borderTop: "1px solid rgba(198,93,62,0.1)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center justify-between py-3 gap-4">
          <span className="text-[13px] text-[#6B6560] hidden sm:block" style={{ fontFamily: "'Inter', sans-serif" }}>
            {label}
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <button
              className="font-semibold text-[13px] px-6 py-2.5 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #C65D3E, #A84D32)",
                color: "white",
                boxShadow: "0 4px 16px rgba(198,93,62,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(198,93,62,0.35)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(198,93,62,0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onClick={() => {
                track("microsite_cta_clicked", {
                  microsite_slug: micrositeSlug ?? "",
                  cta_id: "sticky_bottom",
                });
                window.open(buttonUrl, "_blank");
              }}
            >
              {buttonText}
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-[#C65D3E]/5"
              onClick={handleDismiss}
              aria-label="Dismiss"
            >
              <span className="text-[#A09890] text-sm">✕</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
