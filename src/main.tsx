import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/microsite-theme.css";
import { initPostHog } from "./lib/posthog";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

initPostHog();

createRoot(document.getElementById("root")!).render(<App />);
