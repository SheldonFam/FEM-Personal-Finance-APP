import { QueryClient, environmentManager } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, a staleTime above 0 stops every hydrated query from
        // refetching the moment it reaches the client.
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * The pattern from TanStack Query's App Router guide.
 *
 * On the server every request gets its own client, so cached data is never
 * shared between users. In the browser one client lives for the page: if
 * React discards the first render (something suspends with no boundary in
 * between), a client held in useState would be discarded with it, taking
 * the cache along. A module-level singleton survives that.
 */
export function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
