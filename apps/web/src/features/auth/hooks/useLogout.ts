import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, ApiError } from '../../../lib/api';

// ============================================================================
// useLogout Hook (TanStack Query)
// ============================================================================
//
// ARCHITECTURE NOTE: Logout mutation
// - Clears JWT cookie via API call
// - Invalidates all queries to reset app state
// - Typically redirect to login page after success
//
// ============================================================================

export interface UseLogoutOptions {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

export function useLogout(options: UseLogoutOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all cached queries
      queryClient.clear();
      options.onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        options.onError?.(error);
      }
    },
  });
}
