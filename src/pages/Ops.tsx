import { useEffect, useState } from "react";
import { OpsAuthGate } from "@/components/ops/OpsAuthGate";
import { OpsLayout } from "@/components/ops/OpsLayout";
import { OverviewTab } from "@/components/ops/tabs/OverviewTab";
import { MicrositesTab } from "@/components/ops/tabs/MicrositesTab";
import { SharesTab } from "@/components/ops/tabs/SharesTab";
import { EmailsTab } from "@/components/ops/tabs/EmailsTab";
import { LeadsTab } from "@/components/ops/tabs/LeadsTab";
import { BookingsTab } from "@/components/ops/tabs/BookingsTab";
import { ReferralsTab } from "@/components/ops/tabs/ReferralsTab";
import { HealthTab } from "@/components/ops/tabs/HealthTab";
import { opsAuth } from "@/lib/opsClient";

const Ops = () => {
  const [authed, setAuthed] = useState<boolean>(() => !!opsAuth.get());
  const [active, setActive] = useState<string>("overview");
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Inject noindex meta + page title.
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "EDITH OPS";
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    let created = false;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
      created = true;
    }
    const prevContent = meta.getAttribute("content");
    meta.setAttribute("content", "noindex,nofollow");
    return () => {
      document.title = prevTitle;
      if (created && meta?.parentNode) meta.parentNode.removeChild(meta);
      else if (meta && prevContent !== null) meta.setAttribute("content", prevContent);
    };
  }, []);

  useEffect(() => {
    if (authed) setLastRefresh(new Date());
  }, [authed, refreshNonce]);

  if (!authed) {
    return <OpsAuthGate onAuthed={() => setAuthed(true)} />;
  }

  const handleRefresh = () => setRefreshNonce((n) => n + 1);
  const handleUnauth = () => setAuthed(false);

  return (
    <OpsLayout
      active={active}
      onTabChange={setActive}
      onSignOut={() => setAuthed(false)}
      onRefresh={handleRefresh}
      refreshNonce={refreshNonce}
      lastRefresh={lastRefresh}
    >
      {active === "overview" && <OverviewTab refreshNonce={refreshNonce} onUnauth={handleUnauth} />}
      {active === "microsites" && <MicrositesTab refreshNonce={refreshNonce} onUnauth={handleUnauth} />}
      {active === "shares" && <SharesTab refreshNonce={refreshNonce} onUnauth={handleUnauth} />}
      {active === "emails" && <EmailsTab refreshNonce={refreshNonce} onUnauth={handleUnauth} />}
      {active === "leads" && <LeadsTab refreshNonce={refreshNonce} onUnauth={handleUnauth} />}
      {active === "bookings" && <BookingsTab refreshNonce={refreshNonce} onUnauth={handleUnauth} />}
      {active === "referrals" && <ReferralsTab refreshNonce={refreshNonce} onUnauth={handleUnauth} />}
      {active === "health" && <HealthTab refreshNonce={refreshNonce} onUnauth={handleUnauth} />}
    </OpsLayout>
  );
};

export default Ops;
