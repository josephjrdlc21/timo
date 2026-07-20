import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_PREFERENCE,
  THEME_STORAGE_KEY,
  isThemePreference,
  type Theme,
  type ThemePreference,
} from "../themes";
import { ThemeContext, type ThemeContextValue } from "../context/themeContext";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function prefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(DARK_QUERY).matches;
}

function readStoredPreference(fallback: ThemePreference): ThemePreference {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : fallback;
  } catch {
    // Private mode / disabled storage — fall back rather than break render.
    return fallback;
  }
}

interface ThemeProviderProps {
  children: ReactNode;
  /** Used when nothing is stored yet. Defaults to following the OS. */
  defaultPreference?: ThemePreference;
}

export function ThemeProvider({
  children,
  defaultPreference = DEFAULT_PREFERENCE,
}: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readStoredPreference(defaultPreference),
  );
  const [systemDark, setSystemDark] = useState(prefersDark);

  // The OS setting is the only external state worth storing; the resolved theme
  // is derived from it below rather than held in a second piece of state.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme: Theme = useMemo(() => {
    if (preference !== "system") return preference;
    return systemDark ? "timo-dark" : "timo-light";
  }, [preference, systemDark]);

  // Push the resolved theme onto <html>, which is where daisyUI reads it from.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Persistence is best-effort; the in-memory choice still applies.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference(resolvedTheme === "timo-dark" ? "timo-light" : "timo-dark");
  }, [resolvedTheme, setPreference]);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, resolvedTheme, setPreference, toggleTheme }),
    [preference, resolvedTheme, setPreference, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
