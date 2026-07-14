/**
 * Shared Prettier config for the whole TIMO repo (backend + frontend).
 * Prettier resolves this by walking up from each file, so both projects use it
 * without needing their own copy. Keep this as the single source of truth.
 *
 * @type {import('prettier').Config}
 */
export default {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  arrowParens: "always",
  endOfLine: "lf",
};
