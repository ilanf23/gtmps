import { useEffect, useState } from "react";

/**
 * Thin horizontal gold rail that fills as the page is scrolled.
 * Used as the top edge of the sticky CTA bar.
 */
const ScrollProgressRail = ({ className = "" }: { className?: string }) => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = (doc.scrollHeight - window.innerHeight) || 1;
        setPct(Math.max(0, Math.min(1, window.scrollY / max)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`relative w-full ${className}`}
      style={{ height: 1, background: "rgba(168, 146, 58,0.12)" }}
    >
      <div
        style={{
          width: `${pct * 100}%`,
          height: "100%",
          background: "linear-gradient(to right, rgba(168, 146, 58,0.3), #A8923A)",
          transition: "width 80ms linear",
        }}
      />
    </div>
  );
};

export default ScrollProgressRail;
