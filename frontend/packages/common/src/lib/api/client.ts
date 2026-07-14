import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

export interface ApiClientOptions {
  /** Base URL for the API, typically from an env var (e.g. import.meta.env.VITE_API_URL). */
  baseURL: string;
  /** Optional callback returning the current auth token; attached as a Bearer header. */
  getToken?: () => string | null | undefined;
  /** Optional handler invoked on 401 responses (e.g. redirect to login). */
  onUnauthorized?: () => void;
}

/**
 * Creates a preconfigured axios instance shared by both apps.
 * Each app calls this once with its own baseURL / auth strategy.
 */
export function createApiClient(options: ApiClientOptions): AxiosInstance {
  const instance = axios.create({
    baseURL: options.baseURL,
    headers: { "Content-Type": "application/json" },
    timeout: 30_000,
  });

  instance.interceptors.request.use((config) => {
    const token = options.getToken?.();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        options.onUnauthorized?.();
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

export type { AxiosInstance, AxiosRequestConfig };
