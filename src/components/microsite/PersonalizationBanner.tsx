import { useRevealRef, revealStyle } from "@/hooks/useRevealRef";

interface Props {
  preparedFor: string;
  companyName: string;
  preparedDate?: string;
  discoveryDate?: string;
}

export default function PersonalizationBanner({
  preparedFor,
  companyName,
  preparedDate,
  discoveryDate,
}: Props) {
  const { ref, isVisible } = useRevealRef(100);

  return (
    <div ref={ref} style={revealStyle(isVisible)} className="flex flex-col items-center gap-2">
      <div
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
        style={{
          background: "rgba(198,93,62,0.04)",
          border: "1px solid rgba(198,93,62,0.12)",
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: "#C65D3E", boxShadow: "0 0 6px rgba(198,93,62,0.4)" }}
        />
        <span className="text-[12px] text-[#6B6560]" style={{ fontFamily: "'Inter', sans-serif" }}>
          Prepared exclusively for{" "}
          <strong className="text-[#2D2A26]">{preparedFor}</strong>
        </span>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-[#A09890] tracking-wide">
        <span>{companyName}</span>
        {preparedDate && (
          <>
            <span className="w-1 h-1 rounded-full bg-[#DDD5CC]" />
            <span>{preparedDate}</span>
          </>
        )}
        {discoveryDate && (
          <>
            <span className="w-1 h-1 rounded-full bg-[#DDD5CC]" />
            <span>Based on Discovery Session, {discoveryDate}</span>
          </>
        )}
      </div>
    </div>
  );
}
