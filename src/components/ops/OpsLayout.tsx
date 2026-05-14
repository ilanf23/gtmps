import { useEffect, useState, type ReactNode } from "react";
import { opsAuth } from "@/lib/opsClient";
import { relativeTime } from "@/lib/relativeTime";
import { OpsNotificationBell } from "./OpsNotificationBell";

interface OpsLayoutProps {
  onSignOut: () => void;
  lastRefresh: Date | null;
  onRefresh: () => void;
  refreshNonce: number;
  active: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

const TABS: Array<{ id: string; label: string; icon: string }> = [
  { id: "overview", label: "Overview", icon: "▦" },
  { id: "microsites", label: "Microsites", icon: "◯" },
  { id: "shares", label: "Shares", icon: "⤳" },
  { id: "emails", label: "Emails", icon: "✉" },
  { id: "leads", label: "Leads", icon: "☍" },
  { id: "bookings", label: "Bookings", icon: "★" },
  { id: "referrals", label: "Referrals", icon: "⇆" },
  { id: "health", label: "Health", icon: "♥" },
];

export function OpsLayout({ onSignOut, lastRefresh, onRefresh, refreshNonce, active, onTabChange, children }: OpsLayoutProps) {
  const [, force] = useState(0);
  // Re-render relative time every 30s.
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const activeTab = TABS.find((t) => t.id === active);

  return (
    <div className="min-h-screen flex bg-[#0F1E1D] text-[#EDF5EC] font-sans">
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 bg-[#1A2B2A] border-r border-[#22332F] flex flex-col p-4">
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#BF461A]" />
          <span className="text-[12px] font-black tracking-[0.18em]">EDITH OPS</span>
        </div>

        <div className="h-6" />

        <div className="px-3 text-[9px] font-black tracking-[0.16em] text-[#6E7A72]">
          WORKSPACE
        </div>

        <nav className="mt-2 flex flex-col gap-1">
          {TABS.map((t) => {
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] text-left transition-colors ${
                  isActive
                    ? "bg-[#22332F] border border-[#2E423E] text-[#EDF5EC]"
                    : "border border-transparent text-[#A1A9A0] hover:text-[#EDF5EC] hover:bg-[#22332F]/50"
                }`}
              >
                <span className={`text-[14px] leading-none ${isActive ? "text-[#FFBA1A]" : ""}`}>
                  {t.icon}
                </span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <button
          onClick={() => {
            opsAuth.clear();
            onSignOut();
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] text-[#A1A9A0] hover:text-[#EDF5EC] hover:bg-[#22332F]/50 transition-colors"
        >
          <span aria-hidden>↩</span>
          <span>Sign out</span>
        </button>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-[#22332F] flex items-center gap-4 px-6 sticky top-0 bg-[#0F1E1D] z-10">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-black tracking-[0.16em] uppercase text-[#EDF5EC]">
              {activeTab?.label ?? active}
            </span>
            <span className="text-[#6E7A72] text-[13px]">·</span>
            <span className="text-[12px] text-[#A1A9A0]">
              Last refresh: {relativeTime(lastRefresh)}
            </span>
          </div>

          <div className="flex-1" />

          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-lg border border-[#22332F] bg-[#1A2B2A] px-3 h-9 text-[12px] text-[#EDF5EC] hover:bg-[#22332F] transition-colors"
          >
            <span aria-hidden>↻</span>
            Refresh
          </button>

          <OpsNotificationBell refreshNonce={refreshNonce} />
        </header>

        {/* Body */}
        <main className="flex-1 overflow-x-hidden p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
