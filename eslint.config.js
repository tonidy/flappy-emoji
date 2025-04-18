import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
// Potentially import the auto-import config if needed, or handle globals differently
// import autoImportConfig from './.eslintrc-auto-import.json';

export default tseslint.config(
  // Global ignores
  { ignores: ["dist", "dev-dist"] },

  // Base recommended configs applied globally
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Configuration specific to TS/TSX files in src
  {
    // Remove the 'extends' key here
    files: ["**/src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        // If .eslintrc-auto-import.json defined globals, merge them here:
        // ...autoImportConfig.globals,
      },
      // parser: tseslint.parser, // Often needed explicitly
      // parserOptions: { // If you need specific TS parser options
      //   project: './tsconfig.json',
      // },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // Apply base rules from plugins
      ...reactHooks.configs.recommended.rules,
      // Your custom rules
      "@typescript-eslint/no-empty-object-type": "off", // Keep your rule
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // If .eslintrc-auto-import.json defined rules, merge them here:
      // ...autoImportConfig.rules,
    },
  },

  // Potentially add a separate config object for the auto-import JSON if it's complex,
  // but often it just defines globals which can be merged as shown above.
  // If './.eslintrc-auto-import.json' is essential and complex,
  // you might need a compatibility tool or manual conversion.
  // For now, we've removed the direct extension.
);
