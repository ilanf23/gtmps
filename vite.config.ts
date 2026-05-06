import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    // Bigger chunks (eg recharts, framer) trigger Vite's default 500KB warning.
    // Raise so the build log stays signal-rich.
    chunkSizeWarningLimit: 1000,
    // NOTE: Do NOT add a custom `manualChunks` here. Splitting React into its
    // own chunk (e.g., "react-vendor") while leaving Radix / Framer / other
    // React-consuming libs in a "vendor" chunk causes the vendor chunk to
    // evaluate before React is ready, producing a blank white page with:
    //   "Cannot read properties of undefined (reading 'createContext')"
    // See docs/08-build-config.md for the full postmortem. Let Rollup do its
    // default chunking; performance is fine and correctness > micro-caching.
  },
}));
