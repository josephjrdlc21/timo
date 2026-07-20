/**
 * Access token held in memory only — never localStorage/sessionStorage, so an
 * injected script cannot read it back out. Session survival across reloads is
 * the httpOnly refresh cookie's job, not this module's.
 */
let accessToken: string | null = null;

type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  for (const listener of listeners) listener(token);
}

export function clearAccessToken(): void {
  setAccessToken(null);
}

/** Subscribe to token changes. Returns an unsubscribe function. */
export function onAccessTokenChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
