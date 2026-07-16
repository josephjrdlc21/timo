import { createContext } from "react";
import type { AuthStatus, AuthUser, Credentials } from "../types";

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
