export default function PepperTopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DDD5CC]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-14">
        <span
          className="text-[13px] font-bold tracking-[0.2em] uppercase"
          style={{ color: "#C65D3E" }}
        >
          MABBLY
        </span>
        <span className="hidden sm:inline-block text-[12px] text-[#A09890] bg-[#F3EDE6] rounded-full px-4 py-1">
          discover.mabbly.com/pepper-group
        </span>
        <span className="text-[12px] text-[#6B6560] hidden md:inline">
          Prepared for Tim Padgett &amp; George Couris
        </span>
      </div>
    </div>
  );
}
