import { createContext } from "react";
import type { Theme, ThemePreference } from "../themes";

export interface ThemeContextValue {
  /** What the user picked — may be "system". */
  preference: ThemePreference;
  /** The theme actually on the document, with "system" already resolved. */
  resolvedTheme: Theme;
  setPreference: (preference: ThemePreference) => void;
  /** Flips between light and dark, pinning the result (never leaves it on "system"). */
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
