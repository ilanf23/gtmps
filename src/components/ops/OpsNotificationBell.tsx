import { useEffect, useRef, useState } from "react";
import { opsGet } from "@/lib/opsClient";
import { relativeTime } from "@/lib/relativeTime";

interface ActivityItem {
  kind: string;
  at: string;
  slug: string;
  label: string;
}

interface OverviewActivityResponse {
  activity: ActivityItem[];
}

const LAST_SEEN_KEY = "ops:notifications:lastSeenAt";

const KIND_GLYPH: Record<string, string> = {
  submission: "▦",
  completion: "✓",
  share: "⤳",
  booking: "★",
};

function readLastSeen(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_SEEN_KEY);
  } catch {
    return null;
  }
}

function writeLastSeen(value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_SEEN_KEY, value);
  } catch {
    // ignore
  }
}

interface OpsNotificationBellProps {
  refreshNonce: number;
}

export function OpsNotificationBell({ refreshNonce }: OpsNotificationBellProps) {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(() => readLastSeen());
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Re-render relative timestamps every 30s while the panel is open.
  const [, force] = useState(0);
  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => force((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    opsGet<OverviewActivityResponse>("/ops-overview")
      .then((d) => {
        if (!cancelled) setActivity(Array.isArray(d?.activity) ? d.activity : []);
      })
      .catch((e) => {
        if (!cancelled) console.warn("[ops-bell] fetch failed", e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshNonce]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const unseenCount = activity.reduce(
    (n, a) => (!lastSeen || a.at > lastSeen ? n + 1 : n),
    0,
  );

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        const now = new Date().toISOString();
        writeLastSeen(now);
        setLastSeen(now);
      }
      return next;
    });
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={handleToggle}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#22332F] bg-[#1A2B2A] text-[#EDF5EC] hover:bg-[#22332F] transition-colors"
      >
        <span aria-hidden>🔔</span>
        {unseenCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#BF461A]" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Notifications panel"
          className="absolute right-0 top-full mt-2 w-[360px] max-h-[440px] overflow-y-auto rounded-lg border border-[#22332F] bg-[#1A2B2A] text-[#EDF5EC] shadow-xl z-20"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#22332F]">
            <span className="text-[12px] font-black tracking-[0.16em] uppercase">
              Notifications
            </span>
            <span className="text-[11px] text-[#A1A9A0]">
              {activity.length === 0 ? "" : `${activity.length} recent`}
            </span>
          </div>

          {loading && activity.length === 0 ? (
            <div className="px-4 py-6 text-[12px] text-[#A1A9A0]">Loading…</div>
          ) : activity.length === 0 ? (
            <div className="px-4 py-6 text-[12px] text-[#A1A9A0]">
              No recent activity.
            </div>
          ) : (
            <ul className="divide-y divide-[#22332F]">
              {activity.map((a, i) => {
                const isFresh = !!lastSeen && a.at > lastSeen;
                const glyph = KIND_GLYPH[a.kind] ?? "•";
                return (
                  <li
                    key={`${a.at}-${a.slug}-${i}`}
                    className={`flex items-start gap-3 px-4 py-3 ${
                      isFresh ? "border-l-2 border-l-[#FFBA1A]" : "border-l-2 border-l-transparent"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`text-[14px] leading-none mt-0.5 ${
                        isFresh ? "text-[#FFBA1A]" : "text-[#A1A9A0]"
                      }`}
                    >
                      {glyph}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] text-[#EDF5EC] truncate">{a.label}</div>
                      <div className="mt-0.5 text-[11px] text-[#6E7A72]">
                        {relativeTime(a.at)}
                        {a.slug ? ` · ${a.slug}` : ""}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
