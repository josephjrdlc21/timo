import { parseResponse, type AxiosInstance } from "@timo/common";
import {
  authUserSchema,
  loginResponseSchema,
  refreshResponseSchema,
  type AuthUser,
  type Credentials,
  type LoginResponse,
} from "../types";

/**
 * Auth endpoints, bound to an app-supplied axios instance.
 *
 * Every call must send the refresh cookie, hence `withCredentials`. The apps'
 * base client does not set it globally, so it is opted into per request here.
 */
export function createAuthApi(client: AxiosInstance) {
  return {
    async login(credentials: Credentials): Promise<LoginResponse> {
      const response = await client.post("/auth/login", credentials, { withCredentials: true });
      return parseResponse(loginResponseSchema, response.data);
    },

    async logout(): Promise<void> {
      await client.post("/auth/logout", undefined, { withCredentials: true });
    },

    /** Exchanges the httpOnly refresh cookie for a new access token. */
    async refresh(): Promise<string> {
      const response = await client.post("/auth/refresh", undefined, { withCredentials: true });
      return parseResponse(refreshResponseSchema, response.data).accessToken;
    },

    async me(): Promise<AuthUser> {
      const response = await client.get("/auth/me");
      return parseResponse(authUserSchema, response.data);
    },
  };
}

export type AuthApi = ReturnType<typeof createAuthApi>;
