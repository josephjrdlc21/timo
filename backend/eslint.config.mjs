import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    // Global ignores. Generated Prisma client is not ours to lint.
    ignores: [
      "**/dist/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/*.tsbuildinfo",
      "src/generated/**",
    ],
  },

  // Base JS + TypeScript recommended rules for all source files (Node/Express)
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // Test files: allow vitest globals alongside node
  {
    files: ["**/*.{test,spec}.ts", "**/test/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Config files run in Node
  {
    files: ["**/*.config.{ts,mts,js,mjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Turn off formatting-related rules that Prettier owns. Must be last.
  eslintConfigPrettier,
);
