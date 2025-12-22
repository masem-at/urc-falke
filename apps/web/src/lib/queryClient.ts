import { QueryClient } from '@tanstack/react-query';

// ============================================================================
// TANSTACK QUERY CLIENT
// ============================================================================
//
// ARCHITECTURE NOTE: Centralized QueryClient configuration
// - staleTime: 5 minutes default
// - retry: 1 for network errors
// - refetchOnWindowFocus: true for data freshness
//
// ============================================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});
