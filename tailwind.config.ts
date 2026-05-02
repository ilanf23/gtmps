import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // Heading / display — Mabbly Repro per brand spec. Arial Black is the
        // doc-sanctioned visible substitute until the custom font lands.
        display: ["'Mabbly Repro'", "'Arial Black'", "Verdana", "Helvetica", "sans-serif"],
        // Editorial register — kept ONLY for decorative numerals + italic
        // pull quotes per the v2 brand migration (not for headings).
        serif:   ["'Cormorant Garamond'", "Georgia", "serif"],
        // Body — Mabbly Repro with Instrument Sans as the visible fallback
        // (closer to the Mabbly Repro register than Verdana while waiting).
        sans:    ["'Mabbly Repro'", "'Instrument Sans'", "system-ui", "sans-serif"],
        mono:    ["'Mabbly Repro Mono'", "'DM Mono'", "'Trebuchet MS'", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // === Mabbly brand v2.0 — primary spec colors ============================
        "deep-forest":    "#0F1E1D",
        "sage-light":     "#EDF5EC",
        "olive-gold":     "#A8923A",             // primary brand accent
        "burnt-orange":   "#BF461A",             // reserved for conversion CTAs only
        "dark-rust":      "#803402",
        "sage-medium":    "#D5DED4",
        "gold-highlight": "#FFBA1A",
        "amber":          "#A79014",
        "forest-teal":    "#225351",
        "sage-muted":     "#A1A9A0",
        "charcoal":       "#141413",
        "card-dark":      "#1A2B2A",
        "cta-purple":     "#491D89",
        "signal-red":     "#C02B0A",

        // === Backwards-compat aliases — point at new spec values ==============
        ink: "#0F1E1D",                          // → Deep Forest
        gold: "#A8923A",                         // → Olive Gold (primary accent)
        sage: "#225351",                         // → Forest Teal
        rust: "#803402",                         // → Dark Rust
        slate: "#A1A9A0",                        // → Sage Muted
        cream: "hsl(var(--cream))",              // CSS var retuned in index.css
        "warm-white": "hsl(var(--warm-white))",
        "soft-navy": "hsl(var(--soft-navy))",    // unchanged — verticals (out of scope)
        "text-dark": "hsl(var(--text-dark))",
        "text-body": "hsl(var(--text-body))",
        "surface-dark": "#1A2B2A",               // → Card Dark
        "surface-darker": "#0F1E1D",             // → Deep Forest
        "muted-color": "#A1A9A0",                // → Sage Muted
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Mabbly Design System v1.0 (2026-05-02) — semantic tokens.
        // New code uses these. Existing brand aliases (ink/gold/...) remain
        // for backward compat until the codemod sweep (P1).
        // Namespaced as `ds-*` to avoid collision with shadcn's `accent` etc.
        "ds-surface": {
          page:    "var(--color-surface-page)",
          raised:  "var(--color-surface-raised)",
          sunken:  "var(--color-surface-sunken)",
          inverse: "var(--color-surface-inverse)",
        },
        "ds-content": {
          primary:   "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary:  "var(--color-text-tertiary)",
          inverse:   "var(--color-text-inverse)",
          link:      "var(--color-text-link)",
          disabled:  "var(--color-text-disabled)",
        },
        "ds-stroke": {
          subtle:  "var(--color-border-subtle)",
          DEFAULT: "var(--color-border-default)",
          strong:  "var(--color-border-strong)",
          focus:   "var(--color-border-focus)",
        },
        "ds-accent": {
          DEFAULT: "var(--color-accent-primary)",
          hover:   "var(--color-accent-primary-hover)",
          active:  "var(--color-accent-primary-active)",
          on:      "var(--color-accent-primary-on)",
          secondary:      "var(--color-accent-secondary)",
          "secondary-on": "var(--color-accent-secondary-on)",
          tertiary:       "var(--color-accent-tertiary)",
          "tertiary-on":  "var(--color-accent-tertiary-on)",
        },
        "ds-status": {
          success:      "var(--color-status-success)",
          "success-on": "var(--color-status-success-on)",
          warning:      "var(--color-status-warning)",
          "warning-on": "var(--color-status-warning-on)",
          error:        "var(--color-status-error)",
          "error-on":   "var(--color-status-error-on)",
          info:         "var(--color-status-info)",
          "info-on":    "var(--color-status-info-on)",
        },
        // Per-client (Magnet) — runtime injected by useClientTheme.
        // Sprint 2 splits chrome from body to fix the Cravath dark-bg failure.
        "ds-client": {
          accent:      "var(--client-accent, var(--color-accent-primary))",
          "accent-on": "var(--client-accent-on, var(--color-accent-primary-on))",
          "chrome-bg":   "var(--client-chrome-bg, var(--color-surface-inverse))",
          "chrome-text": "var(--client-chrome-text, var(--color-text-inverse))",
          "body-bg":     "var(--client-body-bg, var(--color-surface-page))",
          "body-text":   "var(--client-body-text, var(--color-text-primary))",
        },
      },
      // Mabbly Design System v1.0 — type scale (7 semantic roles).
      // Namespaced `ds-*` to avoid collision with default text-base/lg/xl.
      fontSize: {
        "ds-display":    ["clamp(3rem, 5vw + 1rem, 4.5rem)",        { lineHeight: "1.05", letterSpacing: "-0.015em", fontWeight: "500" }],
        "ds-headline":   ["clamp(2rem, 3vw + 0.5rem, 2.5rem)",       { lineHeight: "1.15", letterSpacing: "-0.01em",  fontWeight: "500" }],
        "ds-title":      ["clamp(1.375rem, 1vw + 1rem, 1.5rem)",     { lineHeight: "1.3",  letterSpacing: "-0.005em", fontWeight: "600" }],
        "ds-body":       ["1rem",                                    { lineHeight: "1.6" }],
        "ds-body-large": ["1.125rem",                                { lineHeight: "1.55" }],
        "ds-label":      ["0.75rem",                                 { lineHeight: "1.4",  letterSpacing: "0.12em",   fontWeight: "500" }],
        "ds-caption":    ["0.875rem",                                { lineHeight: "1.5" }],
      },
      maxWidth: {
        "ds-prose":   "65ch",
        "ds-content": "1040px",
        "ds-wide":    "1280px",
        "ds-page":    "1440px",
      },
      boxShadow: {
        "ds-sm":    "var(--shadow-sm)",
        "ds-md":    "var(--shadow-md)",
        "ds-lg":    "var(--shadow-lg)",
        "ds-xl":    "var(--shadow-xl)",
        "ds-focus": "var(--shadow-focus)",
      },
      transitionDuration: {
        "ds-instant":   "var(--duration-instant)",
        "ds-fast":      "var(--duration-fast)",
        "ds-normal":    "var(--duration-normal)",
        "ds-slow":      "var(--duration-slow)",
        "ds-slower":    "var(--duration-slower)",
        "ds-cinematic": "var(--duration-cinematic)",
      },
      transitionTimingFunction: {
        "ds-default":   "var(--easing-default)",
        "ds-in":        "var(--easing-in)",
        "ds-out":       "var(--easing-out)",
        "ds-bounce":    "var(--easing-bounce)",
        "ds-editorial": "var(--easing-editorial)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "25px",                            // primary CTA per brand spec §3.2
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
