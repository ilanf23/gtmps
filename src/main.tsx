import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/microsite-theme.css";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

createRoot(document.getElementById("root")!).render(<App />);

// Defer PostHog until the browser is idle so its ~50KB bundle never blocks
// first paint or interaction. Dynamic import keeps it out of the main chunk
// entirely. Falls back to setTimeout in browsers without requestIdleCallback.
const idle =
  (typeof window !== "undefined" &&
    (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number })
      .requestIdleCallback) ||
  ((cb: () => void) => setTimeout(cb, 1500));
idle(
  () => {
    void import("./lib/posthog").then(({ initPostHog }) => initPostHog());
  },
  { timeout: 3000 },
);
