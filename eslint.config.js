import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      // Forbidden vocabulary lock. Mirrors the enrich-magnet system prompt
      // (supabase/functions/enrich-magnet/index.ts line 77) so hand-written
      // JSX cannot regress around the AI guardrails. `leverage` is allowed
      // ONLY in the canonical phrase "leverage move" (Section 09 product name).
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/\\bsynerg(y|ies)\\b/i]",
          message: "Forbidden vocabulary: 'synergy'. Rephrase concretely.",
        },
        {
          selector: "JSXText[value=/\\bsynerg(y|ies)\\b/i]",
          message: "Forbidden vocabulary: 'synergy'. Rephrase concretely.",
        },
        {
          selector: "Literal[value=/\\boptimi[sz](e|ed|es|ing|ation)\\b/i]",
          message: "Forbidden vocabulary: 'optimize'. Use a concrete verb (built, tuned, improved).",
        },
        {
          selector: "JSXText[value=/\\boptimi[sz](e|ed|es|ing|ation)\\b/i]",
          message: "Forbidden vocabulary: 'optimize'. Use a concrete verb (built, tuned, improved).",
        },
        {
          selector: "Literal[value=/\\bunderutili[sz]ed\\b/i]",
          message: "Forbidden vocabulary: 'underutilized'. Say what is actually low (low usage, idle, dormant).",
        },
        {
          selector: "JSXText[value=/\\bunderutili[sz]ed\\b/i]",
          message: "Forbidden vocabulary: 'underutilized'. Say what is actually low (low usage, idle, dormant).",
        },
        {
          selector: "Literal[value=/\\bleverage(?!d?[ -]move)/i]",
          message: "Forbidden vocabulary: 'leverage'. Only allowed in the phrase 'leverage move' (Section 09 name).",
        },
        {
          selector: "JSXText[value=/\\bleverage(?!d?[ -]move)/i]",
          message: "Forbidden vocabulary: 'leverage'. Only allowed in the phrase 'leverage move' (Section 09 name).",
        },
        {
          selector: "Literal[value=/systematic\\s+origination/i]",
          message: "Banned AI tell: 'systematic origination'. Use 'deliberate', 'repeatable', or 'named-account' origination.",
        },
        {
          selector: "JSXText[value=/systematic\\s+origination/i]",
          message: "Banned AI tell: 'systematic origination'. Use 'deliberate', 'repeatable', or 'named-account' origination.",
        },
      ],
    },
  },
);
