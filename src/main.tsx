import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/microsite-theme.css";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

createRoot(document.getElementById("root")!).render(<App />);

// Recover from stale chunk hashes after a redeploy. When the browser holds an
// old index.js that references hashed chunks no longer on the CDN, dynamic
// imports throw "Failed to fetch dynamically imported module" and the route
// renders blank. Force a one-time hard reload so the user picks up the new
// index.html + fresh chunk graph.
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  if (sessionStorage.getItem("chunk-reloaded") === "1") return;
  sessionStorage.setItem("chunk-reloaded", "1");
  window.location.reload();
});
window.addEventListener("error", (event) => {
  const msg = event.message || "";
  if (!/Failed to fetch dynamically imported module|Importing a module script failed/i.test(msg)) return;
  if (sessionStorage.getItem("chunk-reloaded") === "1") return;
  sessionStorage.setItem("chunk-reloaded", "1");
  window.location.reload();
});

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
