import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, ApiError, type OnboardExistingResponse } from '../../../lib/api';

// ============================================================================
// useOnboardExisting Hook (TanStack Query)
// ============================================================================
//
// ARCHITECTURE NOTE: Token-based auto-login for Track A users
// - Validates onboarding token from QR code
// - Sets JWT cookie on success
// - Returns redirect path for next step (set-password)
//
// ============================================================================

export interface UseOnboardExistingOptions {
  onSuccess?: (data: OnboardExistingResponse) => void;
  onError?: (error: ApiError) => void;
}

export function useOnboardExisting(options: UseOnboardExistingOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authApi.onboardExisting(token),
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
