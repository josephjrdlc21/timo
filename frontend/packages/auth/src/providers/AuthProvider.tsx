import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AxiosInstance } from "@timo/common";
import { createAuthApi } from "../api";
import { clearAccessToken, setAccessToken } from "../lib/tokenStore";
import type { AuthStatus, AuthUser, Credentials } from "../types";
import { AuthContext, type AuthContextValue } from "../context/authContext";

interface AuthProviderProps {
  /** The app's axios instance (from createApiClient). */
  client: AxiosInstance;
  children: ReactNode;
}

export function AuthProvider({ client, children }: AuthProviderProps) {
  const api = useMemo(() => createAuthApi(client), [client]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // On boot, try to trade the httpOnly refresh cookie for an access token.
  // Failure here is the normal "not logged in" path, not an error worth surfacing.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      try {
        const token = await api.refresh();
        if (cancelled) return;
        setAccessToken(token);

        const currentUser = await api.me();
        if (cancelled) return;
        setUser(currentUser);
        setStatus("authenticated");
      } catch {
        if (cancelled) return;
        clearAccessToken();
        setUser(null);
        setStatus("unauthenticated");
      }
    }

    void restore();
    return () => {
      cancelled = true;
    };
  }, [api]);

  const login = useCallback(
    async (credentials: Credentials) => {
      const { accessToken, user: loggedIn } = await api.login(credentials);
      setAccessToken(accessToken);
      setUser(loggedIn);
      setStatus("authenticated");
      return loggedIn;
    },
    [api],
  );

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      // Drop local session even if the server call fails — otherwise a network
      // blip would strand the user in a logged-in UI.
      clearAccessToken();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, [api]);

  const hasRole = useCallback((role: string) => user?.roles.includes(role) ?? false, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      login,
      logout,
      hasRole,
    }),
    [user, status, login, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
