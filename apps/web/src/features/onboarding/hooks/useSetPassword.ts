import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, ApiError, type SetPasswordInput, type SetPasswordResponse } from '../../../lib/api';

// ============================================================================
// useSetPassword Hook (TanStack Query)
// ============================================================================
//
// ARCHITECTURE NOTE: Password setting for Track A users during onboarding
// - Clears onboarding token (single-use)
// - Updates onboarding_status: pre_seeded → password_changed
// - Returns redirect path for next step (complete-profile)
//
// ============================================================================

export interface UseSetPasswordOptions {
  onSuccess?: (data: SetPasswordResponse) => void;
  onError?: (error: ApiError) => void;
}

export function useSetPassword(options: UseSetPasswordOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SetPasswordInput) => userApi.setPassword(input),
    onSuccess: (data) => {
      // Invalidate auth query to refetch current user
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      options.onSuccess?.(data);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        options.onError?.(error);
      }
    },
  });
}
