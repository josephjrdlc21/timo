/** Who the presented access token says the caller is. Set by `requireAuth`. */
export interface AuthContext {
  userId: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      /** Present only after `requireAuth` has run and accepted the request. */
      auth?: AuthContext;
    }
  }
}
