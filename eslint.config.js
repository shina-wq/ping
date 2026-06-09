import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-hooks/set-state-in-effect": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Import sorting rules
      "simple-import-sort/imports": ["error", {
        groups: [
          ["^[^@.]"],           // External packages (react, lucide-react, etc.)
          ["^@/api"],           // API types
          ["^@/contexts"],      // Contexts
          ["^@/hooks"],         // Hooks
          ["^@/components/(?!ui)"], // Components (non-UI)
          ["^@/components/ui"], // UI primitives
          ["^@/lib", "^@/utils", "^@/types"], // Lib, utils, types
          ["^\\."],             // Relative imports
        ],
      }],
      "simple-import-sort/exports": "error",
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
]);