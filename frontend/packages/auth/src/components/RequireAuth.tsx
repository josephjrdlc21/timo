import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface RequireAuthProps {
  children: ReactNode;
  /** Rendered while the boot-time session restore is still in flight. */
  pending?: ReactNode;
  /** Rendered when there is no session — e.g. a <Navigate to="/login" />. */
  fallback?: ReactNode;
  /** When set, the user must hold at least one of these roles. */
  roles?: string[];
  /** Rendered when authenticated but lacking a required role. Defaults to `fallback`. */
  forbidden?: ReactNode;
}

/**
 * Router-agnostic guard: it decides *what* to render, and the app decides how
 * redirecting looks. Keeps this package free of a react-router dependency.
 */
export function RequireAuth({
  children,
  pending = null,
  fallback = null,
  roles,
  forbidden,
}: RequireAuthProps) {
  const { status, hasRole } = useAuth();

  if (status === "loading") return <>{pending}</>;
  if (status !== "authenticated") return <>{fallback}</>;

  if (roles?.length && !roles.some(hasRole)) {
    return <>{forbidden ?? fallback}</>;
  }

  return <>{children}</>;
}
