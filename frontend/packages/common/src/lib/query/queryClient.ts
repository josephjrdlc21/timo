import { QueryClient } from "@tanstack/react-query";

/**
 * Factory for a QueryClient with defaults shared across both apps.
 * Call once per app and pass to QueryClientProvider.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}
