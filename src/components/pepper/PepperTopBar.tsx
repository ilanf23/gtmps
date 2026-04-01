export default function PepperTopBar() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "linear-gradient(180deg, rgba(251,248,244,0.98) 0%, rgba(251,248,244,0.95) 100%)",
        backdropFilter: "blur(16px) saturate(1.4)",
        WebkitBackdropFilter: "blur(16px) saturate(1.4)",
        borderBottom: "1px solid rgba(198,93,62,0.08)",
        boxShadow: "0 1px 20px rgba(0,0,0,0.03)",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-10 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span
            className="text-[13px] font-bold tracking-[0.22em] uppercase"
            style={{ color: "#C65D3E", fontFamily: "'Inter', sans-serif" }}
          >
            MABBLY
          </span>
          <span className="w-px h-4 bg-[#DDD5CC] mx-2 hidden sm:block" />
          <span
            className="hidden sm:inline text-[11px] tracking-[0.12em] uppercase"
            style={{ color: "#A09890", fontFamily: "'Inter', sans-serif" }}
          >
            Market Activation
          </span>
        </div>

        {/* URL pill */}
        <span
          className="hidden md:inline-block text-[11px] px-4 py-1.5 rounded-full"
          style={{
            color: "#A09890",
            background: "rgba(198,93,62,0.04)",
            border: "1px solid rgba(198,93,62,0.1)",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          discover.mabbly.com/pepper-group
        </span>

        {/* Prepared for */}
        <span
          className="text-[11px] hidden lg:inline"
          style={{ color: "#6B6560", fontFamily: "'Inter', sans-serif" }}
        >
          Prepared for{" "}
          <strong style={{ color: "#2D2A26", fontWeight: 600 }}>Tim Padgett &amp; George Couris</strong>
        </span>
      </div>
    </div>
  );
}
