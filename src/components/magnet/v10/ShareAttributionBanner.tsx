// Pinned banner shown when a visitor arrives via /m/:slug?share_id=<token>
// and the token matches the persisted submission row.

interface Props {
  fromName: string | null;
  fromFirm: string | null;
  primary: string;
}

export default function ShareAttributionBanner({ fromName, fromFirm, primary }: Props) {
  const who = fromName ?? "A colleague";
  const where = fromFirm ?? "your firm";
  return (
    <div
      role="note"
      className="sticky top-0 z-30 w-full border-b text-xs sm:text-sm"
      style={{
        backgroundColor: primary,
        color: "#120D05",
        borderColor: "rgba(0,0,0,0.15)",
      }}
    >
      <div className="max-w-[806px] mx-auto px-6 py-2.5 flex items-center gap-2">
        <span className="font-semibold uppercase tracking-[0.18em] text-[10px] sm:text-[11px]">
          Shared with you
        </span>
        <span className="opacity-40" aria-hidden>·</span>
        <span className="opacity-90">
          <strong className="font-semibold">{who}</strong> at{" "}
          <strong className="font-semibold">{where}</strong> sent you this map.
        </span>
      </div>
    </div>
  );
}
