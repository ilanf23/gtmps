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
    rollupOptions: {
      output: {
        // Keep heavy third-party deps in their own cache-stable chunks so a
        // typo fix in app code does not bust the 200KB+ vendor bundles.
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-pdf") || id.includes("pdfjs-dist")) return "pdf";
          if (id.includes("recharts") || id.includes("d3-")) return "recharts";
          if (id.includes("framer-motion")) return "framer";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("posthog-js")) return "posthog";
          if (
            id.includes("react-router") ||
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("scheduler")
          ) {
            return "react-vendor";
          }
          return "vendor";
        },
      },
    },
  },
}));
