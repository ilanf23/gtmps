import { useState, type ReactNode } from "react";
import { opsAuth } from "@/lib/opsClient";

interface OpsLayoutProps {
  onSignOut: () => void;
  lastRefresh: Date | null;
  onRefresh: () => void;
  active: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "microsites", label: "Microsites" },
  { id: "shares", label: "Shares" },
  { id: "emails", label: "Emails" },
  { id: "bookings", label: "Bookings" },
  { id: "health", label: "Health" },
];

function relativeTime(date: Date | null): string {
  if (!date) return "never";
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function OpsLayout({ onSignOut, lastRefresh, onRefresh, active, onTabChange, children }: OpsLayoutProps) {
  const [, force] = useState(0);
  // Re-render relative time every 30s.
  if (typeof window !== "undefined") {
    setTimeout(() => force((n) => n + 1), 30_000);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm font-mono tracking-[0.2em] text-zinc-300">EDITH · OPS</div>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span>last refresh: {relativeTime(lastRefresh)}</span>
            <button
              onClick={onRefresh}
              className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                opsAuth.clear();
                onSignOut();
              }}
              className="rounded border border-zinc-800 bg-transparent px-3 py-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="max-w-[1400px] mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                className={`px-4 py-2 text-sm border-b-2 transition-colors whitespace-nowrap ${
                  active === t.id
                    ? "border-zinc-100 text-zinc-100"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>
      <main className="max-w-[1400px] mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
