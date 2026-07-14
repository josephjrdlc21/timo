import { createApiClient } from "@timo/common";

export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  getToken: () => localStorage.getItem("admin_token"),
  onUnauthorized: () => {
    window.location.assign("/login");
  },
});
