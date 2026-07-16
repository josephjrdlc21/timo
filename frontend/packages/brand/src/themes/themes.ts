/** Theme names as registered with daisyUI in styles/theme.css. */
export const THEMES = ["timo-light", "timo-dark"] as const;

export type Theme = (typeof THEMES)[number];

/** What a user can choose: a concrete theme, or defer to the OS setting. */
export type ThemePreference = Theme | "system";

export const DEFAULT_PREFERENCE: ThemePreference = "system";

/** localStorage key holding the user's preference. */
export const THEME_STORAGE_KEY = "timo.theme";

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || isTheme(value);
}
