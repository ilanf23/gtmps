import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/microsite-theme.css";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

createRoot(document.getElementById("root")!).render(<App />);
